"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useOSStore } from "@/store/useOSStore";
import { runSimulationAPI } from "@/lib/api";
import { indianLocations } from "@/lib/locations";
import { formatTemp, formatTempUnit } from "@/lib/formatters";
import {
  Rocket,
  Play,
  Flame,
  Droplets,
  ArrowRight,
  SlidersHorizontal,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Cpu,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function MissionControlPage() {
  const { 
    simulationParams, 
    setSimulationParams, 
    resetSimulation, 
    setActiveLayer,
    simulationData,
    setSimulationData,
    simulationStateName,
    setSimulationStateName,
    unitSystem
  } = useOSStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [lastScenario, setLastScenario] = useState<{ id: string; timestamp: string } | null>(null);

  // Initialize selected state to first location if null
  if (simulationStateName === null) {
    setSimulationStateName(indianLocations[0].state);
  }

  const heatwaveBaseline = 24;
  const floodBaseline = 4.2;

  // Deriving values from actual API response if present
  const isSimulated = !!simulationData;
  const simulatedTempOffset = isSimulated ? simulationData.calculatedTempOffset : simulationParams.tempAnomaly;
  const simulatedRainMultiplier = isSimulated ? simulationData.calculatedRainMultiplier : simulationParams.precipVariance;
  
  const heatwaveSimulated = isSimulated && simulationData.floodRisk !== "High" 
    ? Math.round(heatwaveBaseline + simulatedTempOffset * 29) 
    : Math.round(heatwaveBaseline + simulationParams.tempAnomaly * 29);
    
  const floodSimulated = isSimulated && simulationData.floodRisk === "High"
    ? (floodBaseline + simulatedRainMultiplier * 0.1).toFixed(1)
    : (floodBaseline + simulationParams.precipVariance * 0.1).toFixed(1);

  const handleGenerateSimulation = async () => {
    setIsGenerating(true);
    setGenerationStep("Initializing Neural Model Weights...");

    try {
      // Step 1: Initial Backend handshake
      setTimeout(() => setGenerationStep("Connecting to VRSH-4.2 Simulation Engine..."), 300);
      
      // Step 2: Actually run the API call
      const res = await runSimulationAPI(
        simulationParams.tempAnomaly,
        simulationParams.precipVariance,
        0, // humidity not in UI yet
        0  // wind not in UI yet
      );
      
      setGenerationStep("Simulating Thermal & Hydrological Runoff Vectors...");
      
      setTimeout(() => {
        setGenerationStep("Synchronizing Digital Twin Map Layers...");
        
        // Update store with simulation result
        setSimulationData({
          id: res.id,
          floodRisk: res.flood_risk,
          droughtRisk: res.drought_risk,
          calculatedTempOffset: simulationParams.tempAnomaly,
          calculatedRainMultiplier: simulationParams.precipVariance
        });
        
        // Switch active layer to reflect the dominant anomaly for MapView base color
        if (Math.abs(simulationParams.tempAnomaly) >= 1.5 && Math.abs(simulationParams.precipVariance) < 20) {
          setActiveLayer("temperature");
        } else if (Math.abs(simulationParams.precipVariance) >= 10) {
          setActiveLayer("rainfall");
        } else {
          setActiveLayer("satellite");
        }
      }, 600);

      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStep("");
        setLastScenario({
          id: `SIM-VRSH-${res.id || Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }, 1000);

    } catch (e) {
      console.error(e);
      setGenerationStep("Simulation Failed. Engine Disconnected.");
      setTimeout(() => setIsGenerating(false), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Page Header */}
      <div className="px-8 pt-6 pb-4 flex items-end justify-between flex-shrink-0 border-b border-border/50 bg-muted">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary flex items-center gap-3">
            <Rocket className="w-8 h-8" />
            Climate Simulation Workspace
          </h1>
          <p className="text-foreground mt-1.5 text-sm max-w-2xl">
            Execute predictive modeling on the planetary digital twin. Adjust macro-variables to observe localized impacts.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <p className="text-[10px] text-muted-foreground font-data mb-1 uppercase tracking-wider">Simulation Target Region</p>
            <select
              value={simulationStateName || ""}
              onChange={(e) => setSimulationStateName(e.target.value)}
              className="bg-muted text-xs font-data text-foreground border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
            >
              {indianLocations.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
            </select>
          </div>

          <button
            onClick={() => {
              resetSimulation();
              setLastScenario(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 mt-4 bg-muted border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors h-[38px]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-5 px-8 py-5 overflow-hidden min-h-0">
        {/* Left: Scenario Engine Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[360px] flex-shrink-0 os-card p-6 flex flex-col overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/50">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Scenario Engine</h3>
              <p className="text-[11px] text-muted-foreground font-data mt-0.5">Macro-Vector Calibration</p>
            </div>
            <SlidersHorizontal className="w-5 h-5 text-primary" />
          </div>

          <div className="flex flex-col gap-7 flex-1">
            {/* Temperature Anomaly */}
            <div className="bg-muted p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>TEMP ANOMALY DELTA</p>
                <p className="font-data text-base font-bold text-primary">
                  {simulationParams.tempAnomaly >= 0 ? `+${formatTemp(simulationParams.tempAnomaly, unitSystem)}` : formatTemp(simulationParams.tempAnomaly, unitSystem)} {formatTempUnit(unitSystem)}
                </p>
              </div>
              <input
                type="range"
                min={-5}
                max={5}
                step={0.1}
                value={simulationParams.tempAnomaly}
                onChange={(e) => setSimulationParams({ tempAnomaly: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-[#3cd7ff]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-data mt-2">
                <span>-{formatTemp(5.0, unitSystem)}{formatTempUnit(unitSystem)}</span>
                <span>Baseline</span>
                <span>+{formatTemp(5.0, unitSystem)}{formatTempUnit(unitSystem)}</span>
              </div>
            </div>

            {/* Precipitation Variance */}
            <div className="bg-muted p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>PRECIPITATION VARIANCE</p>
                <p className="font-data text-base font-bold text-primary">
                  {simulationParams.precipVariance >= 0 ? `+${simulationParams.precipVariance}%` : `${simulationParams.precipVariance}%`}
                </p>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                step={1}
                value={simulationParams.precipVariance}
                onChange={(e) => setSimulationParams({ precipVariance: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-[#3cd7ff]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-data mt-2">
                <span>-50% Drought</span>
                <span>0%</span>
                <span>+50% Deluge</span>
              </div>
            </div>

            {/* Sea Level Rise */}
            <div className="bg-muted p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="label-caps text-primary" style={{ fontSize: "10px" }}>SEA LEVEL RISE</p>
                <p className="font-data text-base font-bold text-primary">{simulationParams.seaLevelRise.toFixed(1)} m</p>
              </div>
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={simulationParams.seaLevelRise}
                onChange={(e) => setSimulationParams({ seaLevelRise: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-[#3cd7ff]"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-data mt-2">
                <span>0m Baseline</span>
                <span>1.0m</span>
                <span>2.0m Inundation</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateSimulation}
            disabled={isGenerating}
            className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-background transition-all disabled:opacity-80 shadow-lg"
            style={{ background: "linear-gradient(135deg, #3cd7ff 0%, #6af7ba 100%)" }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>CALCULATING SCENARIO...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>GENERATE SIMULATION</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Center Map + Impact Analysis */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Simulation Map Canvas */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-border shadow-2xl">
            <MapView interactive={false} showControls={false} hideAqiLegend>
              {/* Map Children */}
            </MapView>
            
            <div className="absolute top-4 left-4 z-10 glass rounded-xl px-4 py-2.5 flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="font-data text-xs text-foreground font-bold">Simulation Target: {simulationStateName}</span>
            </div>

            {/* Live Progress Overlay */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center text-center"
                >
                  <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
                  <div className="z-30 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                    <p className="font-display text-xl font-bold text-foreground mb-2 tracking-wide shadow-black drop-shadow-lg">RUNNING SIMULATION ENGINE</p>
                    <p className="font-data text-xs text-primary animate-pulse">{generationStep}</p>
                  </div>
                  <motion.div 
                    animate={{ y: ["-50%", "150%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute z-20 w-full h-32 bg-gradient-to-b from-transparent via-[#3cd7ff]/20 to-transparent border-b border-primary/50 shadow-[0_0_30px_rgba(60,215,255,0.3)] pointer-events-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated Scenario Confirmation Banner */}
            <AnimatePresence>
              {lastScenario && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 right-4 z-10 glass rounded-xl px-4 py-3 border border-tertiary/50 flex items-center gap-3 bg-tertiary/10 shadow-xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-tertiary" />
                  <div>
                    <p className="font-data text-xs text-foreground font-bold">{lastScenario.id} GENERATED</p>
                    <p className="text-[10px] text-tertiary font-data">Exec Time: {lastScenario.timestamp}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Overlay Telemetry */}
            <div className="absolute bottom-0 left-0 right-0 z-10 glass border-t border-border/50">
              <div className="grid grid-cols-3 divide-x divide-[#3c494e]/50">
                <div className="px-5 py-3">
                  <p className="text-xs text-muted-foreground">Thermal Anomaly Area</p>
                  <p className="font-data text-base font-bold text-primary mt-0.5">
                    {(1.2 + simulationParams.tempAnomaly * 0.4).toFixed(1)}M sq km
                  </p>
                </div>
                <div className="px-5 py-3">
                  <p className="text-xs text-muted-foreground">Precipitation Vector</p>
                  <p className="font-data text-base font-bold text-foreground mt-0.5">
                    {simulationParams.precipVariance >= 0 ? `+${simulationParams.precipVariance}% Surplus` : `${simulationParams.precipVariance}% Deficit`}
                  </p>
                </div>
                <div className="px-5 py-3">
                  <p className="text-xs text-muted-foreground">Sea Level Displace</p>
                  <p className="font-data text-base font-bold text-error mt-0.5">
                    {simulationParams.seaLevelRise > 0 ? `+${simulationParams.seaLevelRise}m Coastal Surge` : "Nominal (0m)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Simulated Impact Cards */}
          <div className="grid grid-cols-2 gap-5 flex-shrink-0">
            {/* Heatwave Probability Card */}
            <div className={`os-card p-5 transition-colors duration-500 ${isSimulated && simulationParams.tempAnomaly > 1 ? 'border-error/50' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-error/10 border border-error/30 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-error" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Heatwave Risk Index</p>
                  <p className="text-xs text-muted-foreground font-data">Impact on {simulationStateName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Current Live</p>
                  <p className="font-data text-xl text-foreground font-bold">{heatwaveBaseline}%</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-error uppercase">Simulated Future</p>
                  <p className="font-data text-2xl font-bold text-error">{Math.min(100, Math.max(0, heatwaveSimulated))}%</p>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-[#3cd7ff] to-[#ffb4ab] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, heatwaveSimulated))}%` }}
                />
              </div>
            </div>

            {/* Flood Risk Card */}
            <div className={`os-card p-5 transition-colors duration-500 ${isSimulated && simulationData?.floodRisk === "High" ? 'border-primary/50' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Hydrological Flood Index</p>
                  <p className="text-xs text-muted-foreground font-data">Impact on {simulationStateName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Current Live</p>
                  <p className="font-data text-xl text-foreground font-bold">Idx {floodBaseline}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-primary uppercase">Simulated Future</p>
                  <p className="font-data text-2xl font-bold text-primary">Idx {floodSimulated}</p>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full mt-4 overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-[#3cd7ff] to-[#6af7ba] transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(0, parseFloat(floodSimulated) * 10))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
