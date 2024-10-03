/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "media", // or 'class' if you prefer manual toggling
  theme: {
    extend: {
      colors: {
        background: "#F1F1F1",
        container: "#FFFFFF",
        "container-secondary": "#000",
        "light-greyscale": "#d4d4d4",
        "medium-greyscale": "#737373",
        "dark-greyscale": "#1D1D1F",
        primary: "#306FdB",
        secondary: "#10B981",
        tertiary: "#",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        "nuclear-1": "url('/images/nuclear_1.jpg')",
      },
    },
  },
  plugins: [],
};
