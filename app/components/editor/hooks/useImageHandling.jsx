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

    const createThumbnail = (file, maxSize = 256) =>
      new Promise((resolve) => {
        const img = new Image()
        const tmpUrl = URL.createObjectURL(file)

        img.onload = () => {
          const w = img.naturalWidth || 0
          const h = img.naturalHeight || 0
          const scale = Math.min(1, maxSize / Math.max(w || 1, h || 1))
          const tw = Math.max(1, Math.round(w * scale))
          const th = Math.max(1, Math.round(h * scale))

          const canvas = document.createElement('canvas')
          canvas.width = tw
          canvas.height = th
          const ctx = canvas.getContext('2d')
          if (ctx) ctx.drawImage(img, 0, 0, tw, th)

          URL.revokeObjectURL(tmpUrl)
          resolve({
            thumbSrc: ctx ? canvas.toDataURL('image/jpeg', 0.72) : null,
            width: w,
            height: h,
          })
        }

        img.onerror = () => {
          URL.revokeObjectURL(tmpUrl)
          resolve({ thumbSrc: null, width: null, height: null })
        }

        img.src = tmpUrl
      })

    const BATCH_SIZE = 10

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE)

      const prepared = await Promise.all(
        batch.map(async (file) => {
          if (file.size > MAX_FILE_BYTES) return null
          if (!file.type.startsWith('image/')) return null

          const src = URL.createObjectURL(file)
          const { thumbSrc, width, height } = await createThumbnail(file, 256)

          return {
            id: Date.now() + Math.random(),
            src,
            thumbSrc,
            width,
            height,
            name: file.name,
          }
        })
      )

      const cleaned = prepared.filter(Boolean)
      if (cleaned.length) {
        setUploadedImages(prev => [...prev, ...cleaned])
      }

      await new Promise(r => setTimeout(r, 0))
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
