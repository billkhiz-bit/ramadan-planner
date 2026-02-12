import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-cream-50 dark:bg-surface-950 flex items-center justify-center px-4">
          <div className="max-w-sm text-center">
            <h1 className="text-xl font-bold text-teal-900 dark:text-cream-100 mb-2">Something went wrong</h1>
            <p className="text-sm text-teal-600 dark:text-cream-400 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
