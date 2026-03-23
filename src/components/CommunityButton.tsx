'use client';

import { useState } from 'react';
import { ExternalLink, Users } from 'lucide-react';

export default function CommunityButton() {
  const [isClicked, setIsClicked] = useState(false);

  const handleJoinCommunity = () => {
    setIsClicked(true);
    
    // Open WhatsApp group in new tab
    window.open('https://chat.whatsapp.com/CEOI9YoA8eV2MbO2iCCZr3', '_blank');
    
    // Reset button state after 2 seconds
    setTimeout(() => setIsClicked(false), 2000);
  };

  return (
    <button
      onClick={handleJoinCommunity}
      disabled={isClicked}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
        ${isClicked 
          ? 'bg-green-600 text-white border-green-600' 
          : 'bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 hover:shadow-sm'
        }
      `}
    >
      {isClicked ? (
        <>
          <Users className="w-3 h-3" />
          <span>Opening...</span>
        </>
      ) : (
        <>
          <Users className="w-3 h-3" />
          <span>Join Community</span>
        </>
      )}
    </button>
  );
}