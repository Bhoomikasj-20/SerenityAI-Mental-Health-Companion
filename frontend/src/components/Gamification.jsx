import { useState, useEffect } from 'react'
import { Trophy, Award, Target, Star, TrendingUp } from 'lucide-react'
import axios from 'axios'

const Gamification = () => {
  const [wellnessData, setWellnessData] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGamificationData()
  }, [])

  const fetchGamificationData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [pointsResponse, challengesResponse, leaderboardResponse] = await Promise.all([
        axios.get('/api/gamification/points', { headers }),
        axios.get('/api/gamification/challenges', { headers }),
        axios.get('/api/gamification/leaderboard', { headers })
      ])

      setWellnessData(pointsResponse.data)
      setChallenges(challengesResponse.data)
      setLeaderboard(leaderboardResponse.data)
    } catch (error) {
      console.error('Error fetching gamification data:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `/api/gamification/challenges/${challengeId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGamificationData()
    } catch (error) {
      console.error('Error completing challenge:', error)
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
      {/* Wellness Points Card */}
      <div className="bg-gradient-to-br from-primary-500 to-mental-500 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Wellness Journey</h3>
          <Trophy className="w-8 h-8" />
        </div>
        {wellnessData && (
          <div className="space-y-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold">{wellnessData.points}</span>
              <span className="text-lg opacity-90">points</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span className="text-lg">Level {wellnessData.level}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${(wellnessData.points % 100)}%` }}
              ></div>
            </div>
            <p className="text-sm opacity-90">
              {100 - (wellnessData.points % 100)} points until next level
            </p>
          </div>
        )}
      </div>

      {/* Challenges Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Daily Challenges</h3>
          <Target className="w-5 h-5 text-primary-500" />
        </div>
        <div className="space-y-3">
          {challenges.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No challenges available. Check back later!</p>
          ) : (
            challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`border rounded-lg p-4 ${
                  challenge.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                    {challenge.description && (
                      <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-gray-600">
                        {challenge.points_earned || 10} points
                      </span>
                    </div>
                  </div>
                  {!challenge.completed && (
                    <button
                      onClick={() => completeChallenge(challenge.id)}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                    >
                      Complete
                    </button>
                  )}
                  {challenge.completed && (
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Leaderboard</h3>
          <TrendingUp className="w-5 h-5 text-primary-500" />
        </div>
        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No leaderboard data available</p>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.rank}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-700'
                        : index === 2
                        ? 'bg-orange-300 text-orange-900'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {entry.rank}
                  </div>
                  <span className="font-medium text-gray-800">{entry.username}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Level {entry.level}</span>
                  <span className="font-semibold text-primary-600">{entry.points} pts</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Gamification

