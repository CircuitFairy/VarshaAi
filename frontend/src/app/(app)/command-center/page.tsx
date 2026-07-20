"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Satellite, 
  RadioTower, 
  Crosshair, 
  ShieldAlert, 
  PlaneTakeoff, 
  MessageSquareWarning,
  ActivitySquare,
  AlertTriangle,
  Zap,
  Globe2,
  Users,
  Newspaper
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { useOSStore } from "@/store/useOSStore";
import { fetchLocalNews, NewsArticle } from "@/lib/api";
import { formatTemp, formatTempUnit, formatPrecip, formatPrecipUnit } from "@/lib/formatters";

export default function CommandCenterPage() {
  const { selectedState, selectedDistrict, liveWeatherData, fetchDataForLocation, unitSystem } = useOSStore();
  
  // Ensure data is fetched if navigated directly
  useEffect(() => {
    if (!liveWeatherData) {
      fetchDataForLocation(selectedState.state, selectedDistrict?.name);
    }
  }, [liveWeatherData, selectedState, selectedDistrict, fetchDataForLocation]);
  
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [seismicData, setSeismicData] = useState<{time: number, amplitude: number}[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Dynamic Calculations based on Live Data ---
  
  const weatherStress = liveWeatherData 
    ? (liveWeatherData.rainfall * 2) + (liveWeatherData.wind_speed * 0.5) 
    : 0;
    
  const ndrfActive = Math.min(50, Math.max(10, Math.floor(10 + weatherStress)));
  const evacRoutes = Math.min(24, Math.max(24 - Math.floor(weatherStress / 5), 0));
  const shelterCapacity = Math.min(100, Math.max(20, Math.floor(20 + weatherStress * 1.5)));
  
  const threatLevel = weatherStress > 40 ? 'critical' : weatherStress > 15 ? 'warning' : 'safe';
  const baseVol = liveWeatherData ? (liveWeatherData.wind_speed + liveWeatherData.rainfall) : 5;

  // Simulate incoming telemetry logs
  useEffect(() => {
    const baseLogs = [
      "[SAT-COM] 🛰️ Uplink Established. Bandwidth: 1.2Gbps",
      "[AI-CORE] 🧠 Running Predictive Climate Model...",
      "[IMD-NODE-4] 📡 Syncing Ground Radar... DELAY 12ms",
    ];

    const generateLiveLogs = () => {
      const logs = [...baseLogs];
      if (liveWeatherData) {
        if (liveWeatherData.rainfall > 0) {
          logs.push(`[AWS-${selectedDistrict?.name || 'LOCAL'}] 🌧️ Precipitation Detected: ${formatPrecip(liveWeatherData.rainfall, unitSystem)}${formatPrecipUnit(unitSystem)}`);
        }
        if (liveWeatherData.temperature > 35) {
          logs.push(`[INSAT-3D] ⚠️ Thermal Anomaly in ${selectedState.state}: ${formatTemp(liveWeatherData.temperature, unitSystem)}${formatTempUnit(unitSystem)}`);
        }
        if (liveWeatherData.wind_speed > 20) {
          logs.push(`[AI-CORE] ⚠️ High Wind Velocity Alert in ${selectedDistrict?.name || selectedState.state}`);
        }
        logs.push(`[TELEMETRY] Current Humidity: ${liveWeatherData.humidity}%`);
      }
      return logs;
    };

    const interval = setInterval(() => {
      const allLogs = generateLiveLogs();
      setTelemetryLogs(prev => {
        const newLogs = [...prev, allLogs[Math.floor(Math.random() * allLogs.length)]];
        if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
        return newLogs;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [liveWeatherData, selectedState, selectedDistrict]);

  // Auto-scroll logs without scrolling entire page
  useEffect(() => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [telemetryLogs]);

  // Simulate Seismic Updates tied to live wind/rain
  useEffect(() => {
    // initial data
    if (seismicData.length === 0) {
       setSeismicData(Array.from({ length: 50 }).map((_, i) => ({
        time: i,
        amplitude: Math.sin(i * 0.5) * (Math.random() * baseVol)
      })));
    }

    const interval = setInterval(() => {
      setSeismicData(prev => {
        if (prev.length === 0) return prev;
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          amplitude: Math.sin(Date.now() / 1000) * (Math.random() * (baseVol + 5)) + (Math.random() > 0.85 ? baseVol * 2 : 0)
        });
        return newData;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [baseVol]);

  // Generate Local News Feed
  const [newsFeed, setNewsFeed] = useState<NewsArticle[]>([]);
  const [isFetchingNews, setIsFetchingNews] = useState(false);

  useEffect(() => {
    if (!liveWeatherData) return;
    
    const condition = liveWeatherData.flood_risk === 'High' || liveWeatherData.rainfall > 10 ? 'flood' : 
                      liveWeatherData.heatwave_risk === 'High' || liveWeatherData.temperature > 38 ? 'heat' : 
                      liveWeatherData.wind_speed > 40 ? 'cyclone' : 'normal';

    setIsFetchingNews(true);
    fetchLocalNews(selectedState.state, selectedDistrict?.name || null, condition).then(articles => {
      if (articles.length > 0) {
        setNewsFeed(articles);
      } else {
        // Fallback mock if API fails/empty
        if (condition === 'flood') {
          setNewsFeed([
            { id: '1', source: "Local Times", title: `Heavy inundation reported in low-lying areas of ${selectedDistrict?.name}. Authorities issue warning.`, time: "10m ago" },
            { id: '2', source: "State Dispatch", title: `${selectedState.state} NDRF teams mobilized as river levels cross danger mark.`, time: "1h ago" },
            { id: '3', source: "City Updates", title: "Traffic diverted on major highways due to severe waterlogging.", time: "2h ago" }
          ]);
        } else if (condition === 'heat') {
          setNewsFeed([
            { id: '1', source: "State Dispatch", title: `Severe heatwave conditions continue in ${selectedState.state}. Schools announce early closure.`, time: "30m ago" },
            { id: '2', source: "Local Times", title: `Power grids face unprecedented demand in ${selectedDistrict?.name} as temperatures soar.`, time: "2h ago" },
            { id: '3', source: "Health Daily", title: "Hospitals report spike in heat-stroke cases. Citizens advised to stay indoors.", time: "4h ago" }
          ]);
        } else if (condition === 'cyclone') {
          setNewsFeed([
            { id: '1', source: "State Dispatch", title: `Cyclone alert: Coastal evacuation begins in ${selectedState.state}.`, time: "15m ago" },
            { id: '2', source: "Local Times", title: `Fishing operations suspended in ${selectedDistrict?.name} due to high wind speeds.`, time: "45m ago" },
            { id: '3', source: "National Guard", title: "Shelters prepped and stocked. Awaiting further IMD trajectory updates.", time: "1h ago" }
          ]);
        } else {
          setNewsFeed([
            { id: '1', source: "Local Times", title: `Weather remains stable in ${selectedDistrict?.name}. Farmers anticipate favorable harvest conditions.`, time: "2h ago" },
            { id: '2', source: "State Dispatch", title: `${selectedState.state} announces new infrastructural budget for monsoon preparedness.`, time: "5h ago" },
            { id: '3', source: "City Updates", title: "Normalcy prevails as temperatures hover around seasonal averages.", time: "12h ago" }
          ]);
        }
      }
      setIsFetchingNews(false);
    });
  }, [liveWeatherData, selectedState, selectedDistrict]);


  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-background">
      {/* Top Header */}
      <div className="px-8 pt-6 pb-4 border-b border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0 bg-card">
        <div>
          <div className="flex items-center gap-3">
            <Globe2 className="w-8 h-8 text-error animate-pulse" />
            <h1 className="font-display text-3xl font-bold text-foreground tracking-wider">GLOBAL OPERATIONS COMMAND</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm font-data tracking-widest uppercase">
            VarshaAI OS // Macro-Level Situational Awareness
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-error/10 border border-error/50 rounded-lg flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
            </span>
            <span className="text-xs font-bold text-error tracking-widest">DEFCON 3</span>
          </div>
          <div className="px-4 py-2 bg-tertiary/10 border border-tertiary/50 rounded-lg flex items-center gap-3">
            <span className="text-xs font-bold text-tertiary tracking-widest">SYSTEM OPTIMAL</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
        
        {/* ROW 1 */}
        {/* Core Systems Integrity (Left) */}
        <div className="md:col-span-4 os-card p-5 overflow-hidden relative min-h-[300px] border-primary/30 flex flex-col">
          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>
          
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest mb-4 z-10">
            <ShieldAlert className="w-4 h-4 text-primary" /> Core Systems Integrity
          </h3>
          
          <div className="flex-1 grid grid-cols-2 gap-4 z-10">
            {/* System 1 */}
            <div className="bg-muted border border-border rounded p-3 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Predictive AI Core</div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-tertiary font-data">99.8%</span>
                <span className="text-[10px] text-tertiary animate-pulse">OPTIMAL</span>
              </div>
            </div>
            {/* System 2 */}
            <div className="bg-muted border border-border rounded p-3 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Satellite Downlink</div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-tertiary font-data">1.2 Gbps</span>
                <span className="text-[10px] text-tertiary">STABLE</span>
              </div>
            </div>
            {/* System 3 */}
            <div className="bg-muted border border-border rounded p-3 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
              {threatLevel === 'critical' && <div className="absolute inset-0 bg-error/10 animate-pulse"></div>}
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 z-10">Ground Sensors</div>
              <div className="flex items-end justify-between z-10">
                <span className={`text-xl font-bold font-data ${threatLevel === 'critical' ? 'text-error' : threatLevel === 'warning' ? 'text-chart-3' : 'text-tertiary'}`}>
                  {threatLevel === 'critical' ? '74.2%' : threatLevel === 'warning' ? '88.5%' : '98.9%'}
                </span>
                <span className={`text-[10px] ${threatLevel === 'critical' ? 'text-error' : threatLevel === 'warning' ? 'text-chart-3' : 'text-tertiary'}`}>
                  {threatLevel === 'critical' ? 'DEGRADED' : threatLevel === 'warning' ? 'FLUCTUATING' : 'ONLINE'}
                </span>
              </div>
            </div>
            {/* System 4 */}
            <div className="bg-muted border border-border rounded p-3 flex flex-col justify-between group hover:border-primary/50 transition-colors">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Emergency Comms</div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-tertiary font-data">UHF/VHF</span>
                <span className="text-[10px] text-tertiary">SECURE</span>
              </div>
            </div>
          </div>

          {/* Node Grid Visualization */}
          <div className="mt-4 pt-4 border-t border-border flex-1 z-10">
             <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex justify-between">
               <span>Regional Node Status</span>
               <span className="text-primary animate-pulse">LIVE</span>
             </div>
             <div className="grid grid-cols-10 gap-1.5 mt-2">
               {Array.from({ length: 40 }).map((_, i) => {
                 const isFailing = threatLevel === 'critical' ? (i % 5 === 0 || i % 7 === 0) : threatLevel === 'warning' ? (i % 12 === 0) : false;
                 return (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0.5 }}
                     animate={{ opacity: isFailing ? [0.2, 1, 0.2] : [0.3, 0.6, 0.3] }}
                     transition={{ duration: isFailing ? 0.4 : 2 + (i % 3), repeat: Infinity }}
                     className={`h-2 rounded-[1px] ${isFailing ? 'bg-error shadow-[0_0_8px_var(--error)]' : 'bg-primary'}`}
                   />
                 )
               })}
             </div>
          </div>
        </div>

        {/* Live Satellite Telemetry Console (Middle) */}
        <div className="md:col-span-8 os-card p-5 border-primary/30 flex flex-col relative overflow-hidden h-[300px]">
          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>
          
          <h3 className="font-display text-sm font-bold text-tertiary flex items-center gap-2 uppercase tracking-widest mb-4 z-10">
            <Satellite className="w-4 h-4" /> Live Satellite & Node Telemetry
          </h3>
          
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 z-10 custom-scrollbar pr-2">
            <AnimatePresence>
              {telemetryLogs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${log.includes('WARNING') || log.includes('⚠️') ? 'text-chart-3' : log.includes('SUCCESS') || log.includes('Optimal') ? 'text-tertiary' : 'text-primary'}`}
                >
                  <span className="text-muted-foreground opacity-50 mr-3">[{new Date().toISOString().split('T')[1].slice(0,-1)}]</span>
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ROW 2 */}
        {/* Resource Deployment Matrix */}
        <div className="md:col-span-4 os-card p-5 border-primary/30">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest mb-5">
            <Users className="w-4 h-4 text-primary" /> Resource Deployment
          </h3>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1 font-data">
                <span>NDRF UNITS ACTIVE</span>
                <span className={ndrfActive > 40 ? "text-error" : "text-tertiary"}>{ndrfActive} / 50</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className={ndrfActive > 40 ? "bg-error h-full transition-all" : "bg-tertiary h-full transition-all"} style={{ width: `${(ndrfActive/50)*100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1 font-data">
                <span>EVACUATION ROUTES OPEN</span>
                <span className={evacRoutes < 15 ? "text-error" : "text-chart-3"}>{evacRoutes} / 24</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className={evacRoutes < 15 ? "bg-error h-full transition-all" : "bg-chart-3 h-full transition-all"} style={{ width: `${(evacRoutes/24)*100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1 font-data">
                <span>SHELTER CAPACITY</span>
                <span className={shelterCapacity > 85 ? "text-error" : "text-primary"}>{shelterCapacity}% FULL</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div className={shelterCapacity > 85 ? "bg-error h-full transition-all" : "bg-primary h-full transition-all"} style={{ width: `${shelterCapacity}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Drone Swarm Recon Tracker */}
        <div className="md:col-span-4 os-card p-5 border-primary/30">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest mb-4">
            <PlaneTakeoff className="w-4 h-4 text-primary" /> Drone Swarm Recon
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-lg border border-border">
              <div className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Swarm Alpha (Coast)</div>
              <div className="text-xl font-bold text-tertiary mb-1">ONLINE</div>
              <div className="text-[10px] text-foreground">24 Units Active</div>
            </div>
            <div className="bg-muted p-3 rounded-lg border border-border">
              <div className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Swarm Beta (Urban)</div>
              <div className="text-xl font-bold text-chart-3 mb-1">RE-ROUTING</div>
              <div className="text-[10px] text-foreground">12 Units Active</div>
            </div>
            <div className="bg-muted p-3 rounded-lg border border-border col-span-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Live Feed Status</div>
                <div className="text-sm font-bold text-foreground">Ingesting Photogrammetry</div>
              </div>
              <ActivitySquare className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Seismic & Tectonic Monitor */}
        <div className="md:col-span-4 os-card p-5 border-primary/30 flex flex-col">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4 text-error" /> Seismic & Tectonic Monitor
          </h3>
          <p className="text-[10px] text-muted-foreground font-data mb-4">Real-time micro-tremor analysis based on wind sheer stress</p>
          
          <div className="flex-1 min-h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seismicData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <YAxis domain={[-80, 80]} hide />
                <Line 
                  type="monotone" 
                  dataKey="amplitude" 
                  stroke="var(--error)" 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false} // Disable recharts animation for performance on fast updates
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 3 */}
        {/* Local Area News Feed */}
        <div className="md:col-span-12 os-card p-5 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-widest">
              <Newspaper className="w-4 h-4 text-primary" /> Local Area News Feed
            </h3>
            <span className="px-2 py-1 bg-muted text-[10px] text-primary font-bold rounded">
              {isFetchingNews ? "SCANNING WEBZ.IO..." : "LIVE SCRAPING ACTIVE"}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsFeed.map((news) => (
              <div key={news.id} className="bg-muted p-4 rounded-lg border border-border relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-bold text-tertiary font-data uppercase tracking-wider">{news.source}</div>
                  <div className="text-[10px] text-muted-foreground">{news.time}</div>
                </div>
                <p className="text-sm text-foreground font-medium line-clamp-2">{news.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
