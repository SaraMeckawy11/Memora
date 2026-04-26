'use client'
import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { LayoutConfig } from '@/types/layout';
import '@/styles/editor/common.css';
import '@/styles/editor/LayoutSection.css';

export const LAYOUTS: LayoutConfig[] = [
  { id: 'single', name: 'Full Page', cols: 1, rows: 1, slots: 1, template: 'single' },
  { id: '2-horizontal', name: 'Side by Side', cols: 2, rows: 1, slots: 2, template: '2-horizontal' },
  { id: '2-vertical', name: 'Stacked', cols: 1, rows: 2, slots: 2, template: '2-vertical' },
  { id: '1-top-2-bottom', name: '1 Top + 2 Bottom', cols: 2, rows: 2, slots: 3, template: '1-top-2-bottom' },
  { id: '2-top-1-bottom', name: '2 Top + 1 Bottom', cols: 2, rows: 2, slots: 3, template: '2-top-1-bottom' },
  { id: '4-grid', name: '2×2 Grid', cols: 2, rows: 2, slots: 4, template: '4-grid' },
  { id: '6-grid', name: '3×2 Grid', cols: 3, rows: 2, slots: 6, template: '6-grid' },
]

interface LayoutIconProps {
  template: string;
  isSelected: boolean;
}

function LayoutIcon({ template, isSelected }: LayoutIconProps) {
  const boxClass = `layout-icon-box ${isSelected ? 'active' : 'inactive'}`
  const icons: Record<string, React.ReactElement> = {
    single: <div className="layout-icon single"><div className={boxClass} /></div>,
    '2-horizontal': <div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div>,
    '2-vertical': <div className="layout-icon rows-2"><div className={boxClass} /><div className={boxClass} /></div>,
    '1-top-2-bottom': (
      <div className="layout-icon rows-2"><div className={boxClass} /><div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div></div>
    ),
    '2-top-1-bottom': (
      <div className="layout-icon rows-2"><div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div><div className={boxClass} /></div>
    ),
    '4-grid': <div className="layout-icon grid-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
    '6-grid': <div className="layout-icon grid-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
  }
  return icons[template] || icons.single
}

export default function LayoutSection() {
  const store = useProjectStore();
  const currentPage = store.pages[store.currentPageIdx];
  const selectedLayoutId = currentPage?.layout || store.selectedLayout;

  return (
    <div className="editor-card">
      <h4>Layout</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem' }}>
        {LAYOUTS.map(layout => (
          <button
            key={layout.id}
            onClick={() => store.updateCurrentPageSettings({ layout: layout.id as any })}
            className={`layout-btn ${selectedLayoutId === layout.id ? 'active' : 'inactive'}`}
            title={layout.id}
          >
            <LayoutIcon template={layout.template} isSelected={selectedLayoutId === layout.id} />
          </button>
        ))}
      </div>
    </div>
  );
}
