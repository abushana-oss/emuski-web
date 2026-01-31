'use client'

import { Linkedin, Instagram, Twitter, BookOpen, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const emuskiLogo = "/assets/emuski-logo-optimized.webp";

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-8 sm:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8 text-left max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Manufacturing Excellences */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Manufacturing Excellences</h4>
            <ul className="space-y-2">
              <li><Link href="/manufacturing-services" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">On-Demand Manufacturing</Link></li>
              <li><Link href="/manufacturing-services#prototyping" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Rapid Prototyping</Link></li>
              <li><Link href="/manufacturing-services#custom" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Custom Manufacturing</Link></li>
              <li><Link href="/manufacturing-services#scaling" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Production Scaling</Link></li>
            </ul>
          </div>

          {/* Engineering Innovations */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Engineering Innovations</h4>
            <ul className="space-y-2">
              <li><Link href="/precision-engineering" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Cost Precision</Link></li>
              <li><Link href="/precision-engineering#cost-estimation" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Product Cost Estimation</Link></li>
              <li><Link href="/precision-engineering#vave" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">VAVE & Benchmarking</Link></li>
              <li><Link href="/precision-engineering#sourcing" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Strategic Sourcing</Link></li>
              <li><Link href="/precision-engineering#expert-support" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Expert Engineer Support</Link></li>
            </ul>
          </div>

          {/* AI & Technology */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">AI & Technology</h4>
            <ul className="space-y-2">
              <li><Link href="/solutions/ai" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Mithran AI Platform</Link></li>
              <li><Link href="/solutions/ai#mithran-overview" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Smart Sourcing</Link></li>
              <li><Link href="/solutions/ai" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Supply Chain Optimization</Link></li>

            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/gallery" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Gallery</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Contact Us</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Blog & Insights</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm block py-1">Get a Quote</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Our Locations</h4>
            <div className="space-y-4">
              {/* Headquarters */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">Headquarters</p>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 text-emuski-teal-darker mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    126, RNS Plaza, Electronic City Phase 2, Bangalore
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-emuski-teal-darker flex-shrink-0" />
                  <a href="tel:+918344474556" className="text-xs text-muted-foreground hover:text-emuski-teal-darker transition-colors">
                    +91 86670 88060
                  </a>
                </div>
              </div>

              {/* Manufacturing Facility */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">Manufacturing</p>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-3 w-3 text-emuski-teal-darker mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Hosur, Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-emuski-teal-darker flex-shrink-0" />
                <a href="mailto:enquiries@emuski.com" className="text-xs text-muted-foreground hover:text-emuski-teal-darker transition-colors">
                  enquiries@emuski.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media Section */}
        <div className="border-t border-border pt-6 pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h4 className="text-foreground font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.linkedin.com/company/e-muski/posts/?feedView=all" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emuski-teal-darker transition-colors p-2 hover:bg-muted rounded-lg"
                  aria-label="Follow EMUSKI on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/emuski_official/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emuski-teal-darker transition-colors p-2 hover:bg-muted rounded-lg"
                  aria-label="Follow EMUSKI on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/emuski" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emuski-teal-darker transition-colors p-2 hover:bg-muted rounded-lg"
                  aria-label="Follow EMUSKI on X (Twitter)"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.reddit.com/user/emuski" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emuski-teal-darker transition-colors p-2 hover:bg-muted rounded-lg"
                  aria-label="Follow EMUSKI on Reddit"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                  </svg>
                </a>
                <Link 
                  href="/blog" 
                  className="text-muted-foreground hover:text-emuski-teal-darker transition-colors p-2 hover:bg-muted rounded-lg"
                  aria-label="Read EMUSKI Manufacturing Blog"
                >
                  <BookOpen className="h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-muted-foreground text-sm">Connect with EMUSKI</p>
              <p className="text-muted-foreground text-xs mt-1">Your One-Stop Solution for OEM in Bangalore, India</p>
            </div>
          </div>
        </div>
        
        {/* Copyright and Legal */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
<div className="flex items-center space-x-1.5">
                <Image
                  src={emuskiLogo}
                  alt="EMUSKI Manufacturing Solutions Logo"
                  width={28}
                  height={14}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-3.5 w-auto"
                  quality={75}
                />
                <span className="text-foreground font-bold text-sm">EMUSKI</span>
              </div>
              <span className="text-muted-foreground text-sm">© 2025 EMUSKI Corporation. All rights reserved.</span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-muted-foreground hover:text-emuski-teal-darker transition-colors text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
