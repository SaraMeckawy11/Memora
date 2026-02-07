export const baby5 = {
  backgroundColor: '#ebe8de',
  elements: [
    {
      id: 'title',
      type: 'text', 
      x: 304, 
      y: 481, 
      width: 284, 
      height: 195,
      content: 'BABY\nBOOK',
      color: '#be735c', 
      fontSize: 76, 
      fontFamily: 'Inknut Antiqua', 
      fontWeight: 'Bold', 
      textAlign: 'center',
      zIndex: 10
    },
    {
      id: 'subtitle',
      type: 'text',
      x:302,
      y: 672,
      width: 290,
      height: 124,
      content: 'The Story of You',
      color: '#000000',
      fontSize: 36,
      fontFamily: 'Brittany Signature Script',
      textAlign: 'center',
      fontWeight: 'normal',
      scaleY: 1.3,
      lineHeight: 0.8,
      zIndex: 3
    },
    {
      id: 'circleFlower', type: 'image', x: 11, y: 205, width: 871, height: 853,
      src: '/circleFlower.webp',
      zIndex: 1, opacity: 100
    },
  ]
};
