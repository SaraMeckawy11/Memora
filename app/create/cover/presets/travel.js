export const travel = {
  backgroundColor: '#fdfbf7',
  backgroundPattern: 'grid',
  gridColor: '#e0e0e0',
  gridSize: 30,
  elements: [
    // --- TORN PAPER BORDERS (Kraft Paper) ---
    {
      id: 'border-top', type: 'shape', shapeType: 'rect', x: 0, y: 0, width: 893, height: 70,
      fill: '#dcbfa0', zIndex: 10,
      options: {
        clipPath: 'polygon(0 0, 100% 0, 100% 70%, 95% 80%, 90% 65%, 85% 85%, 80% 70%, 75% 85%, 70% 65%, 65% 85%, 60% 70%, 55% 85%, 50% 65%, 45% 85%, 40% 70%, 35% 85%, 30% 65%, 25% 85%, 20% 70%, 15% 85%, 10% 65%, 5% 85%, 0 70%)',
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
      }
    },
    {
      id: 'border-bottom', type: 'shape', shapeType: 'rect', x: 0, y: 1183, width: 893, height: 80,
      fill: '#dcbfa0', zIndex: 10,
      options: {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 30%, 95% 15%, 90% 35%, 85% 15%, 80% 35%, 75% 15%, 70% 35%, 65% 15%, 60% 35%, 55% 15%, 50% 35%, 45% 15%, 40% 35%, 35% 15%, 30% 35%, 25% 15%, 20% 35%, 15% 15%, 10% 35%, 5% 15%, 0 30%)',
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
      }
    },
    {
      id: 'border-left', type: 'shape', shapeType: 'rect', x: 0, y: 0, width: 55, height: 1263,
      fill: '#dcbfa0', zIndex: 10,
      options: {
        clipPath: 'polygon(0 0, 100% 0, 85% 5%, 95% 10%, 80% 15%, 90% 20%, 85% 25%, 95% 30%, 80% 35%, 90% 40%, 85% 45%, 95% 50%, 80% 55%, 90% 60%, 85% 65%, 95% 70%, 80% 75%, 90% 80%, 85% 85%, 95% 90%, 80% 95%, 100% 100%, 0 100%)',
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
      }
    },
    {
      id: 'border-right', type: 'shape', shapeType: 'rect', x: 838, y: 0, width: 55, height: 1263,
      fill: '#dcbfa0', zIndex: 10,
      options: {
        clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%, 5% 95%, 20% 90%, 5% 85%, 20% 80%, 5% 75%, 20% 70%, 5% 65%, 20% 60%, 5% 55%, 20% 50%, 5% 45%, 20% 40%, 5% 35%, 20% 30%, 5% 25%, 20% 20%, 5% 15%, 20% 10%, 5% 5%)',
        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))',
      }
    },
    {
      id: 'map-fragment', type: 'image', x: 723, y: 0, width: 170, height: 170,
      src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80',
      rotation: 0, zIndex: 11,
      opacity: 90,
      options: {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 20% 90%, 0 60%)',
      }
    },
    {
      id: 'airplane', type: 'image', x: 10, y: 80, width: 160, height: 160,
      src: 'https://cdn-icons-png.flaticon.com/512/723/723955.png',
      rotation: -15, zIndex: 20,
      opacity: 80,
      options: { filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.3))' }
    },
    {
      id: 'title', type: 'text', x: 70, y: 200, width: 753, height: 150,
      content: 'The Ultimate Travel Journal',
      rotation: -2, zIndex: 15,
      color: '#2a2a72', fontSize: 68, fontFamily: 'Permanent Marker', fontWeight: '400', textAlign: 'center', lineHeight: 0.9,
      textTransform: 'uppercase',
    },
    {
      id: 'polaroid1', type: 'image', x: 80, y: 520, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=400&q=80',
      rotation: -12, zIndex: 11,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'polaroid2', type: 'image', x: 550, y: 520, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
      rotation: 10, zIndex: 11,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'polaroid4', type: 'image', x: 316, y: 440, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=400&q=80',
      rotation: 3, zIndex: 12,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'polaroid3', type: 'image', x: 316, y: 640, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
      rotation: -5, zIndex: 15,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'author', type: 'text', x: 100, y: 1050, width: 693, height: 100,
      content: 'Reese Miller',
      rotation: -5, zIndex: 20,
      color: '#2a2a72', fontSize: 80, fontFamily: 'Sacramento', fontWeight: '400', textAlign: 'center',
    },
    {
      id: 'decor-building', type: 'image', x: 14, y: 970, width: 260, height: 260,
      src: '/business-trip.png',
      rotation: -5, zIndex: 25,
      opacity: 100,
      options: {
        filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))',
      }
    },
    {
      id: 'decor-statue', type: 'image', x: 640, y: 886, width: 336, height: 356,
      src: '/pisa-tower.png',
      rotation: 5, zIndex: 25,
      opacity: 100,
      options: {
        filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))',
      }
    },
    {
      id: 'travel-sticker', type: 'image', x: 652, y: 1123, width: 140, height: 140,
      src: '/travel.png',
      rotation: -12, zIndex: 26,
      opacity: 100,
      options: { filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))' }
    },
    {
      id: 'camera-sticker', type: 'image', x: 13, y: 1160, width: 120, height: 103,
      src: '/camera.png',
      rotation: -10, zIndex: 26,
      opacity: 100,
      options: { filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))' }
    },
  ]
};
