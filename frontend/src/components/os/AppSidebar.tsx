"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Globe,
  BarChart3,
  Rocket,
  AlertTriangle,
  Brain,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Command Center", href: "/command-center", icon: LayoutDashboard },
  { label: "Digital Twin", href: "/digital-twin", icon: Globe },
  { label: "Climate Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Mission Control", href: "/mission-control", icon: Rocket },
  { label: "Alert Hub", href: "/alerts", icon: AlertTriangle },
  { label: "AI Insights", href: "/ai-insights", icon: Brain },
];

const bottomLinks = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full relative z-30">
      {/* Brand */}
      <div className="px-6 pt-6 pb-5">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="VarshaAI Logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight leading-none">
              <span className="text-foreground">Varsha</span>
              <span className="text-primary">AI</span>
            </h1>
            <p className="label-caps text-muted-foreground mt-1" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>
              Global OS
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>



      {/* Bottom Links */}
      <div className="px-3 py-3 border-t border-sidebar-border flex flex-col gap-1">
        {bottomLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

    </aside>
  );
}
