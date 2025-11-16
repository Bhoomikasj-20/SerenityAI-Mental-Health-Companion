import React, { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'serenity_accessibility'

const defaultState = {
  enabled: false,
}

const AccessibilityContext = createContext({
  enabled: false,
  toggle: () => {},
  setEnabled: (v) => {},
})

export const AccessibilityProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw).enabled
    } catch (e) {
      // ignore
    }
    return defaultState.enabled
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabled }))
    } catch (e) {}
  }, [enabled])

  const toggle = () => setEnabled((v) => !v)

  return (
    <AccessibilityContext.Provider value={{ enabled, toggle, setEnabled }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)

export default AccessibilityContext
