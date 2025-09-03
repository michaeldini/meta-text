import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { configDefaults } from 'vitest/config'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ command }) => ({
    plugins: [
        react(),
        tsconfigPaths(),
        // command === 'build' ? visualizer({ open: true }) : null
    ].filter(Boolean),
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
                    'react-vendor': ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
                    'utils': ['zustand', 'loglevel', 'ky'],
                    '@chakra-ui': ['@chakra-ui/react',],
                    'react-icons': ['react-icons/hi2'],
                    'react-query': ['@tanstack/react-query'],
                    // Split each feature into its own chunk for better code splitting
                    'document-features': [
                        './src/features/chunk-rewrite',
                        './src/features/chunk-search',
                        './src/features/chunk-bookmark',
                        './src/features/chunk-copy',
                        './src/features/chunk-evaluation',
                        './src/features/chunk-explanation',
                        './src/features/chunk-image',
                        './src/features/chunk-merge',
                        './src/features/chunk-note',
                        './src/features/review',
                    ],
                }
            },
            // Better tree shaking
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
                tryCatchDeoptimization: false
            },
        },
        chunkSizeWarningLimit: 500,
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
            'chakra-ui/react',
            'zustand',
            '@tanstack/react-query',
            'ky',
        ],
        exclude: [
            // Exclude test dependencies from optimization
            '@testing-library/react',
            '@testing-library/jest-dom',
            '@vitest/ui'
        ]
    },
    server: {
        // host: true, // for local dev
        // port: 5173, // for local dev
        // hmr: { host: '192.168.1.177' }, // for local dev
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
        setupFiles: "src/setup-test.ts",
        exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    },
}))
