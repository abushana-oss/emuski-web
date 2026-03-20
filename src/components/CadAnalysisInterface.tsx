'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Box,
  X,
  User,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CadViewer } from './CadViewer';
import { CreditDisplay } from './CreditDisplay';
import CommunityButton from './CommunityButton';
import { useAuth } from './auth/AuthProvider';
import { cadAnalysisApi, type CadPart, supabase } from '@/lib/supabase';
import { PerformanceOptimizer } from '@/lib/performance-optimizer';
import Link from 'next/link';

interface RealTimeGeometryProperties {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volume: number;
  surfaceArea: number;
  boundingBoxVolume: number;
  meshComplexity: {
    vertices: number;
    faces: number;
    edges: number;
  };
  wallThickness: {
    min: number;
    max: number;
    average: number;
  };
  manufacturingProcess?: string;
  recommendedMaterial?: string;
  surfaceFinish?: string;
  threadAnalysis?: string;
  holeAnalysis?: {
    count: number;
    sizes: number[];
    types: string[];
  };
  threadFeatures?: {
    count: number;
    specifications: string[];
    locations: Array<{x: number, y: number, z: number}>;
  };
  recognizedFeatures?: {
    pockets: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    slots: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    bosses: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    ribs: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    fillets: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    chamfers: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    threads: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    walls: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    drafts: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    undercuts: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
    textEngraving: { count: number; features: any[]; totalVolume: number; avgConfidence: number; };
  };
}

interface PartData {
  id: string;
  name: string;
  fileName: string;
  fileExtension: string;
  volume: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  measurement: string;
  process: string;
  material: string;
  finish: string;
  tolerance: string;
  threads: string;
  inspection: string;
  quantity: number;
  suggestions: number;
  cadFileUrl?: string;
  rawFile?: File;
  drawingFileUrls?: string[];
  realTimeGeometry?: RealTimeGeometryProperties;
  units: 'mm' | 'cm' | 'm' | 'in';
  weight?: number;
  surfaceArea?: number;
}

const getFeatureConfig = (featureType: string) => {
  // Colors matching CadViewer.tsx getFeatureColor function exactly
  const configs: Record<string, {name: string, color: string, description: string}> = {
    'pockets': { name: 'pocket', color: 'rgb(68, 68, 255)', description: 'Pocket Milling' },            // 0x4444FF  
    'slots': { name: 'slot', color: 'rgb(68, 255, 255)', description: 'Slot Cutting' },                // 0x44FFFF
    'holes': { name: 'hole', color: 'rgb(255, 165, 0)', description: 'Hole Drilling' },               // 0xFFA500
    'bosses': { name: 'boss', color: 'rgb(255, 68, 255)', description: 'Boss Machining' },             // 0xFF44FF
    'ribs': { name: 'rib', color: 'rgb(255, 255, 68)', description: 'Rib Feature' },                  // 0xFFFF44
    'fillets': { name: 'fillet', color: 'rgb(68, 255, 68)', description: 'Fillet/Round' },      // 0x44FF44
    'chamfers': { name: 'chamfer', color: 'rgb(255, 136, 68)', description: 'Chamfer Edge' },          // 0xFF8844
    'threads': { name: 'thread', color: 'rgb(136, 68, 255)', description: 'Thread Cutting' },          // 0x8844FF
    'walls': { name: 'wall', color: 'rgb(136, 255, 68)', description: 'Wall Feature' },               // 0x88FF44
    'drafts': { name: 'draft', color: 'rgb(255, 136, 136)', description: 'Draft Angle' },              // 0xFF8888
    'undercuts': { name: 'undercut', color: 'rgb(255, 0, 0)', description: 'Undercut Feature' },       // 0xFF0000
    'textEngraving': { name: 'text', color: 'rgb(136, 136, 136)', description: 'Text Engraving' }     // 0x888888
  };
  
  return configs[featureType] || { name: featureType, color: 'rgb(156, 163, 175)', description: 'Manufacturing Feature' };
};

export const CadAnalysisInterface = () => {
  const [parts, setParts] = useState<PartData[]>([]);
  const cadFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ stage: '', progress: 0 });
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [creditInfo, setCreditInfo] = useState<{
    remaining: number;
    limit: number;
    resetTime: string;
    timeUntilReset: number;
  } | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Load saved parts and credit info on component mount
  useEffect(() => {
    loadSavedParts();
    loadCreditInfo();
    
    // Initialize performance optimizations
    PerformanceOptimizer.optimizeForCoreWebVitals();
    PerformanceOptimizer.preloadCriticalResources();
    PerformanceOptimizer.optimizeImages();
  }, [user]);

  // Load credit information - only for authenticated users
  const loadCreditInfo = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      // No credit info for unauthenticated users
      setCreditInfo(null);
      return;
    }

    const abortController = new AbortController();
    
    try {
      // Get current session - no retries
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.access_token) {
        console.warn('Session authentication failed:', sessionError?.message || 'No access token');
        setCreditInfo(null);
        return;
      }

      // Call API with proper JWT Bearer token
      const response = await fetch('/api/credits/status', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        signal: abortController.signal
      });

      if (abortController.signal.aborted) {
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setCreditInfo({
          remaining: data.creditsRemaining,
          limit: data.creditsLimit,
          resetTime: data.nextResetTime,
          timeUntilReset: data.hoursUntilReset
        });
      } else {
        // Show specific error to user instead of retrying
        console.error(`Credit system error: ${response.status} ${response.statusText}`);
        setCreditInfo(null);
      }
    } catch (error: any) {
      // Only log if not an abort error
      if (error.name !== 'AbortError') {
        console.warn('Failed to load credit info:', error);
      }
      
      // Don't set fallback data if request was aborted
      if (!abortController.signal.aborted) {
        console.warn('Credit system error, setting to null');
        setCreditInfo(null);
      }
    }
    
    // Cleanup
    return () => {
      abortController.abort();
    };
  }, [isAuthenticated, user?.id]);

  // Listen for credit refresh messages from CadViewer
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'refreshCredits') {
        console.log('📢 Received refresh credits message, reloading credit info');
        // Add small delay to ensure any auth token refresh is complete
        setTimeout(() => {
          loadCreditInfo();
        }, 100);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loadCreditInfo]);

  // Credit deduction is handled server-side for authenticated users

  const loadSavedParts = async () => {
    try {
      setIsLoading(true);
      const savedParts = await cadAnalysisApi.getParts();
      
      console.log('Loaded saved parts:', savedParts); // Debug log
      
      if (savedParts && savedParts.length > 0) {
        // Convert CadPart to PartData format following industry data mapping standards
        const convertedParts: PartData[] = savedParts.filter(savedPart => {
          // First, check if we can recreate the file
          let fileUrl = savedPart.file_url;
          let rawFile: File | undefined = undefined;
          
          console.log('Processing part:', savedPart.name, 'URL:', fileUrl);
          
          // If the stored URL is a blob URL or doesn't exist, try to recreate from localStorage
          if (!fileUrl || fileUrl.startsWith('blob:')) {
            console.log('Attempting to recreate file for part:', savedPart.id);
            const recreated = cadAnalysisApi.recreateFileFromStorage(savedPart.id, savedPart.name + savedPart.file_type);
            if (recreated.file && recreated.url) {
              console.log('Successfully recreated file and URL:', recreated.url);
              fileUrl = recreated.url;
              rawFile = recreated.file;
              
              // Update the saved part with the new URL
              savedPart.file_url = fileUrl;
            } else {
              console.log('Failed to recreate file for part:', savedPart.id, '- removing from display');
              // Remove this part from localStorage since it's invalid
              const currentParts = cadAnalysisApi.getPartsFromLocalStorage().filter(p => p.id !== savedPart.id);
              cadAnalysisApi.savePartsToLocalStorage(currentParts);
              localStorage.removeItem(`emuski_file_${savedPart.id}`);
              return false; // Filter out this part
            }
          }
          
          return true; // Keep this part
        }).map(savedPart => {
          let fileUrl = savedPart.file_url;
          let rawFile: File | undefined = undefined;
          
          // Recreate file if needed (we know it exists from the filter above)
          if (fileUrl.startsWith('blob:')) {
            const recreated = cadAnalysisApi.recreateFileFromStorage(savedPart.id, savedPart.name + savedPart.file_type);
            if (recreated.file && recreated.url) {
              fileUrl = recreated.url;
              rawFile = recreated.file;
            }
          }
          
          return {
            id: savedPart.id,
            name: savedPart.name,
            fileName: savedPart.name,
            fileExtension: savedPart.file_type,
            volume: savedPart.volume || 0,
            dimensions: savedPart.dimensions || { width: 0, height: 0, depth: 0 },
            measurement: `${savedPart.dimensions?.width || 0} × ${savedPart.dimensions?.height || 0} × ${savedPart.dimensions?.depth || 0} mm`,
            process: savedPart.process || 'Analysis Required',
            material: savedPart.material || 'Material Analysis Required',
            finish: savedPart.finish || 'Surface Finish Analysis Required',
            tolerance: savedPart.tolerance || 'ISO 2768-m (General)',
            threads: savedPart.threads || 'No Threads Detected',
            inspection: savedPart.inspection || 'Standard QC (ASME Y14.5)',
            quantity: savedPart.quantity || 1,
            suggestions: savedPart.suggestions_count || 0,
            cadFileUrl: fileUrl,
            rawFile: rawFile,
            units: 'mm' as const,
            weight: 0,
            surfaceArea: 0
          };
        });
        
        console.log('Converted parts:', convertedParts); // Debug log
        setParts(convertedParts);
      } else {
        setParts([]);
      }
    } catch (error) {
      console.error('Error loading saved parts:', error);
      // Industry practice: graceful degradation on data load failure
      setParts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveClick = (partId: string) => {
    setConfirmDelete(partId);
  };

  const confirmRemovePart = async (partId: string) => {
    try {
      // Delete from database for persistence
      await cadAnalysisApi.deletePart(partId);
      
      setParts(prevParts => {
        const partToRemove = prevParts.find(p => p.id === partId);
        if (partToRemove?.cadFileUrl && partToRemove.cadFileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(partToRemove.cadFileUrl);
        }
        
        // Clean up localStorage file data
        localStorage.removeItem(`emuski_file_${partId}`);
        console.log('Removed file data from localStorage for part:', partId);
        
        const remainingParts = prevParts.filter(p => p.id !== partId);
        
        // Update localStorage with remaining parts
        cadAnalysisApi.savePartsToLocalStorage(remainingParts.map(part => ({
          id: part.id,
          name: part.name,
          file_url: part.cadFileUrl || '',
          file_type: part.fileExtension,
          volume: part.volume,
          dimensions: part.dimensions,
          process: part.process,
          material: part.material,
          finish: part.finish,
          tolerance: part.tolerance,
          threads: part.threads,
          inspection: part.inspection,
          quantity: part.quantity,
          analysis_status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: '',
          suggestions_count: part.suggestions
        })));
        
        return remainingParts;
      });
    } catch (error) {
      console.warn('Database deletion failed, removing locally:', error);
      // Still remove from UI even if database delete fails
      setParts(prevParts => {
        const partToRemove = prevParts.find(p => p.id === partId);
        if (partToRemove?.cadFileUrl && partToRemove.cadFileUrl.startsWith('blob:')) {
          URL.revokeObjectURL(partToRemove.cadFileUrl);
        }
        
        // Clean up localStorage file data
        localStorage.removeItem(`emuski_file_${partId}`);
        console.log('Removed file data from localStorage for part:', partId);
        
        const remainingParts = prevParts.filter(p => p.id !== partId);
        
        // Update localStorage with remaining parts
        cadAnalysisApi.savePartsToLocalStorage(remainingParts.map(part => ({
          id: part.id,
          name: part.name,
          file_url: part.cadFileUrl || '',
          file_type: part.fileExtension,
          volume: part.volume,
          dimensions: part.dimensions,
          process: part.process,
          material: part.material,
          finish: part.finish,
          tolerance: part.tolerance,
          threads: part.threads,
          inspection: part.inspection,
          quantity: part.quantity,
          analysis_status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: '',
          suggestions_count: part.suggestions
        })));
        
        return remainingParts;
      });
    } finally {
      setConfirmDelete(null);
      // Clear selected feature for this part
      setSelectedFeatures(prev => {
        const newSelected = { ...prev };
        delete newSelected[partId];
        return newSelected;
      });
    }
  };

  const handleFeatureSelect = (partId: string, featureType: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [partId]: prev[partId] === featureType ? null : featureType
    }));
  };

  const handleGeometryAnalyzed = (partId: string, geometry: RealTimeGeometryProperties) => {
    setParts(prevParts => 
      prevParts.map(part => 
        part.id === partId 
          ? { 
              ...part, 
              realTimeGeometry: geometry,
              volume: geometry.volume,
              dimensions: {
                width: geometry.dimensions.length,
                height: geometry.dimensions.width,
                depth: geometry.dimensions.height
              },
              process: geometry.manufacturingProcess || 'CNC Machining',
              material: geometry.recommendedMaterial || 'Aluminum 6061',
              measurement: convertUnits(geometry.dimensions.length, part.units) + ' × ' + 
                          convertUnits(geometry.dimensions.width, part.units) + ' × ' + 
                          convertUnits(geometry.dimensions.height, part.units) + ' ' + part.units,
              finish: geometry.surfaceFinish || 'Standard',
              threads: geometry.threadAnalysis || 'None Detected',
              inspection: 'Standard',
              surfaceArea: geometry.surfaceArea,
              weight: calculateWeight(geometry.volume, geometry.recommendedMaterial || 'Aluminum 6061-T6')
            }
          : part
      )
    );
  };

  const convertUnits = (valueInMm: number, targetUnit: 'mm' | 'cm' | 'm' | 'in'): number => {
    switch (targetUnit) {
      case 'mm':
        return Math.round(valueInMm * 100) / 100;
      case 'cm':
        return Math.round(valueInMm / 10 * 100) / 100;
      case 'm':
        return Math.round(valueInMm / 1000 * 10000) / 10000;
      case 'in':
        return Math.round(valueInMm / 25.4 * 1000) / 1000;
      default:
        return Math.round(valueInMm * 100) / 100;
    }
  };

  const convertVolume = (volumeInMm3: number, targetUnit: 'mm' | 'cm' | 'm' | 'in'): number => {
    switch (targetUnit) {
      case 'mm':
        return Math.round(volumeInMm3);
      case 'cm':
        return Math.round(volumeInMm3 / 1000 * 100) / 100;
      case 'm':
        return Math.round(volumeInMm3 / 1000000000 * 1000000000) / 1000000000;
      case 'in':
        return Math.round(volumeInMm3 / 16387.064 * 1000) / 1000;
      default:
        return Math.round(volumeInMm3);
    }
  };

  const convertSurfaceArea = (areaInMm2: number, targetUnit: 'mm' | 'cm' | 'm' | 'in'): number => {
    switch (targetUnit) {
      case 'mm':
        return Math.round(areaInMm2 * 100) / 100;
      case 'cm':
        return Math.round(areaInMm2 / 100 * 100) / 100;
      case 'm':
        return Math.round(areaInMm2 / 1000000 * 1000000) / 1000000;
      case 'in':
        return Math.round(areaInMm2 / 645.16 * 1000) / 1000;
      default:
        return Math.round(areaInMm2 * 100) / 100;
    }
  };

  const calculateWeight = (volumeMm3: number, material: string): number => {
    const densities: { [key: string]: number } = {
      'Aluminum 6061-T6': 2.70,
      'Aluminum 7075-T6': 2.81,
      'Aluminum A380': 2.74,
      'Steel 4140': 7.85,
      'ABS Plastic': 1.04,
      'PC/ABS Blend': 1.14,
      'Clear Resin': 1.18,
      'Tough Resin': 1.15,
      'Zinc Alloy ZA-8': 6.30,
      'Aluminum 5052': 2.68
    };

    const density = densities[material] || 2.70;
    const volumeCm3 = volumeMm3 / 1000;
    const weightGrams = volumeCm3 * density;
    return Math.round(weightGrams / 1000 * 1000) / 1000;
  };

  const handleUnitChange = (partId: string, newUnit: 'mm' | 'cm' | 'm' | 'in') => {
    setParts(prevParts => 
      prevParts.map(part => 
        part.id === partId 
          ? { 
              ...part, 
              units: newUnit,
              measurement: part.realTimeGeometry 
                ? convertUnits(part.realTimeGeometry.dimensions.length, newUnit) + ' × ' + 
                  convertUnits(part.realTimeGeometry.dimensions.width, newUnit) + ' × ' + 
                  convertUnits(part.realTimeGeometry.dimensions.height, newUnit) + ' ' + newUnit
                : part.measurement
            }
          : part
      )
    );
  };

  const handleCadFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Single file upload - replace existing if any
    const file = files[0]; // Only take the first file since we removed multiple
    
    // Require authentication - block upload for unauthenticated users
    if (!isAuthenticated || !user?.id) {
      setShowAuthPrompt(true);
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    setIsUploading(true);
    setUploadProgress({ stage: 'Initializing...', progress: 10 });
    try {
      // Clear existing parts since we only allow one at a time
      if (parts.length > 0) {
        console.log('Clearing existing parts:', parts.length);
        
        // Clean up blob URLs and localStorage for existing parts
        for (const part of parts) {
          try {
            // Revoke blob URLs
            if (part.cadFileUrl && part.cadFileUrl.startsWith('blob:')) {
              URL.revokeObjectURL(part.cadFileUrl);
            }
            
            // Remove from localStorage
            localStorage.removeItem(`emuski_file_${part.id}`);
            
            // Delete from database
            await cadAnalysisApi.deletePart(part.id);
          } catch (error) {
            console.warn('Failed to delete existing part:', error);
          }
        }
        
        // Clear localStorage completely
        localStorage.removeItem('emuski_cad_parts');
        
        setParts([]);
      }

      setUploadProgress({ stage: 'Validating file...', progress: 20 });
      
      const validExtensions = ['.stl', '.obj', '.step', '.stp', '.iges', '.igs'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      const fileName = file.name;
      
      if (!validExtensions.includes(fileExtension)) {
        setIsUploading(false);
        setUploadProgress({ stage: '', progress: 0 });
        return;
      }

        setUploadProgress({ stage: 'Uploading file...', progress: 40 });
        
        // Upload and save file for persistence
        const { url: cloudUrl, metadata: fileMetadata } = await cadAnalysisApi.uploadCadFile(file);
        
        setUploadProgress({ stage: 'Creating part record...', progress: 60 });
        
        // Industry Standards: Initialize with proper manufacturing defaults
        const partName = file.name.split('.')[0];
        const newPart: PartData = {
          id: `part-${Date.now()}`,
          name: partName,
          fileName: fileName,
          fileExtension: fileExtension,
          volume: 0,
          dimensions: {
            width: 0,
            height: 0,
            depth: 0
          },
          measurement: 'Geometric Analysis In Progress...',
          // Manufacturing Process Standards (ISO 9001 compliance)
          process: 'Manufacturing Process Analysis Required',
          // Material Selection Standards (ASTM/ISO compliance)  
          material: 'Material Analysis Required - Awaiting Geometry Data',
          // Surface Finish Standards (ISO 1302, ASME B46.1)
          finish: 'Surface Finish Analysis Required',
          // Tolerance Standards (ISO 2768, ASME Y14.5)
          tolerance: 'ISO 2768-m (General Tolerance ±0.1mm)',
          // Thread Standards (ISO metric threads)
          threads: 'Thread Analysis Pending - ISO Metric Standard',
          // Quality Control Standards (ASME Y14.5, ISO 14405)
          inspection: 'Standard QC per ASME Y14.5 (GD&T)',
          quantity: 1,
          suggestions: 0,
          cadFileUrl: cloudUrl,
          rawFile: file,
          drawingFileUrls: [],
          units: 'mm',
          weight: 0,
          surfaceArea: 0
        };

        // Industry practice: Save to database immediately for persistence
        try {
          const savedPart = await cadAnalysisApi.createPart({
            name: partName,
            file_url: cloudUrl,
            file_type: fileExtension,
            quantity: 1,
            analysis_status: 'pending',
            // Industry standards for initial values
            tolerance: 'ISO 2768-m (General)',
            inspection: 'Standard QC (ASME Y14.5)',
            threads: 'No Threads Detected'
          });
          
          // Update with database ID for persistence
          newPart.id = savedPart.id;
        } catch (dbError) {
          console.warn('Database save failed, continuing with local storage:', dbError);
          // Keep the cloud URL if we have it, otherwise use blob URL
          if (!newPart.cadFileUrl || newPart.cadFileUrl.startsWith('blob:')) {
            newPart.cadFileUrl = URL.createObjectURL(file);
          }
        }

        setUploadProgress({ stage: 'Preparing 3D model...', progress: 80 });
        
        // Store file data for persistence across page reloads
        if (newPart.cadFileUrl.startsWith('blob:')) {
          console.log('Storing file data for part:', newPart.id);
          file.arrayBuffer().then(buffer => {
            // Use FileReader for large files to avoid call stack issues
            const uint8Array = new Uint8Array(buffer);
            const chunks = [];
            const chunkSize = 8192; // Process in 8KB chunks
            
            for (let i = 0; i < uint8Array.length; i += chunkSize) {
              const chunk = uint8Array.slice(i, i + chunkSize);
              chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
            }
            
            const base64 = btoa(chunks.join(''));
            localStorage.setItem(`emuski_file_${newPart.id}`, base64);
            console.log('Successfully stored file data for part:', newPart.id, 'Size:', base64.length);
          }).catch(error => {
            console.error('Failed to store file data:', error);
          });
        } else {
          console.log('Not storing file data (using cloud URL):', newPart.cadFileUrl);
        }
        
        setUploadProgress({ stage: 'Loading 3D model...', progress: 90 });
        
        // Set the single new part (replaces any existing)
        setParts([newPart]);
        
        // Refresh credit info after successful upload
        loadCreditInfo();
        
        setUploadProgress({ stage: 'Complete!', progress: 100 });
      
    } catch (error) {
      console.error('Error uploading CAD files:', error);
    } finally {
      // Reset after a short delay to show completion
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress({ stage: '', progress: 0 });
      }, 1000);
      
      // Clear file input to prevent unwanted re-uploads
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-32">
      {/* Information Banner for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="mb-8">
          <Alert className="border-emuski-teal/20 bg-emuski-teal/5">
            <User className="h-4 w-4 text-emuski-teal" />
            <AlertDescription className="text-sm">
              <span className="font-medium text-emuski-teal">Guest Mode:</span> You can upload and analyze 1 design for free. 
              <Link href="/auth/register" className="ml-1 text-emuski-teal font-medium hover:underline">
                Create a free account
              </Link> to analyze unlimited designs, save your work, and access advanced features.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Parts Display */}
      {parts.length > 0 ? (
        <div className="space-y-6">
          {parts.map((part) => (
            <div key={part.id} className="rounded-lg overflow-hidden border shadow-sm bg-card border-border relative">
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveClick(part.id)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-500 border border-red-500 hover:border-red-600 flex items-center justify-center transition-all duration-200 group shadow-lg backdrop-blur-sm"
                title="Remove this part"
              >
                <X className="w-4 h-4 text-white group-hover:text-white" />
              </button>
              
              <div className="p-6 pt-0">
                {/* 3D Model View */}
                <div className="mt-6">
                  <div className="space-y-4">
                    <div className="overflow-hidden">
                      <div className="w-full bg-[#2d2d2d] flex flex-col lg:flex-row">
                        {/* 3D Model Viewer - Full width on mobile, flex-1 on desktop */}
                        <div className="w-full lg:flex-1 relative bg-gradient-to-b from-[#4a4a4a] to-[#2d2d2d]">
                          <div className="h-[50vh] md:h-[60vh] lg:h-[85vh] min-h-[300px] md:min-h-[400px] relative">
                            {part.cadFileUrl ? (
                              <CadViewer
                                fileUrl={part.cadFileUrl}
                                fileName={part.fileName}
                                fileType={part.fileExtension}
                                rawFile={part.rawFile}
                                creditInfo={creditInfo}
                                onGeometryAnalyzed={(geometry) => handleGeometryAnalyzed(part.id, geometry)}
                                onUnitChange={(newUnit) => handleUnitChange(part.id, newUnit)}
                                selectedFeatureType={selectedFeatures[part.id]}
                                className="h-full w-full"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <div className="text-white text-center">
                                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-emuski-teal/20 flex items-center justify-center">
                                    <Box className="w-8 h-8 text-emuski-teal" />
                                  </div>
                                  <p className="text-lg font-medium">3D Model Viewer</p>
                                  <p className="text-sm text-gray-400 mt-2">Upload a CAD file to view</p>
                                </div>
                              </div>
                            )}
                            
                            {/* File Info Overlay */}
                            <div className="absolute bottom-4 left-4 bg-[#3f3f3f]/90 backdrop-blur-sm border border-[#555555] rounded-lg px-2 py-1">
                              <p className="text-[10px] text-white font-medium">{part.name}</p>
                            </div>
                          </div>
                        </div>

                        {/* Properties Panel - Below model on mobile, side panel on desktop */}
                        <div className="w-full lg:w-96 bg-[#3f3f3f] border-t lg:border-t-0 lg:border-l border-[#555555] flex flex-col max-h-[40vh] lg:max-h-[85vh] overflow-hidden">
                            <div className="px-3 py-2 border-b border-[#555555]">
                              <h3 className="text-sm font-semibold text-white">Properties</h3>
                              <p className="text-xs text-gray-400">Model controls and information</p>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 p-2 space-y-3">

                              {/* Manufacturing Details */}
                              <div className="rounded-lg bg-[#505050] border border-[#666666] p-3">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                                  <Box className="h-4 w-4" />
                                  Manufacturing Analysis
                                </h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-gray-400 font-medium text-sm">Process:</span>
                                    <span className={part.process === 'Analyzing...' ? 'font-mono text-sm text-yellow-400' : 'font-mono text-sm text-white'}>
                                      {part.process}
                                    </span>
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-gray-400 font-medium text-sm">Material:</span>
                                    <span className={part.material === 'Analyzing...' ? 'font-mono text-sm text-yellow-400' : 'font-mono text-sm text-white'}>
                                      {part.material}
                                    </span>
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-gray-400 font-medium text-sm">Finish:</span>
                                    <span className={part.finish === 'Analyzing...' ? 'font-mono text-sm text-yellow-400' : 'font-mono text-sm text-white'}>
                                      {part.finish}
                                    </span>
                                  </div>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-gray-400 font-medium text-sm">Threads:</span>
                                    <span className="text-white font-mono text-sm">{part.threads}</span>
                                  </div>
                                  {part.realTimeGeometry?.holeAnalysis && part.realTimeGeometry.holeAnalysis.count > 0 && (
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-gray-400 font-medium text-sm">Holes:</span>
                                      <span className="text-white font-mono text-sm">
                                        {part.realTimeGeometry.holeAnalysis.count} detected
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* DFM Features */}
                              {part.realTimeGeometry?.recognizedFeatures && (
                                <div className="rounded-lg bg-[#505050] border border-[#666666] p-1">
                                  <h4 className="text-[9px] font-semibold text-white flex items-center gap-0.5 mb-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target h-2.5 w-2.5">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <circle cx="12" cy="12" r="6"></circle>
                                      <circle cx="12" cy="12" r="2"></circle>
                                    </svg>
                                    DFM Features
                                    <span className="ml-auto text-[8px] text-gray-400 font-normal">click to highlight</span>
                                  </h4>
                                  {/* Dynamic Color Legend - Only show detected features */}
                                  <div className="flex flex-wrap gap-0.5 mb-1">
                                    {Object.entries(part.realTimeGeometry.recognizedFeatures)
                                      .filter(([featureType, features]) => features.count > 0)
                                      .map(([featureType, features]) => {
                                        const featureConfig = getFeatureConfig(featureType);
                                        return (
                                          <span key={featureType} className="flex items-center gap-0.5 text-[7px] text-gray-300">
                                            <span 
                                              className="inline-block w-1.5 h-1.5 rounded-full" 
                                              style={{background: featureConfig.color}}
                                            ></span>
                                            {featureConfig.name}
                                          </span>
                                        );
                                      })
                                    }
                                    {Object.entries(part.realTimeGeometry.recognizedFeatures)
                                      .filter(([featureType, features]) => features.count > 0).length === 0 && (
                                      <span className="text-[7px] text-gray-400 italic">No features detected</span>
                                    )}
                                  </div>
                                  <div className="space-y-0.5 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700 pr-0.5">
                                    {Object.entries(part.realTimeGeometry.recognizedFeatures).map(([featureType, features]) => {
                                      if (features.count === 0) return null;
                                      
                                      const featureConfig = getFeatureConfig(featureType);
                                      const isSelected = selectedFeatures[part.id] === featureType;
                                      return (
                                        <button 
                                          key={featureType} 
                                          className={isSelected 
                                            ? 'w-full text-left p-0.5 rounded border transition-all border-blue-400 bg-blue-500/20' 
                                            : 'w-full text-left p-0.5 rounded border transition-all border-[#666666] bg-[#3f3f3f] hover:bg-[#484848]'
                                          }
                                          onClick={() => handleFeatureSelect(part.id, featureType)}
                                        >
                                          <div className="flex items-center gap-1 mb-0.5">
                                            <svg 
                                              xmlns="http://www.w3.org/2000/svg" 
                                              width="24" 
                                              height="24" 
                                              viewBox="0 0 24 24" 
                                              fill="none" 
                                              stroke="currentColor" 
                                              strokeWidth="2" 
                                              strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              className="lucide lucide-crosshair h-2.5 w-2.5 flex-shrink-0" 
                                              style={{color: featureConfig.color}}
                                            >
                                              <circle cx="12" cy="12" r="10"></circle>
                                              <line x1="22" x2="18" y1="12" y2="12"></line>
                                              <line x1="6" x2="2" y1="12" y2="12"></line>
                                              <line x1="12" x2="12" y1="6" y2="2"></line>
                                              <line x1="12" x2="12" y1="22" y2="18"></line>
                                            </svg>
                                            <span className="text-[9px] font-semibold truncate" style={{color: featureConfig.color}}>
                                              {featureConfig.name.toUpperCase()}
                                            </span>
                                          </div>
                                          <div className="text-[8px] text-gray-300 truncate mb-0.5">
                                            {featureConfig.description}
                                          </div>
                                          <div className="flex items-center gap-2 text-[7px] text-gray-400">
                                            <span className="flex items-center gap-0.5">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock h-1.5 w-1.5">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                              </svg>
                                              0min
                                            </span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Physical Properties */}
                              <div className="rounded-lg bg-[#505050] border border-[#666666] p-3">
                                <h4 className="text-sm font-semibold text-white mb-3">Dimensions</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-gray-400 font-medium text-sm">Measurement:</span>
                                    <span className={part.measurement === 'Analyzing...' ? 'font-mono text-sm text-yellow-400' : 'font-mono text-sm text-white'}>
                                      {part.measurement}
                                    </span>
                                  </div>
                                  {part.realTimeGeometry && (
                                    <>
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-xs">Max Length ({part.units})</span>
                                        <span className="text-white font-mono text-sm">
                                          {convertUnits(part.realTimeGeometry.dimensions.length, part.units)}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-xs">Max Width ({part.units})</span>
                                        <span className="text-white font-mono text-sm">
                                          {convertUnits(part.realTimeGeometry.dimensions.width, part.units)}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-xs">Max Height ({part.units})</span>
                                        <span className="text-white font-mono text-sm">
                                          {convertUnits(part.realTimeGeometry.dimensions.height, part.units)}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Volume & Physical Properties */}
                              <div className="rounded-lg bg-[#505050] border border-[#666666] p-3">
                                <h4 className="text-sm font-semibold text-white mb-3">Physical Properties</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-xs">Volume ({part.units}³)</span>
                                    <span className="text-white font-mono text-sm">
                                      {part.volume === 0 ? (
                                        <span className="text-yellow-400">Calculating...</span>
                                      ) : (
                                        convertVolume(part.volume, part.units)
                                      )}
                                    </span>
                                  </div>
                                  {part.surfaceArea && part.surfaceArea > 0 && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400 text-xs">Surface Area ({part.units}²)</span>
                                      <span className="text-white font-mono text-sm">
                                        {convertSurfaceArea(part.surfaceArea, part.units)}
                                      </span>
                                    </div>
                                  )}
                                  {part.weight && part.weight > 0 && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400 text-xs">Weight (kg)</span>
                                      <span className="text-white font-mono text-sm">
                                        {part.weight.toFixed(3)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Additional Upload Section - Shown after first upload */}
          {/* Community Button for authenticated users */}
          {isAuthenticated && (
            <div className="mt-8">
              <CommunityButton />
            </div>
          )}

          <div className="mt-8 p-6 border-2 border-dashed border-border/50 rounded-lg bg-card/50">
            <div className="text-center">
              <div className="p-3 bg-emuski-teal/10 rounded-xl w-fit mx-auto mb-4">
                <Upload className="w-6 h-6 text-emuski-teal" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Another CAD File</h3>
              <p className="text-muted-foreground mb-4">
                Upload a new CAD file to replace the current analysis.
              </p>
              <Button 
                onClick={() => cadFileInputRef.current?.click()}
                variant="outline"
                className="border-emuski-teal text-emuski-teal hover:bg-emuski-teal hover:text-white"
                disabled={isUploading}
              >
                {isUploading ? 'Processing File...' : 'Upload New File'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-emuski-teal/10 rounded-2xl w-fit mx-auto mb-6">
              <svg className="w-12 h-12 text-emuski-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">No CAD Files Uploaded</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first CAD file to start analyzing your parts with our advanced 3D viewer and AI-powered insights.
            </p>
            <Button 
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthPrompt(true);
                } else {
                  cadFileInputRef.current?.click();
                }
              }}
              className="bg-emuski-teal hover:bg-emuski-teal-dark text-white"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {uploadProgress.stage || 'Loading 3D Model...'}
                </>
              ) : !isAuthenticated ? (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Sign In to Upload
                </>
              ) : (
                'Upload CAD File'
              )}
            </Button>
            
            {/* Progress Bar */}
            {isUploading && uploadProgress.progress > 0 && (
              <div className="mt-4 w-full max-w-xs mx-auto">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{uploadProgress.stage}</span>
                  <span>{uploadProgress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emuski-teal h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-3">
              Supports STL, OBJ, STEP, IGES formats • Geometry analysis • Manufacturing insights
            </p>

            {/* Credit Display for authenticated users */}
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-border">
                <CreditDisplay
                  remaining={creditInfo?.remaining ?? 0}
                  limit={creditInfo?.limit ?? 5}
                  resetTime={creditInfo?.resetTime}
                  timeUntilReset={creditInfo?.timeUntilReset}
                  onRefresh={loadCreditInfo}
                  className="w-full"
                  isLoading={!creditInfo}
                />
              </div>
            )}


            {/* Authentication required message */}
            {!isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Sign in required to upload CAD files and use AI analysis</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Input */}
      <input 
        ref={cadFileInputRef}
        accept="model/stl,.stl,application/sla,.stl,application/vnd.ms-pki.stl,.stl,model/x.stl-binary,.stl,model/step,.step,.stp,application/step,.step,.stp,model/iges,.iges,.igs,application/iges,.iges,.igs,image/vnd.dxf,.dxf,application/dxf,.dxf,model/obj,.obj,application/octet-stream,.stl,.step,.stp,.iges,.igs,.dxf,.obj" 
        type="file" 
        className="sr-only"
        onChange={handleCadFileUpload}
      />

      {/* Authentication Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-emuski-teal to-emuski-teal-dark text-white p-6 text-center relative">
              {/* Close Button */}
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              
              <div className="flex justify-center mb-4">
                <img
                  src="/assets/emuski-logo-optimized.webp"
                  alt="EMUSKI"
                  className="w-24 h-12 object-contain"
                  onError={(e) => {
                    // Fallback to manufacturing logo if main logo fails
                    e.currentTarget.src = "/assets/emuski-manufacturing-logo.webp";
                    e.currentTarget.onerror = () => {
                      // Final fallback to text
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-bold text-white">EMUSKI</span>';
                    };
                  }}
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Sign In Required</h3>
              <p className="text-white/90 text-sm">
                Unlock advanced CAD analysis features
              </p>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Analyze Multiple Designs
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sign in to upload and analyze multiple CAD files simultaneously. Get comprehensive insights across your entire design portfolio.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emuski-teal rounded-full"></div>
                  <span className="text-sm text-gray-700">Upload unlimited CAD files</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emuski-teal rounded-full"></div>
                  <span className="text-sm text-gray-700">Compare designs side-by-side</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emuski-teal rounded-full"></div>
                  <span className="text-sm text-gray-700">Save analysis history</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emuski-teal rounded-full"></div>
                  <span className="text-sm text-gray-700">Advanced manufacturing insights</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link 
                  href="/auth/login"
                  className="w-full bg-emuski-teal hover:bg-emuski-teal-dark text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  Sign In to Continue
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="text-xs text-gray-500">or</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <Link 
                  href="/auth/register"
                  className="w-full bg-white hover:bg-gray-50 text-emuski-teal font-semibold py-3 px-4 rounded-lg text-center transition-colors border border-emuski-teal"
                >
                  Create Free Account
                </Link>

                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm transition-colors"
                >
                  Continue with One Design
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Design?</h3>
              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to remove this CAD file? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmRemovePart(confirmDelete)}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};