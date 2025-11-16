import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { AuthProvider } from './services/auth'
import { AccessibilityProvider } from './context/AccessibilityContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Insights from './pages/Insights'
import Dashboard from './pages/Dashboard'
import './App.css'
import PeerGroupList from './components/PeerGroupList'
import PeerGroupChat from './components/PeerGroupChat'
import AccessibilityToggle from './components/AccessibilityToggle'
import ChatInterface from './components/ChatInterface'
import { Brain } from 'lucide-react'
import WellnessHub from './pages/WellnessHub'
import WellnessClub from './pages/WellnessClub'
import ZenGarden from './pages/wellness/ZenGarden'
import ColoringBook from './pages/wellness/ColoringBook'
import StressReliefGames from './pages/wellness/StressReliefGames'
import Meditation from './pages/wellness/Meditation'
import CareNetwork from './pages/CareNetwork'
import ContactCounselor from './pages/ContactCounselor'
import { Leaf } from 'lucide-react'

// Sidebar removed — keep header minimal (logo + accessibility toggle)

function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end">
          <div className="max-w-7xl mx-auto p-4">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Link to="/" className="flex items-center space-x-2 group">
                    <Leaf className="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xl font-bold text-wellness-forest">SerenityAI</span>
                  </Link>
                </div>
                <div className="flex items-center">
                  <AccessibilityToggle />
                </div>
              </div>
              <div>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/wellness" element={<WellnessHub />} />
                    <Route path="/wellness-club" element={<WellnessClub />} />
                    <Route path="/wellness-club/zen-garden" element={<ZenGarden />} />
                    <Route path="/wellness-club/coloring" element={<ColoringBook />} />
                    <Route path="/wellness-club/games" element={<StressReliefGames />} />
                    <Route path="/wellness-club/meditation" element={<Meditation />} />
                    <Route path="/care" element={<CareNetwork />} />
                    <Route path="/care/contact" element={<ContactCounselor />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/peer-support" element={<div className="grid grid-cols-3 gap-4"><div className="col-span-3"><PeerGroupList /></div></div>} />
                    <Route path="/peer-support/:id" element={<div className="grid grid-cols-3 gap-4"><div className="col-span-3"><PeerGroupChat /></div></div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
            </div>
          </div>
        </div>
      </Router>
      </AccessibilityProvider>
    </AuthProvider>
  )
}

export default App

