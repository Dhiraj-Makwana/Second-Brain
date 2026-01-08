/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          200: "#9d99f1",
          500: "#756ee9",
          600: "#5046d5",
        },
        gray: {
          200: "#FFFFFF",
          500: "#656d79",
          600: "#141c2b",
        },
      },
    },
  },
  plugins: [],
};
