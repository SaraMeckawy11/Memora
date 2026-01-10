export const summer = {
  backgroundColor: '#d0f7ff',
  elements: [
    // --- Top Frame Leaves ---
    {
      id: 'leaf-tl1', type: 'image', x: 126, y: -129, width: 305,
      src: '/leaf1.png', rotation: 90, zIndex: 2, scaleX: -1
    },
    {
      id: 'leaf-tl2', type: 'image', x: 497, y: 0, width: 365,
      src: '/leaf2.png', rotation: 0, zIndex: 2
    },
    // --- Side Frame Leaves ---
    {
      id: 'leaf-sr', type: 'image', x: 675, y: 452, width: 382,
      src: '/leaf2.png', rotation: 67.4, zIndex: 5, scaleX: -1
    },
    {
      id: 'leaf-sl', type: 'image', x: -110, y: 691, width: 393,
      src: '/leaf2.png', rotation: -72.2, zIndex: 5
    },
    // --- Typography Section ---
    {
      id: 'hat-icon', type: 'image', x: 245, y: 261, width: 150,
      src: '/hat.svg', rotation: -23, zIndex: 12
    },
    {
      id: 'title-daily', type: 'text', x: 0, y: 260, width: 893, height: 160,
      content: 'Daily',
      color: '#5bab79', fontSize: 130, fontFamily: 'Playfair Display', fontWeight: '700', textAlign: 'center',
      zIndex: 10
    },
    {
      id: 'title-journal', type: 'text', x: 0, y: 360, width: 893, height: 200,
      content: 'Journal',
      color: '#00b0fb', fontSize: 160, fontFamily: 'Great Vibes', textAlign: 'center', rotation: -5,
      zIndex: 11
    },

    // --- Center Illustration ---
    {
      id: 'boat-icon', type: 'image', x: 297, y: 606, width: 300,
      src: '/Boat.svg', rotation: 0, zIndex: 5
    },

    // --- Bottom Sea Section ---
    {
      id: 'sea-layer', type: 'image', x: 0, y: 520, width: 1095, height: 743,
      src: '/sea.svg', zIndex: 4
    },
    {
      id: 'wheel-icon', type: 'image', x: 667, y: 988, width: 288, height: 288,
      src: '/wheel.svg', rotation: 0, zIndex: 6
    },

    // --- Bottom Frame Leaves ---
    {
      id: 'leaf-bl', type: 'image', x: 0, y: 969, width: 502,
      src: '/leaf3.png', rotation: 0, zIndex: 20
    },
    {
      id: 'leaf-br', type: 'image', x: 475, y: 1080, width: 447,
      src: '/leaf3.png', rotation: -21.3, zIndex: 20, scaleX: -1
    },
    {
      id: 'leaf-bc', type: 'image', x: 390, y: 1155, width: 314,
      src: '/leaf2.png', rotation: 180, zIndex: 19, scaleX: -1
    }
  ]
};
