import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'
import { DEMO_MODE, DEMO_TOKEN, DEMO_MOCKS } from './config/demo'

// Demo mode setup: inject a fake token and mock some axios requests
if (DEMO_MODE) {
  try {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', DEMO_TOKEN)
    }

    // Keep original axios methods
    const _axiosGet = axios.get.bind(axios)
    const _axiosPost = axios.post.bind(axios)

    // Simple mock for GET endpoints defined in DEMO_MOCKS
    axios.get = async (url, config) => {
      const key = url.startsWith('/') ? url : `/${url}`.replace(/^\/\//, '/')
      // try exact match first, then try without query ordering
      if (DEMO_MOCKS[key]) {
        return Promise.resolve({ data: DEMO_MOCKS[key], status: 200 })
      }
      // fallback to original for anything else
      return _axiosGet(url, config)
    }

    // For POST in demo mode, simulate success for challenge completion
    axios.post = async (url, data, config) => {
      if (url.includes('/gamification/challenges/') && url.endsWith('/complete')) {
        return Promise.resolve({ data: { success: true }, status: 200 })
      }
      return _axiosPost(url, data, config)
    }
  } catch (e) {
    console.warn('Demo setup failed:', e)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

