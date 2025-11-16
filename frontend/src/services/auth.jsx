import { createContext, useContext, useState, useEffect } from 'react'
import api from './api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isGuest: true,
    isLoading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthState({ isAuthenticated: true, isGuest: false, isLoading: false })
    } else {
      setAuthState({ isAuthenticated: false, isGuest: true, isLoading: false })
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    setAuthState({ isAuthenticated: true, isGuest: false, isLoading: false })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthState({ isAuthenticated: false, isGuest: true, isLoading: false })
  }

  const startGuestSession = () => {
    setAuthState({ isAuthenticated: false, isGuest: true, isLoading: false })
  }

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, startGuestSession, api }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

