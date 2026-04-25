import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState = {
  step: 1,
  selectedProduct: null,
  selectedSize: null,
  pageCount: 10,
  
  // Project Content
  pages: [],
  currentPageIdx: 0,
  uploadedImages: [],
  
  // Theme & Grid Settings (Global Defaults)
  pageMargin: 16,
  pageGutter: 16,
  pageBgColor: '#ffffff',
  imageFitMode: 'cover',
  imageBorderRadius: 0,
  showPageNumbers: false,
  
  // Editor UI State
  isSidebarOpen: false,
  autoSave: true,
  
  // Active Element Settings
  selectedCaption: '',
  selectedFontSize: 9,
  selectedFontColor: '#000000',
  selectedFontFamily: 'Inter',
  captionPosition: 'bottom',
  captionAlignment: 'center',
  selectedLayout: 'single',
  
  // History for Undo/Redo
  history: [],
  historyIndex: -1,
};

export const useProjectStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // --- WIZARD ACTIONS ---
      setStep: (step) => set({ step }),
      setProjectDetails: (details) => set((s) => ({ ...s, ...details })),
      setSelectedProduct: (id) => set({ selectedProduct: id }),
      setSelectedSize: (id) => set({ selectedSize: id }),
      
      // --- PAGE OPERATIONS ---
      setCurrentPageIdx: (idx) => set({ currentPageIdx: idx }),
      
      addPage: (atIdx, type = 'photo') => set((state) => {
        const newPage = {
          id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          images: [],
          textContent: '',
          textStyle: {
            fontSize: state.selectedFontSize,
            color: state.selectedFontColor,
            fontFamily: state.selectedFontFamily,
            position: state.captionPosition,
            alignment: state.captionAlignment,
          },
          layout: 'single',
          overlays: [],
          textBoxHidden: false,
          pageBgColor: state.pageBgColor,
        };
        
        const newPages = [...state.pages];
        const insertIdx = atIdx !== undefined ? atIdx : newPages.length;
        newPages.splice(insertIdx, 0, newPage);
        
        return { pages: newPages, currentPageIdx: insertIdx };
      }),

      removePage: (idx) => set((state) => {
        const newPages = state.pages.filter((_, i) => i !== idx);
        const newIdx = Math.max(0, Math.min(state.currentPageIdx, newPages.length - 1));
        return { pages: newPages, currentPageIdx: newIdx };
      }),

      duplicatePage: (idx) => set((state) => {
        const pageToClone = state.pages[idx];
        const newPage = { ...JSON.parse(JSON.stringify(pageToClone)), id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
        const newPages = [...state.pages];
        newPages.splice(idx + 1, 0, newPage);
        return { pages: newPages, currentPageIdx: idx + 1 };
      }),

      movePage: (from, to) => set((state) => {
        const newPages = [...state.pages];
        const [moved] = newPages.splice(from, 1);
        newPages.splice(to, 0, moved);
        return { pages: newPages, currentPageIdx: to };
      }),

      // --- IMAGE OPERATIONS ---
      setUploadedImages: (images) => set({ uploadedImages: images }),
      
      addImageToPage: (imageId, slotIdx) => set((state) => {
        const newPages = [...state.pages];
        const page = { ...newPages[state.currentPageIdx] };
        const images = [...(page.images || [])];
        images[slotIdx] = imageId;
        page.images = images;
        newPages[state.currentPageIdx] = page;
        return { pages: newPages };
      }),

      removeImageFromPage: (slotIdx) => set((state) => {
        const newPages = [...state.pages];
        const page = { ...newPages[state.currentPageIdx] };
        const images = [...(page.images || [])];
        images[slotIdx] = null;
        page.images = images;
        newPages[state.currentPageIdx] = page;
        return { pages: newPages };
      }),

      swapSlots: (idxA, idxB) => set((state) => {
        const newPages = [...state.pages];
        const page = { ...newPages[state.currentPageIdx] };
        const images = [...(page.images || [])];
        [images[idxA], images[idxB]] = [images[idxB], images[idxA]];
        page.images = images;
        newPages[state.currentPageIdx] = page;
        return { pages: newPages };
      }),

      // --- SETTINGS ---
      updateGlobalSettings: (settings) => set((state) => ({ ...state, ...settings })),
      
      updateCurrentPageSettings: (settings) => set((state) => {
        const newPages = [...state.pages];
        newPages[state.currentPageIdx] = { ...newPages[state.currentPageIdx], ...settings };
        return { pages: newPages };
      }),

      // --- HISTORY ---
      undo: () => {
        const { history, historyIndex, pages } = get();
        if (historyIndex < 0) return;
        const previousState = JSON.parse(history[historyIndex]);
        set({
          pages: previousState,
          historyIndex: historyIndex - 1
        });
      },

      resetProject: () => set(initialState),
    }),
    {
      name: 'memora-project-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { history, historyIndex, isSidebarOpen, ...persisted } = state;
        return persisted;
      }
    }
  )
);
