import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import CookieConsent from './components/ui/CookieConsent';

import './App.css';

// Chunk load error recovery
const handleChunkError = (error: Error | undefined): boolean => {
  if (!error) return false;

  const isChunkError = error.name === 'ChunkLoadError' ||
    /Loading chunk .* failed/.test(error.message) ||
    /Failed to fetch dynamically imported module/.test(error.message);

  if (!isChunkError) return false;

  const hasReloaded = sessionStorage.getItem('chunk_error_reload');

  if (!hasReloaded) {
    sessionStorage.setItem('chunk_error_reload', '1');
    window.location.reload();
    return true;
  }

  // If already reloaded once, clear cache and try again
  sessionStorage.removeItem('chunk_error_reload');

  const hasCaches = 'caches' in window && typeof caches !== 'undefined';

  if (hasCaches) {
    caches.keys().then((keys: string[]) => {
      return Promise.all(keys.map((key: string) => caches.delete(key)));
    }).then(() => {
      window.location.reload();
    }).catch(() => {
      window.location.reload();
    });
  } else {
    window.location.reload();
  }

  return true;
};

// Global error handler to suppress ad-related "Script error." messages
if (typeof window !== 'undefined') {
  window.onerror = function (message, source, lineno, colno, error) {
    if (message === 'Script error.') {
      console.warn('Caught and suppressed ad-related script error.');
      return true; // Prevents the error from showing in the UI/overlay
    }
    return false;
  };

  window.addEventListener('unhandledrejection', function (event) {
    if (event.reason && event.reason.message && event.reason.message.includes('Script error.')) {
      event.preventDefault();
      console.warn('Caught and suppressed ad-related promise rejection.');
    }
  });

  window.addEventListener('error', function (event) {
    if (event.message === 'Script error.') {
      event.stopImmediatePropagation();
      event.preventDefault();
      console.warn('Caught and suppressed ad-related error event.');
    }
  }, true);
}

// Lazy load all page components with error recovery
const lazyWithRetry = (importFunc: () => Promise<any>) => {
  return lazy(() =>
    importFunc().catch((error) => {
      if (handleChunkError(error)) {
        // Return a promise that never resolves to prevent further rendering
        return new Promise(() => { });
      }
      throw error;
    })
  );
};

const Home = lazyWithRetry(() => import('./pages/Home'));
const Store = lazyWithRetry(() => import('./pages/Store'));
const AssetPreview = lazyWithRetry(() => import('./pages/AssetPreview'));
const AdminPanel = lazyWithRetry(() => import('./pages/AdminPanel'));
const ThumbnailEditor = lazyWithRetry(() => import('./components/editor/ThumbnailEditor'));
const PenCropEditor = lazyWithRetry(() => import('./components/editor/PenCropEditor'));


// SEO and legal pages - loaded from separate component files
const PrivacyPolicy = lazyWithRetry(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazyWithRetry(() => import('./pages/TermsOfService'));

// About component is now imported from separate file
const AboutImport = lazyWithRetry(() => import('./pages/About'));

// Contact component is now imported from separate file
const ContactImport = lazyWithRetry(() => import('./pages/Contact'));

// Blog component is now imported from separate file
const BlogImport = lazyWithRetry(() => import('./pages/Blog'));

// BlogPost component for individual blog posts
const BlogPostImport = lazyWithRetry(() => import('./pages/BlogPost'));

// FAQ component for frequently asked questions
const FAQImport = lazyWithRetry(() => import('./pages/FAQ'));

// No authentication required - all routes are public



// Main App Layout Component
const AppLayout: React.FC = () => {
  console.log('=== APP LAYOUT DEBUG ===');
  console.log('AppLayout - Component rendered');

  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';
  const lastPathRef = React.useRef(location.pathname);








  return (
    <div className="min-h-[100dvh] bg-black text-white">

      {/* Hide navbar on small screens for editor to maximize space */}
      <div className={isEditorPage ? 'hidden md:block' : ''}>
        <Navbar />
      </div>
      <div className="flex min-h-[100dvh]">
        {/* Main content */}
        <main className={`flex-1 min-h-[100dvh] ${isEditorPage ? 'pt-0 md:pt-16' : 'pt-16 lg:pr-80'}`}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[100dvh]">
                <LoadingSpinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/asset/:id" element={<AssetPreview />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/editor" element={<ThumbnailEditor />} />
              <Route path="/pen-crop" element={<PenCropEditor />} />


              {/* SEO and AdSense compliance pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about" element={<AboutImport />} />
              <Route path="/contact" element={<ContactImport />} />
              <Route path="/blog" element={<BlogImport />} />
              <Route path="/blog/:id" element={<BlogPostImport />} />
              <Route path="/faq" element={<FAQImport />} />

              {/* Catch all route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        {/* Sidebar - Hidden only on editor page */}
        {!isEditorPage && <Sidebar />}
      </div>
      {/* Footer - Hidden only on editor page */}
      {!isEditorPage && <Footer />}
      {/* <FloatingCTA /> */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
      <CookieConsent />
    </div>
  );
};

function App() {
  console.log('App - Component rendered');

  // Global error handler for unhandled chunk load errors and 3rd party script errors
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      // Handle chunk load errors
      if (handleChunkError(event.error)) {
        event.preventDefault();
        return;
      }

      // Silence generic "Script error." which usually comes from 3rd party scripts like ads
      // failing due to CORS or ad blockers. These are non-fatal for our app but trigger the CRA overlay.
      const isGenericScriptError =
        event.message === 'Script error.' ||
        (event.error === null && event.lineno === 0) ||
        (event.message && event.message.includes('Script error'));

      if (isGenericScriptError) {
        // Log it to console for debugging but prevent it from bubbling up to the error overlay
        console.warn('Suppressed 3rd party script error:', event.message || 'Script error.');
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('error', errorHandler, true); // Use capture phase to catch it early
    return () => window.removeEventListener('error', errorHandler, true);
  }, []);





  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
