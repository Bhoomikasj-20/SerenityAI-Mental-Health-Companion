import React from 'react'
import { useAccessibility } from '../context/AccessibilityContext'

export default function AccessibilityToggle() {
  const { enabled, toggle } = useAccessibility()
  return (
    <button
      onClick={toggle}
      style={{
        padding: '6px 10px',
        borderRadius: 6,
        background: enabled ? '#065f46' : '#111827',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-pressed={enabled}
      title="Toggle voice accessibility features (voice-to-text and text-to-speech)"
    >
      Accessibility: {enabled ? 'ON' : 'OFF'}
    </button>
  )
}
