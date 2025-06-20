import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { configDefaults } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Optimize bundle splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks
                    'mui': ['@mui/material', '@mui/icons-material', '@mui/lab'],
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'utils': ['zustand', 'loglevel'],
                    // Separate your chunks feature since it's large
                    'chunks-tools': [
                        './src/features/chunks/tools',
                        './src/features/chunks/layouts'
                    ]
                }
            }
        },
        // Increase chunk size warning limit since you have a large app
        chunkSizeWarningLimit: 600,
        // Optimize source maps for faster builds
        sourcemap: false // Set to 'inline' for debugging if needed
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/setupTests.ts',
        exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    },
})
