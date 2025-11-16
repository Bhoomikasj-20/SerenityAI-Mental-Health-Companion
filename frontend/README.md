# Innovaden Frontend

React.js frontend for the Innovaden AI-Driven Digital Mental Health Platform.

## 🚀 Quick Start

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ChatInterface.jsx    # AI Companion chat interface
│   │   ├── Dashboard.jsx        # Dashboard analytics component
│   │   ├── Gamification.jsx     # Wellness hub with challenges
│   │   └── CounselorBooking.jsx # Care network booking
│   ├── pages/               # Page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Main dashboard with navigation
│   │   └── Insights.jsx        # Analytics and insights page
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # Entry point
├── package.json
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🎨 Styling

The project uses **TailwindCSS** for styling with custom color schemes:
- Primary colors (blue theme)
- Mental health colors (purple theme)
- Custom gradients and animations

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:8000` via:
- Axios for HTTP requests
- JWT tokens stored in localStorage for authentication
- API proxy configured in `vite.config.js`

## 📦 Key Features

1. **ChatInterface** - Real-time AI companion chat
2. **Dashboard** - Mental health risk assessment and trends
3. **Gamification** - Challenges, points, leaderboards
4. **CounselorBooking** - Book appointments with counselors/mentors
5. **Insights** - Analytics dashboard with charts and mood logs

## 🛠️ Technologies

- React 18
- React Router DOM
- Vite
- TailwindCSS
- Axios
- Recharts (for analytics charts)
- Lucide React (icons)

## 📝 Environment Variables

Create a `.env` file if needed:

```
VITE_API_URL=http://localhost:8000
```

