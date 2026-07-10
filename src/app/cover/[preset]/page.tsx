'use client'
// Legacy route: the standalone per-preset cover pages were prototypes that were
// never linked from the flow (select-cover navigates to /cover?preset=X).
// Redirect deep links into the real cover editor so no one lands on a dead end.
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { COVER_PRESETS } from '../presets'

export default function CustomCoverPage({ params }: { params: { preset?: string } }) {
  const router = useRouter()
  const preset = params?.preset

  useEffect(() => {
    if (preset && COVER_PRESETS[preset]) {
      router.replace(`/cover?preset=${encodeURIComponent(preset)}`)
    } else {
      router.replace('/select-cover')
    }
  }, [preset, router])

  return null
}
