import React from 'react';

interface State {
  hasError: boolean;
  error?: any;
}

export default class GlobalErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('Global error caught:', error, info);
  }

  handleClearCaches = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      sessionStorage.clear();
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to clear caches', e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16 }} className="min-h-screen bg-black text-white">
          <div className="max-w-2xl mx-auto p-4 border border-red-700 rounded-md bg-red-900/20">
            <h1 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h1>
            <p className="mb-4 text-gray-200">The app crashed. This commonly happens when an old cache or service worker conflicts with new files, or when a route/component throws at runtime.</p>
            <button onClick={this.handleClearCaches} className="btn-primary mb-4">Clear caches and reload</button>
            <pre className="whitespace-pre-wrap text-xs bg-gray-900 p-3 rounded border border-gray-700 overflow-auto max-h-96">
{String(this.state.error?.stack || this.state.error || 'Unknown error')}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}