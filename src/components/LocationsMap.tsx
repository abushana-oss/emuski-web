"use client";

import { useEffect, useState, useRef } from 'react';

const locations = [
  { name: 'Bangalore HQ', coords: [12.9716, 77.5946], description: 'RNS Plaza, Electronic City', image: '/country/banaglore.png' },
  { name: 'Hyderabad', coords: [17.3850, 78.4867], description: 'Tech Hub, Telangana', image: '/country/hyderabtah.png' },
  { name: 'Hosur', coords: [12.7409, 77.8253], description: 'Production Facility, Tamil Nadu', image: '/country/banaglore.png' }, // Using Bangalore image as placeholder - needs Hosur-specific image
  { name: 'Germany', coords: [51.1657, 10.4515], description: 'Regional Office, Europe', image: '/country/germany.png' },
  { name: 'USA', coords: [39.8283, -98.5795], description: 'Operations, North America', image: '/country/usa.png' },
];

export default function LocationsMap() {
  const [isClient, setIsClient] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const isHoveringRef = useRef<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let Three: any;
    let scene: any;
    let camera: any;
    let renderer: any;
    let globe: any;
    let controls: any;
    let animationId: any;

    const initThreeJS = async () => {
      // Dynamically import Three.js
      Three = await import('three');
      
      // Scene setup
      scene = new Three.Scene();
      camera = new Three.PerspectiveCamera(75, 1, 0.1, 1000);
      
      renderer = new Three.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
        // Important for mobile drag to not scroll the page
        renderer.domElement.style.touchAction = 'none';
      }

      // Create globe geometry
      const geometry = new Three.SphereGeometry(2.5, 64, 64);
      
      // Create clean, uniform particle globe
      const positions = [];
      const colors = [];
      
      // Parameters for Earth-like continent mapping
      const radius = 2.5;
      
      // Detailed Earth continent mapping with realistic shapes
      const isLand = (lat: number, lng: number) => {
        // Convert to normalized coordinates for easier calculation
        const normLat = lat;
        const normLng = lng > 180 ? lng - 360 : lng;
        
        // North America - more detailed shape
        if (normLat >= 20 && normLat <= 72 && normLng >= -168 && normLng <= -52) {
          // Exclude Great Lakes and Hudson Bay areas with some refinement
          if (normLat >= 42 && normLat <= 50 && normLng >= -95 && normLng <= -76) {
            return Math.random() > 0.3; // Sparse for Great Lakes region
          }
          // Main landmass
          return true;
        }
        
        // Central America
        if (normLat >= 7 && normLat <= 20 && normLng >= -118 && normLng <= -77) return true;
        
        // Caribbean islands
        if (normLat >= 10 && normLat <= 27 && normLng >= -85 && normLng <= -60) {
          return Math.random() > 0.7; // Sparse for island chains
        }
        
        // South America - realistic shape
        if (normLat >= -56 && normLat <= 13) {
          if (normLng >= -82 && normLng <= -34) {
            // Exclude Amazon river areas partially
            if (normLat >= -10 && normLat <= 5 && normLng >= -75 && normLng <= -50) {
              return Math.random() > 0.2; // Dense but not complete for Amazon
            }
            return true;
          }
        }
        
        // Greenland
        if (normLat >= 60 && normLat <= 84 && normLng >= -73 && normLng <= -12) {
          return Math.random() > 0.1; // Mostly ice, some sparse points
        }
        
        // Europe - detailed
        if (normLat >= 35 && normLat <= 71 && normLng >= -10 && normLng <= 50) {
          // Mediterranean shape
          if (normLat >= 35 && normLat <= 47 && normLng >= -6 && normLng <= 42) return true;
          // Northern Europe
          if (normLat >= 47 && normLat <= 71) return true;
          return true;
        }
        
        // Africa - realistic outline
        if (normLat >= -35 && normLat <= 37 && normLng >= -18 && normLng <= 52) {
          // Sahara desert - sparser
          if (normLat >= 15 && normLat <= 30 && normLng >= -10 && normLng <= 35) {
            return Math.random() > 0.3;
          }
          return true;
        }
        
        // Asia - complex shape
        // Russia/Siberia
        if (normLat >= 50 && normLat <= 77 && normLng >= 20 && normLng <= 180) return true;
        
        // Central Asia
        if (normLat >= 35 && normLat <= 50 && normLng >= 40 && normLng <= 85) return true;
        
        // China
        if (normLat >= 18 && normLat <= 54 && normLng >= 73 && normLng <= 135) {
          // Tibet region - higher altitude, sparser
          if (normLat >= 28 && normLat <= 40 && normLng >= 78 && normLng <= 104) {
            return Math.random() > 0.4;
          }
          return true;
        }
        
        // India subcontinent
        if (normLat >= 6 && normLat <= 37 && normLng >= 68 && normLng <= 97) return true;
        
        // Southeast Asia
        if (normLat >= -11 && normLat <= 28 && normLng >= 92 && normLng <= 141) {
          // Island regions - sparse
          if (normLat >= -8 && normLat <= 8 && normLng >= 95 && normLng <= 141) {
            return Math.random() > 0.5;
          }
          return true;
        }
        
        // Japan
        if (normLat >= 30 && normLat <= 46 && normLng >= 129 && normLng <= 146) {
          return Math.random() > 0.3; // Island chain
        }
        
        // Korea
        if (normLat >= 33 && normLat <= 43 && normLng >= 124 && normLng <= 132) return true;
        
        // Middle East
        if (normLat >= 12 && normLat <= 42 && normLng >= 34 && normLng <= 65) {
          // Desert regions
          if (normLat >= 16 && normLat <= 32 && normLng >= 38 && normLng <= 58) {
            return Math.random() > 0.4;
          }
          return true;
        }
        
        // Australia
        if (normLat >= -44 && normLat <= -10 && normLng >= 113 && normLng <= 154) {
          // Central desert - sparse
          if (normLat >= -30 && normLat <= -18 && normLng >= 120 && normLng <= 145) {
            return Math.random() > 0.6;
          }
          return true;
        }
        
        // New Zealand
        if (normLat >= -47 && normLat <= -34 && normLng >= 166 && normLng <= 179) {
          return Math.random() > 0.2;
        }
        
        // Madagascar
        if (normLat >= -26 && normLat <= -12 && normLng >= 43 && normLng <= 51) return true;
        
        // UK & Ireland
        if (normLat >= 49 && normLat <= 61 && normLng >= -11 && normLng <= 2) {
          return Math.random() > 0.2;
        }
        
        // Scandinavia
        if (normLat >= 54 && normLat <= 72 && normLng >= 4 && normLng <= 32) return true;
        
        // Antarctica
        if (normLat <= -60) {
          return Math.random() > 0.4; // Ice continent, partially sparse
        }
        
        return false;
      };
      
      // Generate points with finer resolution for realistic Earth
      const latStep = 1; // Higher resolution
      const lngStep = 1; // Higher resolution
      
      for (let lat = -90; lat <= 90; lat += latStep) {
        for (let lng = -180; lng <= 180; lng += lngStep) {
          if (isLand(lat, lng)) {
            // Convert lat/lng to 3D coordinates
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lng + 180) * (Math.PI / 180);
            
            const x = Math.sin(phi) * Math.cos(theta);
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);
            
            positions.push(x * radius, y * radius, z * radius);
            colors.push(0.08, 0.72, 0.65);
          }
        }
      }

      // Create points material
      const pointGeometry = new Three.BufferGeometry();
      pointGeometry.setAttribute('position', new Three.BufferAttribute(new Float32Array(positions), 3));
      pointGeometry.setAttribute('color', new Three.BufferAttribute(new Float32Array(colors), 3));
      
      const pointMaterial = new Three.PointsMaterial({
        size: 0.025, // Larger points to show continent detail clearly
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });
      
      globe = new Three.Points(pointGeometry, pointMaterial);
      scene.add(globe);

      // Add interactive location markers
      const raycaster = new Three.Raycaster();
      const mouse = new Three.Vector2();
      
      locations.forEach((location, index) => {
        const lat = location.coords[0];
        const lng = location.coords[1];
        
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const x = 2.55 * Math.sin(phi) * Math.cos(theta);
        const y = 2.55 * Math.cos(phi);
        const z = 2.55 * Math.sin(phi) * Math.sin(theta);
        
        const markerGeometry = new Three.SphereGeometry(0.04, 8, 8);
        const markerMaterial = new Three.MeshBasicMaterial({ 
          color: 0x14b8a6,
          transparent: true,
          opacity: 0.9 
        });
        
        const marker = new Three.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, z);
        marker.userData = { location, index };
        globe.add(marker); // Add markers to globe instead of scene so they rotate together
        markersRef.current.push(marker);
      });

      // Camera position
      camera.position.z = 5;

      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      // Initial sizing
      handleResize();
      window.addEventListener('resize', handleResize);

      // Pointer interaction with hover detection
      let isDragging = false;
      let previousPointerPosition = { x: 0, y: 0 };
      
      const handlePointerDown = (event: any) => {
        isDragging = true;
        const clientX = event.clientX;
        const clientY = event.clientY;
        previousPointerPosition = { x: clientX, y: clientY };
        renderer.domElement.setPointerCapture(event.pointerId);

        // Let mobile taps instantly detect markers
        const rect = renderer.domElement.getBoundingClientRect();
        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
        mouse.x = mouseX;
        mouse.y = mouseY;
        setMousePosition({ x: clientX, y: clientY });
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markersRef.current);
        if (intersects.length > 0) {
          const intersectedMarker = intersects[0].object;
          const locationData = intersectedMarker.userData.location;
          setHoveredLocation(locationData);
          isHoveringRef.current = true;
        } else {
          setHoveredLocation(null);
          isHoveringRef.current = false;
        }
      };
      
      const handlePointerMove = (event: any) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const clientX = event.clientX;
        const clientY = event.clientY;
        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
        
        mouse.x = mouseX;
        mouse.y = mouseY;
        
        // Always update mouse position so tooltips render where the finger/cursor is
        setMousePosition({ x: clientX, y: clientY });
        
        // Check for marker intersections
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(markersRef.current);
        
        if (intersects.length > 0) {
          const intersectedMarker = intersects[0].object;
          const locationData = intersectedMarker.userData.location;
          setHoveredLocation(locationData);
          isHoveringRef.current = true;
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredLocation(null);
          isHoveringRef.current = false;
          renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
        
        if (!isDragging) return;
        
        const deltaMove = {
          x: clientX - previousPointerPosition.x,
          y: clientY - previousPointerPosition.y
        };
        
        // Rotate the entire globe (including markers) together
        globe.rotation.y += deltaMove.x * 0.005;
        globe.rotation.x += deltaMove.y * 0.005;
        
        previousPointerPosition = { x: clientX, y: clientY };
      };
      
      const handlePointerUp = (event: any) => {
        isDragging = false;
        renderer.domElement.style.cursor = 'grab';
        try {
          renderer.domElement.releasePointerCapture(event.pointerId);
        } catch (e) {
          // Ignore if pointer is already released
        }
      };
      
      renderer.domElement.addEventListener('pointerdown', handlePointerDown);
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerup', handlePointerUp);
      renderer.domElement.addEventListener('pointercancel', handlePointerUp);

      // Animation loop
      function animate() {
        animationId = requestAnimationFrame(animate);
        
        // Auto-rotate the entire globe (including markers) if not dragging and not hovering
        if (!isDragging && !isHoveringRef.current) {
          globe.rotation.y += 0.003;
        }
        
        renderer.render(scene, camera);
      }
      
      animate();

      sceneRef.current = {
        cleanup: () => {
          if (animationId) cancelAnimationFrame(animationId);
          window.removeEventListener('resize', handleResize);
          if (renderer && renderer.domElement) {
            renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
            renderer.domElement.removeEventListener('pointermove', handlePointerMove);
            renderer.domElement.removeEventListener('pointerup', handlePointerUp);
            renderer.domElement.removeEventListener('pointercancel', handlePointerUp);
          }
          if (containerRef.current && renderer.domElement) {
            containerRef.current.removeChild(renderer.domElement);
          }
          markersRef.current = [];
          isHoveringRef.current = false;
          setHoveredLocation(null);
          renderer.dispose();
        }
      };
    };

    initThreeJS();

    return () => {
      if (sceneRef.current) {
        sceneRef.current.cleanup();
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[350px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading globe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center relative">
      <div 
        ref={containerRef} 
        className="w-full h-full max-w-[650px] max-h-[650px]"
        style={{ cursor: 'grab' }}
      />
      
      {/* Hover Tooltip */}
      {hoveredLocation && (
        <div 
          className="fixed pointer-events-none z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 sm:p-4 w-[240px] max-w-[85vw]"
          style={{
            left: typeof window !== 'undefined' && mousePosition.x > window.innerWidth / 2 
               ? mousePosition.x - 260 
               : mousePosition.x + 10,
            top: typeof window !== 'undefined' && mousePosition.y > window.innerHeight / 2 
               ? mousePosition.y - 180 
               : mousePosition.y + 10,
          }}
        >
          <div className="flex flex-col space-y-2">
            <img 
              src={hoveredLocation.image} 
              alt={hoveredLocation.name}
              className="w-full h-24 sm:h-28 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">{hoveredLocation.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{hoveredLocation.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}