export interface LayoutConfig {
  id: string;
  name?: string;
  template: 'single' | '2-horizontal' | '2-vertical' | '1-top-2-bottom' | '2-top-1-bottom' | '4-grid' | '6-grid';
  cols: number;
  rows: number;
  slots: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}
