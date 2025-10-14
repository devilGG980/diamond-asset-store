import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import './App.css';

// Lazy load all page components
const Home = lazy(() => import('./pages/Home'));
const Store = lazy(() => import('./pages/Store'));
const AssetPreview = lazy(() => import('./pages/AssetPreview'));
const FastAdsPage = lazy(() => import('./pages/FastAdsPage'));
const QuickAds = lazy(() => import('./pages/QuickAds'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const LoginTest = lazy(() => import('./pages/LoginTest'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ThumbnailEditor = lazy(() => import('./components/editor/ThumbnailEditor'));

// Auth pages
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));

// SEO and AdSense compliance pages
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));


// Main App Layout Component
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      {/* Removed DiamondBalance from here since it's now in the Navbar */}
      <div className="flex min-h-screen">
        {/* Main content */}
        <main className={`flex-1 min-h-screen pt-12 md:pt-0 ${
          isEditorPage ? '' : 'md:pr-80'
        }`}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/store" element={<Store />} />
              <Route path="/asset/:id" element={<AssetPreview />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ads" element={<FastAdsPage />} />
              <Route path="/quick-ads" element={<QuickAds />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login-test" element={<LoginTest />} />
              <Route path="/editor" element={<ThumbnailEditor />} />

              {/* Auth pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* SEO and AdSense compliance pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />

            </Routes>
          </Suspense>
        </main>
        {/* Sidebar - Hidden on editor page */}
        {!isEditorPage && <Sidebar />}
      </div>
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
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;