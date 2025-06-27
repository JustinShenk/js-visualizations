'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

export default function ActiveInference() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [isRunning, setIsRunning] = useState(true)
  const [time, setTime] = useState(0)
  const [predictionError, setPredictionError] = useState(0.3)
  const [attention, setAttention] = useState(0.5)
  const [learning, setLearning] = useState(0.1)

  // Moving object state
  const [objectPos, setObjectPos] = useState({ x: 100, y: 200 })
  const [objectVel, setObjectVel] = useState({ x: 1, y: 0.5 })
  const [objectShape, setObjectShape] = useState('circle')

  // Prediction state
  const [predictedPos, setPredictedPos] = useState({ x: 100, y: 200 })
  const [confidence, setConfidence] = useState(0.7)

  // Shape hypotheses (world model)
  const [shapeHypotheses, setShapeHypotheses] = useState({
    circle: 0.33,
    square: 0.33,
    triangle: 0.33
  })

  // Sensory data simulation
  const [sensoryData, setSensoryData] = useState({
    visual: { x: 100, y: 200, shape: 'circle' },
    processed: { x: 100, y: 200, shape: 'circle' }
  })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Draw brain regions
    drawBrainRegions(ctx, width, height)
    
    // Draw sensory input
    drawSensoryInput(ctx, width, height)
    
    // Draw predictive model
    drawPredictiveModel(ctx, width, height)
    
    // Draw world model (shape hypotheses)
    drawWorldModel(ctx, width, height)
    
    // Draw prediction error
    drawPredictionError(ctx, width, height)
    
    // Draw information flow
    drawInformationFlow(ctx, width, height)

  }, [objectPos, predictedPos, shapeHypotheses, predictionError, confidence, time])

  const drawBrainRegions = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Visual cortex
    ctx.fillStyle = 'rgba(100, 150, 200, 0.3)'
    ctx.fillRect(20, 20, 180, 100)
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.8)'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, 180, 100)
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.fillText('Visual Cortex', 30, 40)
    ctx.font = '10px Arial'
    ctx.fillText('Sensory Processing', 30, 55)

    // Predictive model area
    ctx.fillStyle = 'rgba(200, 150, 100, 0.3)'
    ctx.fillRect(20, 140, 180, 100)
    ctx.strokeStyle = 'rgba(200, 150, 100, 0.8)'
    ctx.strokeRect(20, 140, 180, 100)
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.fillText('Predictive Model', 30, 160)
    ctx.font = '10px Arial'
    ctx.fillText('Forward Model', 30, 175)

    // World model area
    ctx.fillStyle = 'rgba(150, 200, 100, 0.3)'
    ctx.fillRect(20, 260, 180, 120)
    ctx.strokeStyle = 'rgba(150, 200, 100, 0.8)'
    ctx.strokeRect(20, 260, 180, 120)
    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.fillText('World Model', 30, 280)
    ctx.font = '10px Arial'
    ctx.fillText('Shape Hypotheses', 30, 295)
  }

  const drawSensoryInput = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const eyeX = width - 150
    const eyeY = 100

    // Draw "eye" area
    ctx.fillStyle = 'rgba(50, 50, 100, 0.3)'
    ctx.fillRect(eyeX - 50, eyeY - 50, 200, 200)
    ctx.strokeStyle = 'rgba(150, 150, 255, 0.8)'
    ctx.lineWidth = 2
    ctx.strokeRect(eyeX - 50, eyeY - 50, 200, 200)

    ctx.fillStyle = 'white'
    ctx.font = '14px Arial'
    ctx.fillText('Visual Field', eyeX - 40, eyeY - 30)

    // Draw moving object
    const objX = eyeX + (objectPos.x - 300) * 0.3
    const objY = eyeY + (objectPos.y - 200) * 0.3

    ctx.fillStyle = 'rgba(255, 100, 100, 0.9)'
    if (objectShape === 'circle') {
      ctx.beginPath()
      ctx.arc(objX, objY, 15, 0, Math.PI * 2)
      ctx.fill()
    } else if (objectShape === 'square') {
      ctx.fillRect(objX - 12, objY - 12, 24, 24)
    } else if (objectShape === 'triangle') {
      ctx.beginPath()
      ctx.moveTo(objX, objY - 15)
      ctx.lineTo(objX - 13, objY + 10)
      ctx.lineTo(objX + 13, objY + 10)
      ctx.closePath()
      ctx.fill()
    }

    // Draw predicted position (ghosted)
    const predX = eyeX + (predictedPos.x - 300) * 0.3
    const predY = eyeY + (predictedPos.y - 200) * 0.3
    const alpha = confidence * 0.5

    ctx.fillStyle = `rgba(100, 255, 100, ${alpha})`
    ctx.strokeStyle = `rgba(100, 255, 100, ${alpha + 0.3})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(predX, predY, 18, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(predX, predY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Label
    ctx.fillStyle = 'white'
    ctx.font = '10px Arial'
    ctx.fillText('Actual', objX + 20, objY)
    ctx.fillText('Predicted', predX + 20, predY)
  }

  const drawPredictiveModel = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const modelX = 30
    const modelY = 185

    // Current prediction
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '11px Arial'
    ctx.fillText(`Position: (${Math.round(predictedPos.x)}, ${Math.round(predictedPos.y)})`, modelX, modelY)
    ctx.fillText(`Confidence: ${(confidence * 100).toFixed(0)}%`, modelX, modelY + 15)
    ctx.fillText(`Learning Rate: ${(learning * 100).toFixed(0)}%`, modelX, modelY + 30)

    // Prediction trajectory
    ctx.strokeStyle = 'rgba(200, 200, 100, 0.6)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(modelX + 120, modelY - 10)
    ctx.lineTo(modelX + 160, modelY + 20)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const drawWorldModel = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const modelX = 30
    const modelY = 310
    const barWidth = 40
    const maxBarHeight = 60

    // Shape hypothesis bars
    const shapes = ['circle', 'square', 'triangle']
    const colors = ['rgba(255, 100, 100, 0.8)', 'rgba(100, 255, 100, 0.8)', 'rgba(100, 100, 255, 0.8)']

    shapes.forEach((shape, index) => {
      const x = modelX + index * (barWidth + 10)
      const probability = shapeHypotheses[shape as keyof typeof shapeHypotheses]
      const barHeight = probability * maxBarHeight
      const y = modelY + maxBarHeight - barHeight

      // Bar
      ctx.fillStyle = colors[index]
      ctx.fillRect(x, y, barWidth, barHeight)
      
      // Border - highlight if this is the detected shape
      if (shape === objectShape) {
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.9)'
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)'
        ctx.lineWidth = 1
      }
      ctx.strokeRect(x, y, barWidth, barHeight)

      // Shape icon
      ctx.fillStyle = 'white'
      const iconX = x + barWidth / 2
      const iconY = modelY + maxBarHeight + 15

      if (shape === 'circle') {
        ctx.beginPath()
        ctx.arc(iconX, iconY, 8, 0, Math.PI * 2)
        ctx.fill()
      } else if (shape === 'square') {
        ctx.fillRect(iconX - 8, iconY - 8, 16, 16)
      } else if (shape === 'triangle') {
        ctx.beginPath()
        ctx.moveTo(iconX, iconY - 10)
        ctx.lineTo(iconX - 8, iconY + 6)
        ctx.lineTo(iconX + 8, iconY + 6)
        ctx.closePath()
        ctx.fill()
      }

      // Probability text
      ctx.fillStyle = 'white'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`${(probability * 100).toFixed(0)}%`, iconX, iconY + 25)
    })
    ctx.textAlign = 'left'
  }

  const drawPredictionError = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const errorX = width - 200
    const errorY = 300
    const maxErrorHeight = 80

    // Error bar
    const errorHeight = predictionError * maxErrorHeight
    const y = errorY + maxErrorHeight - errorHeight

    ctx.fillStyle = predictionError > 0.5 ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 255, 100, 0.8)'
    ctx.fillRect(errorX, y, 30, errorHeight)
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 1
    ctx.strokeRect(errorX, errorY, 30, maxErrorHeight)

    // Label
    ctx.fillStyle = 'white'
    ctx.font = '12px Arial'
    ctx.fillText('Prediction Error', errorX - 50, errorY - 10)
    ctx.font = '10px Arial'
    ctx.fillText(`${(predictionError * 100).toFixed(0)}%`, errorX + 35, errorY + maxErrorHeight / 2)

    // Attention spotlight
    if (predictionError > 0.4) {
      const spotlightRadius = 30 + predictionError * 20
      ctx.strokeStyle = `rgba(255, 255, 0, ${predictionError * 0.7})`
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      
      const objX = (width - 150) + (objectPos.x - 300) * 0.3
      const objY = 100 + (objectPos.y - 200) * 0.3
      
      ctx.beginPath()
      ctx.arc(objX, objY, spotlightRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  const drawInformationFlow = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw flow arrows between regions
    const flows = [
      { from: { x: 200, y: 70 }, to: { x: 200, y: 140 }, label: 'sensory data' },
      { from: { x: 200, y: 240 }, to: { x: 200, y: 120 }, label: 'prediction' },
      { from: { x: 200, y: 190 }, to: { x: 200, y: 260 }, label: 'error signal' }
    ]

    flows.forEach((flow, index) => {
      const alpha = 0.5 + 0.3 * Math.sin(time * 0.05 + index)
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.lineWidth = 2
      
      if (index === 1) { // Prediction flow (upward)
        ctx.setLineDash([5, 5])
      } else {
        ctx.setLineDash([])
      }

      // Arrow
      ctx.beginPath()
      ctx.moveTo(flow.from.x, flow.from.y)
      ctx.lineTo(flow.to.x, flow.to.y)
      ctx.stroke()

      // Arrowhead
      const angle = Math.atan2(flow.to.y - flow.from.y, flow.to.x - flow.from.x)
      const headLength = 8
      ctx.beginPath()
      ctx.moveTo(flow.to.x, flow.to.y)
      ctx.lineTo(
        flow.to.x - headLength * Math.cos(angle - Math.PI / 6),
        flow.to.y - headLength * Math.sin(angle - Math.PI / 6)
      )
      ctx.moveTo(flow.to.x, flow.to.y)
      ctx.lineTo(
        flow.to.x - headLength * Math.cos(angle + Math.PI / 6),
        flow.to.y - headLength * Math.sin(angle + Math.PI / 6)
      )
      ctx.stroke()

      // Label
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.font = '9px Arial'
      ctx.fillText(flow.label, flow.from.x + 10, flow.from.y + (flow.to.y - flow.from.y) / 2)
    })
    ctx.setLineDash([])
  }

  const updateSimulation = useCallback(() => {
    if (!isRunning) return

    setTime(t => t + 1)

    // Update object position
    setObjectPos(pos => {
      const newPos = {
        x: pos.x + objectVel.x,
        y: pos.y + objectVel.y
      }

      // Bounce off walls
      if (newPos.x > 600 || newPos.x < 100) {
        setObjectVel(vel => ({ ...vel, x: -vel.x }))
      }
      if (newPos.y > 300 || newPos.y < 100) {
        setObjectVel(vel => ({ ...vel, y: -vel.y }))
      }

      return {
        x: Math.max(100, Math.min(600, newPos.x)),
        y: Math.max(100, Math.min(300, newPos.y))
      }
    })

    // Update prediction (with some lag and noise)
    setPredictedPos(prevPred => {
      const targetX = objectPos.x + objectVel.x * 10 // predict 10 steps ahead
      const targetY = objectPos.y + objectVel.y * 10
      
      return {
        x: prevPred.x + (targetX - prevPred.x) * 0.1 + (Math.random() - 0.5) * 5,
        y: prevPred.y + (targetY - prevPred.y) * 0.1 + (Math.random() - 0.5) * 5
      }
    })

    // Calculate prediction error
    const errorX = Math.abs(objectPos.x - predictedPos.x)
    const errorY = Math.abs(objectPos.y - predictedPos.y)
    const totalError = Math.sqrt(errorX * errorX + errorY * errorY) / 100
    setPredictionError(Math.min(1, totalError))

    // Update confidence based on error
    setConfidence(1 - predictionError * 0.8)

    // Update shape hypotheses based on "detection"
    const currentShape = objectShape
    setShapeHypotheses(prev => {
      const decay = 0.99
      const boost = 0.05
      
      return {
        circle: currentShape === 'circle' ? Math.min(1, prev.circle + boost) : prev.circle * decay,
        square: currentShape === 'square' ? Math.min(1, prev.square + boost) : prev.square * decay,
        triangle: currentShape === 'triangle' ? Math.min(1, prev.triangle + boost) : prev.triangle * decay
      }
    })

    // Occasionally change object shape
    if (Math.random() < 0.002) {
      const shapes = ['circle', 'square', 'triangle']
      setObjectShape(shapes[Math.floor(Math.random() * shapes.length)])
    }

  }, [isRunning, objectPos, objectVel, predictedPos, predictionError, objectShape])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      updateSimulation()
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [draw, updateSimulation])

  const handlePredictionErrorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPredictionError(parseFloat(e.target.value))
  }

  const handleAttentionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttention(parseFloat(e.target.value))
  }

  const handleLearningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLearning(parseFloat(e.target.value))
  }

  const toggleSimulation = () => {
    setIsRunning(!isRunning)
  }

  const resetSimulation = () => {
    setObjectPos({ x: 100, y: 200 })
    setPredictedPos({ x: 100, y: 200 })
    setShapeHypotheses({ circle: 0.33, square: 0.33, triangle: 0.33 })
    setPredictionError(0.3)
    setTime(0)
  }

  return (
    <div className="w-full bg-black text-white p-4" style={{minWidth: '800px'}}>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Active Inference: Predictive Brain</h2>
        <p className="text-sm text-gray-300 mb-4">
          Watch how the brain continuously predicts sensory input and updates its world model when predictions fail.
          The visual system tracks a moving object and builds shape hypotheses through active inference.
        </p>
        
        <div className="flex gap-4 items-center mb-4 flex-wrap">
          <button
            onClick={toggleSimulation}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Reset
          </button>
          
          <div className="flex gap-4 items-center">
            <label className="text-sm">
              Attention: 
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={attention}
                onChange={handleAttentionChange}
                className="ml-2 w-20"
              />
            </label>
            <label className="text-sm">
              Learning: 
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={learning}
                onChange={handleLearningChange}
                className="ml-2 w-20"
              />
            </label>
          </div>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-96 border border-gray-600"
        style={{ background: '#000000', minWidth: '750px' }}
      />
      
      <div className="mt-4 text-xs text-gray-400">
        <p>
          <strong>Active Inference:</strong> The brain minimizes prediction error through perception and action. 
          Visual cortex processes sensory data, predictive model generates expectations, and world model maintains 
          shape hypotheses. When predictions fail, attention increases and learning updates the model.
        </p>
      </div>
    </div>
  )
}