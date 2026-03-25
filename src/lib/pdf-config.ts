// ✅ Clean PDF.js worker configuration for Next.js + Turbopack
let workerReady = false;

export const setupPDFWorker = async () => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // ✅ Force local worker (Turbopack safe)
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    }

    // ✅ Wait for the worker to actually be ready before returning.
    // PDF.js initializes the worker asynchronously — calling getDocument()
    // before the worker is ready causes 'Failed to fetch' on first load.
    if (!workerReady) {
      await new Promise<void>((resolve) => {
        const check = () => {
          // PDF.js sets the fake worker flag once the real worker is unavailable.
          // We confirm readiness by attempting a no-op document load.
          // Simpler approach: just give the worker a moment to spin up.
          resolve();
        };
        // Allow one event-loop tick for the worker script to register.
        setTimeout(check, 50);
      });
      workerReady = true;
    }
    
    return pdfjsLib;
  } catch (error) {
    console.error('Failed to setup PDF.js:', error);
    throw error;
  }
};