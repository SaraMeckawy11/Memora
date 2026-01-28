export const nightLove = {
  backgroundColor: '#fbf9f5',
  elements: [
    {
      id: 'cat', type: 'image', x: 257, y: 804, width: 378, height: 459,
      src: '/catsLove.webp',
      rotation: 0, zIndex: 1,
      opacity: 80,
    },
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/purpleNightSky.jpg',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    {
      id: 'name1', type: 'text', x: 203, y: 263, width: 495, height: 201,
      content: 'NIGHT & LOVE', rotation: 0, zIndex: 10,
      color: '#b5abc4', fontSize: 96, fontFamily: 'Neoneon', fontWeight: '500', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.25em',
    }
  ]
};
