/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xxs: { min: "250px" },
      ...defaultTheme.screens,
    },
    extend: {},
  },
  plugins: [],
};
