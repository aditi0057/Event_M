/** @type {import('tailwindcss').Config} */
import { withUt } from 'uploadthing/tw';

module.exports = withUt({
  darkMode: ['class'], // Enable dark mode support if needed
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include app folder for Next.js 13+
    './src/**/*.{js,ts,jsx,tsx}', // Include src folder if applicable
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          500: '#624CF5', // From original config
          50: '#F6F8FD', // From original config
          DEFAULT: '#624CF5', // From original config
          foreground: 'hsl(var(--primary-foreground))', // From original config
        },
        coral: {
          500: '#15BF59', // From original config
        },
        grey: {
          600: '#545454', // From original config
          500: '#757575', // From original config
          400: '#AFAFAF', // From original config
          50: '#F6F6F6', // From original config
        },
        black: '#000000', // From original config
        white: '#FFFFFF', // From original config
        border: 'hsl(var(--border))', // From original config
        input: 'hsl(var(--input))', // From original config
        ring: 'hsl(var(--ring))', // From original config
        foreground: 'hsl(var(--foreground))', // From original config
        secondary: {
          DEFAULT: 'hsl(var(--secondary))', // From original config
          foreground: 'hsl(var(--secondary-foreground))', // From original config
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))', // From original config
          foreground: 'hsl(var(--destructive-foreground))', // From original config
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))', // From original config
          foreground: 'hsl(var(--muted-foreground))', // From original config
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))', // From original config
          foreground: 'hsl(var(--accent-foreground))', // From original config
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))', // From original config
          foreground: 'hsl(var(--popover-foreground))', // From original config
        },
        card: {
          DEFAULT: 'hsl(var(--card))', // From original config
          foreground: 'hsl(var(--card-foreground))', // From original config
        },
        // secondary: '#3B82F6', // Lighter Blue for dashboard
        background: '#F3F4F6', // Light Gray for dashboard
      },
      backgroundImage: {
        'dotted-pattern': "url('/assets/images/dotted-pattern.png')", // From original config
        'hero-img': "url('/assets/images/hero.png')", // From original config
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'], // From original config
      },
      borderRadius: {
        lg: 'var(--radius)', // From original config
        md: 'calc(var(--radius) - 2px)', // From original config
        sm: 'calc(var(--radius) - 4px)', // From original config
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
});
