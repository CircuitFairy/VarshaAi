"use client";

import { motion } from "framer-motion";
import { Wheat, Siren, Building2, User } from "lucide-react";

export function UseCasesSection() {
  const cases = [
    {
      title: "Agriculture & Farmers",
      icon: Wheat,
      color: "from-amber-400 to-orange-500",
      desc: "Protect livelihoods. VarshaAI predicts drought and rainfall patterns months in advance, helping farmers optimize crop cycles and irrigation schedules to secure yields."
    },
    {
      title: "Disaster Management",
      icon: Siren,
      color: "from-red-500 to-rose-600",
      desc: "Save lives. Receive automated, AI-driven early warnings for extreme floods and lethal heatwaves, enabling rapid, targeted government evacuation protocols."
    },
    {
      title: "Urban Planning",
      icon: Building2,
      color: "from-sky-400 to-indigo-500",
      desc: "Build resilient cities. Simulate the impact of rising temperatures on power grids and water supply to design infrastructure that withstands tomorrow's climate."
    },
    {
      title: "Everyday Citizens",
      icon: User,
      color: "from-emerald-400 to-teal-500",
      desc: "Stay safe daily. Use the Climate Health Score to instantly know if the air quality and temperature in your state are safe for outdoor activities."
    }
  ];

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
            OPERATIONAL CAPABILITIES
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 tracking-tighter uppercase"
          >
            One Engine. <span className="text-primary drop-shadow-[0_0_15px_rgba(60,215,255,0.4)]">Total Protection.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-data uppercase tracking-wider leading-relaxed"
          >
            From rural farms to sprawling megacities, VarshaAI is the singular solution designed to shield every layer of Indian society from the chaos of a changing climate.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c, i) => {
            const isError = i === 1; // Disaster management -> red
            const isTertiary = i === 3; // Everyday citizens -> green
            const colorClass = isError ? "text-error border-error/50" : isTertiary ? "text-tertiary border-tertiary/50" : "text-primary border-primary/50";
            const bgHover = isError ? "hover:border-error" : isTertiary ? "hover:border-tertiary" : "hover:border-primary";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`group relative overflow-hidden os-card p-10 transition-colors border-border/40 ${bgHover}`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-border group-hover:bg-primary transition-colors duration-500"></div>
                
                <div className={`w-12 h-12 mb-6 flex items-center justify-center rounded-sm bg-muted border ${colorClass} bg-opacity-20`}>
                  <c.icon className={`w-6 h-6 ${isError ? 'text-error' : isTertiary ? 'text-tertiary' : 'text-primary'}`} />
                </div>
                
                <h3 className="text-xl font-display font-bold text-foreground mb-4 tracking-wide uppercase">{c.title}</h3>
                <p className="text-muted-foreground text-sm font-data leading-relaxed">{c.desc}</p>
                
                <div className="mt-6 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isError ? 'bg-error' : isTertiary ? 'bg-tertiary' : 'bg-primary'}`}></span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">MODULE ACTIVE</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
