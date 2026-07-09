export type EditorStep = 1 | 2 | 3;

export type SavingStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface ProjectImage {
  id: string | number;
  src: string;
  name?: string;
  thumbSrc?: string;
}

export interface TextStyle {
  fontSize: number;
  color: string;
  fontFamily: string;
  position: 'top' | 'bottom' | 'center';
  alignment: 'left' | 'center' | 'right';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
}

export interface PageOverlay {
  id: string | number;
  type: 'text' | 'photo';
  content?: string;
  src?: string;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Partial<TextStyle> & {
    borderRadius?: number;
  };
}

export interface PhotoBookPage {
  id: string;
  type: 'photo' | 'text' | 'mixed';
  images: (string | number | null)[];
  textContent?: string;
  textStyle?: TextStyle;
  layout: string;
  overlays?: PageOverlay[];
  textBoxHidden?: boolean;
  pageBgColor?: string;
  pageMargin?: number;
  pageGutter?: number;
  layoutSplitX?: number;
  layoutSplitY?: number;
  textPosition?: { x: number; y: number };
  textRect?: { width: number; height: number };
  caption?: string;
}

export interface ProjectMetadata {
  selectedProduct: string | null;
  selectedSize: string | null;
  step: EditorStep;
}

export interface ProjectState {
  // Wizard State
  projectId: string | null;
  step: EditorStep;
  selectedProduct: string | number | null;
  selectedSize: string | number | null;
  pageCount: number;
  
  // Project Content
  pages: PhotoBookPage[];
  currentPageIdx: number;
  uploadedImages: ProjectImage[];
  
  // Cover State
  coverImage: ProjectImage | null;
  coverText: string;
  coverTheme: string;
  
  // Global Settings
  pageMargin: number;
  pageGutter: number;
  pageBgColor: string;
  imageFitMode: 'cover' | 'contain';
  imageBorderRadius: number;
  showPageNumbers: boolean;
  
  // Default Settings for new content
  selectedLayout: string;
  selectedFontSize: number;
  selectedFontColor: string;
  selectedFontFamily: string;
  captionPosition: 'top' | 'bottom' | 'center';
  captionAlignment: 'left' | 'center' | 'right';
  
  // Editor UI State
  isSidebarOpen: boolean;
  autoSave: boolean;
  savingStatus: SavingStatus;
  lastSaved: string | null;
  selectedSlotIdx: number | null;
  editingSlotIdx: number | null;
  selectedOverlayIdx: number | null;
}
