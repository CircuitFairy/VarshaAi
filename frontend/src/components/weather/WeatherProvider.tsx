"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type WeatherState = "CLEAR" | "RAIN" | "THUNDERSTORM" | "DROUGHT" | "SNOW";

interface WeatherContextProps {
  weather: WeatherState;
  setWeather: (state: WeatherState) => void;
}

const WeatherContext = createContext<WeatherContextProps>({
  weather: "CLEAR",
  setWeather: () => {},
});

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherState>("CLEAR");

  return (
    <WeatherContext.Provider value={{ weather, setWeather }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
