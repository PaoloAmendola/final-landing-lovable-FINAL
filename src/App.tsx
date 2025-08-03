import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAnalytics } from "@/hooks/use-analytics";
import { useAdvancedPerformance } from "@/hooks/use-advanced-performance";
import { AccessibilityEnhancer } from "@/components/ui/accessibility-enhancer";
import { AdvancedPerformanceMonitor } from "@/components/ui/advanced-performance-monitor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      }
    }
  }
});

const AppContent = () => {
  const { trackError } = useAnalytics();
  const { startMonitoring } = useAdvancedPerformance();

  React.useEffect(() => {
    startMonitoring();
  }, [startMonitoring]);

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    trackError(error, errorInfo.componentStack);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary onError={handleError}>
          <AccessibilityEnhancer 
            config={{
              enableHighContrast: true,
              enableReducedMotion: true,
              enableScreenReaderOptimizations: true,
              announcePageChanges: true
            }}
          >
            <AdvancedPerformanceMonitor 
              enableRUM={true}
              enableAlerts={process.env.NODE_ENV === 'development'}
              sampleRate={0.1}
            />
            <TooltipProvider delayDuration={200} skipDelayDuration={300}>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AccessibilityEnhancer>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <AppContent />
  </ErrorBoundary>
);

export default App;
