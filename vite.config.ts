import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { configDefaults } from 'vitest/config'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    build: {
        // Optimize bundle splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'utils': ['zustand', 'loglevel'],
                    '@chakra-ui': [
                        '@chakra-ui/react',],
                    // Split each feature into its own chunk for better code splitting
                    'chunk-rewrite': ['./src/features/chunk-rewrite'],
                    'chunk-search': ['./src/features/chunk-search'],
                    'chunk-bookmark': ['./src/features/chunk-bookmark'],
                    'chunk-copy': ['./src/features/chunk-copy'],
                    'chunk-evaluation': ['./src/features/chunk-evaluation'],
                    'chunk-explanation': ['./src/features/chunk-explanation'],
                    'chunk-image': ['./src/features/chunk-image'],
                    'chunk-merge': ['./src/features/chunk-merge'],
                    'chunk-note': ['./src/features/chunk-note'],
                    'chunk-position': ['./src/features/chunk-position'],
                    'chunk-shared': ['./src/features/chunk-shared'],
                    'review-features': ['./src/features/review'],
                }
            },
            // Better tree shaking - especially important for icons
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
                tryCatchDeoptimization: false
            },
        },
        // Increase chunk size warning limit since you have a large app
        chunkSizeWarningLimit: 600,
        // Optimize source maps for faster builds
        sourcemap: false, // Set to 'inline' for debugging if needed
        // Better minification
        minify: 'esbuild',
        target: 'esnext'
    },
    // Optimize dependencies
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@mui/material',
            'zustand'
        ],
        exclude: [
            // Exclude test dependencies from optimization
            '@testing-library/react',
            '@testing-library/jest-dom',
            '@vitest/ui'
        ]
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: "./setup-test.ts",
        exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    },
})
