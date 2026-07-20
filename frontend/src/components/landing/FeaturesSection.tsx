"use client";

import { motion } from "framer-motion";
import { Activity, Globe, Shield, Cpu, Database, CloudRain } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Digital Twin",
    description: "A complete virtual representation of India's climate ecosystem, powered by real-time meteorological APIs and historical satellite data.",
    color: "from-blue-500 to-sky-500"
  },
  {
    icon: Activity,
    title: "Live Data Merging",
    description: "Instantaneous fusion of Open-Meteo, OpenAQ, and NASA POWER datasets to provide an accurate, up-to-the-minute atmospheric snapshot.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Cpu,
    title: "AI Inference Engine",
    description: "XGBoost and Random Forest architectures trained on decades of IMD data, running inference on the fly to predict extreme weather.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: CloudRain,
    title: "Climate Health Score",
    description: "A proprietary algorithm calculating a real-time 0-100 health index for every state, balancing live conditions against AI risk models.",
    color: "from-rose-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Disaster Alerting",
    description: "Automated early warning systems for floods, heatwaves, and droughts, designed to protect vulnerable infrastructure and agriculture.",
    color: "from-amber-500 to-yellow-500"
  },
  {
    icon: Database,
    title: "High-Performance API",
    description: "Asynchronous FastAPI backend with intelligent TTL caching, ensuring lightning-fast responses even under heavy concurrent load.",
    color: "from-slate-400 to-gray-500"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-32 relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-muted border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4"
          >
            ARCHITECTURE OVERVIEW
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 tracking-tighter uppercase"
          >
            ENGINEERING THE FUTURE OF <br className="hidden md:block"/><span className="text-primary drop-shadow-[0_0_15px_rgba(60,215,255,0.4)]">CLIMATE INTELLIGENCE</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg text-muted-foreground font-data uppercase tracking-wider leading-relaxed"
          >
            VarshaAI merges enterprise-grade software architecture with state-of-the-art machine learning to create a seamless, real-time simulation engine.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative os-card p-8 bg-card border-border/50 hover:border-primary/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-muted border border-primary/20">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-data text-[10px] text-muted-foreground uppercase tracking-widest">MODULE {String(idx + 1).padStart(2, '0')}</span>
              </div>
              
              <h3 className="text-lg font-display font-bold text-foreground mb-3 uppercase tracking-wide">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-data">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
