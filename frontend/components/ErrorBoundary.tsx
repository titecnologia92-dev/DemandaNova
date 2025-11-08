'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
          <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-5xl text-gray-400 mb-4">⚠️</div>
            <h2 className="text-xl text-gray-800 font-semibold mb-4">
              Ocorreu um erro
            </h2>
            <p className="text-gray-600 mb-6">
              Algo deu errado. Por favor, tente novamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

