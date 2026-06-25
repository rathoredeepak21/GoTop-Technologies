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
          darkest: '#05070c',
          darker: '#080c14',
          dark: '#0d1321',
          card: 'rgba(13, 19, 33, 0.45)',
          border: 'rgba(59, 130, 246, 0.15)',
        },
        neon: {
          blue: '#00d2ff',
          indigo: '#4f46e5',
          accent: '#3b82f6',
        }
      },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(0, 210, 255, 0.25)',
        'neon-border': '0 0 10px rgba(59, 130, 246, 0.15)',
        'neon-strong': '0 0 30px rgba(0, 210, 255, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'radial-neon': 'radial-gradient(circle at center, rgba(0, 210, 255, 0.15) 0%, transparent 70%)',
        'grid-pattern': "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
