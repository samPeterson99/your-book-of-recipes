/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "350px",
      md: "600px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        green: "#606c38",
        darkGreen: "#283618",
        cream: "#FFFDF4",
        lightBrown: "#dda15e",
        brown: "#bc6c25",
        blue: "#E1EFFE",
        purple: "#E7E1FE",
      },
    },
  },
  plugins: [],
};
