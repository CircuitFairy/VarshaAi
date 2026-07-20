"use client";

import { motion } from "framer-motion";
import { Code, Terminal, Key, Server } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-background p-10">
      <div className="max-w-4xl mx-auto z-10 relative mt-10 pb-20">
        <div className="mb-16 border-b border-border/50 pb-8">
          <p className="font-display text-tertiary uppercase tracking-widest text-sm font-bold mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" /> Developer Interface
          </p>
          <h1 className="text-6xl font-bold text-foreground font-display tracking-tight mb-6">API Documentation</h1>
          <p className="text-xl text-foreground leading-relaxed max-w-3xl">
            Integrate VarshaAI's planetary-scale predictive intelligence directly into your own infrastructure. 
            Our RESTful API provides high-throughput access to live telemetry, predictive trajectories, and simulated disaster outcomes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="os-card p-6 bg-background border-border/50">
            <Terminal className="w-6 h-6 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">RESTful JSON</h3>
            <p className="text-sm text-muted-foreground">Standardized JSON responses for universal compatibility across tech stacks.</p>
          </div>
          <div className="os-card p-6 bg-background border-border/50">
            <Key className="w-6 h-6 text-chart-3 mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">JWT Auth</h3>
            <p className="text-sm text-muted-foreground">Secure stateless authentication utilizing industry-standard JWT tokens.</p>
          </div>
          <div className="os-card p-6 bg-background border-border/50">
            <Server className="w-6 h-6 text-tertiary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">99.999% Uptime</h3>
            <p className="text-sm text-muted-foreground">Edge-deployed architecture ensuring ultra-low latency globally.</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="os-card p-0 bg-background overflow-hidden border-border/50">
            <div className="bg-muted p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground font-mono">POST /api/v1/predict</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded">CORE</span>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-4">Request a 72-hour neural prediction for a specific geographical boundary.</p>
              <div className="bg-background p-4 rounded border border-border/30 font-mono text-sm text-foreground overflow-x-auto">
                <pre>{`{
  "state": "Odisha",
  "district": "Khordha",
  "lat": 20.2961,
  "lon": 85.8245,
  "time_horizon": "72 Hours"
}`}</pre>
              </div>
            </div>
          </div>

          <div className="os-card p-0 bg-background overflow-hidden border-border/50">
            <div className="bg-muted p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground font-mono">POST /api/v1/simulate</h3>
              <span className="px-3 py-1 bg-error/10 text-error text-xs font-bold rounded">ADVANCED</span>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-4">Run a planetary fluid dynamics simulation with custom climate modifiers.</p>
              <div className="bg-background p-4 rounded border border-border/30 font-mono text-sm text-foreground overflow-x-auto">
                <pre>{`{
  "temp_offset": 2.5,
  "rainfall_multiplier": 1.2,
  "humidity_offset": -5.0,
  "wind_multiplier": 1.5
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
