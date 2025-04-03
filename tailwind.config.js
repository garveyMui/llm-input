/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-500": "#3b82f6",
        "blue-600": "#2563eb",
      },
      spacing: {
        72: "18rem",
      },
      boxShadow: {
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
