import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    })
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        top: path.resolve(__dirname, "src", "clientTop.tsx"),
        todos: path.resolve(__dirname, "src", "clientTodos.tsx"),
        signup: path.resolve(__dirname, "src", "clientSignup.tsx"),
        login: path.resolve(__dirname, "src", "clientLogin.tsx"),
      },
      output: {
        entryFileNames: chunk => `${chunk.name}.bundle.js`,
        dir: path.resolve(__dirname, "bundle"),
      },
    },
  }
})
