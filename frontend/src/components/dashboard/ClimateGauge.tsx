"use client";

import { motion } from "framer-motion";

export function ClimateGauge({ score, status }: { score: number, status: string }) {
  // Determine color based on status
  let color = "#10b981"; // emerald for Green
  if (status === "Yellow") color = "#f59e0b"; // amber
  if (status === "Orange") color = "#f97316"; // orange
  if (status === "Red") color = "#ef4444"; // red

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Dashboard gauge usually goes from -90deg to 90deg (half circle)
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-black text-foreground drop-shadow-md"
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Score</span>
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg"
        style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}
      >
        {status} Status
      </motion.div>
    </div>
  );
}
