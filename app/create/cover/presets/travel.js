export const travel = {
  backgroundColor: '#f9f9f8',
  backgroundPattern: 'grid',
  gridColor: '#9d9d9d',
  gridSize: 50,
  elements: [
    // --- TORN PAPER BORDERS (Kraft Paper) ---
    {
      id: 'border-bottom', type: 'image',x: -72, y: 1137, width: 1253, height: 269,
      src: '/paperCutBottom.png',
      rotation: 0, zIndex: 10,
      opacity: 100,
    },
    {
      id: 'border-top', type: 'image',x: -35, y: -137, width: 1253, height: 269,
      src: '/paperCutTop.png',
      rotation: 0, zIndex: 10,
      opacity: 100,
    },
    {
      id: 'border-left', type: 'image',x: -221, y: -386, width: 497, height: 1638,
      src: '/paperSide.png',
      rotation: 0, zIndex: 10,
      opacity: 100,
    },
    {
      id: 'border-right', type: 'image',x: 771, y: -91, width: 497, height: 1638,
      src: '/paperRightSide.png',
      rotation: 0, zIndex: 10,
      opacity: 100,
    },
    {
      id: 'paper', type: 'image', x: 743, y: -69, width: 208, height: 388,
      src: '/map1.webp',
      rotation: -27.3, zIndex: 10,
      opacity: 100,
    },

    {
      id: 'map-fragment2', type: 'image', x: -429, y: -275, width: 542, height: 801,
      src: '/map2.png',
      rotation: 10.7, zIndex: 10,
      opacity: 100,
    },
    {
      id: 'airplane', type: 'image', x: 0, y: 67, width: 359, height: 140,
      src: '/airplane.webp',
      rotation: 0, zIndex: 20,
      opacity: 100,
    },
    {
      id: 'statue', type: 'image', x: 638, y: 1015, width: 196, height: 146,
      src: '/statue.png',
      rotation: 0, zIndex: 9,
      opacity: 100,
      scaleX: -1,
    },
    {
      id: 'title', type: 'text', x: 242, y: 188, width: 410, height: 150,
      content: 'The Ultimate Travel Journal',
      rotation: -2, zIndex: 15,
      color: '#2a2a72', fontSize: 96, fontFamily: 'Permanent Marker', fontWeight: '400', textAlign: 'center', lineHeight: 0.9,
      textTransform: 'uppercase',
    },
    {
      id: 'polaroid1', type: 'image', x: 78, y: 545, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=400&q=80',
      rotation: -12, zIndex: 11,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'polaroid2', type: 'image', x: 548, y: 545, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
      rotation: 10, zIndex: 11,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'polaroid4', type: 'image', x: 317, y: 466, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=400&q=80',
      rotation: 3, zIndex: 12,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'polaroid3', type: 'image', x: 317, y: 670, width: 260, height: 284,
      src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80',
      rotation: -5, zIndex: 15,
      sepia: 20, contrast: 110,
      options: { isPolaroid: true, polaroidPadding: 12, hasTape: true }
    },
    {
      id: 'author', type: 'text', x: 101, y: 969, width: 693, height: 100,
      content: 'Reese Miller',
      rotation: -7.2, zIndex: 20,
      color: '#2a2a72', fontSize: 104, fontFamily: 'Just Me Again Down Here', fontWeight: '400', textAlign: 'center',
    },
  ]
};
