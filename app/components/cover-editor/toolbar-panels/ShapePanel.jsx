'use client'
import React from 'react'

export const ShapePropertiesPanel = ({ selectedElement, onUpdate, isMobile = false }) => {
  const isLine = selectedElement.shapeType === 'line' || selectedElement.shapeType === 'arrow';
  
  return (
    <div className="shape-properties-stacked" style={{ padding: isMobile ? '0 16px' : '0', width: '100%' }}>
      {/* Shape Selection (Top) */}
      {!isLine && (
         <div className="shape-type-grid" style={{ marginBottom: '16px', justifyContent: 'space-between', padding: '8px' }}>
            {['rect', 'circle', 'triangle', 'star'].map(type => (
              <button 
                key={type}
                className={`shape-type-btn ${(!selectedElement.shapeType && type === 'rect') || selectedElement.shapeType === type ? 'active' : ''}`}
                onClick={() => onUpdate({ shapeType: type === 'rect' ? null : type })}
                title={type}
              >
                {type === 'rect' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg>}
                {type === 'circle' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/></svg>}
                {type === 'triangle' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l10 18H2L12 3z" strokeLinejoin="round"/></svg>}
                {type === 'star' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round"/></svg>}
              </button>
            ))}
         </div>
      )}

      {/* Fill Color Section */}
      <div className="shape-color-section" style={{marginBottom: '12px'}}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="shape-section-header">Fill Color</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               {!isLine && selectedElement.fill && (
                  <button 
                    onClick={() => onUpdate({ fill: null })}
                    title="Remove Fill"
                    style={{ 
                      background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', 
                      width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#64748b'
                    }}
                  >
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
               )}
               <div className="color-picker-wrapper" style={{ width: '40px', height: '40px' }}>
                  <input 
                      type="color" 
                      value={(isLine ? selectedElement.stroke : selectedElement.fill) || '#000000'}
                      onChange={(e) => isLine ? onUpdate({ stroke: e.target.value }) : onUpdate({ fill: e.target.value })}
                  />
                  <div className="color-preview-circle" style={{ backgroundColor: (isLine ? selectedElement.stroke : selectedElement.fill) || 'transparent', border: !((isLine ? selectedElement.stroke : selectedElement.fill)) ? '2px dashed #cbd5e1' : '2px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' }}>
                      {!((isLine ? selectedElement.stroke : selectedElement.fill)) && (
                         <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2px', height: '120%', background: '#ff4d4f', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
                      )}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Border Color Section (Only for Shapes) */}
      {!isLine && (
        <div className="shape-color-section">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="shape-section-header">Border Color</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 {selectedElement.options?.stroke && (
                    <button 
                      onClick={() => onUpdate({ options: { ...selectedElement.options, stroke: null } })}
                      title="Remove Border"
                      style={{ 
                        background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', 
                        width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b'
                      }}
                    >
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                 )}
                 <div className="color-picker-wrapper" style={{ width: '40px', height: '40px' }}>
                    <input 
                      type="color" 
                      value={selectedElement.options?.stroke || '#000000'}
                      onChange={(e) => onUpdate({ options: { ...selectedElement.options, stroke: e.target.value } })}
                    />
                    <div className="color-preview-circle" style={{ backgroundColor: selectedElement.options?.stroke || 'transparent', border: !selectedElement.options?.stroke ? '2px dashed #cbd5e1' : '2px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' }}>
                        {!selectedElement.options?.stroke && (
                           <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2px', height: '120%', background: '#ff4d4f', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
                        )}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Sliders */}
      <div className="shape-sliders-section" style={{ borderTop: 'none', paddingTop: 0 }}>
         {/* Thickness */}
         <div className="mobile-slider-group">
            <div className="mobile-label-sm">
               <span>Thickness</span>
               <span>{isLine ? (selectedElement.strokeWidth || 0) : (selectedElement.options?.strokeWidth || 0)}px</span>
            </div>
            <input 
               type="range" 
               min="0" max="20" 
               value={isLine ? (selectedElement.strokeWidth || 0) : (selectedElement.options?.strokeWidth || 0)}
               onChange={(e) => isLine 
                 ? onUpdate({ strokeWidth: Number(e.target.value) })
                 : onUpdate({ options: { ...selectedElement.options, strokeWidth: Number(e.target.value) } })
               }
            />
         </div>

         {/* Radius (Rect Only) */}
         {(!selectedElement.shapeType || selectedElement.shapeType === 'rect') && !isLine && (
            <div className="mobile-slider-group">
                <div className="mobile-label-sm">
                  <span>Radius</span>
                  <span>{selectedElement.options?.borderRadius || 0}px</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="50" 
                  value={selectedElement.options?.borderRadius || 0}
                  onChange={(e) => onUpdate({ options: { ...selectedElement.options, borderRadius: Number(e.target.value) } })}
                />
            </div>
         )}

         {/* Opacity */}
         <div className="mobile-slider-group">
            <div className="mobile-label-sm">
              <span>Opacity</span>
              <span>{Math.round((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={(selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100} 
              onChange={(e) => onUpdate({ opacity: Number(e.target.value) / 100 })}
            />
         </div>
      </div>

      {isMobile && (
        <button className="mobile-action-btn delete" onClick={() => onUpdate(null, 'delete')} style={{ marginTop: '12px' }}>
          Delete Shape
        </button>
      )}
    </div>
  )
}
