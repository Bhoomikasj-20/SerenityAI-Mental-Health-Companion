import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import groups from '../data/peerGroups.json'
import guestStorage from '../services/guestStorage'

export default function PeerGroupChat({ group: propGroup, onClose }) {
  const navigate = useNavigate()
  const params = useParams()
  const groupId = propGroup?.id || Number(params.id)
  const group = propGroup || groups.find(g => g.id === Number(groupId)) || { id: groupId, name: 'Group' }

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [participants] = useState(() => 3 + (group.id || 0))
  const listRef = useRef(null)

  useEffect(() => {
    // Load messages from guestStorage; if empty, seed a welcome message
    let msgs = guestStorage.getPeerMessages(group.id)
    if (!msgs || msgs.length === 0) {
      msgs = [
        { id: `sys_${Date.now()}`, role: 'system', content: `Welcome to ${group.name}. Be kind and supportive.` , timestamp: Date.now() - 1000 * 60},
        { id: `peer_${Date.now()}`, role: 'peer', content: 'Hi everyone — glad to be here!', timestamp: Date.now() - 80000}
      ]
      guestStorage._savePeerMessages(group.id, msgs)
    }
    setMessages(msgs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id])

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const msg = guestStorage.savePeerMessage(group.id, { role: 'user', content: input })
    setMessages(prev => [...prev, msg])
    setInput('')
  }

  const handleLeave = () => {
    // option: remove guest messages for this session
    navigate('/peer-support')
  }

  return (
    <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl shadow p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold">{group.name}</h3>
          <div className="text-sm text-gray-500">{group.description}</div>
        </div>
        <div className="text-sm text-gray-600">Participants: <span className="font-medium">{participants}</span></div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 mb-4" style={{ minHeight: 260 }}>
        {messages.map((m) => (
          <div key={m.id} className={`mb-3 max-w-[75%] ${m.role === 'user' ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-4 py-2 rounded-lg ${m.role === 'user' ? 'bg-primary-500 text-white' : m.role === 'system' ? 'bg-gray-100 text-gray-700 italic' : 'bg-white text-gray-800 shadow-sm'}`}>
              {m.content}
            </div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={listRef} />
      </div>

      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share something supportive or ask a question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
          />
          <button onClick={handleSend} className="px-4 py-2 bg-primary-500 text-white rounded-lg">Send</button>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="space-x-2">
            <button onClick={() => navigate('/peer-support')} className="text-sm text-primary-600 underline">Back to Groups</button>
            <Link to="/peer-support" className="text-sm text-gray-500">Browse groups</Link>
          </div>
          <div>
            <button onClick={handleLeave} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded">Leave Group</button>
          </div>
        </div>
      </div>
    </div>
  )
}
