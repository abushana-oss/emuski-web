'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export type UseVoiceReturn = {
  isSupported: boolean
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  clearTranscript: () => void
  speak: (text: string, onEnd?: () => void) => void
  cancelSpeech: () => void
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
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
    recognition.onerror = () => setIsListening(false)
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('')
      setTranscript(text)
    }
    recognition.start()
  }, [isSupported])

  const speak = useCallback(
    async (text: string, onEnd?: () => void) => {
      if (prefersReducedMotion || typeof window === 'undefined') {
        onEnd?.()
        return
      }
      
      // Stop anything that's currently playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      window.speechSynthesis?.cancel() // fallback cancel

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (!response.ok) throw new Error('Failed to fetch audio')

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const audio = new Audio(url)
        audioRef.current = audio
        
        audio.onended = () => {
          URL.revokeObjectURL(url)
          onEnd?.()
        }
        
        audio.onerror = () => {
          URL.revokeObjectURL(url)
          onEnd?.()
        }
        
        await audio.play()
      } catch (error) {
        console.error('Text to speech failed:', error)
        // Fallback to browser TTS if ElevenLabs fails
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = 1.05
        utterance.onend = () => onEnd?.()
        window.speechSynthesis.speak(utterance)
      }
    },
    [prefersReducedMotion],
  )

  const cancelSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    window.speechSynthesis?.cancel()
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      window.speechSynthesis?.cancel()
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
  }
}