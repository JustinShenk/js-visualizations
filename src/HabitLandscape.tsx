import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Target, Eye } from 'lucide-react';

const HabitLandscape = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [viewMode, setViewMode] = useState('landscape');
  
  // Habit system parameters
  const [params, setParams] = useState({
    metacognition: 0.3,
    willpower: 0.5,
    environmentDesign: 0.4,
    stress: 0.3,
    socialInfluence: 0.5,
    consistency: 0.6
  });
  
  // Individual habits with their properties
  const [habits, setHabits] = useState([
    { id: 'phone', name: 'Phone Checking', type: 'problematic', strength: 0.8, x: -0.3, y: 0.2, triggers: ['boredom', 'transition'] },
    { id: 'coffee', name: 'Morning Coffee', type: 'neutral', strength: 0.9, x: 0.1, y: 0.6, triggers: ['wake'] },
    { id: 'exercise', name: 'Workout', type: 'beneficial', strength: 0.4, x: 0.6, y: 0.3, triggers: ['scheduled'] },
    { id: 'reading', name: 'Evening Reading', type: 'beneficial', strength: 0.3, x: 0.4, y: -0.4, triggers: ['bedtime'] },
    { id: 'snacking', name: 'Stress Snacking', type: 'problematic', strength: 0.6, x: -0.5, y: -0.2, triggers: ['stress', 'afternoon'] },
    { id: 'email', name: 'Email Check', type: 'neutral', strength: 0.7, x: 0.0, y: 0.0, triggers: ['work_start', 'notification'] }
  ]);
  
  // Current behavioral state
  const [behaviorState, setBehaviorState] = useState({
    x: 0.1,
    y: 0.1,
    dx: 0,
    dy: 0,
    currentHabit: null,
    energy: 0.8,
    timeOfDay: 8
  });
  
  const [trajectory, setTrajectory] = useState([]);
  const [habitHistory, setHabitHistory] = useState([]);
  const [smoothedMood, setSmoothedMood] = useState(0.6);
  const [smoothedCogLoad, setSmoothedCogLoad] = useState(0.3);

  // Calculate habit basin influence
  const getHabitInfluence = useCallback((x, y, habit, params) => {
    const dx = x - habit.x;
    const dy = y - habit.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    let depth = habit.strength;
    
    if (habit.type === 'problematic') {
      depth *= (1 + params.stress * 0.5);
    }
    
    if (habit.type === 'beneficial') {
      depth *= (1 + params.environmentDesign * 0.3);
    }
    
    const awareness = 1 + params.metacognition * 0.5;
    const influence = depth * Math.exp(-distance * distance / (0.3 * awareness));
    
    const forceX = -dx * influence * 2;
    const forceY = -dy * influence * 2;
    
    return { forceX, forceY, influence, distance };
  }, []);

  // Check if current time matches habit triggers
  const isHabitTriggered = useCallback((habit, timeOfDay, stress, context) => {
    const triggers = habit.triggers || [];
    
    if (triggers.includes('wake') && timeOfDay >= 7 && timeOfDay <= 9) return true;
    if (triggers.includes('work_start') && timeOfDay >= 9 && timeOfDay <= 10) return true;
    if (triggers.includes('afternoon') && timeOfDay >= 14 && timeOfDay <= 16) return true;
    if (triggers.includes('bedtime') && timeOfDay >= 21 && timeOfDay <= 23) return true;
    if (triggers.includes('stress') && stress > 0.6) return true;
    if (triggers.includes('boredom') && Math.random() < 0.1) return true;
    if (triggers.includes('transition') && Math.random() < 0.05) return true;
    
    return false;
  }, []);

  // Calculate current mood based on recent habit activations
  const calculateMood = useCallback(() => {
    let moodScore = 0;
    
    moodScore += behaviorState.energy * 0.4;
    
    const recentHabits = habitHistory.slice(-5);
    recentHabits.forEach((entry, index) => {
      const habit = habits.find(h => h.id === entry.habit);
      if (habit) {
        const weight = (index + 1) / recentHabits.length;
        if (habit.type === 'beneficial') {
          moodScore += 0.3 * weight;
        } else if (habit.type === 'problematic') {
          moodScore -= 0.2 * weight;
        }
      }
    });
    
    if (behaviorState.currentHabit) {
      if (behaviorState.currentHabit.type === 'beneficial') {
        moodScore += 0.2;
      } else if (behaviorState.currentHabit.type === 'problematic') {
        moodScore -= 0.15;
      }
    }
    
    moodScore -= params.stress * 0.3;
    moodScore += params.socialInfluence * 0.2;
    
    return Math.max(0, Math.min(1, (moodScore + 0.5) / 1.5));
  }, [behaviorState, habitHistory, habits, params]);

  // Calculate cognitive load
  const calculateCognitiveLoad = useCallback(() => {
    let cogLoad = 0;
    
    cogLoad += params.stress * 0.4;
    
    const hoursSinceWake = Math.max(0, behaviorState.timeOfDay - 7);
    cogLoad += Math.min(0.4, hoursSinceWake * 0.03);
    
    let conflictCount = 0;
    const currentPos = { x: behaviorState.x, y: behaviorState.y };
    habits.forEach(habit => {
      const influence = getHabitInfluence(currentPos.x, currentPos.y, habit, params).influence;
      if (influence > 0.1) conflictCount++;
    });
    
    if (conflictCount > 1) {
      cogLoad += (conflictCount - 1) * 0.15;
    }
    
    cogLoad += (1 - params.willpower) * 0.2;
    cogLoad *= (1 - params.metacognition * 0.3);
    
    return Math.max(0, Math.min(1, cogLoad));
  }, [behaviorState, habits, params, getHabitInfluence]);

  // Update behavior dynamics
  const updateBehaviorDynamics = useCallback((state, habits, params, dt) => {
    const { x, y, dx, dy, energy, timeOfDay } = state;
    
    let totalForceX = 0;
    let totalForceY = 0;
    let strongestHabit = null;
    let maxInfluence = 0;
    
    habits.forEach(habit => {
      const { forceX, forceY, influence } = getHabitInfluence(x, y, habit, params);
      
      const triggered = isHabitTriggered(habit, timeOfDay, params.stress, 'normal');
      const triggerMultiplier = triggered ? 2.0 : 1.0;
      
      totalForceX += forceX * triggerMultiplier;
      totalForceY += forceY * triggerMultiplier;
      
      if (influence * triggerMultiplier > maxInfluence) {
        maxInfluence = influence * triggerMultiplier;
        strongestHabit = habit;
      }
    });
    
    if (strongestHabit && strongestHabit.type === 'problematic') {
      const resistance = params.willpower * energy * 0.3;
      totalForceX *= (1 - resistance);
      totalForceY *= (1 - resistance);
    }
    
    const noise = (Math.random() - 0.5) * 0.02;
    totalForceX += noise;
    totalForceY += noise * 0.5;
    
    const damping = 0.1;
    totalForceX -= dx * damping;
    totalForceY -= dy * damping;
    
    const newDx = dx + totalForceX * dt;
    const newDy = dy + totalForceY * dt;
    
    const newX = Math.max(-1, Math.min(1, x + newDx * dt));
    const newY = Math.max(-1, Math.min(1, y + newDy * dt));
    
    let newEnergy = energy;
    if (strongestHabit) {
      if (strongestHabit.type === 'beneficial') {
        newEnergy = Math.min(1, energy + 0.1 * dt);
      } else if (strongestHabit.type === 'problematic') {
        newEnergy = Math.max(0.2, energy - 0.05 * dt);
      }
    }
    
    const newTimeOfDay = (timeOfDay + dt * 1) % 24;
    
    return {
      x: newX,
      y: newY,
      dx: newDx,
      dy: newDy,
      currentHabit: maxInfluence > 0.1 ? strongestHabit : null,
      energy: newEnergy,
      timeOfDay: newTimeOfDay
    };
  }, [getHabitInfluence, isHabitTriggered]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    const centerX = width / 2;
    const centerY = height / 2;
    
    for (let i = -4; i <= 4; i++) {
      const x = centerX + i * (width / 10);
      const y = centerY + i * (height / 10);
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Draw trajectory
    if (trajectory.length > 1) {
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      
      ctx.beginPath();
      for (let i = 0; i < trajectory.length; i++) {
        const point = trajectory[i];
        const x = centerX + point.x * (width / 2.5);
        const y = centerY - point.y * (height / 2.5);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    // Draw landscape view (potential field and habits)
    if (viewMode === 'landscape') {
      // Draw potential field as contour map
      const resolution = 40;
      
      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x = -1 + (i / resolution) * 2;
          const y = 1 - (j / resolution) * 2;
          
          let totalPotential = 0;
          habits.forEach(habit => {
            const { influence } = getHabitInfluence(x, y, habit, params);
            const sign = habit.type === 'beneficial' ? -1 : 1;
            totalPotential += sign * influence;
          });
          
          const hue = totalPotential > 0 ? 0 : 120;
          const saturation = Math.min(100, Math.abs(totalPotential) * 200);
          
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, 50%, 0.3)`;
          
          const pixelX = centerX + x * (width / 2.5);
          const pixelY = centerY - y * (height / 2.5);
          const pixelSize = width / resolution;
          
          ctx.fillRect(pixelX - pixelSize/2, pixelY - pixelSize/2, pixelSize, pixelSize);
        }
      }
      
      // Draw habit centers
      habits.forEach(habit => {
        const habitX = centerX + habit.x * (width / 2.5);
        const habitY = centerY - habit.y * (height / 2.5);
        
        const colors = {
          'beneficial': '#22c55e',
          'problematic': '#ef4444',
          'neutral': '#6b7280'
        };
        
        ctx.fillStyle = colors[habit.type];
        
        const size = 8 + habit.strength * 12;
        ctx.beginPath();
        ctx.arc(habitX, habitY, size, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(habit.name, habitX, habitY + size + 15);
        
        const triggered = isHabitTriggered(habit, behaviorState.timeOfDay, params.stress, 'normal');
        if (triggered) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(habitX, habitY, size + 8, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      
      // Draw force vectors
      const currentX = centerX + behaviorState.x * (width / 2.5);
      const currentY = centerY - behaviorState.y * (height / 2.5);
      
      habits.forEach(habit => {
        const { forceX, forceY, influence } = getHabitInfluence(behaviorState.x, behaviorState.y, habit, params);
        const triggered = isHabitTriggered(habit, behaviorState.timeOfDay, params.stress, 'normal');
        
        if (influence > 0.05 || triggered) {
          const habitX = centerX + habit.x * (width / 2.5);
          const habitY = centerY - habit.y * (height / 2.5);
          
          const forceStrength = Math.sqrt(forceX * forceX + forceY * forceY);
          const maxForce = 0.5;
          const normalizedForce = Math.min(forceStrength / maxForce, 1);
          
          if (normalizedForce > 0.1) {
            let arrowColor = '#888';
            if (triggered) {
              arrowColor = habit.type === 'problematic' ? '#ff6b6b' : 
                          habit.type === 'beneficial' ? '#51cf66' : '#ffd43b';
            } else {
              arrowColor = habit.type === 'problematic' ? '#ff9999' : 
                          habit.type === 'beneficial' ? '#99ff99' : '#ffff99';
            }
            
            const alpha = 0.3 + normalizedForce * 0.7;
            ctx.strokeStyle = arrowColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1 + normalizedForce * 3;
            
            const dx = habitX - currentX;
            const dy = habitY - currentY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 20) {
              const arrowLength = 30 + normalizedForce * 40;
              const arrowEndX = currentX + (dx / distance) * arrowLength;
              const arrowEndY = currentY + (dy / distance) * arrowLength;
              
              ctx.beginPath();
              ctx.moveTo(currentX, currentY);
              ctx.lineTo(arrowEndX, arrowEndY);
              ctx.stroke();
              
              const angle = Math.atan2(dy, dx);
              const headLength = 8 + normalizedForce * 6;
              const headAngle = Math.PI / 6;
              
              ctx.beginPath();
              ctx.moveTo(arrowEndX, arrowEndY);
              ctx.lineTo(
                arrowEndX - headLength * Math.cos(angle - headAngle),
                arrowEndY - headLength * Math.sin(angle - headAngle)
              );
              ctx.moveTo(arrowEndX, arrowEndY);
              ctx.lineTo(
                arrowEndX - headLength * Math.cos(angle + headAngle),
                arrowEndY - headLength * Math.sin(angle + headAngle)
              );
              ctx.stroke();
            }
            
            ctx.globalAlpha = 1;
          }
        }
      });
    }
    
    // Draw current position
    const currentX = centerX + behaviorState.x * (width / 2.5);
    const currentY = centerY - behaviorState.y * (height / 2.5);
    
    const energyHue = behaviorState.energy * 120;
    ctx.fillStyle = `hsl(${energyHue}, 70%, 60%)`;
    
    ctx.beginPath();
    ctx.arc(currentX, currentY, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw velocity vector
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(
      currentX + behaviorState.dx * 50,
      currentY - behaviorState.dy * 50
    );
    ctx.stroke();
    
    // Metacognition awareness indicator
    if (params.metacognition > 0.5) {
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(currentX, currentY, 20 + params.metacognition * 30, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Time display
    const hour = Math.floor(behaviorState.timeOfDay);
    const minute = Math.floor((behaviorState.timeOfDay - hour) * 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`, width - 80, 25);
    
    // Draw mood and cognitive load bars
    const barWidth = 20;
    const barHeight = 150;
    const barX = width - 150;
    const barY = 50;
    
    // Mood bar
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    const moodHeight = smoothedMood * barHeight;
    const moodHue = smoothedMood * 120;
    ctx.fillStyle = `hsl(${moodHue}, 70%, 60%)`;
    ctx.fillRect(barX, barY + barHeight - moodHeight, barWidth, moodHeight);
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Mood', barX + barWidth/2, barY + barHeight + 15);
    ctx.fillText(`${(smoothedMood * 100).toFixed(0)}%`, barX + barWidth/2, barY + barHeight + 30);
    
    // Cognitive Load bar
    const cogBarX = barX + 35;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(cogBarX, barY, barWidth, barHeight);
    
    const cogLoadHeight = smoothedCogLoad * barHeight;
    ctx.fillStyle = `hsl(${(1-smoothedCogLoad) * 60}, 70%, 50%)`;
    ctx.fillRect(cogBarX, barY + barHeight - cogLoadHeight, barWidth, cogLoadHeight);
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(cogBarX, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Mental', cogBarX + barWidth/2, barY + barHeight + 15);
    ctx.fillText('Load', cogBarX + barWidth/2, barY + barHeight + 30);
    ctx.fillText(`${(smoothedCogLoad * 100).toFixed(0)}%`, cogBarX + barWidth/2, barY + barHeight + 45);
    
  }, [viewMode, trajectory, behaviorState, habits, params, getHabitInfluence, isHabitTriggered, smoothedMood, smoothedCogLoad]);

  const animate = useCallback(() => {
    if (!isRunning) return;
    
    const dt = 0.02;
    const newState = updateBehaviorDynamics(behaviorState, habits, params, dt);
    
    setBehaviorState(newState);
    setTime(t => t + dt);
    
    // Smooth mood and cognitive load transitions
    const targetMood = calculateMood();
    const targetCogLoad = calculateCognitiveLoad();
    
    const smoothingFactor = 0.05;
    setSmoothedMood(prev => prev + (targetMood - prev) * smoothingFactor);
    setSmoothedCogLoad(prev => prev + (targetCogLoad - prev) * smoothingFactor);
    
    setTrajectory(prev => {
      const newTrajectory = [...prev, { x: newState.x, y: newState.y }];
      return newTrajectory.slice(-300);
    });
    
    if (newState.currentHabit) {
      setHabitHistory(prev => {
        const recent = [...prev, {
          habit: newState.currentHabit.id,
          time: time,
          timeOfDay: newState.timeOfDay
        }];
        return recent.slice(-50);
      });
    }
    
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [isRunning, behaviorState, habits, params, time, updateBehaviorDynamics, calculateMood, calculateCognitiveLoad, draw]);

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
    setBehaviorState({
      x: 0.1,
      y: 0.1,
      dx: 0,
      dy: 0,
      currentHabit: null,
      energy: 0.8,
      timeOfDay: 8
    });
    setTrajectory([]);
    setHabitHistory([]);
    setSmoothedMood(0.6);
    setSmoothedCogLoad(0.3);
    setHabits([
      { id: 'phone', name: 'Phone Checking', type: 'problematic', strength: 0.8, x: -0.3, y: 0.2, triggers: ['boredom', 'transition'] },
      { id: 'coffee', name: 'Morning Coffee', type: 'neutral', strength: 0.9, x: 0.1, y: 0.6, triggers: ['wake'] },
      { id: 'exercise', name: 'Workout', type: 'beneficial', strength: 0.4, x: 0.6, y: 0.3, triggers: ['scheduled'] },
      { id: 'reading', name: 'Evening Reading', type: 'beneficial', strength: 0.3, x: 0.4, y: -0.4, triggers: ['bedtime'] },
      { id: 'snacking', name: 'Stress Snacking', type: 'problematic', strength: 0.6, x: -0.5, y: -0.2, triggers: ['stress', 'afternoon'] },
      { id: 'email', name: 'Email Check', type: 'neutral', strength: 0.7, x: 0.0, y: 0.0, triggers: ['work_start', 'notification'] }
    ]);
    setParams({
      metacognition: 0.3,
      willpower: 0.5,
      environmentDesign: 0.4,
      stress: 0.3,
      socialInfluence: 0.5,
      consistency: 0.6
    });
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const triggerStress = () => {
    setParams(prev => ({ ...prev, stress: 0.8, willpower: 0.3 }));
  };

  const improveEnvironment = () => {
    setParams(prev => ({ 
      ...prev, 
      environmentDesign: 0.9,
      stress: 0.2
    }));
    
    setHabits(prev => prev.map(habit => {
      if (habit.type === 'beneficial') {
        return {
          ...habit,
          x: habit.x * 0.7,
          y: habit.y * 0.7
        };
      } else if (habit.type === 'problematic') {
        return {
          ...habit,
          x: habit.x * 1.3,
          y: habit.y * 1.3
        };
      }
      return habit;
    }));
  };

  const enhanceAwareness = () => {
    setParams(prev => ({ 
      ...prev, 
      metacognition: 0.9,
      willpower: 0.8
    }));
    
    setHabits(prev => prev.map(habit => ({
      ...habit,
      strength: Math.max(0.2, habit.strength * 0.8)
    })));
  };

  const strengthenHabit = (habitId, delta) => {
    setHabits(prev => prev.map(h => 
      h.id === habitId 
        ? { ...h, strength: Math.max(0, Math.min(1, h.strength + delta)) }
        : h
    ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Personal Habit Landscape
        </h2>
        <p className="text-gray-300 text-sm">
          Interactive model of habit attractors and behavioral patterns throughout the day.
          Landscape view shows habit basins, environmental forces, and force vectors.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Created by Justin Shenk • <a href="mailto:shenkjustin@gmail.com" className="text-blue-400 hover:text-blue-300">shenkjustin@gmail.com</a>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <canvas
            ref={canvasRef}
            width={600}
            height={500}
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
              onClick={triggerStress}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
            >
              Stress Episode
            </button>
            
            <button
              onClick={improveEnvironment}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
            >
              Improve Environment
            </button>
            
            <button
              onClick={enhanceAwareness}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Enhance Awareness
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-300">System Parameters</h3>
            
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label className="block text-sm text-gray-300 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}: {value.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={value}
                  onChange={(e) => setParams(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value)
                  }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-300">Current State</h3>
            <div className="text-sm space-y-1">
              <div>Position: ({behaviorState.x.toFixed(2)}, {behaviorState.y.toFixed(2)})</div>
              <div>Energy: {behaviorState.energy.toFixed(2)}</div>
              <div>Mood: {(smoothedMood * 100).toFixed(0)}%</div>
              <div>Mental Load: {(smoothedCogLoad * 100).toFixed(0)}%</div>
              <div>Current Habit: {behaviorState.currentHabit?.name || 'None'}</div>
              <div>Time: {Math.floor(behaviorState.timeOfDay)}:{Math.floor((behaviorState.timeOfDay % 1) * 60).toString().padStart(2, '0')}</div>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-yellow-300">Habit Strengths</h3>
            <div className="space-y-2">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between">
                  <span className={`text-xs ${
                    habit.type === 'beneficial' ? 'text-green-400' :
                    habit.type === 'problematic' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {habit.name}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => strengthenHabit(habit.id, -0.1)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                    >
                      -
                    </button>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs min-w-[3rem] text-center">
                      {(habit.strength * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() => strengthenHabit(habit.id, 0.1)}
                      className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-cyan-300">Legend</h3>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Beneficial habits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Problematic habits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span>Neutral habits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-yellow-400"></div>
                <span>Triggered habit (dashed)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-purple-400"></div>
                <span>Metacognitive awareness</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-blue-400"></div>
                <span>Force vectors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-cyan-300">How Habit Landscapes Work</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Attractor Basins:</strong> Each habit creates a "gravity well" - stronger habits have deeper basins that are harder to escape</p>
          <p><strong>Force Vectors:</strong> Arrows show the psychological "pull" you feel toward different habits - thickness shows strength</p>
          <p><strong>Improve Environment:</strong> Moves beneficial habits closer to you, problematic habits further away, reduces environmental stress</p>
          <p><strong>Enhance Awareness:</strong> Reduces all habit automaticity, increases willpower and metacognitive control over choices</p>
          <p><strong>Mood & Mental Load:</strong> Live bars show emotional state and cognitive fatigue - smoothly transition based on habit patterns</p>
          <p><strong>Key Insight:</strong> Don't rely on willpower alone - reshape your environment to make good habits easier and bad habits harder</p>
        </div>
      </div>
    </div>
  );
};

export default HabitLandscape;