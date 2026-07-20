"use client";

import { useEffect, useState } from "react";
import { useOSStore } from "@/store/useOSStore";
import { Terminal, X, Activity, Server, Clock } from "lucide-react";

export function DevConsole() {
  const { devMode, setDevMode, unitSystem, darkMode, activeLayer } = useOSStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (!devMode) return;
    
    // Add initial logs
    setLogs(prev => [
      ...prev,
      `[SYS] Developer Mode Initialized`,
      `[SYS] Unit System: ${unitSystem.toUpperCase()}`,
      `[SYS] Theme: ${darkMode ? "DARK" : "LIGHT"}`,
      `[MAP] Layer Set: ${activeLayer.toUpperCase()}`
    ]);

    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 5) + 56);
      
      if (Math.random() > 0.8) {
        const msgs = [
          `[NET] Received 14kb telemetry chunk`,
          `[MEM] GC cleared 2.1MB`,
          `[API] Fetching 12 tiles for ${activeLayer}...`,
          `[WS] Heartbeat OK (12ms)`
        ];
        setLogs(prev => [...prev.slice(-9), msgs[Math.floor(Math.random() * msgs.length)]]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [devMode, unitSystem, darkMode, activeLayer]);

  if (!devMode) return null;

  return (
    <div className="fixed bottom-14 right-4 w-96 bg-card border border-primary/30 rounded-lg shadow-[0_0_20px_rgba(var(--primary),0.15)] z-50 overflow-hidden flex flex-col font-data text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted">
        <div className="flex items-center gap-2 text-primary">
          <Terminal className="w-4 h-4" />
          <span className="font-bold">DEV_CONSOLE_v1.0</span>
        </div>
        <button onClick={() => setDevMode(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-3 bg-[#020810] h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('[SYS]') ? 'text-primary' : log.includes('[NET]') ? 'text-tertiary' : 'text-muted-foreground'}`}>
            <span className="opacity-50 mr-2">{new Date().toISOString().split('T')[1].slice(0,8)}</span>
            {log}
          </div>
        ))}
      </div>
      
      <div className="px-3 py-1.5 border-t border-border bg-muted flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1"><Activity className="w-3 h-3 text-tertiary" /> FPS: {fps}</div>
        <div className="flex items-center gap-1"><Server className="w-3 h-3 text-primary" /> MEM: 112MB</div>
        <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> PING: 12ms</div>
      </div>
    </div>
  );
}
