"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Map as MapIcon, FlaskConical } from "lucide-react";
import Link from "next/link";

export function DashboardPreviewSection() {
  return (
    <section className="py-32 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-muted border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4"
          >
            SYSTEM INTERFACE
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 uppercase tracking-tighter"
          >
            A COMMAND CENTER FOR THE <br/><span className="text-primary drop-shadow-[0_0_15px_rgba(60,215,255,0.4)]">ENTIRE SUBCONTINENT</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-data uppercase tracking-wider leading-relaxed"
          >
            Don't just read about the climate. Interact with it.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <PreviewCard 
            title="Live Telemetry Dashboard"
            icon={LayoutDashboard}
            desc="Monitor real-time AQI, Temperature, and Rainfall metrics for any Indian state."
            delay={0.1}
          />
          <PreviewCard 
            title="Interactive 3D Mapping"
            icon={MapIcon}
            desc="Layer INSAT infrared satellite data over a fluid 3D globe to track incoming storms."
            delay={0.2}
          />
          <PreviewCard 
            title="Scenario Simulator"
            icon={FlaskConical}
            desc="Dial up the global temperature by 2°C and instantly see the agricultural impact on your state."
            delay={0.3}
          />

        </div>

        {/* Abstract Mockup UI representing the Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-5xl mx-auto rounded-sm border border-primary/20 bg-background/80 overflow-hidden shadow-[0_0_50px_rgba(60,215,255,0.1)] p-2 backdrop-blur-xl"
        >
          {/* Top Bar Mock */}
          <div className="w-full h-10 border-b border-border/50 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error"></div>
              <div className="w-2 h-2 rounded-full bg-tertiary"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <div className="w-32 h-2 bg-muted-foreground/20"></div>
          </div>
          {/* Body Mock */}
          <div className="p-6 grid grid-cols-4 gap-6 opacity-40">
            <div className="col-span-1 h-64 rounded-sm border border-border bg-card flex flex-col items-center justify-center gap-4">
              <div className="w-24 h-24 rounded-full border border-dashed border-primary/50 relative flex items-center justify-center">
                <div className="w-16 h-16 border border-tertiary rounded-full animate-[spin_10s_linear_infinite]"></div>
              </div>
              <div className="w-20 h-2 bg-primary/20"></div>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              <div className="h-24 rounded-sm border border-border bg-card"></div>
              <div className="h-24 rounded-sm border border-border bg-card"></div>
              <div className="h-24 rounded-sm border border-border bg-card"></div>
              <div className="col-span-3 h-36 rounded-sm border border-border bg-card relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
            <Link href="/dashboard" className="group inline-flex items-center gap-2 px-8 py-4 rounded-sm bg-primary border border-primary text-background font-data font-bold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(60,215,255,0.4)]">
              Enter Digital Twin <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function PreviewCard({ title, desc, icon: Icon, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="p-8 os-card border-border/50 hover:border-primary/50 transition-colors bg-card/80"
    >
      <Icon className="w-6 h-6 text-primary mb-6" />
      <h3 className="text-lg font-display font-bold text-foreground mb-3 uppercase tracking-wide">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm font-data uppercase tracking-wider">{desc}</p>
    </motion.div>
  );
}
