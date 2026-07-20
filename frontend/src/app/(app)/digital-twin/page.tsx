"use client";

import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useOSStore } from "@/store/useOSStore";
import {
  Cloud,
  AlertTriangle,
  Sprout,
  Droplets,
  Wind,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Shield,
  Waves,
  MapPin,
  CheckCircle2,
  Zap,
  Cpu
} from "lucide-react";
import { indianLocations } from "@/lib/locations";
import { formatTemp, formatTempUnit, formatPrecip, formatPrecipUnit, formatWind, formatWindUnit } from "@/lib/formatters";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

export default function DigitalTwinPage() {
  const {
    selectedState,
    selectedDistrict,
    setSelectedLocation,
    liveWeatherData,
    predictionData,
    isLoading,
    fetchDataForLocation,
    activeLayer,
    setActiveLayer,
    layerToggles,
    toggleDataLayer,
    timelineMode,
    setTimelineMode,
    timelinePosition,
    setTimelinePosition,
    isPlayingTimeline,
    toggleTimelinePlayback,
    rightPanelOpen,
    setRightPanelOpen,
    setActiveAlert,
    unitSystem,
  } = useOSStore();

  // Auto-detect geolocation or default to selected state
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          let closest = indianLocations[0];
          let closestDist = Infinity;
          let closestRegion: string | undefined;

          indianLocations.forEach((state) => {
            state.regions.forEach((region) => {
              const d = Math.sqrt(Math.pow(region.lat - lat, 2) + Math.pow(region.lon - lon, 2));
              if (d < closestDist) {
                closestDist = d;
                closest = state;
                closestRegion = region.name;
              }
            });
          });
          setSelectedLocation(closest.state, closestRegion);
        },
        () => {
          fetchDataForLocation(selectedState.state, selectedDistrict?.name);
        },
        { timeout: 8000 }
      );
    } else {
      fetchDataForLocation(selectedState.state, selectedDistrict?.name);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timeline playback animation loop
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const interval = setInterval(() => {
      setTimelinePosition(useOSStore.getState().timelinePosition >= 100 ? 0 : useOSStore.getState().timelinePosition + 2);
    }, 200);
    return () => clearInterval(interval);
  }, [isPlayingTimeline, setTimelinePosition]);

  // Interpolate weather data based on timeline position!
  const weather = useMemo(() => {
    if (!liveWeatherData) return null;
    if (timelineMode === 'live') return liveWeatherData;
    
    // timelinePosition goes from 0 to 100
    const progress = timelinePosition / 100;
    
    if (timelineMode === 'predictive' && predictionData) {
      // Interpolate from current state up to the 72H predicted values
      return {
        ...liveWeatherData,
        temperature: liveWeatherData.temperature + ((predictionData.predicted_temp - liveWeatherData.temperature) * progress),
        rainfall: liveWeatherData.rainfall + ((predictionData.predicted_rainfall - liveWeatherData.rainfall) * progress),
      };
    }
    
    if (timelineMode === 'historical') {
      // Procedurally generate historical variation over the last 24H
      // progress goes from 0 (24h ago) to 100 (now).
      const inverseProgress = 1 - progress; // 1 = 24h ago, 0 = now
      const pastTempDelta = Math.sin(inverseProgress * Math.PI) * 5; // Fluctuate up to 5 degrees
      const pastRainDelta = inverseProgress * 15; // Fluctuate up to 15mm
      
      return {
        ...liveWeatherData,
        temperature: liveWeatherData.temperature - pastTempDelta,
        rainfall: Math.max(0, liveWeatherData.rainfall - pastRainDelta),
      };
    }
    
    return liveWeatherData;
  }, [liveWeatherData, predictionData, timelineMode, timelinePosition]);

  // Dynamic Location-specific Alert & AI Insights
  const locationAlert = useMemo(() => {
    if (!weather) {
      return {
        alertType: "rain" as const,
        title: "Connecting to Telemetry Node...",
        desc: "Establishing handshake with AWS satellites.",
        color: "#859398",
        insight1: "Standby for downlink.",
        insight2: "Awaiting atmospheric parameters.",
      };
    }

    if (weather.flood_risk === 'High' || weather.rainfall > 30) {
      return {
        alertType: "rain" as const,
        title: "High Confidence Flood Risk",
        desc: `Heavy precipitation detected. River levels approaching danger mark in ${selectedState.state}.`,
        color: "#ffb4ab",
        insight1: "Major embankment reinforcement units mobilized.",
        insight2: "Evacuation protocols advised for low-lying sectors.",
      };
    }
    
    if (weather.heatwave_risk === 'High' || weather.temperature > 38) {
      return {
        alertType: "cyclone" as const,
        title: "Severe Heatwave Conditions",
        desc: `Thermal anomaly detected. Sustained temperature exceeding ${formatTemp(weather.temperature, unitSystem)}${formatTempUnit(unitSystem)}.`,
        color: "#fef08a",
        insight1: "Power grid stress anticipated. Non-essential routing advised.",
        insight2: "Water reservoir levels dropping rapidly due to evaporation.",
      };
    }

    if (weather.wind_speed > 40) {
      return {
        alertType: "cyclone" as const,
        title: "Severe Wind Velocity",
        desc: `Sustained winds exceeding ${formatWind(weather.wind_speed, unitSystem)}${formatWindUnit(unitSystem)}. Structural risk elevated.`,
        color: "#fb923c",
        insight1: "Coastal storm surge vulnerability high for eastern districts.",
        insight2: "Drone swarm reconnaissance grounded due to wind shear.",
      };
    }

    return {
      alertType: "rain" as const,
      title: "Telemetry Nominal",
      desc: `Localized weather telemetry active for ${selectedDistrict?.name || selectedState.state}. Atmospheric conditions stable.`,
      color: "#6af7ba",
      insight1: `Moisture indices favorable for agricultural cycles in ${selectedState.state}.`,
      insight2: "Regional groundwater recharge parameters within baseline.",
    };
  }, [weather, selectedState.state, selectedDistrict?.name]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      {/* Full-bleed Interactive Map */}
      <MapView interactive showControls>
        {/* Map overlay children */}
      </MapView>

      {/* TOP-LEFT: Region Info Overlay with Selectable State Dropdown */}
      <div className="absolute top-5 left-5 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="os-card p-5 min-w-[320px] bg-background/90 backdrop-blur-md border-primary/30 relative overflow-hidden space-y-3"
        >
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>
          
          <div className="flex items-center justify-between border-b border-primary/20 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <select
                value={selectedState.state}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent font-display text-lg font-bold text-foreground focus:outline-none cursor-pointer uppercase tracking-widest"
              >
                {indianLocations.map((loc) => (
                  <option key={loc.state} value={loc.state} className="bg-muted text-foreground">
                    {loc.state}
                  </option>
                ))}
              </select>
            </div>
            <span className="font-data text-xs text-tertiary animate-pulse">LIVE</span>
          </div>

          <p className="font-data text-[10px] text-primary relative z-10">
            LOC: {selectedDistrict?.name?.toUpperCase() || selectedState.regions[0]?.name.toUpperCase()} // LAT {selectedDistrict?.lat || 20.59}° N // LON {selectedDistrict?.lon || 78.96}° E
          </p>

          <div className="flex gap-3 pt-1 relative z-10">
            <div className="flex-1 bg-muted/80 rounded p-2.5 border border-border">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">SYS STATUS</p>
              <p className="font-data text-xs text-tertiary mt-0.5 flex items-center gap-1">
                <Shield className="w-3 h-3" /> NOMINAL
              </p>
            </div>
            <div className="flex-1 bg-muted/80 rounded p-2.5 border border-border">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">DATA LINK</p>
              <p className="font-data text-xs text-primary mt-0.5 flex items-center gap-1">
                <Waves className="w-3 h-3" /> SECURE
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM: Timeline Playback */}
      <div className="absolute bottom-5 left-5 right-[420px] z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="os-card p-4 bg-background/90 backdrop-blur-md border-primary/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>
          
          {/* Mode Tabs */}
          <div className="flex items-center gap-6 relative z-10">
            {(["historical", "live", "predictive"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTimelineMode(mode)}
                className={`text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                  timelineMode === mode ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === "live" && <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse" />}
                {mode === "predictive" ? "PREDICTIVE (72H)" : mode}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center gap-4 relative z-10">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button onClick={() => setTimelinePosition(0)} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={toggleTimelinePlayback}
                className="w-8 h-8 rounded bg-muted border border-primary/50 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
              >
                {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={() => setTimelinePosition(100)} className="text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

          <div className="flex-1 flex flex-col gap-1 relative z-10 w-full ml-4">
            {/* Dynamic Time Readout */}
            <div className="flex justify-between items-end px-1">
              <span className="font-data text-[10px] text-muted-foreground uppercase tracking-widest">
                {timelineMode === "historical" ? "-24H" : timelineMode === "predictive" ? "NOW" : ""}
              </span>
              <span className={`font-data text-xs font-bold ${timelineMode === "live" ? "text-tertiary" : "text-primary"}`}>
                {timelineMode === "historical" 
                  ? `T-${Math.floor(((100 - timelinePosition) / 100) * 24)}H` 
                  : timelineMode === "predictive" 
                    ? `T+${Math.floor((timelinePosition / 100) * 72)}H` 
                    : "LIVE SYNC"}
              </span>
              <span className="font-data text-[10px] text-muted-foreground uppercase tracking-widest">
                {timelineMode === "historical" ? "NOW" : timelineMode === "predictive" ? "+72H" : ""}
              </span>
            </div>

            {/* Graphical Waveform Track */}
            <div className="relative h-10 w-full flex items-end justify-between gap-[2px] pb-2">
              {/* Generate 50 vertical bars for the waveform */}
              {Array.from({ length: 50 }).map((_, i) => {
                const isActive = (i / 49) * 100 <= timelinePosition;
                // Use pseudo-random value based on index to prevent hydration mismatch
                const pseudoRandom = Math.abs(Math.sin(i * 12.9898 + 78.233)) % 1;
                const height = 10 + Math.abs(Math.sin(i * 0.2) * 20) + pseudoRandom * 10;
                return (
                  <div 
                    key={i} 
                    style={{ height: `${height}px` }}
                    className={`flex-1 rounded-sm transition-colors duration-200 ${isActive ? (timelineMode === 'live' ? 'bg-tertiary' : 'bg-primary') : 'bg-border/40'}`}
                  />
                );
              })}

              {/* Scrubber Handle */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10 pointer-events-none"
                style={{ left: `calc(${timelinePosition}% - 1px)` }}
              >
                <div className={`absolute -top-1 -translate-x-1/2 w-3 h-3 rounded-full ${timelineMode === 'live' ? 'bg-tertiary shadow-[0_0_10px_var(--tertiary)]' : 'bg-primary shadow-[0_0_10px_var(--primary)]'}`} />
              </div>

              {/* Invisible Native Slider for Interaction */}
              <input
                type="range"
                min={0}
                max={100}
                value={timelinePosition}
                onChange={(e) => setTimelinePosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Telemetry Hub (Location Specific) */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 bottom-0 w-[420px] z-10 bg-background/95 backdrop-blur-xl border-l border-primary/30 flex flex-col overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>
            
            {/* Hub Header */}
            <div className="px-6 pt-5 pb-4 border-b border-primary/30 flex items-center justify-between relative z-10 bg-card">
              <div>
                <h3 className="text-xl font-display font-bold text-foreground tracking-widest uppercase">Telemetry Hub</h3>
                <p className="text-[10px] text-primary font-data mt-0.5 tracking-widest">SECTOR: {selectedState.state.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 relative min-h-0 w-full">
              <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-5 pb-8 flex flex-col gap-5">
                
                {/* Atmospheric Data */}
                <div className="os-card p-5 bg-muted/50 border-border">
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ATMOSPHERIC DATA</p>
                    <Cloud className="w-4 h-4 text-primary" />
                  </div>
                  {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-10 bg-border/50 w-24 rounded" />
                      <div className="flex gap-3">
                        <div className="h-12 bg-border/50 flex-1 rounded" />
                        <div className="h-12 bg-border/50 flex-1 rounded" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="font-data text-5xl font-bold text-foreground tracking-tight">
                        {weather?.temperature ? formatTemp(weather.temperature, unitSystem) : "---"}
                        <span className="text-2xl text-muted-foreground">{formatTempUnit(unitSystem)}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="bg-card rounded p-3 border border-border">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">HUMIDITY</p>
                          <p className="font-data text-lg text-primary-container mt-0.5">{weather?.humidity || "--"}%</p>
                        </div>
                        <div className="bg-card rounded p-3 border border-border">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">WIND SPD</p>
                          <p className="font-data text-lg text-primary-container mt-0.5">{weather?.wind_speed ? formatWind(weather.wind_speed, unitSystem) : "--"} <span className="text-[10px]">{formatWindUnit(unitSystem)}</span></p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 72-Hour Predictive Trajectory */}
                <div className="os-card p-5 relative overflow-hidden group hover:border-chart-3/50 transition-colors bg-muted/30 border-chart-3/20">
                  <div className="flex items-center justify-between mb-4 z-10 relative">
                    <p className="font-display text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3 text-chart-3" /> 72H Predictive Trajectory
                    </p>
                    <span className="font-data text-[10px] text-chart-3">AI CONF: {predictionData?.confidence || 94}%</span>
                  </div>
                  
                  {predictionData ? (
                    <div className="space-y-3 z-10 relative">
                      <div className="flex justify-between items-center bg-card p-3 rounded border border-border">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Forecast Rainfall</p>
                          <p className="font-data text-base text-primary mt-0.5">{formatPrecip(predictionData.predicted_rainfall, unitSystem)} {formatPrecipUnit(unitSystem)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Delta</p>
                          <p className={`font-data text-xs mt-0.5 ${(predictionData.predicted_rainfall - (weather?.rainfall || 0)) > 0 ? 'text-error' : 'text-primary'}`}>
                            {((predictionData.predicted_rainfall - (weather?.rainfall || 0)) > 0 ? '+' : '')}
                            {formatPrecip(predictionData.predicted_rainfall - (weather?.rainfall || 0), unitSystem)} {formatPrecipUnit(unitSystem)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-card p-3 rounded border border-border">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Forecast Temp</p>
                          <p className="font-data text-base text-chart-3 mt-0.5">{formatTemp(predictionData.predicted_temp, unitSystem)} {formatTempUnit(unitSystem)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Delta</p>
                          <p className={`font-data text-xs mt-0.5 ${(predictionData.predicted_temp - (weather?.temperature || 0)) > 0 ? 'text-error' : 'text-tertiary'}`}>
                            {((predictionData.predicted_temp - (weather?.temperature || 0)) > 0 ? '+' : '')}
                            {formatTemp(predictionData.predicted_temp - (weather?.temperature || 0), unitSystem)} {formatTempUnit(unitSystem)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 text-muted-foreground text-[10px] font-data animate-pulse z-10 relative">
                      CALCULATING NEURAL TRAJECTORY...
                    </div>
                  )}
                </div>

                {/* Dynamic Location-Specific Alert */}
                <div
                  onClick={() => setActiveAlert(locationAlert.alertType)}
                  className="os-card p-5 cursor-pointer hover:border-primary/60 transition-all group bg-card"
                  style={{ borderColor: `${locationAlert.color}40` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: locationAlert.color }}>
                      <AlertTriangle className="w-3 h-3" /> SECTOR ALERT
                    </p>
                    <span className="font-data text-[9px] text-muted-foreground group-hover:text-foreground transition-colors">CLICK TO FOCUS</span>
                  </div>
                  <div className="bg-muted/50 rounded p-3" style={{ borderLeft: `2px solid ${locationAlert.color}` }}>
                    <p className="text-sm font-bold text-foreground font-display tracking-wide">{locationAlert.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed font-mono">{locationAlert.desc}</p>
                  </div>
                </div>

                {/* Dynamic AI Insights */}
                <div className="os-card p-5 bg-muted/30 border-tertiary/30">
                  <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Cpu className="w-3 h-3" /> AI SYNTHESIS ({selectedState.state})
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3 items-start">
                      <Sprout className="w-4 h-4 text-tertiary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Agronomy Vector</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed font-mono">
                          {locationAlert.insight1}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Infrastructure Vector</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed font-mono">
                          {locationAlert.insight2}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Overlay Matrix */}
                <div className="os-card p-5 relative overflow-hidden bg-card">
                  <p className="font-display text-[10px] font-bold text-foreground uppercase tracking-widest mb-4 z-10 relative">Active Overlay Matrix</p>
                  <div className="flex flex-col gap-2 z-10 relative">
                    {[
                      { key: "precipitation" as const, label: "Precipitation", mapKey: "rainfall" as const, val: weather?.rainfall ? `${formatPrecip(weather.rainfall, unitSystem)} ${formatPrecipUnit(unitSystem)}` : "N/A" },
                      { key: "thermal" as const, label: "Thermal IR", mapKey: "temperature" as const, val: weather?.temperature ? `${formatTemp(weather.temperature, unitSystem)}${formatTempUnit(unitSystem)}` : "N/A" },
                      { key: "aqi" as const, label: "AQI Dispersion", mapKey: "aqi" as const, val: weather?.aqi ? weather.aqi : "N/A" },
                    ].map((layer) => (
                      <div 
                        key={layer.key} 
                        onClick={() => {
                          toggleDataLayer(layer.key);
                          setActiveLayer(layer.mapKey);
                        }}
                        className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-all ${activeLayer === layer.mapKey ? 'bg-muted border-primary' : 'bg-card border-border hover:border-primary/50'}`}
                      >
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${activeLayer === layer.mapKey ? 'text-primary' : 'text-muted-foreground'}`}>{layer.label}</span>
                          <p className="font-data text-[10px] text-foreground mt-1">SEVERITY: {layer.val}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${activeLayer === layer.mapKey ? 'bg-primary shadow-[0_0_8px_var(--primary)] animate-pulse' : 'bg-border'}`}></div>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed panel toggle */}
      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="absolute top-24 right-4 z-10 os-card p-3 rounded bg-background/90 backdrop-blur-md border-primary/30 text-primary hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      )}
    </div>
  );
}
