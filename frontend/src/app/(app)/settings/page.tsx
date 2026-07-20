"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Database, Key, Shield, Terminal, ArrowLeft, Check, Plus, Trash2, Satellite, Server, HardDrive, Activity, Eye, EyeOff } from "lucide-react";
import { useOSStore } from "@/store/useOSStore";
import Link from "next/link";

const navTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "datasources", label: "Data Sources", icon: Database },
  { id: "api", label: "API Access", icon: Key },
  { id: "security", label: "Security", icon: Shield },
  { id: "developer", label: "Developer", icon: Terminal },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [newKeyName, setNewKeyName] = useState("");
  const { 
    darkMode, setDarkMode, unitSystem, setUnitSystem, devMode, setDevMode,
    dataSources, toggleDataSource, apiKeys, generateApiKey, revokeApiKey,
    securitySettings, toggleSecuritySetting
  } = useOSStore();

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-background">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 flex items-center gap-4 border-b border-border/50">
        <Link
          href="/digital-twin"
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Configure VarshaAI system parameters and telemetry options.</p>
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="flex-1 flex gap-8 px-8 py-8 max-w-6xl">
        <div className="w-56 flex-shrink-0 space-y-1">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-primary/10 text-primary border border-primary/30 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <>
              {/* Interface Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="os-card p-6 space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-foreground border-b border-border/50 pb-4">
                  Interface Preferences
                </h2>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Dark Mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Optimize interface for low-light environments.</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      darkMode ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
                        darkMode ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Measurement System */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Measurement System</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Choose units for temperature, wind, and precipitation.</p>
                  </div>
                  <div className="flex bg-card border border-border rounded-lg p-1">
                    <button
                      onClick={() => setUnitSystem("metric")}
                      className={`px-3 py-1 text-xs font-bold rounded ${
                        unitSystem === "metric" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Metric (°C, km/h)
                    </button>
                    <button
                      onClick={() => setUnitSystem("imperial")}
                      className={`px-3 py-1 text-xs font-bold rounded ${
                        unitSystem === "imperial" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Imperial (°F, mph)
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Telemetry & API */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="os-card p-6 space-y-6"
              >
                <h2 className="font-display text-xl font-bold text-foreground border-b border-border/50 pb-4">
                  Telemetry & API
                </h2>

                {/* Live Streaming */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Live Data Streaming</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Current connection status to global satellite network.</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-tertiary bg-tertiary/10 border border-tertiary/30">
                    <Check className="w-3 h-3" /> CONNECTED
                  </span>
                </div>

                {/* Developer Mode */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Developer Mode</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Enable advanced logging and raw data access.</p>
                  </div>
                  <button
                    onClick={() => setDevMode(!devMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      devMode ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${
                        devMode ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            </>
          )}
          
          {activeTab === "datasources" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="os-card p-6 space-y-6">
              <h2 className="font-display text-xl font-bold text-foreground border-b border-border/50 pb-4">
                Data Sources & Telemetry
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSources.map(ds => (
                  <div key={ds.id} className={`p-4 border rounded-xl transition-all ${ds.active ? "bg-primary/5 border-primary/30" : "bg-muted border-border"}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {ds.id === "isro" || ds.id === "sentinel" ? <Satellite className={`w-5 h-5 ${ds.active ? "text-primary" : "text-muted-foreground"}`} /> : <Server className={`w-5 h-5 ${ds.active ? "text-primary" : "text-muted-foreground"}`} />}
                        <div>
                          <p className="font-bold text-foreground text-sm">{ds.name}</p>
                          <p className={`text-[10px] uppercase font-bold mt-0.5 ${ds.active ? "text-tertiary" : "text-error"}`}>{ds.status}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDataSource(ds.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${ds.active ? "bg-primary" : "bg-muted-foreground/30"}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${ds.active ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">Connected to national grid. Sync rate: {ds.active ? "15s" : "N/A"}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "api" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="os-card p-6 space-y-6">
              <h2 className="font-display text-xl font-bold text-foreground border-b border-border/50 pb-4">
                API Access Keys
              </h2>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="New key name (e.g. Weather App)" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:border-primary outline-none"
                />
                <button 
                  onClick={() => { if(newKeyName) { generateApiKey(newKeyName); setNewKeyName(""); } }}
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold text-sm rounded-lg flex items-center gap-2 hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" /> Generate
                </button>
              </div>
              <div className="space-y-3">
                {apiKeys.map(k => (
                  <div key={k.id} className="flex items-center justify-between p-4 bg-muted border border-border rounded-lg">
                    <div>
                      <p className="font-bold text-sm text-foreground">{k.name}</p>
                      <p className="font-data text-xs text-muted-foreground mt-1">{k.key}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase">Last Used</p>
                        <p className="text-xs font-semibold text-foreground">{k.lastUsed}</p>
                      </div>
                      <button onClick={() => revokeApiKey(k.id)} className="p-2 text-muted-foreground hover:text-error transition-colors bg-background rounded-md border border-border">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="os-card p-6 space-y-6">
              <h2 className="font-display text-xl font-bold text-foreground border-b border-border/50 pb-4">
                Security & Compliance
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-foreground">End-to-End Encryption</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Encrypt all telemetry data at rest and in transit.</p>
                  </div>
                  <button onClick={() => toggleSecuritySetting("e2e")} className={`relative w-12 h-6 rounded-full transition-colors ${securitySettings.e2e ? "bg-tertiary" : "bg-muted-foreground/30"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${securitySettings.e2e ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Multi-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Require biometric or hardware token for system override.</p>
                  </div>
                  <button onClick={() => toggleSecuritySetting("mfa")} className={`relative w-12 h-6 rounded-full transition-colors ${securitySettings.mfa ? "bg-tertiary" : "bg-muted-foreground/30"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${securitySettings.mfa ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Strict Audit Logging</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Log every user interaction to the immutable ledger.</p>
                  </div>
                  <button onClick={() => toggleSecuritySetting("auditLog")} className={`relative w-12 h-6 rounded-full transition-colors ${securitySettings.auditLog ? "bg-tertiary" : "bg-muted-foreground/30"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${securitySettings.auditLog ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "developer" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="os-card p-6 space-y-6">
              <h2 className="font-display text-xl font-bold text-foreground border-b border-border/50 pb-4">
                Developer Options
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted border border-border rounded-lg flex flex-col items-center justify-center text-center gap-2">
                  <HardDrive className="w-8 h-8 text-primary" />
                  <p className="text-sm font-bold text-foreground">Clear Local Cache</p>
                  <p className="text-[10px] text-muted-foreground">Free up 1.2 GB of simulated model weights</p>
                  <button className="mt-2 px-4 py-1.5 bg-background border border-border hover:bg-primary/10 hover:text-primary rounded-md text-xs font-semibold transition-colors">Clear Cache</button>
                </div>
                <div className="p-4 bg-muted border border-border rounded-lg flex flex-col items-center justify-center text-center gap-2">
                  <Activity className="w-8 h-8 text-primary" />
                  <p className="text-sm font-bold text-foreground">Run Diagnostics</p>
                  <p className="text-[10px] text-muted-foreground">Test connection to prediction engines</p>
                  <button className="mt-2 px-4 py-1.5 bg-background border border-border hover:bg-primary/10 hover:text-primary rounded-md text-xs font-semibold transition-colors">Start Test</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
