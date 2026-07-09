import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createClient } from '@/utils/supabase/client';
import { clearProject, loadProject, saveProject } from '@/app/utils/storage';
import { ProjectState, PhotoBookPage, ProjectImage, EditorStep } from '@/types/project';

// Lazily create the Supabase client on first use. Creating it at module
// scope runs during Next's build-time prerender (every page that imports this
// store evaluates this module), where NEXT_PUBLIC_SUPABASE_* env vars aren't
// applied yet — which threw "URL and API key are required" and failed the build.
let _supabase: ReturnType<typeof createClient> | null = null;
const getSupabase = () => (_supabase ??= createClient());

interface ProjectActions {
  setStep: (step: EditorStep) => void;
  setProjectId: (id: string | null) => void;
  setProjectDetails: (details: Partial<ProjectState>) => void;
  setSelectedProduct: (id: string | number | null) => void;
  setSelectedSize: (id: string | number | null) => void;
  createProject: (userId: string) => Promise<string | null>;
  saveToSupabase: () => Promise<void>;
  setCurrentPageIdx: (idx: number) => void;
  addPage: (atIdx?: number, type?: PhotoBookPage['type']) => void;
  removePage: (idx: number) => void;
  duplicatePage: (idx: number) => void;
  movePage: (from: number, to: number) => void;
  setUploadedImages: (images: ProjectImage[]) => void;
  addImageToPage: (imageId: string | number, slotIdx: number) => void;
  removeImageFromPage: (slotIdx: number) => void;
  swapSlots: (idxA: number, idxB: number) => void;
  swapImages: (pageIdxA: number, slotIdxA: number, pageIdxB: number, slotIdxB: number) => void;
  updateGlobalSettings: (settings: Partial<ProjectState>) => void;
  updateCurrentPageSettings: (settings: Partial<PhotoBookPage>) => void;
  pushToHistory: () => void;
  undo: () => void;
  redo: () => void;
  resetProject: () => void;
  setSelectedSlotIdx: (idx: number | null) => void;
  setEditingSlotIdx: (idx: number | null) => void;
  setSelectedOverlayIdx: (idx: number | null) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  updateOverlay: (idx: number, overlay: any) => void;
  removeOverlay: (idx: number) => void;
  updateImageInSlot: (slotIdx: number, image: any) => void;
}

type BoundStore = ProjectState & ProjectActions;

const initialState: ProjectState = {
  projectId: null,
  step: 1,
  selectedProduct: 1,
  selectedSize: 3,
  pageCount: 10,
  pages: [],
  currentPageIdx: 0,
  uploadedImages: [],
  coverImage: null,
  coverText: '',
  coverTheme: 'classic',
  pageMargin: 16,
  pageGutter: 16,
  pageBgColor: '#ffffff',
  imageFitMode: 'cover',
  imageBorderRadius: 0,
  showPageNumbers: false,
  selectedLayout: 'single',
  selectedFontSize: 9,
  selectedFontColor: '#000000',
  selectedFontFamily: 'Inter',
  captionPosition: 'bottom',
  captionAlignment: 'center',
  isSidebarOpen: false,
  autoSave: true,
  savingStatus: 'idle',
  lastSaved: null,
  selectedSlotIdx: null,
  editingSlotIdx: null,
  selectedOverlayIdx: null,
};

let historyStack: string[] = [];
let historyIndex: number = -1;

const persistUploadedImages = (images: ProjectImage[]) => {
  if (typeof window === 'undefined') return;
  saveProject({ uploadedImages: images }).catch((err) => {
    console.error('Failed to save uploaded images locally:', err);
  });
};

const stripLargeImageField = (value?: string) => {
  if (!value) return value;
  return value.startsWith('data:') ? undefined : value;
};

const sanitizePagesForStorage = (pages: PhotoBookPage[] = [], uploadedImages: ProjectImage[] = []) =>
  pages.map((page) => ({
    ...page,
    overlays: page.overlays?.map((overlay) => {
      if (overlay.type !== 'photo') return overlay;
      const matchedImage = overlay.imageId !== undefined
        ? uploadedImages.find((img) => String(img.id) === String(overlay.imageId))
        : uploadedImages.find((img) => img.src === overlay.src || img.src === overlay.originalSrc);
      const nextImageId = overlay.imageId ?? matchedImage?.id;
      const canResolveFromLibrary = nextImageId !== undefined;
      return {
        ...overlay,
        imageId: nextImageId,
        src: canResolveFromLibrary ? stripLargeImageField(overlay.src) : overlay.src,
        originalSrc: canResolveFromLibrary ? stripLargeImageField(overlay.originalSrc) : overlay.originalSrc,
      };
    }),
  }));

export const useProjectStore = create<BoundStore>()(
  immer(
    persist(
      (set, get) => ({
        ...initialState,

        setStep: (step) => set({ step }),
        setProjectId: (id) => set({ projectId: id }),
        setProjectDetails: (details) => set((state) => {
          Object.assign(state, details);
        }),
        setSelectedProduct: (id) => set({ selectedProduct: id }),
        setSelectedSize: (id) => set({ selectedSize: id }),

        setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
        updateOverlay: (idx, overlay) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (page && page.overlays) {
            page.overlays[idx] = { ...page.overlays[idx], ...overlay };
          }
        }),
        removeOverlay: (idx) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (page && page.overlays) {
            page.overlays.splice(idx, 1);
            state.selectedOverlayIdx = null;
          }
        }),
        updateImageInSlot: (slotIdx, updatedImage) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (page) {
            if (slotIdx < page.images.length) {
              state.uploadedImages = state.uploadedImages.map((img) =>
                String(img.id) === String(updatedImage.id) ? { ...img, ...updatedImage } : img
              );
              persistUploadedImages(state.uploadedImages);
            } else {
              const overlayIdx = slotIdx - page.images.length;
              if (page.overlays && page.overlays[overlayIdx]) {
                page.overlays[overlayIdx] = { ...page.overlays[overlayIdx], ...updatedImage };
              }
            }
          }
        }),
        createProject: async (userId) => {
          const { selectedProduct, selectedSize, pages, uploadedImages } = get();
          set({ savingStatus: 'saving' });

          try {
            const { data, error } = await getSupabase()
              .from('projects')
              .insert({
                user_id: userId,
                name: `My ${selectedProduct || 'Photo'} Book`,
                content: { pages, uploadedImages },
                metadata: { selectedProduct, selectedSize, step: 2 }
              })
              .select()
              .single();

            if (error) throw error;
            set({ projectId: data.id, savingStatus: 'saved', lastSaved: new Date().toISOString() });
            return data.id;
          } catch (err) {
            console.error('Failed to create project:', err);
            set({ savingStatus: 'error' });
            return null;
          }
        },

        saveToSupabase: async () => {
          const { projectId, pages, uploadedImages, selectedProduct, selectedSize, step } = get();
          if (!projectId) return;

          set({ savingStatus: 'saving' });
          try {
            const { error } = await getSupabase()
              .from('projects')
              .update({
                content: { pages, uploadedImages },
                metadata: { selectedProduct, selectedSize, step },
                updated_at: new Date().toISOString()
              })
              .eq('id', projectId);

            if (error) throw error;
            set({ savingStatus: 'saved', lastSaved: new Date().toISOString() });
            setTimeout(() => {
              if (get().savingStatus === 'saved') set({ savingStatus: 'idle' });
            }, 3000);
          } catch (err) {
            console.error('Failed to save project:', err);
            set({ savingStatus: 'error' });
          }
        },

        setCurrentPageIdx: (idx) => set({ currentPageIdx: idx }),

        addPage: (atIdx, type = 'photo') => set((state) => {
          const isTextPage = type === 'text';
          const newPage: PhotoBookPage = {
            id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            type,
            images: [],
            textContent: '',
            textStyle: {
              fontSize: isTextPage ? 18 : state.selectedFontSize,
              color: state.selectedFontColor,
              fontFamily: state.selectedFontFamily,
              position: state.captionPosition,
              alignment: state.captionAlignment,
              textAlign: 'center',
            },
            layout: isTextPage ? 'text' : state.selectedLayout,
            overlays: [],
            textBoxHidden: false,
            pageBgColor: state.pageBgColor,
            textPosition: isTextPage ? { x: 50, y: 50 } : undefined,
            textRect: isTextPage ? { width: 62, height: 18 } : undefined,
          };
          const insertIdx = atIdx !== undefined ? atIdx : state.pages.length;
          state.pages.splice(insertIdx, 0, newPage);
          state.currentPageIdx = insertIdx;
          get().pushToHistory();
        }),

        removePage: (idx) => set((state) => {
          state.pages.splice(idx, 1);
          state.currentPageIdx = Math.max(0, Math.min(state.currentPageIdx, state.pages.length - 1));
          get().pushToHistory();
        }),

        duplicatePage: (idx) => set((state) => {
          const pageToClone = state.pages[idx];
          if (!pageToClone) return;
          const newPage: PhotoBookPage = {
            ...pageToClone,
            id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            textStyle: pageToClone.textStyle ? { ...pageToClone.textStyle } : undefined,
            images: [...pageToClone.images]
          };
          state.pages.splice(idx + 1, 0, newPage);
          state.currentPageIdx = idx + 1;
          get().pushToHistory();
        }),

        movePage: (from, to) => set((state) => {
          const [moved] = state.pages.splice(from, 1);
          state.pages.splice(to, 0, moved);
          state.currentPageIdx = to;
          get().pushToHistory();
        }),

        setUploadedImages: (images) => {
          set({ uploadedImages: images });
          persistUploadedImages(images);
        },

        addImageToPage: (imageId, slotIdx) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (!page) return;
          if (!page.images) page.images = [];
          page.images[slotIdx] = imageId;
          get().pushToHistory();
        }),

        removeImageFromPage: (slotIdx) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (page?.images) {
            page.images[slotIdx] = null;
            get().pushToHistory();
          }
        }),

        swapSlots: (idxA, idxB) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (page?.images) {
            const temp = page.images[idxA];
            page.images[idxA] = page.images[idxB];
            page.images[idxB] = temp;
            get().pushToHistory();
          }
        }),

        swapImages: (pIdxA, sIdxA, pIdxB, sIdxB) => set((state) => {
          const pageA = state.pages[pIdxA];
          const pageB = state.pages[pIdxB];
          if (pageA?.images && pageB?.images) {
            const temp = pageA.images[sIdxA];
            pageA.images[sIdxA] = pageB.images[sIdxB];
            pageB.images[sIdxB] = temp;
            get().pushToHistory();
          }
        }),

        updateGlobalSettings: (settings) => set((state) => {
          Object.assign(state, settings);
        }),

        updateCurrentPageSettings: (settings) => set((state) => {
          const page = state.pages[state.currentPageIdx];
          if (page) {
            Object.assign(page, settings);
            get().pushToHistory();
          }
        }),

        pushToHistory: () => {
          const { pages, autoSave, saveToSupabase } = get();
          if (historyStack.length > 50) historyStack.shift();
          historyStack = historyStack.slice(0, historyIndex + 1);
          historyStack.push(JSON.stringify(pages));
          historyIndex = historyStack.length - 1;
          if (autoSave) saveToSupabase();
        },

        undo: () => {
          if (historyIndex <= 0) return;
          historyIndex--;
          const previousPages = JSON.parse(historyStack[historyIndex]);
          set({ pages: previousPages });
          if (get().autoSave) get().saveToSupabase();
        },

        redo: () => {
          if (historyIndex >= historyStack.length - 1) return;
          historyIndex++;
          const nextPages = JSON.parse(historyStack[historyIndex]);
          set({ pages: nextPages });
          if (get().autoSave) get().saveToSupabase();
        },

        resetProject: () => {
          set(initialState);
          if (typeof window !== 'undefined') {
            clearProject().catch((err) => {
              console.error('Failed to clear local uploaded images:', err);
            });
          }
        },

        setSelectedSlotIdx: (idx) => set({ selectedSlotIdx: idx }),
        setEditingSlotIdx: (idx) => set({ editingSlotIdx: idx }),
        setSelectedOverlayIdx: (idx) => set({ selectedOverlayIdx: idx }),
      }),
      {
        name: 'memora-project-storage',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (typeof window === 'undefined') return;
          loadProject()
            .then((draft) => {
              if (draft?.uploadedImages?.length) {
                state?.setUploadedImages(draft.uploadedImages);
              }
            })
            .catch((err) => {
              console.error('Failed to load local uploaded images:', err);
            });
        },
        merge: (persistedState, currentState) => {
          const {
            uploadedImages,
            isSidebarOpen,
            savingStatus,
            ...persisted
          } = (persistedState || {}) as Partial<ProjectState>;

          return {
            ...currentState,
            ...persisted,
            uploadedImages: currentState.uploadedImages,
            isSidebarOpen: currentState.isSidebarOpen,
            savingStatus: currentState.savingStatus,
          };
        },
        partialize: (state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { isSidebarOpen, savingStatus, uploadedImages, ...persisted } = state;
          return {
            ...persisted,
            pages: sanitizePagesForStorage(state.pages, state.uploadedImages),
          } as any;
        }
      }
    )
  )
);
