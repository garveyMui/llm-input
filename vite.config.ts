import { defineConfig } from "vite";
import { resolve } from "path";
import cdn from "vite-plugin-cdn-import";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import react from '@vitejs/plugin-react';
import tailwindcss from "tailwindcss";
// https://vite.dev/config/
export default defineConfig({
  test:{
    globals: true, // 允许全局 expect、describe 等
    environment: 'jsdom', // 用于测试 React 组件，默认是 'node'
    setupFiles: './setupTests.ts', // 可选：添加测试设置文件
    coverage: { // 可选：添加代码覆盖率
      reporter: ['text', 'json', 'html'],
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer, // 示例插件
        tailwindcss,
      ],
    },
  },
  plugins: [
    react(),
    cdn({
      modules: [
        {
          name: "react",
          var: "React",
          path: `umd/react.production.min.js`,
        },
        {
          name: "react-dom",
          var: "ReactDOM",
          path: `umd/react-dom.production.min.js`,
        },
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "LLMInput",
      fileName: "llm-input",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      // 'react': 'https://cdn.skypack.dev/react@19',
      // 'react-dom': 'https://cdn.skypack.dev/react-dom@19',
      "@": "/src",
    },
  },
});
