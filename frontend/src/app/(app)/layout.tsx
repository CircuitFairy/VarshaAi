"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/os/AppSidebar";
import { TopBar } from "@/components/os/TopBar";
import { Footer } from "@/components/os/Footer";
import { DevConsole } from "@/components/os/DevConsole";

export default function OSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 flex bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex-1 overflow-hidden relative"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <Footer />
        <DevConsole />
      </div>
    </div>
  );
}
