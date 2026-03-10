/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        grid: "grid 15s linear infinite",
        aurora: "aurora 60s linear infinite",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) infinite linear",
        "marquee-scroll": "marquee-scroll var(--marquee-duration) linear infinite",
        "marquee-reverse": "marquee-scroll var(--marquee-duration) linear infinite reverse",
        shine: "shine var(--duration) infinite linear",
      },
      keyframes: {
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "marquee-scroll": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        shine: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
      colors: {
        // === Blue-gray theme (new) ===
        background: "#F8FAFC",       // slate-50 — page background
        surface: "#FFFFFF",           // white — cards, containers
        surfaceAlt: "#F1F5F9",       // slate-100 — alternating sections
        text: "#0F172A",              // slate-900 — primary text
        textMuted: "#64748B",         // slate-500 — secondary text
        textLight: "#94A3B8",         // slate-400 — tertiary text
        accent: "#0066E0",            // brand blue (darkened from #0070F3 for WCAG AA contrast)
        cyan: "#00C2FF",              // electric cyan
        coral: "#FF6B6B",             // soft coral (errors only)

        // Accent opacity variants
        "accent-wash": "rgba(0,112,243,0.04)",
        "accent-light": "rgba(0,112,243,0.05)",
        "accent-medium": "rgba(0,112,243,0.10)",
        "accent-border": "rgba(0,112,243,0.08)",
        "accent-border-strong": "rgba(0,112,243,0.15)",

        // Backward-compat aliases (prevents existing pages from breaking)
        dark: "#0F172A",              // was #111827, now matches text
        primary: "#FFFFFF",           // was #FFFFFF, unchanged
        sand: "#F8FAFC",              // was #F9FAFB, now matches background

        // shadcn CSS variable tokens (for Magic UI components)
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["Satoshi", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"Space Grotesk"', "sans-serif"],
        drama: ['"Playfair Display"', "serif"],
        quote: ['"Cormorant Garamond"', "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
