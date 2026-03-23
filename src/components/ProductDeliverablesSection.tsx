import React from 'react';
import { FileText } from 'lucide-react';
import { LazyPDFViewer } from './LazyPDFViewer';

const deliverables = [
  "Project Details",
  "Part Details",
  "MFG process Plan",
  "Mill TC",
  "Balloon Drawing",
  "Final Inspection Report",
  "Dock Audit Check List",
  "Product Image",
  "Key Learnings"
];

const ProductDeliverablesSection = () => {
  // Add keyframe animations to document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.8) translateY(10px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes flowLine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }

      @keyframes flowLineVertical {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(400%); }
      }

      @keyframes drawLine {
        from {
          transform: scaleX(0);
          transform-origin: left;
        }
        to {
          transform: scaleX(1);
          transform-origin: left;
        }
      }

      @keyframes drawLineVertical {
        from {
          transform: scaleY(0);
          transform-origin: top;
        }
        to {
          transform: scaleY(1);
          transform-origin: top;
        }
      }

      @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }

      @keyframes particleFlow {
        0% {
          opacity: 0;
          transform: translateX(0) translateY(-50%);
        }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% {
          opacity: 0;
          transform: translateX(80px) translateY(-50%);
        }
      }

      @keyframes particleFlowVertical {
        0% {
          opacity: 0;
          transform: translateY(0) translateX(-50%);
        }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% {
          opacity: 0;
          transform: translateY(40px) translateX(-50%);
        }
      }

      .animate-fadeInScale {
        animation: fadeInScale 0.5s ease-out forwards;
      }

      .animate-flowLine {
        animation: flowLine 3s ease-in-out infinite;
      }

      .animate-flowLineVertical {
        animation: flowLineVertical 3s ease-in-out infinite;
      }

      .animate-drawLine {
        animation: drawLine 2s ease-out forwards;
      }

      .animate-drawLineVertical {
        animation: drawLineVertical 2s ease-out forwards;
      }

      .animate-scaleIn {
        animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }

      .animate-particleFlow {
        animation: particleFlow 2s ease-in-out infinite;
      }

      .animate-particleFlowVertical {
        animation: particleFlowVertical 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Our Product Deliverables Include
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Comprehensive project delivery report with complete documentation
          </p>
        </div>

        {/* Roadmap - Vertical on Mobile, Horizontal on Desktop */}
        <div className="mb-12">
          {/* Desktop Horizontal View */}
          <div className="hidden md:block overflow-hidden">
            <div className="relative max-w-6xl mx-auto">
              {/* Base Progress Line */}
              <div className="absolute top-[18px] left-[50px] right-[50px] h-0.5 bg-gray-200" />

              {/* Animated Flow Line */}
              <div className="absolute top-[18px] left-[50px] right-[50px] h-0.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-emuski-teal to-transparent animate-flowLine"
                     style={{ width: '30%' }} />
              </div>

              {/* Progressive Reveal Line */}
              <div className="absolute top-[18px] left-[50px] right-[50px] h-0.5 bg-gradient-to-r from-emuski-teal-darker via-emuski-teal to-emuski-teal-darker animate-drawLine" />

              {/* Deliverables Flow */}
              <div className="flex gap-4 px-2 scrollbar-hide justify-center">
                {deliverables.map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex flex-col items-center text-center animate-fadeInScale"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      minWidth: '100px',
                      maxWidth: '120px'
                    }}
                  >
                    {/* Circle with Number */}
                    <div className="relative z-10 mb-3">
                      {/* Pulse Ring */}
                      <div
                        className="absolute inset-0 rounded-full bg-emuski-teal-darker/30 animate-pulse"
                        style={{
                          animationDelay: `${index * 100 + 500}ms`,
                          animationDuration: '2s'
                        }}
                      />

                      <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emuski-teal-darker to-emuski-teal flex items-center justify-center shadow-md animate-scaleIn"
                           style={{ animationDelay: `${index * 100}ms` }}>
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>

                      {/* Flowing Particle */}
                      {index < deliverables.length - 1 && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 left-full w-2 h-2 rounded-full bg-emuski-teal shadow-lg animate-particleFlow"
                          style={{
                            animationDelay: `${index * 100 + 800}ms`,
                            left: 'calc(100% + 10px)'
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <p className="text-xs font-semibold text-gray-800 leading-tight px-1">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Vertical View */}
          <div className="md:hidden max-w-sm mx-auto">
            <div className="relative pl-8">
              {/* Vertical Base Line */}
              <div className="absolute left-[18px] top-[20px] bottom-[20px] w-0.5 bg-gray-200" />

              {/* Vertical Animated Flow Line */}
              <div className="absolute left-[18px] top-[20px] bottom-[20px] w-0.5 overflow-hidden">
                <div className="w-full bg-gradient-to-b from-transparent via-emuski-teal to-transparent animate-flowLineVertical"
                     style={{ height: '30%' }} />
              </div>

              {/* Vertical Progressive Reveal Line */}
              <div className="absolute left-[18px] top-[20px] bottom-[20px] w-0.5 bg-gradient-to-b from-emuski-teal-darker via-emuski-teal to-emuski-teal-darker animate-drawLineVertical" />

              {/* Deliverables Flow */}
              <div className="space-y-6">
                {deliverables.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 animate-fadeInScale"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Circle with Number */}
                    <div className="relative flex-shrink-0">
                      {/* Pulse Ring */}
                      <div
                        className="absolute inset-0 rounded-full bg-emuski-teal-darker/30 animate-pulse"
                        style={{
                          animationDelay: `${index * 100 + 500}ms`,
                          animationDuration: '2s'
                        }}
                      />

                      <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emuski-teal-darker to-emuski-teal flex items-center justify-center shadow-md animate-scaleIn"
                           style={{ animationDelay: `${index * 100}ms` }}>
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>

                      {/* Flowing Particle */}
                      {index < deliverables.length - 1 && (
                        <div
                          className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 rounded-full bg-emuski-teal shadow-lg animate-particleFlowVertical"
                          style={{
                            animationDelay: `${index * 100 + 800}ms`,
                            top: 'calc(100% + 10px)'
                          }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="pt-1.5">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-emuski-teal-darker via-emuski-teal-dark to-emuski-teal p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base">Case Study</h4>
                  <p className="text-white/90 text-sm"></p>
                </div>
              </div>
            </div>
            <LazyPDFViewer
              src="/docs/Project_Delivery_Report.pdf"
              title="Case Study -"
              ariaLabel="Interactive PDF viewer displaying comprehensive project delivery report with manufacturing deliverables and quality assurance documentation"
              minHeight="600px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDeliverablesSection;