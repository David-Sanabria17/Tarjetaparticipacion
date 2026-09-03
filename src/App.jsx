import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  ChevronRight,
  Award,
  RotateCcw,
  Settings,
  Compass,
  Wrench,
  Hexagon
} from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const audioRef = useRef(null);

  // Auto-play audio on first user interaction (required by mobile browsers)
  useEffect(() => {
    const tryPlay = () => {
      if (audioRef.current && !isPlayingAudio) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
      }
      document.removeEventListener('touchstart', tryPlay);
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('pointerdown', tryPlay);
    };
    document.addEventListener('touchstart', tryPlay, { once: true });
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('pointerdown', tryPlay, { once: true });
    return () => {
      document.removeEventListener('touchstart', tryPlay);
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('pointerdown', tryPlay);
    };
  }, [isPlayingAudio]);

  // Framer Motion drag controls for tearing/sliding open
  const dragX = useMotionValue(0);
  const maxDrag = 220; // threshold to trigger open
  const sliderWidth = useTransform(dragX, [0, maxDrag], ['48px', '100%']);

  // Trigger confetti burst on open (lightweight)
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#fcf6ba', '#c5a059'],
        scalar: 0.9,
        decay: 0.92
      });
      setTimeout(() => {
        confetti({
          particleCount: 20,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#d4af37', '#fdf0cd', '#aa7c11'],
          scalar: 0.7
        });
      }, 200);
    } catch (e) {
      console.log('Confetti effect failed', e);
    }
  };

  const handleOpenCard = () => {
    if (!isOpen) {
      setIsOpen(true);
      triggerConfetti();
      // Try play audio if user enabled
      if (audioRef.current && !isPlayingAudio) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => { });
      }
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => { });
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Participación de Grado - Sebastián Gamero Huertas',
      text: 'Te hago partícipe de mi Grado - Sebastián Gamero Huertas (10 de Septiembre de 2026)',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleAddToCalendar = () => {
    // Google Calendar Link
    const title = encodeURIComponent("Grado de Sebastián Gamero Huertas");
    const details = encodeURIComponent("Ceremonia de Graduación - Tarjeta de Participación");
    const location = encodeURIComponent("Centro de Convenciones");
    const startDate = "20260910T130000Z"; // 8:00 a.m. COT (UTC-5)
    const endDate = "20260910T160000Z";

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent("¡Felicitaciones Sebastián por tu grado! Les mando un abrazo muy especial a ti y a toda tu familia. 🎉🎓");
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-[#1a1a1a] p-3 sm:p-6 select-none overflow-x-hidden transition-colors duration-1000 ease-in-out"
      style={{
        backgroundColor: isOpen ? '#060911' : '#f4eee3'
      }}
    >

      {/* Background Subtle Gradient - simplified for performance */}
      <div className="fixed inset-0 pointer-events-none z-0"
           style={{ background: isOpen
             ? 'radial-gradient(ellipse at 50% 25%, rgba(180,130,40,0.07) 0%, transparent 60%)'
             : 'radial-gradient(ellipse at 50% 25%, rgba(200,150,60,0.08) 0%, transparent 60%)'
           }} />

      {/* Background Audio (Royalty-free soft celebratory acoustic piano background) */}
      <audio
        ref={audioRef}
        loop
        autoPlay
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=inspiring-cinematic-ambient-116199.mp3"
      />

      {/* Floating Action Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#0e172a]/80 backdrop-blur-md border border-amber-500/30 text-amber-200 text-xs sm:text-sm shadow-lg hover:border-amber-400 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Cerrar sobre</span>
          </button>
        )}
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center my-auto py-6">

        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* ============================================================== */
            /* 1. ENVELOPE / SOBRE EXTERIOR (AZUL NOCHE CON DETALLES DORADOS) */
            /* ============================================================== */
            <motion.div
              key="envelope"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 100, transition: { duration: 0.5 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[360px] sm:max-w-[420px] shadow-2xl border border-[#d4af37]/30 flex flex-col items-center justify-between overflow-visible"
              style={{
                backgroundColor: '#152238',
                aspectRatio: '1 / 1.55',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.1)',
                borderRadius: '16px',
                padding: '2rem 1.5rem'
              }}
            >
              {/* Double Gold Frame */}
              <div className="absolute inset-3 sm:inset-4 rounded-xl border border-[#d4af37]/30 pointer-events-none z-10" />
              <div className="absolute inset-[18px] sm:inset-[22px] rounded-lg border border-[#d4af37]/15 pointer-events-none z-10" />

              {/* Mechanical Envelope Accents - Clipped to Envelope */}
              <div className="absolute inset-0 overflow-hidden rounded-[16px] pointer-events-none z-0">
                <div className="absolute -top-12 -left-12 opacity-15 gear-watermark">
                  <Settings className="w-48 h-48 text-[#d4af37] animate-[spin_30s_linear_infinite]" />
                </div>
                <div className="absolute -bottom-16 -right-16 opacity-10 gear-watermark">
                  <Settings className="w-56 h-56 text-[#d4af37] animate-[spin_25s_linear_infinite_reverse]" />
                </div>
              </div>

              {/* Hanging Golden Graduation Cap (Right Side) */}
              <div className="absolute top-0 right-10 sm:right-14 z-20 flex flex-col items-center pointer-events-none drop-shadow-lg">
                {/* Golden Line */}
                <div className="w-[2px] h-24 sm:h-32" style={{ background: 'linear-gradient(to bottom, #f3e5ab, #d4af37, #aa7c11)' }} />

                {/* Small Golden Cap at the end */}
                <div className="relative flex flex-col items-center -mt-2">
                  {/* Board */}
                  <div className="w-14 h-7 sm:w-16 sm:h-8 bg-gradient-to-br from-[#fef5d4] via-[#d4af37] to-[#8a630c] shadow-sm"
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
                  {/* Skull cap */}
                  <div className="w-7 h-3.5 sm:w-8 sm:h-4 bg-gradient-to-b from-[#b38f1d] to-[#4d3900] rounded-b-full -mt-1 shadow-inner" />
                  {/* Center Button */}
                  <div className="absolute top-[10px] sm:top-[12px] w-1.5 h-1.5 bg-[#ffffff] rounded-full shadow-sm" />
                </div>
              </div>

              {/* Names and Date centered */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 w-full">
                <h1 className="font-['Great_Vibes'] text-5xl sm:text-6xl text-[#f3e5ab] leading-none mb-2" style={{ textShadow: '0 2px 8px rgba(212,175,55,0.3)' }}>
                  Sebastián
                </h1>
                <h2 className="font-['Great_Vibes'] text-3xl sm:text-4xl text-[#f3e5ab]/80 -mt-1" style={{ textShadow: '0 1px 6px rgba(212,175,55,0.2)' }}>
                  Gamero Huertas
                </h2>
                <div className="w-24 h-[1px] my-4" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
                <p className="font-['Cormorant_Garamond'] text-lg sm:text-xl text-[#f3e5ab]/90 tracking-[0.25em] font-semibold">
                  10 . 09 . 2026
                </p>
              </div>

              {/* Swipe Slider */}
              <div className="w-full flex flex-col items-center z-10">
                <p className="text-[#d4af37]/70 text-xs font-light tracking-wide mb-2 flex items-center gap-1.5 animate-pulse">
                  <span>Desliza para abrir</span>
                  <ChevronRight className="w-4 h-4 text-[#d4af37]" />
                </p>
                <div className="relative w-full h-14 rounded-full p-1 flex items-center overflow-hidden" style={{ backgroundColor: '#0c192e', border: '1px solid rgba(212,175,55,0.4)' }}>
                  <motion.div
                    className="absolute top-1 bottom-1 left-1 rounded-full pointer-events-none"
                    style={{
                      width: sliderWidth,
                      background: 'linear-gradient(90deg, rgba(212,175,55,0.15), rgba(212,175,55,0.4))'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-full border-t border-dashed border-[#d4af37]" />
                  </div>
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: maxDrag }}
                    dragElastic={0.05}
                    dragSnapToOrigin={true}
                    style={{ x: dragX, background: 'linear-gradient(135deg, #f3e5ab, #d4af37, #aa7c11)' }}
                    onDrag={(e, info) => {
                      setDragProgress(Math.min(1, info.offset.x / maxDrag));
                      if (info.offset.x >= maxDrag * 0.85) {
                        handleOpenCard();
                      }
                    }}
                    className="z-30 w-12 h-12 rounded-full border border-white/50 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing glow-animation"
                  >
                    <ChevronRight className="w-6 h-6 text-[#0c192e]" />
                  </motion.div>
                  <div className="w-full text-center pr-4 text-[#d4af37]/50 text-xs tracking-wider uppercase font-semibold pointer-events-none">
                    {dragProgress > 0.4 ? '' : ' '}
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            /* ============================================================== */
            /* 2. INNER BOOK CARD (DISEÑO MEJORADO Y ESTILIZADO) */
            /* ============================================================== */
            <motion.div
              key="book-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl my-2 p-3 sm:p-5 rounded-2xl select-none"
              style={{
                backgroundColor: '#736555',
                backgroundImage: 'radial-gradient(circle at center, #877764 0%, #594d3f 100%)',
                boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(184, 150, 85, 0.25)',
                border: '10px solid #5e5142'
              }}
            >
              {/* Outer Book Cover Shadow & Texture */}
              <div
                className="relative rounded-lg shadow-2xl flex flex-col items-center justify-center overflow-hidden w-full"
                style={{
                  backgroundColor: '#fbf8f1',
                  backgroundImage: 'radial-gradient(ellipse at center, #fffdf9 0%, #f4eee3 100%)',
                  boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
                }}
              >
                {/* Book Spine Center Line */}
                <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-14 pointer-events-none z-30"
                  style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.02) 20%, transparent 50%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0.15) 100%)' }} />

                {/* Subtle Mechanical Blueprint Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                  style={{ backgroundImage: 'linear-gradient(#b89c62 1px, transparent 1px), linear-gradient(90deg, #b89c62 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Open Book Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 w-full relative">

                  {/* ================= LEFT PAGE ================= */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative flex flex-col w-full min-h-[500px] sm:min-h-[600px] p-6 sm:p-12 border-b md:border-b-0 border-[#c5a059]/30"
                  >
                    {/* Double Border */}
                    <div className="absolute inset-4 sm:inset-6 border-2 border-[#b89c62]/50 pointer-events-none" />
                    <div className="absolute inset-[20px] sm:inset-[28px] border border-[#b89c62]/25 pointer-events-none" />

                    {/* Corner Ornaments & Screws */}
                    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-6 h-6 border-t-2 border-l-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center rotate-45 opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-6 h-6 border-t-2 border-r-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center -rotate-45 opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-6 h-6 border-b-2 border-l-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center rotate-12 opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-6 h-6 border-b-2 border-r-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center rotate-[60deg] opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    {/* Technical Blueprint Texts & Ruler */}
                    <div className="absolute bottom-4 left-10 sm:bottom-5 flex gap-4 text-[#a37f37]/50 text-[8px] sm:text-[9px] font-mono tracking-[0.2em] pointer-events-none">
                      <span>SCALE: 1:1</span>
                      <span>REV: 01</span>
                    </div>
                    <div className="absolute top-12 bottom-12 left-2 w-[3px] opacity-30 pointer-events-none"
                      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, #b89c62 0, #b89c62 1px, transparent 1px, transparent 8px)' }} />

                    {/* Large Faint Background Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none flex items-center justify-center z-0 gear-watermark">
                      <Settings className="w-64 h-64 sm:w-80 sm:h-80 animate-[spin_40s_linear_infinite]" />
                    </div>

                    {/* Safe Content Area (Left Page) */}
                    <div className="relative z-10 w-full h-full flex flex-row items-center justify-center">

                      {/* Left Gear Column */}
                      <div className="hidden sm:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-center justify-between h-[70%] pr-5 border-r border-[#b89c62]/40 text-[#b89c62]/70 z-20">
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37', rotate: 90 }} transition={{ type: 'spring' }} className="cursor-pointer">
                          <Settings className="w-5 h-5 animate-[spin_18s_linear_infinite]" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37' }} className="cursor-pointer">
                          <Hexagon className="w-4 h-4" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.4, color: '#d4af37', rotate: -90 }} transition={{ type: 'spring' }} className="cursor-pointer">
                          <Settings className="w-6 h-6 animate-[spin_14s_linear_infinite_reverse]" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37' }} className="cursor-pointer">
                          <Compass className="w-5 h-5" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37', rotate: 90 }} transition={{ type: 'spring' }} className="cursor-pointer">
                          <Settings className="w-5 h-5 animate-[spin_18s_linear_infinite]" />
                        </motion.div>
                      </div>

                      {/* Main Text Content */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-2 sm:px-6 w-full">

                        <div className="flex items-center justify-center w-full gap-3 text-[#b89c62] z-20 relative">
                          <span className="w-10 h-[1px] bg-[#b89c62]" />
                          <motion.div whileHover={{ scale: 1.5, color: '#d4af37' }} className="cursor-pointer">
                            <Settings className="w-4 h-4 animate-[spin_12s_linear_infinite]" />
                          </motion.div>
                          <span className="w-10 h-[1px] bg-[#b89c62]" />
                        </div>

                        <h1 className="font-['Great_Vibes'] text-6xl sm:text-6xl md:text-7xl text-[#a37f37] leading-none tracking-tight py-1 px-1 break-words w-full" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
                          Sebastián Gamero Huertas
                        </h1>

                        <p className="font-['Cormorant_Garamond'] text-lg sm:text-base md:text-lg text-[#4a4a4a] italic leading-relaxed max-w-[320px] sm:max-w-[300px] mx-auto px-2">
                          Tiene el honor de compartir con familiares y amigos la culminación de su formación profesional como
                        </p>

                        <div className="py-2 w-full">
                          <h2 className="font-['Playfair_Display'] font-extrabold text-2xl sm:text-xl md:text-3xl text-[#a37f37] tracking-wider uppercase px-1">
                            INGENIERO MECÁNICO
                          </h2>
                        </div>

                        <h3 className="font-['Playfair_Display'] font-semibold text-2xl sm:text-xl md:text-2xl text-[#1a1a1a]">
                          Universidad de Córdoba
                        </h3>

                        <p className="font-['Cormorant_Garamond'] text-lg sm:text-base md:text-lg text-[#4a4a4a] italic leading-relaxed max-w-[320px] sm:max-w-[300px] mx-auto px-2">
                          Un logro que representa el cierre de una etapa de formación, disciplina y aprendizaje, y el inicio de nuevos desafíos en el ejercicio profesional.
                        </p>

                      </div>
                    </div>
                  </motion.div>

                  {/* ================= RIGHT PAGE ================= */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="relative flex flex-col w-full min-h-[500px] sm:min-h-[600px] p-6 sm:p-12"
                  >
                    {/* Double Border */}
                    <div className="absolute inset-4 sm:inset-6 border-2 border-[#b89c62]/50 pointer-events-none" />
                    <div className="absolute inset-[20px] sm:inset-[28px] border border-[#b89c62]/25 pointer-events-none" />

                    {/* Corner Ornaments & Screws */}
                    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-6 h-6 border-t-2 border-l-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center rotate-[30deg] opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-6 h-6 border-t-2 border-r-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center -rotate-12 opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-6 h-6 border-b-2 border-l-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center rotate-45 opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-6 h-6 border-b-2 border-r-2 border-[#b89c62] pointer-events-none" />
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-2.5 h-2.5 rounded-full border border-[#b89c62]/80 flex items-center justify-center -rotate-45 opacity-60">
                      <div className="w-full h-[1px] bg-[#b89c62]/80" />
                    </div>

                    {/* Technical Blueprint Texts & Ruler */}
                    <div className="absolute bottom-4 right-10 sm:bottom-5 flex gap-4 text-[#a37f37]/50 text-[8px] sm:text-[9px] font-mono tracking-[0.2em] pointer-events-none">
                      <span>DWG NO: 2026-SGH</span>
                      <span>CAD: AUTO</span>
                    </div>
                    <div className="absolute top-12 bottom-12 right-2 w-[3px] opacity-30 pointer-events-none"
                      style={{ backgroundImage: 'repeating-linear-gradient(to bottom, #b89c62 0, #b89c62 1px, transparent 1px, transparent 8px)' }} />

                    {/* Large Faint Background Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none flex items-center justify-center z-0 gear-watermark">
                      <Settings className="w-64 h-64 sm:w-80 sm:h-80 animate-[spin_40s_linear_infinite_reverse]" />
                    </div>

                    {/* Safe Content Area (Right Page) */}
                    <div className="relative z-10 w-full h-full flex flex-row items-center justify-center">

                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 px-2 sm:px-6 w-full">

                        <div className="space-y-3 w-full">
                          <h3 className="font-['Playfair_Display'] font-black text-2xl sm:text-2xl md:text-3xl text-[#1a1a1a] tracking-wider uppercase leading-tight px-1">
                            CEREMONIA DE GRADO
                          </h3>
                          <p className="font-['Playfair_Display'] font-medium text-lg sm:text-base md:text-xl text-[#2a2a2a]">
                            10 de septiembre de 2026
                          </p>
                          <p className="font-['Playfair_Display'] font-medium text-lg sm:text-base md:text-xl text-[#2a2a2a]">
                            8:00 a. m.
                          </p>
                          <p className="font-['Playfair_Display'] font-bold text-xl sm:text-xl md:text-2xl text-[#1a1a1a] pt-1 px-1">
                            Centro de Convenciones
                          </p>
                        </div>

                        {/* Ornate Divider with Mechanical Element */}
                        <div className="flex items-center justify-center w-full gap-4 text-[#a37f37] py-2 z-20 relative">
                          <div className="w-12 sm:w-16 h-[2px] bg-[#a37f37]" />
                          <motion.div whileHover={{ scale: 1.3, color: '#d4af37' }} className="cursor-pointer">
                            <Settings className="w-5 h-5 animate-[spin_20s_linear_infinite]" />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.3, color: '#d4af37', rotate: 15 }} className="cursor-pointer">
                            <Wrench className="w-6 h-6 text-[#a37f37]" />
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.3, color: '#d4af37' }} className="cursor-pointer">
                            <Settings className="w-5 h-5 animate-[spin_20s_linear_infinite_reverse]" />
                          </motion.div>
                          <div className="w-12 sm:w-16 h-[2px] bg-[#a37f37]" />
                        </div>

                        <p className="font-['Cormorant_Garamond'] text-lg sm:text-lg md:text-xl text-[#2a2a2a] max-w-[320px] sm:max-w-[300px] mx-auto italic leading-relaxed px-2">
                          Con especial reconocimiento a mis padres que me acompañaron en este camino.
                        </p>

                        <div className="space-y-1 font-['Cormorant_Garamond'] font-bold italic text-xl sm:text-xl md:text-2xl text-[#1a1a1a] pt-3">
                          <p>Eliana Judith Huertas Guerra</p>
                          <p>Jorge Eliécer Gamero Morales</p>
                        </div>

                      </div>

                      {/* Right Gear Column (Symmetry) */}
                      <div className="hidden sm:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center justify-between h-[70%] pl-5 border-l border-[#b89c62]/40 text-[#b89c62]/70 z-20">
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37', rotate: -90 }} transition={{ type: 'spring' }} className="cursor-pointer">
                          <Settings className="w-5 h-5 animate-[spin_18s_linear_infinite_reverse]" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37' }} className="cursor-pointer">
                          <Wrench className="w-4 h-4" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.4, color: '#d4af37', rotate: 90 }} transition={{ type: 'spring' }} className="cursor-pointer">
                          <Settings className="w-6 h-6 animate-[spin_14s_linear_infinite]" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37' }} className="cursor-pointer">
                          <Hexagon className="w-4 h-4" />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.3, color: '#d4af37', rotate: -90 }} transition={{ type: 'spring' }} className="cursor-pointer">
                          <Settings className="w-5 h-5 animate-[spin_18s_linear_infinite_reverse]" />
                        </motion.div>
                      </div>

                    </div>
                  </motion.div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center py-2">
        <p className={`text-[11px] font-light transition-colors duration-700 ${isOpen ? 'text-amber-200/40' : 'text-[#7a6229]/60'}`}>
          Tarjeta de Participación de Grado Digital • 2026
        </p>
      </div>

    </div>
  );
}
