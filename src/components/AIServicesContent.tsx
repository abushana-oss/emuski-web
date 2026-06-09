'use client'

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";

function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) { videoRef.current?.pause(); return; }
    document.body.style.overflow = 'hidden';
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', fn);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-10"
      style={{ zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: '16/9' }}
        onClick={e => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src="/video/emuski.mp4"
          className="w-full h-full bg-black"
          controls
          autoPlay
          playsInline
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>,
    document.body
  );
}

function LiveSavings() {
  const BASE = 72.2;
  const [val, setVal] = useState(BASE);
  const [prev, setPrev] = useState(BASE);
  useEffect(() => {
    const id = setInterval(() => {
      setVal(v => { setPrev(v); return +(v + 0.1).toFixed(1); });
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="text-[13px] text-[#6b7280] m-0">
      Live cost savings identified:{' '}
      <span className="font-semibold text-[#0d9e8a]" aria-live="polite" aria-atomic="true">
        ₹{val.toFixed(1)}Cr
      </span>
    </p>
  );
}

export const AIServicesContent = () => {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="space-y-0">
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      {/* ── Emithran Hero Section ── */}
      <section id="mithran-overview" className="relative overflow-hidden bg-white">
        {/* Dot-grid atmosphere */}
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, #0d9e8a1a 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* Full-bleed background SVG */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <img src="/assets/cards/projectcard.svg"       alt="" className="hidden lg:block absolute inset-0 h-full w-full object-cover object-center" />
          <img src="/assets/cards/projectcardmobile.svg" alt="" className="lg:hidden absolute inset-0 h-full w-full object-cover object-top" />
        </div>
        {/* Gradient fade — heavy white on left, fading right */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: 'linear-gradient(to right, #ffffff 0%, #ffffff 36%, rgba(255,255,255,0.80) 55%, rgba(255,255,255,0.12) 78%, transparent 100%)' }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden" style={{ background: 'rgba(255,255,255,0.72)' }} />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT: copy */}
            <div className="max-w-[560px]">

              {/* Platform badge */}
              <div className="inline-flex items-center mb-7">
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#0a7a6a]">Mithran Platform</span>
              </div>

              {/* Headline */}
              <h2 className="text-[40px] sm:text-[52px] lg:text-[58px] font-extrabold tracking-tight text-[#0d1117] leading-[1.04] mb-3">
                End-to-End<br />
                OEM<br />
                <span className="text-[#0d9e8a]">Intelligence</span>
              </h2>

              {/* Inline description — bold headline flows into subdued description */}
              <div className="mb-10">
                <p className="text-[20px] sm:text-[24px] font-semibold text-[#0d1117] leading-snug inline">
                  at the speed of AI
                </p>
                <span className="text-[20px] sm:text-[24px] font-semibold text-[#9ca3af] leading-snug inline">
                  {' '}Sourcing, costing, BOM intelligence, and supplier evaluation. All in one platform.
                </span>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <a
                  href="https://emithran.emuski.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 sm:px-7 sm:py-3.5 text-[13px] sm:text-[15px] font-bold text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #0d9e8a 0%, #0a7a6a 100%)' }}
                >
                  Explore Platform
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <button
                  onClick={() => setVideoOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0d9e8a]/30 bg-white px-4 py-[11px] sm:px-7 sm:py-[13px] text-[13px] sm:text-[15px] font-bold text-[#0d1117] shadow-sm hover:border-[#0d9e8a] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0d9e8a, #0a7a6a)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" className="w-2 h-2 sm:w-2.5 sm:h-2.5 ml-px">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                  Watch Overview
                </button>
              </div>
            </div>

            {/* RIGHT: video card */}
            <div className="w-full">
              <button
                onClick={() => setVideoOpen(true)}
                className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  aspectRatio: '16/9',
                  boxShadow: '0 20px 60px rgba(13,158,138,0.20), 0 4px 20px rgba(0,0,0,0.10)',
                }}
                aria-label="Watch Emithran overview video"
              >
                <img
                  src="/assets/cards/videocard.svg"
                  alt="Emithran platform preview"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/18 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Teal ring glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 0 2px rgba(13,158,138,0.45)' }}
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 shadow-2xl"
                    style={{
                      width: '72px',
                      height: '72px',
                      background: 'linear-gradient(135deg, #0d9e8a, #0a7a6a)',
                      boxShadow: '0 8px 36px rgba(13,158,138,0.55)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7 ml-1">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0d9e8a]/40 to-transparent" />
      </section>

      {/* How Mithran Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How Mithran Transforms Your Workflow
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Mithran enables OEMs to streamline every stage of product development with intelligent automation
              </p>
            </div>

            {/* Capabilities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {/* CAD to BOM */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Automated BOM Generation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Upload CAD drawings and instantly generate structured, accurate Bills of Materials. No more manual data entry or spreadsheet errors.
                </p>
              </div>

              {/* AI Cost Estimation */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  AI-Driven Process Planning
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get intelligent process recommendations and precise cost estimations powered by machine learning algorithms trained on thousands of manufacturing scenarios.
                </p>
              </div>

              {/* Supplier Network */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Smart Supplier Matching
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Automatically identify capable suppliers, manage RFQs, and validate quotations against our global cost database for optimal pricing.
                </p>
              </div>

              {/* DFM Collaboration */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  DFM Review Automation
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Collaborate seamlessly on design-for-manufacturing reviews with automated feedback loops and finalize production-ready drawings faster.
                </p>
              </div>

              {/* Real-time Monitoring */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Real-Time Project Tracking
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monitor every project and logistics milestone in real time with AI-powered risk detection for faster, more predictable execution.
                </p>
              </div>

              {/* Data Intelligence */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 border border-gray-200 hover:border-emuski-teal-dark/50 transition-all hover:shadow-lg group">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Predictive Analytics
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Leverage historical data and AI models to predict costs, lead times, and potential bottlenecks before they impact your timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image - Left side */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src="/assets/mitran/ai-raw-material-optimization.svg"
                    alt="Mithran AI Intelligence"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23ffffff' width='600' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EMithran AI%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>

              {/* Content - Right side */}
              <div className="space-y-6 order-1 lg:order-2">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">Business Impact</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Why Mithran Matters for Your Business
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  In today's competitive manufacturing landscape, speed and accuracy aren't optional—they're essential. Mithran is being built to address the critical pain points that slow down OEMs and inflate costs.
                </p>

                {/* Key Benefits */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Accelerate Time-to-Market</h4>
                      <p className="text-sm text-gray-600">Reduce design-to-production cycles by 30% with automated workflows and intelligent process planning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Eliminate Manual Errors</h4>
                      <p className="text-sm text-gray-600">AI-driven automation removes human error from BOM generation, cost estimation, and quote validation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Optimize Sourcing Decisions</h4>
                      <p className="text-sm text-gray-600">Leverage global cost intelligence to negotiate better prices and identify reliable suppliers faster</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emuski-teal-darker flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Gain Complete Visibility</h4>
                      <p className="text-sm text-gray-600">Real-time dashboards and predictive analytics provide end-to-end project transparency</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-lg p-4">
                    <div className="text-3xl font-bold mb-1 text-white">30%</div>
                    <div className="text-sm" style={{color: '#ffffff'}}>Faster Sourcing Cycles</div>
                  </div>
                  <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-lg p-4">
                    <div className="text-3xl font-bold mb-1 text-white">15%</div>
                    <div className="text-sm" style={{color: '#ffffff'}}>Cost Savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Ahead */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-6">
                <p className="text-sm font-semibold text-emuski-teal-darker uppercase tracking-wide">The Future - Mithran AI</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  The Future of Manufacturing Intelligence
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  EMUSKI is building Mithran to help OEMs gain AI-powered intelligence, stronger control, and global competitiveness. Once launched, Mithran will be the platform that connects engineering precision with data-driven decision-making.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Imagine a world where your entire product development ecosystem is connected—where design changes automatically update cost models, where supplier selection is backed by real-time quality data, and where potential delays are predicted and resolved before they happen.
                </p>

                {/* Vision Points */}
                <div className="bg-gradient-to-br from-emuski-teal-darker to-emuski-teal-dark rounded-xl p-6 text-white">
                  <h4 className="font-bold mb-6 text-base">Mithran's Vision</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#ffffff'}}>1</div>
                      <p className="text-base leading-relaxed" style={{color: '#ffffff'}}>Unite engineering, procurement, and manufacturing in one intelligent platform</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#ffffff'}}>2</div>
                      <p className="text-base leading-relaxed" style={{color: '#ffffff'}}>Democratize access to world-class manufacturing intelligence for OEMs of all sizes</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#ffffff'}}>3</div>
                      <p className="text-base leading-relaxed" style={{color: '#ffffff'}}>Create a global ecosystem where suppliers and OEMs collaborate seamlessly</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold" style={{color: '#ffffff'}}>4</div>
                      <p className="text-base leading-relaxed" style={{color: '#ffffff'}}>Continuously learn and improve through AI, making every project smarter than the last</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emuski-teal/20 to-emuski-teal-dark/20 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                  <Image
                    src="/assets/mitran/ai-mitran-future.svg"
                    alt="Future of Manufacturing"
                    width={1600}
                    height={900}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%23f3f4f6' width='600' height='400'/%3E%3Ctext fill='%236b7280' font-family='system-ui' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EFuture Vision%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};