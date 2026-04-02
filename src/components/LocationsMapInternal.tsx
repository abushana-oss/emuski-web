'use client';

import { useEffect, useState } from 'react';

export default function LocationsMap() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const locations = [
    { name: 'Bangalore HQ', coords: [12.9716, 77.5946], description: 'RNS Plaza, Electronic City' },
    { name: 'Hyderabad', coords: [17.3850, 78.4867], description: 'Tech Hub, Telangana' },
    { name: 'Hosur', coords: [12.7409, 77.8253], description: 'Production Facility, Tamil Nadu' },
    { name: 'Germany', coords: [51.1657, 10.4515], description: 'Regional Office, Europe' },
    { name: 'USA', coords: [39.8283, -98.5795], description: 'Operations, North America' },
  ];

  if (!isClient) {
    return (
      <div className="w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gradient-to-br from-teal-50 to-blue-50 relative">
      {/* Fallback static map design */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* World map overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              {/* Simplified world map paths */}
              <path
                d="M200,100 Q300,80 400,100 T600,120 L800,140 Q850,160 900,180"
                stroke="#14b8a6"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M150,200 Q250,180 350,200 T550,220 L750,240"
                stroke="#14b8a6"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Location markers */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-6 p-8">
            {locations.map((location, index) => (
              <div
                key={location.name}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/20 hover:bg-white/90 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-gray-900 text-sm">{location.name}</h3>
                </div>
                <p className="text-xs text-gray-600">{location.description}</p>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {location.coords[0].toFixed(2)}, {location.coords[1].toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white/60 px-2 py-1 rounded">
            Global Presence
          </div>
        </div>
      </div>
    </div>
  );
}
