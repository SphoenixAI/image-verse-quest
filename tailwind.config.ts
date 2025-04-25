
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom game colors
				tech: {
					primary: '#8B5CF6',    // Vivid purple
					secondary: '#7E69AB',  // Secondary purple
					accent: '#0EA5E9',     // Ocean blue
					light: '#E5DEFF',      // Soft purple
					dark: '#1A1F2C',       // Dark purple
				},
				chips: '#F97316',          // Bright orange for AI Chips currency
				rare: '#D946EF',           // Magenta pink for rare items
				common: '#33C3F0',         // Sky blue for common items
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-gentle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'drip-slow': {
					'0%': { transform: 'translateY(-100%)', opacity: '0.8' },
					'80%, 100%': { transform: 'translateY(100%)', opacity: '0' },
				},
				'drip-medium': {
					'0%': { transform: 'translateY(-100%)', opacity: '0.8' },
					'70%, 100%': { transform: 'translateY(100%)', opacity: '0' },
				},
				'drip-fast': {
					'0%': { transform: 'translateY(-100%)', opacity: '0.8' },
					'60%, 100%': { transform: 'translateY(100%)', opacity: '0' },
				},
				'shine-slide': {
					'0%': { transform: 'translateX(-100%) rotate(45deg)' },
					'50%, 100%': { transform: 'translateX(200%) rotate(45deg)' },
				},
				'color-shift': {
					'0%, 100%': { filter: 'hue-rotate(0deg)' },
					'50%': { filter: 'hue-rotate(90deg)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
				'float': 'float 5s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'drip-slow': 'drip-slow 4s ease-in infinite',
				'drip-medium': 'drip-slow 3.5s ease-in infinite 0.5s',
				'drip-fast': 'drip-slow 3s ease-in infinite 1s',
				'shine-slide': 'shine-slide 6s ease-in-out infinite',
				'color-shift': 'color-shift 10s ease-in-out infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
