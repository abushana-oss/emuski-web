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
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-green-600" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">Join Our Community for Extra Credits</h3>
          <p className="text-sm text-gray-600 mb-3">
            Connect with engineers, share insights, and unlock bonus credits
          </p>
          
          <button
            onClick={handleJoinCommunity}
            disabled={isClicked}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${isClicked 
                ? 'bg-green-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-sm'
              }
            `}
          >
            {isClicked ? (
              <>
                <Users className="w-4 h-4" />
                <span>Opening WhatsApp...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Join Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}