/**
 * Ultimate Contest Radar - Error Boundary with Retry Logic
 * Advanced error handling with user-friendly fallbacks and recovery options
 */

import { motion } from 'framer-motion';
import { AlertCircle,AlertTriangle, Bug, Database, Home, RefreshCw, Wifi } from 'lucide-react';
import type { ErrorInfo, ReactNode } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'section';
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  errorId: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  private maxRetries = 3;
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError && this.state.error) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging (in production, this would go to a logging service)
    console.group(`🚨 Error Boundary Caught Error (${this.state.errorId})`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
  }

  override componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      errorId: '',
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  getErrorType = (error: Error): { type: string; icon: ReactNode; color: string } => {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return {
        type: 'Network Error',
        icon: <Wifi className='h-5 w-5' />,
        color: 'text-orange-600',
      };
    }

    if (message.includes('database') || message.includes('sql') || message.includes('db')) {
      return {
        type: 'Database Error',
        icon: <Database className='h-5 w-5' />,
        color: 'text-red-600',
      };
    }

    if (message.includes('validation') || message.includes('invalid') || message.includes('parse')) {
      return {
        type: 'Validation Error',
        icon: <AlertCircle className='h-5 w-5' />,
        color: 'text-yellow-600',
      };
    }

    return {
      type: 'Application Error',
      icon: <Bug className='h-5 w-5' />,
      color: 'text-red-600',
    };
  };

  override render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { type, icon, color } = this.getErrorType(this.state.error);
      const canRetry = this.state.retryCount < this.maxRetries;

      const errorVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      };

      const pageErrorVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

      const itemVariants = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
      };

      const ErrorContent = () => (
        <motion.div
          variants={this.props.level === 'page' ? pageErrorVariants : errorVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={{ duration: 0.3 }}
          className={`${this.props.level === 'page' ? 'min-h-screen' : 'h-full'} flex items-center justify-center p-4`}
        >
          <Card className='w-full max-w-2xl'>
            <CardHeader className='text-center space-y-4'>
              <motion.div
                variants={itemVariants}
                className='flex justify-center'
              >
                <div className={`p-3 rounded-full bg-muted ${color}`}>
                  <AlertTriangle className='h-8 w-8' />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <CardTitle className='text-2xl font-bold'>
                  {this.props.level === 'page' ? 'Oops! Something went wrong' : 'Component Error'}
                </CardTitle>
                <CardDescription className='text-base mt-2'>
                  We encountered an unexpected error. Don&apos;t worry, our team has been notified.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className='space-y-6'>
              <motion.div variants={itemVariants} className='space-y-4'>
                <div className='flex items-center gap-2 text-sm'>
                  {icon}
                  <span className={`font-medium ${color}`}>{type}</span>
                  <span className='text-muted-foreground'>•</span>
                  <span className='text-muted-foreground'>Error ID: {this.state.errorId}</span>
                </div>

                {this.props.showDetails && (
                  <details className='bg-muted p-4 rounded-lg text-sm'>
                    <summary className='cursor-pointer font-medium mb-2'>
                      Technical Details
                    </summary>
                    <div className='space-y-2 font-mono text-xs'>
                      <div>
                        <strong>Message:</strong> {this.state.error?.message || 'Unknown error'}
                      </div>
                      {this.state.error?.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className='whitespace-pre-wrap mt-1 text-xs'>
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className='space-y-3'>
                <div className='text-sm text-muted-foreground text-center'>
                  {canRetry ? (
                    <>Attempt {this.state.retryCount + 1} of {this.maxRetries + 1}</>
                  ) : (
                    <>Maximum retry attempts reached</>
                  )}
                </div>

                <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                  {canRetry && (
                    <Button
                      onClick={this.handleRetry}
                      variant='default'
                      className='flex items-center gap-2'
                    >
                      <RefreshCw className='h-4 w-4' />
                      Try Again
                    </Button>
                  )}

                  {this.props.level === 'page' && (
                    <>
                      <Button
                        onClick={this.handleReload}
                        variant='outline'
                        className='flex items-center gap-2'
                      >
                        <RefreshCw className='h-4 w-4' />
                        Reload Page
                      </Button>

                      <Button
                        onClick={this.handleGoHome}
                        variant='outline'
                        className='flex items-center gap-2'
                      >
                        <Home className='h-4 w-4' />
                        Go Home
                      </Button>
                    </>
                  )}
                </div>

                {this.state.retryCount > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className='text-center text-xs text-muted-foreground'
                  >
                    Previous attempt was unsuccessful. You can try again or contact support if the problem persists.
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      );

      // For section-level errors, use smaller layout
      if (this.props.level === 'section') {
        return <ErrorContent />;
      }

      // For page-level errors, wrap in full-page layout
      return (
        <div className='min-h-screen bg-background flex items-center justify-center p-4'>
          <ErrorContent />
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary components for different use cases
export const PageErrorBoundary: React.FC<{ children: ReactNode; onError?: (error: Error, errorInfo: ErrorInfo) => void }> = ({
  children,
  onError,
}) => (
  <ErrorBoundary level='page' onError={onError} showDetails={process.env.NODE_ENV === 'development'}>
    {children}
  </ErrorBoundary>
);

export const ComponentErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}> = ({ children, fallback, onError }) => (
  <ErrorBoundary level='component' fallback={fallback} onError={onError}>
    {children}
  </ErrorBoundary>
);

export const SectionErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}> = ({ children, fallback, onError }) => (
  <ErrorBoundary level='section' fallback={fallback} onError={onError}>
    {children}
  </ErrorBoundary>
);

// Hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Manual error:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

export default ErrorBoundary;
