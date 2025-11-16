import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function PeerGroupInfoModal({ group, onClose, onJoin }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!group) return null

  const activeMembers = 120 + (group.id || 0) * 5

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      <div className="relative z-10 w-full max-w-xl mx-4 bg-gradient-to-br from-white to-primary-50 rounded-2xl shadow-2xl p-6 transform transition-transform">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{group.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{activeMembers}+ members</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <div className="mt-4 text-gray-700">
          <p className="text-sm">{group.description}</p>

          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Group rules & guidelines</h4>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Be respectful and kind to others.</li>
              <li>No spam, self-promotion, or solicitation.</li>
              <li>Keep conversations supportive and confidential.</li>
              <li>If you’re in crisis, seek professional help — this group is peer support only.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700">Close</button>
          <button onClick={() => onJoin(group.id)} className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Join Group</button>
        </div>
      </div>
    </div>,
    document.body
  )
}
