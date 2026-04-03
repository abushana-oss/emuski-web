export type WidgetState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error'
export type PanelMode = 'voice' | 'chat'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type LeadData = {
  email: string
  sessionId: string
  messageCount: number
  pageUrl?: string
}

export type AISalesAgentProps = {
  /** Additional context appended to system prompt (e.g. current page topic) */
  systemPromptExtra?: string
  /** Label on the floating button */
  buttonLabel?: string
  /** Show lead capture after this many AI replies */
  leadCaptureAfter?: number
  /** Widget position */
  position?: 'bottom-right' | 'bottom-left'
  /** Called when a lead is successfully submitted */
  onLeadCaptured?: (lead: LeadData) => void
}