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
          // Core framework - critical path
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Query and state management
          'vendor-query': ['@tanstack/react-query'],
          
          // Essential UI framework (consolidated to reduce chunks)
          'vendor-ui-core': [
            '@radix-ui/react-slot',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-label',
            '@radix-ui/react-select'
          ],
          
          // Secondary UI components (consolidated)
          'vendor-ui-extended': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-toast'
          ],
          
          // Animation and interactions
          'vendor-animation': ['framer-motion'],
          
          // Utilities (consolidated)
          'vendor-utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'lucide-react'],
          
          // Specialized features (lazy-loaded)
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-charts': ['recharts'],
          'vendor-misc': ['sonner', 'vaul', 'cmdk', 'date-fns', 'input-otp', 'embla-carousel-react', 'react-day-picker', 'next-themes', 'react-resizable-panels'],
          
          // Backend
          'vendor-supabase': ['@supabase/supabase-js']
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
