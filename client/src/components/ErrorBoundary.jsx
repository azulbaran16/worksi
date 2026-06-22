import { Component } from "react";

// Catches render errors anywhere below it and shows a friendly fallback
// instead of a blank white screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
          </span>
          <h1 className="mt-5 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 max-w-md text-muted">
            We hit an unexpected error. Please reload the page — if it keeps happening, let us know.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a href="/" className="btn-outline">Go home</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
