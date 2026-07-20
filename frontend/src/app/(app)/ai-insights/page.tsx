"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useOSStore } from "@/store/useOSStore";
import { indianLocations } from "@/lib/locations";
import { Brain, Info, Droplets, Flame, ChevronDown, Activity, Play } from "lucide-react";
import { formatTemp, formatTempUnit, formatPrecip, formatPrecipUnit } from "@/lib/formatters";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function AIInsightsPage() {
  const { predictionData, liveWeatherData, isLoading, fetchDataForLocation, predictionTimeHorizon, setPredictionTimeHorizon, activeLayer, unitSystem } = useOSStore();
  
  const [selectedStateName, setSelectedStateName] = useState(indianLocations[0].state);
  const [selectedDistrictName, setSelectedDistrictName] = useState(indianLocations[0].regions[0].name);

  // Deriving UI values
  const precipitation = predictionData?.predicted_rainfall?.toFixed(1) || "0.0";
  const temp = predictionData?.predicted_temp?.toFixed(1) || "0.0";
  const anomaly = predictionData?.predicted_temp && liveWeatherData?.temperature
    ? (predictionData.predicted_temp - liveWeatherData.temperature).toFixed(1)
    : "0.0";
  const anomalyNum = parseFloat(anomaly);
  
  const floodRisk = predictionData?.confidence ? Math.min(99, predictionData.confidence + (predictionData.predicted_rainfall > 100 ? 15 : -5)).toFixed(0) : "0";
  const heatwaveRisk = predictionData?.heatwave_risk === "Extreme" ? "98" : predictionData?.heatwave_risk === "High" ? "82" : predictionData?.heatwave_risk === "Moderate" ? "45" : "15";

  const handlePredict = () => {
    const stateObj = indianLocations.find(s => s.state === selectedStateName);
    const regionObj = stateObj?.regions.find(r => r.name === selectedDistrictName);
    if (stateObj && regionObj) {
      fetchDataForLocation(stateObj.state, regionObj.name);
    }
  };

  const featureWeights = predictionData?.feature_importance || {
    "Awaiting Model Execution": 0
  };

  const timeHorizons = ["24 Hours", "7 Days", "30 Days"];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Interactive Header Controls */}
      <div className="px-8 pt-6 pb-4 flex items-end justify-between flex-shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            AI Prediction Workspace
          </h1>
          <p className="text-foreground mt-1.5 text-sm max-w-xl">
            Configure parameters and run the VRSH-4.2 Neural Network for predictive geospatial forecasting.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-muted/80 backdrop-blur-md p-2 rounded-xl border border-border">
          {/* Target Region Selectors */}
          <div className="flex gap-2">
            <select
              value={selectedStateName}
              onChange={(e) => {
                setSelectedStateName(e.target.value);
                const s = indianLocations.find(x => x.state === e.target.value);
                if (s) setSelectedDistrictName(s.regions[0].name);
              }}
              className="bg-[#0f1a24] text-xs font-data text-foreground border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
            >
              {indianLocations.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
            </select>
            <select
              value={selectedDistrictName}
              onChange={(e) => setSelectedDistrictName(e.target.value)}
              className="bg-[#0f1a24] text-xs font-data text-foreground border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
            >
              {indianLocations.find(s => s.state === selectedStateName)?.regions.map(r => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Time Horizon Selector */}
          <div className="flex gap-1">
            {timeHorizons.map(horizon => (
              <button
                key={horizon}
                onClick={() => setPredictionTimeHorizon(horizon)}
                className={`px-3 py-2 rounded-lg font-data text-[10px] uppercase font-bold transition-all ${predictionTimeHorizon === horizon ? "bg-primary/20 text-primary border border-primary/50" : "bg-[#0f1a24] text-muted-foreground border border-border hover:text-foreground"}`}
              >
                {horizon}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Run Predictor Action */}
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wide transition-all ${isLoading ? "bg-primary/20 text-primary cursor-not-allowed" : "bg-primary text-[#07131f] hover:bg-[#2bbfe6] shadow-[0_0_15px_rgba(60,215,255,0.4)] hover:shadow-[0_0_25px_rgba(60,215,255,0.6)]"}`}
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Activity className="w-4 h-4" />
              </motion.div>
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isLoading ? "Running VRSH-4.2..." : "Run Predictor"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-5 px-8 pb-5 overflow-hidden min-h-0">
        {/* Map Area */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-border">
          <MapView interactive={false} showControls hideAqiLegend>
            {/* HUD Elements over map */}
            <div className="absolute top-4 left-4 z-10 glass rounded-lg px-4 py-2.5">
              <p className="label-caps text-primary" style={{ fontSize: "11px" }}>DIGITAL TWIN: INDIA</p>
              <p className="font-data text-xs text-muted-foreground mt-0.5 uppercase">TARGET: {selectedStateName}</p>
            </div>

            {/* Model Status Indicator */}
            <div className="absolute top-4 right-12 z-10 glass px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isLoading ? "bg-chart-3 animate-pulse" : predictionData ? "bg-tertiary" : "bg-muted-foreground"}`} />
              <span className="font-data text-[10px] font-bold text-foreground">
                {isLoading ? "INFERENCE RUNNING..." : predictionData ? "MODEL COMPILED" : "AWAITING EXECUTION"}
              </span>
            </div>

            {/* Scanning Overlay during loading */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  <div className="absolute inset-0 bg-[#07131f]/40" />
                  <motion.div 
                    animate={{ y: ["-10%", "110%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-full h-32 bg-gradient-to-b from-transparent via-[#3cd7ff]/20 to-transparent border-b border-primary/50 shadow-[0_0_30px_rgba(60,215,255,0.3)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="font-display text-2xl font-bold text-primary animate-pulse tracking-[0.2em] mix-blend-screen shadow-black drop-shadow-lg">
                      ANALYZING SPATIAL DATA
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </MapView>

          {/* Bottom Telemetry Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 glass border-t border-border/50 backdrop-blur-xl">
            <div className="flex items-center">
              <div className="flex-1 px-6 py-4 border-r border-border/50">
                <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>Forecasted Precipitation</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="font-data text-3xl text-primary">{formatPrecip(precipitation, unitSystem)}</p>
                  <span className="text-sm font-data text-muted-foreground">{formatPrecipUnit(unitSystem)}</span>
                </div>
              </div>
              <div className="flex-1 px-6 py-4 border-r border-border/50">
                <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>Forecasted Temp & Anomaly</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="font-data text-3xl text-foreground">{formatTemp(temp, unitSystem)}<span className="text-sm text-muted-foreground">{formatTempUnit(unitSystem)}</span></p>
                  <span className={`font-data text-sm font-bold ml-2 ${anomalyNum > 0 ? "text-error" : "text-tertiary"}`}>
                    {anomalyNum > 0 ? "+" : ""}{formatTemp(anomaly, unitSystem)}{formatTempUnit(unitSystem)}
                  </span>
                </div>
              </div>
              <div className="flex-1 px-6 py-4">
                <p className="label-caps text-muted-foreground" style={{ fontSize: "10px" }}>Overall Confidence Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="font-data text-3xl text-tertiary">{predictionData?.confidence || "0.0"}</p>
                  <span className="text-sm font-data text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Analytics & XAI */}
        <div className="w-96 flex-shrink-0 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
          
          {/* Explainable AI (XAI) Feature Importance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="os-card p-5 border-primary/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Model Feature Weights
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase">Explainable AI (XAI) Drivers</p>
              </div>
              <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
            </div>
            
            <div className="flex flex-col gap-4 mt-6">
              {Object.entries(featureWeights).map(([feature, weight], i) => (
                <div key={i} className="relative">
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-data text-xs text-foreground">{feature}</span>
                    <span className="font-data text-[10px] font-bold text-primary">{weight}%</span>
                  </div>
                  {/* Tailwind Progress Bar */}
                  <div className="w-full h-1.5 bg-[#07131f] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${weight}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#3cd7ff]/50 to-[#3cd7ff]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Risk Confidence Matrix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="os-card p-5 flex-1"
          >
            <h3 className="text-base font-display font-semibold text-foreground mb-1">Risk Confidence Matrix</h3>
            <p className="text-[10px] text-muted-foreground uppercase mb-6">Probability of extreme events</p>
            
            <div className="flex flex-col gap-6">
              {/* Flood Gauge */}
              <div className="flex items-center gap-6 p-4 bg-[#0a1520] rounded-xl border border-border/50 hover:border-primary/30 transition-colors">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted"
                      stroke="currentColor" strokeWidth="3" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      className={parseInt(floodRisk) > 75 ? "text-error" : "text-primary"}
                      stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${floodRisk}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${floodRisk}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Droplets className={`w-5 h-5 ${parseInt(floodRisk) > 75 ? "text-error" : "text-primary"}`} />
                  </div>
                </div>
                <div>
                  <p className="font-data text-2xl font-bold text-foreground">{floodRisk}%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Flash Flood Risk</p>
                </div>
              </div>

              {/* Heatwave Gauge */}
              <div className="flex items-center gap-6 p-4 bg-[#0a1520] rounded-xl border border-border/50 hover:border-error/30 transition-colors">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted"
                      stroke="currentColor" strokeWidth="3" fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      className={parseInt(heatwaveRisk) > 80 ? "text-error" : "text-chart-3"}
                      stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray={`${heatwaveRisk}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${heatwaveRisk}, 100` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className={`w-5 h-5 ${parseInt(heatwaveRisk) > 80 ? "text-error" : "text-chart-3"}`} />
                  </div>
                </div>
                <div>
                  <p className="font-data text-2xl font-bold text-foreground">{heatwaveRisk}%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">Heatwave Risk</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
