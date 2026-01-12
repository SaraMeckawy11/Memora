import '../styles/globals.css'

export const metadata = {
	title: 'Memora – Photo Book Maker',
	description: 'Create wedding, engagement & travel photo books',
}

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				{/* Google Fonts for Photo Book Editor */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link 
					href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bebas+Neue&family=Caveat:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Lobster&family=Montserrat:wght@300;400;700&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:wght@400;500;600;700&family=Prata&family=Satisfy&family=Shadows+Into+Light&display=swap" 
					rel="stylesheet" 
				/>
				{/* Custom Fonts */}
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/rogue" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/rogue-hero" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/gistesy" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/signature" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/signature-font" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/brittany-signature-script" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/california-signature" />
				<link rel="stylesheet" href="https://fonts.cdnfonts.com/css/le-petit-cochon" />
			</head>
			<body>
				{children}
			</body>
		</html>
	)
}