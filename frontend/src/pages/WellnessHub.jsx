import { useState } from 'react'

const CARDS = [
  { id: 'relax', title: 'Relaxation Exercises', desc: 'Guided breathing and body scans to calm the nervous system.' },
  { id: 'games', title: 'Mindfulness Games', desc: 'Short interactive exercises that boost attention and presence.' },
  { id: 'challenges', title: 'Daily Challenges', desc: 'Small, achievable wellness tasks to build healthy habits.' },
  { id: 'quotes', title: 'Motivational Quotes', desc: 'A calming quote to inspire and ground you.' }
]

export default function WellnessHub() {
  const [active, setActive] = useState(null)

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Wellness Hub</h2>
        <p className="text-sm text-gray-500">Explore activities and micro-practices to support daily wellbeing.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {CARDS.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition cursor-pointer" onClick={()=>setActive(c.id)}>
            <h3 className="font-medium text-gray-800">{c.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{c.desc}</p>
          </div>
        ))}
      </div>

      <div>
        {active === 'relax' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h4 className="font-semibold">5-min Breathing Exercise</h4>
            <p className="text-sm text-gray-600 mt-2">Follow the 4-4-6 breathing pattern: inhale 4s, hold 4s, exhale 6s. Repeat for 5 minutes.</p>
          </div>
        )}

        {active === 'games' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h4 className="font-semibold">Mindfulness Game: 30s Focus</h4>
            <p className="text-sm text-gray-600 mt-2">Spend 30 seconds noticing five things you can see, four you can touch, three you can hear.</p>
          </div>
        )}

        {active === 'challenges' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h4 className="font-semibold">Today's Challenge</h4>
            <p className="text-sm text-gray-600 mt-2">Write down one thing you did well today. Keep it short and specific.</p>
          </div>
        )}

        {active === 'quotes' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h4 className="font-semibold">Motivational Quote</h4>
            <p className="text-sm text-gray-600 mt-2">"You are allowed to be both a masterpiece and a work in progress." — Unknown</p>
          </div>
        )}
      </div>
    </div>
  )
}
