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
      treeshake: true,
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
            '@radix-ui/react-toast',
            '@radix-ui/react-label',
            '@radix-ui/react-slot'
          ],
          
          // Animation and utilities chunk
          utils: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          
          // Form handling chunk
          forms: ['react-hook-form', '@hookform/resolvers', 'zod']
        },
        
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name === 'vendor') return '[name].[hash].js';
          if (name === 'ui') return '[name].[hash].js';
          return '[name]-[hash].js';
        },
        
        // Optimize asset naming
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Optimize bundle size
    target: 'es2020',
    minify: 'esbuild',
    
    // CSS optimization
    cssMinify: 'esbuild',
    
    // Generate source maps for production debugging
    sourcemap: mode === 'development',
    
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Asset optimization - inline smaller assets
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
