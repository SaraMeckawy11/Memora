
export const lionBirthPoster = {
  backgroundColor: '#d0e7f9', // Light blue textured background
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/blueBack.jpg',
      rotation: 0, zIndex: -1,
      opacity: 40,
    },
    // --- MAIN ILLUSTRATION ---
    {
      id: 'lion-clouds-image',
      type: 'image',
      x: 0,
      y: -41,
      width: 962,
      height: 849,
      src: '/lionClouds.png', // The single image path provided
      zIndex: 1,
      opacity: 100
    },

    // --- TEXT ELEMENTS ---
    {
      id: 'text-name-first',
      type: 'text',
      x: 200,
      y: 837,
      width: 500,
      height: 50,
      content: 'ALEXANDER',
      color: '#737373', // Darker grey-blue
      fontSize: 42,
      fontFamily: 'roboto', // A clean sans-serif font
      textAlign: 'center',
      fontWeight: 'normal',
      letterSpacing: '0.1em',
      zIndex: 2
    },
    {
      id: 'text-name-last',
      type: 'text',
      x: 100,
      y: 907,
      width: 700,
      height: 150,
      content: 'Aronowitz',
      color: '#737373',
      fontSize: 112,
      fontFamily: 'Brittany Signature Script', // Using the script font from your example
      textAlign: 'center',
      fontWeight: 'normal',
      zIndex: 2
    },
{
      id: 'stat-time',
      type: 'text',
      x: 177,
      y: 1126,
      width: 138,
      content: '10:52 am',
      color: '#737373',
      fontSize: 36,
      fontFamily: 'Dancing Script',
      textAlign: 'center',
      zIndex: 2
    },
    {
      id: 'separator-1',
      type: 'text',
      x: 330,
      y: 1114,
      width: 20,
      content: '|',
      color: '#737373',
      fontSize: 48,
      fontFamily: 'CINZEL',
      textAlign: 'center',
      zIndex: 2
    },
    {
      id: 'stat-day',
      type: 'text',
      x: 373,
      y: 1101,
      width: 80,
      content: '23',
      color: '#737373',
      fontSize: 68,
      fontFamily: 'Dancing Script',
      fontWeight: 'Bold',
      textAlign: 'center',
      zIndex: 2
    },
    {
      id: 'stat-month',
      type: 'text',
      x: 472,
      y: 1111,
      width: 77,
      content: 'JUNE',
      color: '#737373',
      fontSize: 24,
      fontFamily: 'Roboto',
      textAlign: 'right',
      zIndex: 2
    },
    {
      id: 'stat-year',
      type: 'text',
      x: 465,
      y: 1137,
      width: 90,
      content: '2020',
      color: '#737373',
      fontSize: 36,
      fontFamily: 'Dancing Script',
      textAlign: 'left',
      zIndex: 2
    },
    {
      id: 'separator-2',
      type: 'text',
      x: 570,
      y: 1114,
      width: 20,
      content: '|',
      color: '#737373',
      fontSize: 48,
      fontFamily: 'CINZEL',
      textAlign: 'center',
      zIndex: 2
    },
    {
      id: 'stat-weight',
      type: 'text',
      x: 610,
      y: 1126,
      width: 100,
      content: '3.2kg',
      color: '#737373',
      fontSize: 36,
      fontFamily: 'Dancing Script',
      textAlign: 'center',
      zIndex: 2
    }
  ]
};