module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "primary": "#FFE65E",
        "secondary": "#558ED9",
        "tertiary": "#444"
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
