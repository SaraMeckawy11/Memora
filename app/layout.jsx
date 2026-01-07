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
					href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Lobster&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:wght@400;500;600;700&family=Satisfy&family=Shadows+Into+Light&display=swap" 
					rel="stylesheet" 
				/>
			</head>
			<body>
				{children}
			</body>
		</html>
	)
}