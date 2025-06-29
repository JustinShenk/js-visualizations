import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Brain, Eye, Heart, Users, BookOpen, Zap, Network } from 'lucide-react';

const ConsciousnessArchitecture = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [autoProgress, setAutoProgress] = useState(false);
  const [stageTime, setStageTime] = useState(0);
  
  // System state for Stage 1: Reactive Survival
  const [stage1State, setStage1State] = useState({
    stimuli: [],
    reflexResponses: [],
    pleasure: 0.5,
    pain: 0.2,
    arousal: 0.3,
    attentionalFocus: { x: 0, y: 0, intensity: 0 },
    learningConnections: [],
    motorCommands: [],
    survivalDrives: {
      hunger: 0.6,
      thirst: 0.3,
      safety: 0.8,
      exploration: 0.4
    }
  });

  // Stage definitions
  const stages = [
    {
      id: 1,
      name: "Reactive Survival",
      description: "Innate reflexes, reinforcement learning, and the emergence of attentional self",
      color: "#ef4444",
      icon: Heart
    },
    {
      id: 2,
      name: "Personal Self",
      description: "The 'I' emerges as distinct from perceptual simulation",
      color: "#f59e0b",
      icon: Eye
    },
    {
      id: 3,
      name: "Social Self", 
      description: "Empathic resonance and social identity formation",
      color: "#10b981",
      icon: Users
    },
    {
      id: 4,
      name: "Rational Agency",
      description: "Epistemic autonomy and belief control",
      color: "#3b82f6",
      icon: BookOpen
    },
    {
      id: 5,
      name: "Self-Authoring",
      description: "Meta-cognition and identity construction awareness",
      color: "#8b5cf6",
      icon: Brain
    },
    {
      id: 6,
      name: "Enlightenment",
      description: "Qualia deconstruction and experience control",
      color: "#06b6d4",
      icon: Zap
    },
    {
      id: 7,
      name: "Transcendence",
      description: "Multi-substrate consciousness and AGI integration",
      color: "#d946ef",
      icon: Network
    }
  ];

  // Create random stimuli for Stage 1
  const createStimulus = useCallback(() => {
    const types = ['food', 'threat', 'mate', 'novel', 'pain', 'pleasure'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      id: Math.random(),
      type: type,
      x: Math.random() * 500 + 50,
      y: Math.random() * 400 + 50,
      intensity: 0.2 + Math.random() * 0.8,
      valence: type === 'food' || type === 'mate' || type === 'pleasure' ? 1 : 
               type === 'threat' || type === 'pain' ? -1 : 0,
      age: 0,
      processed: false
    };
  }, []);

  // Process reflexive responses
  const processReflexes = useCallback((stimuli, currentState) => {
    const responses = [];
    const newLearning = [...currentState.learningConnections];
    let newPleasure = currentState.pleasure;
    let newPain = currentState.pain;
    let newArousal = currentState.arousal;
    let newFocus = { ...currentState.attentionalFocus };

    stimuli.forEach(stimulus => {
      if (!stimulus.processed) {
        // Innate reflexive responses
        let responseStrength = stimulus.intensity;
        let responseType = 'approach';

        if (stimulus.valence < 0) {
          responseType = 'retreat';
          newPain = Math.min(1, newPain + stimulus.intensity * 0.1);
          newArousal = Math.min(1, newArousal + stimulus.intensity * 0.2);
        } else if (stimulus.valence > 0) {
          responseType = 'approach';
          newPleasure = Math.min(1, newPleasure + stimulus.intensity * 0.1);
        }

        // Attentional capture
        if (stimulus.intensity > newFocus.intensity) {
          newFocus = {
            x: stimulus.x,
            y: stimulus.y,
            intensity: stimulus.intensity
          };
        }

        responses.push({
          id: Math.random(),
          stimulusId: stimulus.id,
          type: responseType,
          strength: responseStrength,
          x: stimulus.x,
          y: stimulus.y,
          age: 0
        });

        // Reinforcement learning - create connections
        if (Math.random() < 0.3) {
          newLearning.push({
            id: Math.random(),
            from: { x: stimulus.x, y: stimulus.y },
            to: { x: stimulus.x + (Math.random() - 0.5) * 100, y: stimulus.y + (Math.random() - 0.5) * 100 },
            strength: stimulus.valence * stimulus.intensity,
            age: 0
          });
        }

        stimulus.processed = true;
      }
    });

    // Decay over time
    newPleasure = Math.max(0, newPleasure - 0.02);
    newPain = Math.max(0, newPain - 0.02);
    newArousal = Math.max(0.1, newArousal - 0.01);
    newFocus.intensity = Math.max(0, newFocus.intensity - 0.03);

    return {
      responses,
      pleasure: newPleasure,
      pain: newPain,
      arousal: newArousal,
      attentionalFocus: newFocus,
      learningConnections: newLearning.filter(conn => conn.age < 100)
    };
  }, []);

  // Draw Stage 1: Reactive Survival
  const drawStage1 = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear with dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Stage 1: Reactive Survival', centerX, 30);

    ctx.font = '14px sans-serif';
    ctx.fillText('Innate reflexes + reinforcement learning → attentional self emergence', centerX, 55);

    // Draw pleasure/pain/arousal indicators
    const barWidth = 80;
    const barHeight = 10;
    const barY = height - 60;

    // Pleasure bar (green)
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(50, barY, barWidth * stage1State.pleasure, barHeight);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(50, barY, barWidth, barHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Pleasure', 50, barY - 5);

    // Pain bar (red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(150, barY, barWidth * stage1State.pain, barHeight);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(150, barY, barWidth, barHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Pain', 150, barY - 5);

    // Arousal bar (yellow)
    ctx.fillStyle = '#eab308';
    ctx.fillRect(250, barY, barWidth * stage1State.arousal, barHeight);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(250, barY, barWidth, barHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Arousal', 250, barY - 5);

    // Draw survival drives
    const drives = Object.entries(stage1State.survivalDrives);
    drives.forEach(([drive, level], index) => {
      const x = 400 + index * 60;
      const y = height - 40;
      
      ctx.fillStyle = `hsl(${level * 120}, 70%, 50%)`;
      ctx.fillRect(x, y - level * 30, 15, level * 30);
      ctx.strokeStyle = '#666';
      ctx.strokeRect(x, y - 30, 15, 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(drive, x + 7, y + 15);
    });

    // Draw learning connections (reinforcement pathways)
    stage1State.learningConnections.forEach(connection => {
      const alpha = Math.max(0.1, 1 - connection.age / 100);
      const color = connection.strength > 0 ? `rgba(34, 197, 94, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.abs(connection.strength) * 3;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(connection.from.x, connection.from.y);
      ctx.lineTo(connection.to.x, connection.to.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw stimuli
    stage1State.stimuli.forEach(stimulus => {
      const alpha = Math.max(0.2, 1 - stimulus.age / 60);
      
      // Stimulus circle
      if (stimulus.valence > 0) {
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      } else if (stimulus.valence < 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(156, 163, 175, ${alpha})`;
      }
      
      const radius = 5 + stimulus.intensity * 10;
      ctx.beginPath();
      ctx.arc(stimulus.x, stimulus.y, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Stimulus type label
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stimulus.type, stimulus.x, stimulus.y + radius + 12);
    });

    // Draw reflex responses
    stage1State.reflexResponses.forEach(response => {
      const alpha = Math.max(0.2, 1 - response.age / 30);
      
      if (response.type === 'approach') {
        ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
      } else {
        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      }
      
      ctx.lineWidth = response.strength * 4;
      
      // Draw movement vector
      const angle = response.type === 'approach' ? 0 : Math.PI;
      const length = response.strength * 30;
      
      ctx.beginPath();
      ctx.moveTo(response.x, response.y);
      ctx.lineTo(
        response.x + Math.cos(angle) * length,
        response.y + Math.sin(angle) * length
      );
      ctx.stroke();

      // Arrowhead
      const headLength = 8;
      const headAngle = Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(
        response.x + Math.cos(angle) * length,
        response.y + Math.sin(angle) * length
      );
      ctx.lineTo(
        response.x + Math.cos(angle) * length - headLength * Math.cos(angle - headAngle),
        response.y + Math.sin(angle) * length - headLength * Math.sin(angle - headAngle)
      );
      ctx.moveTo(
        response.x + Math.cos(angle) * length,
        response.y + Math.sin(angle) * length
      );
      ctx.lineTo(
        response.x + Math.cos(angle) * length - headLength * Math.cos(angle + headAngle),
        response.y + Math.sin(angle) * length - headLength * Math.sin(angle + headAngle)
      );
      ctx.stroke();
    });

    // Draw attentional focus (the emerging "self")
    if (stage1State.attentionalFocus.intensity > 0.1) {
      const focusAlpha = stage1State.attentionalFocus.intensity;
      ctx.strokeStyle = `rgba(59, 130, 246, ${focusAlpha})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      const focusRadius = 20 + stage1State.attentionalFocus.intensity * 30;
      ctx.beginPath();
      ctx.arc(stage1State.attentionalFocus.x, stage1State.attentionalFocus.y, focusRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Emerging "observer" dot
      ctx.fillStyle = `rgba(59, 130, 246, ${focusAlpha})`;
      ctx.beginPath();
      ctx.arc(stage1State.attentionalFocus.x, stage1State.attentionalFocus.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Attentional Self', stage1State.attentionalFocus.x, stage1State.attentionalFocus.y - focusRadius - 10);
    }

    // Draw legend
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    
    const legendX = 20;
    const legendY = 100;
    
    ctx.fillText('Legend:', legendX, legendY);
    
    // Green stimuli
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 20, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Positive stimuli', legendX + 20, legendY + 25);
    
    // Red stimuli
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 40, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Negative stimuli', legendX + 20, legendY + 45);
    
    // Attentional focus
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(legendX + 10, legendY + 60, 8, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Attentional focus', legendX + 25, legendY + 65);

  }, [stage1State]);

  const animate = useCallback(() => {
    if (!isRunning) return;

    const dt = 0.03;
    setTime(t => t + dt);
    setStageTime(st => st + dt);

    if (currentStage === 1) {
      // Update Stage 1: Reactive Survival
      setStage1State(prevState => {
        let newStimuli = [...prevState.stimuli];
        let newResponses = [...prevState.reflexResponses];

        // Add new stimuli occasionally
        if (Math.random() < 0.05) {
          newStimuli.push(createStimulus());
        }

        // Age and remove old stimuli
        newStimuli = newStimuli.map(s => ({ ...s, age: s.age + 1 })).filter(s => s.age < 120);
        newResponses = newResponses.map(r => ({ ...r, age: r.age + 1 })).filter(r => r.age < 60);

        // Process reflexes and learning
        const processed = processReflexes(newStimuli, prevState);

        return {
          ...prevState,
          stimuli: newStimuli,
          reflexResponses: [...newResponses, ...processed.responses],
          pleasure: processed.pleasure,
          pain: processed.pain,
          arousal: processed.arousal,
          attentionalFocus: processed.attentionalFocus,
          learningConnections: processed.learningConnections.map(c => ({ ...c, age: c.age + 1 }))
        };
      });
    }

    // Auto-progress through stages
    if (autoProgress && stageTime > 15 && currentStage < 7) {
      setCurrentStage(prev => prev + 1);
      setStageTime(0);
    }

    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [isRunning, currentStage, stageTime, autoProgress, createStimulus, processReflexes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    if (currentStage === 1) {
      drawStage1(ctx, width, height);
    }
    // Additional stages will be implemented here

  }, [currentStage, drawStage1]);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate]);

  useEffect(() => {
    draw();
  }, [draw]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setStageTime(0);
    setCurrentStage(1);
    setStage1State({
      stimuli: [],
      reflexResponses: [],
      pleasure: 0.5,
      pain: 0.2,
      arousal: 0.3,
      attentionalFocus: { x: 0, y: 0, intensity: 0 },
      learningConnections: [],
      motorCommands: [],
      survivalDrives: {
        hunger: 0.6,
        thirst: 0.3,
        safety: 0.8,
        exploration: 0.4
      }
    });
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Consciousness Architecture: Joscha Bach's Levels
        </h2>
        <p className="text-gray-300 text-sm">
          Interactive visualization of consciousness development from reactive survival to transcendent awareness.
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
            width={700}
            height={600}
            className="border border-gray-600 rounded-lg bg-black w-full"
          />
          
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={toggleSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            
            <button
              onClick={() => setAutoProgress(!autoProgress)}
              className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                autoProgress ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Auto-Progress: {autoProgress ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-300">Consciousness Stages</h3>
            
            {stages.map((stage) => {
              const StageIcon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setCurrentStage(stage.id);
                    setStageTime(0);
                  }}
                  className={`w-full text-left p-3 mb-2 rounded-lg transition-colors ${
                    currentStage === stage.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <StageIcon className="w-4 h-4" style={{color: stage.color}} />
                    <span className="font-medium text-sm">{stage.name}</span>
                  </div>
                  <p className="text-xs opacity-80">{stage.description}</p>
                </button>
              );
            })}
          </div>

          {currentStage === 1 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-red-300">Stage 1: Reactive Survival</h3>
              <div className="text-xs space-y-2 text-gray-300">
                <p><strong>Innate Reflexes:</strong> Automatic approach/retreat responses</p>
                <p><strong>Reinforcement Learning:</strong> Pleasure/pain create behavioral connections</p>
                <p><strong>Attentional Self:</strong> Focus emerges on salient stimuli</p>
                <p><strong>Survival Drives:</strong> Hunger, thirst, safety, exploration</p>
                <p><strong>Key Insight:</strong> Consciousness bootstraps from basic survival mechanisms</p>
              </div>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-cyan-300">Implementation Status</h3>
            <div className="text-xs space-y-1">
              <div className={`flex items-center gap-2 ${currentStage >= 1 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
                <span>Stage 1: Reactive Survival</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStage >= 2 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
                <span>Stage 2: Personal Self (Coming)</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStage >= 3 ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
                <span>Stage 3: Social Self (Coming)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-cyan-300">Joscha Bach's Consciousness Development</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Stage 1:</strong> Raw survival mechanisms create the foundation - reflexes respond to stimuli, reinforcement learning builds behavioral patterns, and attention emerges as the first "observer."</p>
          <p><strong>Core Insight:</strong> Consciousness isn't given - it's constructed through interaction between organism and environment, starting from pure survival mechanisms.</p>
          <p><strong>Watch for:</strong> The moment when scattered attention coalesces into a stable "self" that can observe its own processes.</p>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessArchitecture;