'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';
import Link from 'next/link';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from './auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { cadEngine, CADEngineClient, type GeometryAnalysisResponse } from '@/lib/cad-engine-client';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type FeatureType =
  | 'pockets' | 'slots' | 'holes' | 'bosses' | 'ribs'
  | 'fillets' | 'chamfers' | 'threads' | 'walls'
  | 'drafts' | 'undercuts' | 'textEngraving';

type MeasureUnit = 'mm' | 'cm' | 'm' | 'in';
type DFMSeverity = 'low' | 'medium' | 'high';
type DFMIssueType = 'draft_angle' | 'thin_wall' | 'undercut' | 'sharp_corner';

interface DFMIssue {
  id?: string;
  type: DFMIssueType;
  severity: DFMSeverity;
  description: string;
  recommendation: string;
  location?: { x: number; y: number; z: number };
  highlighted?: boolean;
}

interface BOMComponent {
  id: string;
  name: string;
  type: 'part' | 'assembly';
  material: string;
  volume: number;
  surfaceArea: number;
  dfmIssues: DFMIssue[];
  manufacturingProcess: string;
  estimatedCost: number;
  highlighted?: boolean;
}

interface FeatureCollection {
  count: number;
  features: DetectedFeature[];
  totalVolume: number;
  avgConfidence: number;
}

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
    diameter?: number; depth?: number; radius?: number; angle?: number;
    thickness?: number; length?: number; width?: number;
    holeType?: string; estimatedDiameter?: number; estimatedRadius?: number; area?: number;
  };
  faces: number[];
  vertices: THREE.Vector3[];
  highlighted: boolean;
}

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

type RecognizedFeatures = Record<FeatureType, FeatureCollection>;

interface RealTimeGeometry {
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
  threadFeatures?: { count: number; specifications: string[]; locations: Array<{ x: number; y: number; z: number }> };
  recognizedFeatures?: RecognizedFeatures;
  holeAnalysis?: { count: number; holes: Array<{ diameter: number; depth: number; location: { x: number; y: number; z: number }; type: string }> };
  bomComponents?: { components: BOMComponent[]; totalComponents: number };
  cadEngineAnalysis?: GeometryAnalysisResponse;
}

interface CreditInfo {
  remaining: number;
  limit: number;
  resetTime?: string;
  timeUntilReset?: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ViewerState {
  isLoading: boolean;
  isAnalyzing: boolean;
  error: string | null;
  isWireframe: boolean;
  isTransparent: boolean;
  isXRayView: boolean;
  showGrid: boolean;
  showCrossSection: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  showZAxis: boolean;
  measureMode: boolean;
  measureUnits: MeasureUnit;
  modelColor: string;
  engineAvailable: boolean;
  stlData: string | null;
  analysisData: GeometryAnalysisResponse | null;
  realTimeGeometry: RealTimeGeometry | null;
  currentGeometry: THREE.BufferGeometry | null;
  fileSize: number | null;
  componentHighlights: THREE.Group | null;
  highlightedComponents: Set<string>;
  highlightedIssues: Set<string>;
  selectedDFMIssue: string | null;
  selectedDFMComponent: string | null;
  selectedFeatureType: FeatureType | null;
  featureHighlights: THREE.Group | null;
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isChatLoading: boolean;
  suggestionsHidden: boolean;
}

interface ThreeRefs {
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

export interface CadViewerProps {
  fileUrl?: string;
  fileName: string;
  fileType: string;
  rawFile?: File;
  creditInfo?: CreditInfo | null;
  onGeometryAnalyzed?: (geometry: RealTimeGeometry) => void;
  onUnitChange?: (units: MeasureUnit) => void;
  selectedComponent?: string | null;
  selectedDFMIssue?: string | null;
  selectedDFMIssueDetails?: DFMIssue;
  onDFMIssueSelect?: (issueId: string, componentId: string) => void;
  onComponentSelect?: (componentId: string) => void;
  selectedFeatureType?: string | null;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MODEL_COLORS = ['#17B8BA', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#334155'] as const;
const DEFAULT_MODEL_COLOR = '#17B8BA';
const CAMERA_START = new THREE.Vector3(5, 5, 5);
const AXIS_LENGTH = 8;
const VIEW_CUBE_SIZE = 144;
const UNIT_DIVISORS: Record<MeasureUnit, number> = { mm: 1, cm: 10, m: 1000, in: 25.4 };
const UNIT_DECIMALS: Record<MeasureUnit, number> = { mm: 2, cm: 2, m: 4, in: 3 };
const DFM_SEVERITY_COLORS: Record<DFMSeverity, number> = { low: 0xffd700, medium: 0xff8800, high: 0xff0000 };
const FEATURE_COLORS: Record<FeatureType, number> = {
  pockets: 0x4444ff, slots: 0x44ffff, holes: 0xffa500, bosses: 0xff44ff,
  ribs: 0xffff44, fillets: 0x44ff44, chamfers: 0xff8844, threads: 0x8844ff,
  walls: 0x88ff44, drafts: 0xff8888, undercuts: 0xff0000, textEngraving: 0x888888,
};
const EMPTY_FEATURE_COLLECTION: FeatureCollection = { count: 0, features: [], totalVolume: 0, avgConfidence: 0 };
const EMPTY_RECOGNIZED_FEATURES: RecognizedFeatures = Object.fromEntries(
  ['pockets','slots','holes','bosses','ribs','fillets','chamfers','threads','walls','drafts','undercuts','textEngraving']
    .map(k => [k, { ...EMPTY_FEATURE_COLLECTION }])
) as RecognizedFeatures;

const CHAT_SUGGESTIONS = [
  { full: 'What holes are detected and what are the manufacturing challenges?', short: 'Holes & challenges?' },
  { full: "What's the estimated cost to manufacture this part?", short: 'Manufacturing cost?' },
  { full: 'What are the exact dimensions and tolerances?', short: 'Dimensions & tolerances?' },
  { full: 'What machining problems will I face?', short: 'Machining problems?' },
  { full: 'How can I reduce manufacturing cost?', short: 'Reduce cost?' },
  { full: 'What material and process do you recommend?', short: 'Material recommendation?' },
] as const;

const INITIAL_VIEWER_STATE: ViewerState = {
  isLoading: true, isAnalyzing: false, error: null,
  isWireframe: false, isTransparent: false, isXRayView: false,
  showGrid: true, showCrossSection: false,
  showXAxis: true, showYAxis: true, showZAxis: true,
  measureMode: true, measureUnits: 'm',
  modelColor: DEFAULT_MODEL_COLOR,
  engineAvailable: false, stlData: null, analysisData: null,
  realTimeGeometry: null, currentGeometry: null, fileSize: null,
  componentHighlights: null,
  highlightedComponents: new Set(), highlightedIssues: new Set(),
  selectedDFMIssue: null, selectedDFMComponent: null,
  selectedFeatureType: null, featureHighlights: null,
  chatMessages: [{
    id: 'welcome', type: 'bot', timestamp: Date.now(),
    content: 'Hi! I\'m Mithran, your AI manufacturing assistant. I\'m here to help you analyze your CAD model for manufacturability. Ask me about holes, tolerances, cost estimates, machining challenges, or any design for manufacturing concerns. How can I help you today?',
  }],
  isChatOpen: false, isChatLoading: false, suggestionsHidden: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Pure Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

function convertUnits(mm: number, unit: MeasureUnit): number {
  const raw = mm / UNIT_DIVISORS[unit];
  const dec = UNIT_DECIMALS[unit];
  return Math.round(raw * 10 ** dec) / 10 ** dec;
}

function round2(n: number) { return Math.round(n * 100) / 100; }

function calcMeshVolume(geo: THREE.BufferGeometry): number {
  const pos = geo.getAttribute('position');
  const idx = geo.getIndex();
  if (!pos) return 0;
  const p = pos.array;
  let vol = 0;
  const tri = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number) => {
    const v1 = new THREE.Vector3(ax, ay, az);
    const v2 = new THREE.Vector3(bx, by, bz);
    const v3 = new THREE.Vector3(cx, cy, cz);
    vol += v1.dot(v2.clone().cross(v3)) / 6;
  };
  if (idx) {
    const i = idx.array;
    for (let n = 0; n < i.length; n += 3) {
      const a = i[n]*3, b = i[n+1]*3, c = i[n+2]*3;
      tri(p[a],p[a+1],p[a+2], p[b],p[b+1],p[b+2], p[c],p[c+1],p[c+2]);
    }
  } else {
    for (let n = 0; n < p.length; n += 9)
      tri(p[n],p[n+1],p[n+2], p[n+3],p[n+4],p[n+5], p[n+6],p[n+7],p[n+8]);
  }
  return Math.abs(vol);
}

function calcSurfaceArea(geo: THREE.BufferGeometry): number {
  const pos = geo.getAttribute('position');
  const idx = geo.getIndex();
  if (!pos) return 0;
  const p = pos.array;
  let area = 0;
  const tri = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number) => {
    const v1 = new THREE.Vector3(ax, ay, az);
    const v2 = new THREE.Vector3(bx, by, bz);
    const v3 = new THREE.Vector3(cx, cy, cz);
    area += v2.clone().sub(v1).cross(v3.clone().sub(v1)).length() / 2;
  };
  if (idx) {
    const i = idx.array;
    for (let n = 0; n < i.length; n += 3) {
      const a = i[n]*3, b = i[n+1]*3, c = i[n+2]*3;
      tri(p[a],p[a+1],p[a+2], p[b],p[b+1],p[b+2], p[c],p[c+1],p[c+2]);
    }
  } else {
    for (let n = 0; n < p.length; n += 9)
      tri(p[n],p[n+1],p[n+2], p[n+3],p[n+4],p[n+5], p[n+6],p[n+7],p[n+8]);
  }
  return area;
}

function calcNormalVariance(normals: THREE.Vector3[]): number {
  if (normals.length < 2) return 0;
  const avg = normals.reduce((s, n) => s.add(n), new THREE.Vector3()).normalize();
  return normals.reduce((s, n) => s + (1 - Math.abs(n.dot(avg))), 0) / normals.length;
}

function estimateThreadSpec(diameter: number): string {
  const specs: [number, number, string][] = [
    [2.5,3.5,'M3 x 0.5'],[3.5,4.5,'M4 x 0.7'],[4.5,5.5,'M5 x 0.8'],
    [5.5,6.5,'M6 x 1.0'],[7,9,'M8 x 1.25'],[9,11,'M10 x 1.5'],[11,13,'M12 x 1.75'],
  ];
  return specs.find(([min,max]) => diameter>=min && diameter<=max)?.[2] ?? `≈${diameter.toFixed(1)}mm thread`;
}

function mapWarningType(code: string): DFMIssueType {
  if (code.includes('draft') || code.includes('angle')) return 'draft_angle';
  if (code.includes('wall') || code.includes('thickness')) return 'thin_wall';
  if (code.includes('undercut')) return 'undercut';
  return 'sharp_corner';
}

function determineMaterial(dims: { length: number; width: number; height: number }, volume: number): string {
  const max = Math.max(dims.length, dims.width, dims.height);
  if (max < 20) return 'Plastic ABS';
  if (volume < 500) return 'Aluminum 6061-T6';
  if (volume > 10_000) return 'Steel 4140';
  return 'Aluminum 7075-T6';
}

function determineProcess(dims: { length: number; width: number; height: number }, volume: number, verts: number): string {
  const max = Math.max(dims.length, dims.width, dims.height);
  if (verts < 500) return 'Sheet Metal Forming';
  if (volume < 1000) return 'Injection Molding';
  if (max > 100) return 'CNC Machining';
  return 'Turning';
}

function estimateCost(volume: number, type: 'primary' | 'secondary' | 'fastener'): number {
  const rates = { primary: 0.05, secondary: 0.03, fastener: 0.01 };
  return round2(volume * rates[type] + Math.random() * 10 + 5);
}

function formatBotMessage(content: string): string {
  let html = content.trim()
    .replace(/[""'']/g, '"').replace(/[–—]/g, '-').replace(/…/g, '...')
    .replace(/[^\x20-\x7E\n\r]/g, '');

  html = html
    .replace(/^## (.+)$/gm, '<h3 class="font-bold text-emuski-teal mb-2 mt-4 text-lg">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-gray-800 mb-2 mt-3">$1</h4>')
    .replace(/^- (.+)$/gm, '<li class="text-base leading-relaxed py-0.5">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="space-y-1 ml-4 my-2 text-gray-900">$1</ul>')
    .replace(/\b(\d+(?:\.\d+)?)\s*(mm|cm|m|in|kg|g|degrees|%)\b/g,
      '<span class="font-mono bg-emuski-teal/15 text-emuski-teal px-1 py-0.5 rounded text-sm font-semibold">$1$2</span>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');

  return html.split('\n').map(line => {
    const t = line.trim();
    if (!t || t.startsWith('<')) return line;
    return `<p class="leading-relaxed text-base text-gray-900 my-1">${line}</p>`;
  }).join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature Detection
// ─────────────────────────────────────────────────────────────────────────────

function analyzeGeometryFaces(geo: THREE.BufferGeometry): { faces: GeometryFace[]; edges: GeometryEdge[] } {
  const posAttr = geo.getAttribute('position');
  const normAttr = geo.getAttribute('normal');
  const idxAttr = geo.getIndex();
  if (!posAttr || !normAttr) return { faces: [], edges: [] };

  const positions = posAttr.array;
  const normals = normAttr.array;
  const faces: GeometryFace[] = [];
  const totalFaces = idxAttr ? idxAttr.count / 3 : positions.length / 9;
  const sampleStep = Math.max(1, Math.floor(totalFaces / 1000));

  for (let i = 0; i < Math.min(1000, totalFaces); i++) {
    const fi = i * sampleStep;
    const verts: THREE.Vector3[] = [];
    const fnorms: THREE.Vector3[] = [];

    for (let j = 0; j < 3; j++) {
      const vi = idxAttr ? idxAttr.getX(fi * 3 + j) : fi * 3 + j;
      if (vi * 3 + 2 >= positions.length) continue;
      verts.push(new THREE.Vector3(positions[vi*3], positions[vi*3+1], positions[vi*3+2]));
      fnorms.push(new THREE.Vector3(normals[vi*3], normals[vi*3+1], normals[vi*3+2]));
    }
    if (verts.length !== 3) continue;

    const v1 = verts[1].clone().sub(verts[0]);
    const v2 = verts[2].clone().sub(verts[0]);
    const area = v1.clone().cross(v2).length() / 2;
    if (area < 0.01) continue;

    const avgNormal = fnorms.reduce((s,n) => s.add(n), new THREE.Vector3()).normalize();
    const center = verts.reduce((s,v) => s.add(v), new THREE.Vector3()).multiplyScalar(1/3);
    const nv = calcNormalVariance(fnorms);

    let type: GeometryFace['type'] = 'planar';
    if (nv >= 0.3) type = 'freeform';
    else if (nv >= 0.05) {
      const nd = Math.abs(v1.clone().cross(v2).normalize().dot(avgNormal));
      type = nd > 0.8 ? 'cylindrical' : nd > 0.5 ? 'conical' : 'freeform';
    }

    faces.push({ type, normal: avgNormal, center, area, vertices: verts, curvature: nv });
  }

  return { faces, edges: [] };
}

function groupFaces(faces: GeometryFace[], tolerance: number): GeometryFace[][] {
  const groups: GeometryFace[][] = [];
  const seen = new Set<number>();
  faces.forEach((face, i) => {
    if (seen.has(i)) return;
    const group = [face];
    seen.add(i);
    faces.forEach((other, oi) => {
      if (!seen.has(oi) && face.center.distanceTo(other.center) < tolerance) {
        group.push(other);
        seen.add(oi);
      }
    });
    groups.push(group);
  });
  return groups;
}

function featureCenterOf(faces: GeometryFace[]): THREE.Vector3 {
  return faces.reduce((s,f) => s.add(f.center), new THREE.Vector3()).multiplyScalar(1/faces.length);
}

function featureBoundsOf(faces: GeometryFace[]): THREE.Box3 {
  const box = new THREE.Box3();
  faces.forEach(f => f.vertices.forEach(v => box.expandByPoint(v)));
  return box;
}

function makeCollection(features: DetectedFeature[]): FeatureCollection {
  return {
    count: features.length,
    features,
    totalVolume: features.reduce((s,f) => s+f.geometry.volume, 0),
    avgConfidence: features.length > 0
      ? features.reduce((s,f) => s+f.confidence, 0) / features.length : 0,
  };
}

function detectPockets(faces: GeometryFace[]): FeatureCollection {
  const recessed = faces.filter(f => f.type === 'planar' && f.normal.y > 0.7 && f.center.y < 0);
  const features = groupFaces(recessed, 5.0)
    .filter(g => g.length >= 1)
    .map((g, i) => {
      const bb = featureBoundsOf(g);
      const depth = Math.abs(bb.min.y);
      const area = g.reduce((s,f) => s+f.area, 0);
      const wallArea = 2 * ((bb.max.x - bb.min.x) + (bb.max.z - bb.min.z)) * depth;
      return {
        id: `pocket_${i}`, type: 'pockets' as const,
        confidence: Math.min(0.4 + (depth > 0.5 ? 0.3 : 0) + (area > 10 ? 0.3 : 0), 1),
        geometry: { center: featureCenterOf(g), boundingBox: bb, volume: area*depth, surfaceArea: area+wallArea },
        properties: { depth, width: bb.max.x - bb.min.x, length: bb.max.z - bb.min.z },
        faces: [], vertices: g.flatMap(f => f.vertices), highlighted: false,
      };
    });
  return makeCollection(features);
}

function detectSlots(pockets: FeatureCollection): FeatureCollection {
  const features = pockets.features
    .filter(p => {
      const w = p.properties.width ?? 0, l = p.properties.length ?? 0;
      return Math.max(l,w) / Math.max(Math.min(l,w), 0.01) > 3;
    })
    .map((p, i) => {
      const w = p.properties.width ?? 0, l = p.properties.length ?? 0;
      const ar = Math.max(l,w) / Math.max(Math.min(l,w), 0.01);
      return { ...p, id: `slot_${i}`, type: 'slots' as const, confidence: Math.min(p.confidence*(ar/3), 1) };
    });
  return makeCollection(features);
}

function detectHoles(faces: GeometryFace[]): FeatureCollection {
  const features = faces.filter(f => f.type === 'cylindrical').map((face, i) => {
    const r = Math.sqrt(face.area / (2 * Math.PI * 12));
    const d = r * 2;
    const holeType = d < 4 ? 'pin_hole' : d < 8 ? 'fastener_hole' : d < 14 ? 'clearance_hole' : 'large_hole';
    return {
      id: `hole_${i}`, type: 'holes' as const,
      confidence: face.area > 2 ? 0.7 : 0.4,
      geometry: {
        center: face.center,
        boundingBox: new THREE.Box3(
          new THREE.Vector3(face.center.x-r, face.center.y-5, face.center.z-r),
          new THREE.Vector3(face.center.x+r, face.center.y+5, face.center.z+r),
        ),
        volume: Math.PI*r*r*10, surfaceArea: face.area,
      },
      properties: { holeType, estimatedDiameter: d, estimatedRadius: r, area: face.area },
      faces: [], vertices: face.vertices, highlighted: false,
    };
  });
  return makeCollection(features);
}

function detectWalls(faces: GeometryFace[]): FeatureCollection {
  const planar = faces.filter(f => f.type === 'planar' && f.area > 1.0);
  const features: DetectedFeature[] = [];
  const step = Math.max(1, Math.floor(planar.length / 50));

  for (let i = 0; i < planar.length; i += step) {
    planar.slice(i+1).filter(f2 => planar[i].center.distanceTo(f2.center) < 20).forEach((f2, j) => {
      const f1 = planar[i];
      if (Math.abs(f1.normal.dot(f2.normal)) < 0.98) return;
      const dist = f1.center.distanceTo(f2.center);
      if (dist <= 0.5 || dist >= 5.0 || (f1.area + f2.area) / 2 <= 5.0) return;
      const verts = [...f1.vertices, ...f2.vertices];
      const bb = new THREE.Box3().setFromPoints(verts);
      features.push({
        id: `wall_${i}_${j}`, type: 'walls' as const,
        confidence: Math.max(0.5, 1 - dist / 5),
        geometry: {
          center: new THREE.Vector3().addVectors(f1.center, f2.center).multiplyScalar(0.5),
          boundingBox: bb, volume: ((f1.area+f2.area)/2)*dist, surfaceArea: f1.area+f2.area,
        },
        properties: {
          thickness: round2(dist),
          length: round2(Math.max(bb.max.x-bb.min.x, bb.max.z-bb.min.z)),
          depth: round2(bb.max.y-bb.min.y),
        },
        faces: [], vertices: verts, highlighted: false,
      });
    });
  }
  return makeCollection(features);
}

function detectUndercuts(faces: GeometryFace[]): FeatureCollection {
  const up = new THREE.Vector3(0, 1, 0);
  const features = faces
    .filter(f => f.normal.dot(up) < -0.1 && f.center.y < 0)
    .map((face, i) => ({
      id: `undercut_${i}`, type: 'undercuts' as const,
      confidence: Math.min(Math.abs(face.normal.dot(up)), 1),
      geometry: {
        center: face.center, boundingBox: new THREE.Box3().setFromPoints(face.vertices),
        volume: 0, surfaceArea: face.area,
      },
      properties: { angle: Math.acos(Math.abs(face.normal.dot(up))) * (180 / Math.PI) },
      faces: [], vertices: face.vertices, highlighted: false,
    }));
  return makeCollection(features);
}

function detectDrafts(faces: GeometryFace[]): FeatureCollection {
  const features = faces
    .filter(f => {
      if (f.type !== 'planar') return false;
      const vd = Math.abs(f.normal.dot(new THREE.Vector3(0,1,0)));
      const hd = Math.abs(f.normal.dot(new THREE.Vector3(1,0,0)));
      return (vd > 0.95 && vd < 0.999) || (hd > 0.95 && hd < 0.999);
    })
    .map((face, i) => {
      const vd = Math.abs(face.normal.dot(new THREE.Vector3(0,1,0)));
      const hd = Math.abs(face.normal.dot(new THREE.Vector3(1,0,0)));
      return {
        id: `draft_${i}`, type: 'drafts' as const, confidence: 0.7,
        geometry: {
          center: face.center, boundingBox: new THREE.Box3().setFromPoints(face.vertices),
          volume: 0, surfaceArea: face.area,
        },
        properties: { angle: Math.acos(Math.max(vd, hd)) * (180 / Math.PI) },
        faces: [], vertices: face.vertices, highlighted: false,
      };
    });
  return makeCollection(features);
}

function detectFillets(edges: GeometryEdge[]): FeatureCollection {
  const features = edges
    .filter(e => e.type === 'smooth' && e.radius && e.radius > 0.1)
    .map((e, i) => {
      const center = new THREE.Vector3().addVectors(e.vertices[0], e.vertices[1]).multiplyScalar(0.5);
      return {
        id: `fillet_${i}`, type: 'fillets' as const, confidence: 0.8,
        geometry: {
          center, boundingBox: new THREE.Box3().setFromPoints(e.vertices),
          volume: Math.PI * e.radius! ** 2 * e.length / 4,
          surfaceArea: Math.PI * e.radius! * e.length / 2,
        },
        properties: { radius: e.radius, length: e.length },
        faces: [], vertices: e.vertices, highlighted: false,
      };
    });
  return makeCollection(features);
}

function detectChamfers(edges: GeometryEdge[]): FeatureCollection {
  const features = edges
    .filter(e => e.type === 'chamfer' && e.angle && e.angle > 30 && e.angle < 60)
    .map((e, i) => {
      const center = new THREE.Vector3().addVectors(e.vertices[0], e.vertices[1]).multiplyScalar(0.5);
      const w = e.length * Math.tan((e.angle! * Math.PI) / 180);
      return {
        id: `chamfer_${i}`, type: 'chamfers' as const, confidence: 0.9,
        geometry: {
          center, boundingBox: new THREE.Box3().setFromPoints(e.vertices),
          volume: w*w*e.length/2, surfaceArea: w*e.length,
        },
        properties: { angle: e.angle, length: e.length, width: w },
        faces: [], vertices: e.vertices, highlighted: false,
      };
    });
  return makeCollection(features);
}

function detectThreads(faces: GeometryFace[]): FeatureCollection {
  const features = faces
    .filter(f => f.type === 'cylindrical' && f.curvature && f.curvature > 0.5)
    .map((face, i) => {
      const bb = new THREE.Box3().setFromPoints(face.vertices);
      const d = 2 * Math.sqrt(face.area / (2 * Math.PI * 12));
      return {
        id: `thread_${i}`, type: 'threads' as const, confidence: Math.min(face.curvature!, 1),
        geometry: {
          center: face.center, boundingBox: bb,
          volume: Math.PI * (d/2)**2 * (bb.max.z - bb.min.z),
          surfaceArea: Math.PI * d * (bb.max.z - bb.min.z),
        },
        properties: { diameter: d, depth: bb.max.z - bb.min.z },
        faces: [], vertices: face.vertices, highlighted: false,
      };
    });
  return makeCollection(features);
}

function detectBosses(faces: GeometryFace[]): FeatureCollection {
  const cylGroups: Array<{ faces: GeometryFace[]; center: THREE.Vector3 }> = [];
  const seen = new Set<number>();
  const cylFaces = faces.filter(f => f.type === 'cylindrical');

  cylFaces.forEach((face, i) => {
    if (seen.has(i)) return;
    const group = { faces: [face], center: face.center };
    seen.add(i);
    cylFaces.forEach((other, oi) => {
      if (!seen.has(oi) && face.center.distanceTo(other.center) < 5) {
        group.faces.push(other); seen.add(oi);
      }
    });
    cylGroups.push(group);
  });

  const features = cylGroups
    .filter(g => g.faces.length >= 3 && g.center.y > 0)
    .map((g, i) => {
      const bb = featureBoundsOf(g.faces);
      const center = featureCenterOf(g.faces);
      const allDists: number[] = [];
      for (let a = 0; a < g.faces.length; a++)
        for (let b = a+1; b < g.faces.length; b++)
          allDists.push(g.faces[a].center.distanceTo(g.faces[b].center));
      const d = allDists.length > 0 ? allDists.reduce((s,v)=>s+v,0)/allDists.length : 1;
      const h = bb.max.y - bb.min.y;
      const ar = h / d;
      return {
        id: `boss_${i}`, type: 'bosses' as const,
        confidence: Math.min(0.6 + (ar>0.2&&ar<3 ? 0.3 : 0), 1),
        geometry: {
          center, boundingBox: bb,
          volume: Math.PI*(d/2)**2*h,
          surfaceArea: 2*Math.PI*(d/2)*h + Math.PI*(d/2)**2,
        },
        properties: { diameter: d, depth: h },
        faces: [], vertices: g.faces.flatMap(f=>f.vertices), highlighted: false,
      };
    });
  return makeCollection(features);
}

function detectRibs(faces: GeometryFace[]): FeatureCollection {
  const vert = faces.filter(f => f.type === 'planar' && Math.abs(f.normal.y) < 0.3);
  const features = groupFaces(vert, 2.0)
    .map((g, i) => {
      const bb = featureBoundsOf(g);
      const t = Math.min(bb.max.x-bb.min.x, bb.max.z-bb.min.z);
      const h = bb.max.y - bb.min.y;
      const l = Math.max(bb.max.x-bb.min.x, bb.max.z-bb.min.z);
      if (t >= 5 || h <= t * 2) return null;
      return {
        id: `rib_${i}`, type: 'ribs' as const,
        confidence: Math.min(0.5 + (h/t>2?0.3:0) + (l>t*3?0.2:0), 1),
        geometry: { center: featureCenterOf(g), boundingBox: bb, volume: t*h*l, surfaceArea: 2*(t*h+t*l+h*l) },
        properties: { thickness: t, length: l, depth: h },
        faces: [], vertices: g.flatMap(f=>f.vertices), highlighted: false,
      };
    })
    .filter(Boolean) as DetectedFeature[];
  return makeCollection(features);
}

function detectTextEngraving(faces: GeometryFace[]): FeatureCollection {
  const small = faces.filter(f => f.area < 5 && f.type === 'planar');
  const features = groupFaces(small, 2.0)
    .filter(g => g.length > 5)
    .map((g, i) => {
      const bb = featureBoundsOf(g);
      const area = g.reduce((s,f) => s+f.area, 0);
      return {
        id: `text_${i}`, type: 'textEngraving' as const,
        confidence: Math.min(g.length/20, 1),
        geometry: { center: featureCenterOf(g), boundingBox: bb, volume: area*0.1, surfaceArea: area },
        properties: { width: bb.max.x-bb.min.x, length: bb.max.z-bb.min.z, depth: 0.1 },
        faces: [], vertices: g.flatMap(f=>f.vertices), highlighted: false,
      };
    });
  return makeCollection(features);
}

function runFeatureRecognition(geo: THREE.BufferGeometry): RecognizedFeatures {
  const { faces, edges } = analyzeGeometryFaces(geo);
  const pockets = detectPockets(faces);
  return {
    pockets,
    slots: detectSlots(pockets),
    holes: detectHoles(faces),
    bosses: detectBosses(faces),
    ribs: detectRibs(faces),
    fillets: detectFillets(edges),
    chamfers: detectChamfers(edges),
    threads: detectThreads(faces),
    walls: detectWalls(faces),
    drafts: detectDrafts(faces),
    undercuts: detectUndercuts(faces),
    textEngraving: detectTextEngraving(faces),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BOM Generation
// ─────────────────────────────────────────────────────────────────────────────

function generateDFMIssues(
  dims: { length: number; width: number; height: number },
  volume: number,
  type: 'primary' | 'secondary'
): DFMIssue[] {
  const issues: DFMIssue[] = [];
  const maxDim = Math.max(dims.length, dims.width, dims.height);
  const minDim = Math.min(dims.length, dims.width, dims.height);
  const ar = maxDim / minDim;

  if (maxDim > 20 && type === 'primary')
    issues.push({ id:'pocket_001', type:'thin_wall', severity:'high',
      description:'Deep pocket with narrow access.',
      recommendation:'Increase corner radii to minimum R3.5mm.',
      location: { x:-10, y:12, z:3 },
    });

  if (minDim < 2.5)
    issues.push({ id:'wall_001', type:'thin_wall', severity: minDim<1.5?'high':'medium',
      description:`Wall thickness ${minDim.toFixed(1)}mm is below recommended minimum.`,
      recommendation: minDim<1.5
        ? 'Critical: Increase to minimum 1.5mm or add support ribs.'
        : 'Increase thickness to 2.5mm for optimal machining.',
      location: { x:0, y:-15, z:0 },
    });

  if (ar > 4 && type === 'primary')
    issues.push({ id:'undercut_001', type:'undercut', severity:'high',
      description:'Internal undercut feature detected.',
      recommendation:'Redesign to eliminate undercut or use 5-axis machining.',
      location: { x:8, y:0, z:-8 },
    });

  issues.push({ id:'corner_001', type:'sharp_corner', severity:'low',
    description:'Sharp internal corners detected.',
    recommendation:'Add minimum R2.5mm radius to internal corners.',
    location: { x:12, y:-8, z:2 },
  });

  return issues;
}

function generateBOMFromEngine(
  analysis: GeometryAnalysisResponse,
  volume: number,
  surfaceArea: number
): { components: BOMComponent[]; totalComponents: number } {
  const { dfm_analysis, geometry_features, original_filename } = analysis;
  const material = (dfm_analysis.ai_insights?.material_recommendations as string[])?.[0] ?? 'Aluminum 6061-T6';
  const complexity = Number(dfm_analysis.ai_insights?.manufacturing_complexity ?? 0);

  const main: BOMComponent = {
    id: 'cad_comp_001',
    name: `${original_filename} - Main Part`,
    type: 'part',
    material,
    volume: geometry_features.volume_mm3,
    surfaceArea: geometry_features.surface_area_mm2,
    manufacturingProcess: dfm_analysis.recommended_processes?.[0] ?? 'CNC Machining',
    estimatedCost: round2((1.0) *
      Math.max(dfm_analysis.ai_insights?.lead_time_estimate_days ?? 5, 1) * 0.5 + 10),
    dfmIssues: (dfm_analysis.ai_insights?.dfm_warnings ?? []).map((w: any, idx: number) => ({
      id: `issue_${idx}`,
      type: mapWarningType(w.code ?? w.type ?? ''),
      severity: (w.severity ?? 'medium') as DFMSeverity,
      description: w.description ?? 'Manufacturing concern detected',
      recommendation: w.recommendation ?? 'Review part design for manufacturability',
    })),
  };

  const components: BOMComponent[] = [main];

  if (complexity > 70) {
    const secondary = (dfm_analysis.ai_insights?.material_recommendations as string[])?.[1] ?? 'Steel 4140';
    components.push({
      id: 'cad_comp_002', name: 'Complex Feature', type: 'part',
      material: secondary, volume: volume * 0.2, surfaceArea: surfaceArea * 0.3,
      manufacturingProcess: dfm_analysis.recommended_processes?.[1] ?? 'Precision Machining',
      estimatedCost: round2(main.estimatedCost * 0.3),
      dfmIssues: [],
    });
  }

  return { components, totalComponents: components.length };
}

function generateBOMFallback(
  geo: THREE.BufferGeometry,
  dims: { length: number; width: number; height: number },
  volume: number,
  surfaceArea: number
): { components: BOMComponent[]; totalComponents: number } {
  const maxDim = Math.max(dims.length, dims.width, dims.height);
  const minDim = Math.min(dims.length, dims.width, dims.height);
  const ar = maxDim / Math.max(minDim, 0.1);
  const verts = geo.getAttribute('position')?.count ?? 0;
  const components: BOMComponent[] = [];

  components.push({
    id: 'comp_001', name: 'Primary Component', type: 'part',
    material: determineMaterial(dims, volume),
    volume: volume * 0.7, surfaceArea: surfaceArea * 0.6,
    manufacturingProcess: determineProcess(dims, volume, verts),
    estimatedCost: estimateCost(volume * 0.7, 'primary'),
    dfmIssues: generateDFMIssues(dims, volume, 'primary'),
  });

  if (verts > 1000 && ar > 2) {
    components.push({
      id: 'comp_002', name: 'Secondary Feature', type: 'part',
      material: determineMaterial(dims, volume * 0.2),
      volume: volume * 0.2, surfaceArea: surfaceArea * 0.25,
      manufacturingProcess: 'CNC Machining',
      estimatedCost: estimateCost(volume * 0.2, 'secondary'),
      dfmIssues: generateDFMIssues(dims, volume * 0.2, 'secondary'),
    });
  }

  if (maxDim < 50 && volume < 1000) {
    components.push({
      id: 'comp_003', name: 'Fastener/Insert', type: 'part',
      material: 'Steel 316L',
      volume: volume * 0.1, surfaceArea: surfaceArea * 0.15,
      manufacturingProcess: 'Turning',
      estimatedCost: estimateCost(volume * 0.1, 'fastener'),
      dfmIssues: [],
    });
  }

  return { components, totalComponents: components.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Thread Detection
// ─────────────────────────────────────────────────────────────────────────────

function analyzeThreads(geo: THREE.BufferGeometry) {
  const posAttr = geo.getAttribute('position');
  if (!posAttr) return { count: 0, specifications: [] as string[], locations: [] as any[] };
  if (!geo.getAttribute('normal')) geo.computeVertexNormals();

  const normals = geo.getAttribute('normal').array;
  const positions = posAttr.array;
  const count = posAttr.count;
  const gridSize = 0.5;
  const grid = new Map<string, Array<{ position: number[]; normal: number[] }>>();

  for (let i = 0; i < count * 3; i += 3) {
    const key = `${Math.floor(positions[i]/gridSize)},${Math.floor(positions[i+1]/gridSize)},${Math.floor(positions[i+2]/gridSize)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push({ position: [positions[i],positions[i+1],positions[i+2]], normal: [normals[i],normals[i+1],normals[i+2]] });
  }

  const threads = { count: 0, specifications: [] as string[], locations: [] as any[] };

  for (const verts of grid.values()) {
    if (verts.length < 10) continue;
    const center = verts.reduce((s,v) => [s[0]+v.position[0],s[1]+v.position[1],s[2]+v.position[2]], [0,0,0])
      .map(v => v / verts.length);
    const radii = verts.map(v => Math.sqrt((v.position[0]-center[0])**2 + (v.position[1]-center[1])**2));
    const avg = radii.reduce((s,r)=>s+r,0) / radii.length;
    const variance = radii.reduce((s,r)=>s+(r-avg)**2,0) / radii.length;
    if (variance < avg * 0.1 && avg > 1) {
      const normVecs = verts.map(v => new THREE.Vector3(v.normal[0],v.normal[1],v.normal[2]));
      if (calcNormalVariance(normVecs) > 0.8) {
        threads.count++;
        threads.specifications.push(estimateThreadSpec(avg*2));
        threads.locations.push({ x: center[0], y: center[1], z: center[2] });
      }
    }
  }

  return threads;
}

// ─────────────────────────────────────────────────────────────────────────────
// Geometry Analysis
// ─────────────────────────────────────────────────────────────────────────────

async function analyzeGeometry(
  geo: THREE.BufferGeometry,
  rawFile: File | undefined,
  engineAvailable: boolean
): Promise<RealTimeGeometry> {
  geo.computeBoundingBox();
  const box = geo.boundingBox!;
  const size = box.getSize(new THREE.Vector3());
  const dims = { length: round2(size.x), width: round2(size.y), height: round2(size.z) };

  const volume = round2(calcMeshVolume(geo));
  const surfaceArea = round2(calcSurfaceArea(geo));
  const boundingBoxVolume = round2(dims.length * dims.width * dims.height);

  const posAttr = geo.getAttribute('position');
  const idxAttr = geo.getIndex();
  const vertices = posAttr?.count ?? 0;
  const faces = idxAttr ? idxAttr.count / 3 : vertices / 3;

  const minDim = Math.min(dims.length, dims.width, dims.height);
  const wallThickness = {
    min: round2(minDim * 0.05),
    max: round2(minDim * 0.2),
    average: round2(minDim * 0.1),
  };

  const threadFeatures = analyzeThreads(geo);
  const recognizedFeatures = runFeatureRecognition(geo);

  let bomComponents: { components: BOMComponent[]; totalComponents: number };
  let cadEngineAnalysis: GeometryAnalysisResponse | undefined;

  if (engineAvailable && rawFile && CADEngineClient.isSupportedCADFile(rawFile)) {
    try {
      const result = await cadEngine.analyzeGeometry(rawFile, { strategy: 'balanced', forceReanalysis: false });
      if (result?.success) {
        cadEngineAnalysis = result;
        bomComponents = generateBOMFromEngine(result, volume, surfaceArea);
      } else {
        bomComponents = generateBOMFallback(geo, dims, volume, surfaceArea);
      }
    } catch {
      bomComponents = generateBOMFallback(geo, dims, volume, surfaceArea);
    }
  } else {
    bomComponents = generateBOMFallback(geo, dims, volume, surfaceArea);
  }

  // Create hole analysis from recognized features
  const holeAnalysis = {
    count: recognizedFeatures.holes?.count || 0,
    holes: recognizedFeatures.holes?.features?.map(f => ({
      diameter: f.properties?.estimatedDiameter || 0,
      depth: f.properties?.estimatedDepth || 0,
      location: {
        x: f.geometry?.coordinates?.[0] || 0,
        y: f.geometry?.coordinates?.[1] || 0,
        z: f.geometry?.coordinates?.[2] || 0
      },
      type: f.properties?.holeType || 'unknown'
    })) || []
  };

  return {
    dimensions: dims,
    volume, surfaceArea, boundingBoxVolume,
    meshComplexity: { vertices: Math.round(vertices), faces: Math.round(faces), edges: Math.round((faces * 3) / 2) },
    wallThickness,
    threadFeatures,
    recognizedFeatures,
    holeAnalysis,
    bomComponents,
    cadEngineAnalysis,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Three.js Scene Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createAxesHelper(): THREE.Group {
  const group = new THREE.Group();
  const axes = [
    { dir: new THREE.Vector3(AXIS_LENGTH,0,0), color: 0xff0000, key: 'x', rotZ: -Math.PI/2 },
    { dir: new THREE.Vector3(0,AXIS_LENGTH,0), color: 0x00ff00, key: 'y', rotZ: 0 },
    { dir: new THREE.Vector3(0,0,AXIS_LENGTH), color: 0x0000ff, key: 'z', rotX: Math.PI/2 },
  ];
  axes.forEach(({ dir, color, key, rotZ, rotX }: any) => {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), dir]),
      new THREE.LineBasicMaterial({ color })
    );
    line.userData = { axis: key };
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.1,0.3,8), new THREE.MeshBasicMaterial({ color }));
    if (rotZ) cone.rotation.z = rotZ;
    if (rotX) cone.rotation.x = rotX;
    cone.position.copy(dir);
    cone.userData = { axis: key };
    group.add(line, cone);
  });
  return group;
}

function initViewCube(canvas: HTMLCanvasElement): ThreeRefs['viewCube'] {
  const vc: ThreeRefs['viewCube'] = { scene: null, camera: null, renderer: null, cube: null };
  try {
    vc.scene = new THREE.Scene();
    vc.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    vc.camera.position.set(3, 3, 3);
    vc.camera.lookAt(0, 0, 0);
    vc.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    vc.renderer.setSize(VIEW_CUBE_SIZE, VIEW_CUBE_SIZE);
    vc.renderer.setClearColor(0x000000, 0);
    const mats = [0xff6b6b,0x4ecdc4,0x45b7d1,0xf9ca24,0x6c5ce7,0xa0a0a0].map(
      c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.8 })
    );
    vc.cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), mats);
    vc.scene.add(vc.cube);
    const wf = new THREE.WireframeGeometry(new THREE.BoxGeometry(1,1,1));
    vc.scene.add(new THREE.LineSegments(wf, new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: true })));
  } catch {
    // ViewCube is non-critical; continue without it
  }
  return vc;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const CadViewer: React.FC<CadViewerProps> = ({
  fileUrl, fileName, rawFile, creditInfo,
  onGeometryAnalyzed, onUnitChange,
  selectedComponent, selectedDFMIssue, selectedDFMIssueDetails,
  onDFMIssueSelect, onComponentSelect, selectedFeatureType,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewCubeRef = useRef<HTMLCanvasElement>(null);
  const three = useRef<ThreeRefs>({
    scene: null, camera: null, renderer: null, model: null,
    controls: null, animationId: null, gridHelper: null, axesHelper: null,
    viewCube: { scene: null, camera: null, renderer: null, cube: null },
  });

  const [state, setState] = useState<ViewerState>(INITIAL_VIEWER_STATE);
  const set = useCallback((patch: Partial<ViewerState>) => setState(prev => ({ ...prev, ...patch })), []);

  // ── Engine health check ────────────────────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    fetch('/api/cad-engine/health', { signal: controller.signal })
      .then(res => set({ engineAvailable: res.ok }))
      .catch(() => set({ engineAvailable: false }))
      .finally(() => clearTimeout(id));
  }, []);

  // ── Main viewer init ───────────────────────────────────────────────────────

  const initViewer = useCallback(async () => {
    if (!viewerRef.current || (!rawFile && !fileUrl)) return;
    set({ isLoading: true, error: null });

    try {
      const container = viewerRef.current;
      container.innerHTML = '';

      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        throw new Error('WebGL not supported on this device. Please try on a desktop computer or newer mobile device.');
      }

      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f9fa);
      three.current.scene = scene;

      // Camera with mobile-friendly settings
      const aspectRatio = container.clientWidth / container.clientHeight;
      const camera = new THREE.PerspectiveCamera(
        60, // Reduced FOV for mobile
        aspectRatio, 
        0.1, 
        1000
      );
      camera.position.copy(CAMERA_START);
      camera.lookAt(0, 0, 0);
      three.current.camera = camera;

      // Renderer with mobile optimizations
      const renderer = new THREE.WebGLRenderer({ 
        antialias: window.innerWidth > 768, // Disable antialiasing on mobile for performance
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false, // Better memory management
      });
      
      // Mobile-specific renderer settings
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0xf8f9fa, 1);
      
      // Performance optimizations for mobile
      if (window.innerWidth <= 768) {
        renderer.shadowMap.enabled = false;
        // Note: physicallyCorrectLights was deprecated in newer Three.js versions
        // renderer.useLegacyLights = true; // Use this if needed for older Three.js versions
      }
      
      container.appendChild(renderer.domElement);
      three.current.renderer = renderer;

      // Controls with mobile-specific settings
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      
      // Mobile touch optimizations
      controls.rotateSpeed = window.innerWidth <= 768 ? 0.5 : 1.0;
      controls.zoomSpeed = window.innerWidth <= 768 ? 0.8 : 1.2;
      controls.panSpeed = window.innerWidth <= 768 ? 0.8 : 1.0;
      // Note: enableKeys was deprecated in newer Three.js versions
      // Keyboard controls are automatically disabled on mobile devices
      
      // Touch-specific settings
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      
      three.current.controls = controls;

      // Lights
      scene.add(new THREE.AmbientLight(0x404040, 1.0));
      const d1 = new THREE.DirectionalLight(0xffffff, 0.6); d1.position.set(10,10,5); scene.add(d1);
      const d2 = new THREE.DirectionalLight(0xffffff, 0.4); d2.position.set(-10,10,-5); scene.add(d2);
      const d3 = new THREE.DirectionalLight(0xffffff, 0.3); d3.position.set(0,-10,0); scene.add(d3);

      // Grid & Axes  
      const grid = new THREE.GridHelper(10, 10, 0x17b8ba, 0xcccccc);
      scene.add(grid);
      three.current.gridHelper = grid;
      const axes = createAxesHelper();
      scene.add(axes);
      three.current.axesHelper = axes;

      // Render loop with error handling
      const animate = () => {
        try {
          if (!three.current.renderer || !three.current.scene || !three.current.camera) return;
          three.current.controls?.update();
          if (three.current.viewCube.cube && three.current.viewCube.renderer) {
            three.current.viewCube.cube.rotation.copy(camera.rotation);
            three.current.viewCube.renderer.render(three.current.viewCube.scene!, three.current.viewCube.camera!);
          }
          three.current.animationId = requestAnimationFrame(animate);
          renderer.render(scene, camera);
        } catch (animationError) {
          // Silently handle render loop errors to prevent error boundary cascade
          if (three.current.animationId) {
            cancelAnimationFrame(three.current.animationId);
          }
        }
      };
      animate();

      // ViewCube (disabled on mobile for performance)
      if (window.innerWidth > 768) {
        const tryInitViewCube = (attempts = 0) => {
          requestAnimationFrame(() => {
            if (viewCubeRef.current) {
              three.current.viewCube = initViewCube(viewCubeRef.current);
              viewCubeRef.current.addEventListener('click', handleViewCubeClick);
            } else if (attempts < 10) {
              setTimeout(() => tryInitViewCube(attempts + 1), 2 ** attempts * 10);
            }
          });
        };
        tryInitViewCube();
      }

      // Resize handler with throttling for mobile
      let resizeTimeout: NodeJS.Timeout;
      const onResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (camera && renderer && container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
          }
        }, window.innerWidth <= 768 ? 150 : 50); // Throttle more on mobile
      };
      window.addEventListener('resize', onResize);

    // Load model
    try {
      let geometry: THREE.BufferGeometry;

      if (rawFile && CADEngineClient.isSupportedCADFile(rawFile)) {
        const engineOk = await cadEngine.healthCheck().catch(() => false);
        set({ engineAvailable: engineOk });
        if (!engineOk) throw new Error('CAD Engine required for STEP/IGES files but is unavailable');
        const result = await cadEngine.convertToSTL(rawFile);
        const bin = atob(result.stl_base64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        geometry = new STLLoader().parse(arr.buffer);
        set({ stlData: result.stl_base64 });
      } else if (rawFile) {
        geometry = await loadLocalFile(rawFile);
      } else {
        throw new Error('No file provided');
      }

      // Centre and scale
      geometry.computeBoundingBox();
      const box = geometry.boundingBox!;
      const center = box.getCenter(new THREE.Vector3());
      geometry.translate(-center.x, -center.y, -center.z);

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: parseInt(DEFAULT_MODEL_COLOR.replace('#',''), 16), shininess: 100 })
      );
      const modelGroup = new THREE.Group();
      modelGroup.add(mesh);
      const maxDim = Math.max(...box.getSize(new THREE.Vector3()).toArray());
      if (maxDim > 0) modelGroup.scale.setScalar(3 / maxDim);
      scene.add(modelGroup);
      three.current.model = modelGroup;

        const realTimeGeometry = await analyzeGeometry(geometry, rawFile, state.engineAvailable);
        set({ realTimeGeometry, currentGeometry: geometry, isLoading: false });
        onGeometryAnalyzed?.(realTimeGeometry);

      } catch (modelError: any) {
        // Model loading specific error handling
        let errorMessage = 'Failed to load CAD model.';
        
        if (modelError.message?.includes('File') || modelError.message?.includes('format')) {
          errorMessage = 'File format not supported or file is corrupted. Please try a different file.';
        } else if (modelError.message?.includes('network') || modelError.message?.includes('fetch')) {
          errorMessage = 'Network error loading file. Please check your connection and try again.';
        } else if (modelError.message) {
          errorMessage = modelError.message;
        }
        
        set({ isLoading: false, error: errorMessage });
        return;
      }

      return () => window.removeEventListener('resize', onResize);

    } catch (err: any) {
      // Enhanced error handling for mobile devices
      let errorMessage = 'Failed to initialize 3D viewer.';
      
      if (err.message?.includes('WebGL')) {
        errorMessage = 'WebGL is not supported on this device. Please try using a desktop computer or newer mobile device with WebGL support.';
      } else if (err.message?.includes('memory') || err.message?.includes('Memory')) {
        errorMessage = 'Device ran out of memory. Try closing other apps or using a smaller file.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      set({ isLoading: false, error: errorMessage });
    }
  }, [rawFile, fileUrl]);

  useEffect(() => { initViewer(); }, [rawFile, fileUrl]);

  useEffect(() => () => {
    if (three.current.animationId) cancelAnimationFrame(three.current.animationId);
  }, []);

  // ── Prop-driven side effects ───────────────────────────────────────────────

  useEffect(() => {
    if (!three.current.scene) return;
    clearAllHighlights();
    if (selectedDFMIssueDetails && selectedDFMIssue) {
      const { location, type: issueType, severity } = selectedDFMIssueDetails;
      if (location && issueType) highlightDFMIssue(selectedDFMIssue, 'main_component', severity, true, location, issueType);
    }
  }, [selectedDFMIssue, selectedDFMIssueDetails]);

  useEffect(() => {
    if (!three.current.scene || !three.current.model) return;
    clearFeatureHighlights();
    if (selectedFeatureType && state.realTimeGeometry?.recognizedFeatures) {
      const col = state.realTimeGeometry.recognizedFeatures[selectedFeatureType as FeatureType];
      if (col?.features.length) highlightFeaturesOnMesh(selectedFeatureType as FeatureType, col.features);
    }
  }, [selectedFeatureType, state.realTimeGeometry]);

  useEffect(() => {
    if (!three.current.model) return;
    three.current.model.traverse(c => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshPhongMaterial) {
        c.material.wireframe = state.isWireframe; c.material.needsUpdate = true;
      }
    });
  }, [state.isWireframe]);

  useEffect(() => {
    if (!three.current.model) return;
    three.current.model.traverse(c => {
      if (c instanceof THREE.Mesh) {
        c.material.transparent = state.isTransparent;
        (c.material as any).opacity = state.isTransparent ? 0.7 : 1.0;
        c.material.needsUpdate = true;
      }
    });
  }, [state.isTransparent]);

  useEffect(() => {
    if (!three.current.model || !three.current.renderer) return;
    const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    three.current.model.traverse(c => {
      if (c instanceof THREE.Mesh) {
        (c.material as any).clippingPlanes = state.showCrossSection ? [plane] : [];
        c.material.needsUpdate = true;
      }
    });
    three.current.renderer.localClippingEnabled = state.showCrossSection;
  }, [state.showCrossSection]);

  useEffect(() => {
    if (selectedComponent) {
      highlightComponent(selectedComponent, true);
      onComponentSelect?.(selectedComponent);
    } else {
      clearAllHighlights();
    }
  }, [selectedComponent]);

  // ── Highlight Helpers ──────────────────────────────────────────────────────

  function restoreVertexColors() {
    three.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh && c.geometry) {
        const ca = c.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        if (ca) { (ca.array as Float32Array).fill(1); ca.needsUpdate = true; }
        (c.material as any).vertexColors = false;
        c.material.needsUpdate = true;
      }
    });
  }

  function highlightComponent(id: string, on: boolean) {
    const scene = three.current.scene;
    if (!scene) return;
    const existing = scene.getObjectByName(`hl_${id}`);
    if (existing) scene.remove(existing);
    if (on) {
      const mesh = three.current.model?.children[0] as THREE.Mesh | undefined;
      if (mesh?.geometry) {
        const m = new THREE.Mesh(mesh.geometry.clone(),
          new THREE.MeshPhongMaterial({ color: 0x00ff00, opacity: 0.3, transparent: true }));
        m.name = `hl_${id}`;
        m.position.copy(mesh.position);
        m.rotation.copy(mesh.rotation);
        m.scale.copy(mesh.scale);
        scene.add(m);
      }
    }
    setState(prev => {
      const s = new Set(prev.highlightedComponents);
      on ? s.add(id) : s.delete(id);
      return { ...prev, highlightedComponents: s };
    });
  }

  function highlightDFMIssue(
    issueId: string,
    componentId: string,
    severity: DFMSeverity,
    on: boolean,
    location?: { x: number; y: number; z: number },
    issueType?: string
  ) {
    if (!three.current.model) return;
    restoreVertexColors();

    if (on && location && issueType) {
      const color = DFM_SEVERITY_COLORS[severity];
      const target = new THREE.Color(color);
      const bounds = new THREE.Box3().setFromObject(three.current.model);
      const modelSize = bounds.getSize(new THREE.Vector3());
      const maxDim = Math.max(modelSize.x, modelSize.y, modelSize.z);
      const radiusMap: Record<string, number> = { pocket:0.3, undercut:0.25, thin_wall:0.4, sharp_corner:0.15 };
      const radius = Math.max(maxDim * (radiusMap[issueType] ?? 0.3), 18);

      three.current.model.traverse(c => {
        if (!(c instanceof THREE.Mesh) || !c.geometry) return;
        const pos = c.geometry.getAttribute('position');
        if (!pos) return;
        let ca = c.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        if (!ca) {
          ca = new THREE.BufferAttribute(new Float32Array(pos.count * 3).fill(1), 3);
          c.geometry.setAttribute('color', ca);
        }
        const arr = ca.array as Float32Array;
        const loc = new THREE.Vector3(location.x, location.y, location.z);
        for (let i = 0; i < pos.count; i++) {
          const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
          const dist = v.distanceTo(loc);
          if (dist <= radius) {
            const t = Math.max(0, 1 - dist / radius);
            const mixed = new THREE.Color(1,1,1).lerp(target, t * 0.8);
            arr[i*3]=mixed.r; arr[i*3+1]=mixed.g; arr[i*3+2]=mixed.b;
          }
        }
        ca.needsUpdate = true;
        (c.material as any).vertexColors = true;
        c.material.needsUpdate = true;
      });
    }

    setState(prev => {
      const s = new Set(prev.highlightedIssues);
      on ? s.add(issueId) : s.delete(issueId);
      return { ...prev, highlightedIssues: s, selectedDFMIssue: on?issueId:null, selectedDFMComponent: on?componentId:null };
    });
  }

  function clearAllHighlights() {
    const scene = three.current.scene;
    if (!scene) return;
    const toRemove: THREE.Object3D[] = [];
    scene.traverse(c => { if (c.name.startsWith('hl_')) toRemove.push(c); });
    toRemove.forEach(o => scene.remove(o));
    restoreVertexColors();
    setState(prev => ({
      ...prev,
      highlightedComponents: new Set(), highlightedIssues: new Set(),
      selectedDFMIssue: null, selectedDFMComponent: null,
    }));
  }

  function highlightFeaturesOnMesh(type: FeatureType, features: DetectedFeature[]) {
    const model = three.current.model;
    if (!model) return;
    const highlight = new THREE.Color(FEATURE_COLORS[type]);
    const base = new THREE.Color(0.8, 0.8, 0.8);

    model.traverse(c => {
      if (!(c instanceof THREE.Mesh) || !(c.geometry instanceof THREE.BufferGeometry)) return;
      const pos = c.geometry.getAttribute('position');
      if (!pos) return;
      if (!c.geometry.getAttribute('normal')) c.geometry.computeVertexNormals();

      let ca = c.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
      if (!ca) {
        ca = new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3);
        c.geometry.setAttribute('color', ca);
      }
      const arr = ca.array as Float32Array;
      for (let i = 0; i < pos.count; i++) { arr[i*3]=base.r; arr[i*3+1]=base.g; arr[i*3+2]=base.b; }

      features.forEach(feat => {
        const r = getFeatureRadius(feat);
        for (let i = 0; i < pos.count; i++) {
          const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
          const dist = v.distanceTo(feat.geometry.center);
          if (dist < r) {
            const intensity = 1 - (dist / r) * 0.3;
            arr[i*3]=highlight.r*intensity; arr[i*3+1]=highlight.g*intensity; arr[i*3+2]=highlight.b*intensity;
          }
        }
      });

      ca.needsUpdate = true;
      (c.material as any).vertexColors = true;
      c.material.needsUpdate = true;
    });
  }

  function getFeatureRadius(f: DetectedFeature): number {
    const p = f.properties;
    switch (f.type) {
      case 'pockets': return Math.max(Math.min(p.width??5, p.length??5)*0.8, 3);
      case 'bosses': return Math.max((p.diameter??5)*0.8, 3);
      case 'ribs': return Math.max((p.thickness??2)*2.5, 3);
      case 'walls': return Math.max((p.thickness??2)*2, 3);
      case 'fillets': return Math.max((p.radius??1)*2.5, 2);
      case 'chamfers': return Math.max((p.width??2)*2, 2);
      default: return 5;
    }
  }

  function clearFeatureHighlights() {
    if (state.featureHighlights && three.current.scene)
      three.current.scene.remove(state.featureHighlights);
    three.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh && c.geometry instanceof THREE.BufferGeometry) {
        const ca = c.geometry.getAttribute('color') as THREE.BufferAttribute | undefined;
        if (ca) { (ca.array as Float32Array).fill(1); ca.needsUpdate = true; }
        (c.material as any).vertexColors = false;
        c.material.needsUpdate = true;
      }
    });
    set({ selectedFeatureType: null, featureHighlights: null });
  }

  // ── Model Controls ─────────────────────────────────────────────────────────

  function handleZoomIn() { three.current.controls?.dollyIn(1.2); three.current.controls?.update(); }
  function handleZoomOut() { three.current.controls?.dollyOut(1.2); three.current.controls?.update(); }

  function handleReset() {
    three.current.camera?.position.copy(CAMERA_START);
    three.current.controls?.target.set(0, 0, 0);
    three.current.controls?.update();
    three.current.model?.rotation.set(0, 0, 0);
  }

  function changeModelColor(hex: string) {
    three.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh && c.material instanceof THREE.MeshPhongMaterial) {
        c.material.color.setHex(parseInt(hex.replace('#',''), 16));
        c.material.needsUpdate = true;
      }
    });
  }

  function toggleXRayView() {
    const next = !state.isXRayView;
    three.current.model?.traverse(c => {
      if (c instanceof THREE.Mesh) {
        c.material.transparent = next || state.isTransparent;
        (c.material as any).opacity = next ? 0.3 : (state.isTransparent ? 0.7 : 1.0);
        (c.material as any).wireframe = next || state.isWireframe;
        c.material.needsUpdate = true;
      }
    });
    set({ isXRayView: next });
  }

  function updateAxisVisibility(axis: 'x'|'y'|'z', visible: boolean) {
    three.current.axesHelper?.children.forEach(c => {
      if (c.userData.axis === axis) c.visible = visible;
    });
  }

  function takeScreenshot() {
    const { renderer, scene, camera } = three.current;
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
    const a = document.createElement('a');
    a.download = `${fileName}_screenshot.png`;
    a.href = renderer.domElement.toDataURL('image/png');
    a.click();
  }

  function handleDownload() {
    const a = document.createElement('a');
    if (state.stlData) {
      a.href = `data:application/octet-stream;base64,${state.stlData}`;
      a.download = fileName.replace(/\.[^/.]+$/, '.stl');
    } else if (fileUrl) {
      a.href = fileUrl; a.download = fileName;
    }
    a.click();
  }

  async function handleShare() {
    try {
      if (navigator.share) await navigator.share({ title: `CAD Model: ${fileName}`, url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
    } catch { /* ignore */ }
  }

  // ── ViewCube Click ─────────────────────────────────────────────────────────

  function handleViewCubeClick(event: MouseEvent) {
    if (!viewCubeRef.current || !three.current.camera || !three.current.controls) return;
    const rect = viewCubeRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const dist = 8;
    const pos = Math.abs(x) > Math.abs(y)
      ? new THREE.Vector3(x > 0 ? dist : -dist, 0, 0)
      : new THREE.Vector3(0, y > 0 ? dist : -dist, 0);
    const start = three.current.camera.position.clone();
    const t0 = Date.now();
    const animate = () => {
      const p = Math.min((Date.now()-t0)/500, 1);
      const ep = 1 - (1-p)**3;
      three.current.camera!.position.lerpVectors(start, pos, ep);
      three.current.controls!.update();
      if (p < 1) requestAnimationFrame(animate);
    };
    animate();
  }

  // ── Chat ───────────────────────────────────────────────────────────────────

  async function sendChatMessage(text: string) {
    if (!text.trim()) return;

    if (!isAuthenticated) {
      appendBotMessage('🔐 Sign in required to use AI analysis features.');
      return;
    }
    if (creditInfo && creditInfo.remaining <= 0) {
      appendBotMessage(`💳 All ${creditInfo.limit} daily credits used. Resets in ${creditInfo.timeUntilReset}h.`);
      return;
    }

    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { id:`user-${Date.now()}`, type:'user', content:text.trim(), timestamp:Date.now() }],
      isChatLoading: true,
    }));

    try {
      const response = await callDFMApi(text);
      appendBotMessage(response);
      window.postMessage({ type: 'refreshCredits' }, '*');
    } catch (err: any) {
      appendBotMessage(friendlyApiError(err));
    } finally {
      set({ isChatLoading: false });
    }
  }

  function appendBotMessage(content: string) {
    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, { id:`bot-${Date.now()}`, type:'bot', content, timestamp:Date.now() }],
      isChatLoading: false,
    }));
  }

  async function callDFMApi(message: string): Promise<string> {
    if (!user?.id) return 'Please sign in to use AI-powered DFM analysis.';

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.access_token) return 'Authentication error. Please sign in again.';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    try {
      const res = await fetch('/api/dfm-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ message, geometryData: state.realTimeGeometry, fileName, userId: user.id }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 402) return `**Insufficient Credits**\n\n${body.message ?? 'Please wait for credit reset.'}`;
        if (res.status === 429) return `**Rate Limited**\n\nPlease wait ${body.nextRetryAfter ?? 60}s and try again.`;
        if (res.status >= 500) return '**Server Error**\n\nTemporary issue. Please try again shortly.';
        throw new Error(body.error ?? `Status ${res.status}`);
      }

      const data = await res.json();
      
      // Immediately refresh credit info after successful API call
      window.postMessage({ type: 'refreshCredits' }, '*');
      
      if (data.queued) return await pollQueuedResult(data.requestId, data.estimatedWaitTime);
      return data.content ?? 'No analysis content received.';
    } finally {
      clearTimeout(timeout);
    }
  }

  async function pollQueuedResult(requestId: string, estimatedWait: number): Promise<string> {
    const deadline = Date.now() + Math.min(estimatedWait * 2000, 120_000);
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 2000));
      try {
        const res = await fetch(`/api/dfm-analysis/status/${requestId}`);
        const data = await res.json();
        if (res.ok && data.content) {
          // Refresh credit info after queued analysis completes
          window.postMessage({ type: 'refreshCredits' }, '*');
          return data.content;
        }
        if (data.error && !data.status) throw new Error(data.error);
      } catch { /* continue polling */ }
    }
    return '**Timeout**\n\nAnalysis is taking too long. Please try again with a simpler question.';
  }

  function friendlyApiError(err: any): string {
    if (err?.name === 'AbortError') return '**Timeout**\n\nRequest cancelled. Please try again.';
    if (err?.message?.includes('402')) return '**Credits Required**\n\nYou need more credits for this analysis.';
    return '**Analysis Error**\n\nUnable to complete analysis. Please try again.';
  }

  // ── Error State ────────────────────────────────────────────────────────────

  if (state.error) {
    return (
      <div className={`relative bg-card rounded-xl border border-border overflow-hidden ${className}`}>
        <div className="h-full flex items-center justify-center p-8 text-center">
          <div>
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Model</h3>
            <p className="text-sm text-muted-foreground mb-4">{state.error}</p>
            <Button onClick={() => window.location.reload()} className="bg-emuski-teal hover:bg-emuski-teal/80">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className={`relative bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:border-emuski-teal transition-all duration-300 ${className}`}>

      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="absolute inset-0 bg-card/90 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-emuski-teal animate-spin" />
            <p className="text-sm font-medium text-foreground">Processing CAD Model…</p>
            <p className="text-xs text-muted-foreground mt-1">
              Analyzing geometry and features
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="absolute inset-0 bg-card/95 backdrop-blur-sm z-30 flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              3D Viewer Error
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {state.error}
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => set({ error: null, isLoading: false })}
                className="w-full"
                size="sm"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
                size="sm"
              >
                Reload Page
              </Button>
            </div>
            {window.innerWidth <= 768 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Mobile Tip:</strong> Use two fingers to rotate, pinch to zoom. 
                  For best experience, try desktop version.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3D Viewport */}
      <div
        ref={viewerRef}
        className="w-full h-full min-h-[300px] bg-gradient-to-br from-muted/20 to-muted/40 touch-manipulation"
        style={{ cursor: 'grab', touchAction: 'pan-x pan-y pinch-zoom' }}
      />

      {/* Left Control Panel */}
      <div className="absolute top-6 left-6 z-10 hidden sm:flex flex-col gap-3 rounded-2xl bg-white/80 p-4 backdrop-blur-xl shadow-lg border border-slate-200/50 min-w-[220px] text-sm text-slate-600">

        {/* Units */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => set({ measureMode: !state.measureMode })}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${state.measureMode ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200/60 text-slate-600'}`}
          >
            Measure
          </button>
          <select
            value={state.measureUnits}
            onChange={e => { const u = e.target.value as MeasureUnit; set({ measureUnits: u }); onUnitChange?.(u); }}
            className="bg-slate-50 border border-slate-200/60 rounded-md px-2 py-1 text-xs font-medium text-slate-700 outline-none"
          >
            {(['mm','cm','m','in'] as MeasureUnit[]).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="h-px bg-slate-200/60" />

        {/* View Toggles */}
        {([
          { label: 'Wireframe', key: 'isWireframe' as const },
          { label: 'X-Ray View', key: 'isXRayView' as const, action: toggleXRayView },
          { label: 'Cross Section', key: 'showCrossSection' as const },
        ]).map(({ label, key, action }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-medium">{label}</span>
            <button
              onClick={action ?? (() => set({ [key]: !state[key] } as any))}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${state[key] ? 'bg-blue-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${state[key] ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}

        <div className="h-px bg-slate-200/60" />

        {/* Color Swatches */}
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-medium mb-2">Model Color</div>
          <div className="flex justify-between gap-1">
            {MODEL_COLORS.map(c => (
              <button
                key={c}
                className={`h-5 w-5 rounded-full border ring-offset-2 transition-all hover:scale-110 ${state.modelColor === c ? 'ring-2 ring-blue-500 scale-110 border-white' : 'border-slate-200'}`}
                style={{ backgroundColor: c }}
                onClick={() => { set({ modelColor: c }); changeModelColor(c); }}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-200/60" />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={takeScreenshot} className="rounded-lg bg-slate-50 border border-slate-200/60 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-white hover:border-blue-200 transition-all">Screenshot</button>
          <button onClick={() => { const next = !state.showGrid; if (three.current.gridHelper) three.current.gridHelper.visible = next; set({ showGrid: next }); }} className="rounded-lg bg-slate-50 border border-slate-200/60 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-white hover:border-blue-200 transition-all">Grid</button>
        </div>

        <div className="h-px bg-slate-200/60" />

        {/* Dimensions */}
        <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200/40">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">Model Bounds</div>
          {state.realTimeGeometry ? (
            <>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                {(['length','width','height'] as const).map((k, i) => (
                  <div key={k} className="flex flex-col">
                    <span className="text-slate-400">{['X','Y','Z'][i]}</span>
                    <span className="text-slate-700 font-bold">{convertUnits(state.realTimeGeometry!.dimensions[k], state.measureUnits)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 text-[10px] text-right text-slate-400 uppercase">{state.measureUnits}</div>
            </>
          ) : <div className="text-[11px] text-slate-400">Loading…</div>}
        </div>
      </div>

      {/* Mobile Control Panel */}
      <div className="absolute top-4 left-4 right-4 z-10 sm:hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => set({ measureMode: !state.measureMode })}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  state.measureMode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Measure
              </button>
              <select
                value={state.measureUnits}
                onChange={e => { 
                  const u = e.target.value as MeasureUnit; 
                  set({ measureUnits: u }); 
                  onUnitChange?.(u); 
                }}
                className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-1"
              >
                {(['mm','cm','m','in'] as MeasureUnit[]).map(u => 
                  <option key={u} value={u}>{u}</option>
                )}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={takeScreenshot}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors text-xs font-medium"
                title="Screenshot"
              >
                Shot
              </button>
              <button
                onClick={() => {
                  const next = !state.isWireframe;
                  set({ isWireframe: next });
                }}
                className={`p-2 rounded transition-colors text-xs font-medium ${
                  state.isWireframe 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Wireframe"
              >
                Wire
              </button>
              <button
                onClick={() => {
                  const next = !state.showGrid;
                  if (three.current.gridHelper) three.current.gridHelper.visible = next;
                  set({ showGrid: next });
                }}
                className={`p-2 rounded transition-colors text-xs font-medium ${
                  state.showGrid 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title="Grid"
              >
                Grid
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            Pinch to zoom • Two fingers to rotate • Drag to pan
          </div>
        </div>
      </div>

      {/* ViewCube */}
      <div className="absolute top-3 right-3 z-0 pointer-events-auto">
        <canvas
          ref={viewCubeRef}
          width={VIEW_CUBE_SIZE}
          height={VIEW_CUBE_SIZE}
          className="w-24 h-24 sm:w-36 sm:h-36 cursor-pointer"
          style={{ background:'rgba(255,255,255,0.3)', borderRadius:12, border:'1px solid rgba(255,255,255,0.5)', backdropFilter:'blur(12px)' }}
        />
      </div>

      {/* Analysis Badge */}
      {state.analysisData && (
        <div className="absolute bottom-3 left-3 right-3 z-10 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border/50 max-h-40 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              DFM Analysis Complete
            </h4>
            <Badge variant="outline">{state.analysisData.dfm_analysis.difficulty_level}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div><span className="text-muted-foreground">Manufacturability: </span><span className="font-medium">{Math.round(state.analysisData.dfm_analysis.manufacturability_score)}%</span></div>
            <div><span className="text-muted-foreground">Volume: </span><span className="font-medium">{(state.analysisData.geometry_features.volume_mm3/1000).toFixed(1)} cm³</span></div>
          </div>
        </div>
      )}

      {/* Zoom / Share Controls */}
      <div className={`absolute bottom-4 right-4 transition-all duration-300 ${state.isChatOpen ? 'z-0' : 'z-10'}`}>
        <div className="flex gap-1 bg-card rounded-md p-1 border border-border">
          {[
            { title:'Zoom In', onClick:handleZoomIn, d:'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-6-3v6m-3-3h6' },
            { title:'Zoom Out', onClick:handleZoomOut, d:'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-3-3H8' },
            { title:'Reset', onClick:handleReset, d:'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' },
            { title:'Share', onClick:handleShare, d:'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13' },
          ].map(({ title, onClick, d }) => (
            <button key={title} title={title} onClick={onClick} className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-emuski-teal/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={d} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="absolute bottom-12 right-4 z-[60]">
        {!state.isChatOpen && (
          <div className="relative">
            {isAuthenticated && creditInfo && creditInfo.remaining <= 0 && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap animate-bounce z-[80]">
                💳 No credits left
              </div>
            )}
            
            {/* Chat button with nudge animation */}
            <button
              onClick={() => {
                set({ isChatOpen: true });
              }}
              className="transition-all hover:scale-105 relative hover:shadow-lg hover:shadow-emuski-teal/30 active:scale-95 active:shadow-xl active:shadow-emuski-teal/50 animate-[glow_2s_ease-in-out_infinite]"
              style={{ background: 'transparent', border: 'none', padding: 0, outline: 'none' }}
            >
              <div className="relative">
                <img 
                  src="/EMUSKI_founder.svg" 
                  alt="Mithran - AI Assistant" 
                  className="w-16 h-16 object-cover rounded-full animate-[nudge_3s_ease-in-out_infinite] ring-2 ring-white shadow-lg"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    borderRadius: '50%',
                    clipPath: 'circle(50% at 50% 50%)'
                  }}
                />
                
                {/* Thought emoji on top */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl animate-pulse">
                  💭
                </div>
                {/* Thinking dots animation */}
                <div className="absolute -top-2 -right-1 flex space-x-1">
                  {[0, 150, 300].map(delay => (
                    <div 
                      key={delay}
                      className="w-1.5 h-1.5 bg-emuski-teal rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
                    />
                  ))}
                </div>
              </div>
              
            </button>
          </div>
        )}

        {state.isChatOpen && (
          <div className="absolute bottom-0 right-0 w-[90vw] sm:w-[400px] h-[80vh] sm:h-[75vh] max-h-[700px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col z-[100] max-w-[calc(100vw-2rem)] origin-bottom-right animate-in fade-in slide-in-from-bottom-2">

            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-emuski-teal rounded-t-xl">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-white">Mithran AI Assistant</h3>
                <Badge variant="outline" className="text-xs bg-white text-emuski-teal border-white">{fileName}</Badge>
              </div>
              <button onClick={() => set({ isChatOpen: false })} className="text-white hover:text-gray-200 p-1 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Security Notice */}
              {!isAuthenticated && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-semibold">Authentication Required</span>
                  </div>
                  <p className="text-sm text-red-700">Please sign in to access Mithran AI Assistant and prevent unlimited token usage.</p>
                </div>
              )}
              
              {isAuthenticated && creditInfo && creditInfo.remaining <= 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="font-semibold">Credits Exhausted</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    You've used all {creditInfo.limit} daily credits. Credits reset in {Math.ceil(creditInfo.timeUntilReset)} hours.
                  </p>
                </div>
              )}
              
              {state.chatMessages.map(msg => (
                <div key={msg.id} className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden mt-1">
                    {msg.type === 'bot'
                      ? <img 
                          src="/EMUSKI_founder (1).svg" 
                          alt="Mithran - AI Assistant" 
                          className="w-full h-full object-cover"
                        />
                      : <div className="w-full h-full bg-emuski-teal/10 rounded-full flex items-center justify-center">
                          {user?.user_metadata?.avatar_url ? (
                            <img 
                              src={user.user_metadata.avatar_url} 
                              alt={user.user_metadata?.full_name || user.email || 'User'} 
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-emuski-teal">
                              {(user?.user_metadata?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                    }
                  </div>
                  <div className={`max-w-[85%] rounded-lg shadow-sm border ${msg.type === 'user' ? 'bg-emuski-teal text-white border-emuski-teal/20' : 'bg-gray-50 text-gray-900 border-gray-200'}`}>
                    <div className="p-4">
                      {msg.type === 'bot'
                        ? <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.content) }} />
                        : <p className="text-base font-medium">{msg.content}</p>
                      }
                    </div>
                    <div className={`px-4 pb-2 text-xs opacity-70 ${msg.type === 'user' ? 'text-white/80 text-right' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {state.isChatLoading && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden mt-1 relative">
                    <img 
                      src="/EMUSKI_founder (1).svg" 
                      alt="Mithran - AI Assistant" 
                      className="w-full h-full object-cover animate-pulse"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        {[0,75,150].map(d => <div key={d} className="w-2 h-2 bg-emuski-teal rounded-full animate-bounce" style={{ animationDelay:`${d}ms` }} />)}
                      </div>
                      <span className="text-sm text-gray-700">Analyzing your model…</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="px-3 pt-2">
              {isAuthenticated && !state.suggestionsHidden && (
                <div className="mb-2 p-2 bg-gradient-to-r from-emuski-teal/10 to-blue-500/10 border border-emuski-teal/20 rounded-lg relative">
                  <button
                    onClick={() => set({ suggestionsHidden: true })}
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                  <p className="text-xs font-medium text-gray-900 mb-2 pr-6">Get started:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {CHAT_SUGGESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const input = document.querySelector<HTMLInputElement>('input[data-chat]');
                          if (input) { input.value = q.full; input.focus(); }
                          set({ suggestionsHidden: true });
                        }}
                        className="px-2 py-1.5 text-left text-xs bg-white hover:bg-gray-50 border border-gray-200 hover:border-emuski-teal/30 rounded text-gray-700 hover:text-emuski-teal transition-all"
                      >
                        {q.short}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isAuthenticated && state.suggestionsHidden && (
                <button
                  onClick={() => set({ suggestionsHidden: false })}
                  className="w-full mb-2 flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-emuski-teal bg-emuski-teal/5 hover:bg-emuski-teal/10 border border-emuski-teal/20 rounded-lg transition-all"
                >
                  Show suggested questions
                </button>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const inp = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input');
                  if (inp?.value.trim()) { sendChatMessage(inp.value); inp.value = ''; }
                }}
                className="relative"
              >
                <input
                  data-chat
                  type="text"
                  placeholder={
                    !isAuthenticated ? 'Sign in to use AI features' :
                    creditInfo && creditInfo.remaining <= 0 ? `No credits — resets in ${creditInfo.timeUntilReset}h` :
                    `Ask anything about ${fileName}…`
                  }
                  disabled={state.isChatLoading || !isAuthenticated || !!(creditInfo && creditInfo.remaining <= 0)}
                  className="w-full pl-3 pr-12 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emuski-teal/50 focus:border-emuski-teal bg-white shadow-sm transition-all disabled:bg-gray-50 disabled:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={state.isChatLoading || !isAuthenticated || !!(creditInfo && creditInfo.remaining <= 0)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emuski-teal text-white rounded-md hover:bg-emuski-teal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {state.isChatLoading
                    ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                  }
                </button>
              </form>

              {/* Footer */}
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                {isAuthenticated
                  ? <span>AI-powered DFM analysis</span>
                  : <span><Link href="/auth/login" className="text-emuski-teal hover:underline font-medium">Sign in</Link> or <Link href="/auth/register" className="text-emuski-teal hover:underline font-medium">create account</Link> to access Mithran AI Assistant</span>
                }
                {isAuthenticated && creditInfo && (
                  <div className="flex items-center gap-1">
                    <span><span className="text-emuski-teal font-semibold">{creditInfo.remaining.toFixed(1)}</span>/{creditInfo.limit} credits</span>
                    {creditInfo.remaining === 0 && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px]">None</span>}
                    {creditInfo.remaining > 0 && creditInfo.remaining <= 2 && <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded text-[10px]">Low</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// File Loader Helper
// ─────────────────────────────────────────────────────────────────────────────

async function loadLocalFile(file: File): Promise<THREE.BufferGeometry> {
  const ext = file.name.toLowerCase().split('.').pop() ?? '';

  if (ext === 'stl') {
    return new STLLoader().parse(await file.arrayBuffer());
  }

  if (ext === 'obj') {
    const group = new OBJLoader().parse(await file.text());
    let found: THREE.BufferGeometry | null = null;
    group.traverse(c => { if (c instanceof THREE.Mesh && !found) found = c.geometry; });
    if (found) return found;
    throw new Error('No geometry found in OBJ file');
  }

  if (['step','stp','iges','igs'].includes(ext))
    throw new Error(`${ext.toUpperCase()} files require the CAD Engine`);

  throw new Error(`Unsupported format: .${ext}`);
}

export default CadViewer;