"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useWeather } from "@/components/weather/WeatherProvider";
import { HeroSection } from "@/components/landing/HeroSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { DataPipelineSection } from "@/components/landing/DataPipelineSection";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { motion } from "framer-motion";

export default function Home() {
  const { setWeather } = useWeather();

  // Intersection observers for different weather zones
  const { ref: clearRef, inView: clearInView } = useInView({ threshold: 0.3 });
  const { ref: droughtRef, inView: droughtInView } = useInView({ threshold: 0.3 });
  const { ref: stormRef, inView: stormInView } = useInView({ threshold: 0.3 });
  const { ref: solutionRef, inView: solutionInView } = useInView({ threshold: 0.3 });
  const { ref: rainRef, inView: rainInView } = useInView({ threshold: 0.3 });

  // Handle weather changes based on scroll
  useEffect(() => {
    if (stormInView) setWeather("THUNDERSTORM");
    else if (droughtInView) setWeather("DROUGHT");
    else if (rainInView) setWeather("RAIN");
    else if (solutionInView || clearInView) setWeather("CLEAR");
  }, [clearInView, droughtInView, stormInView, solutionInView, rainInView, setWeather]);

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden relative bg-background">
      <LandingNavbar />
      
      {/* 1. Hero (Clear / Aurora) */}
      <div ref={clearRef}>
        <HeroSection />
      </div>

      {/* 2. The Problem: Drought & Heat */}
      <div ref={droughtRef} className="min-h-[80vh] flex flex-col items-center justify-center relative py-32 px-4">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-display font-black text-error mb-8 text-center drop-shadow-[0_0_20px_rgba(255,180,171,0.5)] tracking-tighter"
        >
          INDIA IS BURNING.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-xl md:text-3xl max-w-4xl text-center text-muted-foreground font-data uppercase tracking-widest leading-relaxed"
        >
          Unprecedented heatwaves. Agricultural belts turning to dust. Traditional forecasting models are failing us.
        </motion.p>
      </div>

      {/* 3. The Chaos: Thunderstorm & Floods */}
      <div ref={stormRef} className="min-h-[80vh] flex flex-col items-center justify-center relative py-32 px-4">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-display font-black text-primary mb-8 text-center drop-shadow-[0_0_20px_rgba(60,215,255,0.5)] tracking-tighter"
        >
          THEN, THE FLOODS COME.
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-xl md:text-3xl max-w-4xl text-center text-muted-foreground font-data uppercase tracking-widest leading-relaxed"
        >
          Flash floods devastate infrastructure. Cities drown. Lives lost due to lack of predictive intelligence.
        </motion.p>
      </div>

      {/* 4. The Solution: Clear Skies (VarshaAI Intro) */}
      <div ref={solutionRef} className="min-h-[80vh] flex flex-col items-center justify-center relative py-32 px-4" id="architecture">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-tertiary font-data text-sm font-bold tracking-[0.3em] uppercase mb-4">SYSTEM PROTOCOL 1.0</p>
          <h2 className="text-5xl md:text-7xl font-display font-black text-foreground mb-8 tracking-tighter">
            PREDICT THE UNPREDICTABLE.
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground font-data uppercase tracking-widest leading-relaxed">
            VarshaAI ingests billions of live telemetry points through our proprietary XGBoost Neural Architecture to give you the ultimate unfair advantage against nature.
          </p>
        </motion.div>
      </div>

      {/* 5. Rest of the site (mixed weather zones) */}
      <div className="relative z-10 bg-transparent">
        
        <div ref={clearRef} id="features">
          <UseCasesSection />
        </div>
        
        <div ref={rainRef} className="bg-background/80 backdrop-blur-md py-20 border-t border-border/50" id="pipeline">
          <DataPipelineSection />
        </div>
        
        <div ref={clearRef}>
          <DashboardPreviewSection />
        </div>
        
        <div className="bg-background/80 backdrop-blur-md border-t border-border/50">
          <FeaturesSection />
        </div>

      </div>

      <div ref={clearRef}>
        <CTASection />
      </div>

    </div>
  );
}
