"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Globe, Activity, FileText, Cpu, Info, CloudRain } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Digital Twin", href: "/", icon: Globe },
  { name: "Prediction", href: "/prediction", icon: Cpu },
  { name: "Simulation", href: "/simulation", icon: Activity },
  { name: "Analytics", href: "/analytics", icon: FileText },
  { name: "Satellite", href: "/satellite", icon: CloudRain },
  { name: "About", href: "/about", icon: Info },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass border border-white/10 rounded-full shadow-2xl">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between gap-12">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VarshaAI Logo" className="h-8 w-8 object-contain" />
            <Link href="/" className="text-2xl font-bold text-foreground tracking-tight">
              Varsha<span className="text-sky-400">AI</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "text-foreground" : "text-gray-300 hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
