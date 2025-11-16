import { useState } from 'react'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

const ColoringBook = () => {
  const [selectedColor, setSelectedColor] = useState('#6FCF97')
  const [filledAreas, setFilledAreas] = useState({})
  
  const colors = [
    '#6FCF97', '#A8E6A1', '#DFFFE2', '#FFB6C1', '#FFD700',
    '#87CEEB', '#DDA0DD', '#F0E68C', '#FFA07A', '#98D8C8'
  ]

  const patterns = [
    { id: 1, name: 'Mandalas', svg: 'M' },
    { id: 2, name: 'Nature', svg: 'N' },
    { id: 3, name: 'Flowers', svg: 'F' }
  ]

  const handleColorFill = (areaId) => {
    setFilledAreas(prev => ({
      ...prev,
      [areaId]: selectedColor
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-start via-white to-background-end py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/wellness-club" className="flex items-center space-x-2 text-wellness-forest hover:text-primary-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Wellness Club</span>
          </Link>
          <button
            onClick={() => setFilledAreas({})}
            className="flex items-center space-x-2 btn-secondary"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <div className="card">
          <h1 className="text-3xl font-bold text-wellness-forest mb-4">Coloring Book</h1>
          <p className="text-wellness-forest/70 mb-6">
            Choose a color and click on areas to fill them. Relax and create something beautiful.
          </p>
          
          {/* Color Palette */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-wellness-forest mb-3">Color Palette</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                    selectedColor === color ? 'border-wellness-forest scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Pattern Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-wellness-forest mb-3">Choose a Pattern</h3>
            <div className="grid grid-cols-3 gap-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="card cursor-pointer hover:scale-105 transition-transform duration-300 text-center"
                >
                  <div className="w-32 h-32 bg-primary-50 rounded-lg mx-auto mb-2 flex items-center justify-center text-4xl">
                    {pattern.svg}
                  </div>
                  <p className="text-wellness-forest font-medium">{pattern.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coloring Area */}
          <div className="bg-primary-50 rounded-xl p-6">
            <div className="bg-white rounded-lg p-8 shadow-soft">
              <p className="text-center text-wellness-forest/60">
                Click on areas below to color them
              </p>
              <div className="mt-6 grid grid-cols-4 gap-4">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => handleColorFill(i)}
                    className="h-20 rounded-lg border-2 border-primary-200 cursor-pointer hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: filledAreas[i] || '#FFFFFF' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColoringBook

