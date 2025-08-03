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
        return;
      }
      
      // Register new advanced service worker
      const registration = await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/'
      });
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        // Service worker update detected
      });
      
    } catch (error) {
      // Only log SW errors in development
      if (import.meta.env.DEV) {
        console.error('[SW] Service Worker registration failed:', error);
      }
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
