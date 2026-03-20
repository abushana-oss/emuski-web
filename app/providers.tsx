'use client'

import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Analytics } from "@/components/analytics/Analytics"
import { UserEngagementTracker } from "@/components/analytics/UserEngagementTracker"
import { useMixpanelPageTracking } from "@/hooks/useMixpanelPageTracking"
import { AuthProvider } from "@/components/auth/AuthProvider"

// Lazy load WhatsApp widget - not critical for initial render
const WhatsAppWidget = dynamic(() => import("@/components/WhatsAppWidget"), {
  loading: () => null
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  // Track page views in Mixpanel
  useMixpanelPageTracking()

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Analytics />
          <UserEngagementTracker />
          <Toaster />
          <Sonner />
          {children}
          <WhatsAppWidget phoneNumber="918344474556" />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
