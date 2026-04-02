'use client';


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default function LocationsMap() {
  const customIcon = typeof window !== 'undefined' ? L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  }) : null;

  const locations = [
    { name: 'Bangalore HQ', coords: [12.9716, 77.5946] as [number, number] },
    { name: 'Hyderabad', coords: [17.3850, 78.4867] as [number, number] },
    { name: 'Hosur', coords: [12.7409, 77.8253] as [number, number] },
  ];

  return (
    <div className="w-full h-[400px] md:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-10 relative">
      <MapContainer
        center={[15.0, 78.0]}
        zoom={6}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        style={{ zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {customIcon && locations.map((loc) => (
          <Marker key={loc.name} position={loc.coords} icon={customIcon}>
            <Popup className="font-semibold text-gray-800">
              {loc.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
