export const brands = {
  car: [
    "Rolls-Royce",
    "Bentley",
    "Lamborghini",
    "Bugatti",
    "Aston Martin",
    "Ferrari",
    "McLaren",
    "Porsche",
    "Mercedes-AMG",
    "BMW M",
  ],
  motorcycle: ["Ducati", "Kawasaki", "BMW", "MV Agusta", "Aprilia", "KTM", "Harley-Davidson", "Indian"],
  boat: ["Azimut", "Riva", "Pershing", "Ferretti", "Sunseeker", "Princess", "Benetti", "Lurssen"],
};

export const locations = [
  "Beverly Hills, CA",
  "Monaco",
  "London, UK",
  "Dubai, UAE",
  "Miami, FL",
  "Geneva, Switzerland",
  "Tokyo, Japan",
  "Paris, France",
  "New York, NY",
  "Singapore",
  "Hong Kong",
  "Sydney, Australia",
];

export const priceRanges = [
  { label: "Under $100K", value: "0-100000" },
  { label: "$100K - $500K", value: "100000-500000" },
  { label: "$500K - $1M", value: "500000-1000000" },
  { label: "$1M - $5M", value: "1000000-5000000" },
  { label: "Over $5M", value: "5000000-999999999" },
];

export const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export const luxuryBrands = [
  { name: "Bugatti", icon: "🏎️" },
  { name: "Brabus", icon: "🚗" },
  { name: "Mansory", icon: "✨" },
  { name: "Porsche", icon: "🏁" },
  { name: "Audi", icon: "🔷" },
  { name: "Ferrari", icon: "🐎" },
  { name: "Lamborghini", icon: "🐂" },
  { name: "McLaren", icon: "🧡" },
  { name: "Rolls-Royce", icon: "👑" },
  { name: "Bentley", icon: "🦅" },
  { name: "Aston Martin", icon: "🗡️" },
  { name: "Mercedes-AMG", icon: "⭐" },
];
