'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}

export default function ProfileErrorFallback({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Profile Error Boundary caught]', error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#faf9f5] border border-[#e6dfd8] rounded-md max-w-md mx-auto my-12 shadow-sm animate-in fade-in duration-300">
      <div className="h-12 w-12 rounded-full bg-[#cc785c]/10 flex items-center justify-center text-[#cc785c] mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold font-serif text-[#141413] mb-2">Profile Error</h2>
      <p className="text-[#6c6a64] text-sm mb-6 max-w-xs leading-relaxed font-sans">
        {error?.message || 'An unexpected error occurred while loading your profile details.'}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] bg-[#cc785c] px-5 text-xs font-semibold text-white transition-all hover:bg-[#a9583e] active:scale-[0.98] cursor-pointer shadow-sm shadow-[#cc785c]/10"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: globalThis.Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: globalThis.Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: globalThis.Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary caught error]', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ProfileErrorFallback 
          error={this.state.error || new globalThis.Error('Runtime error in profile component')} 
          reset={this.handleReset} 
        />
      );
    }
    return this.props.children;
  }
}
