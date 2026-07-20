"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { LaunchButton } from "../launch/LaunchButton";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-32 overflow-hidden bg-transparent">
      
      {/* Background Grids & Radar Sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-primary/30 bg-primary/10 text-[10px] font-data text-primary mb-8 tracking-widest uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span>SYSTEM ONLINE: VARSHAAI OS 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-7xl lg:text-[6rem] font-display font-black tracking-tighter mb-6 leading-[1.05]"
          >
            <span className="text-foreground">PREDICT TODAY.</span><br />
            <span className="text-primary drop-shadow-[0_0_10px_rgba(60,215,255,0.3)]">SIMULATE TOMORROW.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-data uppercase tracking-wider leading-relaxed"
          >
            Your ultimate command center for climate intelligence. 
            We unify live meteorological data with deep XGBoost learning to shield India from the storms of tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <LaunchButton href="/dashboard" className="group relative inline-flex items-center justify-center px-6 py-3 rounded-sm font-data font-bold text-sm tracking-widest uppercase text-background bg-primary border border-primary overflow-hidden transition-all hover:bg-primary/90 shadow-[0_0_20px_rgba(60,215,255,0.4)]">
              <span className="relative flex items-center gap-2">
                Deploy OS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </LaunchButton>
            
            <a href="#architecture" className="group inline-flex items-center justify-center px-6 py-3 rounded-sm font-data font-bold text-sm tracking-widest uppercase text-foreground bg-muted border border-border hover:border-primary/50 transition-colors">
              Access Schematics
            </a>
          </motion.div>
        </div>

        {/* Right Side: Floating Predictive Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 w-full relative h-[400px] hidden lg:block"
        >
          {/* Main Anomaly Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 os-card p-6 bg-background/95 backdrop-blur-xl border-primary shadow-[0_0_30px_rgba(60,215,255,0.15)] z-20"
          >
            <div className="flex items-center justify-between border-b border-primary/20 pb-3 mb-4">
              <span className="text-[10px] font-bold text-primary font-data uppercase tracking-widest">LIVE TELEMETRY // MUMBAI</span>
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Precipitation Volatility</p>
                <div className="flex items-end gap-2">
                  <p className="font-data text-4xl font-bold text-primary tracking-tight">412</p>
                  <p className="text-sm font-data text-primary mb-1">mm</p>
                  <p className="text-xs font-data text-error mb-1 ml-2">+124mm (Delta)</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-2">72H AI Prediction Vector</p>
                <div className="h-12 flex items-end gap-1">
                  {[40, 60, 45, 80, 95, 120, 150, 180, 140, 90].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative" style={{ height: `${(h / 180) * 100}%` }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-sm" style={{ height: i > 4 ? '100%' : '0%' }}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-error/10 border border-error/30 rounded p-2 mt-2">
                <p className="font-data text-[10px] text-error flex items-center gap-1">
                  <span className="uppercase font-bold">! SEVERE WARNING:</span> High likelihood of flash floods in next 48h.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Sub-Card 1 */}
          <motion.div 
            animate={{ y: [0, 15, 0] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-10 right-0 w-48 os-card p-4 bg-background/90 backdrop-blur-md border-tertiary/50 z-10"
          >
            <p className="text-[8px] font-bold text-tertiary font-data uppercase tracking-widest mb-2">THERMAL MATRIX</p>
            <p className="font-data text-2xl font-bold text-foreground">34.2°C</p>
            <p className="font-data text-[9px] text-muted-foreground mt-1">NOMINAL RANGE</p>
          </motion.div>

          {/* Floating Sub-Card 2 */}
          <motion.div 
            animate={{ y: [0, -12, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-0 w-52 os-card p-4 bg-background/90 backdrop-blur-md border-border z-30"
          >
            <p className="text-[8px] font-bold text-muted-foreground font-data uppercase tracking-widest mb-2">SATELLITE DOWNLINK</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></div>
              <p className="font-data text-[10px] text-foreground">INSAT-3D SYNCED</p>
            </div>
          </motion.div>

        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest font-data">INITIATE SCROLL PROTOCOL</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
