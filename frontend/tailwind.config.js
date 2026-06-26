/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          darkest: '#F8FAFC',
          darker: '#FFFFFF',
          dark: '#F1F5F9',
          card: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(15, 23, 42, 0.08)',
        },
        neon: {
          blue: '#F97316',
          indigo: '#0F172A',
          accent: '#1E293B',
        }
      },
      boxShadow: {
        'neon-glow': '0 10px 30px -10px rgba(249, 115, 22, 0.2), 0 1px 3px rgba(249, 115, 22, 0.1)',
        'neon-border': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 8px -1px rgba(15, 23, 42, 0.03)',
        'neon-strong': '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.02)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'radial-neon': 'radial-gradient(circle at center, rgba(249, 115, 22, 0.05) 0%, transparent 75%)',
        'grid-pattern': "linear-gradient(rgba(15, 23, 42, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.02) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
