import { NavLink, useLocation } from 'react-router-dom'
import { Home, Heart, Users, BarChart2, MessageSquare } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/wellness', label: 'Wellness Hub', icon: Heart },
  { to: '/care', label: 'Care Network', icon: Users },
  { to: '/insights', label: 'Insights', icon: BarChart2 },
  { to: '/chat', label: 'AI Companion', icon: MessageSquare }
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 hidden md:block">
      <div className="sticky top-6">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">SerenityAI</h2>
            <p className="text-sm text-gray-500">Wellness made simple</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-md text-sm ${isActive || location.pathname.startsWith(item.to) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
