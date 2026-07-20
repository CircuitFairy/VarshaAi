"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, User, Search, Download, ShieldAlert, X, AlertOctagon, PhoneCall, Radio, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/store/useOSStore";

const viewTabs = [
  { label: "Global View", href: "/digital-twin" },
  { label: "Regional Analysis", href: "/analytics" },
  { label: "Enterprise Reports", href: "/reports" },
];

export function TopBar() {
  const pathname = usePathname();
  const showSearch = pathname === "/analytics";
  const { emergencyProtocolActive, setEmergencyProtocol, exportCurrentData } = useOSStore();

  return (
    <>
      <header className="h-14 flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 relative z-20">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1">
          {viewTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Center: Search (conditional) */}
        {showSearch && (
          <div className="flex-1 max-w-sm mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search analytics..."
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>
        </div>
      </header>

      {/* Emergency Protocol Modal Overlay */}
      <AnimatePresence>
        {emergencyProtocolActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl bg-card border-2 border-error rounded-2xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between border-b border-error/30 pb-4">
                <div className="flex items-center gap-3 text-error">
                  <AlertOctagon className="w-8 h-8 animate-bounce" />
                  <div>
                    <h2 className="font-display text-2xl font-bold">EMERGENCY PROTOCOL ACTIVE</h2>
                    <p className="font-data text-xs text-foreground mt-0.5">National Crisis Intervention Mode</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmergencyProtocol(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-error/20 border border-error/30 rounded-xl">
                  <p className="text-sm font-bold text-error flex items-center gap-2">
                    <Radio className="w-4 h-4 animate-pulse" /> Direct Command Link Established
                  </p>
                  <p className="text-xs text-foreground mt-1">
                    Connecting to National Disaster Management Authority (NDMA) & State Disaster Response Force (SDRF) broadcast frequency.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-5 bg-muted border border-border rounded-xl hover:border-error hover:bg-muted/80 transition-all group">
                    <Zap className="w-6 h-6 text-error group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-sm font-bold text-foreground">Trigger Red Alert</span>
                    <span className="text-[10px] text-muted-foreground mt-1">Broadcast to all regional hubs</span>
                  </button>

                  <button className="flex flex-col items-center justify-center p-5 bg-muted border border-border rounded-xl hover:border-tertiary hover:bg-muted/80 transition-all group">
                    <PhoneCall className="w-6 h-6 text-tertiary group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-sm font-bold text-foreground">Dispatch Airlift Units</span>
                    <span className="text-[10px] text-muted-foreground mt-1">SDRF Sector 4 Response</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  onClick={() => setEmergencyProtocol(false)}
                  className="px-5 py-2.5 bg-muted border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
                >
                  Deactivate Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
