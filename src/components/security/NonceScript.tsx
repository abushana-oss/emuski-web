'use client';

import { useEffect, useState } from 'react';

interface NonceScriptProps {
  children: string;
  id?: string;
  type?: string;
  defer?: boolean;
  async?: boolean;
}

/**
 * Component to inject scripts with proper CSP nonce
 * This component automatically handles nonce retrieval and script injection
 */
export function NonceScript({ 
  children, 
  id, 
  type = 'text/javascript',
  defer = false,
  async = false 
}: NonceScriptProps) {
  const [nonce, setNonce] = useState<string>('');

  useEffect(() => {
    // Get nonce from meta tag or headers
    const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
    if (metaNonce) {
      setNonce(metaNonce);
    }
  }, []);

  useEffect(() => {
    if (nonce && children) {
      const script = document.createElement('script');
      script.textContent = children;
      script.nonce = nonce;
      script.type = type;
      
      if (id) script.id = id;
      if (defer) script.defer = true;
      if (async) script.async = true;
      
      // Insert script
      const target = document.head || document.body || document.documentElement;
      target.appendChild(script);
      
      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [nonce, children, id, type, defer, async]);

  // Return null as this component only manages script injection
  return null;
}

/**
 * Hook to get current CSP nonce
 */
export function useCSPNonce(): string {
  const [nonce, setNonce] = useState<string>('');

  useEffect(() => {
    // Try multiple methods to get nonce
    const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
    const headerNonce = document.querySelector('script[data-nonce]')?.getAttribute('data-nonce');
    
    setNonce(metaNonce || headerNonce || '');
  }, []);

  return nonce;
}

/**
 * Component to set CSP nonce in meta tag for client-side access
 */
export function CSPNonceMeta({ nonce }: { nonce: string }) {
  if (!nonce) return null;
  
  return (
    <meta name="csp-nonce" content={nonce} />
  );
}