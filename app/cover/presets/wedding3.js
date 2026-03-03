export const wedding3 = {
  backgroundColor: '#ffffff', // Off-white textured paper color
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backRoyalGreen.jpg',
      rotation: 0, zIndex: -1,
      opacity: 80,
    },
    // --- IMAGES ---
    {
      id: 'flower-tl',
      type: 'image',
      x: -82,
      y: 0, // Anchored bottom left
      width: 466,
      height: 542,
      src: '/flower-tl.png',
      zIndex: 1,
      opacity: 80 // Slightly muted line art
    },
    {
      id: 'flower-br',
      type: 'image',
      x: 496,
      y: 744, // Anchored bottom right
      width: 397,
      height: 608,
      src: '/flower-br.png', // Using the same image path, assuming the tool flips it horizontally
      zIndex: 1,
      opacity: 80
    },

    // --- TEXT ELEMENTS ---
    {
      id: 'names-main',
      type: 'text',
      x: 147,
      y: 404,
      width: 600,
      height: 60,
      content: 'Richard',
      color: '#848484',
      fontSize: 56,
      fontFamily: 'Brittany Signature Script',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'Bold',
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
      y: 574,
      width: 600,
      height: 60,
      content: '&',
      color: '#848484',
      fontSize: 48,
      fontFamily: 'Gotham',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    },
    {
      id: 'names-main2',
      type: 'text',
      x: 147,
      y: 714,
      width: 600,
      height: 60,
      content: ' Amanda',
      color: '#848484',
      fontSize: 56,
      fontFamily: 'Brittany Signature Script',
      textAlign: 'center',
      letterSpacing: '0.2em', // Wide spacing for the elegant look
      fontWeight: 'Bold',
      zIndex: 3
    },
    {
      id: 'names-title2',
      type: 'text',
      x: 147,
      y: 764,
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
      y: 914,
      width: 300,
      height: 40,
      content: 'OUR WEDDING',
      color: '#848484', // Slightly lighter grey
      fontSize: 32,
      fontFamily: 'Gotham',
      textAlign: 'center',
      letterSpacing: '0.02em',
      zIndex: 3
    },
    {
      id: 'Date',
      type: 'text',
      x: 147,
      y: 968,
      width: 600,
      height: 60,
      content: '20.10.2025',
      color: '#848484',
      fontSize: 44,
      fontFamily: 'Gotham',
      textAlign: 'center',
      letterSpacing: '0.36em', // Wide spacing for the elegant look
      fontWeight: 'normal',
      zIndex: 3
    }
  ]
};

export const wedding3Back = {
  backgroundColor: '#ffffff',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backRoyalGreen.jpg',
      rotation: 0, zIndex: -1,
      opacity: 80,
    },
    {
      id: 'flower-tl',
      type: 'image',
      x: -82,
      y: 0,
      width: 466,
      height: 542,
      src: '/flower-tl.png',
      zIndex: 1,
      opacity: 80
    },
    {
      id: 'flower-br',
      type: 'image',
      x: 496,
      y: 744,
      width: 397,
      height: 608,
      src: '/flower-br.png',
      zIndex: 1,
      opacity: 80
    }
  ]
};