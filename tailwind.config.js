/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB", // Warm Sand (aligned)
        primary: "#FFFFFF",    // Pure white surfaces
        accent: "#0070F3",     // Signature Blue
        dark: "#111827",       // Deep Slate
        sand: "#F9FAFB",       // Warm Sand
        cyan: "#00C2FF",       // Electric Cyan
        coral: "#FF6B6B",      // Soft Coral (errors only)
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Grotesk"', 'sans-serif'],
        drama: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
