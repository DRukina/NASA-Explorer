import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. This might be a temporary
              issue.
            </p>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-400 overflow-auto">
                  <div className="font-mono">{this.state.error.toString()}</div>
                  {this.state.errorInfo && (
                    <div className="mt-2 text-gray-500">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <button
                onClick={() => window.location.reload()}
                className="btn-secondary w-full"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className={`card text-center ${className}`}>
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Error Loading Data
      </h3>

      <p className="text-gray-300 mb-4">{errorMessage}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export const NetworkError: React.FC<{ onRetry?: () => void }> = ({
  onRetry,
}) => (
  <ErrorDisplay
    error="Unable to connect to NASA's servers. Please check your internet connection and try again."
    onRetry={onRetry}
  />
);

export const ApiError: React.FC<{ error: string; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => <ErrorDisplay error={`API Error: ${error}`} onRetry={onRetry} />;
