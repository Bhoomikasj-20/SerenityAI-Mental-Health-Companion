// Temporary demo mode config — set to true to enable demo mode
export const DEMO_MODE = true
export const DEMO_TOKEN = 'demo-mode-token'

// Mock data for demo endpoints
export const DEMO_MOCKS = {
  '/api/gamification/points': { points: 350, level: 3 },
  '/api/gamification/challenges': [
    { id: 1, title: 'Morning Mindful Breathing', description: '5 minutes of mindful breathing', points_earned: 10, completed: false },
    { id: 2, title: 'Gratitude Journal', description: 'Write 3 things you\'re grateful for', points_earned: 15, completed: true }
  ],
  '/api/gamification/leaderboard': [
    { rank: 1, username: 'alice', level: 5, points: 1200 },
    { rank: 2, username: 'bob', level: 4, points: 950 },
    { rank: 3, username: 'carol', level: 4, points: 820 }
  ],
  '/api/analytics/mood-logs?limit=30': Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    created_at: new Date(Date.now() - (9 - i) * 24 * 60 * 60 * 1000).toISOString(),
    mood_score: Math.round(5 + Math.sin(i) * 2 + Math.random() * 2),
    stress_level: Math.round(4 + Math.random() * 3),
    anxiety_level: Math.round(3 + Math.random() * 3),
    notes: i % 2 === 0 ? 'Feeling okay' : ''
  })),
  '/api/analytics/trends': { summary: 'Stable', trend: [{ date: '2025-11-01', mood: 6 }] }
}
