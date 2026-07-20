"use client";

import { motion } from "framer-motion";
import { Database, Zap, Satellite, Server, Cpu } from "lucide-react";

export function DataPipelineSection() {
  return (
    <section className="py-32 relative bg-transparent overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="inline-block px-3 py-1 bg-muted border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
            DATA INGESTION PIPELINE
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 uppercase tracking-tighter">BUILT ON <span className="text-primary drop-shadow-[0_0_15px_rgba(60,215,255,0.4)]">UNCOMPROMISING TRUTH</span></h2>
          <p className="text-lg text-muted-foreground font-data max-w-3xl mx-auto uppercase tracking-wider leading-relaxed">
            VarshaAI doesn't guess. We ingest billions of data points from the most authoritative aerospace and meteorological institutions on Earth to train our digital brain.
          </p>
        </motion.div>

        {/* The Pipeline Graphic */}
        <div className="relative max-w-5xl mx-auto mt-20">
          
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-primary/20 -translate-y-1/2 z-0" />
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 z-0 overflow-hidden">
            <div className="w-1/3 h-full bg-primary shadow-[0_0_10px_var(--primary)] animate-[shimmer_2s_infinite]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
            
            {/* Step 1: Sources */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4"
            >
              <div className="os-card p-6 border-border/50 text-left bg-background/90 hover:border-primary/50 transition-colors">
                <Satellite className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-display font-bold text-foreground mb-1 uppercase tracking-wide">RAW SATELLITE DATA</h4>
                <p className="text-xs font-data text-muted-foreground uppercase">ISRO INSAT-3D IMAGERY</p>
              </div>
              <div className="os-card p-6 border-border/50 text-left bg-background/90 hover:border-primary/50 transition-colors">
                <Server className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-display font-bold text-foreground mb-1 uppercase tracking-wide">LIVE TELEMETRY</h4>
                <p className="text-xs font-data text-muted-foreground uppercase">OPEN-METEO & NASA POWER</p>
              </div>
            </motion.div>

            {/* Step 2: Processing Engine */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-sm blur-[30px] animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="w-48 h-48 rounded-sm border border-primary/50 bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(60,215,255,0.15)]">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary"></div>
                  
                  <img src="/logo.png" alt="VarshaAI Logo" className="w-12 h-12 object-contain mb-3 drop-shadow-[0_0_10px_rgba(60,215,255,0.5)]" />
                  <span className="font-display font-bold text-foreground tracking-widest">VARSHA<span className="text-primary">AI</span></span>
                  <span className="text-primary text-[10px] font-data mt-1 tracking-widest uppercase">XGBOOST CORE</span>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Output */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4 justify-center"
            >
              <div className="os-card p-6 border-tertiary/20 bg-tertiary/5 text-right hover:border-tertiary/50 transition-colors">
                <Zap className="w-6 h-6 text-tertiary mb-3 ml-auto" />
                <h4 className="font-display font-bold text-foreground mb-1 uppercase tracking-wide">LIVE DASHBOARD</h4>
                <p className="text-xs font-data text-muted-foreground uppercase">REAL-TIME CLIMATE HEALTH</p>
              </div>
              <div className="os-card p-6 border-error/20 bg-error/5 text-right hover:border-error/50 transition-colors">
                <Database className="w-6 h-6 text-error mb-3 ml-auto" />
                <h4 className="font-display font-bold text-foreground mb-1 uppercase tracking-wide">FUTURE SIMULATION</h4>
                <p className="text-xs font-data text-muted-foreground uppercase">DROUGHT & FLOOD PROJECTIONS</p>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
