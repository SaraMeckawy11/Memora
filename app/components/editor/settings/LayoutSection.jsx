'use client'
import React from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/LayoutSection.css';

export const LAYOUTS = [
  { id: 'single', name: 'Full Page', cols: 1, rows: 1, template: 'single' },
  { id: '2-horizontal', name: 'Side by Side', cols: 2, rows: 1, template: '2-horizontal' },
  { id: '3-horizontal', name: '3×1 (3 Columns)', cols: 3, rows: 1, template: '3-horizontal' },
  { id: '2-vertical', name: 'Stacked', cols: 1, rows: 2, template: '2-vertical' },
  { id: '3-vertical', name: '1×3 (3 Rows)', cols: 1, rows: 3, template: '3-vertical' },
  { id: '1-top-2-bottom', name: '1 Top + 2 Bottom', cols: 2, rows: 2, template: '1-top-2-bottom' },
  { id: '2-top-1-bottom', name: '2 Top + 1 Bottom', cols: 2, rows: 2, template: '2-top-1-bottom' },
  { id: '4-grid', name: '2×2 Grid', cols: 2, rows: 2, template: '4-grid' },
  { id: '6-grid', name: '3×2 Grid', cols: 3, rows: 2, template: '6-grid' },
  { id: '2-3-grid', name: '2×3 Grid', cols: 2, rows: 3, template: '2-3-grid' },
]

function LayoutIcon({ template, isSelected }) {
  const boxClass = `layout-icon-box ${isSelected ? 'active' : 'inactive'}`
  const icons = {
    single: <div className="layout-icon single"><div className={boxClass} /></div>,
    '2-horizontal': <div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div>,
    '3-horizontal': <div className="layout-icon cols-3"><div className={boxClass} /><div className={boxClass} /><div className={boxClass} /></div>,
    '2-vertical': <div className="layout-icon rows-2"><div className={boxClass} /><div className={boxClass} /></div>,
    '3-vertical': <div className="layout-icon rows-3"><div className={boxClass} /><div className={boxClass} /><div className={boxClass} /></div>,
    '1-top-2-bottom': (
      <div className="layout-icon rows-2"><div className={boxClass} /><div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div></div>
    ),
    '2-top-1-bottom': (
      <div className="layout-icon rows-2"><div className="layout-icon cols-2"><div className={boxClass} /><div className={boxClass} /></div><div className={boxClass} /></div>
    ),
    '4-grid': <div className="layout-icon grid-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
    '6-grid': <div className="layout-icon grid-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
    '2-3-grid': <div className="layout-icon grid-2-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className={boxClass} />)}</div>,
  }
  return icons[template] || icons.single
}

export default function LayoutSection({ selectedLayout, updatePageLayout }) {
  return (
    <div className="editor-card">
      <h4>Layout</h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: '0.5rem',
        }}
      >
        {LAYOUTS.map(layout => (
          <button
            key={layout.id}
            onClick={() => updatePageLayout(layout.id)}
            className={`layout-btn ${selectedLayout === layout.id ? 'active' : 'inactive'}`}
            title={layout.name}
          >
            <LayoutIcon
              template={layout.template}
              isSelected={selectedLayout === layout.id}
            />
            <span className="layout-name">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
