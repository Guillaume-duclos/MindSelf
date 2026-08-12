const plugin = require("tailwindcss/plugin");
const colors = require("./src/constants/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        "noto-serif": ["Noto Serif"],
        "public-sans": ["Public Sans"],
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".border-continuous": { borderCurve: "continuous" },
        ".border-circular": { borderCurve: "circular" },
      });
    }),
  ],
};
