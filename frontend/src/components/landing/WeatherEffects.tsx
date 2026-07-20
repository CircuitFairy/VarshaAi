"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function WeatherEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to full window
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

    // Rain drop properties
    const maxDrops = 100;
    const drops: { x: number, y: number, length: number, velocity: number }[] = [];

    for (let i = 0; i < maxDrops; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        velocity: Math.random() * 10 + 5
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      ctx.beginPath();
      for (let i = 0; i < maxDrops; i++) {
        const drop = drops[i];
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        
        drop.y += drop.velocity;
        
        // Reset drop to top if it goes off screen
        if (drop.y > height) {
          drop.y = -drop.length;
          drop.x = Math.random() * width;
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* HTML5 Canvas Rain */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Drifting Clouds */}
      <motion.div
        initial={{ x: "-10%" }}
        animate={{ x: "110%" }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] -left-[20%] w-96 h-32 bg-white/5 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ x: "110%" }}
        animate={{ x: "-10%" }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute top-[40%] -right-[20%] w-[500px] h-40 bg-sky-500/5 blur-3xl rounded-full"
      />
      <motion.div
        initial={{ x: "-20%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-[70%] -left-[30%] w-[600px] h-48 bg-indigo-500/5 blur-3xl rounded-full"
      />
    </div>
  );
}
