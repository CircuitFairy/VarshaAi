"use client";

import { ArrowRight } from "lucide-react";
import { LaunchButton } from "../launch/LaunchButton";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 lg:px-12">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="VarshaAI Logo" className="h-6 w-6 object-contain" />
        <span className="font-display font-bold text-lg text-foreground tracking-widest">
          VARSHA<span className="text-primary">AI</span>
        </span>
        <span className="hidden sm:inline-block ml-3 px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-[10px] font-data text-primary uppercase tracking-widest">
          OS v2.0
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-xs font-data uppercase tracking-widest text-muted-foreground">
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#pipeline" className="hover:text-foreground transition-colors">Telemetry Hub</a>
          <a href="#features" className="hover:text-foreground transition-colors">Vectors</a>
        </div>
        
        <LaunchButton 
          href="/dashboard" 
          className="group flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-xs font-bold uppercase tracking-widest rounded-sm"
        >
          Launch Dashboard
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </LaunchButton>
      </div>
    </nav>
  );
}
