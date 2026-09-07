import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center bg-[#021812] text-amber-200">
          <h2 className="text-xl font-bold font-serif mb-2">Arabians Shopping Zone</h2>
          <p className="text-sm text-slate-300 mb-4">Something encountered a hiccup. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg hover:brightness-110 transition"
          >
            Reload Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
