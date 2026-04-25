'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const AISalesAgent = dynamic(
  () => import('../../components/AISalesAgent'),
  { ssr: false, loading: () => null }
)

export default function AISalesAgentClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isEnabled = process.env.NEXT_PUBLIC_AI_AGENT_ENABLED !== 'false'

  if (!isEnabled || !mounted) return null

  return <AISalesAgent />
}