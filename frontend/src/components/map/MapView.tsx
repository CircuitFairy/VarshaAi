"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Map, { Source, Layer, NavigationControl, FullscreenControl, GeolocateControl, Marker, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useOSStore, AlertFocus } from "@/store/useOSStore";
import { Wind, CloudRain, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface MapViewProps {
  interactive?: boolean;
  showControls?: boolean;
  hideAqiLegend?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// A dynamic overlay that renders drifting clouds to make the map feel alive
const WeatherOverlay = ({ activeAlert }: { activeAlert: AlertFocus }) => {
  if (activeAlert === "rain") {
    // Heavy rain and dark thunderstorm clouds
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-70">
        <div className="absolute inset-0 bg-[#0f172a]/60" />
        {/* Fast moving dark clouds */}
        <motion.div
          animate={{ x: [0, 1000], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-[-400px] w-[800px] h-[400px] bg-[#1e293b] blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -1000], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-[-400px] w-[1000px] h-[500px] bg-[#0f172a] blur-[120px] rounded-full"
        />
        {/* Rain particles (simplified with CSS background) */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0 L5 20' stroke='%233cd7ff' stroke-width='1' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: "20px 80px",
            animation: "rain-fall 0.6s linear infinite"
          }}
        />
        <style>{`
          @keyframes rain-fall {
            from { background-position: 0 0; }
            to { background-position: 10px 80px; }
          }
        `}</style>
      </div>
    );
  }

  if (activeAlert === "aqi") {
    // Hazy, toxic smog
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-80">
        <div className="absolute inset-0 bg-[#7c2d12]/30 mix-blend-multiply" />
        <motion.div
          animate={{ x: [-100, 100], y: [-50, 50], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-[#fb923c]/20 via-[#93000a]/30 to-[#fef08a]/20 blur-[60px]"
        />
      </div>
    );
  }

  if (activeAlert === "cyclone") {
    // Massive swirling vortex
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute w-[200vw] h-[200vw] rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent, rgba(255,180,171,0.1), rgba(251,146,60,0.3), rgba(255,180,171,0.1), transparent)",
            filter: "blur(40px)"
          }}
        />
      </div>
    );
  }

  // Default passing light clouds
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      <motion.div
        animate={{ x: [0, 1000], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-[-200px] w-[500px] h-[300px] bg-white/10 blur-[80px] rounded-full"
      />
      <motion.div
        animate={{ x: [0, -800], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-[-100px] w-[600px] h-[400px] bg-primary/10 blur-[100px] rounded-full"
      />
    </div>
  );
};

// Dynamic Simulation Effects overlay for extreme simulated conditions
const SimulationEffectsOverlay = ({ simulationData, simulationParams }: { simulationData: any, simulationParams: any }) => {
  if (!simulationData) return null;

  const isHeatwave = simulationParams.tempAnomaly >= 1.5;
  const isFlood = simulationParams.precipVariance >= 15 || simulationData.floodRisk === "High";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 mix-blend-screen">
      {/* Heatwave Effect: Pulsing heat distortion and embers */}
      {isHeatwave && (
        <>
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ffb4ab]/30 via-[#fb923c]/10 to-transparent blur-md"
          />
          {/* Floating Embers */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-error blur-[1px]"
              initial={{ y: "100vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
              animate={{ 
                y: "-10vh", 
                x: `${Math.random() * 100}vw`, 
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Flood Effect: Heavy Rain and Dark Shadows */}
      {isFlood && (
        <>
          <div className="absolute inset-0 bg-background/40 mix-blend-multiply" />
          <motion.div
            animate={{ x: [0, -2000], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 right-[-1000px] w-[3000px] h-[800px] bg-[#1e293b] blur-[100px] rounded-full"
          />
          <div 
            className="absolute inset-0 opacity-60 mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='15' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0 L0 30' stroke='%233cd7ff' stroke-width='1.5' stroke-linecap='round' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: "30px 120px",
              animation: "sim-rain-fall 0.4s linear infinite"
            }}
          />
          <style>{`
            @keyframes sim-rain-fall {
              from { background-position: 0 0; }
              to { background-position: -15px 60px; }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default function MapView({ interactive = true, showControls = true, hideAqiLegend = false, className = "", children }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; feature: any } | null>(null);
  const { setSelectedLocation, activeLayer, activeAlert, activeAlertCoordinates, activeAlertState, setActiveAlert, predictionData, simulationData, simulationStateName, simulationParams } = useOSStore();

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States")
      .then((res) => res.json())
      .then((data) => {
        data.features.forEach((f: any) => {
          f.properties.baseTemp = 25 + Math.random() * 15;
          f.properties.baseRain = Math.random() * 200;
          f.properties.baseAqi = 40 + Math.random() * 280;
        });
        setGeoData(data);
      })
      .catch(console.error);
  }, []);

  // React to active alert pan/zoom dynamically
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (activeAlertCoordinates) {
      // Zoom into the actual dynamic coordinates of the selected alert
      mapRef.current.flyTo({ 
        center: [activeAlertCoordinates.lon, activeAlertCoordinates.lat], 
        zoom: 6.5, 
        duration: 1500 
      });
    } else if (activeAlert === "cyclone") {
      mapRef.current.flyTo({ center: [86.5, 19.8], zoom: 5.8, duration: 1500 });
    } else if (activeAlert === "rain") {
      mapRef.current.flyTo({ center: [92.5, 26.2], zoom: 6.2, duration: 1500 });
    } else if (activeAlert === "aqi") {
      mapRef.current.flyTo({ center: [77.2, 28.6], zoom: 6.0, duration: 1500 });
    } else if (predictionData) {
      // If we have an AI prediction, fly to that state (using generic coordinates for demo if specific not found, ideally we'd look it up)
      // Since we don't have lat/lon in predictionData directly mapped to state bounds without a lookup, we'll just let the user zoom manually
    }
  }, [activeAlert, activeAlertCoordinates, predictionData]);

  const onClick = useCallback(
    (e: any) => {
      if (!interactive) return;
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const stateName = feature.properties.NAME_1;
        if (stateName) {
          setSelectedLocation(stateName);
          mapRef.current?.flyTo({
            center: [e.lngLat.lng, e.lngLat.lat],
            zoom: 6,
            duration: 1200,
          });
        }
      }
    },
    [interactive, setSelectedLocation]
  );

  const fillPaint = (() => {
    // Predictive AI Overlay (takes precedence if predictionData exists for this state)
    if (predictionData) {
      const isExtremeHeat = predictionData.heatwave_risk === "Extreme" || predictionData.heatwave_risk === "High";
      const isExtremeFlood = predictionData.predicted_rainfall > 80;
      const riskColor = isExtremeHeat ? "#fb923c" : isExtremeFlood ? "#1d4ed8" : "#fef08a";

      return {
        "fill-color": [
          "case",
          ["==", ["get", "NAME_1"], predictionData.state], riskColor,
          "#3cd7ff" // Default color for other states
        ],
        "fill-opacity": [
          "case",
          ["==", ["get", "NAME_1"], predictionData.state], 0.6,
          ["case", ["boolean", ["feature-state", "hover"], false], 0.25, 0.08]
        ],
      };
    }

    // Simulation Engine Overlay (takes precedence if simulationData exists)
    if (simulationData && simulationStateName) {
      if (activeLayer === "temperature") {
        return {
          "fill-color": [
            "case",
            ["==", ["get", "NAME_1"], simulationStateName],
            ["interpolate", ["linear"], ["+", ["get", "baseTemp"], simulationParams.tempAnomaly], 20, "#38bdf8", 28, "#fef08a", 35, "#fb923c", 42, "#dc2626"],
            ["interpolate", ["linear"], ["get", "baseTemp"], 20, "#38bdf8", 28, "#fef08a", 35, "#fb923c", 42, "#dc2626"] // Default for others
          ],
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.5, 0.28],
        };
      }
      if (activeLayer === "rainfall") {
        return {
          "fill-color": [
            "case",
            ["==", ["get", "NAME_1"], simulationStateName],
            ["interpolate", ["linear"], ["*", ["get", "baseRain"], 1 + (simulationParams.precipVariance / 100)], 0, "#e0f2fe", 50, "#3cd7ff", 150, "#1d4ed8", 250, "#0284c7"],
            ["interpolate", ["linear"], ["get", "baseRain"], 0, "#e0f2fe", 50, "#3cd7ff", 150, "#1d4ed8", 250, "#0284c7"] // Default for others
          ],
          "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.6, 0.35],
        };
      }
    }

    if (activeLayer === "temperature") {
      return {
        "fill-color": ["interpolate", ["linear"], ["get", "baseTemp"], 20, "#38bdf8", 28, "#fef08a", 35, "#fb923c", 42, "#dc2626"],
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.5, 0.28],
      };
    }
    if (activeLayer === "rainfall" || activeAlert === "rain") {
      return {
        "fill-color": ["interpolate", ["linear"], ["get", "baseRain"], 0, "#e0f2fe", 50, "#3cd7ff", 150, "#1d4ed8", 250, "#0284c7"],
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.6, 0.35],
      };
    }
    if (activeLayer === "aqi" || activeAlert === "aqi") {
      return {
        "fill-color": ["interpolate", ["linear"], ["get", "baseAqi"], 50, "#6af7ba", 100, "#fef08a", 200, "#fb923c", 280, "#ffb4ab", 350, "#93000a"],
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.65, 0.4],
      };
    }
    // Default: subtle cyan stroke fill
    return {
      "fill-color": "#3cd7ff",
      "fill-opacity": ["case", ["==", ["get", "NAME_1"], activeAlertState || ""], 0.3, ["case", ["boolean", ["feature-state", "hover"], false], 0.25, 0.08]],
    };
  })();

  // Use dynamic coordinates for markers if available, fallback to defaults
  const markerLat = activeAlertCoordinates?.lat || (activeAlert === "cyclone" ? 19.8 : 26.2);
  const markerLon = activeAlertCoordinates?.lon || (activeAlert === "cyclone" ? 86.5 : 92.5);

  return (
    <div className={`relative w-full h-full bg-[#07131f] ${className}`}>
      {/* Animated Clouds/Weather Background Overlay */}
      <WeatherOverlay activeAlert={activeAlert} />
      
      {/* Dynamic Simulation Effects Overlay */}
      <SimulationEffectsOverlay simulationData={simulationData} simulationParams={simulationParams} />

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 78.9629,
          latitude: 22.5937,
          zoom: 4.2,
        }}
        // Using Carto Dark Matter but with the container background shining through slightly
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json"
        interactiveLayerIds={interactive ? ["state-fills"] : []}
        onClick={onClick}
        onMouseMove={(e) => {
          if (e.features && e.features.length > 0) {
            setHoverInfo({ x: e.point.x, y: e.point.y, feature: e.features[0] });
          } else {
            setHoverInfo(null);
          }
        }}
        onMouseLeave={() => setHoverInfo(null)}
        cursor={hoverInfo ? "pointer" : "grab"}
        attributionControl={false}
      >
        {showControls && (
          <>
            <NavigationControl position="top-right" showCompass={false} />
            <GeolocateControl position="top-right" />
            <FullscreenControl position="top-right" />
          </>
        )}

        {geoData && (
          <Source id="india-states" type="geojson" data={geoData}>
            <Layer
              id="state-fills"
              type="fill"
              paint={fillPaint as any}
            />
            <Layer
              id="state-borders"
              type="line"
              paint={{
                "line-color": ["case", ["==", ["get", "NAME_1"], activeAlertState || ""], "#ffb4ab", "#3cd7ff"],
                "line-width": ["case", ["==", ["get", "NAME_1"], activeAlertState || ""], 2.5, 1.2],
                "line-opacity": ["case", ["==", ["get", "NAME_1"], activeAlertState || ""], 1, 0.4],
              }}
            />
          </Source>
        )}

        {/* Dynamic Cyclone Vortex Marker */}
        {activeAlert === "cyclone" && (
          <Marker longitude={markerLon} latitude={markerLat} anchor="center">
            <div className="relative flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-chart-3 animate-spin opacity-60" style={{ animationDuration: "6s" }} />
              <div className="absolute w-32 h-32 rounded-full border-2 border-dashed border-error animate-spin opacity-80" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
              <div className="absolute w-20 h-20 rounded-full bg-error/20 backdrop-blur-sm border border-error flex flex-col items-center justify-center animate-pulse">
                <Wind className="w-8 h-8 text-error animate-spin" style={{ animationDuration: "2s" }} />
                <span className="font-data text-[9px] font-bold text-error mt-1 shadow-black drop-shadow-md">SEVERE WIND</span>
              </div>
            </div>
          </Marker>
        )}

        {/* Dynamic Heavy Rain / Clouds Marker */}
        {activeAlert === "rain" && (
          <Marker longitude={markerLon} latitude={markerLat} anchor="center">
            <div className="relative flex items-center justify-center pointer-events-none">
              <div className="w-56 h-36 rounded-full bg-gradient-to-r from-sky-500/30 via-blue-600/40 to-slate-700/50 backdrop-blur-md border border-primary/50 flex flex-col items-center justify-center p-3 animate-pulse">
                <CloudRain className="w-10 h-10 text-primary animate-bounce" />
                <span className="font-data text-xs font-bold text-primary mt-1 shadow-black drop-shadow-md">HEAVY RAINFALL</span>
                <span className="font-data text-[10px] text-foreground">Precipitation Alert</span>
              </div>
            </div>
          </Marker>
        )}

        {/* Page-specific overlays */}
        {children}
      </Map>

      {/* AQI Precise Color Legend Bar */}
      {!hideAqiLegend && (activeLayer === "aqi" || activeAlert === "aqi") && (
        <div className="absolute bottom-6 left-6 z-20 glass rounded-xl p-3 border border-border space-y-2">
          <p className="label-caps text-foreground" style={{ fontSize: "10px" }}>AIR QUALITY INDEX (AQI) SCALE</p>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-tertiary/20 text-tertiary text-[10px] font-bold">
              <span>0-50 Good</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-chart-3/20 text-chart-3 text-[10px] font-bold">
              <span>51-100 Mod</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-chart-3/20 text-chart-3 text-[10px] font-bold">
              <span>101-200 Unhealthy</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-error/20 text-error text-[10px] font-bold">
              <span>201-300 Severe</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#93000a]/30 text-error text-[10px] font-bold">
              <span>300+ Hazard</span>
            </div>
          </div>
        </div>
      )}

      {/* Alert Active Banner */}
      {activeAlert && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 glass rounded-full px-5 py-2 border border-error/50 flex items-center gap-3 bg-[#93000a]/20">
          <AlertTriangle className="w-4 h-4 text-error animate-pulse" />
          <span className="font-data text-xs text-error font-bold uppercase">
            ACTIVE ALERT FOCUS: {activeAlert}
          </span>
          <button
            onClick={() => setActiveAlert(null)}
            className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
          >
            Clear Focus
          </button>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoverInfo && interactive && (
        <div
          className="absolute glass rounded-lg p-3 pointer-events-none z-50 transition-all duration-75"
          style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 12 }}
        >
          <p className="text-sm font-bold text-primary">{hoverInfo.feature.properties.NAME_1 || "Unknown"}</p>
          {(activeLayer === "aqi" || activeAlert === "aqi") && (
            <p className="text-xs font-data text-tertiary mt-0.5">AQI: {hoverInfo.feature.properties.baseAqi.toFixed(0)}</p>
          )}
          <p className="text-[10px] text-muted-foreground mt-1 font-data">Click to inspect region</p>
        </div>
      )}
    </div>
  );
}
