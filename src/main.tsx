import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register optimized service worker - Simplified and efficient
if ('serviceWorker' in navigator && 'production' === import.meta.env.MODE) {
  window.addEventListener('load', async () => {
    try {
      // Simple check for existing registration
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) return;
      
      // Register new service worker
      await navigator.serviceWorker.register('/sw-advanced.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
    } catch (error) {
      // Silent failure in production
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
