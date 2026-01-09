'use client'
import React from 'react';
import TravelJournalBook from '@/app/components/custom-covers/TravelJournalBook';
import WeddingCover from '@/app/components/custom-covers/WeddingCover';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// A simple mapping from preset ID to component
const PRESET_COMPONENTS = {
  travel: TravelJournalBook,
  wedding: WeddingCover,
};

// A mapping for fonts required by each theme
const FONT_LINKS = {
    travel: "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Sacramento&display=swap",
    wedding: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Pinyon+Script&family=Great+Vibes&display=swap",
}

export default function CustomCoverPage({ params }) {
  const router = useRouter();
  const { preset } = params;

  const CoverComponent = PRESET_COMPONENTS[preset];
  const fontLink = FONT_LINKS[preset];

  const handleSave = () => {
    // Logic to save the customized cover would go here
    // For now, just navigate back to the main editor
    router.push('/create?step=editor');
  };

  const handleBack = () => {
    router.back();
  }

  if (!CoverComponent) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Cover not found</h1>
        <p>The selected cover theme does not have a custom editor yet.</p>
        <button onClick={handleBack}>Go Back</button>
      </div>
    );
  }

  return (
    <>
      {fontLink && (
        <Head>
            <link href={fontLink} rel="stylesheet" />
        </Head>
      )}
      <div style={{ background: '#e0e7ff', minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '500px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{color: '#3730a3', fontWeight: '700'}}>Editing: {preset.charAt(0).toUpperCase() + preset.slice(1)} Cover</h2>
            <div>
                <button onClick={handleBack} style={{ background: 'white', border: '1px solid #ccc', color: '#333', padding: '0.5rem 1rem', borderRadius: '8px', marginRight: '0.5rem', cursor: 'pointer' }}>Back</button>
                <button onClick={handleSave} style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>Save Cover</button>
            </div>
        </div>
        
        <CoverComponent />

        {/* Basic controls could be added here later */}
        <div style={{ marginTop: '2rem', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px' }}>
            <h3 style={{marginTop: 0, color: '#4338ca'}}>Customization Options</h3>
            <p style={{color: '#64748b'}}>Editing controls for this theme will appear here.</p>
        </div>
      </div>
    </>
  );
}
