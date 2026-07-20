"use client";

import { motion } from "framer-motion";
import { Brain, Satellite, ArrowRight, Sparkles, User, Mail, Globe, Share2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-8 py-12 flex-1 space-y-16">
        {/* Status Chip */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-data text-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            SYSTEM_ARCHITECT_ONLINE
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7 space-y-6">
              <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground tracking-tight">
                Ananya <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3cd7ff] to-[#a8e8ff]">Rout</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-primary border-b border-border/50 pb-3">
                Electronics & Communication Engineering | AI • ML
              </h2>
              <p className="text-base text-foreground leading-relaxed max-w-2xl">
                Engineering the intersection of machine intelligence and planetary systems. Building intelligent architectures that translate complex global data into actionable insights for climate resilience and sustainable futures.
              </p>
              <div className="flex gap-4 pt-2">
                <Link
                  href="/digital-twin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-[#3cd7ff] to-[#00d4ff] text-background hover:brightness-110 transition-all hover:scale-[1.02]"
                >
                  View Projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="px-6 py-3 rounded-lg text-sm font-bold text-foreground bg-muted border border-border hover:bg-[#1c2b3c] hover:border-primary/50 transition-all hover:scale-[1.02]">
                  Connect
                </button>
              </div>
            </div>

            {/* Futuristic Holographic Avatar Placeholder */}
            <div className="col-span-12 md:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#3cd7ff]/30 via-[#7701d0]/20 to-transparent rounded-full blur-3xl" />
                <div className="w-full h-full rounded-full bg-muted border-2 border-primary/40 flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_50px_rgba(60,215,255,0.15)]">
                  {/* Glowing Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#3cd7ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Photo / Avatar Placeholder Representation */}
                  <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <User className="w-12 h-12" />
                  </div>
                  
                  <p className="font-display text-lg font-bold text-foreground">Ananya Rout</p>
                  <p className="font-data text-xs text-tertiary mt-0.5">System Architect & Developer</p>
                  
                  <div className="flex gap-3 mt-4">
                    <span className="p-2 rounded-lg bg-muted border border-border text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="w-4 h-4" />
                    </span>
                    <span className="p-2 rounded-lg bg-muted border border-border text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Competencies Bento Grid */}
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-8">Core Competencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="col-span-1 md:col-span-2 os-card p-6 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer group border-border hover:border-primary">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/30">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <span className="font-data text-xs text-muted-foreground group-hover:text-primary transition-colors">SYS.01</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">Artificial Intelligence & ML</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Developing predictive models and deep learning architectures for complex spatial data analysis.
                </p>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="col-span-1 os-card p-6 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer group border-border hover:border-tertiary">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center border border-tertiary/30">
                  <Satellite className="w-6 h-6 text-tertiary" />
                </div>
                <span className="font-data text-xs text-muted-foreground group-hover:text-tertiary transition-colors">GEO.02</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">GIS & Remote Sensing</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  Processing satellite imagery for environmental monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
