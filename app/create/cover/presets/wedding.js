export const wedding = {
  backgroundColor: '#fcfdfe',
  elements: [
    {
      id: 'wedding-photo', type: 'image', x: 223, y: 700, width: 447, height: 350,
      src: 'https://images.unsplash.com/photo-1519741497674-6114d186b2b8?auto=format&fit=crop&w=800&q=80',
      rotation: 0, zIndex: 1,
      opacity: 100,
    },
    {
      id: 'wedding-floral', type: 'image', x: 0, y: 863, width: 893, height: 400,
      src: '/flower.png',
      rotation: 0, zIndex: 5,
      opacity: 80,
    },
    {
      id: 'intro', type: 'text', x: 0, y: 150, width: 893, height: 60,
      content: 'kindly join us for the wedding of', rotation: 0, zIndex: 10,
      color: '#7a7a7a', fontSize: 24, fontFamily: 'Cormorant Garamond', fontWeight: '400', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.05em',
    },
    {
      id: 'name1', type: 'text', x: 0, y: 240, width: 893, height: 120,
      content: 'OLIVIA', rotation: 0, zIndex: 10,
      color: '#6d5e48', fontSize: 100, fontFamily: 'Cormorant Garamond', fontWeight: '500', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.15em',
    },
    {
      id: 'connector', type: 'text', x: 0, y: 360, width: 893, height: 100,
      content: 'and', rotation: 0, zIndex: 10,
      color: '#666666', fontSize: 80, fontFamily: 'Pinyon Script', fontWeight: '400', textAlign: 'center', lineHeight: 1.0,
    },
    {
      id: 'name2', type: 'text', x: 0, y: 460, width: 893, height: 120,
      content: 'ALEXANDER', rotation: 0, zIndex: 10,
      color: '#6d5e48', fontSize: 100, fontFamily: 'Cormorant Garamond', fontWeight: '500', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.15em',
    },
    {
      id: 'date', type: 'text', x: 0, y: 600, width: 893, height: 80,
      content: '20 . 10 . 30', rotation: 0, zIndex: 10,
      color: '#8b7355', fontSize: 48, fontFamily: 'Cormorant Garamond', fontWeight: '600', textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.25em',
    },
    {
      id: 'address', type: 'text', x: 146, y: 1080, width: 600, height: 100,
      content: '123 Anywhere St., Any City, ST 12345', rotation: 0, zIndex: 11,
      color: '#777777', fontSize: 24, fontFamily: 'Cormorant Garamond', fontWeight: '400', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.5,
    },
  ]
};
