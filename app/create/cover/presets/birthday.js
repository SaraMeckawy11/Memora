export const birthday = {
  backgroundColor: '#F0F9FF',
  elements: [
    {
      id: 1, type: 'text', x: 50, y: 80, width: 700, height: 150,
      content: "HAPPY 30TH!", rotation: -3, zIndex: 2,
      color: '#1D4ED8', fontSize: 120, fontFamily: 'Permanent Marker', fontWeight: '400', textAlign: 'center', lineHeight: 1.2,
    },
    {
      id: 2, type: 'image', x: 200, y: 250, width: 400, height: 500,
      src: 'https://images.unsplash.com/photo-1576866209830-58f4c00a5814?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
      rotation: 5, zIndex: 1,
      brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, blur: 0, opacity: 100, sepia: 0, grayscale: 0, vignette: 0,
    },
    {
      id: 3, type: 'text', x: 100, y: 800, width: 600, height: 50,
      content: 'A decade of fun', rotation: 0, zIndex: 3,
      color: '#64748B', fontSize: 28, fontFamily: 'Caveat', fontWeight: '700', textAlign: 'center', lineHeight: 1.5,
    },
  ]
};
