module.exports = {
content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
theme: {
extend: {
colors: {
brand: {
50: '#f3fbf4',
100: '#e6f7ea',
200: '#c7efcc',
300: '#97e5a1',
400: '#59d76b',
500: '#2f9e44',
600: '#23803a',
700: '#1b5f2c',
800: '#13421b',
},
muted: {
DEFAULT: '#6b7280',
},
},
borderRadius: {
xl: '14px',
},
boxShadow: {
'soft': '0 6px 18px rgba(16,24,40,0.06)',
}
},
},
plugins: [require("tailwindcss-animate")],
};