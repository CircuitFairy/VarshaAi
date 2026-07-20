"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LaunchButton } from "../launch/LaunchButton";

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden bg-background z-10 border-t border-border/50">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-primary/10 border border-primary/30 text-[10px] font-bold text-primary uppercase tracking-widest mb-6"
        >
          <span className="relative flex h-2 w-2 inline-block mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          SYSTEM READY
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-black text-foreground mb-6 tracking-tighter uppercase"
        >
          READY TO DEPLOY THE <br/> <span className="text-primary drop-shadow-[0_0_15px_rgba(60,215,255,0.4)]">DIGITAL TWIN?</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground font-data uppercase tracking-wider mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Access live weather data, AI-driven risk predictions, and advanced scenario simulations instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <LaunchButton href="/dashboard" className="group relative inline-flex items-center justify-center px-10 py-5 rounded-sm font-data font-bold text-background bg-primary border border-primary transition-all hover:bg-primary/90 shadow-[0_0_30px_rgba(60,215,255,0.3)]">
            <span className="relative flex items-center gap-2 text-sm tracking-widest uppercase">
              Launch Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </LaunchButton>
          
          <div className="pt-12 mt-12 border-t border-border/50 w-full max-w-lg relative z-20">
            <Link href="/developer" className="group flex flex-col items-center justify-center gap-4 p-8 os-card border-border/80 hover:border-primary transition-all bg-background/80 backdrop-blur-md shadow-lg">
              <span className="w-4 h-4 rounded-full border-2 border-primary group-hover:bg-primary transition-colors animate-pulse shadow-[0_0_10px_var(--primary)]"></span>
              <span className="text-sm md:text-lg font-data font-bold text-foreground group-hover:text-primary transition-colors tracking-[0.2em] uppercase">
                Access Developer Information
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
