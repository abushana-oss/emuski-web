'use client'

export const TrustedPartners = () => {
  const partners = [
    "/assets/partners/etherealx-partner-logo-1.svg",
    "/assets/partners/pixxel-partner-logo-4.svg",
    "/assets/partners/TATA-motors-logo-3.svg",
    "/assets/partners/rorland-berger-company.logo.svg",
    "/assets/partners/cynLr-partner-logo-2.svg",
    ...Array.from({ length: 16 }, (_, i) => `/assets/partners/manufacturing-partner-logo-${i + 1}.svg`)
  ];

  return (
    <section className="py-10 sm:py-12 md:py-14 lg:py-16 border-b border-border/30 relative overflow-hidden" style={{ backgroundColor: 'rgb(18, 26, 33)' }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'linear-gradient(to right, #4fd3d4 1px, transparent 1px), linear-gradient(to bottom, #4fd3d4 1px, transparent 1px)',
            backgroundSize: '4rem 4rem'
          }}
        ></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mb-2">Trusted by Industry Leaders</h2>
          <p className="text-sm sm:text-base text-white/60">Partnering with leading manufacturers worldwide</p>
        </div>
        <div className="relative overflow-hidden py-4 sm:py-6 md:py-8">
          <div className="flex animate-scroll space-x-12 sm:space-x-16 md:space-x-20 lg:space-x-24 items-center">
            {partners.concat(partners).map((partner, idx) => (
              <div key={idx} className="flex-shrink-0 grayscale transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110 flex items-center justify-center">
                <img
                  src={partner}
                  alt={`Partner Logo ${idx}`}
                  className="h-16 xs:h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 w-auto object-contain filter brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (min-width: 640px) {
          .animate-scroll {
            animation: scroll 50s linear infinite;
          }
        }
        @media (min-width: 1024px) {
          .animate-scroll {
            animation: scroll 60s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};
