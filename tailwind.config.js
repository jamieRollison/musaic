/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        valence: "#55c667ff",
        danceability: "#39568cff",
        energy: "#287d8eff",
        acousticness: "#b8de29ff",
        tempo: "#481567ff",
        speechiness: "#fde725ff",
      },
    },
    fontFamily: {
      default: ["Plus Jakarta Sans", "sans-serif"],
      other: ["Baskerville", "serif"],
    },
  },
  plugins: [],
};
