"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="h-10 flex-shrink-0 bg-muted/60 border-t border-border/30 flex items-center justify-between px-6 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="VarshaAI Logo" className="h-4 w-4 object-contain opacity-75" />
        <span className="font-display font-bold text-foreground">
          Varsha<span className="text-primary">AI</span>
        </span>
        <span className="text-border ml-2">|</span>
        <span className="ml-1">© 2026 VarshaAI Planetary Systems. All Rights Reserved.</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/ethics" className="hover:text-foreground transition-colors font-medium">
          Ethics & Transparency
        </Link>
        <Link href="/data-sources" className="hover:text-foreground transition-colors font-medium">
          Data Sources
        </Link>
        <Link href="/api-docs" className="hover:text-foreground transition-colors font-medium">
          API Documentation
        </Link>
        <Link href="/legal" className="hover:text-foreground transition-colors font-medium">
          Legal
        </Link>
      </div>
    </footer>
  );
}
