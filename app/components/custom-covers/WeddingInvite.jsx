import React, { useState } from 'react';
import './WeddingInvite.css';

const WeddingInvite = () => {
  const [details, setDetails] = useState({
    intro: "kindly join us for the wedding of",
    name1: "OLIVIA",
    connector: "and",
    name2: "ALEXANDER",
    date: "20 . 10 . 30",
    time: "At 5 pm",
    address: "123 Anywhere St., Any City, ST 12345"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="invite-container">
      
      {/* Content Layer */}
      <div className="content-layer">
        <input 
          type="text" name="intro" className="editable-text intro-text"
          value={details.intro} onChange={handleChange}
        />

        <div className="names-section">
          <input 
            type="text" name="name1" className="editable-text big-name"
            value={details.name1} onChange={handleChange}
          />
          <input 
            type="text" name="connector" className="editable-text script-text"
            value={details.connector} onChange={handleChange}
          />
          <input 
            type="text" name="name2" className="editable-text big-name"
            value={details.name2} onChange={handleChange}
          />
        </div>

        <input 
          type="text" name="date" className="editable-text date-text"
          value={details.date} onChange={handleChange}
        />
        <input 
          type="text" name="time" className="editable-text time-text"
          value={details.time} onChange={handleChange}
        />
        <textarea 
          name="address" className="editable-text address-text"
          rows={2}
          value={details.address} onChange={handleChange}
        />
      </div>

      {/* The Bottom Section: Using the flower image */}
      <div className="floral-border-placeholder">
        <img src="/flower.png" alt="Floral decoration" className="floral-img" />
      </div>

    </div>
  );
};

export default WeddingInvite;
