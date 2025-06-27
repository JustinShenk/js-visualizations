'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

export default function RadixExpansion() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [meditationLevel, setMeditationLevel] = useState(0)
  const [currentRadix, setCurrentRadix] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)

  // Complexity levels for different radix bases
  const complexityLevels = {
    2: ["Simple emotions (happy/sad)", "Basic categories (good/bad)", "Binary decisions"],
    3: ["Primary emotions", "Simple relationships", "Basic problem solving"],
    4: ["Emotional nuance", "Multiple perspectives", "Complex reasoning"],
    5: ["Emotional granularity", "Systems thinking", "Recursive understanding"],
    6: ["Meta-emotional awareness", "Multi-level analysis", "Pattern recognition"],
    8: ["Cognitive flexibility", "Paradox integration", "Dynamic modeling"],
    10: ["Contemplative insight", "Non-dual awareness", "Holistic perception"],
    12: ["Advanced metacognition", "Transpersonal insight", "Unity consciousness"],
    16: ["Beyond conceptual modeling", "Trans-rational understanding", "Ultimate reality"]
  }

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

    // Calculate current radix based on meditation level
    const targetRadix = Math.min(16, 2 + Math.floor(meditationLevel * 14))
    if (currentRadix !== targetRadix) {
      setCurrentRadix(targetRadix)
    }

    // Draw meditation practice visualization
    drawMeditationPractice(ctx, width, height)
    
    // Draw radix representation
    drawRadixRepresentation(ctx, width, height, currentRadix)
    
    // Draw information capacity
    drawInformationCapacity(ctx, width, height, currentRadix)
    
    // Draw complexity examples
    drawComplexityExamples(ctx, width, height, currentRadix)

  }, [meditationLevel, currentRadix])

  const drawMeditationPractice = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width * 0.25
    const centerY = height * 0.3
    const radius = 40

    // Draw meditator (simple circle with breathing animation)
    const breathPhase = Math.sin(Date.now() * 0.003) * 0.1
    ctx.fillStyle = `rgba(100, 150, 255, ${0.7 + breathPhase})`
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * (1 + breathPhase), 0, Math.PI * 2)
    ctx.fill()

    // Draw meditation ripples
    for (let i = 0; i < 5; i++) {
      const rippleRadius = radius + (i + 1) * 20 + breathPhase * 10
      const alpha = (0.3 - i * 0.06) * meditationLevel
      ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw progress indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '14px Arial'
    ctx.fillText(`Meditation Depth: ${Math.round(meditationLevel * 100)}%`, centerX - 50, centerY + radius + 30)
  }

  const drawRadixRepresentation = (ctx: CanvasRenderingContext2D, width: number, height: number, radix: number) => {
    const startX = width * 0.6
    const startY = height * 0.2
    const boxSize = 30
    const spacing = 35

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 16px Arial'
    ctx.fillText(`Representational Base: ${radix}`, startX - 50, startY - 20)

    // Draw radix boxes
    for (let i = 0; i < radix; i++) {
      const x = startX + (i % 4) * spacing
      const y = startY + Math.floor(i / 4) * spacing
      
      // Box color based on activation
      const activation = Math.min(1, meditationLevel * 2)
      const hue = (i / radix) * 360
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${activation})`
      ctx.fillRect(x, y, boxSize - 2, boxSize - 2)
      
      // Box border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, boxSize - 2, boxSize - 2)
      
      // Digit
      ctx.fillStyle = 'white'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(i.toString(radix).toUpperCase(), x + boxSize/2 - 1, y + boxSize/2 + 4)
    }
    ctx.textAlign = 'left'

    // Information formula
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '12px Arial'
    ctx.fillText(`Information per unit: log₂(${radix}) = ${Math.log2(radix).toFixed(2)} bits`, startX - 50, startY + 120)
  }

  const drawInformationCapacity = (ctx: CanvasRenderingContext2D, width: number, height: number, radix: number) => {
    const graphX = width * 0.05
    const graphY = height * 0.6
    const graphWidth = width * 0.4
    const graphHeight = height * 0.3

    // Background
    ctx.fillStyle = 'rgba(20, 20, 40, 0.5)'
    ctx.fillRect(graphX, graphY, graphWidth, graphHeight)

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('Information Processing Capacity', graphX, graphY - 10)

    // Draw capacity bars for different radix levels
    const maxRadix = 16
    const barWidth = graphWidth / maxRadix
    
    for (let r = 2; r <= maxRadix; r++) {
      const barHeight = (Math.log2(r) / Math.log2(maxRadix)) * graphHeight * 0.8
      const x = graphX + (r - 2) * barWidth
      const y = graphY + graphHeight - barHeight
      
      // Highlight current radix
      const alpha = r <= currentRadix ? 0.8 : 0.2
      ctx.fillStyle = `rgba(100, 200, 100, ${alpha})`
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight)
      
      // Radix label
      if (r % 2 === 0 || r === currentRadix) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(r.toString(), x + barWidth/2, graphY + graphHeight + 15)
      }
    }
    ctx.textAlign = 'left'

    // Current capacity indicator
    ctx.fillStyle = 'rgba(255, 255, 0, 0.8)'
    ctx.font = 'bold 12px Arial'
    ctx.fillText(`Current: ${Math.log2(currentRadix).toFixed(2)} bits/unit`, graphX, graphY + graphHeight + 35)
  }

  const drawComplexityExamples = (ctx: CanvasRenderingContext2D, width: number, height: number, radix: number) => {
    const exampleX = width * 0.55
    const exampleY = height * 0.5
    const lineHeight = 20

    // Title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.font = 'bold 14px Arial'
    ctx.fillText('Accessible Phenomena:', exampleX, exampleY)

    // Get examples for current radix
    const examples = complexityLevels[radix as keyof typeof complexityLevels] || []
    
    examples.forEach((example, index) => {
      const y = exampleY + 25 + index * lineHeight
      
      // Bullet point
      ctx.fillStyle = 'rgba(100, 200, 255, 0.8)'
      ctx.beginPath()
      ctx.arc(exampleX + 5, y - 5, 3, 0, Math.PI * 2)
      ctx.fill()
      
      // Example text
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = '12px Arial'
      ctx.fillText(example, exampleX + 15, y)
    })

    // Upgrade indicator
    if (radix < 16) {
      ctx.fillStyle = 'rgba(255, 200, 100, 0.6)'
      ctx.font = 'italic 11px Arial'
      ctx.fillText(`Next level unlocks at radix ${Math.min(16, radix + 2)}...`, exampleX, exampleY + 140)
    }
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
      progress += 0.005
      setMeditationLevel(Math.min(1, progress))
      
      if (progress < 1) {
        setTimeout(() => requestAnimationFrame(animate), 50)
      } else {
        setIsAnimating(false)
      }
    }
    animate()
  }

  return (
    <div className="w-full bg-black text-white p-4">
      <div className="mb-4">
        <h2 className="text-xl mb-2">Radix Expansion Through Meditation</h2>
        <p className="text-sm text-gray-300 mb-4">
          Advanced meditation upgrades the fundamental representational capacity of cognition, 
          allowing exponentially more information processing in the same neural space.
        </p>
        
        <div className="flex gap-4 items-center mb-4">
          <label className="text-sm">Meditation Depth:</label>
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
            {isAnimating ? 'Practicing...' : 'Auto Practice'}
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
          <strong>Theory:</strong> Unlike traditional views of meditation as attention reallocation, 
          this model shows how contemplative practice fundamentally upgrades cognitive architecture—
          increasing the radix (numerical base) of mental representation for exponentially greater 
          information processing capacity.
        </p>
      </div>
    </div>
  )
}