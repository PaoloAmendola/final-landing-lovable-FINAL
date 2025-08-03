import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React ecosystem
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI components chunk
          ui: [
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast'
          ],
          
          // Animation and utilities chunk
          utils: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          
          // Form handling chunk
          forms: ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    },
    
    // Optimize bundle size
    target: 'esnext',
    minify: 'esbuild',
    
    // CSS optimization
    cssMinify: 'esbuild',
    
    // Generate source maps for production debugging
    sourcemap: false,
    
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Asset optimization
    assetsInlineLimit: 4096
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ]
  }
}));
