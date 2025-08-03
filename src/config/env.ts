// Environment configuration for production deployment
export const ENV_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "https://xnexfhgtqlryfkyuvihq.supabase.co",
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZXhmaGd0cWxyeWZreXV2aWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzA5NzAsImV4cCI6MjA2Nzc0Njk3MH0.QzBc3y6LXIeHbeOoYska42YS26l7DEpiRAM7Hrko-7w",
  
  // Analytics Configuration
  GTM_ID: import.meta.env.VITE_GTM_ID || "GTM-KZW3RTWD",
  GA_ID: import.meta.env.VITE_GA_ID || "G-SC9C7W6Q4F",
  
  // Application Configuration
  APP_URL: import.meta.env.VITE_APP_URL || "https://nivela.bembeauty.com.br",
  ENVIRONMENT: import.meta.env.MODE || "production",
  
  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== "false",
  ENABLE_SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER !== "false",
} as const;

// Type safety for environment variables
export type EnvConfig = typeof ENV_CONFIG;