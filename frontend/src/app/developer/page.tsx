"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Code2, Briefcase, Hash, Mail, Terminal } from "lucide-react";

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      
      {/* Background Grids */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Navbar */}
      <nav className="h-16 border-b border-border/50 flex items-center px-6 relative z-10 bg-background/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-data text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          Back to System
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl os-card border-border/50 p-8 md:p-12 relative overflow-hidden"
        >
          {/* Card Accent Lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-primary/20"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-primary/20"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Avatar / Photo */}
            <div className="flex-shrink-0 relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-sm border-2 border-primary p-1">
                <div className="w-full h-full bg-card flex items-center justify-center relative overflow-hidden">
                  {/* Photo is expected at public/ananya.png */}
                  <img src="/ananya.png" alt="Ananya Rout" className="w-full h-full object-cover opacity-90" 
                    onError={(e) => {
                      // Fallback to logo if ananya.png is not yet added
                      (e.target as HTMLImageElement).src = "/logo.png";
                      (e.target as HTMLImageElement).className = "w-16 h-16 object-contain opacity-80";
                    }}
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2 bg-background border border-primary px-2 py-1 rounded-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></div>
                <span className="text-[9px] font-data text-primary uppercase tracking-widest">Online</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 inline-flex items-center gap-2 px-2 py-1 bg-muted border border-border text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                <Terminal className="w-3 h-3" />
                SYSTEM ARCHITECT
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-black text-foreground uppercase tracking-tighter mb-2">
                Ananya Rout
              </h1>
              <p className="text-sm font-data text-muted-foreground mb-6 leading-relaxed">
                Lead engineer and visionary behind VarshaAI Climate OS. Specialized in XGBoost neural architectures, asynchronous high-throughput systems, and disaster mitigation telemetry.
              </p>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto md:mx-0">
                <a href="https://github.com/CircuitFairy" target="_blank" rel="noopener noreferrer" className="os-card p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                  <Code2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-data font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/arout06/" target="_blank" rel="noopener noreferrer" className="os-card p-3 flex items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors group">
                  <Briefcase className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-data font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">LinkedIn</span>
                </a>
                {/* Email spans 2 columns */}
                <a href="mailto:ananyarout2006@gmail.com" className="col-span-2 os-card p-3 flex items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors group border-primary/20 bg-primary/5">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-data font-bold uppercase tracking-widest text-primary">Contact via Email</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

    </div>
  );
}
