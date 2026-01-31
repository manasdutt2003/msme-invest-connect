/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                // Premium Fintech Palette (Dark Mode Base)
                brand: {
                    dark: '#0f172a', // Slate 900
                    card: '#1e293b', // Slate 800
                    primary: '#6366f1', // Indigo 500
                    secondary: '#8b5cf6', // Violet 500
                    accent: '#38bdf8', // Sky 400
                    success: '#10b981', // Emerald 500
                    warning: '#f59e0b', // Amber 500
                    danger: '#ef4444', // Red 500
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
