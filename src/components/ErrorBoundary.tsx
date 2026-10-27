import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // In production we can log to an external telemetry sink if needed
  }

  public handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-border shadow-[0_16px_40px_rgba(91,58,87,0.1)] space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-blush text-primary-dark mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-text">
              Something went wrong
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              PlanPilot encountered a display issue. Your saved data is safe in local storage.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition flex items-center gap-2 mx-auto cursor-pointer shadow-xs min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
