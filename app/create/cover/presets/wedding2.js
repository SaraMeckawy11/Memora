export const wedding2 = {
  backgroundColor: '#f8f9f5', // Off-white textured paper color
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backWhiteTexture.jpg',
      rotation: 0, zIndex: -1,
      opacity: 15,
    },
    // --- IMAGES ---
    {
      id: 'flower-center-small',
      type: 'image',
      x: 381, // Centered horizontally (assuming 900 width canvas)
      y: 342,
      width: 130,
      height: 191,
      src: '/flowerCenter.png', // The small center leaf element
      zIndex: 2,
      opacity: 100
    },
    {
      id: 'flower-side-left',
      type: 'image',
      x: 0,
      y: 683, // Anchored bottom left
      width: 254,
      height: 580,
      src: '/flowerWed.webp',
      zIndex: 1,
      opacity: 80 // Slightly muted line art
    },
    {
      id: 'flower-side-right',
      type: 'image',
      x: 639,
      y: 683, // Anchored bottom right
      width: 254,
      height: 580,
      src: '/flowerWed.webp', // Using the same image path, assuming the tool flips it horizontally
      zIndex: 1,
      scaleX: -1,
      opacity: 80
    },

    // --- TEXT ELEMENTS ---
    {
      id: 'initial-m',
      type: 'text',
      x: 253,
      y: 406,
      width: 100,
      height: 100,
      content: 'M',
      color: '#4a4d54', // Dark Charcoal
      fontSize: 112,
      fontFamily: 'Cormorant Garamond', // A classic serif font
      textAlign: 'right',
      zIndex: 3
    },
    {
      id: 'initial-r',
      type: 'text',
      x: 531,
      y: 406,
      width: 100,
      height: 100,
      content: 'R',
      color: '#4a4d54',
      fontSize: 112,
      fontFamily: 'Cormorant Garamond',
      textAlign: 'left',
      zIndex: 3
    },
    {
      id: 'names-main',
      type: 'text',
      x: 147,
      y: 544,
      width: 600,
      height: 60,
      content: 'MARIO & RACHEL',
      color: '#4a4d54',
      fontSize: 48,
      fontFamily: 'Cormorant Garamond',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'subtitle-wedding',
      type: 'text',
      x: 297,
      y: 709,
      width: 300,
      height: 40,
      content: 'OUR WEDDING',
      color: '#4a4d54', // Slightly lighter grey
      fontSize: 32,
      fontFamily: 'Cormorant Garamond',
      textAlign: 'center',
      letterSpacing: '0.1em',
      zIndex: 3
    }
  ]
};

export const wedding2Back = {
  backgroundColor: '#f8f9f5',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backWhiteTexture.jpg',
      rotation: 0, zIndex: -1,
      opacity: 15,
    },
    {
      id: 'flower-center-small',
      type: 'image',
      x: 381,
      y: 342,
      width: 130,
      height: 191,
      src: '/flowerCenter.png',
      zIndex: 2,
      opacity: 100
    },
    {
      id: 'flower-side-left',
      type: 'image',
      x: 0,
      y: 683,
      width: 254,
      height: 580,
      src: '/flowerWed.webp',
      zIndex: 1,
      opacity: 80
    },
    {
      id: 'flower-side-right',
      type: 'image',
      x: 639,
      y: 683,
      width: 254,
      height: 580,
      src: '/flowerWed.webp',
      zIndex: 1,
      scaleX: -1,
      opacity: 80
    }
  ]
};