'use client';

import { Component, ReactNode, ErrorInfo, ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

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
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-red-200 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-800 dark:text-red-200">Oops! Something went wrong</CardTitle>
          <CardDescription>
            {error?.message || 'An unexpected error occurred while rendering this page.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
            variant="default"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={handleGoHome}
            className="w-full"
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-xs">
              <summary className="cursor-pointer text-red-800 dark:text-red-200 font-medium">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-red-700 dark:text-red-300 whitespace-pre-wrap">
                {error.stack}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Simplified error boundary for specific sections
export interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName: string;
}

export function SectionErrorBoundary({ children, sectionName }: SectionErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            {sectionName} Unavailable
          </h3>
          <p className="text-red-600 dark:text-red-400 text-sm">
            This section encountered an error and couldn't load. Please refresh the page or try again later.
          </p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error(`Error in ${sectionName}:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
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
