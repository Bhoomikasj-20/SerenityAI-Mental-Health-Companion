import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Bot, User, AlertCircle, Phone, Mail } from 'lucide-react'
import api from '../services/api'
import { useAccessibility } from '../context/AccessibilityContext'
import RedirectModal from './RedirectModal'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { enabled: accessibilityEnabled } = useAccessibility()
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const [recognizing, setRecognizing] = useState(false)
  const [redirectModal, setRedirectModal] = useState({ type: null, isOpen: false })
  const navigate = useNavigate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition if available and accessibility enabled
  useEffect(() => {
    if (!accessibilityEnabled) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const r = new SpeechRecognition()
    r.lang = 'en-US'
    r.interimResults = false
    r.maxAlternatives = 1

    r.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('')
      setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript))
    }

    r.onend = () => {
      setRecognizing(false)
      if (inputMessage.trim()) {
        setTimeout(() => sendMessage(), 150)
      }
    }

    recognitionRef.current = r

    return () => {
      try { r.onresult = null; r.onend = null; r.stop && r.stop() } catch (e) {}
      recognitionRef.current = null
    }
  }, [accessibilityEnabled])

  // Load chat history when session ID is available
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!sessionId) return
      
      try {
        const response = await api.get(`/chatbot/history/${sessionId}`)
        if (response.data && response.data.length > 0) {
          const historyMessages = response.data.flatMap((msg) => [
            {
              role: 'user',
              content: msg.message,
              timestamp: new Date(msg.created_at)
            },
            {
              role: 'bot',
              content: msg.response,
              emotion: msg.emotion,
              intent: msg.intent,
              isCrisis: msg.emotion === 'crisis',
              timestamp: new Date(msg.created_at)
            }
          ])
          setMessages(historyMessages)
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }

    loadChatHistory()
  }, [sessionId])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const messageToSend = inputMessage.trim()
    
    const userMessage = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await api.post('/chatbot/chat', {
        message: messageToSend,
        session_id: sessionId
      })
      
      if (response.data && response.data.error) {
        const errorText = response.data.error
        const errorBotMessage = { role: 'bot', content: errorText, isError: true, timestamp: new Date() }
        setMessages(prev => [...prev, errorBotMessage])
        setIsLoading(false)
        return
      }

      const botText = response.data.response || ''
      const redirect = response.data.redirect
      const meta = {
        emotion: response.data.emotion,
        intent: response.data.intent,
        isCrisis: response.data.crisis || false,
        contactPath: response.data.contact_path || null,
        redirect: redirect,
        timestamp: new Date()
      }
      
      // Handle redirect after message is displayed
      if (redirect) {
        setTimeout(() => {
          handleRedirect(redirect)
        }, 1500) // Wait for message to be visible
      }

      setMessages(prev => [...prev, { role: 'bot', content: '', ...meta }])
      let idx = 0
      const speed = 18
      const reveal = () => {
        idx += 1
        setMessages(prev => {
          const copy = [...prev]
          const last = copy[copy.length - 1]
          copy[copy.length - 1] = { ...last, content: botText.slice(0, idx) }
          return copy
        })
        if (idx < botText.length) {
          setTimeout(reveal, speed)
        } else {
          if (accessibilityEnabled && typeof window.speechSynthesis !== 'undefined') {
            try {
              const utter = new SpeechSynthesisUtterance(botText)
              utter.lang = 'en-US'
              window.speechSynthesis.cancel()
              window.speechSynthesis.speak(utter)
            } catch (e) {
              console.warn('TTS failed', e)
            }
          }
          if (!sessionId && response.data.session_id) {
            setSessionId(response.data.session_id)
          }
          setIsLoading(false)
        }
      }
      setTimeout(reveal, 220)
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.slice(0, -1))
      
      let errorMessage = 'Sorry, I encountered an error. Please try again.'
      const serverData = error.response?.data
      if (serverData) {
        if (typeof serverData.response === 'string' && serverData.response.trim().length > 0) {
          errorMessage = serverData.response
        } else if (serverData.detail) {
          errorMessage = serverData.detail
        } else if (serverData.message) {
          errorMessage = serverData.message
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to continue chatting.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again in a moment.'
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your connection and try again.'
      } else if (error.message && error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running.'
      }
      
      const errorBotMessage = {
        role: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorBotMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    const r = recognitionRef.current
    if (!r) return
    try {
      r.start()
      setRecognizing(true)
    } catch (e) {
      console.warn('Speech recognition start failed', e)
    }
  }

  const stopListening = () => {
    const r = recognitionRef.current
    if (!r) return
    try {
      r.stop()
    } catch (e) {}
    setRecognizing(false)
  }

  const handleRedirect = (redirectType) => {
    switch (redirectType) {
      case 'therapist':
        navigate('/care/contact')
        break
      case 'gratitude':
        setRedirectModal({ type: 'gratitude', isOpen: true })
        break
      case 'journal':
        setRedirectModal({ type: 'journal', isOpen: true })
        break
      case 'relaxation':
        setRedirectModal({ type: 'relaxation', isOpen: true })
        break
      case 'breathing':
        setRedirectModal({ type: 'breathing', isOpen: true })
        break
      default:
        break
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background-start via-white to-background-end">
      {/* Chat Header */}
      <div className="bg-white border-b-2 border-primary-100 px-6 py-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-soft">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-wellness-forest">AI Emotional Companion</h2>
            <p className="text-sm text-wellness-forest/60">24/7 Support • Always Here for You</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <Bot className="w-20 h-20 text-primary-400 mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-semibold text-wellness-forest mb-2">Welcome to SerenityAI</h3>
            <p className="text-wellness-forest/60">I'm here to listen and support you. How are you feeling today?</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 animate-scale-up ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-soft ${
                message.role === 'user'
                  ? 'bg-primary-500'
                  : 'bg-primary-200'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-primary-700" />
              )}
            </div>
            <div
              className={`max-w-[70%] rounded-xl px-4 py-3 shadow-soft ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : message.isError
                  ? 'bg-red-50 text-red-800 border-2 border-red-200'
                  : message.isCrisis
                  ? 'bg-yellow-50 text-yellow-900 border-2 border-yellow-300'
                  : 'bg-white text-wellness-forest'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {/* Crisis Alert Section */}
              {message.isCrisis && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <div className="flex items-start space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Immediate Support Available</h4>
                      <p className="text-sm text-red-800 mb-3">
                        Help has been notified. Here are resources available right now:
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-red-200">
                      <p className="font-semibold text-sm text-wellness-forest">College Counselor</p>
                      <p className="text-xs text-wellness-forest/60">Available Mon-Fri, 9 AM - 5 PM</p>
                      <div className="flex space-x-2 mt-2">
                        <a href="tel:+1234567890" className="flex items-center space-x-1 text-primary-600 text-xs">
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <a href="mailto:counselor@college.edu" className="flex items-center space-x-1 text-primary-600 text-xs">
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate('/care/contact')}
                      className="w-full btn-primary text-sm py-2"
                    >
                      View All Therapists
                    </button>
                  </div>
                </div>
              )}
              
              {message.emotion && !message.isError && !message.isCrisis && (
                <span className="text-xs opacity-75 mt-2 block text-wellness-forest/60">
                  Emotion: {message.emotion}
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center shadow-soft">
              <Bot className="w-5 h-5 text-primary-700" />
            </div>
            <div className="bg-white rounded-xl px-4 py-3 shadow-soft">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-primary-100 px-6 py-4 shadow-soft">
        <div className="flex items-center space-x-3">
          {accessibilityEnabled && (
            <button
              onClick={() => (recognizing ? stopListening() : startListening())}
              title={recognizing ? 'Stop listening' : 'Start voice input'}
              className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                recognizing 
                  ? 'bg-red-50 border-red-300 text-red-700' 
                  : 'bg-white border-primary-200 text-primary-600 hover:border-primary-400'
              }`}
            >
              {recognizing ? 'Listening...' : '🎤'}
            </button>
          )}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="input-field flex-1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Redirect Modal */}
      <RedirectModal
        type={redirectModal.type}
        isOpen={redirectModal.isOpen}
        onClose={() => setRedirectModal({ type: null, isOpen: false })}
      />
    </div>
  )
}

export default ChatInterface
