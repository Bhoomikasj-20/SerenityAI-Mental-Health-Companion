import { useState, useEffect } from 'react'
import { Calendar, Clock, User, MessageCircle, ArrowRight } from 'lucide-react'
import axios from 'axios'

const CounselorBooking = () => {
  const [counselors, setCounselors] = useState([])
  const [peerMentors, setPeerMentors] = useState([])
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCareNetwork()
  }, [])

  const fetchCareNetwork = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }

      const [counselorsResponse, mentorsResponse] = await Promise.all([
        axios.get('/api/care/counselors', { headers }),
        axios.get('/api/care/peer-mentors', { headers })
      ])

      setCounselors(counselorsResponse.data)
      setPeerMentors(mentorsResponse.data)
    } catch (error) {
      console.error('Error fetching care network:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/care/appointments/request',
        {
          counselor_id: selectedCounselor,
          preferred_date: selectedDate,
          preferred_time: selectedTime,
          reason: reason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Appointment request submitted successfully!')
      setSelectedCounselor(null)
      setSelectedDate('')
      setSelectedTime('')
      setReason('')
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Error booking appointment. Please try again.')
    }
  }

  const escalateToPeer = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/care/escalate-to-peer',
        { message: 'I need to speak with a peer mentor' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Your request has been escalated to a peer mentor')
    } catch (error) {
      console.error('Error escalating:', error)
    }
  }

  const escalateToCounselor = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/care/escalate-to-counselor',
        { message: 'I need to speak with a professional counselor' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Your request has been escalated to a professional counselor')
    } catch (error) {
      console.error('Error escalating:', error)
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
      {/* Support Tiers Info */}
      <div className="bg-gradient-to-r from-primary-500 to-mental-500 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Hybrid Care Network</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5" />
              <h4 className="font-medium">Tier 1: AI Companion</h4>
            </div>
            <p className="text-sm opacity-90">24/7 instant support</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-5 h-5" />
              <h4 className="font-medium">Tier 2: Peer Mentor</h4>
            </div>
            <p className="text-sm opacity-90">Connect with trained peers</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5" />
              <h4 className="font-medium">Tier 3: Counselor</h4>
            </div>
            <p className="text-sm opacity-90">Professional support</p>
          </div>
        </div>
      </div>

      {/* Quick Escalation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Immediate Support?</h3>
        <div className="flex space-x-4">
          <button
            onClick={escalateToPeer}
            className="flex-1 px-4 py-3 bg-mental-50 text-mental-700 rounded-lg hover:bg-mental-100 transition-colors font-medium"
          >
            Connect with Peer Mentor
          </button>
          <button
            onClick={escalateToCounselor}
            className="flex-1 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium"
          >
            Connect with Counselor
          </button>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Book an Appointment</h3>
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Counselor
            </label>
            <select
              value={selectedCounselor || ''}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Choose a counselor...</option>
              {counselors.map((counselor) => (
                <option key={counselor.id} value={counselor.id}>
                  {counselor.name} - {counselor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Preferred Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Appointment (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Briefly describe what you'd like to discuss..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <span>Request Appointment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Peer Mentors List */}
      {peerMentors.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Peer Mentors</h3>
          <div className="space-y-3">
            {peerMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-mental-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-mental-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{mentor.username}</h4>
                    <p className="text-sm text-gray-600">{mentor.experience_level}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-mental-500 text-white rounded-lg hover:bg-mental-600 transition-colors text-sm">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CounselorBooking

