import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center space-y-4">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-black italic uppercase text-[#EC4899]">SYSTEM ERROR</h1>
            <p className="text-gray-400 font-mono text-sm">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#0EA5E9] text-white font-bold uppercase italic hover:bg-[#0EA5E9]/80 transition-colors"
            >
              RELOAD SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
