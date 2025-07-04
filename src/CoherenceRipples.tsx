import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Heart, Brain, Users, Eye, Wind, Zap, MessageCircle, Coffee, Waves, Mountain, TreePine } from 'lucide-react';

const CoherenceRipples = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [viewMode, setViewMode] = useState('ripples'); // 'ripples', 'oscillators', 'landscape', 'ecosystem'
  
  // System parameters
  const [params, setParams] = useState({
    breathCoherence: 0.7,
    metacognition: 0.5,
    stressLevel: 0.3,
    socialSupport: 0.6,
    breathRate: 6,
    intervention: 0.0
  });
  
  // Coherence levels for each ring
  const [coherenceLevels, setCoherenceLevels] = useState({
    breath: 0.7,
    hrv: 0.6,
    emotional: 0.5,
    cognitive: 0.4,
    behavioral: 0.4,
    social: 0.3
  });
  
  // Smoothed coherence for animation
  const [smoothCoherence, setSmoothCoherence] = useState({
    breath: 0.7, hrv: 0.6, emotional: 0.5, 
    cognitive: 0.4, behavioral: 0.4, social: 0.3
  });
  
  const [breathPhase, setBreathPhase] = useState(0);
  const [flowParticles, setFlowParticles] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [scenarioTime, setScenarioTime] = useState(0);

  // Oscillator phases for each system
  const [oscillatorPhases, setOscillatorPhases] = useState({
    breath: 0, hrv: 0, emotional: 0, cognitive: 0, behavioral: 0, social: 0
  });

  // Flow particle system for bidirectional influences
  const createFlowParticle = useCallback((fromRing, toRing, type, strength) => {
    const rings = [
      { name: 'breath', radius: 40 },
      { name: 'hrv', radius: 80 },
      { name: 'emotional', radius: 120 },
      { name: 'cognitive', radius: 160 },
      { name: 'behavioral', radius: 200 },
      { name: 'social', radius: 240 }
    ];
    
    const fromIndex = rings.findIndex(r => r.name === fromRing);
    const toIndex = rings.findIndex(r => r.name === toRing);
    
    if (fromIndex === -1 || toIndex === -1) return null;
    
    const angle = Math.random() * 2 * Math.PI;
    
    return {
      id: Math.random(),
      fromRadius: rings[fromIndex].radius,
      toRadius: rings[toIndex].radius,
      angle: angle,
      progress: 0,
      type: type,
      strength: strength,
      life: 1.0
    };
  }, []);

  // Calculate bidirectional influences
  const calculateBidirectionalFlow = useCallback((coherence, params) => {
    const flows = [];
    
    if (coherence.breath > 0.6) {
      flows.push({ from: 'breath', to: 'hrv', type: 'coherence', strength: coherence.breath });
    }
    if (coherence.hrv > 0.5) {
      flows.push({ from: 'hrv', to: 'emotional', type: 'coherence', strength: coherence.hrv });
    }
    if (coherence.emotional > 0.5) {
      flows.push({ from: 'emotional', to: 'cognitive', type: 'coherence', strength: coherence.emotional });
    }
    if (coherence.cognitive > 0.5) {
      flows.push({ from: 'cognitive', to: 'behavioral', type: 'coherence', strength: coherence.cognitive });
    }
    if (coherence.behavioral > 0.5) {
      flows.push({ from: 'behavioral', to: 'social', type: 'coherence', strength: coherence.behavioral });
    }
    
    if (params.stressLevel > 0.4) {
      flows.push({ from: 'social', to: 'behavioral', type: 'disruption', strength: params.stressLevel });
      flows.push({ from: 'behavioral', to: 'cognitive', type: 'disruption', strength: params.stressLevel * 0.8 });
      flows.push({ from: 'cognitive', to: 'emotional', type: 'disruption', strength: params.stressLevel * 0.7 });
    }
    
    if (params.socialSupport > 0.6) {
      flows.push({ from: 'social', to: 'emotional', type: 'coherence', strength: params.socialSupport * 0.5 });
    }
    
    if (params.metacognition > 0.6) {
      flows.push({ from: 'cognitive', to: 'emotional', type: 'coherence', strength: params.metacognition });
      flows.push({ from: 'cognitive', to: 'breath', type: 'coherence', strength: params.metacognition * 0.7 });
    }
    
    return flows;
  }, []);

  // Update system with bidirectional influences
  const updateBidirectionalCoherence = useCallback((params, dt, scenario) => {
    let newCoherence = { ...coherenceLevels };
    
    if (scenario === 'social_stress') {
      newCoherence.social = Math.max(0.1, newCoherence.social - 0.05);
      newCoherence.behavioral = Math.max(0.1, newCoherence.behavioral - 0.03);
      newCoherence.cognitive = Math.max(0.1, newCoherence.cognitive - 0.03);
      newCoherence.emotional = Math.max(0.1, newCoherence.emotional - 0.04);
      newCoherence.hrv = Math.max(0.1, newCoherence.hrv - 0.02);
      newCoherence.breath = Math.max(0.1, newCoherence.breath - 0.02);
    } else if (scenario === 'panic_attack') {
      newCoherence.emotional = Math.max(0.05, newCoherence.emotional - 0.08);
      newCoherence.hrv = Math.max(0.1, newCoherence.hrv - 0.05);
      newCoherence.breath = Math.max(0.1, newCoherence.breath - 0.05);
      newCoherence.cognitive = Math.max(0.1, newCoherence.cognitive - 0.04);
      newCoherence.behavioral = Math.max(0.1, newCoherence.behavioral - 0.03);
    } else if (scenario === 'deep_connection') {
      newCoherence.social = Math.min(1, newCoherence.social + 0.02);
      newCoherence.emotional = Math.min(1, newCoherence.emotional + 0.02);
      newCoherence.behavioral = Math.min(1, newCoherence.behavioral + 0.015);
    } else if (scenario === 'meditation') {
      newCoherence.breath = Math.min(1, newCoherence.breath + 0.03);
      newCoherence.hrv = Math.min(1, newCoherence.hrv + 0.025);
      newCoherence.emotional = Math.min(1, newCoherence.emotional + 0.02);
      newCoherence.cognitive = Math.min(1, newCoherence.cognitive + 0.02);
    } else {
      let targetBreath = params.breathCoherence;
      if (params.intervention > 0) {
        targetBreath = Math.min(1, targetBreath + params.intervention * 0.5);
      }
      targetBreath *= (1 - params.stressLevel * 0.4);
      
      newCoherence.breath += (targetBreath - newCoherence.breath) * 0.1;
      
      const targetHrv = newCoherence.breath * 0.9 + 0.1;
      newCoherence.hrv += (targetHrv - newCoherence.hrv) * 0.08;
      
      let targetEmotional = newCoherence.hrv * 0.7 + params.metacognition * 0.2;
      targetEmotional -= params.stressLevel * 0.3;
      targetEmotional += params.socialSupport * 0.1;
      newCoherence.emotional += (targetEmotional - newCoherence.emotional) * 0.06;
      
      let targetCognitive = newCoherence.emotional * 0.6 + params.metacognition * 0.3;
      targetCognitive -= params.stressLevel * 0.2;
      newCoherence.cognitive += (targetCognitive - newCoherence.cognitive) * 0.05;
      
      const targetBehavioral = newCoherence.cognitive * 0.8 + newCoherence.emotional * 0.2;
      newCoherence.behavioral += (targetBehavioral - newCoherence.behavioral) * 0.04;
      
      let targetSocial = newCoherence.behavioral * 0.6 + params.socialSupport * 0.4;
      targetSocial -= params.stressLevel * 0.2;
      newCoherence.social += (targetSocial - newCoherence.social) * 0.03;
      
      if (newCoherence.social > 0.7) {
        newCoherence.emotional = Math.min(1, newCoherence.emotional + 0.005);
      } else if (newCoherence.social < 0.3) {
        newCoherence.emotional = Math.max(0, newCoherence.emotional - 0.005);
      }
    }
    
    Object.keys(newCoherence).forEach(key => {
      newCoherence[key] = Math.max(0, Math.min(1, newCoherence[key]));
    });
    
    return newCoherence;
  }, [coherenceLevels]);

  const drawRipplesView = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    const rings = [
      { name: 'breath', radius: 40, label: 'Breath', color: '#3b82f6' },
      { name: 'hrv', radius: 80, label: 'Heart Rate Variability', color: '#ef4444' },
      { name: 'emotional', radius: 120, label: 'Emotional State', color: '#f59e0b' },
      { name: 'cognitive', radius: 160, label: 'Cognitive Function', color: '#8b5cf6' },
      { name: 'behavioral', radius: 200, label: 'Behavioral Patterns', color: '#06b6d4' },
      { name: 'social', radius: 240, label: 'Social Relations', color: '#10b981' }
    ];
    
    // Draw breathing center
    const breathSize = rings[0].radius + Math.sin(breathPhase * 2 * Math.PI) * 15;
    const breathAlpha = 0.3 + smoothCoherence.breath * 0.5;
    
    ctx.fillStyle = `rgba(59, 130, 246, ${breathAlpha})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, breathSize, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw ripple effects
    for (let i = 0; i < 3; i++) {
      const ripplePhase = (breathPhase + i * 0.33) % 1;
      const rippleRadius = breathSize + ripplePhase * 100;
      const rippleAlpha = (1 - ripplePhase) * smoothCoherence.breath * 0.2;
      
      if (rippleAlpha > 0.01) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${rippleAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, rippleRadius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
    
    // Draw bidirectional flow arrows
    rings.forEach((ring, index) => {
      if (index > 0) {
        const prevRing = rings[index - 1];
        const prevCoherence = smoothCoherence[prevRing.name];
        
        if (prevCoherence > 0.4) {
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * 2 * Math.PI + time * 0.5;
            const arrowStart = {
              x: centerX + Math.cos(angle) * prevRing.radius,
              y: centerY + Math.sin(angle) * prevRing.radius
            };
            const arrowEnd = {
              x: centerX + Math.cos(angle) * (prevRing.radius + 20),
              y: centerY + Math.sin(angle) * (prevRing.radius + 20)
            };
            
            ctx.strokeStyle = `rgba(59, 130, 246, ${prevCoherence * 0.8})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(arrowStart.x, arrowStart.y);
            ctx.lineTo(arrowEnd.x, arrowEnd.y);
            ctx.stroke();
            
            const headAngle = Math.atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
            ctx.beginPath();
            ctx.moveTo(arrowEnd.x, arrowEnd.y);
            ctx.lineTo(
              arrowEnd.x - 8 * Math.cos(headAngle - Math.PI/6),
              arrowEnd.y - 8 * Math.sin(headAngle - Math.PI/6)
            );
            ctx.moveTo(arrowEnd.x, arrowEnd.y);
            ctx.lineTo(
              arrowEnd.x - 8 * Math.cos(headAngle + Math.PI/6),
              arrowEnd.y - 8 * Math.sin(headAngle + Math.PI/6)
            );
            ctx.stroke();
          }
        }
        
        if (params.stressLevel > 0.4 && index >= 3) {
          for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * 2 * Math.PI + time * -0.7;
            const arrowStart = {
              x: centerX + Math.cos(angle) * ring.radius,
              y: centerY + Math.sin(angle) * ring.radius
            };
            const arrowEnd = {
              x: centerX + Math.cos(angle) * (ring.radius - 20),
              y: centerY + Math.sin(angle) * (ring.radius - 20)
            };
            
            ctx.strokeStyle = `rgba(239, 68, 68, ${params.stressLevel * 0.7})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(arrowStart.x, arrowStart.y);
            ctx.lineTo(arrowEnd.x, arrowEnd.y);
            ctx.stroke();
            
            const headAngle = Math.atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
            ctx.beginPath();
            ctx.moveTo(arrowEnd.x, arrowEnd.y);
            ctx.lineTo(
              arrowEnd.x - 8 * Math.cos(headAngle - Math.PI/6),
              arrowEnd.y - 8 * Math.sin(headAngle - Math.PI/6)
            );
            ctx.moveTo(arrowEnd.x, arrowEnd.y);
            ctx.lineTo(
              arrowEnd.x - 8 * Math.cos(headAngle + Math.PI/6),
              arrowEnd.y - 8 * Math.sin(headAngle + Math.PI/6)
            );
            ctx.stroke();
          }
        }
      }
    });
    
    // Draw flow particles
    flowParticles.forEach(particle => {
      const progress = particle.progress;
      const currentRadius = particle.fromRadius + (particle.toRadius - particle.fromRadius) * progress;
      
      const x = centerX + Math.cos(particle.angle) * currentRadius;
      const y = centerY + Math.sin(particle.angle) * currentRadius;
      
      const alpha = particle.life * particle.strength;
      
      if (particle.type === 'coherence') {
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
      }
      
      ctx.beginPath();
      ctx.arc(x, y, 3 + particle.strength * 2, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw concentric rings
    rings.forEach((ring, index) => {
      const coherence = smoothCoherence[ring.name];
      
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.4 + coherence * 0.4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ring.radius, 0, 2 * Math.PI);
      ctx.stroke();
      
      const numPoints = 64;
      const waveAmplitude = 8 + coherence * 12;
      const waveFrequency = 4 + (1 - coherence) * 8;
      
      ctx.beginPath();
      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const waveOffset = Math.sin(angle * waveFrequency + time * 3) * waveAmplitude * (1 - coherence);
        const r = ring.radius + waveOffset;
        
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      const fillAlpha = coherence * 0.2;
      ctx.fillStyle = ring.color.replace('rgb', 'rgba').replace(')', `, ${fillAlpha})`);
      ctx.fill();
    });
    
    // Draw ring labels AFTER rings (higher z-index)
    rings.forEach((ring, index) => {
      const coherence = smoothCoherence[ring.name];
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1;
      
      const labelX = centerX;
      const labelY = centerY - ring.radius - 15;
      
      ctx.fillText(ring.label, labelX, labelY);
      
      ctx.font = '10px sans-serif';
      ctx.fillStyle = ring.color;
      ctx.fillText(`${(coherence * 100).toFixed(0)}%`, labelX, labelY + 15);
    });
    
    ctx.globalAlpha = 1;
  }, [smoothCoherence, breathPhase, time, params, flowParticles]);

  const drawOscillatorsView = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    const oscillators = [
      { name: 'breath', x: centerX - 200, y: centerY, color: 'rgb(59, 130, 246)', label: 'Breath' },
      { name: 'hrv', x: centerX - 120, y: centerY, color: 'rgb(239, 68, 68)', label: 'HRV' },
      { name: 'emotional', x: centerX - 40, y: centerY, color: 'rgb(245, 158, 11)', label: 'Emotional' },
      { name: 'cognitive', x: centerX + 40, y: centerY, color: 'rgb(139, 92, 246)', label: 'Cognitive' },
      { name: 'behavioral', x: centerX + 120, y: centerY, color: 'rgb(6, 182, 212)', label: 'Behavioral' },
      { name: 'social', x: centerX + 200, y: centerY, color: 'rgb(16, 185, 129)', label: 'Social' }
    ];
    
    // Draw coupling springs between oscillators
    for (let i = 0; i < oscillators.length - 1; i++) {
      const osc1 = oscillators[i];
      const osc2 = oscillators[i + 1];
      const coherence1 = smoothCoherence[osc1.name];
      const coherence2 = smoothCoherence[osc2.name];
      const coupling = (coherence1 + coherence2) / 2;
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${coupling * 0.8})`;
      ctx.lineWidth = 2 + coupling * 4;
      
      // Draw spring-like connection
      const numCoils = 8;
      const amplitude = 10 * (1 - coupling); // More coupling = straighter line
      
      ctx.beginPath();
      for (let j = 0; j <= numCoils * 4; j++) {
        const t = j / (numCoils * 4);
        const x = osc1.x + (osc2.x - osc1.x) * t;
        const y = osc1.y + Math.sin(j * Math.PI / 2) * amplitude;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    
    // Draw horizontal reference line (always visible)
    const baselineY = centerY + 60;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(oscillators[0].x - 50, baselineY);
    ctx.lineTo(oscillators[oscillators.length - 1].x + 50, baselineY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw oscillators as pendulums
    oscillators.forEach(osc => {
      const coherence = smoothCoherence[osc.name];
      const phase = oscillatorPhases[osc.name];
      
      // Pendulum parameters
      const stringLength = 60;
      const bobRadius = 8 + coherence * 8;
      const amplitude = 30 * (1 - coherence) + 10; // More coherent = smaller amplitude
      
      // Calculate pendulum position
      const angle = Math.sin(phase) * amplitude * Math.PI / 180;
      const bobX = osc.x + Math.sin(angle) * stringLength;
      const bobY = osc.y + Math.cos(angle) * stringLength;
      
      // Draw string
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(osc.x, osc.y - 20);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      
      // Draw pivot point
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(osc.x, osc.y - 20, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw pendulum bob
      ctx.fillStyle = osc.color;
      ctx.globalAlpha = 0.7 + coherence * 0.3;
      ctx.beginPath();
      ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add visual stress/scenario indicators
      if (activeScenario === 'social_stress' && (osc.name === 'social' || osc.name === 'behavioral')) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      if (activeScenario === 'panic_attack' && (osc.name === 'emotional' || osc.name === 'hrv')) {
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      if (activeScenario === 'meditation' && (osc.name === 'breath' || osc.name === 'hrv')) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      if (activeScenario === 'deep_connection' && (osc.name === 'social' || osc.name === 'emotional')) {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobRadius + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      // Draw motion trail
      const trailLength = 20;
      for (let i = 1; i <= trailLength; i++) {
        const trailPhase = phase - i * 0.1;
        const trailAngle = Math.sin(trailPhase) * amplitude * Math.PI / 180;
        const trailX = osc.x + Math.sin(trailAngle) * stringLength;
        const trailY = osc.y + Math.cos(trailAngle) * stringLength;
        const trailAlpha = (1 - i / trailLength) * coherence * 0.3;
        
        ctx.fillStyle = osc.color.replace('rgb', 'rgba').replace(')', `, ${trailAlpha})`);
        ctx.beginPath();
        ctx.arc(trailX, trailY, bobRadius * (1 - i / trailLength), 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1;
      ctx.fillText(osc.label, osc.x, osc.y + 100);
      
      // Draw coherence percentage
      ctx.font = '10px sans-serif';
      ctx.fillStyle = osc.color;
      ctx.fillText(`${(coherence * 100).toFixed(0)}%`, osc.x, osc.y + 115);
    });
    
    ctx.globalAlpha = 1;
  }, [smoothCoherence, oscillatorPhases, activeScenario]);

  const drawLandscapeView = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate overall system coherence
    const avgCoherence = Object.values(smoothCoherence).reduce((sum, val) => sum + val, 0) / 6;
    const stressLevel = params.stressLevel;
    
    // Draw 2D contour map with multiple basins
    const resolution = 50;
    const gridSize = 400;
    
    // Define attractor basins (different states)
    const basins = [
      // Coherent state (main attractor when healthy)
      { x: 0, y: 0, depth: avgCoherence * 50, radius: 100, label: 'Coherent Flow' },
      // Stress attractor
      { x: -150, y: -100, depth: stressLevel * 40, radius: 80, label: 'Stress Pattern' },
      // Dissociation attractor
      { x: 150, y: -120, depth: (1 - avgCoherence) * 30, radius: 70, label: 'Dissociation' },
      // Depression attractor
      { x: -120, y: 130, depth: (stressLevel + (1 - avgCoherence)) * 20, radius: 90, label: 'Low Energy' },
      // Agitation attractor
      { x: 140, y: 100, depth: (stressLevel * (1 - params.metacognition)) * 35, radius: 75, label: 'Agitation' }
    ];
    
    // Create energy landscape
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = (i / resolution - 0.5) * gridSize;
        const y = (j / resolution - 0.5) * gridSize;
        
        // Calculate energy at this point based on all basins
        let energy = 20; // Base energy level
        
        basins.forEach(basin => {
          const dx = x - basin.x;
          const dy = y - basin.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Each basin creates a depression in the energy landscape
          if (dist < basin.radius * 2) {
            const influence = Math.exp(-dist * dist / (basin.radius * basin.radius));
            energy -= basin.depth * influence;
          }
        });
        
        // Add some terrain variation
        energy += Math.sin(x * 0.02) * Math.cos(y * 0.02) * 5;
        
        // Draw contour lines
        const screenX = centerX + x;
        const screenY = centerY + y;
        
        // Color based on energy level (contour mapping)
        const normalizedEnergy = (energy + 50) / 100; // Normalize to 0-1
        const contourLevel = Math.floor(normalizedEnergy * 10) / 10;
        
        // Create discrete contour bands
        let hue, saturation, lightness;
        if (energy < -30) {
          // Very deep (strong attractor)
          hue = 240;
          saturation = 80;
          lightness = 20 + contourLevel * 10;
        } else if (energy < -10) {
          // Moderate depth
          hue = 200;
          saturation = 60;
          lightness = 30 + contourLevel * 15;
        } else if (energy < 10) {
          // Shallow
          hue = 160;
          saturation = 40;
          lightness = 40 + contourLevel * 10;
        } else {
          // High energy (barriers)
          hue = 30;
          saturation = 50;
          lightness = 50 + contourLevel * 10;
        }
        
        // Draw as small rectangles to create smooth contours
        const cellSize = gridSize / resolution;
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
        
        // Draw contour lines at specific energy levels
        if (Math.abs(energy % 10) < 1) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenX - cellSize/2, screenY - cellSize/2, cellSize, cellSize);
        }
      }
    }
    
    // Draw basin labels
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    basins.forEach(basin => {
      if (basin.depth > 10) { // Only label significant basins
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(basin.label, centerX + basin.x, centerY + basin.y - basin.radius - 10);
      }
    });
    
    // Draw system state ball
    let targetBasin = basins[0]; // Default to coherent state
    let maxAttraction = 0;
    
    // Find which basin has strongest pull
    basins.forEach((basin, index) => {
      const attraction = basin.depth;
      if (attraction > maxAttraction && index !== 0) {
        maxAttraction = attraction;
        targetBasin = basin;
      }
    });
    
    // Ball position moves towards strongest attractor
    const ballTargetX = centerX + targetBasin.x * (targetBasin.depth / 50);
    const ballTargetY = centerY + targetBasin.y * (targetBasin.depth / 50);
    
    // Add some movement dynamics
    const ballX = ballTargetX + Math.cos(time * 0.5) * 10 * (1 - avgCoherence);
    const ballY = ballTargetY + Math.sin(time * 0.5) * 10 * (1 - avgCoherence);
    
    // Draw ball with glow effect
    const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 15);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw ball core
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw trajectory prediction
    if (avgCoherence < 0.7) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(ballX, ballY);
      ctx.lineTo(ballTargetX, ballTargetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw title and legend
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Attractor Landscape', centerX, 30);
    ctx.font = '12px sans-serif';
    ctx.fillText('Multiple basins compete for system state - depth shows current pull strength', centerX, 50);
    
  }, [smoothCoherence, params, time]);

  const drawEcosystemView = useCallback((ctx, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw soil layer (breath)
    const soilHealth = smoothCoherence.breath;
    ctx.fillStyle = `rgba(101, 67, 33, ${0.5 + soilHealth * 0.5})`;
    ctx.fillRect(0, height - 60, width, 60);
    
    // Draw plants based on emotional/HRV health
    const plantHealth = (smoothCoherence.hrv + smoothCoherence.emotional) / 2;
    const numPlants = 15;
    
    for (let i = 0; i < numPlants; i++) {
      const x = (i / numPlants) * width + Math.sin(time + i) * 20;
      const baseHeight = 40 + plantHealth * 60;
      const height_var = Math.sin(time * 2 + i) * 10 * (1 - plantHealth);
      const plantHeight = baseHeight + height_var;
      
      // Plant stem
      ctx.strokeStyle = `rgba(34, 139, 34, ${0.3 + plantHealth * 0.7})`;
      ctx.lineWidth = 2 + plantHealth * 3;
      ctx.beginPath();
      ctx.moveTo(x, height - 60);
      ctx.lineTo(x, height - 60 - plantHeight);
      ctx.stroke();
      
      // Plant leaves/flowers
      if (plantHealth > 0.3) {
        ctx.fillStyle = `rgba(50, 205, 50, ${plantHealth})`;
        ctx.beginPath();
        ctx.arc(x, height - 60 - plantHeight, 3 + plantHealth * 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Draw animals (behavioral patterns)
    const animalActivity = smoothCoherence.behavioral;
    if (animalActivity > 0.3) {
      const numAnimals = Math.floor(animalActivity * 8);
      for (let i = 0; i < numAnimals; i++) {
        const x = 50 + i * 70 + Math.sin(time + i) * 30;
        const y = height - 80 - Math.abs(Math.sin(time * 2 + i)) * 20;
        
        ctx.fillStyle = `rgba(139, 69, 19, ${animalActivity})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + animalActivity * 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Draw sky (cognitive clarity)
    const skyClarity = smoothCoherence.cognitive;
    const skyColor = skyClarity > 0.5 ? [135, 206, 235] : [70, 70, 70]; // Blue or gray
    ctx.fillStyle = `rgba(${skyColor[0]}, ${skyColor[1]}, ${skyColor[2]}, ${0.3 + skyClarity * 0.4})`;
    ctx.fillRect(0, 0, width, height * 0.6);
    
    // Draw sun (social connections)
    const socialWarmth = smoothCoherence.social;
    if (socialWarmth > 0.3) {
      const sunX = width * 0.8;
      const sunY = height * 0.2;
      const sunRadius = 20 + socialWarmth * 20;
      
      ctx.fillStyle = `rgba(255, 215, 0, ${socialWarmth})`;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Sun rays
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * 2 * Math.PI;
        const rayLength = 30 + socialWarmth * 20;
        ctx.strokeStyle = `rgba(255, 215, 0, ${socialWarmth * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          sunX + Math.cos(angle) * sunRadius,
          sunY + Math.sin(angle) * sunRadius
        );
        ctx.lineTo(
          sunX + Math.cos(angle) * (sunRadius + rayLength),
          sunY + Math.sin(angle) * (sunRadius + rayLength)
        );
        ctx.stroke();
      }
    }
    
    // Draw ecosystem health indicator
    const ecosystemHealth = Object.values(smoothCoherence).reduce((sum, val) => sum + val, 0) / 6;
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Ecosystem Health: ${(ecosystemHealth * 100).toFixed(0)}%`, centerX, 30);
    
  }, [smoothCoherence, time]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw based on view mode
    switch (viewMode) {
      case 'ripples':
        drawRipplesView(ctx, width, height);
        break;
      case 'oscillators':
        drawOscillatorsView(ctx, width, height);
        break;
      case 'landscape':
        drawLandscapeView(ctx, width, height);
        break;
      case 'ecosystem':
        drawEcosystemView(ctx, width, height);
        break;
    }
    
    // Draw scenario indicator
    if (activeScenario) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Active: ${activeScenario.replace('_', ' ').toUpperCase()}`, width/2, height - 30);
    }
    
    // Overall system coherence
    const avgCoherence = Object.values(smoothCoherence).reduce((sum, val) => sum + val, 0) / 6;
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`System Coherence: ${(avgCoherence * 100).toFixed(0)}%`, width - 20, 30);
    
    ctx.globalAlpha = 1;
  }, [viewMode, drawRipplesView, drawOscillatorsView, drawLandscapeView, drawEcosystemView, activeScenario, smoothCoherence]);

  const animate = useCallback(() => {
    if (!isRunning) return;
    
    const dt = 0.03;
    setTime(t => t + dt);
    
    // Update breath phase
    const breathFreq = params.breathRate / 60;
    setBreathPhase(prev => (prev + dt * breathFreq) % 1);
    
    // Update oscillator phases
    setOscillatorPhases(prev => {
      const newPhases = {};
      Object.keys(prev).forEach(key => {
        const coherence = smoothCoherence[key];
        const frequency = 0.5 + coherence * 1.5; // More coherent = higher frequency
        const coupling = key === 'breath' ? 0 : smoothCoherence.breath * 0.3; // Coupling to breath
        newPhases[key] = prev[key] + dt * frequency * 2 * Math.PI + coupling;
      });
      return newPhases;
    });
    
    // Handle scenarios
    if (activeScenario) {
      setScenarioTime(prev => prev + dt);
      
      if (scenarioTime > 5) {
        setActiveScenario(null);
        setScenarioTime(0);
      }
    }
    
    // Calculate new coherence levels
    const newCoherence = updateBidirectionalCoherence(params, dt, activeScenario);
    setCoherenceLevels(newCoherence);
    
    // Create flow particles for ripples view
    if (viewMode === 'ripples' && Math.random() < 0.1) {
      const flows = calculateBidirectionalFlow(smoothCoherence, params);
      flows.forEach(flow => {
        if (Math.random() < flow.strength) {
          const particle = createFlowParticle(flow.from, flow.to, flow.type, flow.strength);
          if (particle) {
            setFlowParticles(prev => [...prev, particle]);
          }
        }
      });
    }
    
    // Update flow particles
    setFlowParticles(prev => prev
      .map(particle => ({
        ...particle,
        progress: particle.progress + dt * 0.5,
        life: particle.life - dt * 0.5
      }))
      .filter(particle => particle.progress < 1 && particle.life > 0)
    );
    
    // Smooth coherence transitions
    const smoothingFactor = 0.05;
    setSmoothCoherence(prev => {
      const smoothed = {};
      Object.keys(prev).forEach(key => {
        smoothed[key] = prev[key] + (newCoherence[key] - prev[key]) * smoothingFactor;
      });
      return smoothed;
    });
    
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [isRunning, params, activeScenario, scenarioTime, viewMode, updateBidirectionalCoherence, calculateBidirectionalFlow, createFlowParticle, smoothCoherence, draw]);

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
    setBreathPhase(0);
    setScenarioTime(0);
    setActiveScenario(null);
    setFlowParticles([]);
    setOscillatorPhases({ breath: 0, hrv: 0, emotional: 0, cognitive: 0, behavioral: 0, social: 0 });
    setParams({
      breathCoherence: 0.7,
      metacognition: 0.5,
      stressLevel: 0.3,
      socialSupport: 0.6,
      breathRate: 6,
      intervention: 0.0
    });
    setCoherenceLevels({
      breath: 0.7, hrv: 0.6, emotional: 0.5,
      cognitive: 0.4, behavioral: 0.4, social: 0.3
    });
    setSmoothCoherence({
      breath: 0.7, hrv: 0.6, emotional: 0.5,
      cognitive: 0.4, behavioral: 0.4, social: 0.3
    });
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const runScenario = (scenario) => {
    setActiveScenario(scenario);
    setScenarioTime(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-900 text-white rounded-lg border border-gray-700" style={{backgroundColor: '#111827', color: '#ffffff'}}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2 flex items-center gap-2">
          <Wind className="w-6 h-6" />
          Systemic Coherence Dynamics
        </h2>
        <p className="text-gray-300 text-sm">
          Multiple visualizations of how breathing coherence creates systemic harmony. 
          Switch between views to understand the dynamics from different perspectives.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Created by Justin Shenk • <a href="mailto:shenkjustin@gmail.com" className="text-blue-400 hover:text-blue-300">shenkjustin@gmail.com</a>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* View Mode Selector */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setViewMode('ripples')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm text-white border transition-colors ${viewMode === 'ripples' ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}`}
            >
              <Waves className="w-4 h-4" />
              Ripples
            </button>
            <button
              onClick={() => setViewMode('oscillators')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm text-white border transition-colors ${viewMode === 'oscillators' ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}`}
            >
              <Heart className="w-4 h-4" />
              Oscillators
            </button>
            <button
              onClick={() => setViewMode('landscape')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm text-white border transition-colors ${viewMode === 'landscape' ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}`}
            >
              <Mountain className="w-4 h-4" />
              Energy Landscape
            </button>
            <button
              onClick={() => setViewMode('ecosystem')}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm text-white border transition-colors ${viewMode === 'ecosystem' ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-500 hover:bg-gray-600'}`}
            >
              <TreePine className="w-4 h-4" />
              Ecosystem
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="border border-gray-600 rounded-lg bg-black w-full"
          />
          
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={toggleSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-blue-400 rounded-lg transition-colors"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          
          {/* Scenario Buttons */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-white mb-2">Scenarios:</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => runScenario('social_stress')}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white border border-red-400 rounded-lg transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Social Conflict
              </button>
              
              <button
                onClick={() => runScenario('panic_attack')}
                className="flex items-center gap-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white border border-orange-400 rounded-lg transition-colors text-sm"
              >
                <Zap className="w-4 h-4" />
                Panic Attack
              </button>
              
              <button
                onClick={() => runScenario('meditation')}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white border border-green-400 rounded-lg transition-colors text-sm"
              >
                <Wind className="w-4 h-4" />
                Meditation
              </button>
              
              <button
                onClick={() => runScenario('deep_connection')}
                className="flex items-center gap-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white border border-teal-400 rounded-lg transition-colors text-sm"
              >
                <Heart className="w-4 h-4" />
                Deep Connection
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* System Parameters */}
          <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-white">System Parameters</h3>
            
            <div className="mb-3">
              <label className="block text-sm text-white mb-1">
                Breath Coherence: {params.breathCoherence.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.breathCoherence}
                onChange={(e) => setParams(prev => ({
                  ...prev,
                  breathCoherence: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-white mb-1">
                Metacognition: {params.metacognition.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.metacognition}
                onChange={(e) => setParams(prev => ({
                  ...prev,
                  metacognition: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-white mb-1">
                Stress Level: {params.stressLevel.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.stressLevel}
                onChange={(e) => setParams(prev => ({
                  ...prev,
                  stressLevel: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm text-white mb-1">
                Social Support: {params.socialSupport.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={params.socialSupport}
                onChange={(e) => setParams(prev => ({
                  ...prev,
                  socialSupport: parseFloat(e.target.value)
                }))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Coherence Levels */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-green-300">Coherence Levels</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-400">Breath:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-blue-400 h-2 rounded transition-all duration-300"
                      style={{ width: `${smoothCoherence.breath * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{(smoothCoherence.breath * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400">HRV:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-red-400 h-2 rounded transition-all duration-300"
                      style={{ width: `${smoothCoherence.hrv * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{(smoothCoherence.hrv * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Emotional:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-yellow-400 h-2 rounded transition-all duration-300"
                      style={{ width: `${smoothCoherence.emotional * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{(smoothCoherence.emotional * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400">Cognitive:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-purple-400 h-2 rounded transition-all duration-300"
                      style={{ width: `${smoothCoherence.cognitive * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{(smoothCoherence.cognitive * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400">Behavioral:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-cyan-400 h-2 rounded transition-all duration-300"
                      style={{ width: `${smoothCoherence.behavioral * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{(smoothCoherence.behavioral * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400">Social:</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-700 h-2 rounded">
                    <div 
                      className="bg-emerald-400 h-2 rounded transition-all duration-300"
                      style={{ width: `${smoothCoherence.social * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right">{(smoothCoherence.social * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
              <div>Breath drives HRV → Emotional → Cognitive → Behavioral → Social</div>
              <div>Social support and stress create bidirectional feedback</div>
            </div>
          </div>

          {/* View-specific Legend */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-cyan-300">
              {viewMode === 'ripples' && 'Ripples View'}
              {viewMode === 'oscillators' && 'Oscillators View'}
              {viewMode === 'landscape' && 'Energy Landscape'}
              {viewMode === 'ecosystem' && 'Ecosystem View'}
            </h3>
            <div className="text-xs space-y-1">
              {viewMode === 'ripples' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-blue-400"></div>
                    <span>Blue arrows = Coherence flowing outward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-red-400"></div>
                    <span>Red arrows = Stress flowing inward</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Green particles = Coherence influence</span>
                  </div>
                </>
              )}
              {viewMode === 'oscillators' && (
                <>
                  <div className="text-gray-400">Each pendulum represents a system level</div>
                  <div className="text-gray-400">Coherent systems = synchronized swinging</div>
                  <div className="text-gray-400">Coupling springs show interconnection strength</div>
                  <div className="text-gray-400">Motion trails show phase relationships</div>
                </>
              )}
              {viewMode === 'landscape' && (
                <>
                  <div className="text-gray-400">Blue valleys = stable, coherent states</div>
                  <div className="text-gray-400">Red hills = unstable, chaotic regions</div>
                  <div className="text-gray-400">White dot = current system state</div>
                  <div className="text-gray-400">Deeper wells = stronger attractors</div>
                </>
              )}
              {viewMode === 'ecosystem' && (
                <>
                  <div className="text-gray-400">Soil = breath foundation</div>
                  <div className="text-gray-400">Plants = emotional/HRV health</div>
                  <div className="text-gray-400">Animals = behavioral patterns</div>
                  <div className="text-gray-400">Sky = cognitive clarity</div>
                  <div className="text-gray-400">Sun = social warmth/connection</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-cyan-300">Understanding System Dynamics</h3>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Ripples View:</strong> Shows bidirectional flow between system levels - coherence propagating outward, stress cascading inward</p>
          <p><strong>Oscillators View:</strong> Reveals synchronization patterns - coherent systems swing in harmony, chaos breaks coupling</p>
          <p><strong>Energy Landscape:</strong> Visualizes stability basins - coherent states are valleys, stress creates hills to escape</p>
          <p><strong>Ecosystem View:</strong> Living metaphor - breath is soil, emotions are plants, cognition is sky, social connections are sunlight</p>
          <p><strong>Key Insight:</strong> Same dynamics, different perspectives - choose the view that makes the system most intuitive for you</p>
        </div>
      </div>
    </div>
  );
};

export default CoherenceRipples;