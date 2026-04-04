'use client'

import React, { useState, useEffect } from 'react'
import { useAISalesAgent } from './useAISalesAgent'
import type { AISalesAgentProps } from './AISalesAgent.types'

export default function AISalesAgent({
  systemPromptExtra,
  buttonLabel = 'ASK AI',
  position = 'bottom-right',
}: AISalesAgentProps) {
  const {
    isOpen,
    panelMode,
    widgetState,
    messages,
    chatInput,
    voice,
    openWidget,
    closeWidget,
    setPanelMode,
    setChatInput,
    handleChatSend,
    handleVoiceResult,
  } = useAISalesAgent({ systemPromptExtra })



  // Handle voice recognition results
  useEffect(() => {
    if (voice.transcript && !voice.isListening) {
      handleVoiceResult(voice.transcript)
      voice.clearTranscript()
    }
  }, [voice.transcript, voice.isListening, handleVoiceResult, voice.clearTranscript])

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4'

  return (
    <>
      <style jsx>{`
        .lh-root {
          position: fixed;
          left: 50%;
          bottom: 20px;
          transform: translateX(-50%);
          z-index: 2147483647;
          font-family: system-ui, -apple-system, sans-serif;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }


        .lh-compact-trigger {
          background: #1a1a1a;
          border-radius: 25px;
          padding: 12px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          border: 2px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lh-compact-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(23, 184, 186, 0.4);
          background: rgba(23, 184, 186, 0.1);
        }

        .lh-trigger-text {
          font-size: 14px;
          color: #17B8BA;
        }
        
        .lh-callout-chip {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .lh-callout-chip:hover {
          transform: translateY(-2px);
        }
        
        .lh-callout-chip img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        
        .lh-answer {
          background: #1a1a1a;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          max-width: 700px;
          width: 95vw;
          margin-bottom: 12px;
          position: relative;
          color: white;
          border: 1px solid #333;
        }
        
        .lh-answer-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #999;
        }
        
        .lh-answer-close:hover {
          color: white;
        }
        
        .lh-answer-close svg {
          width: 16px;
          height: 16px;
        }
        
        .lh-answer-body {
          padding: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .lh-current-message {
          font-size: 16px;
          color: white;
          line-height: 1.5;
          text-align: left;
          width: 100%;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        .lh-lead-fields {
          margin-top: 16px;
        }
        
        .lh-lead-field {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 0;
        }
        
        .lh-lead-field-vertical {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .lh-lead-input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #444;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          background: #2a2a2a;
          color: white;
          transition: border-color 0.2s ease;
          min-width: 0;
          width: 100%;
        }
        
        .lh-lead-input:focus {
          border-color: #17B8BA;
        }
        
        .lh-textarea {
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }
        
        .lh-lead-submit {
          background: linear-gradient(135deg, #17B8BA 0%, #2ACDCF 100%);
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;
          font-size: 14px;
          min-width: 60px;
        }
        
        .lh-lead-submit:hover {
          transform: translateY(-1px);
        }
        
        .lh-step-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .lh-step-buttons {
          display: flex;
          gap: 8px;
          justify-content: space-between;
        }
        
        .lh-step-button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .lh-back-button {
          background: #444;
          color: white;
          flex: 1;
        }
        
        .lh-back-button:hover {
          background: #555;
        }
        
        .lh-next-button {
          background: linear-gradient(135deg, #17B8BA 0%, #2ACDCF 100%);
          color: white;
          flex: 1;
        }
        
        .lh-next-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        
        .lh-next-button:disabled {
          background: #666;
          cursor: not-allowed;
        }
        
        .lh-bar {
          background: #1a1a1a;
          border-radius: 30px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          position: relative;
          min-width: 280px;
          max-width: 360px;
          width: 100%;
          border: 2px solid #333;
        }
        
        .lh-bar:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(23, 184, 186, 0.4);
        }

        .lh-side-toggle {
          background: rgba(23, 184, 186, 0.1);
          border: none;
          border-radius: 50%;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #17B8BA;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .lh-side-toggle:hover {
          background: rgba(23, 184, 186, 0.2);
        }

        .lh-side-toggle.active {
          background: rgba(23, 184, 186, 0.3);
          color: #ffffff;
        }

        .lh-side-toggle svg {
          width: 16px;
          height: 16px;
        }

        .lh-content-area {
          flex: 1;
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
          height: 40px;
        }

        .lh-content-slider {
          display: flex;
          width: 200%;
          transition: transform 0.3s ease;
          height: 100%;
        }

        .lh-content-slider.voice-mode {
          transform: translateX(0%);
        }

        .lh-content-slider.chat-mode {
          transform: translateX(-50%);
        }

        .lh-content-panel {
          width: 50%;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .lh-content-panel .lh-chat-form {
          width: 100%;
        }

        .lh-voice-label {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lh-voice-label-text {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lh-transcript {
          font-size: 12px;
          opacity: 0.8;
          font-style: italic;
        }

        .lh-listening-group {
          display: flex;
          align-items: end;
          gap: 2px;
          height: 20px;
        }

        .lh-wave-bar {
          width: 3px;
          border-radius: 2px;
          animation: wave 1.5s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }

        .lh-red-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .lh-chat-form {
          flex: 1;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding-right: 4px;
          min-width: 245px;
          width: 100%;
        }

        .lh-input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: white;
          padding: 8px 12px;
          min-width: 140px;
          width: 100%;
        }

        .lh-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .lh-send {
          background: rgba(23, 184, 186, 0.1);
          color: #17B8BA;
          border: none;
          padding: 5px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
          width: 26px;
          height: 26px;
          flex-shrink: 0;
        }

        .lh-send:hover {
          background: rgba(23, 184, 186, 0.2);
        }

        .lh-send svg {
          width: 14px;
          height: 14px;
        }

        .lh-voice-send-cancel {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: none;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
          width: 28px;
          height: 28px;
        }

        .lh-voice-send-cancel:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .lh-voice-send-cancel svg {
          width: 14px;
          height: 14px;
        }
        
        .lh-transcript {
          font-size: 12px;
          opacity: 0.8;
          font-style: italic;
        }
        
        .lh-powered-by {
          text-align: center;
          padding: 12px;
          border-top: 1px solid #333;
          font-size: 12px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        
        .lh-loader {
          width: 16px;
          height: 16px;
          border: 2px solid #333;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="lh-root">
        {/* Modal with AI response and interactive bar */}
        {isOpen && (
          <div className="lh-answer" style={{ display: 'block' }}>
            <button 
              type="button" 
              className="lh-answer-close" 
              aria-label="Close answer"
              onClick={closeWidget}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="lh-answer-body">
              {widgetState === 'processing' ? (
                <div className="lh-loader" />
              ) : messages.length > 0 ? (
                <div className="lh-current-message">
                  {(() => {
                    // Strip any leftover markdown characters
                    const raw = messages[messages.length - 1].content
                      .replace(/\*\*/g, '')
                      .replace(/\*/g, '')
                      .replace(/#{1,6}\s/g, '')
                    
                    // Split into lines and detect numbered items
                    const lines = raw.split('\n').filter(l => l.trim() !== '')
                    
                    return lines.map((line, i) => {
                      const numberedMatch = line.match(/^(\d+)\.\s+(.+)/)
                      if (numberedMatch) {
                        return (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            background: 'rgba(23,184,186,0.07)', borderRadius: '8px',
                            padding: '8px 10px', marginBottom: '6px',
                            border: '1px solid rgba(23,184,186,0.18)'
                          }}>
                            <span style={{
                              background: '#17B8BA', color: '#fff', borderRadius: '50%',
                              width: '20px', height: '20px', fontSize: '11px', fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, marginTop: '1px'
                            }}>{numberedMatch[1]}</span>
                            <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#e5e5e5' }}>{numberedMatch[2]}</span>
                          </div>
                        )
                      }
                      return (
                        <p key={i} style={{ margin: '0 0 8px', fontSize: '15px', lineHeight: '1.6', color: '#f0f0f0' }}>
                          {line}
                        </p>
                      )
                    })
                  })()}
                </div>
              ) : (
                <div className="lh-current-message">
                  I could not transcribe that. Please try again.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Interactive bar positioned separately below modal, centered */}
        {isOpen && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', maxWidth: '360px', margin: '12px auto 0' }}>
            <div className="lh-bar">
              {/* Left Side - Voice Toggle */}
              <button 
                type="button" 
                className={`lh-side-toggle ${panelMode === 'voice' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (panelMode !== 'voice') {
                    setPanelMode('voice')
                    voice.stopListening()
                  } else if (voice.isSupported && !voice.isListening) {
                    voice.startListening()
                  }
                }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </button>
              
              {/* Content Area with Swipe Animation */}
              <div className="lh-content-area">
                <div className={`lh-content-slider ${panelMode === 'voice' ? 'voice-mode' : 'chat-mode'}`}>
                  {/* Voice Panel */}
                  <div className="lh-content-panel">
                    <div 
                      className="lh-voice-label"
                      onClick={async (e) => {
                        e.stopPropagation()
                        
                        // First ensure we're in voice mode
                        if (panelMode !== 'voice') {
                          setPanelMode('voice')
                        }
                        
                        // Check if voice is supported
                        if (!voice.isSupported) {
                          alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
                          return
                        }
                        
                        // If AI is currently speaking, stop speech and start listening
                        if (voice.isSpeaking) {
                          voice.stopSpeechAndListen()
                          return
                        }
                        
                        // Check protocol first
                        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                          alert('Voice recognition requires HTTPS. Please access the site via https:// or use localhost for development.')
                          return
                        }
                        
                        // Request microphone access first
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                          stream.getTracks().forEach(track => track.stop())
                          
                          // Start listening if not already listening
                          if (!voice.isListening) {
                            voice.startListening()
                          }
                        } catch (error) {
                          console.error('Microphone access denied:', error)
                          if (error.name === 'NotAllowedError') {
                            // Show detailed instructions for enabling microphone
                            const isChrome = navigator.userAgent.includes('Chrome')
                            const isEdge = navigator.userAgent.includes('Edg')
                            const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
                            
                            let instructions = 'To enable microphone access:\n\n'
                            
                            if (isChrome || isEdge) {
                              instructions += '1. Click the lock/shield icon in the address bar\n'
                              instructions += '2. Click "Site settings" or "Permissions"\n'
                              instructions += '3. Find "Microphone" and change to "Allow"\n'
                              instructions += '4. Refresh the page and try again'
                            } else if (isSafari) {
                              instructions += '1. Safari menu > Settings > Websites\n'
                              instructions += '2. Click "Microphone" in the left sidebar\n'
                              instructions += '3. Find this website and change to "Allow"\n'
                              instructions += '4. Refresh the page and try again'
                            } else {
                              instructions += '1. Click the icon in your address bar\n'
                              instructions += '2. Look for microphone permissions\n'
                              instructions += '3. Change to "Allow"\n'
                              instructions += '4. Refresh the page and try again'
                            }
                            
                            alert(instructions)
                          } else {
                            alert('Microphone access is required for voice recognition. Please allow microphone access and try again.')
                          }
                        }
                      }}
                      style={{ cursor: 'pointer', padding: '4px' }}
                    >
                      <span className="lh-voice-label-text">
                        {voice.isListening ? 'Listening...' : voice.isSpeaking ? 'Tap to interrupt' : 'Tap and Ask AI'}
                      </span>
                      {voice.transcript && (
                        <div className="lh-transcript">"{voice.transcript}"</div>
                      )}
                    </div>

                    {voice.isListening && (
                      <div className="lh-listening-group">
                        <div className="lh-wave-bar" style={{height: '12px', background: '#421b39', animationDelay: '0s'}}></div>
                        <div className="lh-wave-bar" style={{height: '16px', background: '#684961', animationDelay: '0.1s'}}></div>
                        <div className="lh-wave-bar" style={{height: '20px', background: '#d9d1d7', animationDelay: '0.2s'}}></div>
                        <div className="lh-wave-bar" style={{height: '24px', background: '#ffffff', animationDelay: '0.3s'}}></div>
                        <div className="lh-wave-bar" style={{height: '20px', background: '#a6a6a6', animationDelay: '0.4s'}}></div>
                        <div className="lh-wave-bar" style={{height: '16px', background: '#7a7a7a', animationDelay: '0.5s'}}></div>
                        <div className="lh-wave-bar" style={{height: '12px', background: '#575757', animationDelay: '0.6s'}}></div>
                        <div className="lh-wave-bar" style={{height: '8px', background: '#383838', animationDelay: '0.7s'}}></div>
                      </div>
                    )}

                    {voice.isListening && (
                      <button 
                        type="button" 
                        className="lh-voice-send-cancel"
                        onClick={(e) => {
                          e.stopPropagation()
                          voice.stopListening()
                        }}
                        aria-label="Cancel sending voice message"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Chat Panel */}
                  <div className="lh-content-panel">
                    {panelMode === 'chat' && (
                      <div className="lh-chat-form">
                        <input 
                          className="lh-input"
                          type="text" 
                          placeholder="Ask me anything..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                          disabled={widgetState === 'processing'}
                          autoComplete="off"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                          type="button" 
                          className="lh-send"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChatSend()
                          }}
                          disabled={widgetState === 'processing'}
                        >
                          {widgetState === 'processing' ? (
                            <div className="lh-loader" style={{width: '14px', height: '14px'}} />
                          ) : (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Chat Toggle */}
              <button 
                type="button" 
                className={`lh-side-toggle ${panelMode === 'chat' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setPanelMode('chat')
                  voice.stopListening()
                }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Interactive bar when modal is closed */}
        {!isOpen && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', maxWidth: '360px', margin: '12px auto 0' }}>
            <div className="lh-bar">
              {/* Left Side - Voice Toggle */}
              <button 
                type="button" 
                className={`lh-side-toggle ${panelMode === 'voice' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (panelMode !== 'voice') {
                    setPanelMode('voice')
                    voice.stopListening()
                  } else if (voice.isSupported && !voice.isListening) {
                    voice.startListening()
                  }
                }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </button>
              
              {/* Content Area with Swipe Animation */}
              <div className="lh-content-area">
                <div className={`lh-content-slider ${panelMode === 'voice' ? 'voice-mode' : 'chat-mode'}`}>
                  {/* Voice Panel */}
                  <div className="lh-content-panel">
                    <div 
                      className="lh-voice-label"
                      onClick={async (e) => {
                        e.stopPropagation()
                        
                        // First ensure we're in voice mode
                        if (panelMode !== 'voice') {
                          setPanelMode('voice')
                        }
                        
                        // Check if voice is supported
                        if (!voice.isSupported) {
                          alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
                          return
                        }
                        
                        // If AI is currently speaking, stop speech and start listening
                        if (voice.isSpeaking) {
                          voice.stopSpeechAndListen()
                          return
                        }
                        
                        // Check protocol first
                        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                          alert('Voice recognition requires HTTPS. Please access the site via https:// or use localhost for development.')
                          return
                        }
                        
                        // Request microphone access first
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                          stream.getTracks().forEach(track => track.stop())
                          
                          // Start listening if not already listening
                          if (!voice.isListening) {
                            voice.startListening()
                          }
                        } catch (error) {
                          console.error('Microphone access denied:', error)
                          if (error.name === 'NotAllowedError') {
                            // Show detailed instructions for enabling microphone
                            const isChrome = navigator.userAgent.includes('Chrome')
                            const isEdge = navigator.userAgent.includes('Edg')
                            const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
                            
                            let instructions = 'To enable microphone access:\n\n'
                            
                            if (isChrome || isEdge) {
                              instructions += '1. Click the lock/shield icon in the address bar\n'
                              instructions += '2. Click "Site settings" or "Permissions"\n'
                              instructions += '3. Find "Microphone" and change to "Allow"\n'
                              instructions += '4. Refresh the page and try again'
                            } else if (isSafari) {
                              instructions += '1. Safari menu > Settings > Websites\n'
                              instructions += '2. Click "Microphone" in the left sidebar\n'
                              instructions += '3. Find this website and change to "Allow"\n'
                              instructions += '4. Refresh the page and try again'
                            } else {
                              instructions += '1. Click the icon in your address bar\n'
                              instructions += '2. Look for microphone permissions\n'
                              instructions += '3. Change to "Allow"\n'
                              instructions += '4. Refresh the page and try again'
                            }
                            
                            alert(instructions)
                          } else {
                            alert('Microphone access is required for voice recognition. Please allow microphone access and try again.')
                          }
                        }
                      }}
                      style={{ cursor: 'pointer', padding: '4px' }}
                    >
                      <span className="lh-voice-label-text">
                        {voice.isListening ? 'Listening...' : voice.isSpeaking ? 'Tap to interrupt' : 'Tap and Ask AI'}
                      </span>
                      {voice.transcript && (
                        <div className="lh-transcript">"{voice.transcript}"</div>
                      )}
                    </div>

                    {voice.isListening && (
                      <div className="lh-listening-group">
                        <div className="lh-wave-bar" style={{height: '12px', background: '#421b39', animationDelay: '0s'}}></div>
                        <div className="lh-wave-bar" style={{height: '16px', background: '#684961', animationDelay: '0.1s'}}></div>
                        <div className="lh-wave-bar" style={{height: '20px', background: '#d9d1d7', animationDelay: '0.2s'}}></div>
                        <div className="lh-wave-bar" style={{height: '24px', background: '#ffffff', animationDelay: '0.3s'}}></div>
                        <div className="lh-wave-bar" style={{height: '20px', background: '#a6a6a6', animationDelay: '0.4s'}}></div>
                        <div className="lh-wave-bar" style={{height: '16px', background: '#7a7a7a', animationDelay: '0.5s'}}></div>
                        <div className="lh-wave-bar" style={{height: '12px', background: '#575757', animationDelay: '0.6s'}}></div>
                        <div className="lh-wave-bar" style={{height: '8px', background: '#383838', animationDelay: '0.7s'}}></div>
                      </div>
                    )}

                    {voice.isListening && (
                      <button 
                        type="button" 
                        className="lh-voice-send-cancel"
                        onClick={(e) => {
                          e.stopPropagation()
                          voice.stopListening()
                        }}
                        aria-label="Cancel sending voice message"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Chat Panel */}
                  <div className="lh-content-panel">
                    {panelMode === 'chat' && (
                      <div className="lh-chat-form">
                        <input 
                          className="lh-input"
                          type="text" 
                          placeholder="Ask me anything..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                          disabled={widgetState === 'processing'}
                          autoComplete="off"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                          type="button" 
                          className="lh-send"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChatSend()
                          }}
                          disabled={widgetState === 'processing'}
                        >
                          {widgetState === 'processing' ? (
                            <div className="lh-loader" style={{width: '14px', height: '14px'}} />
                          ) : (
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Chat Toggle */}
              <button 
                type="button" 
                className={`lh-side-toggle ${panelMode === 'chat' ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setPanelMode('chat')
                  voice.stopListening()
                }}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}