'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useVoice } from './useVoice'
import type {
  Message, WidgetState, PanelMode, LeadData, AISalesAgentProps,
} from './AISalesAgent.types'

type UseAISalesAgentReturn = {
  // State
  isOpen: boolean
  panelMode: PanelMode
  widgetState: WidgetState
  messages: Message[]
  chatInput: string
  showLeadCapture: boolean
  leadSubmitted: boolean
  voice: ReturnType<typeof useVoice>
  // Actions
  openWidget: () => void
  closeWidget: () => void
  setPanelMode: (mode: PanelMode) => void
  setChatInput: (v: string) => void
  handleChatSend: () => void
  handleVoiceResult: (text: string) => void
  handleLeadSubmit: (email: string) => Promise<void>
}

export function useAISalesAgent({
  systemPromptExtra,
  leadCaptureAfter = 3,
  onLeadCaptured,
}: Pick<AISalesAgentProps, 'systemPromptExtra' | 'leadCaptureAfter' | 'onLeadCaptured'>): UseAISalesAgentReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [panelMode, setPanelMode] = useState<PanelMode>('voice')
  const [widgetState, setWidgetState] = useState<WidgetState>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  const sessionId = useRef(crypto.randomUUID())
  const aiReplyCount = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const voice = useVoice()

  const sendMessage = useCallback(async (text: string) => {
    setWidgetState('processing')
    setIsOpen(true) // Open modal when processing starts
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      // Only send the current user message for context-free responses
      const res = await fetch('/api/sales-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          model: panelMode,
          systemPromptExtra,
        }),
        signal: abortRef.current.signal,
      })

      const json = await res.json() as { data?: { reply: string }; error?: string }

      if (!res.ok || json.error) {
        throw new Error(json.error ?? 'Request failed')
      }

      const reply = json.data!.reply
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      }
      // Only keep the latest assistant message
      setMessages([assistantMessage])

      aiReplyCount.current += 1
      if (aiReplyCount.current >= leadCaptureAfter && !leadSubmitted) {
        setShowLeadCapture(true)
      }

      setWidgetState('speaking')
      voice.speak(reply, () => setWidgetState('idle'))
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setWidgetState('error')
      toast.error('Could not reach AI. Please try again.')
      setTimeout(() => setWidgetState('idle'), 2000)
    }
  }, [messages, panelMode, systemPromptExtra, leadCaptureAfter, leadSubmitted, voice])

  const handleChatSend = useCallback(() => {
    const text = chatInput.trim()
    if (!text || widgetState === 'processing') return
    setChatInput('')
    sendMessage(text)
  }, [chatInput, widgetState, sendMessage])

  const handleVoiceResult = useCallback((text: string) => {
    if (text.trim()) sendMessage(text)
  }, [sendMessage])

  const handleLeadSubmit = useCallback(async (email: string) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          sessionId: sessionId.current,
          messageCount: aiReplyCount.current,
          pageUrl: window.location.href,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setLeadSubmitted(true)
      onLeadCaptured?.({
        email,
        sessionId: sessionId.current,
        messageCount: aiReplyCount.current,
        pageUrl: window.location.href,
      })
    } catch {
      toast.error('Could not save your email. Please try again.')
    }
  }, [onLeadCaptured])

  // Abort in-flight request on unmount
  useEffect(() => () => { abortRef.current?.abort() }, [])

  return {
    isOpen,
    panelMode,
    widgetState,
    messages,
    chatInput,
    showLeadCapture,
    leadSubmitted,
    voice,
    openWidget: () => {
      // Only open if there are messages to show
      if (messages.length > 0 || widgetState === 'processing') {
        setIsOpen(true)
      }
    },
    closeWidget: () => { setIsOpen(false); voice.cancelSpeech() },
    setPanelMode,
    setChatInput,
    handleChatSend,
    handleVoiceResult,
    handleLeadSubmit,
  }
}