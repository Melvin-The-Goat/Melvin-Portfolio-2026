import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-8">
          <div className="max-w-md text-center border border-cyan-500/30 bg-white/5 p-8 rounded-lg">
            <h1 className="text-xl font-black uppercase tracking-tight text-[#0EA5E9] mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Try refreshing the page. If the problem continues, your browser may need WebGL enabled for 3D content.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#0EA5E9] text-black font-bold uppercase text-sm rounded hover:opacity-90"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
