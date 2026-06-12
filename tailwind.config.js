/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          container: "rgb(var(--color-primary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-primary-fixed) / <alpha-value>)",
          "fixed-dim": "rgb(var(--color-primary-fixed-dim) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          container: "rgb(var(--color-secondary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-secondary-fixed) / <alpha-value>)",
          "fixed-dim": "rgb(var(--color-secondary-fixed-dim) / <alpha-value>)",
        },
        tertiary: {
          DEFAULT: "rgb(var(--color-tertiary) / <alpha-value>)",
          container: "rgb(var(--color-tertiary-container) / <alpha-value>)",
          fixed: "rgb(var(--color-tertiary-fixed) / <alpha-value>)",
          "fixed-dim": "rgb(var(--color-tertiary-fixed-dim) / <alpha-value>)",
        },
        background: "rgb(var(--color-background) / <alpha-value>)",
        "on-background": "rgb(var(--color-on-background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          dim: "rgb(var(--color-surface-dim) / <alpha-value>)",
          bright: "rgb(var(--color-surface-bright) / <alpha-value>)",
          container: {
            lowest: "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
            low: "rgb(var(--color-surface-container-low) / <alpha-value>)",
            DEFAULT: "rgb(var(--color-surface-container) / <alpha-value>)",
            high: "rgb(var(--color-surface-container-high) / <alpha-value>)",
            highest: "rgb(var(--color-surface-container-highest) / <alpha-value>)",
          }
        },
        "on-surface": {
          DEFAULT: "rgb(var(--color-on-surface) / <alpha-value>)",
          variant: "rgb(var(--color-on-surface-variant) / <alpha-value>)",
        },
        outline: {
          DEFAULT: "rgb(var(--color-outline) / <alpha-value>)",
          variant: "rgb(var(--color-outline-variant) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
          container: "rgb(var(--color-error-container) / <alpha-value>)",
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      spacing: {
        "stack-xs": "4px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "stack-xl": "64px",
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
      },
      borderRadius: {
        DEFAULT: "var(--radius-default)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "9999px",
      },
      boxShadow: {
        "glass-sm": "0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "glass-md": "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        "glass-lg": "0 8px 32px -4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)",
      }
    },
  },
  plugins: [],
}
