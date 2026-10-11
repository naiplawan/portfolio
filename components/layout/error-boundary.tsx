'use client';

import { Component, ReactNode, ErrorInfo, ComponentType } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error?: Error; reset: () => void }> | ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log to external error reporting service in production
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // You can integrate with services like Sentry here
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      // If fallback is a function (component), render it with props
      if (typeof fallback === 'function') {
        const FallbackComponent = fallback as ComponentType<{ error?: Error; reset: () => void }>;
        return <FallbackComponent error={this.state.error} reset={this.reset} />;
      }

      // Otherwise, if it's a ReactNode, render it directly
      if (fallback) {
        return <>{fallback}</>;
      }

      // Default fallback
      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="container-premium section-padding">
      <p className="section-label mb-6 border-t border-foreground pt-3">Something went wrong</p>
      <h1 className="max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] leading-none tracking-tight">
        This page hit an unexpected error.
      </h1>
      <p className="mt-8 max-w-lg text-lg text-muted-foreground">
        {error?.message || 'An unexpected error occurred while rendering this page.'}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-background transition-opacity hover:opacity-85"
        >
          Try again
        </button>
        <a href="/" className="ed-link">
          Go home
        </a>
      </div>
      {process.env.NODE_ENV === 'development' && error && (
        <details className="mt-12 max-w-3xl">
          <summary className="section-label cursor-pointer">Error details (development)</summary>
          <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-xs text-muted-foreground">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

// Client-side error boundary wrapper for Next.js app directory
export function ClientErrorBoundary({
  children,
  fallback,
  onError,
}: {
  children: ReactNode;
  fallback?: ComponentType<{ error?: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
