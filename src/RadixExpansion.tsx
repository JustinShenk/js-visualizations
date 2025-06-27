'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

export default function RadixExpansion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [meditationLevel, setMeditationLevel] = useState(0)
  const [currentJhana, setCurrentJhana] = useState(0)
  const [compressionLevel, setCompressionLevel] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)

  // Jhana states with therapeutic descriptions
  const jhanaStates = [
    {
      name: "Baseline Consciousness",
      description: "Default processing: scattered attention, reactive patterns",
      therapeuticNote: "High cognitive load, emotional reactivity",
      color: "rgba(100, 100, 100, 0.6)",
      capacity: 1
    },
    {
      name: "First Jhana",
      description: "Sustained attention with some discursive thinking",
      therapeuticNote: "Reduced anxiety, increased focus",
      color: "rgba(120, 180, 120, 0.7)",
      capacity: 2
    },
    {
      name: "Second Jhana",
      description: "Unified attention, minimal mental chatter",
      therapeuticNote: "Emotional regulation, mental clarity",
      color: "rgba(150, 200, 150, 0.8)",
      capacity: 4
    },
    {
      name: "Third Jhana",
      description: "Equanimous joy, refined awareness",
      therapeuticNote: "Stable wellbeing, reduced rumination",
      color: "rgba(180, 220, 180, 0.8)",
      capacity: 8
    },
    {
      name: "Fourth Jhana",
      description: "Perfect equanimity, spacious awareness",
      therapeuticNote: "Meta-cognitive insight, psychological flexibility",
      color: "rgba(200, 240, 200, 0.9)",
      capacity: 16
    },
    {
      name: "Formless Absorptions",
      description: "Beyond ordinary conceptual boundaries",
      therapeuticNote: "Transpersonal perspective, ego-flexibility",
      color: "rgba(220, 250, 220, 0.9)",
      capacity: 32
    }
  ]

  // Information processing examples
  const processingExamples = [
    { level: 1, example: "Reactive thoughts", detail: "Scattered, reactive processing" },
    { level: 2, example: "Focused attention", detail: "Can maintain single-pointed focus" },
    { level: 4, example: "Pattern recognition", detail: "Sees connections between experiences" },
    { level: 8, example: "Meta-cognitive awareness", detail: "Observes own thinking patterns" },
    { level: 16, example: "Systems perspective", detail: "Understands interconnected wholes" },
    { level: 32, example: "Non-dual awareness", detail: "Transcends subject-object duality" }
  ]

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

    // Calculate current jhana and compression based on meditation level
    const targetJhana = Math.min(5, Math.floor(meditationLevel * 6))
    const targetCompression = Math.pow(2, targetJhana)
    
    if (currentJhana !== targetJhana) {
      setCurrentJhana(targetJhana)
    }
    if (compressionLevel !== targetCompression) {
      setCompressionLevel(targetCompression)
    }

    // Draw meditation practice visualization
    drawMeditationPractice(ctx, width, height)
    
    // Draw jhana progression
    drawJhanaProgression(ctx, width, height, currentJhana)
    
    // Draw information compression capacity
    drawCompressionCapacity(ctx, width, height, compressionLevel)
    
    // Draw therapeutic insights
    drawTherapeuticInsights(ctx, width, height, currentJhana)

  }, [meditationLevel, currentJhana, compressionLevel])

  const drawMeditationPractice = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width * 0.2
    const centerY = height * 0.3
    const radius = 40

    // Draw meditator with breathing animation
    const breathPhase = Math.sin(Date.now() * 0.002) * 0.15
    const currentState = jhanaStates[currentJhana] || jhanaStates[0]
    
    ctx.fillStyle = currentState.color
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * (1 + breathPhase * 0.5), 0, Math.PI * 2)
    ctx.fill()

    // Draw awareness field (expanding with jhana level)
    const awarenessRadius = radius + 20 + (currentJhana * 15)
    ctx.strokeStyle = currentState.color
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(centerX, centerY, awarenessRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw state label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(currentState.name, centerX, centerY + radius + 50)
    
    ctx.font = '11px Arial'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(currentState.description, centerX, centerY + radius + 70)
    ctx.textAlign = 'left'

    // Meditation depth indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '12px Arial'
    ctx.fillText(`Depth: ${Math.round(meditationLevel * 100)}%`, centerX - 40, centerY + radius + 90)
  }

  const drawJhanaProgression = (ctx: CanvasRenderingContext2D, width: number, height: number, currentJhana: number) => {
    const startX = width * 0.45
    const startY = height * 0.15
    const stateHeight = 35
    const stateWidth = width * 0.25

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('Meditative States & Processing Capacity', startX, startY - 10)

    jhanaStates.forEach((state, index) => {
      const y = startY + 25 + index * (stateHeight + 5)
      const isActive = index <= currentJhana
      const alpha = isActive ? 1 : 0.3

      // State background
      ctx.fillStyle = isActive ? state.color : 'rgba(60, 60, 60, 0.3)'
      ctx.fillRect(startX, y, stateWidth, stateHeight)

      // State border
      ctx.strokeStyle = isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 100, 100, 0.5)'
      ctx.lineWidth = isActive && index === currentJhana ? 3 : 1
      ctx.strokeRect(startX, y, stateWidth, stateHeight)

      // State name
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.font = 'bold 12px Arial'
      ctx.fillText(state.name, startX + 8, y + 15)

      // Processing capacity indicator
      ctx.font = '10px Arial'
      ctx.fillText(`${state.capacity}x capacity`, startX + 8, y + 28)

      // Therapeutic note
      if (isActive) {
        ctx.fillStyle = 'rgba(200, 255, 200, 0.8)'
        ctx.font = 'italic 9px Arial'
        ctx.fillText(state.therapeuticNote, startX + stateWidth + 10, y + 20)
      }
    })
  }

  const drawCompressionCapacity = (ctx: CanvasRenderingContext2D, width: number, height: number, compression: number) => {
    const imageX = width * 0.05
    const imageY = height * 0.6
    const imageSize = 120

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('Information Processing Resolution', imageX, imageY - 15)

    // Simulate image resolution based on compression level
    const pixelSize = Math.max(1, 8 / Math.sqrt(compression))
    const numPixels = Math.floor(imageSize / pixelSize)

    // Background
    ctx.fillStyle = 'rgba(40, 40, 60, 0.5)'
    ctx.fillRect(imageX, imageY, imageSize, imageSize)

    // Draw "pixels" representing information granularity
    for (let x = 0; x < numPixels; x++) {
      for (let y = 0; y < numPixels; y++) {
        const pixelX = imageX + x * pixelSize
        const pixelY = imageY + y * pixelSize
        
        // Create a pattern that becomes more detailed with higher compression
        const pattern = Math.sin(x * 0.3) * Math.cos(y * 0.3) * compression * 0.1
        const brightness = 0.3 + (pattern + 1) * 0.3
        
        ctx.fillStyle = `rgba(100, 150, 255, ${brightness})`
        ctx.fillRect(pixelX, pixelY, pixelSize - 0.5, pixelSize - 0.5)
      }
    }

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.strokeRect(imageX, imageY, imageSize, imageSize)

    // Resolution info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '12px Arial'
    ctx.fillText(`${numPixels}×${numPixels} resolution`, imageX, imageY + imageSize + 20)
    ctx.fillText(`${compression}x compression capacity`, imageX, imageY + imageSize + 35)

    // Explanation
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '10px Arial'
    ctx.fillText('Higher meditation states = finer information granularity', imageX, imageY + imageSize + 55)
  }

  const drawTherapeuticInsights = (ctx: CanvasRenderingContext2D, width: number, height: number, currentJhana: number) => {
    const insightX = width * 0.5
    const insightY = height * 0.6
    const lineHeight = 18

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('Clinical Applications & Benefits', insightX, insightY)

    // Current processing example
    const currentExample = processingExamples[currentJhana] || processingExamples[0]
    
    ctx.fillStyle = 'rgba(100, 255, 150, 0.9)'
    ctx.font = 'bold 13px Arial'
    ctx.fillText(`Current Capacity: ${currentExample.example}`, insightX, insightY + 25)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '11px Arial'
    ctx.fillText(currentExample.detail, insightX, insightY + 40)

    // Clinical benefits
    const benefits = [
      "• Increased emotional regulation",
      "• Enhanced cognitive flexibility", 
      "• Reduced rumination and anxiety",
      "• Improved attention and focus",
      "• Greater psychological insight",
      "• Expanded perspective-taking ability"
    ]

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '11px Arial'
    benefits.slice(0, Math.min(6, currentJhana + 2)).forEach((benefit, index) => {
      const alpha = index <= currentJhana ? 0.9 : 0.4
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fillText(benefit, insightX, insightY + 65 + index * lineHeight)
    })

    // Information processing note
    ctx.fillStyle = 'rgba(200, 200, 255, 0.6)'
    ctx.font = 'italic 10px Arial'
    ctx.fillText('Each state represents exponentially increased', insightX, insightY + 200)
    ctx.fillText('information processing and integration capacity', insightX, insightY + 215)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

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

  const handleMeditationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeditationLevel(parseFloat(e.target.value))
  }

  const startAnimation = () => {
    if (isAnimating) return
    setIsAnimating(true)
    
    let progress = 0
    const animate = () => {
      progress += 0.003 // Slower progression for jhana states
      setMeditationLevel(Math.min(1, progress))
      
      if (progress < 1) {
        setTimeout(() => requestAnimationFrame(animate), 100)
      } else {
        setIsAnimating(false)
      }
    }
    animate()
  }

  return (
    <div className="w-full bg-black text-white p-4">
      <div className="mb-4">
        <h2 className="text-xl mb-2">Meditative States & Information Processing Capacity</h2>
        <p className="text-sm text-gray-300 mb-4">
          Each jhana represents exponentially increased information processing and therapeutic benefit. 
          Watch how meditation enables finer-grained awareness and cognitive flexibility.
        </p>
        
        <div className="flex gap-4 items-center mb-4">
          <label className="text-sm">Practice Depth:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={meditationLevel}
            onChange={handleMeditationChange}
            className="flex-1 max-w-xs"
          />
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isAnimating ? 'Deepening...' : 'Auto Deepen'}
          </button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-96 border border-gray-600"
        style={{ background: '#000000' }}
      />
      
      <div className="mt-4 text-xs text-gray-400">
        <p>
          <strong>Clinical Model:</strong> Traditional therapy focuses on content management. 
          This shows how contemplative states upgrade the fundamental cognitive architecture—
          enabling exponentially greater information integration, emotional regulation, and therapeutic insight.
        </p>
      </div>
    </div>
  )
}