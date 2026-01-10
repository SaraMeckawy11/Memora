import React, { useState } from 'react';
import './Summer.css';

const Summer = ({ 
  initialDaily = "Daily",
  initialJournal = "Journal"
}) => {
  const [details, setDetails] = useState({
    daily: initialDaily,
    journal: initialJournal
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  // Mapping paths based on user input. 
  // Ensure these files exist in your 'public' folder.
  const assets = {
    wheel: "/wheel.svg",
    boat: "/Boat.svg",
    hat: "/hat.svg",
    sea: "/sea.svg",
    // Mapping the 7 leaf files to different positions in the design
    leaves: [
      "/leaf1.svg", "/leaf2.svg", "/leaf3.svg", 
      "/leaf4.svg", "/leaf5.svg", "/leaf6.svg", "/leaf7.svg"
    ]
  };

  return (
    <div className="summer-journal-container">
      
      {/* --- Top Leaves Decoration --- */}
      <img src={assets.leaves[0]} className="leaf top-left-1" alt="" />
      <img src={assets.leaves[1]} className="leaf top-left-2" alt="" />
      <img src={assets.leaves[2]} className="leaf top-center" alt="" />
      <img src={assets.leaves[3]} className="leaf top-right" alt="" />

      {/* --- Side Leaves --- */}
      <img src={assets.leaves[4]} className="leaf side-left" alt="" />
      <img src={assets.leaves[5]} className="leaf side-right" alt="" />

      {/* --- Typography Section --- */}
      <div className="title-group">
        {/* The Hat rests on the 'D' */}
        <img src={assets.hat} className="hat-icon" alt="Summer Hat" />
        
        <input 
          type="text"
          name="daily"
          className="text-daily"
          value={details.daily}
          onChange={handleChange}
        />
        <input 
          type="text"
          name="journal"
          className="text-journal"
          value={details.journal}
          onChange={handleChange}
        />
      </div>

      {/* --- Center Illustration --- */}
      <img src={assets.boat} className="boat-icon" alt="Sailboat" />

      {/* --- Bottom Section --- */}
      {/* The Sea Background */}
      <img src={assets.sea} className="sea-layer" alt="Sea and Sand" />
      
      {/* The Lifebuoy Wheel */}
      <img src={assets.wheel} className="wheel-icon" alt="Lifebuoy" />

      {/* --- Bottom Leaves (Foreground) --- */}
      <img src={assets.leaves[6]} className="leaf bottom-left" alt="" />
      {/* Reusing leaf assets to fill the bottom right if needed, or specific leaf7 */}
      <img src={assets.leaves[0]} className="leaf bottom-right" alt="" />
      <img src={assets.leaves[2]} className="leaf bottom-center" alt="" />

    </div>
  );
};

export default Summer;
