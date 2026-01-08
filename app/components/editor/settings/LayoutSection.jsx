'use client'
import React from 'react';
import '@/styles/editor/common.css';
import '@/styles/editor/LayoutSection.css';

function LayoutIcon({ template, isSelected }) {
  const boxClass = `layout-icon-box ${isSelected ? 'active' : 'inactive'}`
  const icons = {
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

export default function LayoutSection({ layouts, selectedLayout, updatePageLayout }) {
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
        {layouts.map(layout => (
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
