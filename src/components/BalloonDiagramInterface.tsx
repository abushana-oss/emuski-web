'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  FileText,
  X,
  User,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditDisplay } from '@/components/CreditDisplay';
import CommunityButton from '@/components/CommunityButton';
import { useAuth } from '@/components/auth/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SecurePDFViewer } from '@/components/SecurePDFViewer';
import { BalloonToolbar } from '@/components/BalloonToolbar';
import { BalloonAPI, type BalloonProject } from '@/lib/balloon-api';
import Link from 'next/link';

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

export default function BalloonDiagramInterface() {
  const { user, isAuthenticated } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balloons, setBalloons] = useState<BalloonAnnotation[]>([]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [balloonCounter, setBalloonCounter] = useState(1);
  const [selectedBalloonStyle, setSelectedBalloonStyle] = useState<'circle' | 'square' | 'diamond'>('circle');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [balloonSize, setBalloonSize] = useState(3); // Size from 1-5
  const [creditInfo, setCreditInfo] = useState<{ remaining: number; limit: number; resetTime?: string } | null>(null);
  const [currentProject, setCurrentProject] = useState<BalloonProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [availableProjects, setAvailableProjects] = useState<BalloonProject[]>([]);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [lastExportTime, setLastExportTime] = useState<number>(0);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!currentProject || !isAuthenticated || balloons.length === 0) return;
    
    setIsSaving(true);
    try {
      const success = await BalloonAPI.saveAllAnnotations(currentProject.id, balloons);
      if (success) {
        setLastSaved(new Date());
      }
    } catch (error) {
      // Auto-save failed silently
    } finally {
      setIsSaving(false);
    }
  }, [currentProject, isAuthenticated, balloons]);

  // Debounced auto-save when balloons change
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (currentProject && balloons.length > 0) {
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 2000); // Save 2 seconds after last change
    }
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [balloons, autoSave, currentProject]);

  // Initialize credit info and check for recent project with balloons
  useEffect(() => {
    if (isAuthenticated) {
      // Set up credit system
      setCreditInfo({
        remaining: 10, // Allow 10 balloon annotations per day
        limit: 10,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      // Load recent project only if it has balloons (user was working on something)
      loadRecentProjectWithBalloons();
    }
  }, [isAuthenticated]);

  const loadRecentProject = useCallback(async () => {
    try {
      const projects = await BalloonAPI.getProjects();
      if (projects.length > 0) {
        const recentProject = projects[0]; // Most recent project
        
        // Load project details with annotations
        const projectWithAnnotations = await BalloonAPI.getProject(recentProject.id);
        if (projectWithAnnotations) {
          setCurrentProject(projectWithAnnotations);
          
          // Load annotations if they exist
          if (projectWithAnnotations.annotations && projectWithAnnotations.annotations.length > 0) {
            setBalloons(projectWithAnnotations.annotations);
            setBalloonCounter(Math.max(...projectWithAnnotations.annotations.map(a => a.number), 0) + 1);
          } else {
            setBalloons([]);
            setBalloonCounter(1);
          }
          
          // Set PDF URL directly from Supabase storage
          setPdfUrl(projectWithAnnotations.pdf_file_url);
          
          // Create a file object for display purposes
          setUploadedFile({
            name: projectWithAnnotations.pdf_file_name,
            size: projectWithAnnotations.pdf_file_size,
            type: 'application/pdf',
            lastModified: new Date(projectWithAnnotations.updated_at).getTime()
          } as File);
          
          setLastSaved(new Date(projectWithAnnotations.updated_at));
        }
      }
    } catch (error) {
      // Error loading recent project
    }
  }, []);

  const loadRecentProjectWithBalloons = useCallback(async () => {
    try {
      const projects = await BalloonAPI.getProjects();
      
      if (projects.length > 0) {
        const recentProject = projects[0]; // Most recent project
        
        // Load project details with annotations
        const projectWithAnnotations = await BalloonAPI.getProject(recentProject.id);
        
        // Check if project was created recently (within last hour) or has balloons
        const projectAge = new Date().getTime() - new Date(recentProject.created_at).getTime();
        const isRecentUpload = projectAge < 60 * 60 * 1000; // 1 hour
        const hasBalloons = projectWithAnnotations?.annotations && projectWithAnnotations.annotations.length > 0;
        
        if (projectWithAnnotations && (isRecentUpload || hasBalloons)) {
          setCurrentProject(projectWithAnnotations);
          
          // Load annotations if they exist
          if (projectWithAnnotations.annotations && projectWithAnnotations.annotations.length > 0) {
            setBalloons(projectWithAnnotations.annotations);
            setBalloonCounter(Math.max(...projectWithAnnotations.annotations.map(a => a.number), 0) + 1);
          } else {
            setBalloons([]);
            setBalloonCounter(1);
          }
          
          // Set PDF URL directly from Supabase storage
          setPdfUrl(projectWithAnnotations.pdf_file_url);
          
          // Create a file object for display purposes
          setUploadedFile({
            name: projectWithAnnotations.pdf_file_name,
            size: projectWithAnnotations.pdf_file_size,
            type: 'application/pdf',
            lastModified: new Date(projectWithAnnotations.updated_at).getTime()
          } as File);
          
          setLastSaved(new Date(projectWithAnnotations.updated_at));
        }
      }
    } catch (error) {
      // Error loading recent project
    }
  }, []);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size must be less than 50MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    
    try {
      let projectId = null;
      
      // Enable Supabase upload for authenticated users
      if (isAuthenticated) {
        try {
          const pdfUrl = await BalloonAPI.uploadPDFFile(file, file.name);
          if (!pdfUrl) {
            throw new Error('Failed to upload PDF file');
          }

          const project = await BalloonAPI.createProject({
            name: file.name.replace('.pdf', ''),
            description: 'Balloon diagram project',
            pdf_file_name: file.name,
            pdf_file_url: pdfUrl,
            pdf_file_size: file.size
          });

          if (project) {
            setCurrentProject(project);
          }
        } catch (uploadError) {
          // Continue with local storage if upload fails
        }
      }
      
      // Create a blob URL for immediate viewing
      const blobUrl = URL.createObjectURL(file);
      setPdfUrl(blobUrl);
      setUploadedFile(file);
      setBalloons([]);
      setBalloonCounter(1);
      
    } catch (error) {
      setError('Failed to process PDF file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [isAuthenticated]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setError(null);
      setUploadedFile(file);
      try {
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
      } catch (error) {
        setError('Failed to load PDF file. Please try again.');
      }
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const addBalloon = useCallback((x: number, y: number) => {
    if (!isAnnotating) return;

    const newBalloon: BalloonAnnotation = {
      id: `balloon-${Date.now()}`,
      x,
      y,
      number: balloonCounter,
      label: balloonCounter.toString(),
      style: selectedBalloonStyle,
      color: selectedColor,
      note: ''
    };

    setBalloons(prev => [...prev, newBalloon]);
    setBalloonCounter(prev => prev + 1);
  }, [isAnnotating, balloonCounter, selectedBalloonStyle, selectedColor]);

  const removeBalloon = useCallback((id: string) => {
    setBalloons(prev => {
      const balloonToRemove = prev.find(b => b.id === id);
      if (!balloonToRemove) return prev;
      
      // Remove the balloon and renumber remaining ones
      const filtered = prev.filter(balloon => balloon.id !== id);
      return filtered
        .sort((a, b) => a.number - b.number)
        .map((balloon, index) => ({
          ...balloon,
          number: index + 1,
          label: (index + 1).toString()
        }));
    });
    
    // Update counter to next available number
    setBalloonCounter(prev => Math.max(1, prev - 1));
  }, []);

  const updateBalloon = useCallback((id: string, updates: Partial<BalloonAnnotation>) => {
    setBalloons(prev => prev.map(balloon => 
      balloon.id === id ? { ...balloon, ...updates } : balloon
    ));
  }, []);

  const updateBalloonNumber = useCallback((id: string, newNumber: number) => {
    setBalloons(prev => {
      const balloonToEdit = prev.find(b => b.id === id);
      if (!balloonToEdit || newNumber < 1 || newNumber > prev.length) return prev;

      // Create a copy and update the balloon number
      const updated = prev.map(balloon => 
        balloon.id === id 
          ? { ...balloon, number: newNumber, label: newNumber.toString() }
          : balloon
      );

      // Sort by number and renumber sequentially
      return updated
        .sort((a, b) => a.number - b.number)
        .map((balloon, index) => ({
          ...balloon,
          number: index + 1,
          label: (index + 1).toString()
        }));
    });
  }, []);

  const updateBalloonNote = useCallback((id: string, note: string) => {
    setBalloons(prev => prev.map(balloon => 
      balloon.id === id ? { ...balloon, note } : balloon
    ));
  }, []);

  const exportDiagram = useCallback(async () => {
    if (!pdfUrl || !uploadedFile || balloons.length === 0 || isExporting) return;
    
    // Production-quality rate limiting: Allow export only every 10 seconds
    const now = Date.now();
    const timeSinceLastExport = now - lastExportTime;
    const rateLimit = 10000; // 10 seconds for production quality
    
    if (timeSinceLastExport < rateLimit) {
      const remainingTime = Math.ceil((rateLimit - timeSinceLastExport) / 1000);
      setExportMessage(`Rate limited. Please wait ${remainingTime} seconds before next download.`);
      setTimeout(() => setExportMessage(null), 4000);
      return;
    }
    
    try {
      setIsExporting(true);
      setExportMessage('Generating high-quality diagram...');
      setLastExportTime(now);
      
      // Try to render the actual PDF content to canvas using PDF.js
      try {
        // Import PDF.js with correct worker setup
        const pdfjsLib = await import('pdfjs-dist/build/pdf');
        
        // Use local worker to avoid version mismatch
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
        
        // Load the PDF
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdfDoc = await loadingTask.promise;
        const page = await pdfDoc.getPage(1);
        
        // Get overlay dimensions for proper scaling
        const overlay = document.querySelector('[data-balloon-overlay="true"]') as HTMLElement;
        if (!overlay) {
          throw new Error('Cannot find overlay element');
        }
        
        const overlayRect = overlay.getBoundingClientRect();
        
        // Create canvas with exact overlay dimensions
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Cannot get canvas context');
        }
        
        // Set canvas to match overlay size with high resolution
        const scaleFactor = 2;
        canvas.width = overlayRect.width * scaleFactor;
        canvas.height = overlayRect.height * scaleFactor;
        
        // Calculate the exact scaling to match what's shown in the viewer
        const pdfPage = page.getViewport({ scale: 1 });
        const pdfAspectRatio = pdfPage.width / pdfPage.height;
        const viewerAspectRatio = overlayRect.width / overlayRect.height;
        
        let renderWidth, renderHeight, offsetX = 0, offsetY = 0;
        
        if (pdfAspectRatio > viewerAspectRatio) {
          // PDF is wider than viewer - fit by width
          renderWidth = canvas.width;
          renderHeight = canvas.width / pdfAspectRatio;
          offsetY = (canvas.height - renderHeight) / 2;
        } else {
          // PDF is taller than viewer - fit by height
          renderHeight = canvas.height;
          renderWidth = canvas.height * pdfAspectRatio;
          offsetX = (canvas.width - renderWidth) / 2;
        }
        
        const scale = renderWidth / pdfPage.width;
        const viewport = page.getViewport({ scale });
        
        // Render PDF page to canvas with proper positioning
        const renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport,
          transform: [1, 0, 0, 1, offsetX, offsetY]
        });
        
        await renderTask.promise;
        
        // Now overlay balloons with precise coordinate mapping
        const sizeMap = {
          1: { width: 16, height: 16, fontSize: 8 },
          2: { width: 20, height: 20, fontSize: 10 },
          3: { width: 24, height: 24, fontSize: 12 },
          4: { width: 28, height: 28, fontSize: 14 },
          5: { width: 32, height: 32, fontSize: 16 }
        };
        
        const size = sizeMap[balloonSize as keyof typeof sizeMap] || sizeMap[3];
        
        // Draw balloons with exact coordinate mapping
        balloons.forEach((balloon) => {
          // Direct 1:1 mapping for exact positioning
          const balloonX = (balloon.x / 100) * canvas.width;
          const balloonY = (balloon.y / 100) * canvas.height;
          
          const balloonRadius = size.width * scaleFactor / 2;
          const fontSize = size.fontSize * scaleFactor;
          
          // Draw balloon shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(balloonX + 3, balloonY + 3, balloonRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw balloon circle
          ctx.fillStyle = balloon.color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          
          ctx.beginPath();
          ctx.arc(balloonX, balloonY, balloonRadius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          
          // Draw number
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Draw text outline for visibility
          ctx.strokeText(balloon.label, balloonX, balloonY);
          ctx.fillText(balloon.label, balloonX, balloonY);
          
          // Add highlighted note directly adjacent to balloon
          if (balloon.note && balloon.note.trim()) {
            const noteX = balloonX + balloonRadius;
            const noteY = balloonY + balloonRadius + 8;
            
            const noteText = balloon.note.length > 20 ? balloon.note.substring(0, 20) + '...' : balloon.note;
            const noteFontSize = fontSize * 0.7;
            
            // Measure text width for background
            ctx.font = `${noteFontSize}px Arial`;
            const textMetrics = ctx.measureText(noteText);
            const textWidth = textMetrics.width;
            
            // Draw highlight background
            ctx.fillStyle = '#000000';
            ctx.fillRect(noteX - 2, noteY - noteFontSize/2 - 2, textWidth + 4, noteFontSize + 4);
            
            // Draw note text with white color
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(noteText, noteX, noteY);
          }
        });
        
        // Download the result
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${uploadedFile.name.replace('.pdf', '')}_with_balloons.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Show success popup
            setShowCelebration(true);
            setExportMessage(null);
            
            // Hide celebration after 4 seconds
            setTimeout(() => {
              setShowCelebration(false);
            }, 4000);
          } else {
            throw new Error('Failed to create blob');
          }
        }, 'image/png');
        
      } catch (pdfError) {
        
        // Fallback: try to use getDisplayMedia API for screen capture
        try {
          // @ts-ignore - getDisplayMedia might not be fully typed
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { mediaSource: 'screen' }
          });
          
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          video.addEventListener('loadedmetadata', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              
              ctx.drawImage(video, 0, 0);
              
              // Stop the stream
              stream.getTracks().forEach(track => track.stop());
              
              // Download
              canvas.toBlob((blob: Blob | null) => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${uploadedFile.name.replace('.pdf', '')}_screen_capture.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  
                  // Show success popup
                  setShowCelebration(true);
                  setExportMessage(null);
                  
                  // Hide celebration after 4 seconds
                  setTimeout(() => {
                    setShowCelebration(false);
                  }, 4000);
                } else {
                  throw new Error('Screen capture failed');
                }
              }, 'image/png');
            }
          });
          
        } catch (screenCaptureError) {
          
          // Final fallback: simple instruction message
          setExportMessage('Download failed. Please try again.');
          setTimeout(() => setExportMessage(null), 3000);
        } finally {
          setIsExporting(false);
        }
      }
      
    } catch (error) {
      setExportMessage('Download failed. Please try again.');
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  }, [pdfUrl, uploadedFile, balloons, balloonSize, lastExportTime, isExporting]);


  const clearAllBalloons = useCallback(() => {
    setBalloons([]);
    setBalloonCounter(1);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-6 p-8">
          <div className="mb-8">
            <FileText className="h-16 w-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">2D Balloon Diagram Tool</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Create interactive balloon diagrams for your 2D technical drawings and PDF documents.
            </p>
          </div>
          
          <Alert className="max-w-md mx-auto">
            <User className="h-4 w-4" />
            <AlertDescription>
              Please sign in with your corporate email to access the 2D Balloon Diagram Tool. Personal emails (Gmail, Yahoo, etc.) are not permitted.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {!pdfUrl ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <FileText className="h-16 w-16 text-teal-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Upload Your Technical Drawing
                </h2>
                <p className="text-gray-600">
                  Upload a PDF file to start creating balloon diagrams
                </p>
              </div>

              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-500 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Drop your PDF here, or click to browse
                </h3>
                <p className="text-gray-500 mb-4">
                  Supports PDF files up to 50MB
                </p>
                <Button disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Select PDF File'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {uploadedFile?.name}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const confirmMessage = balloons.length > 0 
                        ? `Remove PDF and lose all ${balloons.length} balloon annotation(s)?`
                        : 'Remove PDF?';
                      
                      if (window.confirm(confirmMessage)) {
                        if (pdfUrl && pdfUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(pdfUrl);
                        }
                        setPdfUrl(null);
                        setUploadedFile(null);
                        setBalloons([]);
                        setBalloonCounter(1);
                        setError(null);
                        setCurrentProject(null);
                        setLastSaved(null);
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {balloons.length} balloon{balloons.length !== 1 ? 's' : ''}
                    </span>
                    {isAuthenticated && (
                      <div className="flex items-center gap-1">
                        {isSaving ? (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </div>
                        ) : lastSaved ? (
                          <span className="text-xs text-green-600">
                            Saved {lastSaved.toLocaleTimeString()}
                          </span>
                        ) : currentProject ? (
                          <span className="text-xs text-gray-500">Ready to save</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllBalloons}
                    disabled={balloons.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {exportMessage && (
                <Alert className="mb-4">
                  <AlertDescription>{exportMessage}</AlertDescription>
                </Alert>
              )}

              {/* Success Popup Screen */}
              {showCelebration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center">
                    {/* Close X button */}
                    <button
                      onClick={() => setShowCelebration(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
                      <p className="text-gray-600 mb-4">Your diagram has been downloaded successfully!</p>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                        <Download className="w-4 h-4" />
                        <span>{uploadedFile?.name.replace('.pdf', '')}_with_balloons.png</span>
                      </div>
                      
                      <Button
                        onClick={() => setShowCelebration(false)}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        Continue Working
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <BalloonToolbar
                isAnnotating={isAnnotating}
                onToggleAnnotating={setIsAnnotating}
                selectedStyle={selectedBalloonStyle}
                onStyleChange={setSelectedBalloonStyle}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                balloonCounter={balloonCounter}
                balloonSize={balloonSize}
                onSizeChange={setBalloonSize}
              />

              <div ref={containerRef} className="border rounded-lg overflow-hidden bg-white shadow-lg" style={{ overflow: 'hidden' }}>
                <SecurePDFViewer
                  file={uploadedFile}
                  pdfUrl={pdfUrl}
                  balloons={balloons}
                  isAnnotating={isAnnotating}
                  onAddBalloon={addBalloon}
                  onRemoveBalloon={removeBalloon}
                  onUpdateBalloon={updateBalloon}
                  onUpdateBalloonNumber={updateBalloonNumber}
                  onUpdateBalloonNote={updateBalloonNote}
                  balloonSize={balloonSize}
                />
              </div>

              {/* Download Section */}
              {balloons.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-teal-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Ready to Download</h4>
                        <p className="text-sm text-gray-600">{balloons.length} balloon{balloons.length !== 1 ? 's' : ''} created</p>
                      </div>
                    </div>
                    <Button
                      onClick={exportDiagram}
                      className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                      disabled={balloons.length === 0 || isExporting}
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Diagram
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}