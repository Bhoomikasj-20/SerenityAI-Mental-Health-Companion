import { Link } from 'react-router-dom'
import { Leaf, Palette, Gamepad2, Wind, Sparkles, Heart } from 'lucide-react'

const WellnessClub = () => {
  const activities = [
    {
      icon: Leaf,
      title: 'Zen Garden',
      description: 'Rake patterns in virtual sand. Find peace through mindful creation.',
      link: '/wellness-club/zen-garden',
      color: 'primary-500',
      gradient: 'from-green-400 to-green-600'
    },
    {
      icon: Palette,
      title: 'Coloring Book',
      description: 'Color mandalas and nature art with calming pastel colors.',
      link: '/wellness-club/coloring',
      color: 'primary-500',
      gradient: 'from-pink-400 to-purple-500'
    },
    {
      icon: Gamepad2,
      title: 'Stress Relief Games',
      description: 'Bubble popper, leaf drift, and breathing exercises.',
      link: '/wellness-club/games',
      color: 'primary-500',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Wind,
      title: 'Meditation Space',
      description: 'Guided meditation with ambient sounds and calming visuals.',
      link: '/wellness-club/meditation',
      color: 'primary-500',
      gradient: 'from-indigo-400 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Heart className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-float" />
          <h1 className="text-4xl sm:text-5xl font-bold text-wellness-forest mb-4">
            Wellness Club
          </h1>
          <p className="text-xl text-wellness-forest/70 max-w-2xl mx-auto">
            Your sanctuary for relaxation, mindfulness, and inner peace.
            Explore activities designed to calm your mind and nurture your wellbeing.
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <Link
                key={index}
                to={activity.link}
                className="card group hover:scale-105 transition-all duration-300 animate-scale-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${activity.gradient} rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-wellness-forest mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-wellness-forest/60 leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="mt-4">
                      <span className="inline-flex items-center space-x-2 text-primary-600 font-medium">
                        <span>Explore</span>
                        <Sparkles className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Daily Mindfulness Card */}
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-wellness-forest mb-1">
                Daily Mindfulness
              </h3>
              <p className="text-wellness-forest/70">
                Take a moment each day to center yourself. Today's focus: Gratitude.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WellnessClub

