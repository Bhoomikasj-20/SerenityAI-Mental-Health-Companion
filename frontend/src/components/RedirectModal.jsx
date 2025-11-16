import { useEffect } from 'react'
import { X, Heart, BookOpen, Wind, Activity } from 'lucide-react'

const RedirectModal = ({ type, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const modals = {
    gratitude: {
      icon: Heart,
      title: 'Gratitude Journal',
      content: (
        <div className="space-y-4">
          <p className="text-wellness-forest/70">
            Take a moment to reflect on what you're grateful for today.
          </p>
          <textarea
            className="w-full h-32 p-4 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none resize-none"
            placeholder="What are you grateful for today?"
          />
          <button className="btn-primary w-full">Save Entry</button>
        </div>
      )
    },
    journal: {
      icon: BookOpen,
      title: 'Emotional Journal',
      content: (
        <div className="space-y-4">
          <p className="text-wellness-forest/70">
            Express your feelings freely. Writing can help process emotions.
          </p>
          <textarea
            className="w-full h-40 p-4 rounded-lg border-2 border-primary-200 focus:border-primary-500 focus:outline-none resize-none"
            placeholder="How are you feeling? What's on your mind?"
          />
          <button className="btn-primary w-full">Save Entry</button>
        </div>
      )
    },
    relaxation: {
      icon: Wind,
      title: 'Relaxation Space',
      content: (
        <div className="space-y-4">
          <p className="text-wellness-forest/70">
            Let's help you relax. Choose an activity:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.location.href = '/wellness-club/meditation'}
              className="card hover:scale-105 transition-all duration-300 text-center"
            >
              <Wind className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <span className="text-sm font-medium">Meditation</span>
            </button>
            <button
              onClick={() => window.location.href = '/wellness-club/games'}
              className="card hover:scale-105 transition-all duration-300 text-center"
            >
              <Activity className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <span className="text-sm font-medium">Stress Relief</span>
            </button>
          </div>
        </div>
      )
    },
    breathing: {
      icon: Activity,
      title: 'Breathing Exercise',
      content: (
        <div className="space-y-4">
          <p className="text-wellness-forest/70">
            Follow the circle. Breathe in as it grows, hold, then breathe out as it shrinks.
          </p>
          <div className="flex items-center justify-center h-48">
            <div className="w-32 h-32 bg-primary-500 rounded-full animate-pulse flex items-center justify-center text-white font-semibold">
              Breathe
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/wellness-club/games'}
            className="btn-primary w-full"
          >
            Try Full Exercise
          </button>
        </div>
      )
    }
  }

  const modal = modals[type]
  if (!modal) return null

  const Icon = modal.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-gentle p-6 max-w-md w-full animate-scale-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-wellness-forest">{modal.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-primary-50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-wellness-forest/60" />
          </button>
        </div>
        {modal.content}
      </div>
    </div>
  )
}

export default RedirectModal

