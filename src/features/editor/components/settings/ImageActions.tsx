'use client'
import React from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import '@/styles/editor/common.css';
import '@/styles/editor/ImageActions.css';

export default function ImageActions(props: any) {
  const store = useProjectStore();
  const currentPage = store.pages[store.currentPageIdx];
  
  const selectedImageId = store.selectedSlotIdx !== null ? currentPage?.images?.[store.selectedSlotIdx] : null;
  const selectedImageObj = selectedImageId ? store.uploadedImages?.find((img) => String(img.id) === String(selectedImageId)) : null;

  if (!selectedImageId) {
    return null;
  }

  return (
    <div className="editor-card">
      <h4>Selected image</h4>

      <div className="image-card">
        <div className="image-card-meta">
          <div
            className="image-card-title"
            title={selectedImageObj?.name || 'Selected image'}
          >
            {selectedImageObj?.name || 'Selected image'}
          </div>
          <div className="image-card-sub">Slot {store.selectedSlotIdx + 1}</div>
        </div>

        <div className="image-card-actions">
          <button
            className="btn-modern btn-modern-primary btn-edit-img"
            onClick={() => store.setEditingSlotIdx(store.selectedSlotIdx)}
            type="button"
          >
            <span className="btn-icon-glyph" aria-hidden="true">✦</span>
            Edit
          </button>
        </div>
      </div>

      <div className="hint-muted">
        Tip: drag a filled slot onto another slot to swap images.
      </div>
    </div>
  );
}
