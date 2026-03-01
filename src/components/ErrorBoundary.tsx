import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary - Catch JavaScript errors anywhere in child component tree
 * Prevents entire app from crashing when one component fails
 * 
 * @example
 * <ErrorBoundary>
 *   <ProductGrid />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      console.error('Error caught by boundary:', error, errorInfo);
    } else {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert">
          <style>{`
            .error-boundary {
              min-height: 50vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              text-align: center;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .error-boundary h2 {
              color: #dc2626;
              margin-bottom: 1rem;
              font-size: 1.5rem;
            }
            .error-boundary p {
              color: #6b7280;
              margin-bottom: 1.5rem;
              max-width: 400px;
            }
            .error-boundary button {
              background: #c4a35a;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-size: 1rem;
              cursor: pointer;
              transition: background 0.2s;
            }
            .error-boundary button:hover {
              background: #b8944f;
            }
            .error-details {
              margin-top: 2rem;
              padding: 1rem;
              background: #f3f4f6;
              border-radius: 0.5rem;
              text-align: left;
              max-width: 600px;
              overflow: auto;
            }
            .error-details pre {
              margin: 0;
              font-size: 0.875rem;
              color: #374151;
            }
          `}</style>
          <h2>Something went wrong</h2>
          <p>
            We're sorry, but something unexpected happened. 
            Please try refreshing the page.
          </p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="error-details">
              <pre>{this.state.error.toString()}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
