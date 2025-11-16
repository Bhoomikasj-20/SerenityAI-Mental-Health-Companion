import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Heart, Brain, Smile } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const [riskData, setRiskData] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [riskResponse, trendsResponse] = await Promise.all([
        axios.get('/api/analytics/risk-prediction', { headers }),
        axios.get('/api/analytics/trends', { headers })
      ])

      setRiskData(riskResponse.data)
      setTrends(trendsResponse.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Assessment Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mental Health Risk Assessment</h3>
        {riskData && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg ${getRiskColor(riskData.risk_level)}`}>
                <span className="font-semibold capitalize">{riskData.risk_level} Risk</span>
              </div>
              <div className="text-sm text-gray-600">
                Confidence: {(riskData.confidence * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {riskData.risk_score === 0 ? 'Low' : riskData.risk_score === 1 ? 'Medium' : 'High'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trends Overview */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Mood Trend</h4>
              {trends.trend === 'improving' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : trends.trend === 'declining' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <Activity className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-800">{trends.average_mood.toFixed(1)}</div>
            <div className="text-sm text-gray-500 mt-2">Average (1-10 scale)</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Stress Level</h4>
              <Brain className="w-5 h-5 text-mental-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{trends.average_stress.toFixed(1)}</div>
            <div className="text-sm text-gray-500 mt-2">Average (1-10 scale)</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">Anxiety Level</h4>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{trends.average_anxiety.toFixed(1)}</div>
            <div className="text-sm text-gray-500 mt-2">Average (1-10 scale)</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">
            Log Mood
          </button>
          <button className="px-4 py-3 bg-mental-50 text-mental-700 rounded-lg hover:bg-mental-100 transition-colors text-sm font-medium">
            Start Chat
          </button>
          <button className="px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
            View Challenges
          </button>
          <button className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium">
            Book Session
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

