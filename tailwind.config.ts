/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: ["class", "class"],
	theme: {
	  extend: {
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
		},
		animation: {
		  "accordion-down": "accordion-down 0.2s ease-out",
		  "accordion-up": "accordion-up 0.2s ease-out",
		},
		colors: {
		  sidebar: {
			DEFAULT: "hsl(var(--sidebar-background))",
			foreground: "hsl(var(--sidebar-foreground))",
			primary: "hsl(var(--sidebar-primary))",
			"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
			accent: "hsl(var(--sidebar-accent))",
			"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
			border: "hsl(var(--sidebar-border))",
			ring: "hsl(var(--sidebar-ring))",
			chart: {
			  1: "hsl(var(--chart-1))",
			  2: "hsl(var(--chart-2))",
			  3: "hsl(var(--chart-3))",
			  4: "hsl(var(--chart-4))",
			  5: "hsl(var(--chart-5))",
			},
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  