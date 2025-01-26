/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 如果需要自定义颜色，可以在这里添加
        "blue-500": "#3b82f6",
        "blue-600": "#2563eb",
      },
      spacing: {
        // 这里是你自定义的宽度/高度配置
        72: "18rem",
      },
      boxShadow: {
        // 自定义阴影
        lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
