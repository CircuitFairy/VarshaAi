import { create } from "zustand";
import { StateData, Region, indianLocations } from "@/lib/locations";
import { fetchLiveWeather, fetchPrediction, fetchHistoricalData, LiveWeatherData, PredictionData, HistoricalData } from "@/lib/api";

// ============================================================
// Types
// ============================================================

export type MapLayer = "satellite" | "temperature" | "rainfall" | "wind" | "aqi";
export type TimelineMode = "historical" | "live" | "predictive";
export type AlertFocus = "cyclone" | "rain" | "aqi" | null;

export interface SimulationParams {
  tempAnomaly: number;
  precipVariance: number;
  seaLevelRise: number;
}

export interface SimulationResult {
  id: number;
  floodRisk: string;
  droughtRisk: string;
  calculatedTempOffset: number;
  calculatedRainMultiplier: number;
}

interface OSState {
  // Navigation
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Location
  selectedState: StateData;
  selectedDistrict: Region | null;
  setSelectedLocation: (stateName: string, districtName?: string) => void;

  // Map
  activeLayer: MapLayer;
  setActiveLayer: (layer: MapLayer) => void;
  predictionTimeHorizon: string;
  setPredictionTimeHorizon: (horizon: string) => void;

  // Alert Focus & Animations
  activeAlert: AlertFocus;
  activeAlertCoordinates: { lat: number; lon: number } | null;
  activeAlertState: string | null;
  setActiveAlert: (alert: AlertFocus, coords?: { lat: number; lon: number } | null, stateName?: string | null) => void;

  // Data Layers (toggles)
  layerToggles: { precipitation: boolean; thermal: boolean; aqi: boolean };
  toggleDataLayer: (layer: keyof OSState["layerToggles"]) => void;

  // Timeline
  timelineMode: TimelineMode;
  timelinePosition: number; // 0-100
  isPlayingTimeline: boolean;
  setTimelineMode: (mode: TimelineMode) => void;
  setTimelinePosition: (pos: number) => void;
  toggleTimelinePlayback: () => void;

  // Emergency & Export Modals
  emergencyProtocolActive: boolean;
  setEmergencyProtocol: (active: boolean) => void;
  exportCurrentData: () => void;

  // Live Data
  liveWeatherData: LiveWeatherData | null;
  predictionData: PredictionData | null;
  historicalData: HistoricalData[];
  isLoading: boolean;
  error: string | null;
  fetchDataForLocation: (stateName: string, districtName?: string) => Promise<void>;

  // Simulation
  simulationParams: SimulationParams;
  setSimulationParams: (params: Partial<SimulationParams>) => void;
  resetSimulation: () => void;
  simulationData: SimulationResult | null;
  setSimulationData: (data: SimulationResult | null) => void;
  simulationStateName: string | null;
  setSimulationStateName: (name: string | null) => void;

  // Right panel (Digital Twin)
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;

  // Global Settings
  darkMode: boolean;
  setDarkMode: (active: boolean) => void;
  unitSystem: "metric" | "imperial";
  setUnitSystem: (system: "metric" | "imperial") => void;
  devMode: boolean;
  setDevMode: (active: boolean) => void;

  // Extra Settings Data
  dataSources: { id: string; name: string; active: boolean; status: string }[];
  toggleDataSource: (id: string) => void;
  apiKeys: { id: string; key: string; name: string; created: string; lastUsed: string }[];
  generateApiKey: (name: string) => void;
  revokeApiKey: (id: string) => void;
  securitySettings: { e2e: boolean; mfa: boolean; auditLog: boolean };
  toggleSecuritySetting: (setting: keyof OSState["securitySettings"]) => void;
}

// ============================================================
// Store
// ============================================================

export const useOSStore = create<OSState>((set, get) => ({
  // Navigation
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // Location — default to first location
  selectedState: indianLocations[0],
  selectedDistrict: null,

  setSelectedLocation: (stateName, districtName) => {
    const s = indianLocations.find((loc) => loc.state === stateName) || indianLocations[0];
    const d = districtName ? s.regions.find((r) => r.name === districtName) || s.regions[0] : s.regions[0];
    set({ selectedState: s, selectedDistrict: d, rightPanelOpen: true });
    get().fetchDataForLocation(s.state, d?.name);
  },

  // Map
  activeLayer: "satellite",
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  predictionTimeHorizon: "24 Hours",
  setPredictionTimeHorizon: (horizon) => set({ predictionTimeHorizon: horizon }),

  // Alert Focus & Map Animation Effects
  activeAlert: null,
  activeAlertCoordinates: null,
  activeAlertState: null,
  setActiveAlert: (alert, coords, stateName) => {
    set({ activeAlert: alert, activeAlertCoordinates: coords || null, activeAlertState: stateName || null });
    if (alert === "cyclone") {
      set({ activeLayer: "wind" });
    } else if (alert === "rain") {
      set({ activeLayer: "rainfall" });
    } else if (alert === "aqi") {
      set({ activeLayer: "aqi" });
    }
  },

  // Data Layers
  layerToggles: { precipitation: true, thermal: false, aqi: true },
  toggleDataLayer: (layer) =>
    set((s) => ({
      layerToggles: { ...s.layerToggles, [layer]: !s.layerToggles[layer] },
    })),

  // Timeline
  timelineMode: "live",
  timelinePosition: 50,
  isPlayingTimeline: false,
  setTimelineMode: (mode) => set({ timelineMode: mode }),
  setTimelinePosition: (pos) => set({ timelinePosition: pos }),
  toggleTimelinePlayback: () => set((s) => ({ isPlayingTimeline: !s.isPlayingTimeline })),

  // Emergency & Export
  emergencyProtocolActive: false,
  setEmergencyProtocol: (active) => set({ emergencyProtocolActive: active }),
  exportCurrentData: () => {
    const state = get();
    const payload = {
      timestamp: new Date().toISOString(),
      location: {
        state: state.selectedState.state,
        district: state.selectedDistrict?.name || "All",
        lat: state.selectedDistrict?.lat || 20.5937,
        lon: state.selectedDistrict?.lon || 78.9629,
      },
      liveWeather: state.liveWeatherData,
      prediction: state.predictionData,
      simulationParams: state.simulationParams,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VarshaAI_Telemetry_${state.selectedState.state}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Live Data
  liveWeatherData: null,
  predictionData: null,
  historicalData: [],
  isLoading: false,
  error: null,

  fetchDataForLocation: async (stateName, districtName) => {
    set({ isLoading: true, error: null });
    try {
      const s = indianLocations.find((loc) => loc.state === stateName) || indianLocations[0];
      const d = districtName
        ? s.regions.find((r) => r.name === districtName) || s.regions[0]
        : s.regions[0];

      const lat = d ? d.lat : s.regions[0]?.lat || 20.5937;
      const lon = d ? d.lon : s.regions[0]?.lon || 78.9629;

      const [weather, prediction, historical] = await Promise.allSettled([
        fetchLiveWeather(s.state, d?.name || "Unknown", lat, lon),
        fetchPrediction(s.state, d?.name || "Unknown", lat, lon, get().predictionTimeHorizon),
        fetchHistoricalData(s.state, d?.name),
      ]);

      set({
        liveWeatherData: weather.status === "fulfilled" ? weather.value : null,
        predictionData: prediction.status === "fulfilled" ? prediction.value : null,
        historicalData: historical.status === "fulfilled" ? historical.value : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch location data:", error);
      set({ isLoading: false, error: "Failed to fetch data" });
    }
  },

  // Simulation Engine
  simulationParams: {
    tempAnomaly: 0,
    precipVariance: 0,
    seaLevelRise: 0,
  },
  setSimulationParams: (params) =>
    set((state) => ({
      simulationParams: { ...state.simulationParams, ...params },
    })),
  resetSimulation: () =>
    set({
      simulationParams: { tempAnomaly: 0, precipVariance: 0, seaLevelRise: 0 },
      simulationData: null,
    }),
  simulationData: null,
  setSimulationData: (data) => set({ simulationData: data }),
  simulationStateName: null,
  setSimulationStateName: (name) => set({ simulationStateName: name }),

  // Right panel
  rightPanelOpen: true,
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),

  // Global Settings
  darkMode: true,
  setDarkMode: (active) => set({ darkMode: active }),
  unitSystem: "metric",
  setUnitSystem: (system) => set({ unitSystem: system }),
  devMode: false,
  setDevMode: (active) => set({ devMode: active }),

  // Extra Settings Data
  dataSources: [
    { id: "isro", name: "ISRO Cartosat-3", active: true, status: "SYNCED" },
    { id: "noaa", name: "NOAA GOES-16", active: true, status: "SYNCED" },
    { id: "imd", name: "IMD Ground Radars", active: true, status: "SYNCED" },
    { id: "sentinel", name: "Copernicus Sentinel-2", active: false, status: "OFFLINE" }
  ],
  toggleDataSource: (id) => set((s) => ({
    dataSources: s.dataSources.map(ds => ds.id === id ? { ...ds, active: !ds.active, status: !ds.active ? "SYNCED" : "OFFLINE" } : ds)
  })),
  
  apiKeys: [
    { id: "key-1", name: "Production App", key: "vk_prod_8f92j...4k9", created: "2026-01-15", lastUsed: "Today" }
  ],
  generateApiKey: (name) => set((s) => ({
    apiKeys: [...s.apiKeys, { 
      id: `key-${Date.now()}`, 
      name, 
      key: `vk_test_${Math.random().toString(36).substring(2, 10)}`, 
      created: "Today", 
      lastUsed: "Never" 
    }]
  })),
  revokeApiKey: (id) => set((s) => ({
    apiKeys: s.apiKeys.filter(k => k.id !== id)
  })),
  
  securitySettings: { e2e: true, mfa: true, auditLog: false },
  toggleSecuritySetting: (setting) => set((s) => ({
    securitySettings: { ...s.securitySettings, [setting]: !s.securitySettings[setting] }
  }))
}));
