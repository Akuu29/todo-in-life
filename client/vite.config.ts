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
    manifest: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        top: path.resolve(__dirname, "dev-server/template", "index.html"),
        todos: path.resolve(__dirname, "dev-server/template", "todos.html"),
        login: path.resolve(__dirname, "dev-server/template", "login.html"),
        signup: path.resolve(__dirname, "dev-server/template", "signup.html"),
      },
      output: {
        entryFileNames: chunk => `${chunk.name}.bundle.js`,
        dir: path.resolve(__dirname, "bundle"),
      },
    },
  }
})
