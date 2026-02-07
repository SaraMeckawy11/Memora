export const travel4 = {
  backgroundColor: '#e7f7fd',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backBlue.png',
      rotation: 0, zIndex: -1,
      opacity: 10,
    },
    {
      id: 'cloud', type: 'image', x: 426, y: -64, width: 708, height: 475,
      src: '/cloud.webp',
      zIndex: 2, opacity: 100
    },
    {
      id: 'treeMountain', type: 'image', x: -73, y: 465, width: 1039, height: 923,
      src: '/treeMountain.png',
      zIndex: 1, opacity: 100
    },
    {
      id: 'birds', type: 'image', x: -34, y: 43, width: 442, height: 115,
      src: '/birds.png',
      zIndex: 1, opacity: 100
    },
    {
      id: 'birds4', type: 'image', x: 571, y: 285, width: 172, height: 79,
      src: '/birds4.png',
      zIndex: 2, opacity: 100
    },
    {
      id: 'baby-title',
      type: 'text',
      x:247,
      y: 357,
      width: 399,
      height: 87,
      content: 'My Journey',
      color: '#627bc6',
      fontSize: 48,
      fontFamily: 'Black Ops One',
      textAlign: 'center',
      fontWeight: 'normal',
      scaleY: 1.3,
      lineHeight: 0.8,
      letterSpacing: '0.15em',
      zIndex: 3
    },
    {
      id: 'subtitle',
      type: 'text',
      x:299,
      y: 435,
      width: 295,
      height: 66,
      content: 'By: Juliana Silva',
      color: '#627bc6',
      fontSize: 36,
      fontFamily: 'Poppins',
      textAlign: 'center',
      fontWeight: 'normal',
      scaleY: 1.3,
      lineHeight: 0.8,
      zIndex: 3
    },
  ]
};
