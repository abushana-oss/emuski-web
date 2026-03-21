// ✅ Clean PDF.js worker configuration for Next.js + Turbopack
export const setupPDFWorker = async () => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // ✅ Force local worker (Turbopack safe)
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }
    
    return pdfjsLib;
  } catch (error) {
    console.error('Failed to setup PDF.js:', error);
    throw error;
  }
};