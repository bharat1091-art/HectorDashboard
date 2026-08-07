import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        rajdhani: [
          "Rajdhani",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
        bebas: [
          "Bebas Neue",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "sans-serif",
        ],
      },
      colors: {
        neon: {
          DEFAULT: "hsl(var(--neon))",
          dim: "hsl(var(--neon-dim))",
        },
        glass: "rgba(217, 217, 217, 0.36)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "lightning-flash": {
          "0%, 92%, 100%": { opacity: "0" },
          "93%": { opacity: "0.9" },
          "94%": { opacity: "0.1" },
          "95%": { opacity: "0.8" },
          "96%": { opacity: "0" },
        },
        "rain-fall": {
          "0%": { backgroundPosition: "0 -200px" },
          "100%": { backgroundPosition: "0 1000px" },
        },
        "cloud-drift": {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(10%)" },
        },
        "twinkle": {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        "snow-fall": {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh)", opacity: "0.4" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "blur(8px)" },
          "50%": { opacity: "1", filter: "blur(14px)" },
        },
        "sun-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.06)", opacity: "0.85" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "lightning-flash": "lightning-flash 7s ease-in-out infinite",
        "rain-fall": "rain-fall 0.6s linear infinite",
        "cloud-drift": "cloud-drift 40s ease-in-out infinite alternate",
        "cloud-drift-slow": "cloud-drift 70s ease-in-out infinite alternate",
        twinkle: "twinkle 3s ease-in-out infinite",
        "snow-fall": "snow-fall 8s linear infinite",
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "sun-pulse": "sun-pulse 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
