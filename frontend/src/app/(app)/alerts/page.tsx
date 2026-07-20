"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useOSStore } from "@/store/useOSStore";
import { fetchAlerts, AlertData, AlertsResponse } from "@/lib/api";
import {
  AlertTriangle,
  Users,
  Home,
  Truck,
  Clock,
  CheckCircle,
  Wind,
  CloudRain,
  Activity,
  Flame,
  CloudLightning,
  CloudFog,
  Snowflake,
  RefreshCw,
  Loader2,
  MapPin,
  Radio,
  Shield,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false });

// Icon mapping for alert types
const ALERT_ICONS: Record<string, typeof Wind> = {
  cyclone: Wind,
  rain: CloudRain,
  heatwave: Flame,
  thunderstorm: CloudLightning,
  aqi: Activity,
  fog: CloudFog,
  snow: Snowflake,
};

// Severity label mapping
const SEVERITY_LABELS: Record<number, string> = {
  1: "LOW",
  2: "MODERATE",
  3: "HIGH",
  4: "SEVERE",
  5: "CRITICAL",
};

export default function AlertsPage() {
  const { activeAlert, setActiveAlert } = useOSStore();
  const [alertsData, setAlertsData] = useState<AlertsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  const loadAlerts = useCallback(async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const data = await fetchAlerts();
      setAlertsData(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
      setError("Unable to reach alert engine. Backend may be offline.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => loadAlerts(true), 600000);
    return () => clearInterval(interval);
  }, [loadAlerts]);

  const alerts = alertsData?.alerts || [];

  // Filter alerts
  const filteredAlerts = filterType === "all"
    ? alerts
    : alerts.filter((a) => a.type === filterType);

  // Unique alert types for filter tabs
  const alertTypes = [...new Set(alerts.map((a) => a.type))];

  // Summary stats
  const criticalCount = alerts.filter((a) => a.severity >= 4).length;
  const highCount = alerts.filter((a) => a.severity === 3).length;
  const moderateCount = alerts.filter((a) => a.severity <= 2).length;
  const statesAffected = new Set(alerts.map((a) => a.location?.state)).size;

  const handleAlertClick = (alert: AlertData, index: number) => {
    setExpandedAlert(expandedAlert === index ? null : index);
    // Map the alert type to the store's alert focus type
    const focusType = alert.type === "heatwave" ? "aqi" as const
      : alert.type === "thunderstorm" ? "rain" as const
      : (alert.type as "cyclone" | "rain" | "aqi");
    setActiveAlert(focusType, { lat: alert.location.lat, lon: alert.location.lon }, alert.location.state);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 flex items-start justify-between flex-shrink-0 border-b border-border/50 bg-muted">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-error" />
            Live Alert Hub
          </h1>
          <p className="text-foreground mt-1 text-sm max-w-xl">
            Real-time weather alerts sourced from Open-Meteo WMO forecast models across {alertsData?.monitoring_stations || 20} Indian monitoring stations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => loadAlerts(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
            criticalCount > 0
              ? "bg-[#93000a]/20 border-error/30"
              : highCount > 0
              ? "bg-chart-3/10 border-chart-3/30"
              : "bg-tertiary/10 border-tertiary/30"
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              criticalCount > 0 ? "bg-error" : highCount > 0 ? "bg-chart-3" : "bg-tertiary"
            }`} />
            <span className={`font-data text-xs font-bold ${
              criticalCount > 0 ? "text-error" : highCount > 0 ? "text-chart-3" : "text-tertiary"
            }`}>
              {criticalCount > 0
                ? `${criticalCount} CRITICAL EVENT${criticalCount > 1 ? "S" : ""}`
                : highCount > 0
                ? `${highCount} HIGH ALERT${highCount > 1 ? "S" : ""}`
                : "ALL SYSTEMS NOMINAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex gap-5 px-8 py-5 overflow-hidden min-h-0">
        {/* Left: Alert Feed */}
        <div className="w-[460px] flex-shrink-0 flex flex-col gap-4 overflow-hidden">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === "all"
                  ? "bg-primary text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              ALL ({alerts.length})
            </button>
            {alertTypes.map((type) => {
              const count = alerts.filter((a) => a.type === type).length;
              const Icon = ALERT_ICONS[type] || AlertTriangle;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    filterType === type
                      ? "bg-primary text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {type.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>

          {/* Alert Cards Scrollable List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Fetching live alerts from 20 stations...</p>
              </div>
            ) : error ? (
              <div className="os-card p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-error mx-auto mb-3" />
                <p className="text-sm text-error font-bold">{error}</p>
                <button
                  onClick={() => loadAlerts()}
                  className="mt-4 px-4 py-2 bg-muted border border-border rounded-lg text-xs text-primary hover:bg-[#1c2b3c] transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="os-card p-6 text-center">
                <Shield className="w-8 h-8 text-tertiary mx-auto mb-3" />
                <p className="text-sm text-tertiary font-bold">No Active Alerts</p>
                <p className="text-xs text-muted-foreground mt-1">All monitoring stations reporting nominal conditions.</p>
              </div>
            ) : (
              filteredAlerts.map((alert, i) => {
                const Icon = ALERT_ICONS[alert.type] || AlertTriangle;
                const isExpanded = expandedAlert === i;
                return (
                  <motion.div
                    key={`${alert.type}-${alert.location?.name}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleAlertClick(alert, i)}
                    className={`os-card p-4 cursor-pointer transition-all hover:border-primary/40 ${
                      isExpanded ? "border-2 border-primary bg-[#1c2b3c] shadow-lg" : ""
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ color: alert.color, backgroundColor: `${alert.color}15` }}
                      >
                        <Icon className="w-3 h-3" />
                        {alert.category} • LEVEL {alert.severity}
                      </span>
                      <span className="font-data text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location?.name}, {alert.location?.state}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-foreground leading-snug">{alert.title}</h3>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-5 mt-3">
                      <div>
                        <p className="label-caps text-muted-foreground" style={{ fontSize: "9px" }}>{alert.metric_label}</p>
                        <p className="font-data text-base font-bold" style={{ color: alert.color }}>{alert.metric_value}</p>
                      </div>
                      <div>
                        <p className="label-caps text-muted-foreground" style={{ fontSize: "9px" }}>{alert.secondary_label}</p>
                        <p className="font-data text-base text-foreground">{alert.secondary_value}</p>
                      </div>
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-primary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs text-foreground leading-relaxed">{alert.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="font-data text-[10px] text-muted-foreground">
                                Zone: {alert.location?.zone}
                              </span>
                              <span className="font-data text-[10px] text-muted-foreground">
                                Coords: {alert.location?.lat?.toFixed(2)}°N, {alert.location?.lon?.toFixed(2)}°E
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Radio className="w-3 h-3 text-primary" />
                              <span className="font-data text-[10px] text-primary">
                                Source: {alert.source}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Last Refresh Timestamp */}
          {lastRefresh && (
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-data pt-2 border-t border-border/50">
              <span>Last Sync: {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              <span>Auto-refresh: 10 min</span>
            </div>
          )}
        </div>

        {/* Right: Map + Summary Stats */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* Map */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-border shadow-2xl">
            <MapView interactive showControls hideAqiLegend>
              {/* Overlays */}
            </MapView>
            <div className="absolute top-4 left-4 z-10 glass rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-data text-xs text-foreground font-bold">Affected Regions Overview</span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 glass rounded-xl px-4 py-2 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-error" /> Critical (L4–L5)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-chart-3" /> High (L3)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-foreground">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Watch (L1–L2)
              </span>
            </div>

            {/* Data source badge */}
            <div className="absolute top-4 right-4 z-10 glass rounded-xl px-3 py-2">
              <p className="font-data text-[10px] text-tertiary font-bold">DATA: LIVE (Open-Meteo WMO)</p>
            </div>
          </div>

          {/* Bottom Summary Cards */}
          <div className="grid grid-cols-4 gap-4 flex-shrink-0">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="os-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-error/10 border border-error/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="label-caps text-muted-foreground" style={{ fontSize: "9px" }}>TOTAL ALERTS</p>
                <p className="font-data text-2xl text-foreground font-bold mt-0.5">{alerts.length}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="os-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="label-caps text-muted-foreground" style={{ fontSize: "9px" }}>STATES AFFECTED</p>
                <p className="font-data text-2xl text-foreground font-bold mt-0.5">{statesAffected}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="os-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-chart-3/10 border border-chart-3/30 flex items-center justify-center">
                <Radio className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="label-caps text-muted-foreground" style={{ fontSize: "9px" }}>MONITORING</p>
                <p className="font-data text-2xl text-foreground font-bold mt-0.5">{alertsData?.monitoring_stations || 20}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="os-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <p className="label-caps text-muted-foreground" style={{ fontSize: "9px" }}>SEVERITY MIX</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {criticalCount > 0 && <span className="font-data text-xs text-error font-bold">{criticalCount} CRIT</span>}
                  {highCount > 0 && <span className="font-data text-xs text-chart-3 font-bold">{highCount} HIGH</span>}
                  {moderateCount > 0 && <span className="font-data text-xs text-primary font-bold">{moderateCount} MOD</span>}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
