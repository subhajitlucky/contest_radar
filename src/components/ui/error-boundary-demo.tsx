'use client';

/**
 * Interactive demonstration of error handling with different error types and recovery options
 */

import { AnimatePresence,motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  Database,
  Play,
  RefreshCw,
  Settings,
  Wifi,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ComponentErrorBoundary,
  PageErrorBoundary,
  SectionErrorBoundary,
  useErrorHandler,
} from '@/components/ui/error-boundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Demo components that will intentionally throw errors
const ProblematicComponent: React.FC<{ errorType: string; throwError: boolean }> = ({ errorType, throwError }) => {
  if (throwError) {
    throw new Error(errorType);
  }
  return (
    <div className='p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950'>
      <h3 className='font-semibold text-green-800 dark:text-green-200'>✅ Working Component</h3>
      <p className='text-sm text-green-600 dark:text-green-400'>
        This component is working normally. No errors here!
      </p>
    </div>
  );
};

const NetworkErrorDemo: React.FC<{ throwError: boolean }> = ({ throwError }) => {
  if (throwError) {
    // Simulate network error
    throw new Error('Failed to fetch contest data: Network connection timeout');
  }

  return (
    <div className='p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950'>
      <div className='flex items-center gap-2 mb-2'>
        <Wifi className='h-4 w-4 text-green-600' />
        <h3 className='font-semibold text-green-800 dark:text-green-200'>Network Connected</h3>
      </div>
      <p className='text-sm text-green-600 dark:text-green-400'>
        Successfully fetching contest data from external APIs...
      </p>
      <div className='mt-2 space-y-1'>
        <div className='h-2 bg-green-200 rounded-full'>
          <div className='h-2 bg-green-600 rounded-full w-3/4'></div>
        </div>
      </div>
    </div>
  );
};

const DatabaseErrorDemo: React.FC<{ throwError: boolean }> = ({ throwError }) => {
  if (throwError) {
    // Simulate database error
    throw new Error('Database connection failed: SQL state 08006 - Connection refused');
  }

  return (
    <div className='p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950'>
      <div className='flex items-center gap-2 mb-2'>
        <Database className='h-4 w-4 text-green-600' />
        <h3 className='font-semibold text-green-800 dark:text-green-200'>Database Online</h3>
      </div>
      <p className='text-sm text-green-600 dark:text-green-400'>
        Connected to PostgreSQL database. All queries executing successfully.
      </p>
      <div className='mt-2 text-xs text-green-500'>
        Last query: SELECT * FROM contests WHERE status = &quot;active&quot;
      </div>
    </div>
  );
};

const ValidationErrorDemo: React.FC<{ throwError: boolean }> = ({ throwError }) => {
  if (throwError) {
    // Simulate validation error
    throw new Error('Invalid contest data: rating must be between 0-4000, received 5000');
  }

  return (
    <div className='p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950'>
      <div className='flex items-center gap-2 mb-2'>
        <AlertCircle className='h-4 w-4 text-green-600' />
        <h3 className='font-semibold text-green-800 dark:text-green-200'>Validation Passed</h3>
      </div>
      <p className='text-sm text-green-600 dark:text-green-400'>
        All contest data validated successfully. No validation errors found.
      </p>
      <div className='mt-2 space-y-1'>
        <div className='text-xs text-green-500'>✓ Rating range: 0-4000</div>
        <div className='text-xs text-green-500'>✓ Date format: ISO 8601</div>
        <div className='text-xs text-green-500'>✓ Required fields present</div>
      </div>
    </div>
  );
};

const AppErrorDemo: React.FC<{ throwError: boolean }> = ({ throwError }) => {
  if (throwError) {
    // Simulate generic application error
    throw new Error('Unexpected error in contest ranking algorithm: null pointer exception');
  }

  return (
    <div className='p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950'>
      <div className='flex items-center gap-2 mb-2'>
        <Zap className='h-4 w-4 text-green-600' />
        <h3 className='font-semibold text-green-800 dark:text-green-200'>Application Running</h3>
      </div>
      <p className='text-sm text-green-600 dark:text-green-400'>
        Contest ranking algorithm executing normally. Performance: Optimal.
      </p>
      <div className='mt-2 text-xs text-green-500'>
        Algorithm: ELO rating system with decay factor 0.032
      </div>
    </div>
  );
};

// Demo wrapper components
const ComponentLevelDemo: React.FC<{ errorType: string; throwError: boolean }> = ({ errorType, throwError }) => {
  return (
    <ComponentErrorBoundary
      fallback={
        <div className='p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950'>
          <h3 className='font-semibold text-red-800 dark:text-red-200'>Component Error</h3>
          <p className='text-sm text-red-600 dark:text-red-400'>
            This component failed, but the rest of the page continues to work.
          </p>
        </div>
      }
    >
      <ProblematicComponent errorType={errorType} throwError={throwError} />
    </ComponentErrorBoundary>
  );
};

const SectionLevelDemo: React.FC<{ errorType: string; throwError: boolean }> = ({ errorType, throwError }) => {
  return (
    <SectionErrorBoundary>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>Contest Data Section</h3>
          <Badge variant='outline'>Section Level</Badge>
        </div>
        <ProblematicComponent errorType={errorType} throwError={throwError} />
      </div>
    </SectionErrorBoundary>
  );
};

const PageLevelDemo: React.FC<{ errorType: string; throwError: boolean }> = ({ errorType, throwError }) => {
  return (
    <PageErrorBoundary>
      <div className='text-center space-y-4'>
        <h2 className='text-2xl font-bold'>Page-Level Error Handling</h2>
        <p className='text-muted-foreground'>
          Errors at this level affect the entire page but provide full recovery options.
        </p>
        <ProblematicComponent errorType={errorType} throwError={throwError} />
      </div>
    </PageErrorBoundary>
  );
};

// Demo content component moved outside to avoid creation during render
const DemoContentComponent: React.FC<{ activeDemo: string; currentErrorType: string; throwError: boolean }> = ({
  activeDemo,
  currentErrorType,
  throwError,
}) => {
  const commonProps = { errorType: currentErrorType, throwError };

  switch (activeDemo) {
    case 'component':
      return <ComponentLevelDemo {...commonProps} />;
    case 'section':
      return <SectionLevelDemo {...commonProps} />;
    case 'page':
      return <PageLevelDemo {...commonProps} />;
    case 'network':
      return <NetworkErrorDemo throwError={throwError} />;
    case 'database':
      return <DatabaseErrorDemo throwError={throwError} />;
    case 'validation':
      return <ValidationErrorDemo throwError={throwError} />;
    case 'application':
      return <AppErrorDemo throwError={throwError} />;
    default:
      return <ComponentLevelDemo {...commonProps} />;
  }
};

export default function ErrorBoundaryDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('component');
  const [throwError, setThrowError] = useState<boolean>(false);
  const [currentErrorType, setCurrentErrorType] = useState<string>('Network Error: Failed to fetch data');

  const { handleError } = useErrorHandler();

  const errorTypes = [
    { id: 'network', name: 'Network Error', message: 'Network Error: Failed to fetch contest data', icon: Wifi },
    { id: 'database', name: 'Database Error', message: 'Database Error: Connection timeout', icon: Database },
    { id: 'validation', name: 'Validation Error', message: 'Validation Error: Invalid user input', icon: AlertCircle },
    { id: 'application', name: 'Application Error', message: 'Application Error: Unexpected runtime error', icon: Bug },
  ];

  const demoVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const triggerError = () => {
    setThrowError(true);
    setTimeout(() => setThrowError(false), 100); // Reset after error is handled
  };

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-display font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent'>
          🚨 Error Boundary Demo
        </h1>
        <p className='text-lg text-muted-foreground max-w-3xl mx-auto'>
          Interactive demonstration of advanced error handling with intelligent recovery options and user-friendly fallbacks.
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-6'>
          <Button
            onClick={triggerError}
            variant='destructive'
            size='lg'
            className='flex items-center gap-2'
          >
            <AlertTriangle className='h-5 w-5' />
            Trigger Error
          </Button>

          <Button
            onClick={() => handleError(new Error('Manual error from hook'))}
            variant='outline'
            className='flex items-center gap-2'
          >
            <Bug className='h-4 w-4' />
            Test Error Hook
          </Button>
        </div>
      </div>

      {/* Error Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Error Configuration
          </CardTitle>
          <CardDescription>
            Choose the type of error to test different error boundary behaviors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
            {errorTypes.map(({ id, name, message, icon: Icon }) => (
              <Button
                key={id}
                variant={currentErrorType === message ? 'default' : 'outline'}
                className='flex items-center gap-2 h-auto p-3'
                onClick={() => setCurrentErrorType(message)}
              >
                <Icon className='h-4 w-4' />
                <div className='text-left'>
                  <div className='font-medium'>{name}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Tabs */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo}>
        <TabsList className='grid w-full grid-cols-7'>
          <TabsTrigger value='component'>Component</TabsTrigger>
          <TabsTrigger value='section'>Section</TabsTrigger>
          <TabsTrigger value='page'>Page</TabsTrigger>
          <TabsTrigger value='network'>Network</TabsTrigger>
          <TabsTrigger value='database'>Database</TabsTrigger>
          <TabsTrigger value='validation'>Validation</TabsTrigger>
          <TabsTrigger value='application'>App</TabsTrigger>
        </TabsList>

        <TabsContent value={activeDemo} className='mt-6'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeDemo}
              variants={demoVariants}
              initial='initial'
              animate='animate'
              exit='exit'
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Play className='h-5 w-5' />
                    {activeDemo.charAt(0).toUpperCase() + activeDemo.slice(1)} Level Demo
                  </CardTitle>
                  <CardDescription>
                    {activeDemo === 'component' && 'Individual components are wrapped in error boundaries. Other components continue working.'}
                    {activeDemo === 'section' && 'Entire sections can fail gracefully without affecting the rest of the page.'}
                    {activeDemo === 'page' && 'Full page errors with comprehensive recovery options and navigation controls.'}
                    {activeDemo === 'network' && 'Network connectivity issues with retry logic and offline detection.'}
                    {activeDemo === 'database' && 'Database connection errors with connection pooling fallback strategies.'}
                    {activeDemo === 'validation' && 'Form validation errors with detailed error messages and correction guidance.'}
                    {activeDemo === 'application' && 'General application errors with logging and recovery options.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <DemoContentComponent
                      activeDemo={activeDemo}
                      currentErrorType={currentErrorType}
                      throwError={throwError}
                    />

                    {activeDemo !== 'component' && activeDemo !== 'section' && (
                      <div className='mt-6 p-4 bg-muted rounded-lg'>
                        <h4 className='font-semibold mb-2'>Current Error Type:</h4>
                        <code className='text-sm bg-background p-2 rounded block'>
                          {currentErrorType}
                        </code>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Features */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <RefreshCw className='h-5 w-5' />
              Smart Retry Logic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Automatic retry with exponential backoff</li>
              <li>• Maximum retry attempts to prevent infinite loops</li>
              <li>• Different retry strategies for different error types</li>
              <li>• User-controlled retry with clear feedback</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5' />
              Error Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Network errors with connectivity checks</li>
              <li>• Database errors with connection diagnostics</li>
              <li>• Validation errors with field-level guidance</li>
              <li>• Application errors with stack traces</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Zap className='h-5 w-5' />
              User Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Graceful degradation with partial functionality</li>
              <li>• Clear error messages with actionable guidance</li>
              <li>• Smooth animations and visual feedback</li>
              <li>• Accessibility features for screen readers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
