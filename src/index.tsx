import React from 'react';
import ReactDOM from 'react-dom/client';
import GlobalErrorBoundary from './GlobalErrorBoundary';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>
);

// Disable custom service worker to prevent stale caches causing black screen.
// Also actively unregister any existing service workers that might be controlling the page.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((r) => r.unregister())))
      .then(() => {
        // Clear all Cache Storage entries that might hold old files
        if ('caches' in window) {
          return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
        }
      })
      .then(() => {
        // One-time hard reload to ensure fresh assets after unregister+cache clear
        if (!sessionStorage.getItem('cache_cleared')) {
          sessionStorage.setItem('cache_cleared', '1');
          window.location.reload();
        }
      })
      .catch(() => { /* no-op */ });
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
