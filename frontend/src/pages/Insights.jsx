import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity, Calendar } from 'lucide-react'
import axios from 'axios'
import Dashboard from '../components/Dashboard'

// Local storage keys
const STORAGE_KEYS = {
  MOOD_LOGS: 'local_mood_logs',
  DAILY_MOOD: 'daily_mood_entries',
  GRATITUDE: 'gratitude_entries',
  FEELINGS: 'feelings_entries',
  ACTIVITY_INDEX: 'activity_index'
}

const ACTIVITY_SUGGESTIONS = [
  'Take a 5-min walk',
  'Listen to calming music',
  'Write something positive about yourself',
  'Practice 3 deep breaths',
  'Do a 2-minute body scan',
  'Drink a glass of water and stretch',
  'Write down one small goal for today'
]

const Insights = () => {
  const [moodLogs, setMoodLogs] = useState([])
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(true)
  // Local interactive state
  const [dailyMoodEntries, setDailyMoodEntries] = useState([])
  const [gratitudes, setGratitudes] = useState([])
  const [feelings, setFeelings] = useState([])
  const [moodValue, setMoodValue] = useState(6)
  const [gratitudeText, setGratitudeText] = useState('')
  const [feelingsText, setFeelingsText] = useState('')
  const [activity, setActivity] = useState('')

  useEffect(() => {
    fetchInsightsData()
    // load local data
    try {
      const dm = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_MOOD) || '[]')
      const g = JSON.parse(localStorage.getItem(STORAGE_KEYS.GRATITUDE) || '[]')
      const f = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEELINGS) || '[]')
      setDailyMoodEntries(dm)
      setGratitudes(g)
      setFeelings(f)
    } catch (e) {}
    // set activity suggestion based on day
    try {
      const idx = parseInt(localStorage.getItem(STORAGE_KEYS.ACTIVITY_INDEX) || '')
      const today = new Date().toDateString()
      if (!isNaN(idx)) {
        setActivity(ACTIVITY_SUGGESTIONS[idx % ACTIVITY_SUGGESTIONS.length])
      } else {
        const random = Math.floor(Math.random() * ACTIVITY_SUGGESTIONS.length)
        localStorage.setItem(STORAGE_KEYS.ACTIVITY_INDEX, String(random))
        setActivity(ACTIVITY_SUGGESTIONS[random])
      }
    } catch (e) { setActivity(ACTIVITY_SUGGESTIONS[0]) }
  }, [])

  const fetchInsightsData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [logsResponse, trendsResponse] = await Promise.all([
        axios.get('/api/analytics/mood-logs?limit=30', { headers }),
        axios.get('/api/analytics/trends', { headers })
      ])

      setMoodLogs(logsResponse.data)
      setTrends(trendsResponse.data)
    } catch (error) {
      console.error('Error fetching insights data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helpers for local data
  const saveDailyMood = (value) => {
    const entry = { id: `dm_${Date.now()}`, value, date: new Date().toISOString() }
    const updated = [...dailyMoodEntries.filter(e => new Date(e.date).toDateString() !== new Date().toDateString()), entry]
    setDailyMoodEntries(updated)
    localStorage.setItem(STORAGE_KEYS.DAILY_MOOD, JSON.stringify(updated))
  }

  const saveGratitude = (text) => {
    if (!text.trim()) return
    const entry = { id: `g_${Date.now()}`, text, date: new Date().toISOString() }
    const updated = [entry, ...gratitudes].slice(0, 7)
    setGratitudes(updated)
    localStorage.setItem(STORAGE_KEYS.GRATITUDE, JSON.stringify(updated))
    setGratitudeText('')
  }

  const saveFeeling = (text) => {
    if (!text.trim()) return
    const entry = { id: `f_${Date.now()}`, text, date: new Date().toISOString() }
    const updated = [entry, ...feelings]
    setFeelings(updated)
    localStorage.setItem(STORAGE_KEYS.FEELINGS, JSON.stringify(updated))
    setFeelingsText('')
  }


  const prepareChartData = () => {
    return moodLogs
      .reverse()
      .map((log) => ({
        date: new Date(log.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: log.mood_score,
        stress: log.stress_level,
        anxiety: log.anxiety_level
      }))
  }

  // analytics derived values
  const averageMood = useMemo(() => {
    try {
      const arr = (dailyMoodEntries && dailyMoodEntries.length) ? dailyMoodEntries : (moodLogs || []).slice(0,7).map(l=>({value: l.mood_score, date: l.created_at}))
      if (!arr || arr.length === 0) return '—'
      const sum = arr.slice(0,7).reduce((s,a)=>s+(a.value||a.mood_score||0),0)
      return (sum / Math.min(arr.length,7)).toFixed(1)
    } catch (e) { return '—' }
  }, [dailyMoodEntries, moodLogs])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const chartData = prepareChartData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Insights & Analytics</h1>
          <p className="text-gray-600 mt-2">Track your mental health journey over time</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <Dashboard />
        </div>

        {/* Mood Tracking Hub - interactive cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Daily Mood Tracker (large) */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Daily Mood Tracker</h3>
              <div className="text-sm text-gray-500">Log your mood for today</div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{moodValue <= 2 ? '😔' : moodValue <= 4 ? '😕' : moodValue <= 6 ? '😐' : moodValue <= 8 ? '🙂' : '😊'}</div>
                <div className="flex-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodValue}
                    onChange={(e) => setMoodValue(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
                <div className="w-16 text-center">
                  <div className="text-sm text-gray-500">Value</div>
                  <div className="text-xl font-semibold">{moodValue}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-3">
                <button onClick={() => saveDailyMood(moodValue)} className="px-4 py-2 bg-primary-500 text-white rounded-lg">Save Mood</button>
                <button onClick={() => { setMoodValue(6); }} className="px-3 py-2 border rounded text-sm">Reset</button>
              </div>
            </div>

            <div style={{ height: 160 }} className="mt-4">
              {dailyMoodEntries && dailyMoodEntries.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={dailyMoodEntries.slice().reverse().map(d => ({ date: new Date(d.date).toLocaleDateString(), value: d.value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-500">No daily mood entries yet. Save today’s mood to see a trend.</div>
              )}
            </div>
          </div>

          {/* Right column: Analytics, Gratitude, Feelings, Activity */}
          <div className="space-y-6">
            {/* Analytics Summary */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">This Week Summary</h4>
              <div className="text-sm text-gray-600">Average mood: <span className="font-medium">{averageMood}</span></div>
              <div className="text-sm text-gray-600 mt-1">Gratitude entries: <span className="font-medium">{gratitudes.length}</span></div>
              <div className="text-sm text-gray-600 mt-1">Reflective sessions: <span className="font-medium">{feelings.length}</span></div>
            </div>

            {/* Gratitude */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold">💖 Gratitude Journal</h4>
                <div className="text-xs text-gray-400">Last 7 entries</div>
              </div>
              <textarea value={gratitudeText} onChange={(e)=>setGratitudeText(e.target.value)} placeholder="Write one thing you are grateful for today..." className="w-full p-3 border rounded-md h-20" />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">{gratitudes.length} saved</div>
                <button onClick={() => saveGratitude(gratitudeText)} className="px-3 py-1 bg-primary-500 text-white rounded">Save Entry</button>
              </div>
              {gratitudes.length>0 && (
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {gratitudes.map(g=> <li key={g.id} className="bg-gray-50 p-2 rounded">{g.text} <div className="text-xs text-gray-400">{new Date(g.date).toLocaleDateString()}</div></li>)}
                </ul>
              )}
            </div>

            {/* Feelings Journal */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold">💭 Feelings Journal</h4>
                <div className="text-xs text-gray-400">Free write</div>
              </div>
              <textarea value={feelingsText} onChange={(e)=>setFeelingsText(e.target.value)} placeholder="Write how you’re feeling or reflect on your day..." className="w-full p-3 border rounded-md h-24" />
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">Total sessions: {feelings.length}</div>
                <div className="space-x-2">
                  <button onClick={()=> { setFeelingsText('') }} className="px-3 py-1 border rounded">Clear</button>
                  <button onClick={()=> saveFeeling(feelingsText)} className="px-3 py-1 bg-primary-500 text-white rounded">Save</button>
                </div>
              </div>
            </div>

            {/* Activity Suggestion */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold">✨ Activity Suggestion</h4>
                <div className="text-xs text-gray-400">Daily suggestion</div>
              </div>
              <div className="text-sm text-gray-700 mb-3">{activity}</div>
              <div className="flex items-center justify-end">
                <button onClick={() => {
                  const idx = Math.floor(Math.random()*ACTIVITY_SUGGESTIONS.length)
                  localStorage.setItem(STORAGE_KEYS.ACTIVITY_INDEX, String(idx))
                  setActivity(ACTIVITY_SUGGESTIONS[idx])
                }} className="px-3 py-1 border rounded">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Trend Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Mood Trends</h3>
              <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood" stroke="#0ea5e9" strokeWidth={2} name="Mood" />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress" />
                  <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} name="Anxiety" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No mood logs available. Start logging your mood to see trends!
              </div>
            )}
          </div>

          {/* Stress & Anxiety Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Stress & Anxiety Levels</h3>
              <Activity className="w-5 h-5 text-mental-500" />
            </div>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stress" fill="#ef4444" name="Stress Level" />
                  <Bar dataKey="anxiety" fill="#f59e0b" name="Anxiety Level" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Mood Logs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Mood Logs</h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          {moodLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mood
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Anxiety
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {moodLogs.slice(0, 10).map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.mood_score}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.stress_level}/10
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.anxiety_level}/10
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No mood logs found. Start logging your mood to track your journey!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Insights

