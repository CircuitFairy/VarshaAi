"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";

interface LaunchContextType {
  startLaunch: (href: string) => void;
}

const LaunchContext = createContext<LaunchContextType | undefined>(undefined);

export function useLaunch() {
  const context = useContext(LaunchContext);
  if (!context) {
    throw new Error("useLaunch must be used within a LaunchTransitionProvider");
  }
  return context;
}

export function LaunchTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [phase, setPhase] = useState<"idle" | "storming" | "clearing">("idle");
  const router = useRouter();

  const startLaunch = (href: string) => {
    if (isLaunching) return;
    setIsLaunching(true);
    setPhase("storming");

    // After 2.5 seconds of intense storm, push route and start clearing
    setTimeout(() => {
      router.push(href);
      setPhase("clearing");
      
      // Remove overlay completely after it fades out
      setTimeout(() => {
        setIsLaunching(false);
        setPhase("idle");
      }, 1000);
    }, 2500);
  };

  // Prevent scroll during launch
  useEffect(() => {
    if (isLaunching) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLaunching]);

  return (
    <LaunchContext.Provider value={{ startLaunch }}>
      {children}
      
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-background"
          >
            {/* Dark Storm Background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "storming" ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-[#020817]"
            />

            {/* 3D Clouds Overlay */}
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: phase === "storming" ? 2.5 : 3, opacity: phase === "storming" ? 1 : 0 }}
              transition={{ duration: 3.5, ease: "easeIn" }}
              className="absolute inset-0 flex items-center justify-center mix-blend-screen"
            >
              {/* Cloud 1 */}
              <div className="absolute top-1/4 left-1/4 w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-[120px] animate-[spin_10s_linear_infinite]" />
              {/* Cloud 2 */}
              <div className="absolute bottom-1/4 right-1/4 w-[100vw] h-[100vw] rounded-full bg-indigo-500/20 blur-[150px] animate-[spin_12s_linear_infinite_reverse]" />
              {/* Cloud 3 (Center massive thunderhead) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full bg-sky-600/10 blur-[100px] animate-pulse" />
            </motion.div>

            {/* Rain Simulation */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "storming" ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute inset-0 overflow-hidden opacity-50"
            >
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[2px] h-[100px] bg-gradient-to-b from-transparent via-primary/50 to-primary animate-rain"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-100px`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.3 + Math.random() * 0.4}s`
                  }}
                />
              ))}
            </motion.div>

            {/* System Boot Text Overlay */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: phase === "storming" ? 1 : 0, y: phase === "storming" ? 0 : -50 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
              <Terminal className="w-16 h-16 text-primary mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tighter mb-4 drop-shadow-[0_0_20px_rgba(60,215,255,0.5)]">
                INITIALIZING DIGITAL TWIN
              </h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-primary font-data uppercase tracking-widest text-sm animate-pulse">Establishing Telemetry Uplink...</p>
                <div className="w-64 h-1 bg-muted/50 rounded-full overflow-hidden mt-2">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="h-full bg-primary shadow-[0_0_10px_var(--primary)]"
                  />
                </div>
              </div>
            </motion.div>

            {/* Lightning Flashes */}
            <motion.div
              animate={{ opacity: [0, 0, 0.8, 0, 0, 0.4, 0] }}
              transition={{ duration: 2.5, times: [0, 0.4, 0.45, 0.5, 0.8, 0.85, 1] }}
              className="absolute inset-0 bg-white mix-blend-overlay z-0"
            />
            
          </motion.div>
        )}
      </AnimatePresence>
    </LaunchContext.Provider>
  );
}

// Global styles for rain animation to be injected or relied upon in globals.css
// @keyframes rain {
//   0% { transform: translateY(-100px) scaleY(1); opacity: 0; }
//   10% { opacity: 1; }
//   100% { transform: translateY(100vh) scaleY(1.5); opacity: 0; }
// }
