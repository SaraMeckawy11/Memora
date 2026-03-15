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

    // Use smaller batches for upload
    const BATCH_SIZE = 3 

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)

      // Create placeholder entries first for optimistic UI (optional, but good UX)
      // For now, we wait for upload to complete to avoid complexity with replacing IDs
      // but in a real-world app you'd add a "loading" state.

      const uploaded = await Promise.all(
        batch.map(async (file) => {
          if (file.size > MAX_FILE_BYTES) return null
          if (!file.type.startsWith('image/')) return null

          try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/cloudinary/upload', {
              method: 'POST',
              body: formData
            })

            if (!res.ok) throw new Error('Upload failed')
            const data = await res.json()

            if (!data.success) throw new Error(data.error)

            // Construct secure URLs with transformations if needed
            // Cloudinary supports on-the-fly transformations
            // Add f_auto,q_auto for optimization
            const secureUrl = data.secure_url;
            
            // Create a small thumbnail URL
            // replace /upload/ with /upload/w_256,h_256,c_limit/ to save bandwidth in the sidebar
            const thumbUrl = secureUrl.replace('/upload/', '/upload/w_256,h_256,c_limit,q_auto,f_auto/')
            
            // Generate a robust ID, prefer public_id if available
            // Ensure ID is a string to avoid type coercion issues later
            const id = data.public_id || String(Date.now() + Math.random())

            return {
              id: id,
              src: secureUrl, // Use the full resolution URL for the canvas
              thumbSrc: thumbUrl, // Use optimized URL for sidebar
              width: data.width,
              height: data.height,
              name: file.name,
              isCloudinary: true // Flag to help SaveManager know not to blob-ify this
            }
          } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err)
            // Could return an error placeholder here
            return null
          }
        })
      )

      const cleaned = uploaded.filter(Boolean)
      if (cleaned.length) {
        setUploadedImages(prev => [...prev, ...cleaned])
      }
    }

    e.target.value = ''
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
