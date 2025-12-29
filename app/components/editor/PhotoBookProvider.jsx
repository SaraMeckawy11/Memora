'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const PhotoBookContext = createContext(null)

// Simple in-memory state management (replaces State.js for React)
class PhotoBookState {
  constructor() {
    this.data = {}
    this.listeners = {}
  }

  get(key, defaultValue = null) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue
  }

  set(key, value) {
    const oldValue = this.data[key]
    this.data[key] = value
    if (oldValue !== value && this.listeners[key]) {
      this.listeners[key].forEach(cb => cb(value, oldValue))
    }
  }

  subscribe(key, callback) {
    if (!this.listeners[key]) this.listeners[key] = []
    this.listeners[key].push(callback)
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback)
    }
  }

  getAll() {
    return { ...this.data }
  }
}

// Simple event bus
class PhotoBookEventBus {
  constructor() {
    this.events = {}
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = []
    this.events[event].push(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  }

  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(cb => cb(data))
  }

  once(event, callback) {
    const wrapper = (data) => {
      callback(data)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }
}

// Configuration (from Config.js)
const Config = {
  PAGE_SIZES: {
    A4: { width: 2480, height: 3508 },
    A5: { width: 1748, height: 2480 }
  },
  CAPTION_AREA_HEIGHT: 150,
  DEFAULT_CAPTION_STYLE: {
    font_family_name: 'Arial',
    font_size: 70,
    font_color: '#000000',
    shadow_color: '#ffffff'
  },
  DEFAULT_CONFIG: {
    page_size: 'A4',
    margin: 100,
    gutter: 40,
    fill_mode: 'fill'
  },
  LAYOUTS: {
    '1 Image (Full)': { capacity: 1 },
    '2 Images (Vertical Stack)': { capacity: 2 },
    '3 Images (Mixed)': { capacity: 3 },
    '4 Images (Grid)': { capacity: 4 },
    '6 Images (Grid)': { capacity: 6 }
  }
}

// Provider component
export function PhotoBookProvider({ children }) {
  const [state] = useState(() => new PhotoBookState())
  const [eventBus] = useState(() => new PhotoBookEventBus())
  const [isLoaded, setIsLoaded] = useState(true)

  // Initialize with defaults
  useEffect(() => {
    state.set('config', Config.DEFAULT_CONFIG)
    state.set('pages', [])
    state.set('currentPageIndex', 0)
    state.set('theme', null)
  }, [state])

  const value = {
    state,
    eventBus,
    isLoaded,
    Config,
    // Helper methods
    addPage: useCallback((pageData = {}) => {
      const pages = state.get('pages', [])
      const newPage = {
        id: Date.now(),
        images: [],
        caption_text: '',
        has_caption: false,
        caption_style: Config.DEFAULT_CAPTION_STYLE,
        ...pageData
      }
      state.set('pages', [...pages, newPage])
      eventBus.emit('page-added', newPage)
      return newPage
    }, [state, eventBus]),

    removePage: useCallback((pageId) => {
      const pages = state.get('pages', []).filter(p => p.id !== pageId)
      state.set('pages', pages)
      eventBus.emit('page-removed', pageId)
    }, [state, eventBus]),

    updatePage: useCallback((pageId, updates) => {
      const pages = state.get('pages', []).map(p =>
        p.id === pageId ? { ...p, ...updates } : p
      )
      state.set('pages', pages)
      eventBus.emit('page-updated', { pageId, updates })
    }, [state, eventBus]),

    setTheme: useCallback((theme) => {
      state.set('theme', theme)
      eventBus.emit('theme-changed', theme)
    }, [state, eventBus]),

    setCurrentPage: useCallback((index) => {
      state.set('currentPageIndex', index)
      eventBus.emit('page-changed', index)
    }, [state, eventBus])
  }

  return (
    <PhotoBookContext.Provider value={value}>
      {children}
    </PhotoBookContext.Provider>
  )
}

// Hook to use PhotoBook context
export function usePhotoBook() {
  const context = useContext(PhotoBookContext)
  if (!context) {
    throw new Error('usePhotoBook must be used within PhotoBookProvider')
  }
  return context
}
