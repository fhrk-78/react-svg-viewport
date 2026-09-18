import react from '@vitejs/plugin-react'
import dts from 'unplugin-dts/vite'

import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({
    tsconfigPath: './tsconfig.app.json',
    include: ['./src/index.ts', './src/components/SVGViewport.tsx']
  })],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ReactSVGViewport',
      fileName: 'react-svg-viewport',
      formats: ['es', 'umd']
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    }
  }
})
