import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalErrorBoundary from './GlobalErrorBoundary';
import './index.css';
import App from './App';
import './firebase'; // Initialize Firebase
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Suppress "Script error." and GTM/AdBlocker network errors globally
if (typeof window !== 'undefined') {
  // Suppress script errors
  const originalError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    if (message === 'Script error.') return true;
    if (originalError) return originalError.apply(window, [message, source, lineno, colno, error]);
    return false;
  };

  // Suppress unhandled rejections from GTM/Extensions (Failed to fetch)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    if (error && error.message && error.message.includes('Failed to fetch')) {
      const stack = error.stack || '';
      // Check if it's from GTM or a Chrome Extension (AdBlocker)
      if (stack.includes('chrome-extension://') || stack.includes('googletagmanager')) {
        event.preventDefault(); // Stop the red overlay
        console.warn('Suppressed GTM/Extension fetch error:', error);
      }
    }
  });
}

root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker for PWA capabilities and Caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Performance monitoring with Web Vitals
reportWebVitals((metric) => {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
});
