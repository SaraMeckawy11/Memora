// Shared access to the saved cover design ('memoraCoverProject').
// The cover editor writes it (useProjectPersistence); review and checkout read it
// so the designed cover actually reaches the order.

export const COVER_STORAGE_KEY = 'memoraCoverProject'

export interface SavedCoverDesign {
  front: { elements: any[]; backgroundColor: string }
  back: { elements: any[]; backgroundColor: string }
  canvasSettings?: any
  version?: string
  updatedAt?: string
}

export function loadCoverDesign(): SavedCoverDesign | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(COVER_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.front) return null
    return data
  } catch {
    return null
  }
}

export function hasCoverDesign(): boolean {
  const design = loadCoverDesign()
  if (!design) return false
  return (
    (design.front?.elements?.length ?? 0) > 0 ||
    (design.back?.elements?.length ?? 0) > 0
  )
}
