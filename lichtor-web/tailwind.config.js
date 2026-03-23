/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,jsx}',
        './src/components/**/*.{js,jsx}',
        './src/app/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: { DEFAULT: '#0066CC', dark: '#004C99', light: '#3399FF' },
                secondary: { DEFAULT: '#00A86B', dark: '#008755' },
                accent: '#F59E0B',
                dark: { DEFAULT: '#1a1a2e', light: '#2d2d3f' },
                admin: { primary: '#6366f1', 'primary-dark': '#4f46e5' },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
