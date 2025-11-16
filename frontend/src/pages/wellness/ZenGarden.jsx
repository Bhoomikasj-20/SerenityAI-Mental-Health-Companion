import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

const ZenGarden = () => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    // Draw sand background
    ctx.fillStyle = '#F5E6D3'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.fillStyle = `rgba(200, 180, 150, ${Math.random() * 0.3})`
      ctx.fillRect(x, y, 2, 2)
    }
  }, [])

  const handleMouseDown = (e) => {
    setIsDrawing(true)
    draw(e)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    draw(e)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const draw = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    
    // Draw rake pattern
    ctx.strokeStyle = '#8B7355'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    
    if (isDrawing) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else {
      ctx.beginPath()
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    
    // Add particles
    for (let i = 0; i < 3; i++) {
      setParticles(prev => [...prev, {
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 30
      }])
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#F5E6D3'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Re-add texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.fillStyle = `rgba(200, 180, 150, ${Math.random() * 0.3})`
      ctx.fillRect(x, y, 2, 2)
    }
  }

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1
        }))
        .filter(p => p.life > 0)
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/wellness-club" className="flex items-center space-x-2 text-wellness-forest hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Wellness Club</span>
          </Link>
          <button
            onClick={clear}
            className="flex items-center space-x-2 btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        <div className="card">
          <h1 className="text-3xl font-bold text-wellness-forest mb-4">Zen Garden</h1>
          <p className="text-wellness-forest/70 mb-6">
            Click and drag to create patterns in the sand. Find peace through mindful creation.
          </p>
          
          <div className="relative bg-primary-50 rounded-xl p-4">
            <canvas
              ref={canvasRef}
              className="w-full h-96 bg-amber-50 rounded-lg cursor-crosshair shadow-soft"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZenGarden

