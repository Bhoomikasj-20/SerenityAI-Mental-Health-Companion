import { Link } from 'react-router-dom'
import { useAuth } from '../services/auth'
import { Brain, Shield, TrendingUp, Users, ArrowRight, Heart, Sparkles, Leaf, Sun } from 'lucide-react'

const Home = () => {
  const { isGuest, startGuestSession } = useAuth()

  const handleStartAsGuest = () => {
    startGuestSession()
    window.location.href = '/chat'
  }

  const features = [
    {
      icon: Brain,
      title: 'AI Chat Companion',
      description: 'Talk to our AI companion for empathetic, CBT-informed support.',
      link: '/chat',
      color: 'primary-500'
    },
    {
      icon: Users,
      title: 'Peer Support',
      description: 'Join community groups to connect with peers on similar journeys.',
      link: '/peer-support',
      color: 'primary-500'
    },
    {
      icon: TrendingUp,
      title: 'Mood Tracker',
      description: 'Monitor trends and reflect on your wellbeing over time.',
      link: '/insights',
      color: 'primary-500'
    },
    {
      icon: Heart,
      title: 'Wellness Club',
      description: 'Relaxation games, meditation, and mindfulness activities.',
      link: '/wellness-club',
      color: 'primary-500'
    },
    {
      icon: Shield,
      title: 'Therapist Connect',
      description: 'Connect with professional counselors and therapists.',
      link: '/care/contact',
      color: 'primary-500'
    },
    {
      icon: Sparkles,
      title: 'Gamification',
      description: 'Earn points, badges, and track your wellness journey.',
      link: '/wellness',
      color: 'primary-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in">
        <div className="mb-8">
          <Leaf className="w-20 h-20 text-primary-500 mx-auto mb-6 animate-float" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-wellness-forest mb-6">
          Your Zen Space Awaits
        </h1>
        <p className="text-xl text-wellness-forest/70 max-w-3xl mx-auto mb-12 leading-relaxed">
          A calming, nature-inspired platform for your mental wellness journey.
          Find peace, support, and growth in a safe, nurturing environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <button
            onClick={handleStartAsGuest}
            className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 mx-auto sm:mx-0"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            to="/register"
            className="btn-secondary text-lg px-8 py-4 flex items-center justify-center mx-auto sm:mx-0"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-wellness-forest mb-4">
            Explore Your Wellness Tools
          </h2>
          <p className="text-wellness-forest/60 max-w-2xl mx-auto">
            Discover features designed to support your emotional wellness, self-growth, and mindfulness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 zen-spacing">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                to={feature.link}
                className="card group animate-scale-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 bg-${feature.color} bg-opacity-10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 text-${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-wellness-forest mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-wellness-forest/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Why Create Account */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="card max-w-4xl mx-auto text-center">
          <Sun className="w-12 h-12 text-primary-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-wellness-forest mb-8">
            Why Create an Account?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="font-semibold text-wellness-forest mb-2 text-lg">Progress Tracking</h3>
              <p className="text-wellness-forest/60">Save your chat history and mood tracking data securely.</p>
            </div>
            <div>
              <h3 className="font-semibold text-wellness-forest mb-2 text-lg">Personalized Support</h3>
              <p className="text-wellness-forest/60">Get more tailored responses based on your history.</p>
            </div>
            <div>
              <h3 className="font-semibold text-wellness-forest mb-2 text-lg">Community Features</h3>
              <p className="text-wellness-forest/60">Create and moderate peer support groups.</p>
            </div>
          </div>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-medium text-lg"
            >
              <span>Create a free account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
