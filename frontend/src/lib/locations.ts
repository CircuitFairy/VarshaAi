export interface Region {
  name: string;
  lat: number;
  lon: number;
}

export interface StateData {
  state: string;
  regions: Region[];
}

export const indianLocations: StateData[] = [
  {
    state: "Andhra Pradesh",
    regions: [
      { name: "North Coastal (Visakhapatnam)", lat: 17.6868, lon: 83.2185 },
      { name: "South Coastal (Vijayawada)", lat: 16.5062, lon: 80.6480 },
      { name: "Rayalaseema (Tirupati)", lat: 13.6288, lon: 79.4192 }
    ]
  },
  {
    state: "Arunachal Pradesh",
    regions: [
      { name: "Itanagar", lat: 27.0844, lon: 93.6053 },
      { name: "Tawang", lat: 27.5861, lon: 91.8661 }
    ]
  },
  {
    state: "Assam",
    regions: [
      { name: "Brahmaputra Valley (Guwahati)", lat: 26.1445, lon: 91.7362 },
      { name: "Barak Valley (Silchar)", lat: 24.8333, lon: 92.7789 },
      { name: "Upper Assam (Dibrugarh)", lat: 27.4728, lon: 94.9120 }
    ]
  },
  {
    state: "Bihar",
    regions: [
      { name: "North Bihar (Muzaffarpur)", lat: 26.1209, lon: 85.3647 },
      { name: "Central Bihar (Patna)", lat: 25.5941, lon: 85.1376 },
      { name: "South Bihar (Gaya)", lat: 24.7914, lon: 85.0002 }
    ]
  },
  {
    state: "Chhattisgarh",
    regions: [
      { name: "Central (Raipur)", lat: 21.2514, lon: 81.6296 },
      { name: "North (Ambikapur)", lat: 23.1196, lon: 83.1952 },
      { name: "South (Bastar/Jagdalpur)", lat: 19.0760, lon: 82.0228 }
    ]
  },
  {
    state: "Goa",
    regions: [
      { name: "North Goa (Panaji)", lat: 15.4909, lon: 73.8278 },
      { name: "South Goa (Margao)", lat: 15.2736, lon: 73.9583 }
    ]
  },
  {
    state: "Gujarat",
    regions: [
      { name: "Central (Ahmedabad)", lat: 23.0225, lon: 72.5714 },
      { name: "Saurashtra (Rajkot)", lat: 22.3039, lon: 70.8022 },
      { name: "South (Surat)", lat: 21.1702, lon: 72.8311 },
      { name: "Kutch (Bhuj)", lat: 23.2420, lon: 69.6669 }
    ]
  },
  {
    state: "Haryana",
    regions: [
      { name: "North (Ambala)", lat: 30.3752, lon: 76.7821 },
      { name: "Central (Rohtak)", lat: 28.8955, lon: 76.5892 },
      { name: "South (Gurugram)", lat: 28.4595, lon: 77.0266 }
    ]
  },
  {
    state: "Himachal Pradesh",
    regions: [
      { name: "Shimla", lat: 31.1048, lon: 77.1734 },
      { name: "Kangra (Dharamshala)", lat: 32.2190, lon: 76.3234 },
      { name: "Kullu-Manali", lat: 32.2396, lon: 77.1887 }
    ]
  },
  {
    state: "Jharkhand",
    regions: [
      { name: "Central (Ranchi)", lat: 23.3441, lon: 85.3096 },
      { name: "East (Jamshedpur)", lat: 22.8046, lon: 86.2029 },
      { name: "North (Dhanbad)", lat: 23.7915, lon: 86.4304 }
    ]
  },
  {
    state: "Karnataka",
    regions: [
      { name: "South Interior (Bengaluru)", lat: 12.9716, lon: 77.5946 },
      { name: "North Interior (Hubli)", lat: 15.3647, lon: 75.1240 },
      { name: "Coastal (Mangaluru)", lat: 12.9141, lon: 74.8560 }
    ]
  },
  {
    state: "Kerala",
    regions: [
      { name: "South (Thiruvananthapuram)", lat: 8.5241, lon: 76.9366 },
      { name: "Central (Kochi)", lat: 9.9312, lon: 76.2673 },
      { name: "North (Kozhikode)", lat: 11.2588, lon: 75.7804 }
    ]
  },
  {
    state: "Madhya Pradesh",
    regions: [
      { name: "Central (Bhopal)", lat: 23.2599, lon: 77.4126 },
      { name: "Malwa (Indore)", lat: 22.7196, lon: 75.8577 },
      { name: "Mahakoshal (Jabalpur)", lat: 23.1815, lon: 79.9864 },
      { name: "Gwalior Region", lat: 26.2124, lon: 78.1772 }
    ]
  },
  {
    state: "Maharashtra",
    regions: [
      { name: "Konkan (Mumbai)", lat: 19.0760, lon: 72.8777 },
      { name: "Western (Pune)", lat: 18.5204, lon: 73.8567 },
      { name: "Vidarbha (Nagpur)", lat: 21.1458, lon: 79.0882 },
      { name: "Marathwada (Aurangabad)", lat: 19.8762, lon: 75.3433 },
      { name: "North Maharashtra (Nashik)", lat: 20.0110, lon: 73.7903 }
    ]
  },
  {
    state: "Manipur",
    regions: [
      { name: "Imphal Valley", lat: 24.8170, lon: 93.9368 }
    ]
  },
  {
    state: "Meghalaya",
    regions: [
      { name: "Shillong", lat: 25.5788, lon: 91.8933 },
      { name: "Cherrapunji", lat: 25.2702, lon: 91.7323 }
    ]
  },
  {
    state: "Mizoram",
    regions: [
      { name: "Aizawl", lat: 23.7271, lon: 92.7176 }
    ]
  },
  {
    state: "Nagaland",
    regions: [
      { name: "Kohima", lat: 25.6751, lon: 94.1086 },
      { name: "Dimapur", lat: 25.8620, lon: 93.7262 }
    ]
  },
  {
    state: "Odisha",
    regions: [
      { name: "Coastal (Bhubaneswar)", lat: 20.2961, lon: 85.8245 },
      { name: "North (Balasore)", lat: 21.4883, lon: 86.9248 },
      { name: "South (Berhampur)", lat: 19.3149, lon: 84.7941 },
      { name: "Western (Sambalpur)", lat: 21.4669, lon: 83.9812 }
    ]
  },
  {
    state: "Punjab",
    regions: [
      { name: "Majha (Amritsar)", lat: 31.6340, lon: 74.8723 },
      { name: "Doaba (Jalandhar)", lat: 31.3260, lon: 75.5762 },
      { name: "Malwa (Ludhiana)", lat: 30.9010, lon: 75.8573 }
    ]
  },
  {
    state: "Rajasthan",
    regions: [
      { name: "East (Jaipur)", lat: 26.9124, lon: 75.7873 },
      { name: "West (Jodhpur)", lat: 26.2389, lon: 73.0243 },
      { name: "South (Udaipur)", lat: 24.5854, lon: 73.7125 },
      { name: "North (Bikaner)", lat: 28.0229, lon: 73.3119 }
    ]
  },
  {
    state: "Sikkim",
    regions: [
      { name: "East (Gangtok)", lat: 27.3389, lon: 88.6065 }
    ]
  },
  {
    state: "Tamil Nadu",
    regions: [
      { name: "North (Chennai)", lat: 13.0827, lon: 80.2707 },
      { name: "West (Coimbatore)", lat: 11.0168, lon: 76.9558 },
      { name: "Central (Tiruchirappalli)", lat: 10.7905, lon: 78.7047 },
      { name: "South (Madurai)", lat: 9.9252, lon: 78.1198 }
    ]
  },
  {
    state: "Telangana",
    regions: [
      { name: "Central (Hyderabad)", lat: 17.3850, lon: 78.4867 },
      { name: "North (Warangal)", lat: 18.0001, lon: 79.5882 },
      { name: "South (Mahbubnagar)", lat: 16.7431, lon: 78.0076 }
    ]
  },
  {
    state: "Tripura",
    regions: [
      { name: "Agartala", lat: 23.8315, lon: 91.2868 }
    ]
  },
  {
    state: "Uttar Pradesh",
    regions: [
      { name: "Central (Lucknow)", lat: 26.8467, lon: 80.9462 },
      { name: "West (Noida/Meerut)", lat: 28.5355, lon: 77.3910 },
      { name: "East (Varanasi)", lat: 25.3176, lon: 82.9739 },
      { name: "Bundelkhand (Jhansi)", lat: 25.4484, lon: 78.5685 }
    ]
  },
  {
    state: "Uttarakhand",
    regions: [
      { name: "Garhwal (Dehradun)", lat: 30.3165, lon: 78.0322 },
      { name: "Kumaon (Nainital)", lat: 29.3919, lon: 79.4542 }
    ]
  },
  {
    state: "West Bengal",
    regions: [
      { name: "South (Kolkata)", lat: 22.5726, lon: 88.3639 },
      { name: "North (Siliguri)", lat: 26.7271, lon: 88.3953 },
      { name: "West (Asansol)", lat: 23.6739, lon: 86.9524 }
    ]
  },
  // UTs
  {
    state: "Andaman and Nicobar",
    regions: [
      { name: "Port Blair", lat: 11.6234, lon: 92.7265 }
    ]
  },
  {
    state: "Chandigarh",
    regions: [
      { name: "Chandigarh", lat: 30.7333, lon: 76.7794 }
    ]
  },
  {
    state: "Delhi",
    regions: [
      { name: "New Delhi", lat: 28.6139, lon: 77.2090 }
    ]
  },
  {
    state: "Jammu and Kashmir",
    regions: [
      { name: "Jammu Region", lat: 32.7266, lon: 74.8570 },
      { name: "Kashmir Valley (Srinagar)", lat: 34.0837, lon: 74.7973 }
    ]
  },
  {
    state: "Ladakh",
    regions: [
      { name: "Leh", lat: 34.1526, lon: 77.5771 }
    ]
  }
];
