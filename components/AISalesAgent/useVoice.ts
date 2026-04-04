'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition
    webkitSpeechRecognition?: typeof SpeechRecognition
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

export type UseVoiceReturn = {
  isSupported: boolean
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
  speak: (text: string, onEnd?: () => void) => void
  cancelSpeech: () => void
  isSpeaking: boolean
  stopSpeechAndListen: () => void
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) return
    const SpeechRecognitionAPI =
      window.SpeechRecognition ?? window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => {
      setIsListening(false)
      setTranscript('')
    }
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('')
        .trim()
      
      if (text.length > 0) {
        setTranscript(text)
      }
    }
    recognition.start()
  }, [isSupported])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (prefersReducedMotion || typeof window === 'undefined') {
        onEnd?.()
        return
      }
      
      // Stop any currently playing speech
      window.speechSynthesis?.cancel()
      currentUtteranceRef.current = null
      setIsSpeaking(false)

      // Enhanced browser TTS with natural, human-like settings
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9 // Natural speaking pace
      utterance.pitch = 1.0 // Natural pitch for more human sound
      utterance.volume = 0.95 // Clear but not overwhelming
      
      // Track utterance reference and speaking state
      currentUtteranceRef.current = utterance
      setIsSpeaking(true)
      
      utterance.onstart = () => {
        setIsSpeaking(true)
      }
      
      utterance.onend = () => {
        setIsSpeaking(false)
        currentUtteranceRef.current = null
        onEnd?.()
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
        currentUtteranceRef.current = null
        onEnd?.()
      }
      
      // Wait for voices to load if needed
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices()
        
        // Prioritize natural, high-quality voices
        const naturalVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('zira') ||
           voice.name.toLowerCase().includes('aria') ||
           voice.name.toLowerCase().includes('jenny') ||
           voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('allison') ||
           voice.name.toLowerCase().includes('ava') ||
           voice.name.toLowerCase().includes('serena') ||
           voice.name.toLowerCase().includes('female') ||
           voice.name.toLowerCase().includes('natural'))
        )
        
        if (naturalVoice) {
          utterance.voice = naturalVoice
        }
        
        window.speechSynthesis.speak(utterance)
      }
      
      // Some browsers need time to load voices
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true })
      } else {
        setVoiceAndSpeak()
      }
    },
    [prefersReducedMotion],
  )

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    currentUtteranceRef.current = null
  }, [])

  const stopSpeechAndListen = useCallback(() => {
    // Stop any currently playing speech immediately
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
    currentUtteranceRef.current = null
    
    // Start listening for next user input
    if (isSupported) {
      startListening()
    }
  }, [isSupported, startListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
      currentUtteranceRef.current = null
    }
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript: () => setTranscript(''),
    speak,
    cancelSpeech,
    isSpeaking,
    stopSpeechAndListen,
  }
}