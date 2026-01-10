import React, { useState } from 'react';
import './Travel2.css';

const Travel2 = ({ 
  initialTitle = "MY JOURNAL",
  initialSubtitle = "~ ESTELLE DARCY ~"
}) => {
  const [details, setDetails] = useState({
    title: initialTitle,
    subtitle: initialSubtitle
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="travel2-container">
      
      {/* --- LAYER 1: BACKGROUNDS --- */}
      <img 
        src="/aluminum.png" 
        alt="Aluminum Texture" 
        className="element aluminum-bg" 
      />
      
      <img 
        src="/pyramids.png" 
        alt="Pyramids Background" 
        className="element pyramids-bg" 
      />
      
      <img 
        src="/liberty statue.webp" 
        alt="Liberty Statue" 
        className="element liberty-statue" 
      />

      {/* --- LAYER 2: TOP ELEMENTS --- */}
      
      {/* Venice Building Placeholder - Replaced with actual image if possible or styled placeholder */}
      <div className="element venice-building">
        <img src="/building.png" alt="Venice Building" />
      </div>

      <img 
        src="/scratsh paper.png" 
        alt="Scratch Paper" 
        className="element scratch-paper" 
      />

      {/* Sticker Placeholder (Our Moment) - Replaced with SVG/Image */}
      <div className="element sticker-our-moment">
         <img src="/ourMoments.svg" alt="Our Moment" />
      </div>

      <img 
        src="/butterfly.png" 
        alt="Butterfly Top" 
        className="element top-butterfly" 
      />

      {/* Cat Placeholder - Replaced with Image */}
      <div className="element cat-decor">
        <img src="/cat.png" alt="Cat Image" />
      </div>

      {/* --- LAYER 3: CENTER TEXT --- */}
      <div className="text-holder-container">
        <img 
          src="/text holder.png" 
          alt="Text Holder" 
          className="text-holder-img" 
        />
        <div className="text-overlay">
          <input 
            type="text" 
            name="title" 
            className="editable-title"
            value={details.title} 
            onChange={handleChange}
            placeholder="MY JOURNAL"
          />
          <input 
            type="text" 
            name="subtitle" 
            className="editable-subtitle"
            value={details.subtitle} 
            onChange={handleChange}
            placeholder="~ ESTELLE DARCY ~"
          />
        </div>
      </div>

      {/* --- LAYER 4: BOTTOM ELEMENTS --- */}
      
      <img 
        src="/car.png" 
        alt="Red Car" 
        className="element car" 
      />

      <img 
        src="/vase.png" 
        alt="Vase" 
        className="element vase" 
      />

      <img 
        src="/sideButterfly.png" 
        alt="Side Butterfly" 
        className="element side-butterfly" 
      />

      <img 
        src="/plane.webp" 
        alt="Plane" 
        className="element plane" 
      />

    </div>
  );
};

export default Travel2;
