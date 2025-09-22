/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                yeti: {
                    blue: {
                        light: '#6A9AC4',
                        main: '#34688C',
                        dark: '#A9D6E5'
                    },
                    green: {
                        light: '#7DAB8B',
                        dark: '#4A7D5C'
                    },
                    brown: {
                        light: '#8B4513',
                        main: '#D2B48C',
                        dark: '#4F3A2C'
                    },
                    neutral: {
                        white: '#F8F8F8',
                        gray: '#333333'
                    }
                }
            },
            fontFamily: {
                'yeti': ['Inter', 'system-ui', 'sans-serif']
            }
        },
    },
    plugins: [],
}
