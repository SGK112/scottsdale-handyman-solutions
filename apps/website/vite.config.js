import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    },
    build: {
        // Enable minification and compression
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        // Optimize chunk sizes
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Vendor libraries
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor'
                        }
                        if (id.includes('@stripe')) {
                            return 'stripe'
                        }
                        if (id.includes('lucide-react')) {
                            return 'icons'
                        }
                        return 'vendor'
                    }
                    // Large application chunks
                    if (id.includes('ChatbotWidget.jsx')) {
                        return 'chatbot'
                    }
                },
                // Optimize file names for caching
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        // Enable source maps for production debugging
        sourcemap: false,
        // Asset inlining threshold
        assetsInlineLimit: 4096
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react'],
        exclude: ['@stripe/stripe-js']
    }
})
