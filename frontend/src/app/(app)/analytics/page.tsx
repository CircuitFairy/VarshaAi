"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";
import { indianLocations } from "@/lib/locations";
import {
  BarChart3,
  Download,
  MapPin,
  Thermometer,
  CloudRain,
  Wind,
  ShieldAlert,
  Search,
  Activity,
  CheckCircle2,
  BrainCircuit
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Line,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts";
import { formatTemp, formatTempUnit, formatPrecip, formatPrecipUnit } from "@/lib/formatters";

const timeRanges = ["10 Years", "30 Years", "50 Years"];

// --- Research-Grade Data Simulators ---

// 1. Decadal Temperature Anomaly Simulator (50 years)
const generateDecadalAnomaly = (stateName: string, range: string) => {
  const seed = stateName.charCodeAt(0) + stateName.charCodeAt(stateName.length - 1);
  const years = range === "50 Years" ? 50 : range === "30 Years" ? 30 : 10;
  const currentYear = new Date().getFullYear();
  
  const data = [];
  let baseAnomaly = -0.5 + (seed % 10) / 20; // Start slightly cool/warm depending on state
  
  for (let i = years; i >= 0; i--) {
    const year = currentYear - i;
    // Climate change drift: gradually increases over time, steeper in recent years
    const climateDrift = Math.pow((years - i) / years, 2) * 1.8; 
    // Add El Niño / La Niña cyclical variance (approx 4-7 years)
    const elNino = Math.sin(year * (Math.PI * 2) / 5) * 0.4;
    // Pseudo-random noise to prevent hydration mismatch
    const pseudoRandom = Math.abs(Math.sin(year * 12.9898 + seed)) % 1;
    const noise = (pseudoRandom - 0.5) * 0.3;
    
    const anomaly = parseFloat((baseAnomaly + climateDrift + elNino + noise).toFixed(2));
    
    data.push({
      year: year.toString(),
      anomaly: anomaly,
      isPositive: anomaly > 0,
      trend: parseFloat((baseAnomaly + climateDrift).toFixed(2))
    });
  }
  return data;
};

// 2. Hydrological Volatility Simulator (Droughts vs Floods)
const generateHydrologicalVolatility = (stateName: string) => {
  const seed = stateName.charCodeAt(1) || 50;
  const currentYear = new Date().getFullYear();
  const data = [];
  
  for (let i = 15; i >= 0; i--) {
    const year = currentYear - i;
    // Simulate increasing volatility (extremes getting more extreme)
    const volatilityFactor = 1 + ((15 - i) / 15) * 0.8;
    
    const isLaNina = Math.sin(year * (Math.PI * 2) / 6) > 0.5;
    const isElNino = Math.sin(year * (Math.PI * 2) / 4) < -0.5;
    
    const pRandom1 = Math.abs(Math.sin(year * 12.9898 + seed)) % 1;
    const pRandom2 = Math.abs(Math.sin(year * 78.233 + seed)) % 1;
    const pRandom3 = Math.abs(Math.sin(year * 43.123 + seed)) % 1;

    let rainDelta = (pRandom1 - 0.3) * 15 * volatilityFactor; // baseline mm variance
    if (isLaNina) rainDelta += (20 + (seed % 30)) * volatilityFactor; // Flood year
    if (isElNino) rainDelta -= (20 + (seed % 20)) * volatilityFactor; // Drought year
    
    data.push({
      year: year.toString(),
      variance: parseFloat(rainDelta.toFixed(1)),
      extremeFloodDays: Math.max(0, Math.round((rainDelta / 5) + pRandom2 * 2)),
      extremeDroughtDays: Math.max(0, Math.round((-rainDelta / 5) + pRandom3 * 2))
    });
  }
  return data;
};

// 3. Micro-Climate Radar Data (Comparing top districts)
const generateMicroClimateData = (regions: any[]) => {
  if (!regions || regions.length === 0) return [];
  
  // Take top 3 districts for comparison to keep radar readable
  const topDistricts = regions.slice(0, 3);
  
  const metrics = ["Heat Stress", "Flood Risk", "Wind Sheer", "AQI Vulnerability", "Crop Yield Risk"];
  
  return metrics.map((metric, i) => {
    const dataPoint: any = { metric };
    topDistricts.forEach((d, j) => {
      // Generate deterministic fake score 0-100 based on district name and metric
      const seed = d.name.charCodeAt(0) + d.name.length * (i + 1) + j;
      dataPoint[d.name] = 30 + (seed % 65); 
    });
    return dataPoint;
  });
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { selectedState, selectedDistrict, setSelectedLocation, liveWeatherData, unitSystem } = useOSStore();

  const [activeRange, setActiveRange] = useState("30 Years");
  const [districtSearch, setDistrictSearch] = useState("");

  const stateData = selectedState;
  const regions = stateData.regions;

  // --- Generate Data ---
  const decadalData = useMemo(() => generateDecadalAnomaly(stateData.state, activeRange), [stateData.state, activeRange]);
  const hydroData = useMemo(() => generateHydrologicalVolatility(stateData.state), [stateData.state]);
  const microClimateData = useMemo(() => generateMicroClimateData(regions), [regions]);

  const stateTemp = liveWeatherData?.temperature?.toFixed(1) || (26.5 + (stateData.state.length % 8)).toFixed(1);
  const stateRain = liveWeatherData?.rainfall?.toFixed(0) || (120 + (stateData.state.length * 12)).toFixed(0);
  const stateAqi = liveWeatherData?.aqi || (55 + (stateData.state.charCodeAt(0) % 110));
  
  // Dynamic Insights Generation based on data
  const latestAnomaly = decadalData[decadalData.length - 1].anomaly;
  const warmingTrend = latestAnomaly > 1.0 ? "Critical Warming" : latestAnomaly > 0.5 ? "Moderate Warming" : "Stable";
  
  const recentHydro = hydroData.slice(-5);
  const avgFloodDays = recentHydro.reduce((sum, d) => sum + d.extremeFloodDays, 0) / 5;
  const hydroTrend = avgFloodDays > 5 ? "High Hydrological Volatility (Flood Prone)" : "Increasing Drought Frequency";

  const infraRiskScore = 15 + (stateData.state.charCodeAt(0) % 25) + (latestAnomaly > 1 ? 12 : 0);

  // Filtered districts
  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(districtSearch.toLowerCase())
  );

  // CSV Export for state analytics
  const exportResearchCSV = () => {
    // Export the decadal anomaly dataset
    const headers = "Year,Temperature_Anomaly_C,Long_Term_Trend\n";
    const rows = decadalData.map(d => `${d.year},${d.anomaly},${d.trend}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `VRSH_Research_Decadal_Anomaly_${stateData.state.replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-background">
      {/* Top Header & State Selector Toolbar */}
      <div className="px-8 pt-6 pb-4 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0 bg-card">
        <div>
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">Climate Research Analytics</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Deep decadal trends, hydrological volatility, and multi-vector risk models for research applications.
          </p>
        </div>

        {/* State & District Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted border border-primary/50 rounded-xl">
              <MapPin className="w-4 h-4 text-primary" />
              <select
                value={stateData.state}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer pr-4"
              >
                {indianLocations.map((loc) => (
                  <option key={loc.state} value={loc.state} className="bg-muted text-foreground">
                    {loc.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={exportResearchCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-background bg-primary rounded-xl hover:brightness-110 transition-all shadow-md"
          >
            <Download className="w-4 h-4" /> Export Dataset (CSV)
          </button>
        </div>
      </div>

      {/* Main Analytics Body */}
      <div className="p-8 space-y-8">
        
        {/* Top Section: Decadal Trend + AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Decadal Temperature Anomaly */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 os-card p-6 border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-error" />
                  Decadal Temperature Anomaly
                </h3>
                <p className="text-xs text-muted-foreground font-data mt-0.5">
                  Deviation from 20th-century historical baseline ({formatTempUnit(unitSystem)}) for {stateData.state}
                </p>
              </div>
              <div className="flex gap-2">
                {timeRanges.map((r) => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeRange === r ? "bg-primary text-background" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-80 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={decadalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} tickMargin={10} minTickGap={20} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `${v > 0 ? '+' : ''}${formatTemp(v, unitSystem)}${formatTempUnit(unitSystem)}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }}
                    itemStyle={{ color: "hsl(var(--primary))" }}
                    formatter={(value: any) => [`${value > 0 ? '+' : ''}${formatTemp(value, unitSystem)}${formatTempUnit(unitSystem)}`, 'Anomaly']}
                  />
                  <Legend />
                  <Bar dataKey="anomaly" name="Annual Anomaly">
                    {decadalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPositive ? 'hsl(var(--error))' : 'hsl(var(--primary))'} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="trend" name="Long-term Trend" stroke="hsl(var(--tertiary))" strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Research Insights Panel */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="os-card p-6 flex flex-col bg-muted/50 border border-tertiary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-32 h-32 text-tertiary" />
            </div>
            
            <div className="relative z-10">
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2 mb-1">
                <BrainCircuit className="w-5 h-5 text-tertiary" />
                AI Diagnostic Summary
              </h3>
              <p className="text-[10px] text-muted-foreground font-data mb-6 uppercase tracking-wider">Automated Research Synthesis</p>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase mb-1">Thermal Shift</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Data indicates a <span className="font-bold text-error">{warmingTrend}</span> pattern. 
                    The latest recorded anomaly of <span className="font-bold text-error">+{formatTemp(latestAnomaly, unitSystem)}{formatTempUnit(unitSystem)}</span> significantly deviates from the historical mean, suggesting accelerated regional climate shift.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase mb-1">Hydrological Volatility</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Analysis detects <span className="font-bold text-foreground">{hydroTrend}</span>. 
                    Extreme weather events are compounding, with an average of <span className="font-bold text-primary">{avgFloodDays.toFixed(1)} extreme flood days</span> per year in the last pentad.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase mb-1">Infrastructure Risk</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Based on the compounding vectors in {stateData.state}, highly vulnerable districts face an elevated <span className="text-error font-bold">{infraRiskScore}% increased risk</span> of seasonal infrastructure failure compared to the previous decade.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Section: Complex Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hydrological Volatility Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="os-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-1 flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-primary" />
              15-Year Hydrological Volatility
            </h3>
            <p className="text-xs text-muted-foreground font-data mb-6">Extreme Flood Days vs Drought Days over time</p>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hydroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="droughtGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="extremeFloodDays" name="Extreme Flood Days" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#floodGrad)" />
                  <Area type="monotone" dataKey="extremeDroughtDays" name="Extreme Drought Days" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#droughtGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Micro-Climate Radar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="os-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-chart-3" />
              Micro-Climate Sector Vulnerability
            </h3>
            <p className="text-xs text-muted-foreground font-data mb-2">Comparative risk distribution across top 3 districts (0-100 scale)</p>
            
            <div className="h-72 flex items-center justify-center">
              {microClimateData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={microClimateData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--border))', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    
                    <Radar name={regions[0]?.name} dataKey={regions[0]?.name} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    {regions.length > 1 && (
                      <Radar name={regions[1]?.name} dataKey={regions[1]?.name} stroke="hsl(var(--error))" fill="hsl(var(--error))" fillOpacity={0.3} />
                    )}
                    {regions.length > 2 && (
                      <Radar name={regions[2]?.name} dataKey={regions[2]?.name} stroke="hsl(var(--tertiary))" fill="hsl(var(--tertiary))" fillOpacity={0.3} />
                    )}
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-muted-foreground text-sm">No district data available for radar plot.</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Data Matrix Table */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="os-card p-6 space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {stateData.state} District Analytics Matrix
              </h3>
              <p className="text-xs text-muted-foreground font-data mt-0.5">
                Current baseline telemetry across all {regions.length} sub-sectors
              </p>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter districts..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-xs font-bold text-muted-foreground uppercase font-data">
                  <th className="py-3 px-4">District / Sector</th>
                  <th className="py-3 px-4">Coordinates</th>
                  <th className="py-3 px-4">Est. Temp ({formatTempUnit(unitSystem)})</th>
                  <th className="py-3 px-4">Precip Vol ({formatPrecipUnit(unitSystem)})</th>
                  <th className="py-3 px-4">AQI Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-data text-xs">
                {filteredRegions.map((r) => {
                  const distTemp = (parseFloat(stateTemp) + (r.name.length % 3)).toFixed(1);
                  const distRain = parseInt(stateRain) + r.name.length * 6;
                  const distAqi = stateAqi + (r.name.charCodeAt(0) % 25);
                  return (
                    <tr key={r.name} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {r.name}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {r.lat.toFixed(2)}°N, {r.lon.toFixed(2)}°E
                      </td>
                      <td className="py-3.5 px-4 text-primary-container font-bold">{formatTemp(distTemp, unitSystem)}{formatTempUnit(unitSystem)}</td>
                      <td className="py-3.5 px-4 text-primary font-bold">{formatPrecip(distRain, unitSystem)} {formatPrecipUnit(unitSystem)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            distAqi <= 80
                              ? "bg-tertiary/15 text-tertiary"
                              : distAqi <= 150
                              ? "bg-chart-3/15 text-chart-3"
                              : "bg-error/15 text-error"
                          }`}
                        >
                          AQI {distAqi}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedLocation(stateData.state, r.name);
                            router.push('/digital-twin');
                          }}
                          className="px-3 py-1 bg-muted border border-border rounded-lg text-primary hover:bg-muted/80 transition-colors"
                        >
                          Inspect Vector
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
