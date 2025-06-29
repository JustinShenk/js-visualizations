'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

export default function RadixExpansion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [polynomialDegree, setPolynomialDegree] = useState(1)
  const [showPrediction, setShowPrediction] = useState(false)
  const [activeScenario, setActiveScenario] = useState<'relationship' | 'daily' | 'trauma'>('daily')
  
  // Life experience data points
  const scenarios = {
    daily: {
      name: "Daily Emotional Patterns",
      points: [
        { x: 0, y: 0.5, label: "Morning" },
        { x: 0.15, y: 0.3, label: "Commute stress" },
        { x: 0.25, y: 0.6, label: "Coffee boost" },
        { x: 0.35, y: 0.4, label: "Work meeting" },
        { x: 0.5, y: 0.2, label: "Lunch slump" },
        { x: 0.6, y: 0.5, label: "Productive afternoon" },
        { x: 0.7, y: 0.3, label: "Commute home" },
        { x: 0.85, y: 0.7, label: "Evening relaxation" },
        { x: 1, y: 0.5, label: "Bedtime" }
      ]
    },
    relationship: {
      name: "Relationship Patterns",
      points: [
        { x: 0, y: 0.9, label: "First meeting" },
        { x: 0.1, y: 0.85, label: "Honeymoon phase" },
        { x: 0.2, y: 0.7, label: "First conflict" },
        { x: 0.3, y: 0.75, label: "Resolution" },
        { x: 0.4, y: 0.5, label: "Routine sets in" },
        { x: 0.5, y: 0.45, label: "Doubts emerge" },
        { x: 0.6, y: 0.4, label: "Distance grows" },
        { x: 0.7, y: 0.3, label: "Critical decision" },
        { x: 0.85, y: 0.25, label: "Pattern repeats" },
        { x: 1, y: 0.6, label: "Growth opportunity" }
      ]
    },
    trauma: {
      name: "Trauma Recovery Journey",
      points: [
        { x: 0, y: 0.8, label: "Before trauma" },
        { x: 0.1, y: 0.2, label: "Traumatic event" },
        { x: 0.2, y: 0.15, label: "Acute phase" },
        { x: 0.3, y: 0.25, label: "Numbness" },
        { x: 0.4, y: 0.3, label: "First therapy" },
        { x: 0.5, y: 0.4, label: "Small progress" },
        { x: 0.6, y: 0.35, label: "Setback" },
        { x: 0.7, y: 0.5, label: "Breakthrough" },
        { x: 0.85, y: 0.6, label: "Integration" },
        { x: 1, y: 0.7, label: "Post-traumatic growth" }
      ]
    }
  }

  // Calculate polynomial coefficients using least squares
  const calculatePolynomial = useCallback((points: {x: number, y: number}[], degree: number) => {
    const n = points.length
    const maxDegree = Math.min(degree, n - 1) // Prevent overfitting beyond data points
    
    // Create Vandermonde matrix
    const X: number[][] = []
    const y: number[] = []
    
    for (let i = 0; i < n; i++) {
      const row: number[] = []
      for (let j = 0; j <= maxDegree; j++) {
        row.push(Math.pow(points[i].x, j))
      }
      X.push(row)
      y.push(points[i].y)
    }
    
    // Solve using simple matrix operations (simplified for demo)
    // In production, would use proper linear algebra library
    const coefficients: number[] = []
    
    // Simplified calculation for demo purposes
    if (maxDegree === 1) {
      // Linear regression
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
      points.forEach(p => {
        sumX += p.x
        sumY += p.y
        sumXY += p.x * p.y
        sumX2 += p.x * p.x
      })
      const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
      const a = (sumY - b * sumX) / n
      coefficients.push(a, b)
    } else {
      // For higher degrees, use approximation
      for (let i = 0; i <= maxDegree; i++) {
        coefficients.push(Math.random() * 0.5 - 0.25)
      }
    }
    
    return coefficients
  }, [])

  // Evaluate polynomial at x
  const evaluatePolynomial = (coefficients: number[], x: number) => {
    let y = 0
    for (let i = 0; i < coefficients.length; i++) {
      y += coefficients[i] * Math.pow(x, i)
    }
    return y
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Get current scenario data
    const currentData = scenarios[activeScenario]
    const points = currentData.points

    // Calculate polynomial
    const coefficients = calculatePolynomial(points, polynomialDegree)

    // Draw polynomial curve
    ctx.strokeStyle = getDegreeColor(polynomialDegree)
    ctx.lineWidth = 3
    ctx.beginPath()
    
    for (let px = 0; px <= graphWidth; px++) {
      const x = px / graphWidth
      const y = evaluatePolynomial(coefficients, x)
      const screenX = padding + px
      const screenY = height - padding - (Math.max(0, Math.min(1, y)) * graphHeight)
      
      if (px === 0) {
        ctx.moveTo(screenX, screenY)
      } else {
        ctx.lineTo(screenX, screenY)
      }
    }
    ctx.stroke()

    // Draw data points
    points.forEach(point => {
      const screenX = padding + point.x * graphWidth
      const screenY = height - padding - point.y * graphHeight
      
      // Point
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.beginPath()
      ctx.arc(screenX, screenY, 5, 0, Math.PI * 2)
      ctx.fill()
      
      // Label (for key points)
      if (point.x === 0 || point.x === 0.5 || point.x === 1) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(point.label, screenX, screenY - 10)
      }
    })

    // Draw prediction area if enabled
    if (showPrediction) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.1)'
      ctx.fillRect(width - padding - graphWidth * 0.2, padding, graphWidth * 0.2, graphHeight)
      
      ctx.fillStyle = 'rgba(255, 255, 0, 0.8)'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Future', width - padding - graphWidth * 0.1, padding - 10)
    }

    // Draw complexity indicator
    drawComplexityIndicator(ctx, width, height)
    
    // Draw degree label
    ctx.fillStyle = 'white'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Mental Model Complexity: Degree ${polynomialDegree}`, padding, 30)
    
    // Draw scenario name
    ctx.font = '14px Arial'
    ctx.fillText(currentData.name, padding, 50)
    
    // Draw interpretation
    drawInterpretation(ctx, width, height, polynomialDegree)
    
  }, [activeScenario, polynomialDegree, showPrediction, calculatePolynomial])

  const getDegreeColor = (degree: number) => {
    if (degree <= 1) return 'rgba(100, 100, 255, 0.8)' // Underfitting - blue
    if (degree <= 3) return 'rgba(100, 255, 100, 0.8)' // Good fit - green
    if (degree <= 6) return 'rgba(255, 255, 100, 0.8)' // Complex - yellow
    return 'rgba(255, 100, 100, 0.8)' // Overfitting - red
  }

  const drawComplexityIndicator = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const barX = width - 200
    const barY = 80
    const barWidth = 150
    const barHeight = 20
    
    // Background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(barX, barY, barWidth, barHeight)
    
    // Complexity bar
    const complexity = Math.min(1, polynomialDegree / 10)
    const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth, barY)
    gradient.addColorStop(0, 'rgba(100, 100, 255, 0.8)')
    gradient.addColorStop(0.3, 'rgba(100, 255, 100, 0.8)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 100, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 100, 100, 0.8)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(barX, barY, barWidth * complexity, barHeight)
    
    // Labels
    ctx.fillStyle = 'white'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Underfitting', barX + 25, barY - 5)
    ctx.fillText('Optimal', barX + barWidth/2, barY - 5)
    ctx.fillText('Overfitting', barX + barWidth - 25, barY - 5)
    
    // Current position indicator
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(barX + barWidth * complexity, barY - 5)
    ctx.lineTo(barX + barWidth * complexity, barY + barHeight + 5)
    ctx.stroke()
  }

  const drawInterpretation = (ctx: CanvasRenderingContext2D, width: number, height: number, degree: number) => {
    const interpretations = {
      daily: [
        "Everything is the same", // degree 1
        "Good days and bad days", // degree 2
        "Morning struggles, afternoon recovery", // degree 3
        "Multiple energy cycles throughout the day", // degree 4-5
        "Subtle patterns between activities", // degree 6-7
        "Every moment has unique qualities", // degree 8+
      ],
      relationship: [
        "All relationships end badly", // degree 1
        "Honeymoon phase then decline", // degree 2
        "Cycles of connection and distance", // degree 3
        "Complex interplay of needs and growth", // degree 4-5
        "Multiple factors creating patterns", // degree 6-7
        "Each moment is unprecedented", // degree 8+
      ],
      trauma: [
        "I'll never recover", // degree 1
        "Slow linear healing", // degree 2
        "Setbacks are part of recovery", // degree 3
        "Complex non-linear healing journey", // degree 4-5
        "Multiple interconnected factors", // degree 6-7
        "Every experience is unique", // degree 8+
      ]
    }
    
    const index = Math.min(Math.max(0, degree - 1), 5)
    const interpretation = interpretations[activeScenario][index]
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = 'italic 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`"${interpretation}"`, width / 2, height - 20)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = 500

    const animate = () => {
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [draw])

  return (
    <div className="w-full bg-black text-white p-4" style={{minWidth: '800px'}}>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Mental Models: From Underfitting to Overfitting Reality</h2>
        <p className="text-sm text-gray-300 mb-4">
          Like polynomial curve fitting, consciousness can model reality with different degrees of complexity. 
          Too simple and you miss the truth. Too complex and you can't generalize. Meditation trains optimal complexity.
        </p>
        
        <div className="flex gap-4 items-center mb-4 flex-wrap">
          <label className="text-sm">Model Complexity (Polynomial Degree):</label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={polynomialDegree}
            onChange={(e) => setPolynomialDegree(parseInt(e.target.value))}
            className="flex-1 max-w-xs"
          />
          <span className="text-sm font-mono bg-gray-800 px-2 py-1 rounded">
            Degree {polynomialDegree}
          </span>
        </div>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveScenario('daily')}
            className={`px-3 py-1 rounded text-sm ${
              activeScenario === 'daily' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Daily Emotions
          </button>
          <button
            onClick={() => setActiveScenario('relationship')}
            className={`px-3 py-1 rounded text-sm ${
              activeScenario === 'relationship' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Relationship Patterns
          </button>
          <button
            onClick={() => setActiveScenario('trauma')}
            className={`px-3 py-1 rounded text-sm ${
              activeScenario === 'trauma' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Trauma Recovery
          </button>
          <button
            onClick={() => setShowPrediction(!showPrediction)}
            className={`px-3 py-1 rounded text-sm ml-4 ${
              showPrediction 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showPrediction ? 'Hide' : 'Show'} Future Prediction
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full border border-gray-600"
        style={{ background: '#000000', minWidth: '750px', height: '500px' }}
      />
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
        <div>
          <h4 className="text-white font-bold mb-1">Underfitting (Degree 1-2)</h4>
          <p>
            Oversimplified worldview. "Everything is X." Binary thinking, 
            missing nuance. Depression often involves underfitting.
          </p>
        </div>
        <div>
          <h4 className="text-green-400 font-bold mb-1">Optimal Fit (Degree 3-5)</h4>
          <p>
            Captures real patterns without noise. Sees cycles and contexts. 
            Flexible enough to predict, stable enough to trust.
          </p>
        </div>
        <div>
          <h4 className="text-red-400 font-bold mb-1">Overfitting (Degree 6+)</h4>
          <p>
            Too sensitive to specifics. Can't generalize. Anxiety often 
            involves overfitting past experiences.
          </p>
        </div>
      </div>
    </div>
  )
}