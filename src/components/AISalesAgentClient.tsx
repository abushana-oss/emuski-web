'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'

const AISalesAgent = dynamic(
  () => import('../../components/AISalesAgent'),
  { ssr: false, loading: () => null }
)

export default function AISalesAgentClient() {
  const [mounted, setMounted] = useState(false)
  const [heroPassed, setHeroPassed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (pathname !== '/') return

    const hero = document.querySelector('section')
    if (!hero) { setHeroPassed(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroPassed(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname, mounted])

  const isEnabled = process.env.NEXT_PUBLIC_AI_AGENT_ENABLED !== 'false'

  if (!isEnabled || !mounted) return null
  if (pathname === '/' && !heroPassed) return null

  return <AISalesAgent />
}