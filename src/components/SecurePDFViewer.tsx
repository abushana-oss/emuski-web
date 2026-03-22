'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { setupPDFWorker } from '@/lib/pdf-config';

interface BalloonAnnotation {
  id: string;
  x: number;
  y: number;
  number: number;
  label: string;
  style: 'circle' | 'square' | 'diamond';
  color: string;
  note?: string;
}

interface SecurePDFViewerProps {
  file: File | null;
  pdfUrl?: string;
  balloons: BalloonAnnotation[];
  isAnnotating: boolean;
  onAddBalloon: (x: number, y: number) => void;
  onRemoveBalloon: (id: string) => void;
  onUpdateBalloon: (id: string, updates: Partial<BalloonAnnotation>) => void;
  onUpdateBalloonNumber: (id: string, newNumber: number) => void;
  onUpdateBalloonNote: (id: string, note: string) => void;
  balloonSize: number;
}

export const SecurePDFViewer = ({
  file,
  pdfUrl,
  balloons,
  isAnnotating,
  onAddBalloon,
  onRemoveBalloon,
  onUpdateBalloon,
  onUpdateBalloonNumber,
  onUpdateBalloonNote,
  balloonSize
}: SecurePDFViewerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [draggedBalloon, setDraggedBalloon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; balloonId: string } | null>(null);
  const [editingBalloon, setEditingBalloon] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Don't add balloon if we just finished dragging, if not in annotating mode, or if context menu is open
    if (!isAnnotating || !overlayRef.current || isDragging || contextMenu || editingBalloon) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    // Prevent multiple balloons from double-clicking (within 300ms)
    if (timeDiff < 300) {
      return;
    }

    // Clear any existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Store click position immediately to avoid stale event data
    const rect = overlayRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Debounce the click to prevent rapid-fire balloon creation
    clickTimeoutRef.current = setTimeout(() => {
      onAddBalloon(x, y);
      setLastClickTime(currentTime);
    }, 100);
  };

  const handleBalloonMouseDown = (event: React.MouseEvent, balloonId: string) => {
    event.stopPropagation();
    
    // Cancel any pending balloon creation
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    const balloon = balloons.find(b => b.id === balloonId);
    if (!balloon) return;

    setDraggedBalloon(balloonId);
    setIsDragging(true);
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
    
    // Add a small delay before allowing new balloons to be added
    // This prevents accidental balloon creation after drag
    if (isDragging) {
      setTimeout(() => {
        setIsDragging(false);
      }, 100);
    }
  };

  const handleBalloonRightClick = (event: React.MouseEvent, balloonId: string) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Smart positioning to keep menu on screen
    const menuWidth = 140;
    const menuHeight = 80;
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Adjust if menu would go off right edge
    if (x + menuWidth > rect.width) {
      x = rect.width - menuWidth;
    }

    // Adjust if menu would go off bottom edge
    if (y + menuHeight > rect.height) {
      y = rect.height - menuHeight;
    }

    setContextMenu({
      x: Math.max(0, x),
      y: Math.max(0, y),
      balloonId
    });
  };

  const startEditingNumber = (balloonId: string) => {
    const balloon = balloons.find(b => b.id === balloonId);
    if (balloon) {
      setEditingBalloon(balloonId);
      setEditNumber(balloon.number.toString());
      setContextMenu(null);
    }
  };

  const saveEditedNumber = () => {
    if (editingBalloon && editNumber) {
      const newNumber = parseInt(editNumber);
      if (!isNaN(newNumber) && newNumber > 0) {
        onUpdateBalloonNumber(editingBalloon, newNumber);
      }
    }
    setEditingBalloon(null);
    setEditNumber('');
  };

  const cancelEditing = () => {
    setEditingBalloon(null);
    setEditNumber('');
  };

  const startEditingNote = (balloonId: string) => {
    const balloon = balloons.find(b => b.id === balloonId);
    if (balloon) {
      setEditingNote(balloonId);
      setNoteText(balloon.note || '');
      setContextMenu(null);
    }
  };

  const saveEditedNote = () => {
    if (editingNote) {
      onUpdateBalloonNote(editingNote, noteText);
    }
    setEditingNote(null);
    setNoteText('');
  };

  const cancelNoteEditing = () => {
    setEditingNote(null);
    setNoteText('');
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const renderBalloon = (balloon: BalloonAnnotation) => {
    // Dynamic sizing based on balloonSize (1-5)
    const sizeMap = {
      1: { width: 12, height: 12, fontSize: 6 },   // Very tiny
      2: { width: 16, height: 16, fontSize: 8 },   // Tiny
      3: { width: 20, height: 20, fontSize: 10 },  // Small
      4: { width: 24, height: 24, fontSize: 12 },  // Medium
      5: { width: 28, height: 28, fontSize: 14 }   // Large
    };
    
    const size = sizeMap[balloonSize as keyof typeof sizeMap] || sizeMap[3];
    
    // ✅ Fix transform conflicts - create proper transforms for each shape
    const getTransformStyle = (style: string) => {
      const baseTransform = 'translate(-50%, -50%)'; // Center the balloon
      
      switch (style) {
        case 'circle':
        case 'square':
          return baseTransform;
        case 'diamond':
          return `${baseTransform} rotate(45deg)`; // Combine centering + rotation
        default:
          return baseTransform;
      }
    };

    // ✅ Ensure text is ALWAYS upright (no rotation conflicts)
    const getTextTransform = () => {
      return 'none'; // Force no rotation on text elements
    };

    const getShapeClasses = (style: string) => {
      switch (style) {
        case 'circle':
          return "rounded-full";
        case 'square':
          return "rounded-none";
        case 'diamond':
          return "rounded-none"; // No transform in class, handled by style
        default:
          return "rounded-full";
      }
    };

    const isEditing = editingBalloon === balloon.id;

    return (
      <div 
        key={balloon.id}
        className="absolute"
        style={{
          left: `${balloon.x}%`,
          top: `${balloon.y}%`,
          zIndex: 20
        }}
      >
        <div
          className={`balloon-shape cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center text-white font-bold border border-white shadow-md ${getShapeClasses(balloon.style)} ${isEditing ? 'ring-2 ring-blue-400' : ''}`}
          style={{
            backgroundColor: balloon.color,
            width: `${size.width}px`,
            height: `${size.height}px`,
            fontSize: `${size.fontSize}px`,
            // ✅ Use clean transform without conflicts
            transform: getTransformStyle(balloon.style)
          }}
          onMouseDown={(e) => !isEditing && handleBalloonMouseDown(e, balloon.id)}
          onContextMenu={(e) => handleBalloonRightClick(e, balloon.id)}
          title={isEditing ? "Editing balloon number" : `Balloon ${balloon.number}${balloon.note ? ' (has note)' : ''} - Right-click for options`}
        >
          {isEditing ? (
            <input
              type="number"
              min="1"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              onBlur={saveEditedNumber}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEditedNumber();
                if (e.key === 'Escape') cancelEditing();
              }}
              className="text-center border-0 bg-transparent text-white font-bold outline-none"
              style={{ 
                fontSize: `${size.fontSize}px`, 
                backgroundColor: 'transparent',
                width: `${size.width}px`,
                height: `${size.height}px`,
                // ✅ NO rotation on text - keep it always upright
                transform: getTextTransform(),
                position: 'relative',
                zIndex: 1
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="balloon-number"
              style={{
                // ✅ Perfect centering for balloon numbers
                transform: getTextTransform(),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                lineHeight: '1',
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: 1,
                textAlign: 'center'
              }}
            >
              {balloon.label}
            </span>
          )}
          
        </div>
        
        {/* Note text displayed directly adjacent to balloon */}
        {balloon.note && balloon.note.trim() && !isEditing && (
          <div
            className="balloon-note-text absolute text-xs font-bold tracking-wide"
            style={{
              left: `${size.width/2 + 6}px`, // Slight margin
              top: `${-size.height/2 - 2}px`,
              zIndex: 30,
              whiteSpace: 'nowrap',
              width: 'max-content',
              color: balloon.color
            }}
          >
            {balloon.note}
          </div>
        )}
      </div>
    );
  };

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

  // Handle PDF URL - either from file or direct URL
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(null);
  const [shouldCleanupUrl, setShouldCleanupUrl] = useState(false);

  useEffect(() => {
    if (pdfUrl) {
      // Use the provided URL (from Supabase)
      setLocalPdfUrl(pdfUrl);
      setShouldCleanupUrl(false);
    } else if (file) {
      // Create blob URL from file
      try {
        const blobUrl = URL.createObjectURL(file);
        setLocalPdfUrl(blobUrl);
        setShouldCleanupUrl(true);
      } catch (error) {
        setLocalPdfUrl(null);
      }
    } else {
      setLocalPdfUrl(null);
    }

    return () => {
      if (shouldCleanupUrl && localPdfUrl) {
        URL.revokeObjectURL(localPdfUrl);
      }
    };
  }, [file, pdfUrl]);

  // PDF.js rendering effect
  useEffect(() => {
    if (!localPdfUrl) return;

    const renderPDF = async () => {
      try {
        // ✅ Setup PDF.js with local worker (Turbopack safe)
        const pdfjsLib = await setupPDFWorker();

        // Get canvas element
        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        const container = document.getElementById('pdf-container') as HTMLDivElement;
        
        if (!canvas || !container) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // ✅ Load PDF with CORS enabled
        const loadingTask = pdfjsLib.getDocument({
          url: localPdfUrl,
          withCredentials: false,
          // ✅ Enable CORS headers to prevent canvas tainting
          httpHeaders: {
            'Access-Control-Allow-Origin': '*'
          },
          // ✅ Disable range requests for better CORS compatibility
          disableRange: true,
          disableStream: true
        });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Calculate scale to fit container
        const containerRect = container.getBoundingClientRect();
        const viewport = page.getViewport({ scale: 1.0 });
        
        // ✅ Calculate base scale for container fit
        const scaleX = (containerRect.width - 10) / viewport.width;
        const scaleY = (containerRect.height - 10) / viewport.height;
        const baseScale = Math.min(scaleX, scaleY, 3.0);
        
        // ✅ Use normal resolution for proper export scaling
        const devicePixelRatio = window.devicePixelRatio || 1;
        const scale = baseScale * devicePixelRatio; // Normal resolution for export compatibility
        

        const scaledViewport = page.getViewport({ scale });

        // ✅ Set ultra-high resolution canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // ✅ Scale down display size while keeping good internal resolution
        const displayWidth = scaledViewport.width / devicePixelRatio;
        const displayHeight = scaledViewport.height / devicePixelRatio;
        
        // ✅ Center the canvas properly within container
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const canvasLeft = (containerWidth - displayWidth) / 2;
        const canvasTop = (containerHeight - displayHeight) / 2;
        
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.left = `${Math.max(0, canvasLeft)}px`;
        canvas.style.top = `${Math.max(0, canvasTop)}px`;
        canvas.style.width = `${displayWidth}px`; // ✅ Set display size
        canvas.style.height = `${displayHeight}px`; // ✅ Set display size
        canvas.style.zIndex = '1';
        // ✅ CRITICAL: Use high-quality image rendering for zoom
        canvas.style.imageRendering = 'high-quality';
        canvas.style.imageRendering = '-webkit-optimize-contrast';
        canvas.style.imageRendering = 'crisp-edges';
        canvas.style.imageRendering = 'pixelated'; // Fallback

        // ✅ Enable ULTRA high-quality canvas rendering for zoom
        context.imageSmoothingEnabled = true; // Enable smoothing for high-res zoom
        context.imageSmoothingQuality = 'high'; // Best quality smoothing
        
        
        // ✅ Render PDF with high-quality settings
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
          canvas: canvas
        };

        const renderTask = page.render(renderContext);
        
        // ✅ Wait for render completion before marking as loaded
        await renderTask.promise;
        
        // ✅ Store render completion state for export timing
        (canvas as any).pdfRenderComplete = true;
        setIsLoaded(true);
        

      } catch (error) {
        console.error('PDF rendering error:', error);
        setIsLoaded(false);
      }
    };

    renderPDF();
  }, [localPdfUrl]);

  const minHeight = '80vh';

  // Don't render if no PDF URL is available
  if (!localPdfUrl) {
    return (
      <div 
        className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8"
        style={{ minHeight }}
      >
        <FileText className="w-20 h-20 text-gray-400 mb-6" />
        <h3 className="text-xl font-medium text-gray-600 mb-2 text-center">
          No PDF Available
        </h3>
        <p className="text-gray-500 text-center">
          Please upload a PDF file to begin creating balloon diagrams.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full bg-gray-50 overflow-hidden"
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
            href={localPdfUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors max-w-sm w-full"
          >
            <ExternalLink className="w-5 h-5" />
            Open PDF
          </a>
        </div>
      ) : (
        /* Desktop: Show PDF viewer with annotation overlay */
        <div className="relative w-full overflow-hidden" style={{ height: minHeight }}>
          {/* PDF.js Canvas Renderer */}
          <div 
            id="pdf-container" 
            className="relative w-full h-full bg-white flex items-center justify-center"
            style={{ minHeight }}
          >
            <canvas 
              id="pdf-canvas"
              className="max-w-full max-h-full object-contain"
              style={{ 
                display: 'block',
                position: 'absolute',
                zIndex: 1
                // ✅ Position will be calculated dynamically for centering
              }}
            />
            {!isLoaded && (
              <div className="text-center">
                <FileText className="w-16 h-16 text-teal-600 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600 font-medium">Loading PDF...</p>
              </div>
            )}
          </div>
        
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
          style={{ 
            pointerEvents: isAnnotating || balloons.length > 0 ? 'auto' : 'none',
            zIndex: 10 // ✅ Ensure balloons appear above PDF canvas
          }}
          data-balloon-overlay="true"
        >
          {/* Render all balloons */}
          {balloons.map(renderBalloon)}
          
          {/* Context Menu */}
          {contextMenu && (
            <div
              className="absolute bg-white border border-gray-300 rounded-lg shadow-xl py-1 z-[100] min-w-[140px]"
              style={{
                left: `${contextMenu.x}px`,
                top: `${contextMenu.y}px`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => startEditingNumber(contextMenu.balloonId)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 transition-colors"
              >
                <span className="text-blue-600 text-base">📝</span>
                <span className="text-gray-700">Edit Number</span>
              </button>
              <button
                onClick={() => startEditingNote(contextMenu.balloonId)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-green-50 flex items-center gap-2 transition-colors"
              >
                <span className="text-green-600 text-base">💬</span>
                <span className="text-gray-700">Add Note</span>
              </button>
              <div className="border-t border-gray-100"></div>
              <button
                onClick={() => {
                  const balloon = balloons.find(b => b.id === contextMenu.balloonId);
                  const balloonNumber = balloon?.number || '';
                  const confirmMessage = balloon?.note 
                    ? `Delete Balloon ${balloonNumber} and its note?\n\nNote: "${balloon.note}"`
                    : `Delete Balloon ${balloonNumber}?`;
                  
                  if (window.confirm(confirmMessage)) {
                    onRemoveBalloon(contextMenu.balloonId);
                  }
                  closeContextMenu();
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors"
              >
                <span className="text-red-600 text-base">🗑️</span>
                <span>Delete Balloon</span>
              </button>
            </div>
          )}

          {/* Note Editor Modal */}
          {editingNote && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[110]">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Add Note for Balloon #{balloons.find(b => b.id === editingNote)?.number}
                  </h3>
                  <button
                    onClick={cancelNoteEditing}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note or remarks here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={cancelNoteEditing}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}
          
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