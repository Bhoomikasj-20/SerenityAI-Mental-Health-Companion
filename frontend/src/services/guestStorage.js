/**
 * Guest mode storage service for SerenityAI
 * Handles local persistence of guest user data and seamless sync when logged in
 */

const STORAGE_KEYS = {
  CHAT_SESSIONS: 'guest_chat_sessions',
  MOOD_LOGS: 'guest_mood_logs',
  WELLNESS_POINTS: 'guest_wellness_points',
  PEER_MESSAGES: 'guest_peer_messages',
  USER_PREFERENCES: 'guest_preferences',
}

const GUEST_ID = 'guest_' + Math.random().toString(36).substr(2, 9)

class GuestStorage {
  constructor() {
    // Initialize guest ID if not exists
    this.guestId = localStorage.getItem('guest_id') || GUEST_ID
    localStorage.setItem('guest_id', this.guestId)
  }

  // Chat Sessions
  saveChatSession(session) {
    const sessions = this.getChatSessions()
    sessions.push({
      ...session,
      id: session.id || `guest_${Date.now()}`,
      timestamp: Date.now()
    })
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions))
    return session
  }

  getChatSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS) || '[]')
  }

  // Mood & Analytics
  saveMoodLog(log) {
    const logs = this.getMoodLogs()
    logs.push({
      ...log,
      id: `guest_${Date.now()}`,
      timestamp: Date.now()
    })
    localStorage.setItem(STORAGE_KEYS.MOOD_LOGS, JSON.stringify(logs))
    return log
  }

  getMoodLogs() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MOOD_LOGS) || '[]')
  }

  // Wellness & Gamification
  saveWellnessPoints(points) {
    localStorage.setItem(STORAGE_KEYS.WELLNESS_POINTS, JSON.stringify({
      points,
      lastUpdated: Date.now()
    }))
  }

  getWellnessPoints() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WELLNESS_POINTS) || '{"points": 0}')
  }

  // Peer Group Messages
  savePeerMessage(groupId, message) {
    const messages = this.getPeerMessages(groupId)
    const newMessage = {
      ...message,
      id: `guest_${Date.now()}`,
      timestamp: Date.now(),
      groupId
    }
    messages.push(newMessage)
    this._savePeerMessages(groupId, messages)
    return newMessage
  }

  getPeerMessages(groupId) {
    const key = `${STORAGE_KEYS.PEER_MESSAGES}_${groupId}`
    return JSON.parse(localStorage.getItem(key) || '[]')
  }

  _savePeerMessages(groupId, messages) {
    const key = `${STORAGE_KEYS.PEER_MESSAGES}_${groupId}`
    localStorage.setItem(key, JSON.stringify(messages))
  }

  // User Preferences
  savePreferences(prefs) {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs))
  }

  getPreferences() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || '{}')
  }

  // Sync helpers
  async syncWithServer(api, userId) {
    try {
      // Sync chat sessions
      const chatSessions = this.getChatSessions()
      if (chatSessions.length > 0) {
        await api.post('/chatbot/sync', { sessions: chatSessions, userId })
      }

      // Sync mood logs
      const moodLogs = this.getMoodLogs()
      if (moodLogs.length > 0) {
        await api.post('/analytics/sync', { logs: moodLogs, userId })
      }

      // Clear local storage after successful sync
      this.clearAll()
      
      return { success: true }
    } catch (error) {
      console.error('Error syncing guest data:', error)
      return { success: false, error }
    }
  }

  // Utility methods
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  isGuest() {
    return !localStorage.getItem('token')
  }
}

export const guestStorage = new GuestStorage()
export default guestStorage