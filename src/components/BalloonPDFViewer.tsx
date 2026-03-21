'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface BalloonAnnotation {
  id: string;
  x: number;
  y: number;
  number: number;
  label: string;
  style: 'circle' | 'square' | 'diamond';
  color: string;
}

interface BalloonPDFViewerProps {
  pdfUrl: string;
  balloons: BalloonAnnotation[];
  isAnnotating: boolean;
  onAddBalloon: (x: number, y: number) => void;
  onRemoveBalloon: (id: string) => void;
  onUpdateBalloon: (id: string, updates: Partial<BalloonAnnotation>) => void;
}

export const BalloonPDFViewer = ({
  pdfUrl,
  balloons,
  isAnnotating,
  onAddBalloon,
  onRemoveBalloon,
  onUpdateBalloon
}: BalloonPDFViewerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [draggedBalloon, setDraggedBalloon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsMobile(mobile);
      setIsIOS(ios);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotating || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    onAddBalloon(x, y);
  };

  const handleBalloonMouseDown = (event: React.MouseEvent, balloonId: string) => {
    event.stopPropagation();
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const balloon = balloons.find(b => b.id === balloonId);
    if (!balloon) return;

    setDraggedBalloon(balloonId);
    setDragOffset({
      x: event.clientX - rect.left - (balloon.x * rect.width / 100),
      y: event.clientY - rect.top - (balloon.y * rect.height / 100)
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!draggedBalloon || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((event.clientY - rect.top - dragOffset.y) / rect.height) * 100;

    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onUpdateBalloon(draggedBalloon, { x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setDraggedBalloon(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const renderBalloon = (balloon: BalloonAnnotation) => {
    const baseClasses = "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 z-10";
    const sizeClasses = "w-8 h-8 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-lg";
    
    let shapeClasses = "";
    switch (balloon.style) {
      case 'circle':
        shapeClasses = "rounded-full";
        break;
      case 'square':
        shapeClasses = "rounded-none";
        break;
      case 'diamond':
        shapeClasses = "rounded-none transform rotate-45";
        break;
    }

    return (
      <div
        key={balloon.id}
        className={`${baseClasses} ${sizeClasses} ${shapeClasses}`}
        style={{
          left: `${balloon.x}%`,
          top: `${balloon.y}%`,
          backgroundColor: balloon.color
        }}
        onMouseDown={(e) => handleBalloonMouseDown(e, balloon.id)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onRemoveBalloon(balloon.id);
        }}
        title={`Balloon ${balloon.number} - Double-click to remove`}
      >
        <span className={balloon.style === 'diamond' ? 'transform -rotate-45' : ''}>
          {balloon.label}
        </span>
      </div>
    );
  };

  const minHeight = '85vh';

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-gray-50"
      style={{ minHeight }}
    >
      {/* Mobile/iOS: Show download/open button instead of iframe */}
      {isMobile || isIOS ? (
        <div
          className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8"
          style={{ minHeight }}
        >
          <FileText className="w-20 h-20 text-teal-600 mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
            PDF Technical Drawing
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-sm">
            View this PDF in your device's native PDF viewer. Balloon annotations are not available on mobile devices.
          </p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors max-w-sm w-full"
          >
            <ExternalLink className="w-5 h-5" />
            Open PDF
          </a>
        </div>
      ) : (
        /* Desktop: Show iframe PDF viewer with annotation overlay */
        <div 
          className="relative w-full" 
          style={{ height: minHeight }}
          data-pdf-container="true"
        >
          <iframe
            src={`${pdfUrl}#view=FitH&scrollbar=0&toolbar=0&navpanes=0`}
            className="w-full h-full border-0 bg-white"
            title="PDF Technical Drawing"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            allow="fullscreen"
            sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
          />
          
          {/* Annotation Overlay */}
          <div
            ref={overlayRef}
            className={`absolute inset-0 w-full h-full ${
              isAnnotating ? 'cursor-crosshair' : 'pointer-events-none'
            }`}
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ pointerEvents: isAnnotating || balloons.length > 0 ? 'auto' : 'none' }}
            data-balloon-overlay="true"
          >
            {/* Render all balloons */}
            {balloons.map(renderBalloon)}
            
            {/* Annotation hint */}
            {isAnnotating && balloons.length === 0 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
                Click anywhere on the PDF to add a balloon annotation
              </div>
            )}
          </div>
          
          {/* Loading overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
              <div className="text-center">
                <FileText className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600 font-medium">Loading PDF...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};