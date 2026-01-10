export const wedding = {
  backgroundColor: '#fbf9f5',
  elements: [
    {
      id: 'wedding-floral', type: 'image', x: -51, y: 947, width: 944, height: 522,
      src: '/flowers1.webp',
      rotation: 0, zIndex: 1,
      opacity: 100,
    },
    {
      id: 'wedding-floral1', type: 'image', x: 801, y: 723, width: 312, height: 354,
      src: '/flowers2.webp',
      rotation: -2.6, zIndex: 1,
      opacity: 100,
    },
    {
      id: 'wedding-floral2', type: 'image', x: -172, y: 752, width: 286, height: 295,
      src: '/flowers2.webp',
      rotation: 11.1, zIndex: 1,
      opacity: 100,
    },
    {
      id: 'butterfly', type: 'image', x: 759, y: 669, width: 72, height: 72,
      src: '/yellowButterfly.webp',
      rotation: 0, zIndex: 1,
      opacity: 100,
    },
    {
      id: 'wedding-floral2', type: 'image', x: 45, y: 669, width: 72, height: 72,
      src: '/mosqBlue.webp',
      rotation: 0, zIndex: 1,
      opacity: 100,
    },
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/cream.png',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    {
      id: 'name1', type: 'text', x: 0, y: 300, width: 893, height: 120,
      content: 'OLIVIA', rotation: 0, zIndex: 10,
      color: '#74511e', fontSize: 84, fontFamily: 'Cormorant Garamond', fontWeight: '500', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.25em',
    },
    {
      id: 'connector', type: 'text', x: 0, y: 430, width: 893, height: 100,
      content: 'and', rotation: 0, zIndex: 10,
      color: '#000000', fontSize: 92, fontFamily: 'California Signature', fontWeight: '400', textAlign: 'center', lineHeight: 1.0,
    },
    {
      id: 'name2', type: 'text', x: 0, y: 550, width: 893, height: 120,
      content: 'ALEXANDER', rotation: 0, zIndex: 10,
      color: '#74511e', fontSize: 84, fontFamily: 'Cormorant Garamond', fontWeight: '500', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.25em',
    },
    {
      id: 'date', type: 'text', x: 0, y: 720, width: 893, height: 80,
      content: '20 . 10 . 30', rotation: 0, zIndex: 10,
      color: '#74511e', fontSize: 44, fontFamily: 'Cormorant Garamond', fontWeight: '600', textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.35em',
    },
    {
      id: 'time', type: 'text', x: 0, y: 810, width: 893, height: 60,
      content: 'Our Forever', rotation: 0, zIndex: 10,
      color: '#8b7355', fontSize: 26, fontFamily: 'Cormorant Garamond', fontWeight: '400', textAlign: 'center', lineHeight: 1.4,
    },
    {
      id: 'border', type: 'shape', shapeType: 'rect', x: 40, y: 40, width: 813, height: 1183,
      fill: 'transparent', zIndex: 2,
      options: {
        stroke: 'rgba(139, 115, 85, 0.1)',
        strokeWidth: 2,
      }
    }
  ]
};
