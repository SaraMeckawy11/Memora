export const mothersDay2 = {
  backgroundColor: '#ffffff', // Off-white textured paper color
  elements: [
    {
      id: 'backPinky', type: 'image', x: 0, y: -78, width: 900, height: 1350,
      src: '/backPinky.jpg',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    // --- IMAGES ---
    {
      id: 'flower-tl',
      type: 'image',
      x: -98,
      y: -157, // Anchored bottom left
      width: 698,
      height: 518,
      src: '/pinkFlowers.webp',
      zIndex: 1,
      opacity: 100, // Slightly muted line art
      rotation: 180
    },
    {
      id: 'flower-br',
      type: 'image',
      x: 449,
      y: 835, // Anchored bottom right
      width: 660,
      height: 608,
      src: '/pinkFlowers.webp', // Using the same image path, assuming the tool flips it horizontally
      zIndex: 1,
      opacity: 100,
      rotation: 180
    },

    // --- TEXT ELEMENTS ---
    {
      id: 'title3',
      type: 'text',
      x: 118,
      y: 650,
      width: 658,
      height: 60,
      content: 'day',
      color: '#000000',
      fontSize: 56,
      fontFamily: 'Brittany Signature Script',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'Bold',
      zIndex: 3
    },
    {
      id: 'title1',
      type: 'text',
      x: 297,
      y: 496,
      width: 300,
      height: 40,
      content: 'Happy',
      color: '#000000', // Slightly lighter grey
      fontSize: 44,
      fontFamily: 'Bodoni Moda',
      textAlign: 'center',
      letterSpacing: '0.02em',
      zIndex: 3
    },
    {
      id: 'title2',
      type: 'text',
      x: 147,
      y: 567,
      width: 600,
      height: 60,
      content: 'Mother\'s',
      color: '#000000',
      fontSize: 112,
      fontFamily: 'Bodoni Moda',
      textAlign: 'center',
      letterSpacing: '0.1em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    }
  ]
};

export const mothersDay2Back = {
  backgroundColor: '#ffffff',
  elements: [
    {
      id: 'backPinky', type: 'image', x: 0, y: -78, width: 900, height: 1350,
      src: '/backPinky.jpg',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    {
      id: 'flower-tl',
      type: 'image',
      x: -98,
      y: -157,
      width: 698,
      height: 518,
      src: '/pinkFlowers.webp',
      zIndex: 1,
      opacity: 100,
      rotation: 180
    },
    {
      id: 'flower-br',
      type: 'image',
      x: 449,
      y: 835,
      width: 660,
      height: 608,
      src: '/pinkFlowers.webp',
      zIndex: 1,
      opacity: 100,
      rotation: 180
    },
  ]
};