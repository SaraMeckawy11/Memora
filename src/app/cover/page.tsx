'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadProject } from '@/app/utils/storage'
import { SIZES } from '@/features/project-setup/components/SizeSelection'
import FontLoader from '@/features/editor/components/cover-editor/FontLoader'

// Hooks
import { useCanvasState } from './hooks/useCanvasState'
import { useExport } from './hooks/useExport'
import { useProjectPersistence } from './hooks/useProjectPersistence'
import { COVER_MODE_KEY } from './coverStorage'

// Components
import CoverCanvas from './components/CoverCanvas'
import { PresetTextPanel, CustomCoverPanel } from './components/CoverPanels'

// Styles
import '@/styles/memora.css'
import '@/styles/cover-editor/simple.css'

type CoverMode = 'preset' | 'custom'

function CoverEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mode, setMode] = useState<CoverMode>('custom')
  const [selectedElId, setSelectedElId] = useState<string | number | null>(null)
  const [canvasSettings, setCanvasSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  // This page is fully client-driven (localStorage, canvas) — render nothing
  // during SSR/hydration so server and client markup can't disagree
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const effectiveCanvasSettings = canvasSettings || { width: 794, height: 1123, sizeName: 'A4', orientation: 'portrait' }

  const {
    front, back, activeSide, setActiveSide,
    elements, backgroundColor, setElements,
    handleUndo, handleRedo, historyIndex, historyLength, updateState, currentState,
  } = useCanvasState(searchParams, effectiveCanvasSettings, setCanvasSettings)

  const { isExporting, handleDownload } = useExport(null, () => {}, backgroundColor, activeSide)

  const {
    handleLoadProject, handleResetProject, flushSave, setIsAutoSaveEnabled,
  } = useProjectPersistence(currentState, effectiveCanvasSettings, updateState, setCanvasSettings, mode)

  const currentStateRef = useRef(currentState)
  currentStateRef.current = currentState

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    const initLayout = async () => {
      try {
        setLoading(true)
        const presetRequested = Boolean(searchParams.get('preset'))
        const customRequested = Boolean(searchParams.get('custom'))
        const savedMode = localStorage.getItem(COVER_MODE_KEY)

        // Explicit choices win: ?preset opens that design in text-edit mode,
        // ?custom opens the builder. Plain /cover reopens whatever was saved.
        // (The mode key is written on SAVE, not here — writing it during load
        // would corrupt the decision when React re-runs this effect in dev.)
        let resolvedMode: CoverMode
        if (presetRequested) resolvedMode = 'preset'
        else if (customRequested) resolvedMode = 'custom'
        else resolvedMode = savedMode === 'preset' ? 'preset' : 'custom'
        setMode(resolvedMode)

        // A freshly picked preset must not be clobbered by an old save, and
        // "create custom cover" only restores a previous CUSTOM draft.
        const shouldLoadSaved = !presetRequested && (!customRequested || savedMode !== 'preset')
        const hasSavedProject = shouldLoadSaved ? handleLoadProject() : false

        if (!hasSavedProject) {
          // Canvas size comes from the book size chosen in the create flow
          const project = await loadProject()
          let sizeData = project?.selectedSize
          if (typeof sizeData === 'number' || typeof sizeData === 'string') {
            const found = SIZES.find(s => s.id == sizeData)
            if (found) sizeData = found
          }
          if (sizeData && sizeData.width && sizeData.height) {
            const { width, height, name } = sizeData
            const pxScale = 96
            setCanvasSettings({
              width: Math.round(width * pxScale),
              height: Math.round(height * pxScale),
              sizeName: name || 'Custom',
              orientation: width > height ? 'landscape' : 'portrait',
            })
          } else {
            setCanvasSettings({ width: 794, height: 1123, sizeName: 'A4', orientation: 'portrait' })
          }
        }
      } catch (err) {
        console.error('Failed to load project layout:', err)
        setCanvasSettings(prev => prev || { width: 794, height: 1123, sizeName: 'A4', orientation: 'portrait' })
      } finally {
        setLoading(false)
        // Only enable auto-save after initial project loading is complete
        setIsAutoSaveEnabled(true)
      }
    }
    initLayout()
  }, [])

  /* ---------- HISTORY SESSIONS ----------
     Continuous edits (typing, dragging a slider/color/element) collapse into
     one undo step: the first change in a session pushes, follow-ups replace
     the tip. */
  const lastEditRef = useRef({ key: null as string | null, at: 0 })
  const sessionHistoryMode = (sessionKey: string) => {
    const now = Date.now()
    const same = lastEditRef.current.key === sessionKey && now - lastEditRef.current.at < 1200
    lastEditRef.current = { key: sessionKey, at: now }
    return same ? { historyMode: 'replace' as const } : {}
  }
  const editElements = (updater: (prev: any[]) => any[], sessionKey: string) => {
    setElements(updater, sessionHistoryMode(sessionKey))
  }

  /* ---------- PRESET MODE: text-only editing ---------- */
  const textElements = [...elements]
    .filter(el => el.type === 'text')
    .sort((a, b) => (a.y || 0) - (b.y || 0))

  const changeTextContent = (id: string | number, value: string) => {
    editElements(
      prev => prev.map(el => (el.id === id ? { ...el, content: value } : el)),
      `text-${id}-${activeSide}`,
    )
  }

  const selectTextFromCanvas = (id: string | number) => {
    setSelectedElId(id)
    const input = document.getElementById(`cover-text-${id}`) as HTMLTextAreaElement | null
    if (input) {
      input.focus()
      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  /* ---------- CUSTOM MODE: element builder ----------
     Works like the text-page editor: add text boxes and photos, select one
     to edit it, drag it on the cover to position it. */
  const W = effectiveCanvasSettings.width
  const H = effectiveCanvasSettings.height

  const makeTextElement = (content = 'New text', overrides: any = {}) => ({
    id: `text-${Date.now()}`,
    type: 'text',
    content,
    x: W * 0.15,
    y: H * 0.4,
    width: W * 0.7,
    height: H * 0.1,
    fontSize: 40,
    fontFamily: 'Playfair Display',
    color: '#141414',
    textAlign: 'center',
    lineHeight: 1.2,
    rotation: 0,
    opacity: 100,
    zIndex: 2,
    ...overrides,
  })

  // Seed a starter title on the front so a blank custom cover isn't empty.
  // Waits out the delayed project restore (100ms) before deciding.
  const seededRef = useRef(false)
  useEffect(() => {
    if (loading || mode !== 'custom' || seededRef.current) return
    const t = setTimeout(() => {
      seededRef.current = true
      const state = currentStateRef.current
      if ((state?.front?.elements?.length || 0) === 0 && (state?.back?.elements?.length || 0) === 0) {
        updateState({
          front: {
            elements: [makeTextElement('Your Title', { y: H * 0.32, height: H * 0.14, fontSize: 64 })],
            backgroundColor: '#FAF8F5',
          },
          back: { elements: [], backgroundColor: '#FAF8F5' },
        }, true)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [loading, mode])

  const addTextElement = () => {
    const el = makeTextElement()
    editElements(prev => [...prev, { ...el, zIndex: prev.length + 2 }], `add-${el.id}`)
    setSelectedElId(el.id)
  }

  const addPhotoElement = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      const src = event.target?.result
      if (!src) return
      // Read natural dimensions so the photo lands with its true aspect ratio
      const probe = new window.Image()
      probe.onload = () => {
        const width = W * 0.6
        const ratio = probe.naturalHeight / (probe.naturalWidth || 1)
        const height = Math.min(H * 0.7, width * (ratio || 1))
        const id = `photo-${Date.now()}`
        editElements(prev => [...prev, {
          id,
          type: 'image',
          src,
          x: (W - width) / 2,
          y: (H - height) / 2,
          width,
          height,
          rotation: 0,
          opacity: 100,
          zIndex: prev.length + 2,
          options: { objectFit: 'cover' },
        }], `add-${id}`)
        setSelectedElId(id)
      }
      probe.src = src
    }
    reader.readAsDataURL(file)
  }

  const replacePhotoElement = (id: string | number, file: File) => {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      const src = event.target?.result
      if (!src) return
      editElements(prev => prev.map(el => (el.id === id ? { ...el, src } : el)), `replace-${id}-${Date.now()}`)
    }
    reader.readAsDataURL(file)
  }

  const removeElement = (id: string | number) => {
    editElements(prev => prev.filter(el => el.id !== id), `remove-${id}-${Date.now()}`)
    if (selectedElId === id) setSelectedElId(null)
  }

  const patchElement = (id: string | number, patch: any, sessionKey: string) => {
    editElements(prev => prev.map(el => (el.id === id ? { ...el, ...patch } : el)), `${sessionKey}-${activeSide}`)
  }

  const moveElement = (id: string | number, x: number, y: number) => {
    editElements(prev => prev.map(el => (el.id === id ? { ...el, x, y } : el)), `move-${id}`)
  }

  const handleBackground = (color: string) => {
    updateState(
      {
        ...currentState,
        [activeSide]: { ...currentState[activeSide], backgroundColor: color },
      },
      sessionHistoryMode(`bg-${activeSide}`).historyMode === 'replace' ? 'replace' : false,
    )
  }

  /* ---------- NAV ---------- */
  const handleDone = () => {
    // Save immediately — the debounced autosave may still be pending
    flushSave()
    router.push('/create?step=3')
  }

  if (!mounted) return null

  return (
    <div className="memora-root simple-cover-root">
      <FontLoader />

      <header className="simple-cover-header">
        <div className="header-group">
          <button className="simple-btn simple-btn--ghost" onClick={() => router.push('/select-cover')} type="button">
            ← Back
          </button>
          <h1 className="simple-cover-title hide-mobile-title">
            {mode === 'preset' ? 'Your Cover' : 'Custom Cover'}
          </h1>
        </div>

        <div className="header-group">
          <div className="simple-side-switch" role="tablist" aria-label="Cover side">
            <button
              type="button"
              className={activeSide === 'front' ? 'active' : ''}
              onClick={() => { setActiveSide('front'); setSelectedElId(null) }}
            >
              front
            </button>
            <button
              type="button"
              className={activeSide === 'back' ? 'active' : ''}
              onClick={() => { setActiveSide('back'); setSelectedElId(null) }}
            >
              back
            </button>
          </div>
        </div>

        <div className="header-group">
          <button className="simple-icon-btn" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button className="simple-icon-btn" onClick={handleRedo} disabled={historyIndex >= historyLength - 1} title="Redo" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"/></svg>
          </button>
          <button
            className="simple-btn simple-btn--ghost"
            onClick={() => handleDownload('png')}
            disabled={isExporting}
            type="button"
          >
            {isExporting ? 'Exporting…' : 'Download'}
          </button>
          <button className="simple-btn simple-btn--primary" onClick={handleDone} type="button">
            Done
          </button>
        </div>
      </header>

      {loading ? (
        <div className="simple-cover-loading">Preparing your cover…</div>
      ) : (
        <div className="simple-cover-body">
          <CoverCanvas
            side={activeSide}
            elements={elements}
            backgroundColor={backgroundColor}
            canvasSettings={effectiveCanvasSettings}
            selectableText={mode === 'preset'}
            interactive={mode === 'custom'}
            selectedId={selectedElId}
            onSelectText={selectTextFromCanvas}
            onSelectElement={setSelectedElId}
            onMoveElement={moveElement}
          />

          {mode === 'preset' ? (
            <PresetTextPanel
              texts={textElements}
              selectedId={selectedElId}
              onSelect={setSelectedElId}
              onChangeText={changeTextContent}
            />
          ) : (
            <CustomCoverPanel
              side={activeSide}
              elements={elements}
              selectedId={selectedElId}
              onSelect={setSelectedElId}
              onAddText={addTextElement}
              onAddPhoto={addPhotoElement}
              onReplacePhoto={replacePhotoElement}
              onRemoveElement={removeElement}
              onPatchElement={patchElement}
              backgroundColor={backgroundColor}
              onBackground={handleBackground}
              onReset={() => {
                seededRef.current = false
                handleResetProject()
              }}
              canvasWidth={W}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default function CoverEditorPage() {
  return (
    <Suspense fallback={<div className="simple-cover-loading">Loading editor…</div>}>
      <CoverEditorContent />
    </Suspense>
  )
}
