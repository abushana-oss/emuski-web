'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';
import { MobileErrorFallback } from './MobileErrorFallback';

// Lazy load heavy 3D CAD components for better performance
const CadAnalysisInterface = dynamic(
  () => import('@/components/CadAnalysisInterface').then(mod => ({ default: mod.CadAnalysisInterface })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emuski-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading 3D CAD Analysis Tool...</p>
        </div>
      </div>
    )
  }
);

export function DynamicCadAnalysis() {
  return (
    <ErrorBoundary fallback={<MobileErrorFallback />}>
      <CadAnalysisInterface />
    </ErrorBoundary>
  );
}