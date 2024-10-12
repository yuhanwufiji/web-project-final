import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
  base: './', // Ensure this matches your deployment environment
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),    // Main entry point
        overlay: resolve(__dirname, 'overlay.html'),
        hotpot: resolve(__dirname, 'hotpot.html'), 
        model: resolve(__dirname, 'poster.html'), 

      },
      output: {
        // Manually split chunks, separate large dependencies
        manualChunks: {
          vendor: ['three'], // Example: pack three.js separately
        },
      },
    },
    // Adjust chunk size warning limit
    chunkSizeWarningLimit: 1000, // Increase this value as needed
  },
});
