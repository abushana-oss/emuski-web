'use client'

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import dynamic from "next/dynamic"

// Lazy load WhatsApp widget - not critical for initial render
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), {
  loading: () => null
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>        <Toaster />
        <Sonner />
        {children}
        <WhatsAppWidget phoneNumber="918344474556" />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
