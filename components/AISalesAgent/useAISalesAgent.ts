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
  handleLeadSubmit: (leadData: { name: string; email: string; company: string; phone: string }) => Promise<void>
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

  // Helper function to extract lead info and update database  
  const updateConversationMemory = useCallback(async (userMessage: string, mode: PanelMode = panelMode) => {
    try {
      // Skip data extraction in voice mode - use forms instead
      if (mode === 'voice') {
        return
      }
      
      // IMPROVED: Better company vs name detection
      const msgLower = userMessage.toLowerCase()
      
      // Get existing memory to determine context
      const memoryResponse = await fetch('/api/conversation-memory?' + new URLSearchParams({ sessionId: sessionId.current }))
      const { data: existingMemory } = await memoryResponse.json()
      
      let nameMatch = null
      let companyMatch = null
      
      // Company indicators - if message contains these, treat as company
      const isCompany = msgLower.includes('company') || 
                       msgLower.includes('corp') || 
                       msgLower.includes('inc') || 
                       msgLower.includes('ltd') ||
                       msgLower.includes('tata') ||  // Known company
                       msgLower.includes('power') ||
                       msgLower.includes('solutions') ||
                       msgLower.includes('systems') ||
                       msgLower.includes('tech') ||
                       msgLower.includes('group')
      
      // Context-aware extraction based on existing memory
      if (existingMemory?.name && !existingMemory?.company && !isCompany) {
        // We have name but no company, so this might be company
        companyMatch = [null, userMessage.trim()]
      } else if (isCompany || (existingMemory?.name && !existingMemory?.company)) {
        // Treat as company
        companyMatch = userMessage.match(/(?:from|at|work\s+at|company\s+is|with)\s+([a-zA-Z0-9\s&.,'-]+?)(?:\.|$|,|\s+and|\s+i|\s+my)/i) ||
                      [null, userMessage.trim()]  // Standalone company
      } else {
        // Treat as name (only if explicit intro or single short word)
        nameMatch = userMessage.match(/(?:i'm|my name is|i am|this is|call me)\s+([a-zA-Z\s]+?)(?:\s+from|\s+at|\s+and|$)/i) ||
                   (userMessage.length < 15 && 
                    /^[a-zA-Z\s]{2,12}$/.test(userMessage.trim()) && 
                    !userMessage.includes(' ') ? [null, userMessage.trim()] : null)  // Single word names only
      }
      const emailMatch = userMessage.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
      const phoneMatch = userMessage.match(/(?:phone|call|reach|contact)\s*(?:me\s*)?(?:at\s*)?([+]?[\d\s\-\(\)]{7,})/i)


      const updates: any = {}
      if (nameMatch) {
        updates.name = nameMatch[1].trim()
      }
      if (companyMatch) {
        updates.company = companyMatch[1].trim()
      }
      if (emailMatch) {
        updates.email = emailMatch[1].trim()
      }
      if (phoneMatch) {
        updates.phone = phoneMatch[1].replace(/\D/g, '')
      }

      // Determine next step based on what we have after this update
      const currentName = updates.name || existingMemory?.name
      const currentCompany = updates.company || existingMemory?.company
      const currentEmail = updates.email || existingMemory?.email
      const currentPhone = updates.phone || existingMemory?.phone
      
      if (currentPhone && currentEmail && currentCompany && currentName) {
        updates.lastStep = 'complete'
      } else if (currentEmail && currentCompany && currentName) {
        updates.lastStep = 'phone'
      } else if (currentCompany && currentName) {
        updates.lastStep = 'email'
      } else if (currentName) {
        updates.lastStep = 'company'
      } else {
        updates.lastStep = 'name'
      }


      if (Object.keys(updates).length > 0) {
        const response = await fetch('/api/conversation-memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionId.current,
            ...updates,
          }),
        })
        const result = await response.json()
      }
    } catch (error) {
      console.error('Error in updateConversationMemory:', error)
    }
  }, [])

  const sendMessage = useCallback(async (text: string) => {
    setWidgetState('processing')
    setIsOpen(true) // Open modal when processing starts
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }

    // Extract and store conversation memory
    await updateConversationMemory(text, panelMode)

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
          sessionId: sessionId.current,
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
    const trimmedText = text.trim()
    if (trimmedText && trimmedText.length >= 2) {
      sendMessage(trimmedText)
    }
  }, [sendMessage])

  const handleLeadSubmit = useCallback(async (leadData: { name: string; email: string; company: string; phone: string }) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          phone: leadData.phone,
          requirements: messages.map(m => m.content).join(' | '),
          sessionId: sessionId.current,
          messageCount: aiReplyCount.current,
          pageUrl: window.location.href,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setLeadSubmitted(true)
      onLeadCaptured?.({
        name: leadData.name,
        email: leadData.email,
        company: leadData.company,
        phone: leadData.phone,
        requirements: messages.map(m => m.content).join(' | '),
        sessionId: sessionId.current,
        messageCount: aiReplyCount.current,
        pageUrl: window.location.href,
      })
    } catch {
      toast.error('Could not save your details. Please try again.')
    }
  }, [onLeadCaptured, messages])

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