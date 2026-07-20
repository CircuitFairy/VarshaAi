const API_BASE = "http://localhost:8000/api/v1";

export interface LiveWeatherData {
  state: string;
  district: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  rainfall: number;
  aqi: number;
  health_score: number;
  health_status: string;
  flood_risk: string;
  heatwave_risk: string;
}

export interface FeatureImportance {
  feature: string;
  weight: number;
}

export interface HistoricalData {
  year: number;
  avg_temp: number;
  total_rainfall: number;
  extreme_weather_events: number;
}

export interface PredictionData {
  id?: number;
  state: string;
  district: string;
  time_horizon: string;
  predicted_rainfall: number;
  predicted_temp: number;
  heatwave_risk: string;
  confidence: number;
  feature_importance?: Record<string, number>;
  created_at?: string;
}

export const fetchLiveWeather = async (state: string, district: string, lat: number, lon: number): Promise<LiveWeatherData> => {
  const res = await fetch(`${API_BASE}/live-weather?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    throw new Error("Failed to fetch live weather");
  }
  return res.json();
};

export const fetchPrediction = async (state: string, district: string, lat: number, lon: number, time_horizon: string = "24 Hours"): Promise<PredictionData> => {
  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state,
      district,
      lat,
      lon,
      time_horizon,
    })
  });
  
  if (!res.ok) throw new Error('Failed to fetch prediction');
  return res.json();
};

export interface SimulationResponse {
  id: number;
  temp_offset: number;
  rainfall_multiplier: number;
  humidity_offset: number;
  wind_multiplier: number;
  flood_risk: string;
  drought_risk: string;
  created_at?: string;
}

export const runSimulationAPI = async (
  temp_offset: number,
  rainfall_multiplier: number,
  humidity_offset: number,
  wind_multiplier: number
): Promise<SimulationResponse> => {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      temp_offset,
      rainfall_multiplier,
      humidity_offset,
      wind_multiplier
    })
  });
  
  if (!res.ok) throw new Error('Failed to run simulation');
  return res.json();
};

export const fetchHistoricalData = async (state: string, district?: string): Promise<HistoricalData[]> => {
  let url = `${API_BASE}/historical?state=${encodeURIComponent(state)}`;
  if (district) {
    url += `&district=${encodeURIComponent(district)}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) {
    console.error("Failed to fetch historical data, using fallback.");
    return [];
  }
  
  return res.json();
};

// ============================================================
// Live Weather Alerts
// ============================================================

export interface AlertLocation {
  name: string;
  state: string;
  zone: string;
  lat: number;
  lon: number;
}

export interface AlertData {
  type: string;
  category: string;
  severity: number;
  title: string;
  description: string;
  metric_label: string;
  metric_value: string;
  secondary_label: string;
  secondary_value: string;
  color: string;
  location: AlertLocation;
  timestamp: string;
  source: string;
}

export interface AlertsResponse {
  timestamp: string;
  total_alerts: number;
  monitoring_stations: number;
  data_source: string;
  alerts: AlertData[];
}

export const fetchAlerts = async (): Promise<AlertsResponse> => {
  const res = await fetch(`${API_BASE}/alerts`);
  if (!res.ok) {
    throw new Error("Failed to fetch alerts");
  }
  return res.json();
};

// ============================================================
// Local Area News Feed (Webz.io API Lite)
// ============================================================

const WEBZ_API_KEY = "36cce35d-82d8-4250-a58c-654f828a9761";

export interface NewsArticle {
  id: string;
  source: string;
  title: string;
  time: string;
}

export const fetchLocalNews = async (state: string, district: string | null, condition: string): Promise<NewsArticle[]> => {
  let conditionQuery = "weather OR climate";
  if (condition === "flood") conditionQuery = "flood OR rain OR monsoon OR waterlogging";
  else if (condition === "heat") conditionQuery = "heatwave OR drought OR temperature OR power";
  else if (condition === "cyclone") conditionQuery = "cyclone OR storm OR wind OR evacuation";

  const locationQuery = district ? `(${state} OR ${district})` : state;
  const q = `${locationQuery} AND (${conditionQuery})`;
  
  try {
    const res = await fetch(`https://api.webz.io/newsApiLite?token=${WEBZ_API_KEY}&q=${encodeURIComponent(q)}&size=3`);
    if (!res.ok) return [];
    const data = await res.json();
    
    if (data && data.posts) {
      return data.posts.map((post: any, idx: number) => {
        const pubDate = new Date(post.published);
        const now = new Date();
        const diffMs = Math.max(0, now.getTime() - pubDate.getTime());
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        
        let timeStr = `${diffHrs}h ago`;
        if (diffHrs === 0) {
          const diffMins = Math.floor(diffMs / (1000 * 60));
          timeStr = `${diffMins}m ago`;
        } else if (diffHrs > 24) {
          timeStr = `${Math.floor(diffHrs / 24)}d ago`;
        }

        return {
          id: post.uuid || String(idx),
          source: post.thread.site || "Local News",
          title: post.title || (post.text && post.text.substring(0, 50) + "...") || "Breaking News",
          time: timeStr
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch news", error);
    return [];
  }
};
