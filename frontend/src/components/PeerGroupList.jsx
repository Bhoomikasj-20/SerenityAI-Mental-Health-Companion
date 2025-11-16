import React, { useState } from 'react'
import groups from '../data/peerGroups.json'
import { useNavigate } from 'react-router-dom'
import PeerGroupInfoModal from './PeerGroupInfoModal'

export default function PeerGroupList() {
  const navigate = useNavigate()
  const [infoGroup, setInfoGroup] = useState(null)

  const openInfo = (g) => setInfoGroup(g)
  const closeInfo = () => setInfoGroup(null)
  const joinFromModal = (id) => {
    closeInfo()
    navigate(`/peer-support/${id}`)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Peer Support Groups</h2>
      <p className="text-sm text-gray-500 mb-6">Join a safe, moderated space to connect with peers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {groups.map((g) => (
          <article
            key={g.id}
            className="p-4 rounded-xl shadow-sm bg-gradient-to-br from-white to-primary-50 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800">{g.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{g.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">Participants: <span className="font-medium">{120 + g.id * 5}+</span></div>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/peer-support/${g.id}`)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Join
                </button>
                <button
                  onClick={() => openInfo(g)}
                  className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600"
                >
                  Info
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {infoGroup && (
        <PeerGroupInfoModal group={infoGroup} onClose={closeInfo} onJoin={joinFromModal} />
      )}
    </div>
  )
}
