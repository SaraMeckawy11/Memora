export const travel3 = {
  backgroundColor: '#efe8dc', // Textured paper beige color
  elements: [
    {
      id: 'back', type: 'image', x: 0, y: 0, width: 900, height: 1270,
      src: '/backBeige.jpg',
      rotation: 0, zIndex: -1,
      opacity: 100,
    },
    // --- BACKGROUND ELEMENTS (Bottom Layer) ---
    {
      id: 'rome-background-bl', 
      type: 'image', 
      x: -98, 
      y: 950, 
      width: 554, 
      height: 345,
      src: '/RomeBuilding.png', // The orange building silhouette at the bottom
      zIndex: 1, 
      opacity: 100
    },
    {
      id: 'rome-background-br', 
      type: 'image', 
      x: 440, 
      y: 950, 
      width: 554, 
      height: 345,
      src: '/RomeBuilding.png', // The orange building silhouette at the bottom
      zIndex: 1, 
      scaleX: -1,
      opacity: 100
    },
    // --- STAMPS (Middle Layer) ---
    {
      id: 'stamp-tokyo', 
      type: 'image', 
      x: -129, 
      y: -28, 
      width: 406, 
      height: 237,
      src: '/tokoyoStamp.webp', // Top Left Red Stamp
      zIndex: 2, 
      opacity: 90,
      rotation: -42
    },
    {
      id: 'stamp-plane', 
      type: 'image', 
      x: 551, 
      y: 42, 
      width: 222, 
      height: 115,
      src: '/planeStamp.png', // Top Right Plane Circle
      zIndex: 2, 
      opacity: 100
    },
    {
      id: 'stamp-prague', 
      type: 'image', 
      x: 739, 
      y: -48, 
      width: 241, 
      height: 294,
      src: '/PragueStamp.webp', // Top Right Green Stamp
      zIndex: 2, 
      opacity: 90,
      rotation: -34.7
    },
    {
      id: 'stamp-eiffel', 
      type: 'image', 
      x: -111, 
      y: 182, 
      width: 259, 
      height: 396,
      src: '/EiffelTowerStamp.png', // Left Side Tower
      zIndex: 2, 
      opacity: 90,
      rotation: 4.6
    },
    {
      id: 'stamp-netherlands', 
      type: 'image', 
      x: 695, 
      y: 224, 
      width: 332, 
      height: 319,
      src: '/NetherlandsStamp.png', // Right Side Windmill
      zIndex: 2, 
      opacity: 100,
      rotation: -12.4
    },
    {
      id: 'stamp-japan', 
      type: 'image', 
      x: -207, 
      y: 547, 
      width: 365, 
      height: 382,
      src: '/JapanStamp.png', // Bottom Left Blue Stamp
      zIndex: 2, 
      opacity: 100,
      rotation: -41.1
    },
    {
      id: 'stamp-cairo', 
      type: 'image', 
      x: 710, 
      y: 539, 
      width: 299, 
      height: 304,
      src: '/Cairo.webp', // Bottom Right Pyramids
      zIndex: 2, 
      opacity: 100,
      rotation: -58
    },

    // --- CENTERPIECE ILLUSTRATION ---
    {
      id: 'center-globe', 
      type: 'image', 
      x: 91, 
      y: 875, 
      width: 711, 
      height: 629,
      src: '/Earth.webp', // The globe, luggage, and polaroids cluster
      zIndex: 0, 
      opacity: 100
    },

    // --- TEXT ELEMENTS (Top Layer) ---
    {
      id: 'title-line-1',
      type: 'text',
      x: 150,
      y: 333,
      width: 600,
      height: 271,
      content: 'TRAVEL JOURNAL',
      color: '#6d8397', // Muted Blue-Grey
      fontSize: 130,
      fontFamily: 'Oswald', // Assuming a tall/condensed font
      textAlign: 'center',
      fontWeight: 'light',
      lineHeight: 1.0,
      zIndex: 4
    },

    {
      id: 'subtitle-author',
      type: 'text',
      x: 250,
      y: 661,
      width: 400,
      height: 60,
      content: 'BY BASTIAN',
      color: '#151c18', // Black/Dark Grey
      fontSize: 42,
      fontFamily: 'Oswald',
      textAlign: 'center',
      fontWeight: 'light',
      zIndex: 4
    },
  ]
};