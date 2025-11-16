import { useState } from 'react'
import counselors from '../data/counselors.json'
import BookingModal from '../components/BookingModal'
import { Phone, Mail, Calendar, Heart, Shield } from 'lucide-react'

export default function ContactCounselor() {
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)

  const openBooking = (c) => { setSelected(c); setOpen(true) }

  // Add college counselor as first entry
  const collegeCounselor = {
    id: 0,
    name: 'College Counseling Center',
    specialization: 'General Mental Health & Crisis Support',
    contact: 'counselor@college.edu',
    phone: '(555) 123-4567',
    availability: 'Mon-Fri, 9 AM - 5 PM',
    verified: true,
    priority: true
  }

  const allCounselors = [collegeCounselor, ...counselors]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <Heart className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-float" />
          <h2 className="text-4xl font-bold text-wellness-forest mb-4">Therapist Connect</h2>
          <p className="text-xl text-wellness-forest/70 max-w-2xl mx-auto">
            Connect with professional counselors and therapists. Your wellbeing matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCounselors.map(c => (
            <div 
              key={c.id} 
              className={`card hover:scale-105 transition-all duration-300 ${
                c.priority ? 'border-2 border-primary-500 bg-primary-50' : ''
              }`}
            >
              {c.priority && (
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-700">College Counselor</span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-wellness-forest mb-1">{c.name}</h3>
                  <div className="text-sm text-wellness-forest/70 font-medium">{c.specialization}</div>
                </div>
                {c.verified && (
                  <div className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                    Verified
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-wellness-forest/70">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <a href={`mailto:${c.contact}`} className="hover:text-primary-600 transition-colors">
                    {c.contact}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-wellness-forest/70">
                  <Phone className="w-4 h-4 text-primary-500" />
                  <a href={`tel:${c.phone}`} className="hover:text-primary-600 transition-colors">
                    {c.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-wellness-forest/70">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  <span>{c.availability}</span>
                </div>
              </div>

              <button 
                onClick={() => openBooking(c)} 
                className="w-full btn-primary"
              >
                Book Session
              </button>
            </div>
          ))}
        </div>

        <BookingModal open={open} onClose={()=>setOpen(false)} counselor={selected} />
      </div>
    </div>
  )
}
