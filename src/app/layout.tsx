import '../styles/globals.css'
import '../styles/memora.css'
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
	title: 'Memora - Your memories, beautifully bound.',
	description: 'Turn your camera roll into something you can hold. High-quality photo books for weddings, travel, and every chapter in between.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
	return (
		<html lang="en">
			<head>
				{/* Essential Fonts */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link 
					href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap" 
					rel="stylesheet" 
				/>
                {/* Clash Display - Using a CDN version since it's a popular choice for these templates */}
                <link href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap" rel="stylesheet" />
                
				{/* Legacy Editor Fonts */}
				<link 
					href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Bebas+Neue&family=Caveat:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Lobster&family=Montserrat:wght@300;400;700&family=Pacifico&family=Permanent+Marker&family=Playfair+Display:wght@400;500;600;700&family=Prata&family=Satisfy&family=Shadows+Into+Light&display=swap" 
					rel="stylesheet" 
				/>
			</head>
			<body>
				{children}
                <Toaster position="top-center" />
			</body>
		</html>
	)
}
