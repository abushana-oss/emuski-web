import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free 3D CAD Analysis Tool | AI-Powered DFM Analysis | EMUSKI',
  description: 'Upload STL, STEP, IGES files for instant AI-powered Design for Manufacturing analysis. Get cost estimates, manufacturability insights, and production recommendations in seconds.',
};

export default function CadAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://api.anthropic.com" />
      
      {/* Preload critical resources */}
      <link rel="prefetch" href="/api/credits/status" />
      
      {/* Performance hints for browser */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="color-scheme" content="light dark" />
      
      {/* DNS prefetch for performance */}
      <link rel="dns-prefetch" href="https://emuski.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      
      {/* Critical CSS inline for above-the-fold content */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .hero-gradient {
            background: linear-gradient(135deg, rgb(18, 26, 33) 0%, rgb(24, 32, 41) 100%);
          }
          .loading-spinner {
            border-color: #4fd3d4 transparent transparent transparent;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          /* Prevent layout shift for dynamic content */
          .cad-viewer-container {
            min-height: 600px;
            aspect-ratio: 16/9;
            contain: layout style paint;
          }
          .analysis-panel {
            min-height: 400px;
            contain: layout style;
          }
          /* Optimize repaints and compositing */
          .cad-3d-canvas {
            will-change: transform;
            transform: translateZ(0);
          }
          /* Reserve space for lazy-loaded images */
          img[data-lazy] {
            aspect-ratio: attr(width) / attr(height);
            background: #f0f0f0;
          }
        `
      }} />
      
{children}
    </>
  );
}