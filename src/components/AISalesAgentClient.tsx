'use client'

import dynamic from 'next/dynamic'

const AISalesAgent = dynamic(
  () => import('../../components/AISalesAgent'),
  { ssr: false } // browser-only: SpeechRecognition doesn't exist on server
)

export default function AISalesAgentClient() {
  // Check if widget is enabled
  const isEnabled = process.env.NEXT_PUBLIC_AI_AGENT_ENABLED !== 'false'
  
  if (!isEnabled) return null
  
  return <AISalesAgent />
}