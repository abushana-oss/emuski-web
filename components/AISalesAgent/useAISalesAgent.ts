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
  voice: ReturnType<typeof useVoice>
  // Actions
  openWidget: () => void
  closeWidget: () => void
  setPanelMode: (mode: PanelMode) => void
  setChatInput: (v: string) => void
  handleChatSend: () => void
  handleVoiceResult: (text: string) => void
}

export function useAISalesAgent({
  systemPromptExtra,
}: Pick<AISalesAgentProps, 'systemPromptExtra'>): UseAISalesAgentReturn {
  const [isOpen, setIsOpen] = useState(false)
  const [panelMode, setPanelMode] = useState<PanelMode>('chat')
  const [widgetState, setWidgetState] = useState<WidgetState>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  // Removed lead capture - focus on pure sales conversation

  const sessionId = useRef(crypto.randomUUID())
  const aiReplyCount = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const voice = useVoice()

  // No longer collecting personal data - focus purely on EMUSKI sales

  const sendMessage = useCallback(async (text: string) => {
    setWidgetState('processing')
    setIsOpen(true) // Open modal when processing starts
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    // No longer collecting personal data - removed conversation memory

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    try {
      // Send user message for pure sales conversation
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
        const retryAfter = res.headers.get('Retry-After')
        const errorMessage = json.error ?? 'Request failed'
        
        // Handle rate limiting with user-friendly messages
        if (res.status === 429 && retryAfter) {
          const retrySeconds = parseInt(retryAfter, 10)
          const retryMinutes = Math.ceil(retrySeconds / 60)
          throw new Error(
            retryMinutes > 1 
              ? `Too many requests. Please try again in ${retryMinutes} minutes.`
              : `Too many requests. Please try again in ${retrySeconds} seconds.`
          )
        }
        
        throw new Error(errorMessage)
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
      // Removed lead capture - focus on pure sales conversation

      setWidgetState('speaking')
      voice.speak(reply, () => setWidgetState('idle'))
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setWidgetState('error')
      toast.error('Could not reach AI. Please try again.')
      setTimeout(() => setWidgetState('idle'), 2000)
    }
  }, [messages, panelMode, systemPromptExtra, voice])

  const handleChatSend = useCallback(() => {
    const text = chatInput.trim()
    if (!text || widgetState === 'processing') return
    setChatInput('')
    sendMessage(text)
  }, [chatInput, widgetState, sendMessage])

  const handleVoiceResult = useCallback((text: string) => {
    const trimmedText = text.trim()
    if (trimmedText && trimmedText.length >= 2) {
      sendMessage(trimmedText)
    }
  }, [sendMessage])

  // Removed lead submission - pure sales conversation only

  // Abort in-flight request on unmount
  useEffect(() => () => { abortRef.current?.abort() }, [])

  return {
    isOpen,
    panelMode,
    widgetState,
    messages,
    chatInput,
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
  }
}