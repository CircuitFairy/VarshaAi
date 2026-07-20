"use client";

import { motion } from "framer-motion";
import { Database, Satellite, CloudRain, Cpu } from "lucide-react";

export default function DataSourcesPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-background p-10">
      <div className="max-w-4xl mx-auto z-10 relative mt-10 pb-20">
        <div className="mb-16 border-b border-border/50 pb-8">
          <p className="font-display text-chart-3 uppercase tracking-widest text-sm font-bold mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" /> Telemetry Ingestion
          </p>
          <h1 className="text-6xl font-bold text-foreground font-display tracking-tight mb-6">Global Data Sources</h1>
          <p className="text-xl text-foreground leading-relaxed max-w-3xl">
            VarshaAI ingests over 40 petabytes of atmospheric, terrestrial, and oceanic telemetry daily. 
            Our neural networks fuse multi-modal data streams to construct the most accurate digital twin of the planetary climate.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="os-card p-8 bg-background border-border/50 flex flex-col md:flex-row gap-8 items-start">
            <div className="p-4 bg-muted rounded-full border border-border">
              <Satellite className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Orbital Satellite Network</h3>
              <p className="text-sm text-primary font-data tracking-widest mb-4">UPDATE FREQUENCY: &lt; 5 MINUTES</p>
              <p className="text-muted-foreground leading-relaxed">
                Direct downlinks from geostationary and polar-orbiting satellites provide high-resolution thermal imaging, cloud cover vectors, and atmospheric density readings. We integrate feeds from the INSAT series, NOAA, and ESA networks.
              </p>
            </div>
          </div>

          <div className="os-card p-8 bg-background border-border/50 flex flex-col md:flex-row gap-8 items-start">
            <div className="p-4 bg-muted rounded-full border border-border">
              <CloudRain className="w-8 h-8 text-tertiary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Terrestrial Radar Arrays</h3>
              <p className="text-sm text-tertiary font-data tracking-widest mb-4">UPDATE FREQUENCY: REAL-TIME STREAMING</p>
              <p className="text-muted-foreground leading-relaxed">
                Over 400 Doppler weather radars across the subcontinent feed directly into the VarshaAI ingestion engine. This provides localized, high-fidelity precipitation modeling and microburst detection.
              </p>
            </div>
          </div>

          <div className="os-card p-8 bg-background border-border/50 flex flex-col md:flex-row gap-8 items-start">
            <div className="p-4 bg-muted rounded-full border border-border">
              <Cpu className="w-8 h-8 text-error" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">IoT Ground Sensors</h3>
              <p className="text-sm text-error font-data tracking-widest mb-4">UPDATE FREQUENCY: 60 SECONDS</p>
              <p className="text-muted-foreground leading-relaxed">
                Integration with smart-city infrastructure, agricultural soil moisture probes, and oceanic buoys. These micro-sensors provide the granular ground-truth data necessary to continually calibrate the predictive model.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
