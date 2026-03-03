export const MothersDay = {
  backgroundColor: '#f7f0ea',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/cream.png',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    // --- Top Frame Leaves ---
    {
      id: 'flower-tl', type: 'image', x: -99, y: -13, width: 353, height: 674,
      src: '/flowerMother-tl.webp', rotation: 3.2, zIndex: 5
    },
    {
      id: 'flower-tr', type: 'image', x: 350, y: -56, width: 745, height: 797,
      src: '/flowerMother-tr.png', rotation: 0, zIndex: 5
    },
    // --- Typography Section ---
    {
      id: 'title-daily', type: 'text', x: 203, y: 441, width: 487, height: 381,
      content: 'Happy Mother\'s\nDay',
      color: '#323232', fontSize: 100, fontFamily: 'playfair display', fontWeight: '400', textAlign: 'center',
      zIndex: 10
    },
    // --- Bottom Frame Leaves ---
    {
      id: 'flower-br', type: 'image', x: 582, y: 515, width: 594, height: 800, 
      src: '/flowerMother-br.png', rotation: 0, zIndex: 6
    },
    {
      id: 'flower-bl', type: 'image', x: -326, y: 484, width: 464, height: 862,
      src: '/flowerMother-bl.webp', rotation: 37.2, zIndex: 20
    },
    {
      id: 'flower-bc', type: 'image', x: 76, y: 831, width: 508, height: 713,
      src: '/flowerMother-bc.webp', rotation: 259.9, zIndex: 19,scaleY: -1
    }
  ]
};

export const MothersDayBack = {
  backgroundColor: '#f7f0ea',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/cream.png',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    {
      id: 'flower-tl', type: 'image', x: -99, y: -13, width: 353, height: 674,
      src: '/flowerMother-tl.webp', rotation: 3.2, zIndex: 5
    },
    {
      id: 'flower-tr', type: 'image', x: 350, y: -56, width: 745, height: 797,
      src: '/flowerMother-tr.png', rotation: 0, zIndex: 5
    },
    {
      id: 'flower-br', type: 'image', x: 582, y: 515, width: 594, height: 800, 
      src: '/flowerMother-br.png', rotation: 0, zIndex: 6
    },
    {
      id: 'flower-bl', type: 'image', x: -326, y: 484, width: 464, height: 862,
      src: '/flowerMother-bl.webp', rotation: 37.2, zIndex: 20
    },
    {
      id: 'flower-bc', type: 'image', x: 76, y: 831, width: 508, height: 713,
      src: '/flowerMother-bc.webp', rotation: 259.9, zIndex: 19,scaleY: -1
    }
  ]
};
