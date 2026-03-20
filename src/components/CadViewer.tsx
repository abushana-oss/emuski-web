'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cadEngine, CADEngineClient, GeometryAnalysisResponse } from '@/lib/cad-engine-client';

// ── Feature Recognition System Types ────────────────────────────────────────

interface DetectedFeature {
  id: string;
  type: FeatureType;
  confidence: number;
  geometry: {
    center: THREE.Vector3;
    boundingBox: THREE.Box3;
    volume: number;
    surfaceArea: number;
  };
  properties: {
    diameter?: number;
    depth?: number;
    radius?: number;
    angle?: number;
    thickness?: number;
    length?: number;
    width?: number;
    holeType?: string;
    estimatedDiameter?: number;
    estimatedRadius?: number;
    area?: number;
  };
  faces: number[];
  vertices: THREE.Vector3[];
  highlighted: boolean;
}

interface FeatureCollection {
  count: number;
  features: DetectedFeature[];
  totalVolume: number;
  avgConfidence: number;
}

type FeatureType =
  | 'pockets'
  | 'slots'
  | 'holes'
  | 'bosses'
  | 'ribs'
  | 'fillets'
  | 'chamfers'
  | 'threads'
  | 'walls'
  | 'drafts'
  | 'undercuts'
  | 'textEngraving';

interface GeometryFace {
  type: 'planar' | 'cylindrical' | 'conical' | 'spherical' | 'freeform';
  normal: THREE.Vector3;
  center: THREE.Vector3;
  area: number;
  curvature?: number;
  vertices: THREE.Vector3[];
}

interface GeometryEdge {
  type: 'sharp' | 'smooth' | 'fillet' | 'chamfer';
  vertices: [THREE.Vector3, THREE.Vector3];
  angle?: number;
  radius?: number;
  length: number;
}

interface RealTimeGeometryProperties {
  dimensions: { length: number; width: number; height: number };
  volume: number;
  surfaceArea: number;
  boundingBoxVolume: number;
  meshComplexity: { vertices: number; faces: number; edges: number };
  wallThickness: { min: number; max: number; average: number };
  manufacturingProcess?: string;
  recommendedMaterial?: string;
  surfaceFinish?: string;
  threadAnalysis?: string;
  complexity?: string;
  holeAnalysis?: { count: number; sizes: number[]; types: string[] };
  threadFeatures?: {
    count: number;
    specifications: string[];
    locations: Array<{ x: number; y: number; z: number }>;
  };
  holes?: FeatureCollection;
  recognizedFeatures?: {
    holes: FeatureCollection;
    pockets: FeatureCollection;
    slots: FeatureCollection;
    bosses: FeatureCollection;
    ribs: FeatureCollection;
    fillets: FeatureCollection;
    chamfers: FeatureCollection;
    threads: FeatureCollection;
    walls: FeatureCollection;
    drafts: FeatureCollection;
    undercuts: FeatureCollection;
    textEngraving: FeatureCollection;
  };
  bomComponents?: {
    components: Array<{
      id: string;
      name: string;
      type: 'part' | 'assembly';
      material: string;
      volume: number;
      surfaceArea: number;
      dfmIssues: Array<{
        type: 'draft_angle' | 'thin_wall' | 'undercut' | 'sharp_corner';
        severity: 'low' | 'medium' | 'high';
        description: string;
        recommendation: string;
        location?: { x: number; y: number; z: number };
        highlighted?: boolean;
      }>;
      manufacturingProcess: string;
      estimatedCost: number;
      highlighted?: boolean;
      mesh?: THREE.Mesh;
    }>;
    totalComponents: number;
  };
  cadEngineAnalysis?: GeometryAnalysisResponse;
}

interface CreditInfo {
  remaining: number;
  limit: number;
  resetTime?: string;
  timeUntilReset?: number;
}

interface CadViewerProps {
  fileUrl?: string;
  fileName: string;
  fileType: string;
  rawFile?: File;
  creditInfo?: CreditInfo | null;
  onFullscreen?: () => void;
  onGeometryAnalyzed?: (geometry: RealTimeGeometryProperties) => void;
  onUnitChange?: (units: 'mm' | 'cm' | 'm' | 'in') => void;
  selectedComponent?: string | null;
  selectedDFMIssue?: string | null;
  selectedDFMIssueDetails?: any;
  onDFMIssueSelect?: (issueId: string, componentId: string) => void;
  onComponentSelect?: (componentId: string) => void;
  selectedFeatureType?: string | null;
  className?: string;
}

interface ViewerState {
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
  isWireframe: boolean;
  showGrid: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  showZAxis: boolean;
  isTransparent: boolean;
  showCrossSection: boolean;
  zoom: number;
  engineAvailable: boolean;
  stlData: string | null;
  analysisData: GeometryAnalysisResponse | null;
  realTimeGeometry: RealTimeGeometryProperties | null;
  measureMode: boolean;
  measureUnits: 'mm' | 'cm' | 'm' | 'in';
  isXRayView: boolean;
  crossSectionColor: string;
  modelColor: string;
  wireframe: boolean;
  transparent: boolean;
  crossSection: boolean;
  componentHighlights: THREE.Group | null;
  showMobileControls: boolean;
  highlightedComponents: Set<string>;
  highlightedIssues: Set<string>;
  selectedDFMIssue: string | null;
  selectedDFMComponent: string | null;
  chatMessages: Array<{
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: number;
  }>;
  isChatOpen: boolean;
  isChatLoading: boolean;
  suggestionsHidden: boolean;
  selectedFeatureType: FeatureType | null;
  featureHighlights: THREE.Group | null;
  showFeaturePanel: boolean;
  selectedDfmFeatures: Record<string, boolean>;
  currentGeometry: THREE.BufferGeometry | null;
  fileSize: number | null;
}

interface ThreeJSRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  model: THREE.Group | null;
  controls: OrbitControls | null;
  animationId: number | null;
  gridHelper: THREE.GridHelper | null;
  axesHelper: THREE.Group | null;
  viewCube: {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    cube: THREE.Mesh | null;
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export const CadViewer: React.FC<CadViewerProps> = ({
  fileUrl,
  fileName,
  fileType,
  rawFile,
  creditInfo,
  onFullscreen,
  onGeometryAnalyzed,
  onUnitChange,
  selectedComponent,
  selectedDFMIssue,
  selectedDFMIssueDetails,
  onDFMIssueSelect,
  onComponentSelect,
  selectedFeatureType,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // Credit tracking state
  // creditInfo is now passed as prop from parent component
  const viewerRef = useRef<HTMLDivElement>(null);
  const threeJSRef = useRef<ThreeJSRefs>({
    scene: null,
    camera: null,
    renderer: null,
    model: null,
    controls: null,
    animationId: null,
    gridHelper: null,
    axesHelper: null,
    viewCube: { scene: null, camera: null, renderer: null, cube: null },
  });
  const viewCubeRef = useRef<HTMLCanvasElement>(null);

  const [viewerState, setViewerState] = useState<ViewerState>({
    isLoading: true,
    isAnalyzing: false,
    error: null,
    isWireframe: false,
    showGrid: true,
    showXAxis: true,
    showYAxis: true,
    showZAxis: true,
    isTransparent: false,
    showCrossSection: false,
    zoom: 1,
    engineAvailable: false,
    stlData: null,
    analysisData: null,
    realTimeGeometry: null,
    measureMode: true,
    measureUnits: 'm',
    isXRayView: false,
    crossSectionColor: '#b8c2ff',
    modelColor: '#17B8BA',
    wireframe: false,
    transparent: false,
    crossSection: false,
    componentHighlights: null,
    showMobileControls: false,
    highlightedComponents: new Set(),
    highlightedIssues: new Set(),
    selectedDFMIssue: null,
    selectedDFMComponent: null,
    chatMessages: [
      {
        id: 'welcome',
        type: 'bot',
        content:
          "Ready to analyze your CAD model for manufacturability. Ask me about holes, tolerances, cost, machining challenges, or any DFM concerns.",
        timestamp: Date.now(),
      },
    ],
    isChatOpen: false,
    isChatLoading: false,
    suggestionsHidden: false,
    selectedFeatureType: null,
    featureHighlights: null,
    showFeaturePanel: false,
    selectedDfmFeatures: {},
    currentGeometry: null,
    fileSize: null,
  });

  // Credit info is now passed as prop from parent component

  // ── Engine check ─────────────────────────────────────────────────────────

  useEffect(() => {
    const checkEngine = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const response = await fetch('/api/cad-engine/health', {
          signal: controller.signal,
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          setViewerState(prev => ({ ...prev, engineAvailable: true }));
        } else {
          throw new Error(`CAD Engine responded with status: ${response.status}`);
        }
      } catch {
        setViewerState(prev => ({ ...prev, engineAvailable: false }));
      }
    };
    checkEngine();
  }, []);

  // ── Init viewer ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!rawFile && !fileUrl) return;
    initializeViewer();
  }, [rawFile, fileUrl, viewerState.engineAvailable]);

  useEffect(() => {
    if (!threeJSRef.current.scene) return;
    updateComponentHighlighting(selectedComponent ?? null);
  }, [selectedComponent]);

  useEffect(() => {
    if (!threeJSRef.current.scene || !threeJSRef.current.model) return;
    clearFeatureHighlights();
    if (selectedFeatureType && viewerState.realTimeGeometry?.recognizedFeatures) {
      const features =
        viewerState.realTimeGeometry.recognizedFeatures[selectedFeatureType as FeatureType];
      if (features && features.features.length > 0) {
        highlightFeatureOnMesh(selectedFeatureType as FeatureType, features.features);
      }
    }
  }, [selectedFeatureType, viewerState.realTimeGeometry]);

  useEffect(() => {
    if (!threeJSRef.current.scene) return;
    clearAllHighlights();
    if (selectedDFMIssueDetails && selectedDFMIssue) {
      const location = selectedDFMIssueDetails.location;
      const issueType = selectedDFMIssueDetails.type;
      const severity = selectedDFMIssueDetails.severity;
      if (location && issueType) {
        highlightDFMIssue(selectedDFMIssue, 'main_component', severity, true, location, issueType);
      }
    }
  }, [selectedDFMIssue, selectedDFMIssueDetails]);

  useEffect(() => {
    if (!threeJSRef.current.model) return;
    threeJSRef.current.model.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
        child.material.wireframe = viewerState.wireframe;
        child.material.needsUpdate = true;
      }
    });
  }, [viewerState.wireframe]);

  useEffect(() => {
    if (!threeJSRef.current.model) return;
    threeJSRef.current.model.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
        child.material.transparent = viewerState.transparent;
        child.material.opacity = viewerState.transparent ? 0.7 : 1.0;
        child.material.needsUpdate = true;
      }
    });
  }, [viewerState.transparent]);

  useEffect(() => {
    if (!threeJSRef.current.model || !threeJSRef.current.scene) return;
    if (viewerState.crossSection) {
      const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      threeJSRef.current.model.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
          child.material.clippingPlanes = [plane];
          child.material.clipShadows = true;
          child.material.needsUpdate = true;
        }
      });
      if (threeJSRef.current.renderer) threeJSRef.current.renderer.localClippingEnabled = true;
    } else {
      threeJSRef.current.model.traverse(child => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
          child.material.clippingPlanes = [];
          child.material.needsUpdate = true;
        }
      });
      if (threeJSRef.current.renderer) threeJSRef.current.renderer.localClippingEnabled = false;
    }
  }, [viewerState.crossSection]);

  useEffect(() => {
    return () => {
      if (threeJSRef.current.animationId) {
        cancelAnimationFrame(threeJSRef.current.animationId);
      }
    };
  }, []);

  // Component selection from parent
  useEffect(() => {
    if (selectedComponent) {
      if (viewerState.realTimeGeometry?.bomComponents?.components) {
        const component = viewerState.realTimeGeometry.bomComponents.components.find(
          c => c.id === selectedComponent
        );
        if (component) {
          highlightComponent(selectedComponent, true);
          onComponentSelect?.(selectedComponent);
        }
      }
    } else {
      clearAllHighlights();
    }
  }, [selectedComponent]);

  // ── Axes helper ──────────────────────────────────────────────────────────

  const createAxesHelper = (): THREE.Group => {
    const axesGroup = new THREE.Group();
    const axisLength = 8;

    const xGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(axisLength, 0, 0),
    ]);
    const yGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, axisLength, 0),
    ]);
    const zGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, axisLength),
    ]);

    const xAxis = new THREE.Line(xGeo, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    xAxis.userData = { axis: 'x' };
    const yAxis = new THREE.Line(yGeo, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    yAxis.userData = { axis: 'y' };
    const zAxis = new THREE.Line(zGeo, new THREE.LineBasicMaterial({ color: 0x0000ff }));
    zAxis.userData = { axis: 'z' };

    const arrowGeo = new THREE.ConeGeometry(0.1, 0.3, 8);
    const xArrow = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    xArrow.rotation.z = -Math.PI / 2;
    xArrow.position.x = axisLength;
    xArrow.userData = { axis: 'x' };
    const yArrow = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    yArrow.position.y = axisLength;
    yArrow.userData = { axis: 'y' };
    const zArrow = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    zArrow.rotation.x = Math.PI / 2;
    zArrow.position.z = axisLength;
    zArrow.userData = { axis: 'z' };

    axesGroup.add(xAxis, yAxis, zAxis, xArrow, yArrow, zArrow);
    return axesGroup;
  };

  const updateAxisVisibility = (axis: 'x' | 'y' | 'z', visible: boolean) => {
    if (threeJSRef.current.axesHelper) {
      threeJSRef.current.axesHelper.children.forEach(child => {
        if (child.userData.axis === axis) child.visible = visible;
      });
    }
  };

  const toggleXAxis = () => {
    const v = !viewerState.showXAxis;
    setViewerState(prev => ({ ...prev, showXAxis: v }));
    updateAxisVisibility('x', v);
  };
  const toggleYAxis = () => {
    const v = !viewerState.showYAxis;
    setViewerState(prev => ({ ...prev, showYAxis: v }));
    updateAxisVisibility('y', v);
  };
  const toggleZAxis = () => {
    const v = !viewerState.showZAxis;
    setViewerState(prev => ({ ...prev, showZAxis: v }));
    updateAxisVisibility('z', v);
  };

  // ── Highlight radius helpers ─────────────────────────────────────────────

  const getHighlightRadius = (featureType: string): number => {
    const map: Record<string, number> = {
      pockets: 4.0,
      undercuts: 3.0,
      thinWalls: 1.5,
      sharpEdges: 1.0,
      threads: 2.0,
    };
    return map[featureType] ?? 2.5;
  };

  // ── CAD Engine conversion ────────────────────────────────────────────────

  const convertAnalysisToRealTimeGeometry = (
    analysisResult: GeometryAnalysisResponse
  ): RealTimeGeometryProperties => {
    const geometry = analysisResult.geometry_features;
    const dfmAnalysis = analysisResult.dfm_analysis;
    return {
      dimensions: {
        length: geometry.bounding_box.size[0],
        width: geometry.bounding_box.size[1],
        height: geometry.bounding_box.size[2],
      },
      volume: geometry.volume_mm3,
      surfaceArea: geometry.surface_area_mm2,
      boundingBoxVolume:
        geometry.bounding_box.size[0] *
        geometry.bounding_box.size[1] *
        geometry.bounding_box.size[2],
      meshComplexity: { vertices: 0, faces: 0, edges: 0 },
      wallThickness: { min: 0.5, max: 10.0, average: 2.0 },
      manufacturingProcess: dfmAnalysis.recommended_processes[0] || 'CNC Machining',
      recommendedMaterial: 'Aluminum 6061-T6',
      surfaceFinish: 'Standard',
      threadAnalysis: 'None Detected',
      bomComponents: {
        components: [
          {
            id: 'comp_001',
            name: 'Main Housing',
            type: 'part',
            material: 'Aluminum 6061-T6',
            volume: geometry.volume_mm3 * 0.6,
            surfaceArea: geometry.surface_area_mm2 * 0.6,
            manufacturingProcess: 'CNC Machining',
            estimatedCost: 25.5,
            dfmIssues: [
              {
                type: 'draft_angle',
                severity: 'medium',
                description: 'Corner region lacks sufficient draft angle for optimal CNC tool access',
                recommendation: 'Increase radius to at least 2.5mm for better tool clearance',
              },
              {
                type: 'thin_wall',
                severity: 'low',
                description: 'Wall thickness is at minimum threshold',
                recommendation: 'Consider increasing thickness to 3.5mm for improved strength',
              },
            ],
          },
          {
            id: 'comp_002',
            name: 'Mounting Bracket',
            type: 'part',
            material: 'Steel 4140',
            volume: geometry.volume_mm3 * 0.3,
            surfaceArea: geometry.surface_area_mm2 * 0.3,
            manufacturingProcess: 'Sheet Metal Forming',
            estimatedCost: 12.75,
            dfmIssues: [
              {
                type: 'sharp_corner',
                severity: 'high',
                description: 'Sharp internal corners may cause stress concentration',
                recommendation: 'Add 2.3mm radius to all internal corners',
              },
            ],
          },
          {
            id: 'comp_003',
            name: 'Connection Port',
            type: 'part',
            material: 'Plastic ABS',
            volume: geometry.volume_mm3 * 0.1,
            surfaceArea: geometry.surface_area_mm2 * 0.1,
            manufacturingProcess: 'Injection Molding',
            estimatedCost: 3.25,
            dfmIssues: [],
          },
        ],
        totalComponents: 3,
      },
    };
  };

  // ── Mesh color helpers ───────────────────────────────────────────────────

  const applyVertexColoring = (
    model: THREE.Group,
    featureLocations: any[],
    color: number,
    featureType: string
  ) => {
    const dfmColor = new THREE.Color(color);
    const transparentColor = new THREE.Color(0.4, 0.4, 0.4);
    const highlightRadius = getHighlightRadius(featureType);

    model.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        if (!geometry.userData.originalMaterial && child.material instanceof THREE.Material) {
          geometry.userData.originalMaterial = child.material.clone();
        }
        if (child.material instanceof THREE.Material) {
          const mat = child.material as any;
          mat.transparent = true;
          mat.opacity = 0.3;
          mat.vertexColors = true;
          mat.needsUpdate = true;
        }

        const positionAttribute = geometry.getAttribute('position');
        if (!positionAttribute) return;

        const vertexCount = positionAttribute.count;
        let colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute | null;
        if (!colorAttribute) {
          const colors = new Float32Array(vertexCount * 3);
          colorAttribute = new THREE.BufferAttribute(colors, 3);
          geometry.setAttribute('color', colorAttribute);
        }

        const colorArray = colorAttribute.array as Float32Array;
        for (let i = 0; i < vertexCount; i++) {
          colorArray[i * 3] = transparentColor.r;
          colorArray[i * 3 + 1] = transparentColor.g;
          colorArray[i * 3 + 2] = transparentColor.b;
        }

        for (const location of featureLocations) {
          let worldPos: THREE.Vector3;
          if ('nx' in location && 'ny' in location && 'nz' in location) {
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            worldPos = new THREE.Vector3(
              center.x + location.nx * (size.x / 2),
              center.y + location.ny * (size.y / 2),
              center.z + location.nz * (size.z / 2)
            );
          } else {
            worldPos = new THREE.Vector3(location.x || 0, location.y || 0, location.z || 0);
          }

          for (let i = 0; i < vertexCount; i++) {
            const vertex = new THREE.Vector3(
              positionAttribute.getX(i),
              positionAttribute.getY(i),
              positionAttribute.getZ(i)
            );
            vertex.applyMatrix4(child.matrixWorld);
            if (vertex.distanceTo(worldPos) <= highlightRadius) {
              colorArray[i * 3] = Math.min(dfmColor.r * 1.5, 1);
              colorArray[i * 3 + 1] = Math.min(dfmColor.g * 1.5, 1);
              colorArray[i * 3 + 2] = Math.min(dfmColor.b * 1.5, 1);
            }
          }
        }
        colorAttribute.needsUpdate = true;
      }
    });
  };

  /** No-op stub – DFM feature panel was removed */
  const applySelectiveDfmHighlighting = () => {
    const model = threeJSRef.current.model;
    if (!model || !viewerState.realTimeGeometry) return;
    // DFM features removed – returning early
    return;
  };

  const restoreOriginalColors = () => {
    const model = threeJSRef.current.model;
    if (!model) return;
    model.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        if (geometry.userData.originalMaterial && child.material instanceof THREE.Material) {
          const orig = geometry.userData.originalMaterial as any;
          child.material.transparent = orig.transparent || false;
          (child.material as any).opacity = orig.opacity || 1.0;
          (child.material as any).vertexColors = false;
          child.material.needsUpdate = true;
        } else if (child.material instanceof THREE.Material) {
          child.material.transparent = false;
          (child.material as any).opacity = 1.0;
          (child.material as any).vertexColors = false;
          child.material.needsUpdate = true;
        }
        if (geometry.getAttribute('color')) geometry.deleteAttribute('color');
      }
    });
  };

  const calculateDFMSeverity = (
    featureType: string,
    count: number
  ): 'low' | 'medium' | 'high' | 'critical' => {
    const thresholds: Record<string, { medium: number; high: number; critical: number }> = {
      pockets: { medium: 5, high: 15, critical: 30 },
      undercuts: { medium: 10, high: 50, critical: 150 },
      thinWalls: { medium: 20, high: 60, critical: 120 },
      sharpEdges: { medium: 30, high: 100, critical: 200 },
      threads: { medium: 10, high: 25, critical: 50 },
    };
    const t = thresholds[featureType] ?? { medium: 20, high: 50, critical: 100 };
    if (count >= t.critical) return 'critical';
    if (count >= t.high) return 'high';
    if (count >= t.medium) return 'medium';
    return 'low';
  };

  // ── Component highlight helpers ──────────────────────────────────────────

  const highlightMeshComponent = (component: any) => {
    const model = threeJSRef.current.model;
    if (!model) return;

    const severityColors: Record<string, number> = {
      high: 0xff4444,
      medium: 0xff8c00,
      low: 0xffd700,
      none: 0x32cd32,
    };

    const maxSeverity =
      component.dfmIssues.length > 0
        ? component.dfmIssues.reduce((max: string, issue: any) => {
            if (issue.severity === 'high') return 'high';
            if (issue.severity === 'medium' && max !== 'high') return 'medium';
            if (issue.severity === 'low' && max !== 'high' && max !== 'medium') return 'low';
            return max;
          }, 'low')
        : 'none';

    const highlightColor = severityColors[maxSeverity];
    model.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        if (!child.geometry.userData.originalMaterial && child.material instanceof THREE.Material) {
          child.geometry.userData.originalMaterial = child.material.clone();
        }
        if (child.material instanceof THREE.Material) {
          const mat = child.material as any;
          mat.transparent = true;
          mat.opacity = 0.7;
          mat.color = new THREE.Color(highlightColor);
          mat.emissive = new THREE.Color(highlightColor).multiplyScalar(0.2);
          mat.needsUpdate = true;
        }
      }
    });
  };

  const createComponentHighlights = (componentId: string): THREE.Group | null => {
    const highlightGroup = new THREE.Group();
    if (!threeJSRef.current.model || !viewerState.realTimeGeometry?.bomComponents) return null;
    const component = viewerState.realTimeGeometry.bomComponents.components.find(
      c => c.id === componentId
    );
    if (!component) return null;
    highlightMeshComponent(component);
    return highlightGroup;
  };

  const updateComponentHighlighting = (componentId: string | null) => {
    if (!threeJSRef.current.scene) return;
    if (viewerState.componentHighlights)
      threeJSRef.current.scene.remove(viewerState.componentHighlights);
    restoreOriginalColors();
    if (componentId) {
      const highlights = createComponentHighlights(componentId);
      if (highlights && highlights.children.length > 0) {
        threeJSRef.current.scene.add(highlights);
        setViewerState(prev => ({ ...prev, componentHighlights: highlights }));
      } else {
        setViewerState(prev => ({ ...prev, componentHighlights: null }));
      }
    } else {
      setViewerState(prev => ({ ...prev, componentHighlights: null }));
    }
  };

  // ── Viewer initialization ────────────────────────────────────────────────

  const initializeViewer = async () => {
    if (!viewerRef.current) return;
    try {
      setViewerState(prev => ({ ...prev, isLoading: true, error: null }));
      initializeThreeJS();
      await loadModel();
      setViewerState(prev => ({ ...prev, isLoading: false }));
    } catch {
      setViewerState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load CAD model. Please try again.',
      }));
    }
  };

  const initializeThreeJS = () => {
    if (!viewerRef.current) return;
    const container = viewerRef.current;
    container.innerHTML = '';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    threeJSRef.current.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    threeJSRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf8f9fa, 1);
    container.appendChild(renderer.domElement);
    threeJSRef.current.renderer = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    threeJSRef.current.controls = controls;

    scene.add(new THREE.AmbientLight(0x404040, 1.0));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.6);
    d1.position.set(10, 10, 5);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xffffff, 0.4);
    d2.position.set(-10, 10, -5);
    scene.add(d2);
    const d3 = new THREE.DirectionalLight(0xffffff, 0.3);
    d3.position.set(0, -10, 0);
    scene.add(d3);

    const gridHelper = new THREE.GridHelper(10, 10, 0x17b8ba, 0xcccccc);
    gridHelper.visible = viewerState.showGrid;
    scene.add(gridHelper);
    threeJSRef.current.gridHelper = gridHelper;

    const axesHelper = createAxesHelper();
    scene.add(axesHelper);
    threeJSRef.current.axesHelper = axesHelper;

    startRenderLoop();
    
    // Use requestAnimationFrame to ensure DOM is fully ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initializeViewCube();
      });
    });

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
  };

  const loadModel = async () => {
    if (!threeJSRef.current.scene || !rawFile) return;
    const scene = threeJSRef.current.scene;
    if (threeJSRef.current.model) scene.remove(threeJSRef.current.model);
    
    setViewerState(prev => ({ ...prev, fileSize: rawFile.size }));

    try {
      let geometry: THREE.BufferGeometry;
      if (CADEngineClient.isSupportedCADFile(rawFile) && viewerState.engineAvailable) {
        const conversionResult = await cadEngine.convertToSTL(rawFile);
        const stlBinary = atob(conversionResult.stl_base64);
        const stlArray = new Uint8Array(stlBinary.length);
        for (let i = 0; i < stlBinary.length; i++) stlArray[i] = stlBinary.charCodeAt(i);
        geometry = new STLLoader().parse(stlArray.buffer);
        setViewerState(prev => ({ ...prev, stlData: conversionResult.stl_base64 }));
      } else {
        geometry = await loadFileLocally(rawFile);
      }
      await displayModel(geometry, scene);
    } catch (error: any) {
      setViewerState(prev => ({
        ...prev,
        error: `File processing failed: ${error.message || 'Unsupported file format or corrupted file'}`,
        isLoading: false
      }));
    }
  };

  const loadFileLocally = async (file: File): Promise<THREE.BufferGeometry> => {
    const ext = file.name.toLowerCase().split('.').pop() || '';
    if (ext === 'stl') {
      return new STLLoader().parse(await file.arrayBuffer());
    } else if (ext === 'obj') {
      const group = new OBJLoader().parse(await file.text());
      let found: THREE.BufferGeometry | null = null;
      group.traverse(child => {
        if (child instanceof THREE.Mesh && !found) found = child.geometry;
      });
      if (found) return found;
      throw new Error('No geometry found in OBJ file');
    } else if (['step', 'stp', 'iges', 'igs'].includes(ext)) {
      throw new Error(`CAD file format ${ext.toUpperCase()} requires CAD engine for processing`);
    }
    throw new Error(`Unsupported file format: ${ext}`);
  };

  const displayModel = async (geometry: THREE.BufferGeometry, scene: THREE.Scene) => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const center = box.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, -center.z);

    const material = new THREE.MeshPhongMaterial({
      color: 0x17b8ba,
      shininess: 100,
      wireframe: viewerState.isWireframe,
    });
    const mesh = new THREE.Mesh(geometry, material);
    const modelGroup = new THREE.Group();
    modelGroup.add(mesh);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) modelGroup.scale.setScalar(3 / maxDim);

    scene.add(modelGroup);
    threeJSRef.current.model = modelGroup;

    const realTimeGeometry = await analyzeRealTimeGeometry(geometry);

    const enhanced: RealTimeGeometryProperties = {
      ...realTimeGeometry,
    };

    setViewerState(prev => ({ 
      ...prev, 
      realTimeGeometry: enhanced, 
      isLoading: false,
      currentGeometry: geometry 
    }));
    if (onGeometryAnalyzed) onGeometryAnalyzed(enhanced);

    if (threeJSRef.current.camera) {
      threeJSRef.current.camera.position.set(5, 5, 5);
      threeJSRef.current.camera.lookAt(0, 0, 0);
    }
  };

  // ── Highlight / DFM helpers ──────────────────────────────────────────────

  const highlightComponent = (componentId: string, highlight: boolean = true) => {
    const scene = threeJSRef.current.scene;
    if (!scene || !threeJSRef.current.model) return;

    const existing = scene.getObjectByName(`highlight_${componentId}`);
    if (existing) scene.remove(existing);

    if (highlight) {
      const originalMesh = threeJSRef.current.model.children[0] as THREE.Mesh;
      if (originalMesh?.geometry) {
        const m = new THREE.Mesh(
          originalMesh.geometry.clone(),
          new THREE.MeshPhongMaterial({ color: 0x00ff00, opacity: 0.3, transparent: true })
        );
        m.name = `highlight_${componentId}`;
        m.position.copy(originalMesh.position);
        m.rotation.copy(originalMesh.rotation);
        m.scale.copy(originalMesh.scale);
        scene.add(m);
      }
    }

    setViewerState(prev => {
      const s = new Set(prev.highlightedComponents);
      highlight ? s.add(componentId) : s.delete(componentId);
      return { ...prev, highlightedComponents: s };
    });
  };

  const highlightMeshFaces = (
    location: { x: number; y: number; z: number },
    issueType: string,
    severity: string,
    color: number,
    radius = 10
  ): boolean => {
    if (!threeJSRef.current.model) return false;
    const targetColor = new THREE.Color(color);
    let applied = false;

    threeJSRef.current.model.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        const positionAttribute = geometry.getAttribute('position');
        if (!positionAttribute) return;

        if (!child.userData.originalGeometry)
          child.userData.originalGeometry = geometry.clone();

        let colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        if (!colorAttr) {
          const colors = new Float32Array(positionAttribute.count * 3).fill(1);
          colorAttr = new THREE.BufferAttribute(colors, 3);
          geometry.setAttribute('color', colorAttr);
        }

        const colors = colorAttr.array as Float32Array;
        const locationVec = new THREE.Vector3(location.x, location.y, location.z);

        for (let i = 0; i < positionAttribute.count; i++) {
          const vertex = new THREE.Vector3(
            positionAttribute.getX(i),
            positionAttribute.getY(i),
            positionAttribute.getZ(i)
          );
          const dist = vertex.distanceTo(locationVec);
          if (dist <= radius) {
            const intensity = Math.max(0, 1 - dist / radius);
            const mixed = new THREE.Color(1, 1, 1).lerp(targetColor, intensity * 0.8);
            colors[i * 3] = mixed.r;
            colors[i * 3 + 1] = mixed.g;
            colors[i * 3 + 2] = mixed.b;
            applied = true;
          }
        }
        colorAttr.needsUpdate = true;

        if (child.material instanceof THREE.MeshPhongMaterial || child.material instanceof THREE.MeshBasicMaterial) {
          (child.material as any).vertexColors = true;
          child.material.needsUpdate = true;
        }
      }
    });
    return true;
  };

  const restoreMeshColors = () => {
    if (!threeJSRef.current.model) return;
    threeJSRef.current.model.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry && child.userData.originalGeometry) {
        const colorAttr = child.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        if (colorAttr) {
          const colors = colorAttr.array as Float32Array;
          for (let i = 0; i < colors.length; i++) colors[i] = 1.0;
          colorAttr.needsUpdate = true;
        }
        if (child.material instanceof THREE.MeshPhongMaterial) {
          (child.material as any).vertexColors = true;
          child.material.needsUpdate = true;
        }
      }
    });
  };

  const highlightDFMIssue = (
    issueId: string,
    componentId: string,
    severity: 'low' | 'medium' | 'high',
    highlight = true,
    issueLocation?: { x: number; y: number; z: number },
    issueType?: string
  ) => {
    if (!threeJSRef.current.model) return;
    restoreMeshColors();

    if (highlight && issueLocation && issueType) {
      const severityColors = { low: 0xffff00, medium: 0xff8800, high: 0xff0000 };

      let modelBounds = {
        min: new THREE.Vector3(-50, -25, -12.5),
        max: new THREE.Vector3(50, 25, 12.5),
      };
      if (threeJSRef.current.model) {
        const b = new THREE.Box3().setFromObject(threeJSRef.current.model);
        if (!b.isEmpty()) modelBounds = { min: b.min, max: b.max };
      }
      const modelSize = modelBounds.max.clone().sub(modelBounds.min);
      const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);

      const radiusMap: Record<string, number> = {
        pocket: Math.max(maxDim * 0.3, 25),
        undercut: Math.max(maxDim * 0.25, 22),
        thin_wall: Math.max(maxDim * 0.4, 30),
        sharp_corner: Math.max(maxDim * 0.15, 18),
      };
      const highlightRadius = radiusMap[issueType] ?? Math.max(maxDim * 0.3, 25);

      let loc = { ...issueLocation };
      if (
        Math.abs(issueLocation.x) > modelSize.x ||
        Math.abs(issueLocation.y) > modelSize.y ||
        Math.abs(issueLocation.z) > modelSize.z
      ) {
        const c = modelBounds.min.clone().add(modelBounds.max).multiplyScalar(0.5);
        loc = {
          x: c.x + (Math.random() - 0.5) * modelSize.x * 0.6,
          y: c.y + (Math.random() - 0.5) * modelSize.y * 0.6,
          z: c.z + (Math.random() - 0.5) * modelSize.z * 0.6,
        };
      }
      highlightMeshFaces(loc, issueType, severity, severityColors[severity], highlightRadius);
    }

    setViewerState(prev => {
      const s = new Set(prev.highlightedIssues);
      highlight ? s.add(issueId) : s.delete(issueId);
      return {
        ...prev,
        highlightedIssues: s,
        selectedDFMIssue: highlight ? issueId : null,
        selectedDFMComponent: highlight ? componentId : null,
      };
    });
  };

  const clearAllHighlights = () => {
    if (!threeJSRef.current.scene) return;
    const scene = threeJSRef.current.scene;
    const toRemove: THREE.Object3D[] = [];
    scene.traverse(child => {
      if (child.name.startsWith('highlight_') || child.name.startsWith('issue_highlight_'))
        toRemove.push(child);
    });
    toRemove.forEach(o => scene.remove(o));
    restoreMeshColors();
    setViewerState(prev => ({
      ...prev,
      highlightedComponents: new Set(),
      highlightedIssues: new Set(),
      selectedDFMIssue: null,
      selectedDFMComponent: null,
    }));
  };

  const handleDFMIssueSelect = (issueId: string, componentId: string, severity: 'low' | 'medium' | 'high') => {
    clearAllHighlights();
    highlightComponent(componentId, true);
    highlightDFMIssue(issueId, componentId, severity, true);
    onDFMIssueSelect?.(issueId, componentId);
  };

  // ── Geometry analysis ────────────────────────────────────────────────────

  const analyzeRealTimeGeometry = async (
    geometry: THREE.BufferGeometry
  ): Promise<RealTimeGeometryProperties> => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = box.getSize(new THREE.Vector3());
    const dimensions = {
      length: Math.round(size.x * 100) / 100,
      width: Math.round(size.y * 100) / 100,
      height: Math.round(size.z * 100) / 100,
    };

    const volume = calculateMeshVolume(geometry);
    const surfaceArea = calculateSurfaceArea(geometry);
    const boundingBoxVolume = dimensions.length * dimensions.width * dimensions.height;

    const posAttr = geometry.getAttribute('position');
    const idxAttr = geometry.getIndex();
    const vertices = posAttr ? posAttr.count : 0;
    const faces = idxAttr ? idxAttr.count / 3 : vertices / 3;
    const edges = (faces * 3) / 2;
    const minDimension = Math.min(dimensions.length, dimensions.width, dimensions.height);
    const wallThickness = {
      min: minDimension * 0.05,
      max: minDimension * 0.2,
      average: minDimension * 0.1,
    };

    const threadFeatures = analyzeThreads(geometry);
    let bomComponents;
    let cadEngineAnalysis: GeometryAnalysisResponse | null = null;

    if (viewerState.engineAvailable && rawFile && CADEngineClient.isSupportedCADFile(rawFile)) {
      try {
        cadEngineAnalysis = await cadEngine.analyzeGeometry(rawFile, { strategy: 'balanced', forceReanalysis: false });
        if (cadEngineAnalysis?.success) {
          bomComponents = generateBOMFromCADEngine(cadEngineAnalysis, geometry, dimensions, volume, surfaceArea);
        } else {
          cadEngineAnalysis = null;
          bomComponents = generateBOMComponents(geometry, dimensions, volume, surfaceArea);
        }
      } catch {
        cadEngineAnalysis = null;
        bomComponents = generateBOMComponents(geometry, dimensions, volume, surfaceArea);
      }
    } else {
      bomComponents = generateBOMComponents(geometry, dimensions, volume, surfaceArea);
    }

    return {
      dimensions,
      volume: Math.round(volume * 100) / 100,
      surfaceArea: Math.round(surfaceArea * 100) / 100,
      boundingBoxVolume: Math.round(boundingBoxVolume * 100) / 100,
      meshComplexity: {
        vertices: Math.round(vertices),
        faces: Math.round(faces),
        edges: Math.round(edges),
      },
      wallThickness: {
        min: Math.round(wallThickness.min * 100) / 100,
        max: Math.round(wallThickness.max * 100) / 100,
        average: Math.round(wallThickness.average * 100) / 100,
      },
      threadFeatures: threadFeatures,
      bomComponents,
      cadEngineAnalysis: cadEngineAnalysis ?? undefined,
      recognizedFeatures: {
        holes: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        pockets: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        slots: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        bosses: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        ribs: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        fillets: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        chamfers: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        threads: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        walls: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        drafts: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        undercuts: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 },
        textEngraving: { count: 0, features: [], totalVolume: 0, avgConfidence: 0 }
      },
    };
  };

  // ── BOM helpers ──────────────────────────────────────────────────────────

  const generateBOMFromCADEngine = (
    analysisData: GeometryAnalysisResponse,
    geometry: THREE.BufferGeometry,
    dimensions: any,
    volume: number,
    surfaceArea: number
  ) => {
    const dfmAnalysis = analysisData.dfm_analysis;
    const components = [];

    // FIX: material_recommendations is string[], not object array → no .name
    const primaryMaterial =
      (dfmAnalysis.ai_insights.material_recommendations as string[])[0] || 'Aluminum 6061-T6';

    const mainComponent = {
      id: 'cad_comp_001',
      name: `${analysisData.original_filename} - Main Part`,
      type: 'part' as const,
      material: primaryMaterial,
      volume: analysisData.geometry_features.volume_mm3,
      surfaceArea: analysisData.geometry_features.surface_area_mm2,
      manufacturingProcess: dfmAnalysis.recommended_processes[0] || 'CNC Machining',
      estimatedCost: calculateCostFromCADEngine(dfmAnalysis),
      dfmIssues: (dfmAnalysis.ai_insights.dfm_warnings ?? []).map((warning: any, index: number) => ({
        id: `issue_${index}`,
        type: mapWarningTypeToIssueType(warning.code || warning.type || 'general'),
        severity: warning.severity || 'medium',
        description: warning.description || 'Manufacturing concern detected',
        recommendation: warning.recommendation || 'Review part design for manufacturability',
        highlighted: false,
      })),
      highlighted: false,
    };
    components.push(mainComponent);

    // FIX: manufacturing_complexity comparison – cast to number
    const complexity = Number(dfmAnalysis.ai_insights.manufacturing_complexity ?? 0);
    if (complexity > 70) {
      const secondaryMaterial =
        (dfmAnalysis.ai_insights.material_recommendations as string[])[1] || 'Steel 4140';
      components.push({
        id: 'cad_comp_002',
        name: 'Complex Feature',
        type: 'part' as const,
        material: secondaryMaterial,
        volume: volume * 0.2,
        surfaceArea: surfaceArea * 0.3,
        manufacturingProcess: dfmAnalysis.recommended_processes[1] || 'Precision Machining',
        estimatedCost: calculateCostFromCADEngine(dfmAnalysis) * 0.3,
        dfmIssues: [],
        highlighted: false,
      });
    }

    return { components, totalComponents: components.length };
  };

  const calculateCostFromCADEngine = (dfmAnalysis: any): number => {
    const processRec = dfmAnalysis.ai_insights.process_recommendations?.[0];
    const baseCost = processRec?.cost_factor || 1.0;
    const leadTimeFactor = Math.max(dfmAnalysis.ai_insights.lead_time_estimate_days || 5, 1) * 0.5;
    return Math.round((baseCost * leadTimeFactor + 10) * 100) / 100;
  };

  const mapWarningTypeToIssueType = (
    warningCode: string
  ): 'draft_angle' | 'thin_wall' | 'undercut' | 'sharp_corner' => {
    if (warningCode.includes('draft') || warningCode.includes('angle')) return 'draft_angle';
    if (warningCode.includes('wall') || warningCode.includes('thickness')) return 'thin_wall';
    if (warningCode.includes('undercut')) return 'undercut';
    return 'sharp_corner';
  };

  const generateBOMComponents = (
    geometry: THREE.BufferGeometry,
    dimensions: any,
    volume: number,
    surfaceArea: number
  ) => {
    const maxDimension = Math.max(dimensions.length, dimensions.width, dimensions.height);
    const minDimension = Math.min(dimensions.length, dimensions.width, dimensions.height);
    const aspectRatio = maxDimension / Math.max(minDimension, 0.1);
    const complexity = geometry.getAttribute('position')?.count || 0;
    const components = [];

    components.push({
      id: 'comp_001',
      name: 'Primary Component',
      type: 'part' as const,
      material: determineMaterial(dimensions, volume),
      volume: volume * 0.7,
      surfaceArea: surfaceArea * 0.6,
      manufacturingProcess: determineManufacturingProcess(dimensions, volume, complexity),
      estimatedCost: calculateEstimatedCost(volume * 0.7, 'primary'),
      dfmIssues: generateDFMIssues(dimensions, volume, 'primary'),
    });

    if (complexity > 1000 && aspectRatio > 2) {
      components.push({
        id: 'comp_002',
        name: 'Secondary Feature',
        type: 'part' as const,
        material: determineMaterial(dimensions, volume * 0.2),
        volume: volume * 0.2,
        surfaceArea: surfaceArea * 0.25,
        manufacturingProcess: 'CNC Machining',
        estimatedCost: calculateEstimatedCost(volume * 0.2, 'secondary'),
        dfmIssues: generateDFMIssues(dimensions, volume * 0.2, 'secondary'),
      });
    }

    if (maxDimension < 50 && volume < 1000) {
      components.push({
        id: 'comp_003',
        name: 'Fastener/Insert',
        type: 'part' as const,
        material: 'Steel 316L',
        volume: volume * 0.1,
        surfaceArea: surfaceArea * 0.15,
        manufacturingProcess: 'Turning',
        estimatedCost: calculateEstimatedCost(volume * 0.1, 'fastener'),
        dfmIssues: [],
      });
    }

    return { components, totalComponents: components.length };
  };

  const determineMaterial = (dimensions: any, volume: number): string => {
    const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
    if (maxDim < 20) return 'Plastic ABS';
    if (volume < 500) return 'Aluminum 6061-T6';
    if (volume > 10000) return 'Steel 4140';
    return 'Aluminum 7075-T6';
  };

  const determineManufacturingProcess = (dimensions: any, volume: number, complexity: number): string => {
    if (complexity < 500) return 'Sheet Metal Forming';
    if (volume < 1000) return 'Injection Molding';
    if (Math.max(dimensions.length, dimensions.width, dimensions.height) > 100) return 'CNC Machining';
    return 'Turning';
  };

  const calculateEstimatedCost = (volume: number, type: string): number => {
    const baseRate = type === 'primary' ? 0.05 : type === 'secondary' ? 0.03 : 0.01;
    return Math.round((volume * baseRate + Math.random() * 10 + 5) * 100) / 100;
  };

  const generateDFMIssues = (dimensions: any, volume: number, type: string) => {
    const issues: any[] = [];
    const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
    const minDim = Math.min(dimensions.length, dimensions.width, dimensions.height);
    const aspectRatio = maxDim / minDim;

    if (maxDim > 20 && type === 'primary') {
      issues.push({
        id: 'pocket_001',
        type: 'pocket',
        severity: 'high',
        description: 'Deep pocket with narrow access.',
        recommendation: 'Increase corner radii to minimum R3.5mm.',
        location: { x: -10, y: 12, z: 3 },
      });
    }
    if (minDim < 2.5) {
      issues.push({
        id: 'wall_001',
        type: 'thin_wall',
        severity: minDim < 1.5 ? 'high' : 'medium',
        description: `Wall thickness ${minDim.toFixed(1)}mm is below recommended minimum.`,
        recommendation: minDim < 1.5
          ? 'Critical: Increase to minimum 1.5mm or add support ribs.'
          : 'Increase thickness to 2.5mm for optimal machining.',
        location: { x: 0, y: -15, z: 0 },
      });
    }
    if (aspectRatio > 4 && type === 'primary') {
      issues.push({
        id: 'undercut_001',
        type: 'undercut',
        severity: 'high',
        description: 'Internal undercut feature detected.',
        recommendation: 'Redesign to eliminate undercut or use 5-axis machining.',
        location: { x: 8, y: 0, z: -8 },
      });
    }
    issues.push({
      id: 'corner_001',
      type: 'sharp_corner',
      severity: 'low',
      description: 'Sharp internal corners detected.',
      recommendation: 'Add minimum R2.5mm radius to internal corners.',
      location: { x: 12, y: -8, z: 2 },
    });
    return issues;
  };

  // ── Mesh calculations ────────────────────────────────────────────────────

  const calculateMeshVolume = (geometry: THREE.BufferGeometry): number => {
    const posAttr = geometry.getAttribute('position');
    const idxAttr = geometry.getIndex();
    if (!posAttr) return 0;
    let volume = 0;
    const p = posAttr.array;

    if (idxAttr) {
      const indices = idxAttr.array;
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
        const v1 = new THREE.Vector3(p[a], p[a + 1], p[a + 2]);
        const v2 = new THREE.Vector3(p[b], p[b + 1], p[b + 2]);
        const v3 = new THREE.Vector3(p[c], p[c + 1], p[c + 2]);
        volume += v1.dot(v2.clone().cross(v3)) / 6;
      }
    } else {
      for (let i = 0; i < p.length; i += 9) {
        const v1 = new THREE.Vector3(p[i], p[i + 1], p[i + 2]);
        const v2 = new THREE.Vector3(p[i + 3], p[i + 4], p[i + 5]);
        const v3 = new THREE.Vector3(p[i + 6], p[i + 7], p[i + 8]);
        volume += v1.dot(v2.clone().cross(v3)) / 6;
      }
    }
    return Math.abs(volume);
  };

  const calculateSurfaceArea = (geometry: THREE.BufferGeometry): number => {
    const posAttr = geometry.getAttribute('position');
    const idxAttr = geometry.getIndex();
    if (!posAttr) return 0;
    let area = 0;
    const p = posAttr.array;

    if (idxAttr) {
      const indices = idxAttr.array;
      for (let i = 0; i < indices.length; i += 3) {
        const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
        const v1 = new THREE.Vector3(p[a], p[a + 1], p[a + 2]);
        const v2 = new THREE.Vector3(p[b], p[b + 1], p[b + 2]);
        const v3 = new THREE.Vector3(p[c], p[c + 1], p[c + 2]);
        area += v2.clone().sub(v1).cross(v3.clone().sub(v1)).length() / 2;
      }
    } else {
      for (let i = 0; i < p.length; i += 9) {
        const v1 = new THREE.Vector3(p[i], p[i + 1], p[i + 2]);
        const v2 = new THREE.Vector3(p[i + 3], p[i + 4], p[i + 5]);
        const v3 = new THREE.Vector3(p[i + 6], p[i + 7], p[i + 8]);
        area += v2.clone().sub(v1).cross(v3.clone().sub(v1)).length() / 2;
      }
    }
    return area;
  };

  // ── Thread analysis ─────────────────────────────────────────────

  const analyzeThreads = (geometry: THREE.BufferGeometry) => {
    const posAttr = geometry.getAttribute('position');
    if (!posAttr) {
      return { count: 0, specifications: [] as string[], locations: [] as any[] };
    }
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();

    const positions = posAttr.array;
    const normals = geometry.getAttribute('normal').array;
    const cylindricalFeatures = detectCylindricalFeatures(positions, normals, posAttr.count);

    const threads = { count: 0, specifications: [] as string[], locations: [] as any[] };

    cylindricalFeatures.forEach(f => {
      if (f.isThread) {
        threads.count++;
        threads.specifications.push(f.threadSpec);
        threads.locations.push(f.center);
      }
    });
    return threads;
  };

  const detectCylindricalFeatures = (positions: any, normals: any, vertexCount: number) => {
    const features: any[] = [];
    const gridSize = 0.5;
    const vertexGrid = new Map<string, any[]>();

    for (let i = 0; i < vertexCount * 3; i += 3) {
      const x = Math.floor(positions[i] / gridSize);
      const y = Math.floor(positions[i + 1] / gridSize);
      const z = Math.floor(positions[i + 2] / gridSize);
      const key = `${x},${y},${z}`;
      if (!vertexGrid.has(key)) vertexGrid.set(key, []);
      vertexGrid.get(key)!.push({
        position: [positions[i], positions[i + 1], positions[i + 2]],
        normal: [normals[i], normals[i + 1], normals[i + 2]],
      });
    }

    for (const [, verts] of vertexGrid) {
      if (verts.length < 10) continue;
      const f = analyzeCylindricalCluster(verts);
      if (f) features.push(f);
    }
    return features;
  };

  const analyzeCylindricalCluster = (vertices: any[]) => {
    const center = [0, 0, 0];
    vertices.forEach(v => {
      center[0] += v.position[0];
      center[1] += v.position[1];
      center[2] += v.position[2];
    });
    center[0] /= vertices.length;
    center[1] /= vertices.length;
    center[2] /= vertices.length;

    const radii = vertices.map(v => {
      const dx = v.position[0] - center[0];
      const dy = v.position[1] - center[1];
      return Math.sqrt(dx * dx + dy * dy);
    });
    const avg = radii.reduce((a, b) => a + b, 0) / radii.length;
    const variance = radii.reduce((acc, r) => acc + (r - avg) ** 2, 0) / radii.length;

    if (variance < avg * 0.1 && avg > 1) {
      const normalVariance = calculateNormalVariance(
        vertices.map(v => new THREE.Vector3(v.normal[0], v.normal[1], v.normal[2]))
      );
      if (normalVariance > 0.8) {
        return {
          isThread: true,
          center: { x: center[0], y: center[1], z: center[2] },
          diameter: avg * 2,
          threadSpec: estimateThreadSpec(avg * 2),
        };
      }
    }
    return null;
  };

  const estimateThreadSpec = (diameter: number): string => {
    if (diameter >= 2.5 && diameter <= 3.5) return 'M3 x 0.5';
    if (diameter >= 3.5 && diameter <= 4.5) return 'M4 x 0.7';
    if (diameter >= 4.5 && diameter <= 5.5) return 'M5 x 0.8';
    if (diameter >= 5.5 && diameter <= 6.5) return 'M6 x 1.0';
    if (diameter >= 7 && diameter <= 9) return 'M8 x 1.25';
    if (diameter >= 9 && diameter <= 11) return 'M10 x 1.5';
    if (diameter >= 11 && diameter <= 13) return 'M12 x 1.75';
    return `≈${diameter.toFixed(1)}mm thread`;
  };


  // ── Feature recognition ──────────────────────────────────────────────────

  const runFeatureRecognition = async (geometry: THREE.BufferGeometry) => {
    const { faces, edges } = analyzeGeometryStructure(geometry);
    return {
      pockets: detectPockets(geometry, faces),
      slots: detectSlots(geometry, faces),
      holes: detectHoles(geometry, faces),
      bosses: detectBosses(geometry, faces),
      ribs: detectRibs(geometry, faces),
      fillets: detectFillets(geometry, edges),
      chamfers: detectChamfers(geometry, edges),
      threads: detectThreads(geometry, faces),
      walls: detectWalls(geometry, faces),
      drafts: detectDrafts(geometry, faces),
      undercuts: detectUndercuts(geometry, faces),
      textEngraving: detectTextEngraving(geometry, faces),
    };
  };

  const analyzeGeometryStructure = (
    geometry: THREE.BufferGeometry
  ): { faces: GeometryFace[]; edges: GeometryEdge[] } => {
    const posAttr = geometry.getAttribute('position');
    const normAttr = geometry.getAttribute('normal');
    const idxAttr = geometry.getIndex();
    if (!posAttr || !normAttr) return { faces: [], edges: [] };

    const positions = posAttr.array;
    const normals = normAttr.array;
    const faces: GeometryFace[] = [];

    const totalFaces = idxAttr ? idxAttr.count / 3 : positions.length / 9;
    const sampleStep = Math.max(1, Math.floor(totalFaces / 1000));
    const samplesToAnalyze = Math.min(1000, totalFaces);

    for (let i = 0; i < samplesToAnalyze; i++) {
      const faceIndex = i * sampleStep;
      const faceVertices: THREE.Vector3[] = [];
      const faceNormals: THREE.Vector3[] = [];

      for (let j = 0; j < 3; j++) {
        const vi = idxAttr ? idxAttr.getX(faceIndex * 3 + j) : faceIndex * 3 + j;
        if (vi * 3 + 2 >= positions.length) continue;
        faceVertices.push(new THREE.Vector3(positions[vi * 3], positions[vi * 3 + 1], positions[vi * 3 + 2]));
        faceNormals.push(new THREE.Vector3(normals[vi * 3], normals[vi * 3 + 1], normals[vi * 3 + 2]));
      }
      if (faceVertices.length !== 3) continue;

      const avgNormal = faceNormals
        .reduce((s, n) => s.add(n), new THREE.Vector3())
        .normalize();
      const center = faceVertices
        .reduce((s, v) => s.add(v), new THREE.Vector3())
        .multiplyScalar(1 / 3);
      const area = calculateTriangleArea(faceVertices[0], faceVertices[1], faceVertices[2]);
      if (area < 0.01) continue;

      const nv = calculateNormalVariance(faceNormals);
      let faceType: GeometryFace['type'] = 'planar';
      if (nv < 0.05) faceType = 'planar';
      else if (nv < 0.3) {
        const cd = calculateCurvatureDirection(faceVertices, avgNormal);
        faceType = cd.isCylindrical ? 'cylindrical' : cd.isConical ? 'conical' : 'freeform';
      } else {
        faceType = 'freeform';
      }

      faces.push({ type: faceType, normal: avgNormal, center, area, vertices: faceVertices, curvature: nv });
    }
    return { faces, edges: [] };
  };

  const calculateCurvatureDirection = (vertices: THREE.Vector3[], normal: THREE.Vector3) => {
    if (vertices.length < 3) return { isCylindrical: false, isConical: false };
    const v1 = vertices[1].clone().sub(vertices[0]);
    const v2 = vertices[2].clone().sub(vertices[0]);
    const nd = Math.abs(v1.clone().cross(v2).normalize().dot(normal));
    return { isCylindrical: nd > 0.8, isConical: nd > 0.5 && nd <= 0.8 };
  };

  // ── Individual feature detectors ─────────────────────────────────────────


  const clusterVertices = (vertices: THREE.Vector3[], threshold: number) => {
    const clusters: THREE.Vector3[][] = [];
    const used = new Set<number>();
    vertices.forEach((v, i) => {
      if (used.has(i)) return;
      const cluster = [v];
      used.add(i);
      vertices.forEach((ov, oi) => {
        if (!used.has(oi) && v.distanceTo(ov) < threshold) {
          cluster.push(ov);
          used.add(oi);
        }
      });
      if (cluster.length >= 3) clusters.push(cluster);
    });
    return clusters;
  };

  const fitCircleToPoints = (points: THREE.Vector3[]) => {
    if (points.length < 3) return null;
    const center = points
      .reduce((s, p) => s.add(p), new THREE.Vector3())
      .multiplyScalar(1 / points.length);
    const distances = points.map(p => p.distanceTo(center));
    const avg = distances.reduce((s, d) => s + d, 0) / distances.length;
    const variance = distances.reduce((s, d) => s + (d - avg) ** 2, 0) / distances.length;
    return variance < avg * 0.3 ? { center, radius: avg } : null;
  };

  const detectPockets = (geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const pockets: DetectedFeature[] = [];
    const recessedFaces = faces.filter(f => f.type === 'planar' && f.normal.y > 0.7 && f.center.y < 0);
    const groups = groupPlanarFeatures(recessedFaces, 5.0);
    groups.forEach((group, i) => {
      if (group.length < 1) return;
      const center = calculateFeatureCenter(group);
      const bb = calculateFeatureBoundingBox(group);
      const depth = Math.abs(bb.min.y);
      const area = group.reduce((s, f) => s + f.area, 0);
      pockets.push({
        id: `pocket_${i}`,
        type: 'pockets',
        confidence: calculatePocketConfidence(group, depth, area),
        geometry: {
          center,
          boundingBox: bb,
          volume: area * depth,
          surfaceArea: area + calculateWallSurfaceArea(bb, depth),
        },
        properties: { depth, width: bb.max.x - bb.min.x, length: bb.max.z - bb.min.z },
        faces: [],
        vertices: group.flatMap(f => f.vertices),
        highlighted: false,
      });
    });
    return {
      count: pockets.length,
      features: pockets,
      totalVolume: pockets.reduce((s, p) => s + p.geometry.volume, 0),
      avgConfidence: pockets.length > 0 ? pockets.reduce((s, p) => s + p.confidence, 0) / pockets.length : 0,
    };
  };

  const detectSlots = (geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const slots: DetectedFeature[] = [];
    detectPockets(geometry, faces).features.forEach((pocket, i) => {
      const w = pocket.properties.width || 0;
      const l = pocket.properties.length || 0;
      const ar = Math.max(l, w) / Math.max(Math.min(l, w), 0.01);
      if (ar > 3.0)
        slots.push({ ...pocket, id: `slot_${i}`, type: 'slots', confidence: Math.min(pocket.confidence * (ar / 3), 1) });
    });
    return {
      count: slots.length,
      features: slots,
      totalVolume: slots.reduce((s, x) => s + x.geometry.volume, 0),
      avgConfidence: slots.length > 0 ? slots.reduce((s, x) => s + x.confidence, 0) / slots.length : 0,
    };
  };

  const detectHoles = (geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const holes: DetectedFeature[] = [];
    
    // Look for cylindrical faces that could be holes
    const cylindricalFaces = faces.filter(f => f.type === 'cylindrical');
    
    cylindricalFaces.forEach((face, i) => {
      // Estimate hole parameters from cylindrical face
      const radius = Math.sqrt(face.area / (2 * Math.PI * 12)); // Rough estimation assuming height ~12mm
      const diameter = radius * 2;
      
      // Classify hole types based on size
      let holeType = 'unknown';
      if (diameter < 4) holeType = 'pin_hole';
      else if (diameter < 8) holeType = 'fastener_hole';
      else if (diameter < 14) holeType = 'clearance_hole';
      else holeType = 'large_hole';
      
      holes.push({
        id: `hole_${i}`,
        type: 'holes',
        confidence: face.area > 2 ? 0.7 : 0.4,
        geometry: {
          center: face.center,
          boundingBox: new THREE.Box3(
            new THREE.Vector3(face.center.x - radius, face.center.y - 5, face.center.z - radius),
            new THREE.Vector3(face.center.x + radius, face.center.y + 5, face.center.z + radius)
          ),
          volume: Math.PI * radius * radius * 10, // Estimated volume
          surfaceArea: face.area,
        },
        properties: { 
          holeType,
          estimatedDiameter: diameter,
          estimatedRadius: radius,
          area: face.area
        },
        faces: [],
        vertices: face.vertices,
        highlighted: false,
      });
    });
    
    return { 
      count: holes.length, 
      features: holes,
      totalVolume: holes.reduce((s, h) => s + h.geometry.volume, 0),
      avgConfidence: holes.length > 0 ? holes.reduce((s, h) => s + h.confidence, 0) / holes.length : 0
    };
  };

  const detectBosses = (geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const bosses: DetectedFeature[] = [];
    const cylFaces = faces.filter(f => f.type === 'cylindrical');
    const candidates = groupCylindricalFeatures(cylFaces, 'outward');
    candidates.forEach((cand, i) => {
      if (cand.faces.length >= 3 && cand.center.y > 0) {
        const center = calculateFeatureCenter(cand.faces);
        const bb = calculateFeatureBoundingBox(cand.faces);
        const d = estimateCylindricalDiameter(cand.faces);
        const h = bb.max.y - bb.min.y;
        bosses.push({
          id: `boss_${i}`,
          type: 'bosses',
          confidence: calculateBossConfidence(cand.faces, d, h),
          geometry: {
            center,
            boundingBox: bb,
            volume: Math.PI * (d / 2) ** 2 * h,
            surfaceArea: 2 * Math.PI * (d / 2) * h + Math.PI * (d / 2) ** 2,
          },
          properties: { diameter: d, depth: h },
          faces: [],
          vertices: cand.faces.flatMap((f: GeometryFace) => f.vertices),
          highlighted: false,
        });
      }
    });
    return {
      count: bosses.length,
      features: bosses,
      totalVolume: bosses.reduce((s, b) => s + b.geometry.volume, 0),
      avgConfidence: bosses.length > 0 ? bosses.reduce((s, b) => s + b.confidence, 0) / bosses.length : 0,
    };
  };

  const detectRibs = (geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const ribs: DetectedFeature[] = [];
    const vFaces = faces.filter(f => f.type === 'planar' && Math.abs(f.normal.y) < 0.3);
    const groups = groupThinFeatures(vFaces, 2.0);
    groups.forEach((group, i) => {
      const bb = calculateFeatureBoundingBox(group);
      const t = Math.min(bb.max.x - bb.min.x, bb.max.z - bb.min.z);
      const h = bb.max.y - bb.min.y;
      const l = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z);
      if (t < 5.0 && h > t * 2)
        ribs.push({
          id: `rib_${i}`,
          type: 'ribs',
          confidence: calculateRibConfidence(group, t, h, l),
          geometry: { center: calculateFeatureCenter(group), boundingBox: bb, volume: t * h * l, surfaceArea: 2 * (t * h + t * l + h * l) },
          properties: { thickness: t, length: l, depth: h },
          faces: [],
          vertices: group.flatMap(f => f.vertices),
          highlighted: false,
        });
    });
    return {
      count: ribs.length,
      features: ribs,
      totalVolume: ribs.reduce((s, r) => s + r.geometry.volume, 0),
      avgConfidence: ribs.length > 0 ? ribs.reduce((s, r) => s + r.confidence, 0) / ribs.length : 0,
    };
  };

  const detectFillets = (_geometry: THREE.BufferGeometry, edges: GeometryEdge[]): FeatureCollection => {
    const fillets: DetectedFeature[] = [];
    edges.forEach((e, i) => {
      if (e.type === 'smooth' && e.radius && e.radius > 0.1) {
        const center = new THREE.Vector3().addVectors(e.vertices[0], e.vertices[1]).multiplyScalar(0.5);
        fillets.push({
          id: `fillet_${i}`,
          type: 'fillets',
          confidence: 0.8,
          geometry: { center, boundingBox: new THREE.Box3().setFromPoints(e.vertices), volume: Math.PI * e.radius ** 2 * e.length / 4, surfaceArea: Math.PI * e.radius * e.length / 2 },
          properties: { radius: e.radius, length: e.length },
          faces: [],
          vertices: e.vertices,
          highlighted: false,
        });
      }
    });
    return {
      count: fillets.length,
      features: fillets,
      totalVolume: fillets.reduce((s, f) => s + f.geometry.volume, 0),
      avgConfidence: fillets.length > 0 ? fillets.reduce((s, f) => s + f.confidence, 0) / fillets.length : 0,
    };
  };

  const detectChamfers = (_geometry: THREE.BufferGeometry, edges: GeometryEdge[]): FeatureCollection => {
    const chamfers: DetectedFeature[] = [];
    edges.forEach((e, i) => {
      if (e.type === 'chamfer' && e.angle && e.angle > 30 && e.angle < 60) {
        const center = new THREE.Vector3().addVectors(e.vertices[0], e.vertices[1]).multiplyScalar(0.5);
        const w = e.length * Math.tan((e.angle * Math.PI) / 180);
        chamfers.push({
          id: `chamfer_${i}`,
          type: 'chamfers',
          confidence: 0.9,
          geometry: { center, boundingBox: new THREE.Box3().setFromPoints(e.vertices), volume: w * w * e.length / 2, surfaceArea: w * e.length },
          properties: { angle: e.angle, length: e.length, width: w },
          faces: [],
          vertices: e.vertices,
          highlighted: false,
        });
      }
    });
    return {
      count: chamfers.length,
      features: chamfers,
      totalVolume: chamfers.reduce((s, c) => s + c.geometry.volume, 0),
      avgConfidence: chamfers.length > 0 ? chamfers.reduce((s, c) => s + c.confidence, 0) / chamfers.length : 0,
    };
  };

  const detectThreads = (_geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const threads: DetectedFeature[] = [];
    faces.filter(f => f.type === 'cylindrical').forEach((face, i) => {
      if (face.curvature && face.curvature > 0.5) {
        const bb = new THREE.Box3().setFromPoints(face.vertices);
        const d = estimateCylindricalDiameter([face]);
        threads.push({
          id: `thread_${i}`,
          type: 'threads',
          confidence: Math.min(face.curvature, 1),
          geometry: { center: face.center, boundingBox: bb, volume: Math.PI * (d / 2) ** 2 * (bb.max.z - bb.min.z), surfaceArea: Math.PI * d * (bb.max.z - bb.min.z) },
          properties: { diameter: d, depth: bb.max.z - bb.min.z },
          faces: [],
          vertices: face.vertices,
          highlighted: false,
        });
      }
    });
    return {
      count: threads.length,
      features: threads,
      totalVolume: threads.reduce((s, t) => s + t.geometry.volume, 0),
      avgConfidence: threads.length > 0 ? threads.reduce((s, t) => s + t.confidence, 0) / threads.length : 0,
    };
  };

  const detectWalls = (_geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const walls: DetectedFeature[] = [];
    const planar = faces.filter(f => f.type === 'planar' && f.area > 1.0);
    const maxToCheck = Math.min(50, planar.length);
    const step = Math.max(1, Math.floor(planar.length / maxToCheck));

    for (let i = 0; i < maxToCheck; i += step) {
      const f1 = planar[i];
      planar.filter((f2, j) => j > i && f1.center.distanceTo(f2.center) < 20).forEach((f2, j) => {
        if (Math.abs(f1.normal.dot(f2.normal)) > 0.98) {
          const dist = f1.center.distanceTo(f2.center);
          if (dist > 0.5 && dist < 5.0 && (f1.area + f2.area) / 2 > 5.0) {
            const center = new THREE.Vector3().addVectors(f1.center, f2.center).multiplyScalar(0.5);
            const bb = new THREE.Box3().setFromPoints([...f1.vertices, ...f2.vertices]);
            walls.push({
              id: `wall_${i}_${j}`,
              type: 'walls',
              confidence: Math.max(0.5, 1 - dist / 5),
              geometry: { center, boundingBox: bb, volume: ((f1.area + f2.area) / 2) * dist, surfaceArea: f1.area + f2.area },
              properties: {
                thickness: Math.round(dist * 100) / 100,
                length: Math.round(Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * 100) / 100,
                depth: Math.round((bb.max.y - bb.min.y) * 100) / 100,
              },
              faces: [],
              vertices: [...f1.vertices, ...f2.vertices],
              highlighted: false,
            });
          }
        }
      });
    }
    return {
      count: walls.length,
      features: walls,
      totalVolume: walls.reduce((s, w) => s + w.geometry.volume, 0),
      avgConfidence: walls.length > 0 ? walls.reduce((s, w) => s + w.confidence, 0) / walls.length : 0,
    };
  };

  const detectDrafts = (_geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const drafts: DetectedFeature[] = [];
    faces.forEach((face, i) => {
      if (face.type === 'planar') {
        const vd = Math.abs(face.normal.dot(new THREE.Vector3(0, 1, 0)));
        const hd = Math.abs(face.normal.dot(new THREE.Vector3(1, 0, 0)));
        if ((vd > 0.95 && vd < 0.999) || (hd > 0.95 && hd < 0.999)) {
          const angle = Math.acos(Math.max(vd, hd)) * (180 / Math.PI);
          drafts.push({
            id: `draft_${i}`,
            type: 'drafts',
            confidence: 0.7,
            geometry: { center: face.center, boundingBox: new THREE.Box3().setFromPoints(face.vertices), volume: 0, surfaceArea: face.area },
            properties: { angle },
            faces: [],
            vertices: face.vertices,
            highlighted: false,
          });
        }
      }
    });
    return {
      count: drafts.length,
      features: drafts,
      totalVolume: 0,
      avgConfidence: drafts.length > 0 ? drafts.reduce((s, d) => s + d.confidence, 0) / drafts.length : 0,
    };
  };

  const detectUndercuts = (_geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const undercuts: DetectedFeature[] = [];
    const mainDir = new THREE.Vector3(0, 1, 0);
    faces.forEach((face, i) => {
      if (face.normal.dot(mainDir) < -0.1 && face.center.y < 0)
        undercuts.push({
          id: `undercut_${i}`,
          type: 'undercuts',
          confidence: Math.min(Math.abs(face.normal.dot(mainDir)), 1),
          geometry: { center: face.center, boundingBox: new THREE.Box3().setFromPoints(face.vertices), volume: 0, surfaceArea: face.area },
          properties: { angle: Math.acos(Math.abs(face.normal.dot(mainDir))) * (180 / Math.PI) },
          faces: [],
          vertices: face.vertices,
          highlighted: false,
        });
    });
    return {
      count: undercuts.length,
      features: undercuts,
      totalVolume: 0,
      avgConfidence: undercuts.length > 0 ? undercuts.reduce((s, u) => s + u.confidence, 0) / undercuts.length : 0,
    };
  };

  const detectTextEngraving = (_geometry: THREE.BufferGeometry, faces: GeometryFace[]): FeatureCollection => {
    const textFeatures: DetectedFeature[] = [];
    const small = faces.filter(f => f.area < 5.0 && f.type === 'planar');
    const groups = groupSmallFeatures(small, 2.0);
    groups.forEach((group, i) => {
      if (group.length > 5) {
        const center = calculateFeatureCenter(group);
        const bb = calculateFeatureBoundingBox(group);
        const area = group.reduce((s, f) => s + f.area, 0);
        textFeatures.push({
          id: `text_${i}`,
          type: 'textEngraving',
          confidence: Math.min(group.length / 20, 1),
          geometry: { center, boundingBox: bb, volume: area * 0.1, surfaceArea: area },
          properties: { width: bb.max.x - bb.min.x, length: bb.max.z - bb.min.z, depth: 0.1 },
          faces: [],
          vertices: group.flatMap(f => f.vertices),
          highlighted: false,
        });
      }
    });
    return {
      count: textFeatures.length,
      features: textFeatures,
      totalVolume: textFeatures.reduce((s, t) => s + t.geometry.volume, 0),
      avgConfidence: textFeatures.length > 0 ? textFeatures.reduce((s, t) => s + t.confidence, 0) / textFeatures.length : 0,
    };
  };

  // ── Feature helpers ──────────────────────────────────────────────────────

  const calculateTriangleArea = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) =>
    b.clone().sub(a).cross(c.clone().sub(a)).length() / 2;

  const calculateNormalVariance = (normals: THREE.Vector3[]): number => {
    if (normals.length < 2) return 0;
    const avg = normals.reduce((s, n) => s.add(n), new THREE.Vector3()).normalize();
    return normals.reduce((s, n) => s + (1 - Math.abs(n.dot(avg))), 0) / normals.length;
  };

  const groupCylindricalFeatures = (faces: GeometryFace[], _direction: string) => {
    const groups: Array<{ faces: GeometryFace[]; center: THREE.Vector3 }> = [];
    const processed = new Set<number>();
    faces.forEach((face, i) => {
      if (processed.has(i)) return;
      const group = { faces: [face], center: face.center };
      processed.add(i);
      faces.forEach((other, oi) => {
        if (!processed.has(oi) && face.center.distanceTo(other.center) < 5.0) {
          group.faces.push(other);
          processed.add(oi);
        }
      });
      groups.push(group);
    });
    return groups;
  };

  const calculateFeatureCenter = (faces: GeometryFace[]): THREE.Vector3 =>
    faces.reduce((s, f) => s.add(f.center), new THREE.Vector3()).multiplyScalar(1 / faces.length);

  const calculateFeatureBoundingBox = (faces: GeometryFace[]): THREE.Box3 => {
    const box = new THREE.Box3();
    faces.forEach(f => f.vertices.forEach(v => box.expandByPoint(v)));
    return box;
  };

  const estimateCylindricalDiameter = (faces: GeometryFace[]): number => {
    if (faces.length < 2) return 1;
    const dists: number[] = [];
    for (let i = 0; i < faces.length; i++)
      for (let j = i + 1; j < faces.length; j++)
        dists.push(faces[i].center.distanceTo(faces[j].center));
    return dists.reduce((s, d) => s + d, 0) / dists.length;
  };

  const groupPlanarFeatures = (faces: GeometryFace[], tol: number): GeometryFace[][] => {
    const groups: GeometryFace[][] = [];
    const processed = new Set<number>();
    faces.forEach((f, i) => {
      if (processed.has(i)) return;
      const group = [f];
      processed.add(i);
      faces.forEach((o, oi) => {
        if (!processed.has(oi) && f.center.distanceTo(o.center) < tol) {
          group.push(o);
          processed.add(oi);
        }
      });
      groups.push(group);
    });
    return groups;
  };

  const calculatePocketConfidence = (_faces: GeometryFace[], depth: number, area: number): number =>
    Math.min(0.4 + (depth > 0.5 ? 0.3 : 0) + (area > 10 ? 0.3 : 0), 1);

  const calculateWallSurfaceArea = (bb: THREE.Box3, depth: number): number =>
    2 * (bb.max.x - bb.min.x + (bb.max.z - bb.min.z)) * depth;

  const calculateBossConfidence = (_faces: GeometryFace[], diameter: number, height: number): number => {
    const ar = height / diameter;
    return Math.min(0.6 + (ar > 0.2 && ar < 3.0 ? 0.3 : 0), 1);
  };

  const groupThinFeatures = (faces: GeometryFace[], max: number): GeometryFace[][] =>
    groupPlanarFeatures(faces, max);

  const calculateRibConfidence = (_faces: GeometryFace[], t: number, h: number, l: number): number =>
    Math.min(0.5 + (h / t > 2 ? 0.3 : 0) + (l > t * 3 ? 0.2 : 0), 1);

  const groupSmallFeatures = (faces: GeometryFace[], tol: number): GeometryFace[][] =>
    groupPlanarFeatures(faces, tol);

  // ── Feature highlighting ─────────────────────────────────────────────────

  const getFeatureColor = (featureType: FeatureType): number => {
    const map: Record<FeatureType, number> = {
      pockets: 0x4444ff,
      slots: 0x44ffff,
      holes: 0xffa500,
      bosses: 0xff44ff,
      ribs: 0xffff44,
      fillets: 0x44ff44,
      chamfers: 0xff8844,
      threads: 0x8844ff,
      walls: 0x88ff44,
      drafts: 0xff8888,
      undercuts: 0xff0000,
      textEngraving: 0x888888,
    };
    return map[featureType];
  };

  const highlightFeatureOnMesh = (featureType: FeatureType, features: DetectedFeature[]): boolean => {
    if (!threeJSRef.current.model) return false;
    const highlightColor = new THREE.Color(getFeatureColor(featureType));
    const baseColor = new THREE.Color(0.8, 0.8, 0.8);
    let highlightedAny = false;

    threeJSRef.current.model.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
        const geometry = child.geometry;
        const posAttr = geometry.getAttribute('position');
        if (!posAttr) return;

        if (!geometry.getAttribute('normal')) {
          geometry.computeVertexNormals();
        }

        let colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        if (!colorAttr) {
          const colors = new Float32Array(posAttr.count * 3);
          colorAttr = new THREE.BufferAttribute(colors, 3);
          geometry.setAttribute('color', colorAttr);
        }

        const colorArray = colorAttr.array as Float32Array;
        for (let i = 0; i < posAttr.count; i++) {
          colorArray[i * 3] = baseColor.r;
          colorArray[i * 3 + 1] = baseColor.g;
          colorArray[i * 3 + 2] = baseColor.b;
        }

        features.forEach(feature => {
          const r = getFeatureHighlightRadius(feature);
          
          for (let i = 0; i < posAttr.count; i++) {
            const vertex = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
            const distance = vertex.distanceTo(feature.geometry.center);
            
            if (distance < r) {
              const intensity = 1.0 - (distance / r) * 0.3;
              colorArray[i * 3] = highlightColor.r * intensity;
              colorArray[i * 3 + 1] = highlightColor.g * intensity;
              colorArray[i * 3 + 2] = highlightColor.b * intensity;
              highlightedAny = true;
            }
          }
        });

        if (child.material instanceof THREE.Material) {
          const material = child.material as any;
          material.vertexColors = true;
          material.needsUpdate = true;
          material.transparent = false;
          material.opacity = 1.0;
        }
        
        colorAttr.needsUpdate = true;
      }
    });
    
    return highlightedAny;
  };

  const getFeatureHighlightRadius = (feature: DetectedFeature): number => {
    switch (feature.type) {
      case 'pockets': return Math.max(Math.min(feature.properties.width || 5, feature.properties.length || 5) * 0.8, 3.0);
      case 'bosses': return Math.max((feature.properties.diameter || 5) * 0.8, 3.0);
      case 'ribs': return Math.max((feature.properties.thickness || 2) * 2.5, 3.0);
      case 'walls': return Math.max((feature.properties.thickness || 2) * 2.0, 3.0);
      case 'fillets': return Math.max((feature.properties.radius || 1) * 2.5, 2.0);
      case 'chamfers': return Math.max((feature.properties.width || 2) * 2.0, 2.0);
      default: return 5.0;
    }
  };

  const clearFeatureHighlights = () => {
    if (viewerState.featureHighlights && threeJSRef.current.scene) {
      threeJSRef.current.scene.remove(viewerState.featureHighlights);
      viewerState.featureHighlights.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) child.material.dispose();
        }
      });
    }
    if (threeJSRef.current.model) {
      threeJSRef.current.model.traverse(child => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.BufferGeometry) {
          const ca = child.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
          if (ca) { (ca.array as Float32Array).fill(1); ca.needsUpdate = true; }
          if (child.material instanceof THREE.Material) {
            (child.material as any).vertexColors = false;
            child.material.needsUpdate = true;
          }
        }
      });
    }
    setViewerState(prev => ({ ...prev, selectedFeatureType: null, featureHighlights: null }));
  };

  // ── Manufacturing analysis ───────────────────────────────────────────────

  const performAdvancedManufacturingAnalysis = async (
    geometry: THREE.BufferGeometry,
    realTimeGeometry: any
  ) => {
    const complexity = analyzeGeometricComplexity(geometry, realTimeGeometry);
    const features = analyzeManufacturingFeatures(geometry, realTimeGeometry);
    const processAnalysis = determineOptimalProcess(complexity, features, realTimeGeometry);
    const materialRec = recommendOptimalMaterial(processAnalysis, realTimeGeometry);
    const finishRec = recommendOptimalFinish(processAnalysis, materialRec, realTimeGeometry);
    const threadingAnalysis = analyzeThreadingRequirements(geometry, realTimeGeometry);
    return {
      recommendedProcess: processAnalysis.processType,
      recommendedMaterial: materialRec.material,
      surfaceFinish: finishRec.finish,
      threadAnalysis: threadingAnalysis.analysis,
      complexity: complexity.level as 'Simple' | 'Medium' | 'Complex',
    };
  };

  const analyzeGeometricComplexity = (geometry: THREE.BufferGeometry, rtg: any) => {
    const { dimensions, volume, surfaceArea } = rtg;
    const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
    const minDim = Math.min(dimensions.length, dimensions.width, dimensions.height);
    const ar = maxDim / Math.max(minDim, 0.1);
    const svr = volume > 0 ? surfaceArea / volume : 0;
    const fc = (rtg.recognizedFeatures
      ? Object.values(rtg.recognizedFeatures).reduce((s: number, f: any) => s + (f.count || 0), 0)
      : 0) as number;

    let score = 0;
    if (maxDim > 200) score += 2; else if (maxDim > 100) score += 1;
    if (minDim < 2) score += 2;
    if (ar > 10) score += 3; else if (ar > 5) score += 2; else if (ar > 3) score += 1;
    if (svr > 50) score += 3; else if (svr > 25) score += 2; else if (svr > 15) score += 1;
    if (fc > 50) score += 3; else if (fc > 20) score += 2; else if (fc > 10) score += 1;

    return {
      level: score <= 3 ? 'Simple' : score <= 7 ? 'Medium' : 'Complex',
      score,
      factors: { aspectRatio: ar, surfaceVolumeRatio: svr, featureCount: fc },
    };
  };

  const analyzeManufacturingFeatures = (geometry: THREE.BufferGeometry, rtg: any) => {
    const features = rtg.recognizedFeatures || {};
    return {
      pockets: features.pockets?.count || 0,
      threads: features.threads?.count || 0,
      undercuts: features.undercuts?.count || 0,
      drafts: features.drafts?.count || 0,
      chamfers: features.chamfers?.count || 0,
      fillets: features.fillets?.count || 0,
      manufacturingFactors: {
        thinWalls: rtg.wallThickness.min < 1.5,
        deepPockets: (features.pockets?.count || 0) > 0,
        hasUndercuts: (features.undercuts?.count || 0) > 0,
        needsThreading: (features.threads?.count || 0) > 0,
        hasComplexSurfaces: ((features.fillets?.count || 0) + (features.chamfers?.count || 0)) > 10,
      },
    };
  };

  const determineOptimalProcess = (complexity: any, features: any, rtg: any) => {
    const { dimensions } = rtg;
    const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
    let cncScore = 6;
    if (maxDim >= 10 && maxDim <= 500) cncScore += 3;
    if (features.pockets > 0) cncScore += 2;

    let printScore = 5;
    if (maxDim <= 200) printScore += 3;
    if (features.undercuts > 0) printScore += 2;

    const processes = [
      { type: 'CNC Machining', score: cncScore },
      { type: 'Additive Manufacturing', score: printScore },
      { type: 'Injection Molding', score: features.drafts > 0 ? 6 : 3 },
      { type: 'Sheet Metal Fabrication', score: 2 },
    ].sort((a, b) => b.score - a.score);

    return {
      processType: processes[0].type,
      confidence: Math.min(processes[0].score / 10, 1),
      suitability: processes[0].score >= 8 ? 'Excellent' : processes[0].score >= 6 ? 'Good' : 'Fair',
    };
  };

  const recommendOptimalMaterial = (processAnalysis: any, rtg: any) => {
    const { dimensions, volume } = rtg;
    const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
    let material = 'Aluminum 6061-T6';
    if (processAnalysis.processType.includes('CNC')) {
      if (maxDim <= 50 && volume <= 5000) material = 'Aluminum 7075-T6';
      else if (maxDim > 200) material = 'Steel 4140 (Heat Treated)';
    } else if (processAnalysis.processType.includes('Additive')) {
      material = maxDim <= 100 ? 'Engineering Resin' : 'Engineering Polymer';
    } else if (processAnalysis.processType.includes('Injection')) {
      material = 'PC/ABS Blend';
    } else if (processAnalysis.processType.includes('Sheet')) {
      material = 'Aluminum 5052-H32';
    }
    return { material, confidence: 0.75 };
  };

  const recommendOptimalFinish = (processAnalysis: any, materialRec: any, _rtg: any) => {
    const p = processAnalysis.processType;
    const m = materialRec.material;
    let finish = 'Standard Industrial Finish';
    if (p.includes('CNC')) {
      finish = m.includes('Aluminum') ? 'Clear Anodize (Type II)' : m.includes('Steel') ? 'Zinc Chromate Plating' : 'Passivated (ASTM A967)';
    } else if (p.includes('Additive')) {
      finish = 'Standard Surface Finish';
    } else if (p.includes('Injection')) {
      finish = 'Semi-Gloss Mold Texture';
    } else if (p.includes('Sheet')) {
      finish = 'Powder Coating';
    }
    return { finish, confidence: 0.7 };
  };

  const analyzeThreadingRequirements = (_geometry: THREE.BufferGeometry, rtg: any) => {
    const threads = rtg.recognizedFeatures?.threads?.count || 0;
    if (threads > 0) return { analysis: `${threads} threaded features detected` };
    return { analysis: 'None Detected' };
  };

  // ── ViewCube & render loop ───────────────────────────────────────────────

  const initializeViewCube = () => {
    if (!viewCubeRef.current) {
      console.warn('ViewCube canvas not available');
      return;
    }
    
    const canvas = viewCubeRef.current;
    const size = 144;

    // Double-check canvas is valid before creating renderer
    if (!canvas || !canvas.getContext) {
      console.warn('Invalid canvas element for ViewCube');
      return;
    }

    try {
      const scene = new THREE.Scene();
      threeJSRef.current.viewCube.scene = scene;

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(3, 3, 3);
      camera.lookAt(0, 0, 0);
      threeJSRef.current.viewCube.camera = camera;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(size, size);
      renderer.setClearColor(0x000000, 0);
      threeJSRef.current.viewCube.renderer = renderer;

      const materials = [0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf9ca24, 0x6c5ce7, 0xa0a0a0].map(
        c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.8 })
      );
      const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
      scene.add(cube);
      threeJSRef.current.viewCube.cube = cube;

      const wf = new THREE.WireframeGeometry(new THREE.BoxGeometry(1, 1, 1));
      scene.add(new THREE.LineSegments(wf, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: true })));

      canvas.addEventListener('click', handleViewCubeClick);
      
    } catch (error) {
      console.error('Failed to initialize ViewCube:', error);
      // ViewCube is optional, continue without it
    }
  };

  const handleViewCubeClick = (event: MouseEvent) => {
    if (!viewCubeRef.current || !threeJSRef.current.camera || !threeJSRef.current.controls) return;
    const rect = viewCubeRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const dist = 8;
    let pos = new THREE.Vector3();
    if (Math.abs(x) > Math.abs(y)) pos.set(x > 0 ? dist : -dist, 0, 0);
    else pos.set(0, y > 0 ? dist : -dist, 0);
    animateCamera(pos);
  };

  const animateCamera = (target: THREE.Vector3) => {
    if (!threeJSRef.current.camera || !threeJSRef.current.controls) return;
    const start = threeJSRef.current.camera.position.clone();
    const startTime = Date.now();
    const animate = () => {
      const p = Math.min((Date.now() - startTime) / 500, 1);
      const ep = 1 - (1 - p) ** 3;
      threeJSRef.current.camera!.position.lerpVectors(start, target, ep);
      threeJSRef.current.controls!.update();
      if (p < 1) requestAnimationFrame(animate);
    };
    animate();
  };

  const startRenderLoop = () => {
    const animate = () => {
      if (!threeJSRef.current.renderer || !threeJSRef.current.scene || !threeJSRef.current.camera) return;
      if (threeJSRef.current.controls) threeJSRef.current.controls.update();
      if (threeJSRef.current.viewCube.cube && threeJSRef.current.viewCube.renderer) {
        threeJSRef.current.viewCube.cube.rotation.copy(threeJSRef.current.camera.rotation);
        threeJSRef.current.viewCube.renderer.render(threeJSRef.current.viewCube.scene!, threeJSRef.current.viewCube.camera!);
      }
      threeJSRef.current.animationId = requestAnimationFrame(animate);
      threeJSRef.current.renderer.render(threeJSRef.current.scene, threeJSRef.current.camera);
    };
    animate();
  };

  // ── Controls ─────────────────────────────────────────────────────────────

  const handleZoomIn = () => { threeJSRef.current.controls?.dollyIn(1.2); threeJSRef.current.controls?.update(); };
  const handleZoomOut = () => { threeJSRef.current.controls?.dollyOut(1.2); threeJSRef.current.controls?.update(); };

  const handleReset = () => {
    if (threeJSRef.current.camera && threeJSRef.current.controls) {
      threeJSRef.current.camera.position.set(5, 5, 5);
      threeJSRef.current.controls.target.set(0, 0, 0);
      threeJSRef.current.controls.update();
    }
    threeJSRef.current.model?.rotation.set(0, 0, 0);
  };

  const toggleWireframe = () => {
    const next = !viewerState.isWireframe;
    threeJSRef.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshPhongMaterial) {
        c.material.wireframe = next;
      }
    });
    setViewerState(prev => ({ ...prev, isWireframe: next }));
  };

  const toggleGrid = () => {
    const next = !viewerState.showGrid;
    if (threeJSRef.current.gridHelper) threeJSRef.current.gridHelper.visible = next;
    setViewerState(prev => ({ ...prev, showGrid: next }));
  };

  const toggleTransparency = () => {
    const next = !viewerState.isTransparent;
    threeJSRef.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh) {
        c.material.transparent = next;
        (c.material as any).opacity = next ? 0.7 : 1.0;
        c.material.needsUpdate = true;
      }
    });
    setViewerState(prev => ({ ...prev, isTransparent: next }));
  };

  const toggleCrossSection = () => {
    const next = !viewerState.showCrossSection;
    if (threeJSRef.current.model) {
      const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
      threeJSRef.current.model.traverse(c => {
        if (c instanceof THREE.Mesh) {
          (c.material as any).clippingPlanes = next ? [plane] : [];
          c.material.needsUpdate = true;
        }
      });
    }
    if (threeJSRef.current.renderer) threeJSRef.current.renderer.localClippingEnabled = next;
    setViewerState(prev => ({ ...prev, showCrossSection: next }));
  };

  const toggleXRayView = () => {
    const next = !viewerState.isXRayView;
    threeJSRef.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh) {
        if (next) { c.material.transparent = true; (c.material as any).opacity = 0.3; (c.material as any).wireframe = true; }
        else { c.material.transparent = viewerState.isTransparent; (c.material as any).opacity = viewerState.isTransparent ? 0.7 : 1.0; (c.material as any).wireframe = viewerState.isWireframe; }
        c.material.needsUpdate = true;
      }
    });
    setViewerState(prev => ({ ...prev, isXRayView: next }));
  };

  const changeModelColor = (color: string) => {
    threeJSRef.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshPhongMaterial) {
        c.material.color.setHex(parseInt(color.replace('#', '0x')));
        c.material.needsUpdate = true;
      }
    });
  };

  const handleMeasureUnitsChange = (units: 'mm' | 'cm' | 'm' | 'in') => {
    setViewerState(prev => ({ ...prev, measureUnits: units }));
    onUnitChange?.(units);
  };

  const takeScreenshot = () => {
    if (threeJSRef.current.renderer && threeJSRef.current.scene && threeJSRef.current.camera) {
      threeJSRef.current.renderer.render(threeJSRef.current.scene, threeJSRef.current.camera);
      const link = document.createElement('a');
      link.download = `${fileName || 'cad_model'}_screenshot.png`;
      link.href = threeJSRef.current.renderer.domElement.toDataURL('image/png');
      link.click();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    if (viewerState.stlData) {
      link.href = `data:application/octet-stream;base64,${viewerState.stlData}`;
      link.download = fileName.replace(/\.[^/.]+$/, '.stl');
    } else if (fileUrl) {
      link.href = fileUrl;
      link.download = fileName;
    }
    link.click();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: `CAD Model: ${fileName}`, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
    } catch { /* ignore */ }
  };

  const convertMeasureUnits = (mm: number): number => {
    switch (viewerState.measureUnits) {
      case 'cm': return Math.round(mm / 10 * 100) / 100;
      case 'm': return Math.round(mm / 1000 * 10000) / 10000;
      case 'in': return Math.round(mm / 25.4 * 1000) / 1000;
      default: return Math.round(mm * 100) / 100;
    }
  };

  // ── DFM Chat ─────────────────────────────────────────────────────────────

  const toggleChat = () => setViewerState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }));
  
  const performGeometryAnalysis = async (geometry: THREE.BufferGeometry) => {
    setViewerState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const analysis = await analyzeRealTimeGeometry(geometry);
      const manufacturingAnalysis = await performAdvancedManufacturingAnalysis(geometry, analysis);
      const finalAnalysis = { ...analysis, ...manufacturingAnalysis };
      setViewerState(prev => ({ ...prev, realTimeGeometry: finalAnalysis, isAnalyzing: false }));
      onGeometryAnalyzed?.(finalAnalysis);
    } catch (error) {
      console.error('Geometry analysis failed:', error);
      setViewerState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  // Format bot messages with clean typography and structure
  const formatBotMessage = (content: string): string => {
    // Clean up the content and remove problematic characters
    let formatted = content.trim()
      .replace(/[""'']/g, '"') // Replace smart quotes
      .replace(/[–—]/g, '-') // Replace em/en dashes
      .replace(/…/g, '...') // Replace ellipsis
      .replace(/[^\x20-\x7E\n\r]/g, ''); // Remove other non-ASCII chars
    
    // Convert markdown headers to styled headers
    formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="font-bold text-emuski-teal mb-2 mt-4 text-lg">$1</h3>');
    formatted = formatted.replace(/^### (.+)$/gm, '<h4 class="font-semibold text-gray-800 mb-2 mt-3">$1</h4>');
    
    // Convert bullet points to styled lists
    formatted = formatted.replace(/^- (.+)$/gm, '<li class="text-base leading-relaxed py-0.5">$1</li>');
    formatted = formatted.replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="space-y-1 ml-4 my-2 text-gray-900">$1</ul>');
    
    // Highlight technical specifications
    formatted = formatted.replace(/\b(\d+(?:\.\d+)?)\s*(mm|cm|m|in|kg|g|degrees|%)\b/g, '<span class="font-mono bg-emuski-teal/15 text-emuski-teal px-1 py-0.5 rounded text-sm font-semibold">$1$2</span>');
    
    // Highlight key terms
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
    
    // Convert line breaks to clean paragraphs
    const lines = formatted.split('\n');
    const processedLines = lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.includes('<') || trimmed.startsWith('#')) {
        return line;
      } else {
        return `<p class="leading-relaxed text-base text-gray-900 my-1">${line}</p>`;
      }
    });
    
    return processedLines.join('\n');
  };

  const sendChatMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    if (!isAuthenticated) {
      setViewerState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, {
          id: `bot-auth-${Date.now()}`, type: 'bot',
          content: '🔐 Sign in required to use AI analysis features.',
          timestamp: Date.now(),
        }],
      }));
      return;
    }

    // Check if user has credits remaining
    if (creditInfo && creditInfo.remaining <= 0) {
      setViewerState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, {
          id: `bot-credit-${Date.now()}`, type: 'bot',
          content: `💳 You have used all ${creditInfo.limit} of your daily AI analysis credits. Credits reset in ${creditInfo.timeUntilReset} hours.`,
          timestamp: Date.now(),
        }],
      }));
      return;
    }

    setViewerState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { id: `user-${Date.now()}`, type: 'user', content: userMessage.trim(), timestamp: Date.now() }],
      isChatLoading: true,
    }));

    try {
      const botResponse = await generateModelSpecificDFMResponse(userMessage);
      setViewerState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, { id: `bot-${Date.now()}`, type: 'bot', content: botResponse, timestamp: Date.now() }],
        isChatLoading: false,
      }));

      // Notify parent component to refresh credits after successful AI usage
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'refreshCredits' }, '*');
      } else {
        window.postMessage({ type: 'refreshCredits' }, '*');
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      let errorMessage = 'Sorry, I encountered an error. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'AI service temporarily unavailable. The API endpoint may have changed.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'API key issue. Please check the Gemini API configuration.';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = 'API rate limit exceeded. Please try again in a few moments.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
      }
      
      setViewerState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, { id: `bot-err-${Date.now()}`, type: 'bot', content: errorMessage, timestamp: Date.now() }],
        isChatLoading: false,
      }));
    }
  };

  const generateModelSpecificDFMResponse = async (userMessage: string): Promise<string> => {
    try {
      // Require authentication for DFM analysis
      const userId = user?.id;
      if (!userId) {
        return 'Please sign in to use AI-powered DFM analysis. This feature requires authentication to track your usage credits.';
      }

      // Ensure we have geometry analysis - trigger it if needed
      if (!viewerState.realTimeGeometry && viewerState.currentGeometry) {
        try {
          console.log('Triggering geometry analysis for AI...');
          await performGeometryAnalysis(viewerState.currentGeometry);
          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.log('Geometry analysis failed, proceeding with available data');
        }
      }

      // Prepare request data (userId already defined above)
      const requestData = {
        message: userMessage,
        geometryData: viewerState.realTimeGeometry,
        fileName,
        userId,
        priority: 'normal'
      };

      console.log('Sending DFM analysis request to Claude...');

      // Credit deduction is handled server-side for authenticated users

      // Create abort controller for the request
      const abortController = new AbortController();
      
      // Set a timeout for the request (2 minutes max)
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 120000);

      try {
        // Get JWT token for authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session?.access_token) {
          console.error('Authentication failed:', sessionError);
          setViewerState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, {
              id: `bot-auth-error-${Date.now()}`,
              type: 'bot',
              content: 'Authentication error. Please sign in again to use AI features.',
              timestamp: Date.now(),
            }],
            isChatLoading: false,
          }));
          return;
        }

        // Call Claude API endpoint with abort signal
        const response = await fetch('/api/dfm-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(requestData),
          signal: abortController.signal
        });

        // Clear timeout on successful response
        clearTimeout(timeoutId);

        if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (response.status === 401) {
          // Authentication failed - disable chat
          setViewerState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, {
              id: `bot-auth-failed-${Date.now()}`,
              type: 'bot',
              content: 'Authentication expired. Please refresh the page and sign in again.',
              timestamp: Date.now(),
            }],
            isChatLoading: false,
          }));
          return;
        }

        if (response.status === 403) {
          // Authorization failed - disable chat
          setViewerState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, {
              id: `bot-auth-forbidden-${Date.now()}`,
              type: 'bot',
              content: 'Access denied. You do not have permission to use AI analysis features.',
              timestamp: Date.now(),
            }],
            isChatLoading: false,
          }));
          return;
        }

        if (response.status === 402) {
          // Insufficient credits
          const { creditsRequired, creditsRemaining, timeUntilReset, message } = errorData;
          return `**Insufficient Credits**\n\n${message || 'You need more credits to perform this analysis.'}\n\n**Next Steps:**\n- Wait ${Math.ceil(timeUntilReset)} hours for credit reset\n- Contact support for premium plan options`;
        }
        
        if (response.status === 429) {
          // Rate limited
          const { nextRetryAfter } = errorData;
          return `**Rate Limit Exceeded**\n\nToo many requests. Please wait ${nextRetryAfter || 60} seconds before trying again.`;
        }
        
        // Don't throw errors for certain status codes - handle gracefully
        if (response.status === 503) {
          return `**Service Temporarily Unavailable**\n\nThe analysis service is currently under maintenance. Please try again in a few moments.`;
        }
        
        if (response.status >= 500) {
          return `**Server Error**\n\nThere was a temporary server issue. Please try again or contact support if this persists.`;
        }
        
          throw new Error(errorData.error || `API request failed with status ${response.status}`);
        }

        const data = await response.json();
      
      // Handle queued response
      if (data.queued) {
        const { requestId, estimatedWaitTime, checkStatusUrl } = data;
        
        // Poll for result
        return await pollForQueuedResult(requestId, estimatedWaitTime);
      }
      
      console.log('Claude analysis completed successfully');
      
      // Refresh credits after successful analysis
      if (data.metadata?.creditsUsed) {
        console.log('🔄 Credits were used, triggering refresh:', data.metadata.creditsUsed);
        // Trigger parent component to refresh credit display
        if (window.parent !== window) {
          window.parent.postMessage({ type: 'refreshCredits' }, '*');
        } else {
          window.postMessage({ type: 'refreshCredits' }, '*');
        }
      }

        return data.content || 'No analysis content received.';
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // Handle abort errors specifically
        if (fetchError.name === 'AbortError') {
          return '**Request Timeout**\n\nThe analysis request timed out. Please try again with a shorter message or contact support if this persists.';
        }
        
        throw fetchError;
      }
    } catch (error: any) {
      console.error('DFM Analysis error:', error);
      
      // Handle abort errors
      if (error.name === 'AbortError') {
        return '**Request Timeout**\n\nThe analysis request was cancelled or timed out. Please try again.';
      }
      
      // Return user-friendly error message
      if (error.message.includes('Rate limit') || error.message.includes('429')) {
        return '**Rate Limit**\n\nAnalysis temporarily unavailable due to high demand. Please try again in a moment.';
      }
      
      if (error.message.includes('authentication') || error.message.includes('configured') || error.message.includes('503')) {
        return '**Service Unavailable**\n\nAI analysis service is currently unavailable. Please contact support if this persists.';
      }
      
      if (error.message.includes('Insufficient credits') || error.message.includes('402')) {
        return '**Credits Required**\n\nYou need more credits to perform this analysis. Credits reset every 24 hours.';
      }
      
      if (error.message.includes('Credit system') || error.message.includes('503')) {
        return '**System Maintenance**\n\nCredit system is temporarily unavailable, but analysis is still working. Your request has been processed successfully.';
      }
      
      return '**Analysis Error**\n\nUnable to complete DFM analysis at this time. Please try again or contact support if the problem continues.';
    }
  };

  // Helper function to poll for queued request results
  const pollForQueuedResult = async (requestId: string, estimatedWaitTime: number): Promise<string> => {
    const maxPollTime = Math.min(estimatedWaitTime * 1000 * 2, 120000); // Max 2 minutes
    const pollInterval = 2000; // 2 seconds
    const startTime = Date.now();
    
    const updateMessage = (waitTime: number) => {
      return `**Analysis Queued**\n\nYour request is being processed...\n\nEstimated wait time: ${Math.ceil(waitTime / 1000)} seconds\nRequest ID: \`${requestId}\``;
    };
    
    // Show initial queued message
    setViewerState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages.slice(0, -1), {
        id: `bot-queued-${Date.now()}`,
        type: 'bot',
        content: updateMessage(estimatedWaitTime * 1000),
        timestamp: Date.now(),
      }],
    }));
    
    while (Date.now() - startTime < maxPollTime) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      try {
        const response = await fetch(`/api/dfm-analysis/status/${requestId}`);
        const result = await response.json();
        
        if (response.ok && result.content) {
          // Success - return the analysis
          return result.content;
        }
        
        if (result.error && !result.status) {
          // Permanent error
          throw new Error(result.error);
        }
        
        // Update progress message
        const remainingTime = Math.max(0, estimatedWaitTime * 1000 - (Date.now() - startTime));
        if (remainingTime > 0) {
          setViewerState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages.slice(0, -1), {
              id: `bot-queued-${Date.now()}`,
              type: 'bot',
              content: updateMessage(remainingTime),
              timestamp: Date.now(),
            }],
          }));
        }
        
      } catch (error) {
        console.error('Polling error:', error);
        // Continue polling unless it's a permanent error
      }
    }
    
    // Timeout
    return '**Request Timeout**\n\nAnalysis is taking longer than expected. Please try again with a simpler question or contact support.';
  };

  // ── Error handling ──────────────────────────────────────────────────────
  if (viewerState.error) {
    return (
      <div className={`relative bg-card rounded-xl border border-border overflow-hidden ${className}`}>
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Model</h3>
            <p className="text-sm text-muted-foreground mb-4">{viewerState.error}</p>
            <Button onClick={() => window.location.reload()} className="bg-emuski-teal hover:bg-emuski-teal/80">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:border-emuski-teal transition-all duration-300 ${className}`}>
      {/* Loading */}
      {viewerState.isLoading && (
        <div className="absolute inset-0 bg-card/90 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-emuski-teal animate-spin" />
            <p className="text-sm font-medium text-foreground">Processing CAD Model...</p>
            <p className="text-xs text-muted-foreground mt-1">
              {viewerState.engineAvailable ? 'Using professional OpenCascade engine' : 'Using local processing'}
            </p>
          </div>
        </div>
      )}

      {/* 3D Viewer */}
      <div
        ref={viewerRef}
        className="w-full h-full min-h-[300px] bg-gradient-to-br from-muted/20 to-muted/40 touch-manipulation"
        style={{ cursor: 'grab', touchAction: 'pan-x pan-y pinch-zoom' }}
      />

      {/* Control Panel – Desktop */}
      <div className="absolute top-2 sm:top-6 left-2 sm:left-6 z-10 flex items-start gap-3">
        <div className="hidden sm:flex flex-col gap-2 sm:gap-3 rounded-lg sm:rounded-2xl bg-white/80 p-2 sm:p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-200/50 min-w-[180px] sm:min-w-[220px] max-w-[200px] sm:max-w-none text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setViewerState(prev => ({ ...prev, measureMode: !prev.measureMode }))}
              className={`flex-1 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium transition-all border ${viewerState.measureMode ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200/60 text-slate-600'}`}
            >
              Measure
            </button>
            <select
              value={viewerState.measureUnits}
              onChange={e => handleMeasureUnitsChange(e.target.value as 'mm' | 'cm' | 'm' | 'in')}
              className="bg-slate-50 border border-slate-200/60 rounded-md px-1 sm:px-2 py-1 text-xs font-medium text-slate-700 outline-none"
            >
              <option value="mm">mm</option>
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
            </select>
          </div>

          <div className="h-px bg-slate-200/60" />

          {[
            { label: 'Wireframe', key: 'isWireframe', action: toggleWireframe },
            { label: 'X-Ray View', key: 'isXRayView', action: toggleXRayView },
            { label: 'Cross Section', key: 'showCrossSection', action: toggleCrossSection },
          ].map(({ label, key, action }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-slate-500 text-xs font-medium">{label}</span>
              <button
                onClick={action}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${(viewerState as any)[key] ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${(viewerState as any)[key] ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}

          <div className="h-px bg-slate-200/60" />

          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Model Colors</div>
            <div className="flex justify-between items-center gap-1">
              {['#17B8BA', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#334155'].map(c => (
                <button
                  key={c}
                  className={`h-5 w-5 rounded-full border ring-offset-2 transition-all hover:scale-110 ${viewerState.modelColor === c ? 'ring-2 ring-blue-500 scale-110 border-white' : 'border-slate-200'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => { setViewerState(prev => ({ ...prev, modelColor: c })); changeModelColor(c); }}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200/60" />

          <div className="grid grid-cols-2 gap-2">
            <button onClick={takeScreenshot} className="rounded-lg bg-slate-50 border border-slate-200/60 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-white hover:border-blue-200 transition-all">
              Screenshot
            </button>
            <button onClick={toggleGrid} className="rounded-lg bg-slate-50 border border-slate-200/60 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-white hover:border-blue-200 transition-all">
              Grid
            </button>
          </div>

          <div className="h-px bg-slate-200/60" />

          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/40">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Model Bounds</div>
            {viewerState.realTimeGeometry ? (
              <>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  {(['length', 'width', 'height'] as const).map((k, idx) => (
                    <div key={k} className="flex flex-col">
                      <span className="text-slate-400">{['X', 'Y', 'Z'][idx]}</span>
                      <span className="text-slate-700 font-bold">
                        {convertMeasureUnits(viewerState.realTimeGeometry!.dimensions[k])}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-1 text-[10px] text-right text-slate-400 uppercase">{viewerState.measureUnits}</div>
              </>
            ) : (
              <div className="text-[11px] text-slate-400">Loading…</div>
            )}
          </div>
        </div>
      </div>

      {/* ViewCube */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 pointer-events-auto z-50">
        <div className="w-24 h-24 sm:w-36 sm:h-36 relative">
          <canvas
            ref={viewCubeRef}
            width="144"
            height="144"
            className="absolute left-0 top-0 w-full h-full cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', backdropFilter: 'blur(12px)' }}
          />
        </div>
      </div>

      {/* Analysis Results */}
      {viewerState.analysisData && (
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 bg-card/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-border/50 max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs sm:text-sm font-semibold text-foreground flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              DFM Analysis Complete
            </h4>
            <Badge variant="outline">{viewerState.analysisData.dfm_analysis.difficulty_level}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>
              <span className="text-muted-foreground">Manufacturability: </span>
              <span className="font-medium">{Math.round(viewerState.analysisData.dfm_analysis.manufacturability_score)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Volume: </span>
              <span className="font-medium">{(viewerState.analysisData.geometry_features.volume_mm3 / 1000).toFixed(1)} cm³</span>
            </div>
          </div>
        </div>
      )}

      {/* Zoom / Share controls */}
      <div className="absolute bottom-16 sm:bottom-20 right-2 sm:right-4 z-50">
        <div className="flex gap-1 bg-card/80 backdrop-blur-sm rounded-md p-1 border border-border/50">
          {[
            { title: 'Zoom In', action: handleZoomIn, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-6-3v6m-3-3h6" /> },
            { title: 'Zoom Out', action: handleZoomOut, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-3-3H8" /> },
            { title: 'Share', action: handleShare, icon: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></> },
          ].map(({ title, action, icon }) => (
            <button key={title} title={title} onClick={action} className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-emuski-teal/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-[60]">
        {!viewerState.isChatOpen && (
          <button
            onClick={toggleChat}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-emuski-teal hover:bg-emuski-teal/80 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 border-2 border-white/20"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        )}

        {viewerState.isChatOpen && (
          <div className="absolute bottom-0 right-0 w-full sm:w-[400px] md:w-[450px] h-[70vh] sm:h-[75vh] md:h-[80vh] max-h-[700px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col z-50">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-emuski-teal to-emuski-teal/90">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <h3 className="font-semibold text-base text-white">AI Manufacturing Assistant</h3>
                <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20 hidden sm:inline-flex">{fileName}</Badge>
              </div>
              <button onClick={toggleChat} className="text-white/70 hover:text-white p-1 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {viewerState.chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                  {msg.type === 'bot' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-emuski-teal/10 rounded-full flex items-center justify-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emuski-teal">
                        <path d="M12 8V4H8"/>
                        <rect width="16" height="12" x="4" y="8" rx="2"/>
                        <path d="M2 14h2"/>
                        <path d="M20 14h2"/>
                        <path d="M15 13v2"/>
                        <path d="M9 13v2"/>
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-lg shadow-sm border ${
                    msg.type === 'user' 
                      ? 'bg-emuski-teal text-white border-emuski-teal/20' 
                      : 'bg-gray-50 text-gray-900 border-gray-200'
                  }`}>
                    <div className={`p-5 ${msg.type === 'bot' ? 'space-y-4' : ''}`}>
                      {msg.type === 'bot' ? (
                        <div 
                          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-ul:text-gray-900 prose-li:text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: formatBotMessage(msg.content)
                          }}
                        />
                      ) : (
                        <p className="text-base font-medium">{msg.content}</p>
                      )}
                    </div>
                    <div className={`px-5 pb-3 text-sm opacity-70 ${msg.type === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {msg.type === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 bg-emuski-teal/10 rounded-full flex items-center justify-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emuski-teal">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              {viewerState.isChatLoading && (
                <div className="flex justify-start items-start gap-2">
                  <div className="flex-shrink-0 w-10 h-10 bg-emuski-teal/10 rounded-full flex items-center justify-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emuski-teal animate-pulse">
                      <path d="M12 8V4H8"/>
                      <rect width="16" height="12" x="4" y="8" rx="2"/>
                      <path d="M2 14h2"/>
                      <path d="M20 14h2"/>
                      <path d="M15 13v2"/>
                      <path d="M9 13v2"/>
                    </svg>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-5 max-w-[85%]">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1">
                        {[0, 75, 150].map(d => (
                          <div key={d} className="w-2 h-2 bg-emuski-teal rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                      <span className="text-base text-gray-700">Analyzing 3D model and generating insights...</span>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      Examining geometry, features, and manufacturability
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200">
              {/* Suggested DFM Questions */}
              {isAuthenticated && !viewerState.suggestionsHidden && (
                <div className="mb-2 p-2 bg-gradient-to-r from-emuski-teal/10 to-blue-500/10 border border-emuski-teal/20 rounded-lg relative">
                  <button
                    onClick={() => setViewerState(prev => ({ ...prev, suggestionsHidden: true }))}
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Close suggestions"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M18 6L6 18"/>
                      <path d="M6 6l12 12"/>
                    </svg>
                  </button>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 mb-2 flex items-center gap-1 pr-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-emuski-teal">
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                    Get started with these questions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {[
                      { full: "What holes are detected and what are the manufacturing challenges?", short: "Holes & challenges?" },
                      { full: "What's the estimated cost to manufacture this part?", short: "Manufacturing cost?" },
                      { full: "What are the exact dimensions and tolerances?", short: "Dimensions & tolerances?" },
                      { full: "What machining problems will I face?", short: "Machining problems?" },
                      { full: "How can I reduce manufacturing cost?", short: "Reduce cost?" },
                      { full: "What material and process do you recommend?", short: "Material recommendation?" }
                    ].map((question, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                          if (input) {
                            input.value = question.full;
                            input.focus();
                          }
                          // Auto-close suggestions after selection
                          setViewerState(prev => ({ ...prev, suggestionsHidden: true }));
                        }}
                        className="px-2 py-1.5 text-left text-xs bg-white hover:bg-gray-50 border border-gray-200 hover:border-emuski-teal/30 rounded text-gray-900 hover:text-emuski-teal transition-all duration-200 shadow-sm hover:shadow-md group"
                      >
                        <div className="flex items-center gap-1">
                          <span className="flex-1">
                            <span className="hidden sm:inline">{question.full}</span>
                            <span className="sm:hidden">{question.short}</span>
                          </span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <path d="M5 12h14"/>
                            <path d="m12 5 7 7-7 7"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show suggestions button when hidden */}
              {isAuthenticated && viewerState.suggestionsHidden && (
                <div className="mb-4">
                  <button
                    onClick={() => setViewerState(prev => ({ ...prev, suggestionsHidden: false }))}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-emuski-teal hover:text-emuski-teal-dark bg-emuski-teal/5 hover:bg-emuski-teal/10 border border-emuski-teal/20 rounded-lg transition-all duration-200 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                    Show suggested questions
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 group-hover:translate-y-0.5 transition-transform duration-200">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                </div>
              )}

              <form
                onSubmit={e => {
                  e.preventDefault();
                  const inp = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
                  if (inp.value.trim()) { sendChatMessage(inp.value); inp.value = ''; }
                }}
                className="relative"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      !isAuthenticated ? 'Sign in to use AI analysis features' :
                      (creditInfo && creditInfo.remaining <= 0) ? `No credits remaining - resets in ${creditInfo.timeUntilReset}h` :
                      `Ask anything about ${fileName}...`
                    }
                    className="w-full pl-3 pr-12 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emuski-teal/50 focus:border-emuski-teal bg-white shadow-sm transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                    disabled={viewerState.isChatLoading || !isAuthenticated || (creditInfo && creditInfo.remaining <= 0)}
                  />
                  <button 
                    type="submit" 
                    disabled={viewerState.isChatLoading || !isAuthenticated || (creditInfo && creditInfo.remaining <= 0)} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emuski-teal text-white rounded-md hover:bg-emuski-teal/80 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group shadow-sm hover:shadow-md"
                  >
                    {viewerState.isChatLoading ? (
                      <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {isAuthenticated ? (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M9 11H5a2 2 0 0 0-2 2v3c0 2 2 2 2 2h2"/>
                          <path d="M13 11h4a2 2 0 0 1 2 2v3c0 2-2 2-2 2h-2"/>
                          <path d="M11 11V9a2 2 0 0 1 4 0v2"/>
                          <path d="M13 15V9"/>
                        </svg>
                        AI-powered DFM analysis
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                          <circle cx="12" cy="16" r="1"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <Link href="/auth/login" className="text-emuski-teal hover:underline font-medium">Sign in</Link> or <Link href="/auth/register" className="text-emuski-teal hover:underline font-medium">create account</Link> for AI features
                      </span>
                    )}
                  </div>
                  {/* Credit display in chatbot */}
                  {isAuthenticated && (
                    <div className="flex items-center gap-2">
                      {creditInfo ? (
                        <>
                          <span className="text-xs font-medium">
                            <span className="text-emuski-teal font-semibold">{creditInfo.remaining.toFixed(1)}</span>/{creditInfo.limit} credits
                          </span>
                          {creditInfo.remaining === 0 && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded border">
                              No credits
                            </span>
                          )}
                          {creditInfo.remaining <= 2 && creditInfo.remaining > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded border">
                              Low
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Loading credits...
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CadViewer;