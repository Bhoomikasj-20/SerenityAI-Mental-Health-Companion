import { useState, useEffect } from 'react'
import { ArrowLeft, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'

const StressReliefGames = () => {
  const [activeGame, setActiveGame] = useState(null)
  const [bubbles, setBubbles] = useState([])
  const [score, setScore] = useState(0)
  const [breathingPhase, setBreathingPhase] = useState('inhale')

  // Bubble Popper Game
  const BubblePopper = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        setBubbles(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: 0,
          size: Math.random() * 40 + 20
        }])
      }, 500)
      return () => clearInterval(interval)
    }, [])

    const popBubble = (id) => {
      setBubbles(prev => prev.filter(b => b.id !== id))
      setScore(prev => prev + 1)
    }

    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-cyan-100 rounded-xl overflow-hidden">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className="absolute rounded-full bg-white/30 border-2 border-white/50 cursor-pointer hover:scale-110 transition-transform duration-200"
            style={{
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-wellness-forest font-semibold">
          Score: {score}
        </div>
      </div>
    )
  }

  // Breathing Circle
  const BreathingCircle = () => {
    useEffect(() => {
      const interval = setInterval(() => {
        setBreathingPhase(prev => prev === 'inhale' ? 'hold' : prev === 'hold' ? 'exhale' : 'inhale')
      }, 4000)
      return () => clearInterval(interval)
    }, [])

    const size = breathingPhase === 'inhale' ? 200 : breathingPhase === 'hold' ? 220 : 150

    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div
          className="rounded-full bg-primary-500 transition-all duration-4000 flex items-center justify-center text-white font-semibold text-xl shadow-soft"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {breathingPhase === 'inhale' ? 'Breathe In' : breathingPhase === 'hold' ? 'Hold' : 'Breathe Out'}
        </div>
        <p className="mt-6 text-wellness-forest/70 text-center">
          Follow the circle. Breathe in as it grows, hold, then breathe out as it shrinks.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link to="/wellness-club" className="flex items-center space-x-2 text-wellness-forest hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Wellness Club</span>
          </Link>
        </div>

        {!activeGame ? (
          <div className="card">
            <h1 className="text-3xl font-bold text-wellness-forest mb-4">Stress Relief Games</h1>
            <p className="text-wellness-forest/70 mb-6">
              Choose a game to help you relax and unwind.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveGame('bubbles')}
                className="card hover:scale-105 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🫧</span>
                </div>
                <h3 className="text-xl font-semibold text-wellness-forest mb-2">Bubble Popper</h3>
                <p className="text-wellness-forest/60">Pop bubbles to release stress</p>
              </button>

              <button
                onClick={() => setActiveGame('breathing')}
                className="card hover:scale-105 transition-all duration-300 text-center"
              >
                <Wind className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-wellness-forest mb-2">Breathing Circle</h3>
                <p className="text-wellness-forest/60">Guided breathing exercise</p>
              </button>

              <button
                onClick={() => setActiveGame('leaves')}
                className="card hover:scale-105 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🍃</span>
                </div>
                <h3 className="text-xl font-semibold text-wellness-forest mb-2">Leaf Drift</h3>
                <p className="text-wellness-forest/60">Tap falling leaves</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-wellness-forest">
                {activeGame === 'bubbles' ? 'Bubble Popper' : activeGame === 'breathing' ? 'Breathing Circle' : 'Leaf Drift'}
              </h1>
              <button
                onClick={() => {
                  setActiveGame(null)
                  setScore(0)
                  setBubbles([])
                }}
                className="btn-secondary"
              >
                Back
              </button>
            </div>

            {activeGame === 'bubbles' && <BubblePopper />}
            {activeGame === 'breathing' && <BreathingCircle />}
            {activeGame === 'leaves' && (
              <div className="text-center py-20 text-wellness-forest/60">
                Leaf Drift game coming soon...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StressReliefGames

