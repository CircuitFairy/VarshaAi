export type UnitSystem = "metric" | "imperial";

export function formatTemp(celsius: number | string, system: UnitSystem = "metric"): string {
  const c = typeof celsius === "string" ? parseFloat(celsius) : celsius;
  if (isNaN(c)) return "0.0";
  
  if (system === "imperial") {
    // °C to °F
    const f = (c * 9/5) + 32;
    return f.toFixed(1);
  }
  return c.toFixed(1);
}

export function formatTempUnit(system: UnitSystem = "metric"): string {
  return system === "imperial" ? "°F" : "°C";
}

export function formatPrecip(mm: number | string, system: UnitSystem = "metric"): string {
  const m = typeof mm === "string" ? parseFloat(mm) : mm;
  if (isNaN(m)) return "0.0";

  if (system === "imperial") {
    // mm to inches
    const inches = m / 25.4;
    return inches.toFixed(2);
  }
  return m.toFixed(1);
}

export function formatPrecipUnit(system: UnitSystem = "metric"): string {
  return system === "imperial" ? "in" : "mm";
}

export function formatWind(kmh: number | string, system: UnitSystem = "metric"): string {
  const k = typeof kmh === "string" ? parseFloat(kmh) : kmh;
  if (isNaN(k)) return "0";

  if (system === "imperial") {
    // km/h to mph
    const mph = k * 0.621371;
    return Math.round(mph).toString();
  }
  return Math.round(k).toString();
}

export function formatWindUnit(system: UnitSystem = "metric"): string {
  return system === "imperial" ? "mph" : "km/h";
}
