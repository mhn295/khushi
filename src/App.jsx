import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Sparkles, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function BirthdayWebsite() {
  const [screen, setScreen] = useState('landing');
  const [letterIndex, setLetterIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [particles, setParticles] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [nameRevealed, setNameRevealed] = useState([]);
  const [heartBurst, setHeartBurst] = useState([]);
  const [starBurst, setStarBurst] = useState([]);
  const canvasRef = useRef(null);

  const letterLines = [
    "We've known each other longer than we admit.",
    "We fight a lot. Still talk every day.",
    "You pretend like you're 'naSamajh', but you're not. You just don't see your own potential yet.",
    "You get happy with small things — and honestly, that's one of your best traits.",
    "I hope you start trusting yourself a little more this year. (mtlb apko aqal aa jy)"
  ];

  const timeline = [
    { 
      icon: '👥', 
      title: 'Strangers', 
      text: 'Same class. Different worlds.',
      color: 'from-blue-400 to-cyan-400',
      shadowColor: 'rgba(59, 130, 246, 0.5)'
    },
    { 
      icon: '💬', 
      title: 'Talking', 
      text: 'Somehow became daily.',
      color: 'from-purple-400 to-pink-400',
      shadowColor: 'rgba(168, 85, 247, 0.5)'
    },
    { 
      icon: '⚡', 
      title: 'Arguments', 
      text: 'Temporary fights. Permanent return.',
      color: 'from-orange-400 to-red-400',
      shadowColor: 'rgba(251, 146, 60, 0.5)'
    },
    { 
      icon: '✨', 
      title: 'Now', 
      text: 'Good friends. Pakky dushman. Welly loog.',
      color: 'from-pink-400 to-purple-400',
      shadowColor: 'rgba(236, 72, 153, 0.5)'
    }
  ];

  const names = [
    { text: 'Short', emoji: '📏', color: 'from-pink-300 to-rose-300' },
    { text: 'Nasamajh', emoji: '🤷‍♀️', color: 'from-purple-300 to-indigo-300' },
    { text: 'Nanha sitara ⭐', emoji: '✨', color: 'from-yellow-300 to-amber-300' },
    { text: 'Ajeeb Aurat', emoji: '👧', color: 'from-purple-300 to-indigo-300' },
    { text: 'Pretty little baby (maybe)', emoji: '👶', color: 'from-blue-300 to-cyan-300' },
    { text: 'Rishty turwany wali aunty', emoji: '👵', color: 'from-purple-300 to-indigo-300' },
  ];

  // Enhanced particle system
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: 3 + Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.3
    }));
    setParticles(newParticles);
  }, []);

  // Animated canvas background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      speed: 0.1 + Math.random() * 0.5,
      opacity: Math.random()
    }));

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;
        
        star.opacity += (Math.random() - 0.5) * 0.1;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 182, 193, ${star.opacity * 0.3})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Typing effect with enhanced animation
  useEffect(() => {
    if (screen === 'letter') {
      setIsTyping(true);
      setTypedText('');
      const currentLine = letterLines[letterIndex];
      let currentChar = 0;

      const typingInterval = setInterval(() => {
        if (currentChar <= currentLine.length) {
          setTypedText(currentLine.slice(0, currentChar));
          currentChar++;
          
          // Add random heart burst while typing
          if (Math.random() > 0.95) {
            const burst = {
              id: Date.now(),
              x: 50 + (Math.random() - 0.5) * 30,
              y: 50 + (Math.random() - 0.5) * 30
            };
            setHeartBurst(prev => [...prev, burst]);
            setTimeout(() => {
              setHeartBurst(prev => prev.filter(b => b.id !== burst.id));
            }, 1000);
          }
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 35);

      return () => clearInterval(typingInterval);
    }
  }, [letterIndex, screen]);

  // Touch handlers for timeline swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && timelineIndex < timeline.length - 1) {
      handleTimelineNext();
    }
    if (isRightSwipe && timelineIndex > 0) {
      handleTimelinePrev();
    }
  };

  const handleTimelineNext = () => {
    if (timelineIndex < timeline.length - 1) {
      setSwipeDirection('left');
      setTimeout(() => {
        setTimelineIndex(timelineIndex + 1);
        setSwipeDirection(null);
      }, 300);
    }
  };

  const handleTimelinePrev = () => {
    if (timelineIndex > 0) {
      setSwipeDirection('right');
      setTimeout(() => {
        setTimelineIndex(timelineIndex - 1);
        setSwipeDirection(null);
      }, 300);
    }
  };

  const handleNextLetter = () => {
    if (letterIndex < letterLines.length - 1) {
      setLetterIndex(letterIndex + 1);
    } else {
      setScreen('timeline');
    }
  };

  const handleNameReveal = (index) => {
    if (!nameRevealed.includes(index)) {
      setNameRevealed([...nameRevealed, index]);
      
      // Star burst effect
      const burst = Array.from({ length: 8 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        angle: (i * 45) * Math.PI / 180
      }));
      setStarBurst(prev => [...prev, ...burst]);
      setTimeout(() => {
        setStarBurst([]);
      }, 1000);
    }
  };

  const handleFinalSmile = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Quicksand', sans-serif; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-100%) rotate(-10deg); }
          to { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%) rotate(10deg); }
          to { opacity: 1; transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(-150%) scale(0.8) rotate(-15deg); }
        }
        
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(150%) scale(0.8) rotate(15deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes floatParticle {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(-150vh) rotate(1080deg) scale(0.3); opacity: 0; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 182, 193, 0.4), 0 0 60px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 50px rgba(255, 182, 193, 0.6), 0 0 90px rgba(147, 51, 234, 0.5); }
        }
        
        @keyframes heartBurst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -250%) scale(1.5); opacity: 0; }
        }
        
        @keyframes starBurst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) translateX(var(--tx)) translateY(var(--ty)) scale(1); opacity: 0; }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes flipIn {
          0% { transform: perspective(400px) rotateY(90deg); opacity: 0; }
          100% { transform: perspective(400px) rotateY(0); opacity: 1; }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes rainbowGlow {
          0% { filter: drop-shadow(0 0 20px rgba(255, 0, 128, 0.8)); }
          25% { filter: drop-shadow(0 0 20px rgba(128, 0, 255, 0.8)); }
          50% { filter: drop-shadow(0 0 20px rgba(0, 128, 255, 0.8)); }
          75% { filter: drop-shadow(0 0 20px rgba(255, 128, 0, 0.8)); }
          100% { filter: drop-shadow(0 0 20px rgba(255, 0, 128, 0.8)); }
        }
        
        .fade-in { animation: fadeIn 1s ease-out forwards; }
        .fade-in-scale { animation: fadeInScale 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .slide-in-left { animation: slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .slide-in-right { animation: slideInRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .slide-out-left { animation: slideOutLeft 0.3s ease-in forwards; }
        .slide-out-right { animation: slideOutRight 0.3s ease-in forwards; }
        .float { animation: float 5s ease-in-out infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .bounce { animation: bounce 1.5s ease-in-out infinite; }
        .glow { animation: glow 3s ease-in-out infinite; }
        .particle { animation: floatParticle linear infinite; }
        .confetti { animation: confetti 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .heart-burst { animation: heartBurst 1s ease-out forwards; }
        .star-burst { animation: starBurst 1s ease-out forwards; }
        .wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .flip-in { animation: flipIn 0.6s ease-out forwards; }
        .scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .text-reveal { animation: textReveal 0.6s ease-out forwards; }
        .rainbow-glow { animation: rainbowGlow 3s linear infinite; }
        
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6, #ec4899);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s infinite;
        }
        
        .card-3d {
          transform-style: preserve-3d;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-3d:hover {
          transform: translateY(-10px) rotateX(5deg) rotateY(5deg) scale(1.02);
        }
        
        .button-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .button-hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transform: translate(-50%, -50%);
          transition: width 0.8s, height 0.8s;
        }
        
        .button-hover:hover::before {
          width: 400px;
          height: 400px;
        }
        
        .button-hover:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        
        .button-hover:active {
          transform: translateY(-2px) scale(1.02);
        }
        
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .cursor {
          animation: cursor-blink 0.8s infinite;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
        
        .timeline-card {
          position: absolute;
          width: 100%;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-stack {
          position: relative;
          height: 400px;
        }
      `}</style>

      {/* Animated Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Enhanced Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}

      {/* Landing Screen */}
      {screen === 'landing' && (
        <div className="text-center fade-in-scale max-w-md relative z-10">
          <div className="float mb-10 relative rainbow-glow">
            <Star className="w-24 h-24 mx-auto text-yellow-400 mb-4 drop-shadow-2xl" />
            <div className="absolute inset-0 blur-2xl opacity-60">
              <Star className="w-24 h-24 mx-auto text-yellow-300" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 leading-relaxed">
            <span className="gradient-text text-reveal">Hey nanhay sitaray ✨</span>
          </h1>
          <p className="text-3xl font-semibold text-gray-700 mb-4 text-reveal" style={{ animationDelay: '0.3s' }}>
            It's your birthday.
          </p>
          <p className="text-xl font-normal text-gray-600 mb-12 text-reveal" style={{ animationDelay: '0.6s' }}>
            Tap slowly.
          </p>
          
          <button
            onClick={() => setScreen('letter')}
            className="button-hover bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-14 py-6 rounded-full shadow-2xl font-bold text-xl relative z-10 glow"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Continue
              <Sparkles className="w-6 h-6" />
            </span>
          </button>
          
          <div className="mt-8 bounce">
            <div className="text-4xl">👇</div>
          </div>
        </div>
      )}

      {/* Letter Screen with Enhanced Animations */}
      {screen === 'letter' && (
        <div className="max-w-lg w-full relative z-10">
          <div className="glass-card rounded-3xl shadow-2xl p-12 fade-in-scale relative overflow-hidden">
            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 float">
              <Sparkles className="w-10 h-10 text-pink-400 drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-6 -left-6 float" style={{ animationDelay: '.2s' }}>
              <Heart className="w-10 h-10 text-purple-400 drop-shadow-lg" />
            </div>
            <div className="absolute top-1/2 -right-4 float" style={{ animationDelay: '1s' }}>
              <Star className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="absolute top-1/4 -left-4 float" style={{ animationDelay: '1s' }}>
              <MessageCircle className="w-8 h-8 text-blue-400 drop-shadow-lg" />
            </div>
            
            {/* Heart burst effects while typing */}
            {heartBurst.map(burst => (
              <div
                key={burst.id}
                className="heart-burst absolute text-pink-400 text-2xl pointer-events-none"
                style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
              >
                💖
              </div>
            ))}
            
            <div className="min-h-[280px] flex items-center justify-center relative">
              <p className="text-2xl text-gray-800 text-center leading-relaxed font-semibold px-4">
                {typedText}
                {isTyping && <span className="cursor text-pink-500">|</span>}
              </p>
            </div>
            
            <div className="mt-12 text-center">
              <button
                onClick={handleNextLetter}
                disabled={isTyping}
                className={`button-hover bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-12 py-5 rounded-full shadow-2xl font-bold text-xl ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="relative z-10">
                  {letterIndex < letterLines.length - 1 ? '→ Next' : '→ Continue'}
                </span>
              </button>
            </div>
            
            {/* Enhanced progress dots */}
            <div className="mt-10 flex justify-center gap-4">
              {letterLines.map((_, i) => (
                <div
                  key={i}
                  className={`h-3 rounded-full transition-all duration-700 ${
                    i === letterIndex 
                      ? 'w-12 bg-gradient-to-r from-pink-500 to-purple-500 scale-in' 
                      : i < letterIndex
                      ? 'w-3 bg-gradient-to-r from-pink-400 to-purple-400'
                      : 'w-3 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline Screen with Swipeable Cards */}
      {screen === 'timeline' && (
        <div className="max-w-lg w-full fade-in relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text pulse">
            Our Journey
          </h2>
          
          <div 
            className="card-stack relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background cards (stacked effect) */}
            {timeline.map((item, i) => {
              if (i < timelineIndex) return null;
              
              const isActive = i === timelineIndex;
              const offset = i - timelineIndex;
              
              return (
                <div
                  key={i}
                  className={`timeline-card glass-card rounded-3xl shadow-2xl p-10 ${
                    swipeDirection === 'left' && isActive ? 'slide-out-left' : 
                    swipeDirection === 'right' && isActive ? 'slide-out-right' : 
                    isActive ? 'slide-in-left' : ''
                  }`}
                  style={{
                    top: `${offset * 15}px`,
                    transform: `scale(${1 - offset * 0.05}) translateY(${offset * 10}px)`,
                    opacity: offset > 2 ? 0 : 1 - offset * 0.2,
                    zIndex: 10 - offset,
                    pointerEvents: isActive ? 'auto' : 'none'
                  }}
                >
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.color} opacity-10`} />
                  
                  <div className="relative">
                    <div className="text-center mb-6">
                      <div className={`text-7xl inline-block pulse mb-4 ${isActive ? 'rainbow-glow' : ''}`}>
                        {item.icon}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 text-3xl mb-4 text-center">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-xl leading-relaxed text-center font-medium">
                      {item.text}
                    </p>
                    
                    {/* Card counter */}
                    <div className="mt-8 text-center">
                      <span className="text-gray-500 font-semibold">
                        {timelineIndex + 1} / {timeline.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8 gap-4">
            <button
              onClick={handleTimelinePrev}
              disabled={timelineIndex === 0}
              className={`button-hover bg-gradient-to-r from-purple-400 to-pink-400 text-white p-4 rounded-full shadow-xl ${
                timelineIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <div className="flex gap-2">
              {timeline.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i > timelineIndex) {
                      setSwipeDirection('left');
                    } else if (i < timelineIndex) {
                      setSwipeDirection('right');
                    }
                    setTimeout(() => {
                      setTimelineIndex(i);
                      setSwipeDirection(null);
                    }, 300);
                  }}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    i === timelineIndex 
                      ? 'w-12 bg-gradient-to-r from-pink-500 to-purple-500' 
                      : 'w-3 bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleTimelineNext}
              disabled={timelineIndex === timeline.length - 1}
              className={`button-hover bg-gradient-to-r from-pink-400 to-purple-400 text-white p-4 rounded-full shadow-xl ${
                timelineIndex === timeline.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          
          {timelineIndex === timeline.length - 1 && (
            <div className="text-center mt-8 fade-in-scale">
              <button
                onClick={() => setScreen('names')}
                className="button-hover bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-5 rounded-full shadow-2xl font-bold text-xl glow"
              >
                <span className="relative z-10">Continue ✨</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Names Screen with Interactive Reveal */}
      {screen === 'names' && (
        <div className="max-w-lg w-full fade-in-scale relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text pulse">
            Your Actual names
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">Jo uncle aunty rakhna bhool gy</p>
          
          {/* Star burst effects */}
          <div className="relative">
            {starBurst.map(burst => (
              <div
                key={burst.id}
                className="star-burst absolute text-yellow-400 text-3xl pointer-events-none left-1/2 top-1/2"
                style={{
                  '--tx': `${Math.cos(burst.angle) * 100}px`,
                  '--ty': `${Math.sin(burst.angle) * 100}px`
                }}
              >
                ✨
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-5 mb-10">
            {names.map((name, i) => (
              <button
                key={i}
                onClick={() => handleNameReveal(i)}
                className={`glass-card card-3d p-8 rounded-3xl shadow-xl transition-all duration-500 ${
                  nameRevealed.includes(i) ? 'scale-in' : 'flip-in'
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className={`text-6xl mb-4 ${nameRevealed.includes(i) ? 'pulse' : 'wiggle'}`}>
                  {nameRevealed.includes(i) ? name.emoji : '❓'}
                </div>
                <div className={`bg-gradient-to-r ${name.color} rounded-full py-3 px-4 shadow-lg`}>
                  <p className="text-gray-800 font-bold text-lg text-center">
                    {nameRevealed.includes(i) ? name.text : 'Tap me!'}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="glass-card rounded-2xl p-8 shadow-xl mb-10 fade-in border-2 border-pink-200" style={{ animationDelay: '0.8s' }}>
            <p className="text-center text-gray-700 italic text-xl font-medium leading-relaxed">
              😝😝😝
            </p>
          </div>
          
          {nameRevealed.length === names.length && (
            <div className="text-center fade-in-scale">
              <button
                onClick={() => setScreen('final')}
                className="button-hover bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-12 py-5 rounded-full shadow-2xl font-bold text-xl glow"
              >
                <span className="relative z-10">Continue 💫</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Final Screen with Epic Finale */}
      {screen === 'final' && (
        <div className="max-w-lg w-full text-center fade-in-scale relative z-10">
          <div className="glass-card rounded-3xl shadow-2xl p-14 glow relative overflow-hidden">
            {/* Decorative floating hearts */}
            <div className="absolute top-10 left-10 float">
              <Heart className="w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-lg" />
            </div>
            <div className="absolute top-10 right-10 float" style={{ animationDelay: '0.5s' }}>
              <Heart className="w-12 h-12 text-purple-400 fill-purple-400 drop-shadow-lg" />
            </div>
            <div className="absolute bottom-10 left-1/4 float" style={{ animationDelay: '1s' }}>
              <Star className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
            </div>
            <div className="absolute bottom-10 right-1/4 float" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="w-10 h-10 text-blue-400 drop-shadow-lg" />
            </div>
            
            <div className="float mb-8">
              <Heart className="w-20 h-20 mx-auto text-pink-500 fill-pink-500 drop-shadow-2xl rainbow-glow" />
            </div>
            
            <div className="space-y-6 mb-12">
              <p className="text-2xl text-gray-800 leading-relaxed font-medium text-reveal">
                Again. Happy Birthday.
              </p>
              <p className="text-3xl font-bold text-reveal" style={{ animationDelay: '0.3s' }}>
                <span className="gradient-text">Allah apko Hamesha khush rakhy —</span>
              </p>
              <p className="text-2xl text-gray-800 font-semibold text-reveal" style={{ animationDelay: '0.6s' }}>
                Aur dhair saray pesy de (jo hm 50 50 kr lein).
              </p>
            </div>
            
            <button
              onClick={handleFinalSmile}
              className="button-hover bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white px-16 py-6 rounded-full shadow-2xl font-bold text-2xl glow relative"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Heart className="w-7 h-7" />
                Ameen 🙂
                <Sparkles className="w-7 h-7" />
              </span>
            </button>
            
            {showConfetti && (
              <div className="mt-6 text-center text-pink-500 font-bold text-xl fade-in">
                Happy Birthday, Khushi! 🎉
              </div>
            )}
          </div>
          
          {/* Epic Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
              {[...Array(80)].map((_, i) => {
                const emojis = ['⭐', '✨', '💫', '🌟', '💖', '💜', '💙', '🎉', '🎊', '🎈'];
                return (
                  <div
                    key={i}
                    className="confetti absolute"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '100%',
                      fontSize: `${20 + Math.random() * 20}px`,
                      animationDelay: `${Math.random() * 1}s`,
                      animationDuration: `${4 + Math.random() * 2}s`
                    }}
                  >
                    {emojis[Math.floor(Math.random() * emojis.length)]}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
