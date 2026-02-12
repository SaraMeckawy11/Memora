export const wedding4 = {
  backgroundColor: '#f8f6f2', // Off-white textured paper color
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backWhiteTexture.jpg',
      rotation: 0, zIndex: -1,
      opacity: 25,
    },
    // --- IMAGES ---
    {
      id: 'flower-tl',
      type: 'image',
      x: 0,
      y: 0, // Anchored bottom left
      width: 900,
      height: 1270,
      src: '/galaxy-tl.png',
      zIndex: 1,
      opacity: 100 // Slightly muted line art
    },

    // --- TEXT ELEMENTS ---
    {
      id: 'names-main',
      type: 'text',
      x: 147,
      y: 404,
      width: 600,
      height: 60,
      content: 'RICHARD',
      color: '#848484',
      fontSize: 56,
      fontFamily: 'Cormorant Garamond',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'names-title',
      type: 'text',
      x: 147,
      y: 454,
      width: 600,
      height: 60,
      content: 'JONES',
      color: '#848484',
      fontSize: 24,
      fontFamily: 'Gotham',
      textAlign: 'center',
      letterSpacing: '0.1em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'connector-and',
      type: 'text',
      x: 147,
      y: 520,
      width: 600,
      height: 60,
      content: '&',
      color: '#a2893c',
      fontSize: 48,
      fontFamily: 'EB Garamond',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'names-main2',
      type: 'text',
      x: 147,
      y: 590,
      width: 600,
      height: 60,
      content: ' AMANDA',
      color: '#848484',
      fontSize: 56,
      fontFamily: 'Cormorant Garamond',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'names-title2',
      type: 'text',
      x: 147,
      y: 640,
      width: 600,
      height: 60,
      content: 'WILSON',
      color: '#848484',
      fontSize: 24,
      fontFamily: 'Gotham',
      textAlign: 'center',
      letterSpacing: '0.1em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'subtitle-wedding',
      type: 'text',
      x: 297,
      y: 855,
      width: 300,
      height: 40,
      content: 'OUR FOREVER',
      color: '#848484', // Slightly lighter grey
      fontSize: 28,
      fontFamily: 'Gotham',
      textAlign: 'center',
      letterSpacing: '0.02em',
      zIndex: 3
    },
    {
      id: 'Date',
      type: 'text',
      x: 147,
      y: 780,
      width: 600,
      height: 60,
      content: '20.10.2025',
      color: '#a2893c',
      fontSize: 44,
      fontFamily: 'EB Garamond',
      textAlign: 'center',
      letterSpacing: '0.36em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    }
  ]
};

export const wedding4Back = {
  backgroundColor: '#f8f6f2',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backWhiteTexture.jpg',
      rotation: 0, zIndex: -1,
      opacity: 25,
    },
    {
      id: 'flower-tl',
      type: 'image',
      x: 0,
      y: 0,
      width: 900,
      height: 1270,
      src: '/galaxy-tl.png',
      zIndex: 1,
      opacity: 100
    }
  ]
};