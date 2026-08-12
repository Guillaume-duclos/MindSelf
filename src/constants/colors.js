// Single source of truth for the app's hardcoded design colors. Consumed by
// tailwind.config.js (so each name below becomes a className, e.g.
// `bg-cream-50`, `text-ink`, `border-terracotta-400`) and importable directly
// wherever a raw color string is needed (LinearGradient, tintColor, SVG
// fill, the widget, etc.) — kept as plain JS (not .ts) so tailwind.config.js
// can `require()` it without a build step.
//
// `ink` originally existed as two near-identical browns (#291C1A, #2A2015)
// scattered across the app; they've been unified into this single token.
module.exports = {
  cream: {
    50: "#FAF3EF", // main screen background
    100: "#FFF4F2", // gradient start, paired with cream-300
    200: "#F7E6DF", // light surface / chip background
    300: "#EFD5C9", // gradient end, paired with cream-100
  },
  terracotta: {
    100: "#F7D4C6", // incomplete activity dot
    200: "#F7B194", // completed activity dot
    300: "#F7A07C", // like/heart icon tint
    400: "#F07E56", // selected theme border accent
    500: "#BA6A56", // uppercase label text
    600: "#C9663D", // deep/active accent (astral sign picker)
  },
  ink: "#291C1A", // primary text / icon tint
  taupe: "#CBC4C1", // card drop-shadow color
  sky: {
    400: "#3C9FFE", // gradient start (animated icon)
    600: "#0274DF", // gradient end (animated icon)
  },
  splash: "#208AEF", // splash screen background
  androidIconBg: "#E6F4FE", // Android adaptive icon background
  success: "#68D278", // liked/success state icon tint
  placeholder: "#00000088", // text input placeholder (black, ~53% alpha)
};
