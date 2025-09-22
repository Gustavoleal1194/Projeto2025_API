/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Azuis Gelados (Yeti & Montanhas)
                'yeti-sky-light': '#A9D6E5',
                'yeti-sky-medium': '#6A9AC4',
                'yeti-ice-dark': '#34688C',

                // Verdes Naturais (Sabedoria & Frescor)
                'forest-sage': '#7DAB8B',
                'forest-dark': '#4A7D5C',

                // Marrons Terrosos (Aconchego & Livros)
                'book-saddle': '#8B4513',
                'paper-beige': '#D2B48C',
                'wood-dark': '#4F3A2C',

                // Neutros (Base & Contraste)
                'ice-white': '#F8F8F8',
                'charcoal': '#333333',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'bounce-in': 'bounceIn 0.6s ease-out',
                'snow-fall': 'snowFall 20s linear infinite',
                'book-flip': 'bookFlip 0.6s ease-in-out',
                'mountain-glow': 'mountainGlow 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                snowFall: {
                    '0%': { transform: 'translateY(-100px)', opacity: '0' },
                    '10%': { opacity: '1' },
                    '90%': { opacity: '1' },
                    '100%': { transform: 'translateY(100vh)', opacity: '0' },
                },
                bookFlip: {
                    '0%': { transform: 'rotateY(0deg)' },
                    '50%': { transform: 'rotateY(180deg)' },
                    '100%': { transform: 'rotateY(360deg)' },
                },
                mountainGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
                },
            },
            backgroundImage: {
                'yeti-gradient': 'linear-gradient(135deg, #2C5F2D 0%, #1E3A8A 50%, #F4E4C1 100%)',
                'mountain-gradient': 'linear-gradient(180deg, #E0F2FE 0%, #3B82F6 50%, #1E3A8A 100%)',
                'forest-gradient': 'linear-gradient(135deg, #059669 0%, #2C5F2D 50%, #F4E4C1 100%)',
                'book-gradient': 'linear-gradient(135deg, #8B4513 0%, #D2B48C 100%)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
