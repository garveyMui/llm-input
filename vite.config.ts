import { defineConfig } from 'vite'
import { resolve }  from 'path'
import cdn from 'vite-plugin-cdn-import'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      reactRefresh(),
      cdn({
        modules: [
          {
            name: 'react',
            var: 'React',
            path: `umd/react.production.min.js`,
          },
          {
            name: 'react-dom',
            var: 'ReactDOM',
            path: `umd/react-dom.production.min.js`,
          },
        ],
      }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LLMInput',
      fileName: 'llm-input'
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      }
    }
  },
  resolve: {
    alias: {
      'react': 'https://cdn.skypack.dev/react@19',
      'react-dom': 'https://cdn.skypack.dev/react-dom@19'
    }
  }
})
