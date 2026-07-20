"use client";

import { useOSStore } from "@/store/useOSStore";

export default function WindyBackground() {
  const { activeLayer } = useOSStore();

  // Map our layers to Windy layers
  let overlay = "wind";
  if (activeLayer === "temperature") overlay = "temp";
  if (activeLayer === "rainfall") overlay = "rain";
  if (activeLayer === "aqi") overlay = "pm2p5";

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <iframe 
        className="w-full h-full border-none opacity-80"
        src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=5&overlay=${overlay}&product=ecmwf&level=surface&lat=22.5&lon=79&detailLat=22.5&detailLon=79&marker=true&message=true`}
        title="Windy Weather Map"
      ></iframe>
      {/* Dimmer to ensure UI remains readable on top */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
    </div>
  );
}
