'use client'
import { useEffect } from 'react'

const SYSTEM_FONTS = [
  'Arial', 'Arial Black', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 
  'Times New Roman', 'Didot', 'Georgia', 'American Typewriter', 'Andalé Mono', 
  'Courier', 'Lucida Console', 'Monaco', 'Bradley Hand', 'Brush Script MT', 
  'Luminari', 'Comic Sans MS'
]

export const FONT_LIST = [
  // --- System Fonts ---
  ...SYSTEM_FONTS,

  // --- Handwritten & Script ---
  'Caveat', 'Pacifico', 'Shadows Into Light', 'Indie Flower', 'Dancing Script', 
  'Satisfy', 'Great Vibes', 'Sacramento', 'Zeyada', 'Gloria Hallelujah', 
  'Permanent Marker', 'Amatic SC', 'Patrick Hand', 'Handlee', 'Kalam', 
  'Architects Daughter', 'Coming Soon', 'Schoolbell', 'Rock Salt', 'Chewy', 
  'Sunshiney', 'Waiting for the Sunrise', 'Sniglet', 'Finger Paint', 'Kranky', 
  'Covered By Your Grace', 'Kaushan Script', 'Lobster', 'Cookie', 'Courgette', 
  'Yellowtail', 'Damion', 'Bad Script', 'Marck Script', 'Parisienne', 
  'Homemade Apple', 'Mr Dafoe', 'Pinyon Script', 'Rochester', 'Tangerine', 
  'Nothing You Could Do', 'Reenie Beanie', 'Walter Turncoat', 'Alex Brush', 
  'Bilbo', 'Cedarville Cursive', 'Clicker Script', 'Dawning of a New Day', 
  'Euphoria Script', 'Grand Hotel', 'Herr Von Muellerhoff', 'Italianno', 
  'Jim Nightshade', 'Kristi', 'La Belle Aurore', 'League Script', 'Meddon', 
  'Montez', 'Mr De Haviland', 'Mrs Saint Delafield', 'Norican', 'Over the Rainbow', 
  'Petit Formal Script', 'Allura', 'Just Another Hand', 'Crafty Girls',
  'Nanum Pen Script', 'Gochi Hand', 'Just Me Again Down Here', 'Loved by the King',
  'The Girl Next Door', 'Give You Glory', 'Delius', 'Swanky and Moo Moo',
  'Sue Ellen Francisco', 'Annie Use Your Telescope',
  'Short Stack', 'Pangolin', 'Hi Melody', 'Gaegu', 'Gamja Flower', 'Single Day',
  'Dokdo', 'East Sea Dokdo', 'Yeon Sung', 'Jua', 'Do Hyeon', 'Sunflower',
  'Gothic A1', 'Nanum Gothic', 'Nanum Myeongjo', 'Song Myung', 'Stylish',
  'Gistesy', 'Signature', 'Signature Font', 'California Signature', 'Brittany Signature Script',

  // --- Sans Serif (Clean & Modern) ---
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Raleway', 'Poppins', 
  'Noto Sans', 'Nunito', 'Ubuntu', 'PT Sans', 'Source Sans Pro', 'Merriweather Sans', 
  'Work Sans', 'Roboto Condensed', 'Fira Sans', 'Quicksand', 'Josefin Sans', 
  'Mukta', 'Karla', 'Rubik', 'Dosis', 'Inconsolata', 'Oxygen', 'Arimo', 'Hind', 
  'Cabin', 'Bitter', 'Abel', 'Anton', 'Barlow', 'Assistant', 'Muli', 'Catamaran', 
  'Cairo', 'Prompt', 'Heebo', 'Asap', 'Varela Round', 'Maven Pro', 'Signika', 
  'Kanit', 'Questrial', 'Expletus Sans', 'Share Tech Mono', 'Overpass', 'Teko', 
  'Bree Serif', 'Fjalla One', 'Patua One', 'Cuprum', 'Istok Web', 'Ruda', 
  'Archivo', 'Chivo', 'Manrope', 'Inter', 'DM Sans', 'Space Grotesk', 'Syne',
  'Outfit', 'Urbanist', 'Jost', 'Lexend', 'Epilogue', 'Sora', 'Hanken Grotesk',
  'Montserrat Light', 'Bebas Neue',

  // --- Serif (Elegant & Classic) ---
  'Merriweather', 'Playfair Display', 'Lora', 'PT Serif', 'Roboto Slab', 
  'Slabo 27px', 'Arvo', 'EB Garamond', 'Noto Serif', 'Libre Baskerville', 
  'Crimson Text', 'Josefin Slab', 'Inknut Antiqua', 'Zilla Slab', 'Glegoo', 
  'Alice', 'Amiri', 'Tinos', 'BioRhyme', 'Vollkorn', 'Old Standard TT', 
  'Gentium Basic', 'Cardo', 'Neuton', 'Domine', 'Sorts Mill Goudy', 'Prata', 
  'Podkova', 'Coda', 'Ledger', 'Lustria', 'Judson', 'Kotta One', 'Rosarivo', 
  'Ultra', 'Yeseva One', 'Abril Fatface', 'Alfa Slab One', 'Cinzel', 'Cormorant Garamond',
  'DM Serif Display', 'Bodoni Moda', 'Castoro', 'Fraunces', 'Newsreader',
  'Moon Dance', 'Allison', 'Gotham',

  // --- Display & Decorative ---
  'Lobster Two', 'Bangers', 'Fredoka One', 'Righteous', 'Russo One', 
  'Luckiest Guy', 'Passion One', 'Sigmar One', 'Special Elite', 'Monoton', 
  'Press Start 2P', 'Creepster', 'Fontdiner Swanky', 'Black Ops One', 
  'Orbitron', 'Audiowide', 'Carter One', 'Gruppo', 'Syncopate', 'Unica One',
  'Bungee', 'Bungee Shade', 'Bungee Inline', 'Faster One', 'Eater', 'Nosifer',
  'Butcherman', 'Frijole', 'Metal Mania', 'New Rocker', 'Rye', 'Sancreek',
  'Rogue', 'Rogue Hero', 'Neoneon'
]

const chunkArray = (arr, size) => {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export default function FontLoader() {
  useEffect(() => {
    // Preconnect to Google Fonts
    if (!document.getElementById('google-fonts-preconnect')) {
      const preconnect1 = document.createElement('link')
      preconnect1.id = 'google-fonts-preconnect'
      preconnect1.rel = 'preconnect'
      preconnect1.href = 'https://fonts.googleapis.com'
      document.head.appendChild(preconnect1)

      const preconnect2 = document.createElement('link')
      preconnect2.rel = 'preconnect'
      preconnect2.href = 'https://fonts.gstatic.com'
      preconnect2.crossOrigin = 'anonymous'
      document.head.appendChild(preconnect2)
    }

    // Google Fonts Loading Logic
    // Google Fonts Loading Logic
    const CUSTOM_FONT_NAMES = [
      'Gistesy', 'Rogue', 'Rogue Hero', 'Signature', 'Signature Font', 'Signature Script', 
      'Brittany Signature Script', 'California Signature', 'Gotham', 'Neoneon'
    ]
    
    const googleFontsList = FONT_LIST.filter(font => 
      !SYSTEM_FONTS.includes(font) && 
      !CUSTOM_FONT_NAMES.includes(font)
    )

    const chunks = chunkArray(googleFontsList, 10)

    chunks.forEach((chunk, index) => {
      const linkId = `google-fonts-link-${index}`
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        
        const families = chunk.map(font => {
          if (font === 'Montserrat Light') return 'Montserrat:wght@300'
          return font.replace(/ /g, '+')
        }).join('|')
        
        link.href = `https://fonts.googleapis.com/css?family=${families}&display=swap`
        link.onerror = () => console.warn(`Failed to load font chunk ${index}:`, chunk)
        document.head.appendChild(link)
      }
    })

    // Load Custom Fonts from CDN
    const customFonts = [
      { name: 'Rogue', url: 'https://fonts.cdnfonts.com/css/rogue' },
      { name: 'Rogue Hero', url: 'https://fonts.cdnfonts.com/css/rogue-hero' },
      { name: 'Gistesy', url: 'https://fonts.cdnfonts.com/css/gistesy' },
      { name: 'Signature', url: 'https://fonts.cdnfonts.com/css/signature' },
      { name: 'Signature Font', url: 'https://fonts.cdnfonts.com/css/signature-font' },
      { name: 'Signature Script', url: 'https://fonts.cdnfonts.com/css/signature-script' },
      { name: 'Brittany Signature Script', url: 'https://fonts.cdnfonts.com/css/brittany-signature-script' },
      { name: 'California Signature', url: 'https://fonts.cdnfonts.com/css/california-signature' },
      { name: 'Le Petit Cochon', url: 'https://fonts.cdnfonts.com/css/le-petit-cochon' },
      { name: 'Gotham', url: 'https://fonts.cdnfonts.com/css/gotham' },
      { name: 'Neoneon', url: 'https://fonts.cdnfonts.com/css/neoneon' }
    ]

    customFonts.forEach(font => {
      const id = `custom-font-${font.name.replace(/\s+/g, '-').toLowerCase()}`
      if (!document.getElementById(id)) {
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = font.url
        document.head.appendChild(link)
      }
    })
  }, [])

  return null
}
