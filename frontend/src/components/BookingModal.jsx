import { useState } from 'react'
import { X } from 'lucide-react'

export default function BookingModal({ open, onClose, counselor }) {
  const [slot, setSlot] = useState('9:00 AM')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']

  const handleConfirm = () => {
    // Simulate booking
    setSubmitted(true)
    setTimeout(() => {
      // keep modal open briefly to show success, then close
      onClose()
      setSubmitted(false)
      setMessage('')
      setSlot('9:00 AM')
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Book session with</h3>
            <div className="text-sm text-gray-600">{counselor?.name} — {counselor?.specialization}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="text-sm text-gray-600">Preferred time slot</label>
          <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="w-full border rounded p-2">
            {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label className="text-sm text-gray-600">What do you want to discuss?</label>
          <textarea value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full border rounded p-2 h-24" placeholder="Optional message to your counselor" />
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-2 border rounded">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-primary-500 text-white rounded">{submitted ? 'Booked' : 'Confirm Booking'}</button>
        </div>
      </div>
    </div>
  )
}
