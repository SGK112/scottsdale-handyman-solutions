import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      react({
        // Fix React 18 compatibility issues
        fastRefresh: process.env.NODE_ENV !== 'production',
        include: "**/*.{jsx,tsx}",
      })
    ],

    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3002',
          changeOrigin: true,
          secure: false
        }
      },
      host: true, // Allow external connections
      port: 5173,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils'),
      },
    },

    build: {
      target: 'es2020',
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Better chunk splitting to avoid conflicts
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react'
              }
              if (id.includes('@radix-ui')) {
                return 'vendor-ui'
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons'
              }
              return 'vendor'
            }
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'date-fns',
        'clsx'
      ],
      exclude: [
        '@radix-ui/react-slot',
        'react/jsx-dev-runtime',
        'react/jsx-runtime'
      ], // Exclude problematic packages
      force: true // Force re-optimization
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
    }
  }
})
