import React from 'react';
import './TravelJournal.css';

const Polaroid = ({ src, rotate, top, left, width, zIndex }) => {
  return (
    <div 
      className="polaroid" 
      style={{
        transform: `rotate(${rotate}deg)`,
        top: top,
        left: left,
        width: width,
        zIndex: zIndex
      }}
    >
      <div className="tape"></div>
      <img src={src} alt="Travel memory" />
    </div>
  );
};

const TravelJournalBook = ({ 
  title = "The Ultimate Travel Journal",
  author = "Reese Miller",
  images = [] 
}) => {
  
  // Default placeholder images if none provided
  const defaultImages = [
    { src: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=300&q=80", rotate: -5, top: "5%", left: "10%", width: "35%", zIndex: 1 },
    { src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80", rotate: 8, top: "15%", left: "55%", width: "38%", zIndex: 2 },
    { src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80", rotate: -3, top: "45%", left: "30%", width: "40%", zIndex: 3 },
  ];

  const polaroids = images.length > 0 ? images : defaultImages;

  return (
    <div className="book-container">
      {/* Background Borders (Torn Paper Effect) */}
      <div className="torn-border border-top"></div>
      <div className="torn-border border-bottom"></div>
      <div className="torn-border border-left"></div>
      <div className="torn-border border-right"></div>

      {/* Decorative Corners/Elements */}
      <div className="map-fragment"></div>
      
      {/* Airplane PNG (Using an icon or transparent PNG URL) */}
      <img 
        className="airplane-sticker" 
        src="https://cdn-icons-png.flaticon.com/512/723/723955.png" 
        alt="Airplane" 
        style={{ opacity: 0.8 }} 
      />

      {/* Main Title */}
      <div className="title-section">
        <h1 className="title-text">{title}</h1>
      </div>

      {/* Photo Collage Area */}
      <div className="photo-cluster">
        {polaroids.map((photo, index) => (
          <Polaroid 
            key={index}
            src={photo.src}
            rotate={photo.rotate}
            top={photo.top}
            left={photo.left}
            width={photo.width}
            zIndex={photo.zIndex}
          />
        ))}
      </div>

      {/* Author Signature */}
      <div className="author-name">
        {author}
      </div>

      {/* Bottom Vintage Cutouts */}
      <img 
        className="decor-building"
        src="https://images.unsplash.com/photo-1555663731-893323719d8c?auto=format&fit=crop&w=200&q=80" 
        alt="Vintage Building"
        style={{ clipPath: 'polygon(10% 0, 90% 10%, 100% 100%, 0 100%)' }} // Rough cutout
      />
      <img 
        className="decor-statue"
        src="https://images.unsplash.com/photo-1543864032-132d78d2b77a?auto=format&fit=crop&w=200&q=80" 
        alt="Statue"
        style={{ clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' }} // Rough cutout
      />
    </div>
  );
};

export default TravelJournalBook;
