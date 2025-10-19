/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundOpacity: {
        3: "0.03",
        7: "0.07",
        15: "0.15",
        35: "0.35",
        95: "0.95",
      },
      colors: {
        "kalaa-orange": "#D84315",
        "kalaa-red": "#C62828",
        "kalaa-indigo": "#283593",
        "kalaa-amber": "#FFA000",
        "kalaa-cream": "#FFF8E1",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
