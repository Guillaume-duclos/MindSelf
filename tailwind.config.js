const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
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
