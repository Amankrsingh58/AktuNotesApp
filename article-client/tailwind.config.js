/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary))",
        "primary-foreground": "rgb(var(--color-primary-foreground))",
        secondary: "rgb(var(--color-secondary))",
        "secondary-foreground": "rgb(var(--color-secondary-foreground))",
        accent: "rgb(var(--color-accent))",
        "accent-foreground": "rgb(var(--color-accent-foreground))",
        background: "rgb(var(--color-background))",
        foreground: "rgb(var(--color-foreground))",
        card: "rgb(var(--color-card))",
        "card-foreground": "rgb(var(--color-card-foreground))",
        popover: "rgb(var(--color-popover))",
        "popover-foreground": "rgb(var(--color-popover-foreground))",
        muted: "rgb(var(--color-muted))",
        "muted-foreground": "rgb(var(--color-muted-foreground))",
        border: "rgb(var(--color-border))",
        input: "rgb(var(--color-input))",
        ring: "rgb(var(--color-ring))",
        success: "rgb(var(--color-success))",
        "success-foreground": "rgb(var(--color-success-foreground))",
        error: "rgb(var(--color-error))",
        "error-foreground": "rgb(var(--color-error-foreground))",
        warning: "rgb(var(--color-warning))",
        "warning-foreground": "rgb(var(--color-warning-foreground))",
        destructive: "rgb(var(--color-destructive))",
        "destructive-foreground": "rgb(var(--color-destructive-foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
  plugins: [],
};
