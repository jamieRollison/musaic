import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Dynamically generate entry points
const pagesDir = path.resolve(__dirname, 'src/pages')
const entries = fs.readdirSync(pagesDir).reduce((acc, dir) => {
  const entry = path.resolve(pagesDir, dir, 'index.html')
  if (fs.existsSync(entry)) {
    acc[dir] = entry
  } 
  return acc
}, {}) 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: entries,
    },
  },
})
