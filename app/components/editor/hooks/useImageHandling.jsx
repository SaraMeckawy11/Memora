export function useImageHandling(
  pages,
  setPages,
  currentPageIdx,
  setUploadedImages,
  currentLayoutObj,
  getMaxImages,
  setSelectedSlotIdx
) {
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const MAX_FILE_MB = 50
    const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

    // 1. Prepare optimistic entries
    const optimisticImages = []
    const filesToUpload = []

    files.forEach((file) => {
      // Validate file
      if (file.size > MAX_FILE_BYTES) {
        console.warn(`File ${file.name} too large`)
        return
      }
      if (!file.type.startsWith('image/')) {
        console.warn(`File ${file.name} is not an image`)
        return
      }

      // Generate temp ID and Blob URL
      const tempId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const objectUrl = URL.createObjectURL(file)

      const imgObj = {
        id: tempId,
        src: objectUrl,
        thumbSrc: objectUrl,
        width: 1000, 
        height: 1000,
        name: file.name,
        isCloudinary: false,
        isUploading: true, 
      }

      optimisticImages.push(imgObj)
      filesToUpload.push({ file, tempId })
    })

    if (!optimisticImages.length) {
      e.target.value = ''
      return
    }

    // 2. Show immediately
    setUploadedImages((prev) => [...prev, ...optimisticImages])
    e.target.value = ''

    // 3. Background upload
    // We process these in parallel without blocking the UI
    // First, fetch a signature to upload directly to Cloudinary
    let signatureData = null;
    try {
      const signRes = await fetch('/api/cloudinary/sign');
      if (!signRes.ok) throw new Error('Failed to get upload signature');
      signatureData = await signRes.json();
    } catch (err) {
      console.error('Signature fetch error:', err);
      // Mark all as error
      setUploadedImages((prev) =>
        prev.map((img) => optimisticImages.some(o => o.id === img.id) ? { ...img, isError: true, isUploading: false } : img)
      );
      return;
    }

    filesToUpload.forEach(async ({ file, tempId }) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', signatureData.api_key);
        formData.append('timestamp', signatureData.timestamp);
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);
        // Append tags for automated cleanup
        if (signatureData.tags) {
            formData.append('tags', signatureData.tags);
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`;

        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error?.message || 'Upload failed');
        }
        
        const data = await res.json()

        const secureUrl = data.secure_url
        // Optimized thumbnail for sidebar
        const thumbUrl = secureUrl.replace(
          '/upload/',
          '/upload/w_256,h_256,c_limit,q_auto,f_auto/'
        )

        // 4. Update the state with real URL (keep the tempId as the stable ID)
        setUploadedImages((prev) =>
          prev.map((img) => {
            if (img.id === tempId) {
              return {
                ...img,
                src: secureUrl,
                thumbSrc: thumbUrl,
                width: data.width,
                height: data.height,
                isCloudinary: true,
                isUploading: false,
                cloudinaryPublicId: data.public_id,
              }
            }
            return img
          })
        )
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err)
        // Mark as error in UI
        setUploadedImages((prev) =>
          prev.map((img) => {
            if (img.id === tempId) {
              return { ...img, isError: true, isUploading: false }
            }
            return img
          })
        )
      }
    })
  }

  const addImageToPage = (imageId, selectedSlotIdx) => {
    if (selectedSlotIdx === null) return

    const newPages = [...pages]
    const page = newPages[currentPageIdx] || {}
    const max = getMaxImages(currentLayoutObj)

    const imgs = [...(Array.isArray(page.images) ? page.images : [])]
    while (imgs.length < max) imgs.push(null)

    imgs[selectedSlotIdx] = imageId
    newPages[currentPageIdx] = { ...page, images: imgs }

    setPages(newPages)
    setSelectedSlotIdx(null)
  }

  const removeImageFromPage = (imageId) => {
    const newPages = [...pages]
    const page = newPages[currentPageIdx] || {}
    const imgs = [...(Array.isArray(page.images) ? page.images : [])]
    const idx = imgs.indexOf(imageId)
    if (idx !== -1) imgs[idx] = null
    newPages[currentPageIdx] = { ...page, images: imgs }
    setPages(newPages)
    setSelectedSlotIdx(null)
  }

  const swapSlots = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return

    const max = getMaxImages(currentLayoutObj)
    const newPages = [...pages]
    const page = { ...(newPages[currentPageIdx] || {}) }
    const imgs = [...(Array.isArray(page.images) ? page.images : [])]
    while (imgs.length < max) imgs.push(null)

    const tmp = imgs[fromIdx]
    imgs[fromIdx] = imgs[toIdx]
    imgs[toIdx] = tmp

    page.images = imgs
    newPages[currentPageIdx] = page
    setPages(newPages)
  }

  return {
    handleImageUpload,
    addImageToPage,
    removeImageFromPage,
    swapSlots,
  }
}
