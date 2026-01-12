export const babyJournal = {
  backgroundColor: '#fdfdfe',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backClouds.jpg',
      rotation: 0, zIndex: -1,
      opacity: 70,
    },
    {
      id: 'clouds-tr', type: 'image', x: 476, y: 99, width: 437, height: 205,
      src: '/cloud1.webp',
      zIndex: 1, opacity: 40
    },
    {
      id: 'plane', type: 'image', x: 236, y: 518, width: 421, height: 263,
      src: '/colorfulPlane.webp',
      zIndex: 1, rotation: -4.3, opacity: 100
    },
    {
      id: 'clouds-bl', type: 'image', x: -80, y: 598, width: 473, height: 276,
      src: '/cloud2.webp',
      zIndex: 1, opacity: 60
    },
    {
      id: 'Train', type: 'image', x: -52, y: 843, width: 997, height: 726,
      src: '/train.webp',
      zIndex: 1, opacity: 100
    },
    {
      id: 'baby-title',
      type: 'text',
      x:267,
      y: 189,
      width: 377,
      height: 194,
      content: 'BABY JOURNAL',
      color: '#569294',
      fontSize: 104,
      fontFamily: 'Single Day',
      textAlign: 'center',
      fontWeight: 'Bold',
      fontStyle: 'italic',
      scaleY: 1.3,
      lineHeight: 0.8,
      zIndex: 3
    },
  ]
};
