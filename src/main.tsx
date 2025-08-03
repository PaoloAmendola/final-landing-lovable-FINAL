import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register advanced service worker - with duplicate prevention
if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
  window.addEventListener('load', async () => {
    try {
      // Check if SW is already registered
      const existing = await navigator.serviceWorker.getRegistration('/');
      
      if (existing) {
        if (import.meta.env.DEV) {
          console.log('[SW] Service Worker already registered');
        }
        return;
      }
      
      // Register new advanced service worker
      const registration = await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/'
      });
      
      if (import.meta.env.DEV) {
        console.log('[SW] Advanced Service Worker registered successfully', registration);
      }
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        if (import.meta.env.DEV) {
          console.log('[SW] New service worker version found');
        }
      });
      
    } catch (error) {
      console.error('[SW] Service Worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
