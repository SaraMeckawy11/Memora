export const babyLove = {
  backgroundColor: '#fdfdfe',
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/night2.png',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    {
      id: 'clouds', type: 'image', x: -118, y: 142, width: 1137, height: 345,
      src: '/clouds.png',
      zIndex: 2, opacity: 100
    },
    {
      id: 'grass', type: 'image', x: -52, y: 870, width: 997, height: 726,
      src: '/grass.png',
      zIndex: 1, opacity: 100
    },
    {
      id: 'rabbit', type: 'image', x: 293, y: 574, width: 307, height: 368,
      src: '/rabbit.png',
      zIndex: 1, opacity: 100
    },
    {
      id: 'baby-title',
      type: 'text',
      x:267,
      y: 310,
      width: 377,
      height: 194,
      content: 'OLIVIA',
      color: '#ffffff',
      fontSize: 104,
      fontFamily: 'Didot',
      textAlign: 'center',
      fontWeight: 'normal',
      scaleY: 1.3,
      lineHeight: 0.8,
      letterSpacing: '0.15em',
      zIndex: 3
    },
    {
      id: 'subtitle',
      type: 'text',
      x:51,
      y: 426,
      width: 800,
      height: 160,
      content: 'i love you to the moon and back',
      color: '#ffffff',
      fontSize: 60,
      fontFamily: 'california Signature',
      textAlign: 'center',
      fontWeight: 'normal',
      scaleY: 1.3,
      lineHeight: 0.8,
      zIndex: 3
    },
  ]
};
