import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
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
                    'mui-core': ['@mui/material'],
                    'mui-icons': ['@mui/icons-material'],
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
                // This helps exclude unused MUI icons that aren't in our custom bundle
                if (id.includes('@mui/icons-material') && !id.includes('src/components/icons')) {
                    return false; // Let bundler handle it (will be tree-shaken)
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
            // Only include specific icons we use
            '@mui/icons-material/ArrowBack',
            '@mui/icons-material/Search',
            '@mui/icons-material/Clear',
            '@mui/icons-material/Delete',
            '@mui/icons-material/CompareArrows',
            '@mui/icons-material/PhotoFilter',
            '@mui/icons-material/Notes',
            '@mui/icons-material/ContentCut',
            '@mui/icons-material/QuestionMark',
            '@mui/icons-material/ExpandMore',
            '@mui/icons-material/ExpandLess',
            '@mui/icons-material/FileUpload',
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
