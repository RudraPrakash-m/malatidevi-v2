/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5176,
    allowedHosts: true
  },        
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@services': path.resolve(__dirname, './src/services'),
      '@config': path.resolve(__dirname, './src/config'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('node_modules')) {
  //           if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
  //             return 'vendor-react';
  //           }
  //           if (id.includes('@mui')) {
  //             return 'vendor-mui';
  //           }
  //           if (id.includes('material-react-table')) {
  //             return 'vendor-mrt';
  //           }
  //           if (id.includes('jspdf') || id.includes('exceljs') || id.includes('file-saver')) {
  //             return 'vendor-export';
  //           }
  //           return 'vendor-libs';
  //         }
  //       }
  //     }
  //   }
  // },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./src/vitest.setup.ts'],
  //   include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  //   coverage: {
  //     provider: 'v8',
  //     reporter: ['text', 'json', 'html', 'lcov', 'text-summary'],
  //     include: ['src/**/*.{ts,tsx}'],
  //     exclude: ['src/**/*.d.ts', 'src/main.tsx', 'src/vite-env.d.ts'],
  //   },
  // },
  // server:{
  //   host:"192.168.3.126"
  // }
})
