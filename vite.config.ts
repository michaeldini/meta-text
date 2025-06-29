import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { configDefaults } from 'vitest/config'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Optimize bundle splitting
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks
                    'mui-core': ['@mui/material'],
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'utils': ['zustand', 'loglevel'],
                    // Separate your chunks feature since it's large
                    'chunks-tools': [
                        './src/features/chunks/tools',
                        './src/features/chunks/layouts'
                    ]
                }
            },
            // Better tree shaking - especially important for icons
            treeshake: {
                moduleSideEffects: false,
                propertyReadSideEffects: false,
                tryCatchDeoptimization: false
            },
            // Exclude unused icon imports
            external: (id) => {
                // Exclude unused Heroicons imports - new format
                if (id.includes('@heroicons/react/24/')) {
                    return false; // Include these in the bundle since we use them
                }
                return false;
            }
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
        setupFiles: './src/setupTests.ts',
        exclude: [...configDefaults.exclude, 'tests/e2e/**'],
    },
    resolve: {
        alias: {
            utils: path.resolve(__dirname, 'src/utils'),
            hooks: path.resolve(__dirname, 'src/hooks'),
            components: path.resolve(__dirname, 'src/components'),
            features: path.resolve(__dirname, 'src/features'),
            pages: path.resolve(__dirname, 'src/pages'),
            constants: path.resolve(__dirname, 'src/constants'),
        },
    },
})
