"use client";

import React from "react";
import { useLaunch } from "./LaunchTransitionProvider";

interface LaunchButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function LaunchButton({ href, children, className, ...props }: LaunchButtonProps) {
  const { startLaunch } = useLaunch();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startLaunch(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
