"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "./WeatherProvider";

export function WeatherRenderer() {
  const { weather } = useWeather();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas Engine for Rain/Snow
  useEffect(() => {
    if (weather !== "RAIN" && weather !== "THUNDERSTORM" && weather !== "SNOW") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const isSnow = weather === "SNOW";
    const maxParticles = isSnow ? 150 : (weather === "THUNDERSTORM" ? 200 : 100);
    const particles: any[] = [];

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        l: isSnow ? Math.random() * 3 + 1 : Math.random() * 20 + 10, // length/radius
        v: isSnow ? Math.random() * 2 + 1 : Math.random() * 15 + 10, // velocity
        w: isSnow ? Math.random() * 2 - 1 : 0 // wind drift for snow
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (isSnow) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath();
        for (let i = 0; i < maxParticles; i++) {
          const p = particles[i];
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, p.l, 0, Math.PI * 2);
          p.y += p.v;
          p.x += p.w;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        }
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i < maxParticles; i++) {
          const p = particles[i];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.l);
          p.y += p.v;
          if (p.y > height) {
            p.y = -p.l;
            p.x = Math.random() * width;
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weather]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000">
      
      {/* Dynamic Background Colors */}
      <div 
        className="absolute inset-0 transition-colors duration-2000 ease-in-out"
        style={{
          backgroundColor: 
            weather === "CLEAR" ? "#050505" :
            weather === "RAIN" ? "#0f172a" :
            weather === "THUNDERSTORM" ? "#020617" :
            weather === "DROUGHT" ? "#1a0500" :
            weather === "SNOW" ? "#0f172a" : "#050505"
        }}
      />

      {/* Lightning Effect */}
      <AnimatePresence>
        {weather === "THUNDERSTORM" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 0, 0.8, 0, 0, 0, 0, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="absolute inset-0 bg-white mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Drought Heat Haze Effect */}
      <AnimatePresence>
        {weather === "DROUGHT" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {weather === "DROUGHT" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-red-900/20 to-transparent mix-blend-color animate-pulse"
            style={{ animationDuration: '4s' }}
          />
        )}
      </AnimatePresence>

      {/* Cloud Overlays */}
      <AnimatePresence>
        {(weather === "RAIN" || weather === "THUNDERSTORM") && (
          <>
            <motion.div
              initial={{ x: "-10%", opacity: 0 }}
              animate={{ x: "110%", opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ x: { duration: 60, repeat: Infinity, ease: "linear" }, opacity: { duration: 2 } }}
              className="absolute top-[5%] -left-[20%] w-[800px] h-64 bg-slate-500 blur-[100px] rounded-full"
            />
            <motion.div
              initial={{ x: "110%", opacity: 0 }}
              animate={{ x: "-10%", opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ x: { duration: 80, repeat: Infinity, ease: "linear" }, opacity: { duration: 2 } }}
              className="absolute top-[20%] -right-[20%] w-[1000px] h-96 bg-slate-700 blur-[120px] rounded-full"
            />
          </>
        )}
      </AnimatePresence>

      {/* Clear Sky Aurora (Default) */}
      <AnimatePresence>
        {weather === "CLEAR" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-sky-600/20 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
            <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML5 Canvas for Particles (Rain/Snow) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

    </div>
  );
}
