import { useState } from 'react'
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Link } from 'react-router-dom'

const Meditation = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedSound, setSelectedSound] = useState(null)
  const [volume, setVolume] = useState(50)

  const sounds = [
    { id: 1, name: 'Rain', icon: '🌧️' },
    { id: 2, name: 'Forest', icon: '🌲' },
    { id: 3, name: 'Wind', icon: '💨' },
    { id: 4, name: 'Ocean', icon: '🌊' }
  ]

  const guidance = [
    "Find a comfortable position and close your eyes.",
    "Take a deep breath in through your nose...",
    "Hold for a moment...",
    "Slowly exhale through your mouth...",
    "Repeat this cycle, letting your mind settle."
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link to="/wellness-club" className="flex items-center space-x-2 text-wellness-forest hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Wellness Club</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Meditation Area */}
          <div className="lg:col-span-2 card">
            <h1 className="text-3xl font-bold text-wellness-forest mb-4">Meditation Space</h1>
            
            <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl p-12 text-center mb-6">
              <div className="w-48 h-48 bg-primary-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <span className="text-6xl">🧘</span>
              </div>
              <h2 className="text-2xl font-semibold text-wellness-forest mb-4">Mindfulness Session</h2>
              <p className="text-wellness-forest/70 mb-6">
                {guidance[0]}
              </p>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isPlaying ? 'Pause' : 'Start'}</span>
              </button>
            </div>

            {/* Guidance Steps */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-wellness-forest mb-3">Today's Guidance</h3>
              {guidance.map((step, index) => (
                <div key={index} className="bg-primary-50 rounded-lg p-4 border-l-4 border-primary-500">
                  <p className="text-wellness-forest">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ambient Sounds */}
            <div className="card">
              <h3 className="text-lg font-semibold text-wellness-forest mb-4">Ambient Sounds</h3>
              <div className="space-y-3">
                {sounds.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => setSelectedSound(selectedSound === sound.id ? null : sound.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedSound === sound.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-primary-200 bg-white hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{sound.icon}</span>
                        <span className="font-medium text-wellness-forest">{sound.name}</span>
                      </div>
                      {selectedSound === sound.id && (
                        <Volume2 className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Control */}
            {selectedSound && (
              <div className="card">
                <h3 className="text-lg font-semibold text-wellness-forest mb-4">Volume</h3>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2">
                  <VolumeX className="w-4 h-4 text-wellness-forest/60" />
                  <span className="text-sm text-wellness-forest/60">{volume}%</span>
                  <Volume2 className="w-4 h-4 text-wellness-forest/60" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meditation

