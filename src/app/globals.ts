// ✅ Early PDF.js worker configuration for Next.js + Turbopack
if (typeof window !== 'undefined') {
  // Set local worker early to prevent CDN fallback
  const setPDFWorker = async () => {
    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    } catch (e) {
      // PDF.js not loaded yet
    }
  };
  
  setPDFWorker();
}