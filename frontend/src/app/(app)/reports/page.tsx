"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";
import { formatTemp, formatTempUnit } from "@/lib/formatters";
import { 
  FileText, Printer, Share2, Download, CheckCircle, Search, Filter, 
  Lock, ShieldAlert, Activity, Target
} from "lucide-react";

// Highly detailed mock data structure
const getReports = (unitSystem: 'metric' | 'imperial') => [
  {
    id: "REP-AS-FL-24-10",
    title: "Assam Basin: Predictive Inundation Models",
    subtitle: "Comprehensive analysis of impending flood risks in the Brahmaputra basin.",
    category: "FLOOD RISK",
    date: "Oct 24, 2024",
    size: "4.2 MB",
    confidence: "94.2%",
    region: "Assam Basin Sector",
    content: {
      executiveSummary: "Recent telemetry from the Sentinel-2 constellation, combined with local hydrological sensor data along the Brahmaputra river basin, indicates a severe convergence of high-precipitation cells and upstream snowmelt. The predictive models show a high probability of substantial inundation in low-lying districts over the next 72 hours. Immediate resource reallocation is advised.",
      heatmapTitle: "FIG 1: Flood Probability Heatmap",
      heatmapGradient: "from-red-500/20 via-orange-500/10 to-transparent",
      metrics: [
        { label: "Precip. Rate", val: "45", unit: "mm/hr", stat: "↑ +12% vs baseline", color: "text-foreground", statColor: "text-error" },
        { label: "River Level (Guwahati)", val: "49.6", unit: "m", stat: "Warning Level: 49.68m", color: "text-error", statColor: "text-error" },
        { label: "Impact Radius", val: "120", unit: "sq km", stat: "", color: "text-foreground", statColor: "" },
        { label: "Pop. at Risk", val: "~45,000", unit: "", stat: "", color: "text-primary", statColor: "" }
      ],
      actions: [
        "Initiate Phase 2 evacuation protocols for Majuli and surrounding low-lying islands immediately.",
        "Deploy mobile embankment reinforcement units to Sector 4 and Sector 7 embankments.",
        "Alert state disaster response forces (SDRF) for potential airlift operations in cutoff zones."
      ]
    }
  },
  {
    id: "REP-PB-WH-24-10",
    title: "Punjab Wheat Yield Forecast - Q4",
    subtitle: "Impact of unseasonal thermal anomalies on rabi crop growth vectors.",
    category: "AGRICULTURE",
    date: "Oct 22, 2024",
    size: "2.8 MB",
    confidence: "89.5%",
    region: "Northern Plains",
    content: {
      executiveSummary: `Thermal anomaly detection algorithms have identified a persistent +${formatTemp(2.4, unitSystem)}${formatTempUnit(unitSystem)} deviation across the Punjab agricultural belt during the critical flowering stage of the Rabi wheat cycle. Historical correlation suggests a potential 8-12% yield depression if thermal trends persist for the next 14 days.`,
      heatmapTitle: "FIG 2: Soil Moisture & Thermal Stress Index",
      heatmapGradient: "from-yellow-500/20 via-orange-500/10 to-transparent",
      metrics: [
        { label: "Thermal Delta", val: `+${formatTemp(2.4, unitSystem)}`, unit: formatTempUnit(unitSystem), stat: "Persistent for 96 hrs", color: "text-chart-3", statColor: "text-error" },
        { label: "Soil Moisture", val: "18", unit: "%", stat: "Critical Threshold: 15%", color: "text-error", statColor: "text-error" },
        { label: "Est. Yield Drop", val: "8.5", unit: "%", stat: "Confidence: High", color: "text-foreground", statColor: "text-primary" },
        { label: "Acreage Affected", val: "2.1M", unit: "Ha", stat: "", color: "text-primary", statColor: "" }
      ],
      actions: [
        "Issue advisories for immediate light irrigation to regulate soil micro-climate temperatures.",
        "Mobilize state agricultural extension officers to monitor pest outbreaks associated with thermal stress.",
        "Prepare contingency supply chain logistics for potential wheat procurement deficits."
      ]
    }
  },
  {
    id: "REP-ND-CY-24-10",
    title: "National Disaster Response Protocol: Coastal Cyclones",
    subtitle: "Updated evacuation routes and resource positioning for Bay of Bengal events.",
    category: "GOV. MANDATE",
    date: "Oct 15, 2024",
    size: "8.1 MB",
    confidence: "98.0%",
    region: "Eastern Seaboard",
    content: {
      executiveSummary: "Following the predictive modeling of cyclical low-pressure systems forming in the Bay of Bengal, the National Disaster Response Force (NDRF) has mandated an update to coastal evacuation protocols. This report details the reallocation of deep-water rescue assets and the designation of 45 new storm shelters.",
      heatmapTitle: "FIG 3: Cyclone Trajectory & Evacuation Corridors",
      heatmapGradient: "from-blue-500/20 via-primary/10 to-transparent",
      metrics: [
        { label: "New Shelters", val: "45", unit: "", stat: "Capacity: 120,000", color: "text-tertiary", statColor: "text-primary" },
        { label: "Rescue Boats", val: "150", unit: "Units", stat: "Redeployed to Zone B", color: "text-foreground", statColor: "text-muted-foreground" },
        { label: "Evac Time", val: "< 6", unit: "Hrs", stat: "Target metric", color: "text-tertiary", statColor: "text-tertiary" },
        { label: "Risk Level", val: "SEVERE", unit: "", stat: "Bay of Bengal specific", color: "text-error", statColor: "" }
      ],
      actions: [
        "Distribute updated evacuation corridor maps to all district magistrates along the eastern seaboard.",
        "Conduct readiness drills for NDRF battalions stationed in Odisha and West Bengal.",
        "Stockpile non-perishable rations at all newly designated storm shelters within 72 hours."
      ]
    }
  },
  {
    id: "REP-DC-SM-24-10",
    title: "Soil Moisture Deficit: Central Deccan Plateau",
    subtitle: "Drought indicators and recommended agricultural groundwater protocols.",
    category: "AGRICULTURE",
    date: "Oct 10, 2024",
    size: "3.5 MB",
    confidence: "91.4%",
    region: "Central Deccan",
    content: {
      executiveSummary: "Satellite multispectral imaging indicates a severe depletion of subsurface soil moisture across the Central Deccan Plateau. Combined with a 22% deficit in monsoon rainfall for the region, hydrological models predict acute water scarcity for the upcoming sowing season. Immediate groundwater preservation mandates are required.",
      heatmapTitle: "FIG 4: Subsurface Hydrological Deficit",
      heatmapGradient: "from-amber-700/20 via-orange-800/10 to-transparent",
      metrics: [
        { label: "Rainfall Deficit", val: "22", unit: "%", stat: "vs 10-year avg", color: "text-error", statColor: "text-error" },
        { label: "Aquifer Lvl", val: "-4.2", unit: "m", stat: "Critical depletion", color: "text-error", statColor: "text-error" },
        { label: "Drought Prob.", val: "87", unit: "%", stat: "For next 90 days", color: "text-foreground", statColor: "text-error" },
        { label: "Irrigation Req.", val: "HIGH", unit: "", stat: "", color: "text-chart-3", statColor: "" }
      ],
      actions: [
        "Implement immediate restrictions on deep borewell drilling for non-agricultural use.",
        "Launch farmer awareness campaigns promoting drought-resistant crop variants (e.g., millets).",
        "Release emergency funds for micro-irrigation system subsidies in affected districts."
      ]
    }
  },
];

export default function ReportsPage() {
  const { unitSystem } = useOSStore();
  const reports = getReports(unitSystem);
  const [activeReportId, setActiveReportId] = useState(reports[0].id);
  const activeReport = reports.find((r) => r.id === activeReportId) || reports[0];

  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeReport.title,
        text: `VarshaAI Intelligence Dossier: ${activeReport.title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Report URL copied to clipboard!");
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("dossier-content");
    if (!element) return;
    
    setIsDownloading(true);
    try {
      // Use html-to-image which natively supports modern CSS (lab/oklch) via SVG foreignObject
      const htmlToImage = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      const imgData = await htmlToImage.toPng(element, {
        backgroundColor: '#051424',
        pixelRatio: 2,
      });
      
      // Create an image object to reliably get the dimensions of the generated image
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (img.height * pdfWidth) / img.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeReport.id}_DECRYPTED.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background relative">
      {/* Background scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--primary) 3px, var(--primary) 3px)' }}></div>

      {/* Page Header */}
      <div className="px-8 pt-8 pb-6 flex items-start justify-between flex-shrink-0 relative z-10 border-b border-primary/20 bg-card/80 backdrop-blur-md">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground flex items-center gap-4 tracking-tight">
            <FileText className="w-8 h-8 text-primary" />
            ENTERPRISE <span className="text-primary">REPORTS</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl font-mono">
            SECURE REPOSITORY // SYNTHESIZED GOV & ENTERPRISE INTELLIGENCE
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 os-card p-0 overflow-hidden bg-muted">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <input
              type="text"
              placeholder="Query reports..."
              className="w-full bg-transparent border-none pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
          <button className="p-2 os-card bg-muted hover:bg-primary/10 text-primary transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-8 px-8 py-6 min-h-0 overflow-hidden relative z-10">
        
        {/* Left Column: Report List */}
        <div className="w-[420px] flex-shrink-0 flex flex-col gap-5 overflow-hidden">
          {/* Filter Pills */}
          <div className="flex gap-2 mb-2">
            {["ALL", "AGRICULTURE", "FLOOD RISK"].map((filter, i) => (
              <button
                key={filter}
                className={`px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all ${
                  i === 0 ? "bg-primary/20 text-primary border border-primary" : "bg-muted text-muted-foreground hover:text-foreground border border-border hover:border-muted-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
            {reports.map((report) => {
              const isSelected = report.id === activeReportId;
              return (
                <div
                  key={report.id}
                  onClick={() => setActiveReportId(report.id)}
                  className={`os-card p-4 cursor-pointer transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-muted border-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]"
                      : "bg-card border-border hover:border-primary/50"
                  }`}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-pulse" />
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${isSelected ? 'bg-primary/20 text-primary' : 'bg-border/50 text-muted-foreground'}`}>
                      {report.category}
                    </span>
                    <span className="font-data text-[10px] text-muted-foreground flex items-center gap-1">
                      {isSelected && <Activity className="w-3 h-3 text-primary animate-pulse" />}
                      {report.date}
                    </span>
                  </div>
                  
                  <h3 className={`font-display text-sm font-bold leading-snug mb-2 ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {report.title}
                  </h3>
                  
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {report.subtitle}
                  </p>
                  
                  <div className="flex items-center justify-between text-[10px] font-data border-t border-border/50 pt-2">
                    <span className="text-border group-hover:text-muted-foreground transition-colors">{report.size}</span>
                    <span className={isSelected ? 'text-tertiary' : 'text-border'}>CONF: {report.confidence}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: PDF Preview / Document Viewer */}
        <div className="flex-1 os-card bg-card flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Dossier Header Action Bar */}
          <div className="px-6 py-4 border-b border-primary/30 bg-muted flex items-center justify-between flex-shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <Lock className="w-4 h-4 text-chart-3" />
              <span className="font-mono text-sm font-bold text-primary-container tracking-wider">{activeReport.id}.pdf</span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-chart-3/10 text-chart-3 border border-chart-3/30 uppercase tracking-widest">RESTRICTED</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handlePrint} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors">
                <Printer className="w-4 h-4" />
              </button>
              <button onClick={handleShare} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button onClick={handleDownload} disabled={isDownloading} className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold text-[10px] uppercase tracking-widest hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Download className="w-4 h-4" />
                {isDownloading ? "GENERATING PDF..." : "DECRYPT & DOWNLOAD"}
              </button>
            </div>
          </div>

          {/* Document Content with Animation */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReport.id}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-8 min-h-full flex justify-center"
              >
                {/* The "Paper" Dossier */}
                <div id="dossier-content" className="w-full max-w-4xl bg-background border border-primary/20 shadow-[0_0_40px_rgba(var(--primary),0.05)] p-10 space-y-10 relative overflow-hidden">
                  
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <ShieldAlert className="w-[400px] h-[400px] text-primary" />
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-start border-b-2 border-primary/30 pb-6 relative z-10">
                    <div className="flex-1 pr-8">
                      <p className="font-mono text-primary text-xs font-bold tracking-widest mb-2">INTELLIGENCE DOSSIER</p>
                      <h1 className="font-display text-3xl font-bold text-foreground tracking-tight leading-tight">{activeReport.title}</h1>
                      <p className="text-sm text-muted-foreground font-bold tracking-widest uppercase mt-3 flex items-center gap-2">
                        <Target className="w-4 h-4" /> {activeReport.region}
                      </p>
                    </div>
                    <div className="text-right font-data text-xs text-muted-foreground space-y-1.5 p-4 bg-muted border border-border">
                      <p className="text-foreground">REF: <span className="text-primary">{activeReport.id}</span></p>
                      <p>DATE: {activeReport.date}</p>
                      <p>CLASS: {activeReport.category}</p>
                      <p className="text-tertiary font-bold mt-2 pt-2 border-t border-border">AI CONF: {activeReport.confidence}</p>
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="relative z-10">
                    <h2 className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary" /> EXECUTIVE SUMMARY
                    </h2>
                    <p className="text-sm text-foreground/80 leading-loose font-mono bg-muted/50 p-6 border-l-2 border-primary">
                      {activeReport.content.executiveSummary}
                    </p>
                  </div>

                  {/* Spatial Risk Visualization & Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                    
                    {/* Heatmap Graphic */}
                    <div>
                      <h2 className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" /> SPATIAL VISUALIZATION
                      </h2>
                      <div className="h-56 bg-muted border border-border relative overflow-hidden flex items-end justify-start p-4 group">
                        {/* Grid Background */}
                        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 19px, var(--primary) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, var(--primary) 20px)' }}></div>
                        {/* Heatmap Gradient */}
                        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${activeReport.content.heatmapGradient}`} />
                        
                        <span className="relative font-mono text-[10px] text-primary bg-background/90 px-3 py-1.5 border border-primary/30 backdrop-blur-md">
                          {activeReport.content.heatmapTitle}
                        </span>
                      </div>
                    </div>

                    {/* Critical Metrics Grid */}
                    <div>
                      <h2 className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" /> CRITICAL METRICS
                      </h2>
                      <div className="grid grid-cols-2 gap-3">
                        {activeReport.content.metrics.map((metric, i) => (
                          <div key={i} className="bg-muted p-4 border border-border hover:border-primary/50 transition-colors">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{metric.label}</p>
                            <p className={`font-data text-2xl font-bold ${metric.color}`}>
                              {metric.val} <span className="text-[10px] text-muted-foreground font-sans">{metric.unit}</span>
                            </p>
                            {metric.stat && (
                              <p className={`text-[9px] font-bold tracking-widest uppercase mt-2 ${metric.statColor}`}>{metric.stat}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Recommended Actions */}
                  <div className="relative z-10">
                    <h2 className="text-primary text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary" /> DIRECTIVES & PROTOCOLS
                    </h2>
                    <div className="space-y-3">
                      {activeReport.content.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-muted border border-border">
                          <CheckCircle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/80 leading-relaxed font-mono">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-primary/30 pt-6 flex justify-between items-center text-[10px] text-muted-foreground font-mono tracking-widest relative z-10">
                    <div className="flex items-center gap-4">
                      <span>VARSHAAI SYSTEM ENDPOINT</span>
                      <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span>GENERATED: {activeReport.date}</span>
                    </div>
                    <span>PG 1/1</span>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
