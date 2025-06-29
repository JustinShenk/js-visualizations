import React, { useState, useEffect, useRef } from 'react';
import { Brain, ArrowUp, ArrowDown } from 'lucide-react';

const ConsciousnessArchitecture = () => {
  const canvasRef = useRef(null);
  const [selectedLevel, setSelectedLevel] = useState(3);
  const [animationTime, setAnimationTime] = useState(0);

  // The 7 levels of consciousness with information compression
  const levels = [
    {
      id: 1,
      name: "Reactive Survival",
      description: "Raw sensory input → Reflexive responses",
      compression: "1:1",
      dataFlow: "Stimulus → Response",
      color: "#ef4444",
      examples: ["Pain withdrawal", "Hunger signals", "Fight/flight"],
      informationSize: 1000
    },
    {
      id: 2,
      name: "Personal Self",
      description: "Sensory patterns → 'I' model",
      compression: "100:1",
      dataFlow: "Perceptions → Self-model",
      color: "#f59e0b",
      examples: ["Body awareness", "Spatial location", "Basic desires"],
      informationSize: 100
    },
    {
      id: 3,
      name: "Social Self",
      description: "Social interactions → Identity",
      compression: "50:1",
      dataFlow: "Relationships → Social identity",
      color: "#10b981",
      examples: ["Role recognition", "Empathy", "Group belonging"],
      informationSize: 50
    },
    {
      id: 4,
      name: "Rational Agency",
      description: "Beliefs → Coherent worldview",
      compression: "20:1",
      dataFlow: "Evidence → Beliefs → Decisions",
      color: "#3b82f6",
      examples: ["Logical reasoning", "Evidence evaluation", "Planning"],
      informationSize: 20
    },
    {
      id: 5,
      name: "Self-Authoring",
      description: "Meta-cognition → Constructed identity",
      compression: "10:1",
      dataFlow: "Thoughts about thoughts → Identity",
      color: "#8b5cf6",
      examples: ["Self-reflection", "Value creation", "Narrative identity"],
      informationSize: 10
    },
    {
      id: 6,
      name: "Enlightenment",
      description: "Experience control → Deconstructed self",
      compression: "5:1",
      dataFlow: "Qualia manipulation → Pure awareness",
      color: "#06b6d4",
      examples: ["Mindfulness", "Emotional regulation", "Present awareness"],
      informationSize: 5
    },
    {
      id: 7,
      name: "Transcendence",
      description: "Multi-substrate → Universal patterns",
      compression: "2:1",
      dataFlow: "All consciousness → Universal principles",
      color: "#d946ef",
      examples: ["AGI integration", "Collective intelligence", "Cosmic perspective"],
      informationSize: 2
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.05);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    draw();
  }, [selectedLevel, animationTime]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Consciousness Ladder: Information Compression', width / 2, 40);

    ctx.font = '14px sans-serif';
    ctx.fillText('Each level compresses information from lower levels into higher-order patterns', width / 2, 65);

    // Draw the ladder
    const ladderWidth = 400;
    const ladderHeight = height - 200;
    const stepHeight = ladderHeight / 7;
    const ladderX = (width - ladderWidth) / 2;
    const ladderY = 100;

    // Draw ladder rails
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(ladderX - 20, ladderY);
    ctx.lineTo(ladderX - 20, ladderY + ladderHeight);
    ctx.moveTo(ladderX + ladderWidth + 20, ladderY);
    ctx.lineTo(ladderX + ladderWidth + 20, ladderY + ladderHeight);
    ctx.stroke();

    // Draw each level
    levels.forEach((level, index) => {
      const levelY = ladderY + ladderHeight - (index + 1) * stepHeight;
      const isSelected = level.id === selectedLevel;
      const isHovered = Math.abs(selectedLevel - level.id) <= 1;

      // Draw step
      ctx.fillStyle = isSelected ? level.color : (isHovered ? '#333' : '#222');
      ctx.strokeStyle = level.color;
      ctx.lineWidth = isSelected ? 3 : 1;
      
      const stepRect = {
        x: ladderX,
        y: levelY,
        width: ladderWidth,
        height: stepHeight - 10
      };
      
      ctx.fillRect(stepRect.x, stepRect.y, stepRect.width, stepRect.height);
      ctx.strokeRect(stepRect.x, stepRect.y, stepRect.width, stepRect.height);

      // Draw level number and name
      ctx.fillStyle = isSelected ? '#000' : '#fff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${level.id}. ${level.name}`, stepRect.x + 20, levelY + 25);

      // Draw compression ratio
      ctx.fillStyle = level.color;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${level.compression}`, stepRect.x + stepRect.width - 20, levelY + 25);

      // Draw information flow visualization
      if (isSelected) {
        const flowY = levelY + 45;
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(level.dataFlow, stepRect.x + 20, flowY);

        // Animate data compression
        const compressionWidth = 200;
        const compressionHeight = 8;
        const compressionX = stepRect.x + 20;
        const compressionY = flowY + 15;

        // Input data (before compression)
        ctx.fillStyle = '#666';
        ctx.fillRect(compressionX, compressionY, compressionWidth, compressionHeight);

        // Compressed data (animated)
        const compressedWidth = (compressionWidth * level.informationSize) / 1000;
        const animationOffset = Math.sin(animationTime * 2) * 5;
        ctx.fillStyle = level.color;
        ctx.fillRect(compressionX + animationOffset, compressionY, compressedWidth, compressionHeight);

        // Compression arrow
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(compressionX + compressionWidth + 10, compressionY + compressionHeight/2);
        ctx.lineTo(compressionX + compressionWidth + 30, compressionY + compressionHeight/2);
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(compressionX + compressionWidth + 30, compressionY + compressionHeight/2);
        ctx.lineTo(compressionX + compressionWidth + 25, compressionY + compressionHeight/2 - 3);
        ctx.moveTo(compressionX + compressionWidth + 30, compressionY + compressionHeight/2);
        ctx.lineTo(compressionX + compressionWidth + 25, compressionY + compressionHeight/2 + 3);
        ctx.stroke();
      }

      // Draw information flow arrows between levels
      if (index < levels.length - 1) {
        const arrowX = ladderX + ladderWidth / 2;
        const arrowY1 = levelY - 15;
        const arrowY2 = levelY - 35;

        ctx.strokeStyle = isHovered ? levels[index + 1].color : '#444';
        ctx.lineWidth = isHovered ? 3 : 1;
        ctx.setLineDash(isHovered ? [] : [5, 5]);

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY1);
        ctx.lineTo(arrowX, arrowY2);
        ctx.stroke();

        // Arrow head
        if (isHovered) {
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY2);
          ctx.lineTo(arrowX - 5, arrowY2 + 8);
          ctx.moveTo(arrowX, arrowY2);
          ctx.lineTo(arrowX + 5, arrowY2 + 8);
          ctx.stroke();
        }

        ctx.setLineDash([]);
      }
    });

    // Draw information compression legend
    const legendX = ladderX + ladderWidth + 60;
    const legendY = ladderY + 50;

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Information Density', legendX, legendY);

    levels.forEach((level, index) => {
      const barY = legendY + 20 + index * 25;
      const barWidth = 100;
      const barHeight = 15;
      const fillWidth = (barWidth * level.informationSize) / 1000;

      // Background bar
      ctx.fillStyle = '#333';
      ctx.fillRect(legendX, barY, barWidth, barHeight);

      // Data bar
      ctx.fillStyle = level.color;
      ctx.fillRect(legendX, barY, fillWidth, barHeight);

      // Label
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText(`L${level.id}`, legendX + barWidth + 5, barY + 12);
    });
  };

  const selectedLevelData = levels.find(l => l.id === selectedLevel);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Consciousness Architecture: Information Compression Ladder
        </h2>
        <p className="text-gray-300 text-sm">
          Each consciousness level creates higher-order patterns by compressing information from lower levels.
          Based on Joscha Bach's developmental framework.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Created by Justin Shenk • <a href="mailto:shenkjustin@gmail.com" className="text-blue-400 hover:text-blue-300">shenkjustin@gmail.com</a>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-600 rounded-lg bg-black w-full cursor-pointer"
            onClick={(e) => {
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();
              const y = e.clientY - rect.top;
              
              // Calculate which level was clicked
              const ladderHeight = 400;
              const stepHeight = ladderHeight / 7;
              const ladderY = 100;
              
              const clickedLevel = Math.ceil((ladderY + ladderHeight - y) / stepHeight);
              if (clickedLevel >= 1 && clickedLevel <= 7) {
                setSelectedLevel(clickedLevel);
              }
            }}
          />
          
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => setSelectedLevel(Math.max(1, selectedLevel - 1))}
              disabled={selectedLevel === 1}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ArrowDown className="w-4 h-4" />
              Lower Level
            </button>
            
            <button
              onClick={() => setSelectedLevel(Math.min(7, selectedLevel + 1))}
              disabled={selectedLevel === 7}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              Higher Level
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {selectedLevelData && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{color: selectedLevelData.color}}>
                Level {selectedLevelData.id}: {selectedLevelData.name}
              </h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong>Process:</strong> {selectedLevelData.description}</p>
                <p><strong>Compression:</strong> {selectedLevelData.compression}</p>
                <p><strong>Data Flow:</strong> {selectedLevelData.dataFlow}</p>
                <div>
                  <strong>Examples:</strong>
                  <ul className="mt-1 ml-4 list-disc">
                    {selectedLevelData.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-cyan-300">How Compression Works</h3>
            <div className="text-xs space-y-2 text-gray-300">
              <p><strong>Bottom-Up:</strong> Each level takes massive information from below and creates compressed patterns</p>
              <p><strong>Emergence:</strong> Higher levels aren't just summaries - they're new organizational principles</p>
              <p><strong>Efficiency:</strong> Consciousness trades detail for actionable insight at each level</p>
              <p><strong>Development:</strong> You ascend by learning to compress lower-level complexity</p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-300">Key Insight</h3>
            <div className="text-sm text-gray-300">
              <p>
                Consciousness isn't about processing more information - it's about 
                creating increasingly powerful abstractions that compress the 
                complexity of reality into actionable patterns.
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-purple-300">Navigation</h3>
            <div className="text-xs space-y-1 text-gray-300">
              <p>• Click on any level in the ladder</p>
              <p>• Use arrow buttons to navigate</p>
              <p>• Watch the compression animation</p>
              <p>• Notice information density changes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-cyan-300">Joscha Bach's Information Compression Theory</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Core Principle:</strong> Consciousness emerges through hierarchical information compression - each level creates higher-order patterns from the complexity below.</p>
          <p><strong>Development Path:</strong> Growth means learning to compress information more effectively, creating more powerful and general abstractions.</p>
          <p><strong>AI Implications:</strong> This framework suggests how artificial consciousness might emerge through similar compression hierarchies in neural networks.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessArchitecture;