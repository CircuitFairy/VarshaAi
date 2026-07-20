"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Satellite, Play, Layers, Compass, Target } from "lucide-react";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function SatellitePage() {
  const [opacity, setOpacity] = useState(85);
  const [spectrumMode, setSpectrumMode] = useState<"visible" | "infrared" | "vapor">("visible");

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map Background */}
      <MapView interactive showControls={false} />

      {/* TOP-LEFT: Satellite Intel Card */}
      <div className="absolute top-6 left-6 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6 min-w-[340px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground tracking-wide">SATELLITE INTEL</h2>
              <p className="font-data text-xs text-muted-foreground">REAL-TIME ORBITAL TELEMETRY</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-border/50">
            <div>
              <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>Active Stream</p>
              <p className="font-data text-sm text-foreground mt-0.5">INSAT-3D Visible + IR</p>
            </div>
            <div>
              <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>Region Focus</p>
              <p className="font-data text-sm text-primary mt-0.5">South Asia Sector 7</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        <button className="w-12 h-12 glass rounded-xl flex items-center justify-center text-foreground hover:text-primary transition-colors border border-border">
          <Layers className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 glass rounded-xl flex items-center justify-center text-foreground hover:text-primary transition-colors border border-border">
          <Target className="w-5 h-5" />
        </button>
        <button className="w-12 h-12 glass rounded-xl flex items-center justify-center text-foreground hover:text-primary transition-colors border border-border">
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* BOTTOM-LEFT: Temporal Playback */}
      <div className="absolute bottom-6 left-6 right-[440px] z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-5"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="label-caps text-primary" style={{ fontSize: "11px" }}>Temporal Playback</span>
            <span className="font-data text-xs text-muted-foreground">UTC 14:32:00 / -24H</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full border border-border bg-muted flex items-center justify-center text-foreground hover:border-primary transition-colors">
              <Play className="w-4 h-4 ml-0.5" />
            </button>

            <input
              type="range"
              min={0}
              max={100}
              defaultValue={80}
              className="flex-1 h-1 bg-border rounded-full appearance-none cursor-pointer accent-[#3cd7ff]"
            />
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground font-data mt-2">
            <span>-24h</span>
            <span>-12h</span>
            <span>Now</span>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM-RIGHT: Motion & Spectrum Controls */}
      <div className="absolute bottom-6 right-6 z-10 w-96">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-foreground">Cloud Motion Opacity</span>
            <span className="font-data text-xs text-primary">{opacity}%</span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-[#3cd7ff]"
          />

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/50">
            {(["visible", "infrared", "vapor"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSpectrumMode(mode)}
                className={`py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                  spectrumMode === mode
                    ? "bg-primary text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
