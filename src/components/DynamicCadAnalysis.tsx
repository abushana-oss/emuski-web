'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';

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
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">3D CAD Tool Unavailable</h3>
            <p className="text-sm text-gray-600 mb-4">
              The 3D CAD analysis tool cannot run on this device. This may be due to:
            </p>
            <ul className="text-sm text-gray-500 text-left mb-4 space-y-1">
              <li>• WebGL not supported on your browser</li>
              <li>• Insufficient device memory</li>
              <li>• Mobile browser limitations</li>
            </ul>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-emuski-teal text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emuski-teal-dark transition-colors"
              >
                Try Again
              </button>
              <p className="text-xs text-gray-500">
                For best experience, try using a desktop computer or newer mobile device with WebGL support.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <CadAnalysisInterface />
    </ErrorBoundary>
  );
}