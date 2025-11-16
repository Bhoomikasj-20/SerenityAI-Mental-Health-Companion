import axios from 'axios'
import { DEMO_MODE, DEMO_TOKEN } from '../config/demo'
import guestStorage from './guestStorage'

// Determine API base URL
// If VITE_API_URL is set, use it directly
// Otherwise, use relative URL to work with Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Guest mode endpoint handlers
const guestHandlers = {
  '/chatbot/message': async (config) => {
    const session = guestStorage.saveChatSession({
      messages: [config.data],
      timestamp: Date.now()
    })
    return {
      data: { success: true, session },
      status: 200
    }
  },
  '/chatbot/chat': async (config) => {
    // Simple guest-mode chatbot: lightweight intent detection and canned responses
    const msg = (config.data?.message || '').toLowerCase()
    const sessionId = config.data?.session_id || null

    const intents = {
      stress: ['stress', 'stressed', 'overwhelmed', 'pressure', 'worried', 'tense'],
      anxiety: ['anxious', 'anxiety', 'nervous', 'panic', 'worried'],
      depression: ['depressed', 'sad', 'down', 'hopeless', 'empty'],
      motivation: ['motivate', 'motivation', 'encourage', 'inspire', 'goal'],
      sleep: ['sleep', 'insomnia', 'tired', 'exhausted'],
      relationships: ['friend', 'relationship', 'lonely', 'isolated'],
      academic: ['study', 'exam', 'homework', 'assignment', 'grade']
    }

    const templates = {
      stress: [
        "I understand you're feeling stressed. Can you tell me what's causing the stress?",
      ],
      anxiety: [
        "I hear you're feeling anxious. Would you like a short grounding exercise?",
      ],
      depression: [
        "I'm sorry you're feeling down. What's one small thing that might help you today?",
      ],
      motivation: [
        "Let's find a small step to get you moving. What's one tiny goal you can try today?",
      ],
      sleep: [
        "Sleep problems can be frustrating. What's your usual bedtime routine?",
      ],
      relationships: [
        "Relationships can be hard. What would you like to talk about regarding your relationships?",
      ],
      academic: [
        "Academic pressure is tough. Which class or task is causing the most stress?",
      ],
      general: [
        "I'm here to listen. How are you feeling today?"
      ]
    }

    // detect intent
    let detected = 'general'
    for (const [intent, keys] of Object.entries(intents)) {
      if (keys.some(k => msg.includes(k))) {
        detected = intent
        break
      }
    }

    const responseText = templates[detected]?.[0] || templates.general[0]

    // simple coping strategy mapping
    const copingMap = {
      stress: 'Try a short 4-4-6 breathing exercise: inhale 4, hold 4, exhale 6.',
      anxiety: 'Naming 5 things you see can help ground you right now.',
      depression: 'Try a 5-minute activity you used to enjoy, even if small.'
    }

    const coping = copingMap[detected] || null

    // Save to guest storage
    const saved = guestStorage.saveChatSession({
      messages: [
        { role: 'user', content: config.data?.message, timestamp: Date.now() },
        { role: 'bot', content: responseText, timestamp: Date.now(), intent: detected, coping_strategy: coping }
      ],
      timestamp: Date.now(),
      sessionId: sessionId
    })

    return {
      data: {
        response: coping ? `${responseText}\n\nHere's a suggestion: ${coping}` : responseText,
        session_id: saved?.sessionId || sessionId || `guest_${Date.now()}`,
        intent: detected,
        emotion: 'neutral',
        sentiment: 'NEUTRAL',
        coping_strategy: coping
      },
      status: 200
    }
  },
  '/analytics/mood': async (config) => {
    const log = guestStorage.saveMoodLog(config.data)
    return {
      data: { success: true, log },
      status: 200
    }
  },
  '/peer/message': async (config) => {
    const { groupId, message } = config.data
    const savedMessage = guestStorage.savePeerMessage(groupId, message)
    return {
      data: { success: true, message: savedMessage },
      status: 200
    }
  },
  '/gamification/points': async (config) => {
    const current = guestStorage.getWellnessPoints()
    const points = current.points + (config.data.points || 0)
    guestStorage.saveWellnessPoints(points)
    return {
      data: { success: true, points },
      status: 200
    }
  }
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})
// increase timeout to 20s to allow server processing
api.defaults.timeout = 20000

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check for guest mode handler first
    if (!localStorage.getItem('token') && guestHandlers[config.url]) {
      const guestHandler = guestHandlers[config.url]
      return guestHandler(config).then(response => {
        throw { isGuest: true, response }
      })
    }

    let token = localStorage.getItem('token') || localStorage.getItem('access_token')
    // Demo mode: inject demo token if missing
    if (DEMO_MODE && !token) {
      token = DEMO_TOKEN
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Debug log in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        hasToken: !!token,
        isGuest: !token
      })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Debug log in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    return response
  },
  (error) => {
    // Handle guest mode responses
    if (error.isGuest && error.response) {
      return error.response
    }

    // Debug log errors in development
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
    }
    
    if (error.response?.status === 401) {
      // Unauthorized - switch to guest mode
      localStorage.removeItem('token')
      if (guestHandlers[error.config.url]) {
        // If there's a guest handler for this endpoint, retry as guest
        return guestHandlers[error.config.url](error.config)
      } else if (DEMO_MODE) {
        // Demo mode fallback
        return Promise.resolve({ data: null, status: 200 })
      }
    }
    return Promise.reject(error)
  }
)

// GET handlers for guest mode
const guestGetHandlers = {
  '/chatbot/sessions': async () => ({
    data: { sessions: guestStorage.getChatSessions() },
    status: 200
  }),
  '/analytics/mood-logs': async () => ({
    data: { logs: guestStorage.getMoodLogs() },
    status: 200
  }),
  '/peer/messages': async (config) => {
    const groupId = config.params?.groupId
    if (groupId) {
      return {
        data: { messages: guestStorage.getPeerMessages(groupId) },
        status: 200
      }
    }
    return { data: { messages: [] }, status: 200 }
  },
  '/gamification/points': async () => ({
    data: guestStorage.getWellnessPoints(),
    status: 200
  }),
  '/user/preferences': async () => ({
    data: guestStorage.getPreferences(),
    status: 200
  })
}

// Extend the request interceptor to handle GET requests in guest mode
const originalRequestInterceptor = api.interceptors.request.handlers[0]
api.interceptors.request.handlers[0] = {
  ...originalRequestInterceptor,
  fulfilled: async (config) => {
    // For GET requests in guest mode, check for handlers
    if (config.method === 'get' && !localStorage.getItem('token') && guestGetHandlers[config.url]) {
      const guestHandler = guestGetHandlers[config.url]
      return guestHandler(config).then(response => {
        throw { isGuest: true, response }
      })
    }
    return originalRequestInterceptor.fulfilled(config)
  }
}

// Combine API and guestStorage exports
const apiService = {
  ...api,
  guestStorage,
  isGuest: () => !localStorage.getItem('token'),
  async syncGuestData(userId) {
    if (guestStorage.isGuest()) {
      return false // Not logged in, can't sync
    }
    return guestStorage.syncWithServer(api, userId)
  }
}

export default apiService
