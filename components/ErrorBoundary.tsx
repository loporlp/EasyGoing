import React, { Component } from 'react';
import { Text, View } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: any, errorInfo: any) => void;  // Optional callback to handle the error
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log the error and error info to console
    console.log('Caught error:', error);
    console.log('Error info:', errorInfo);

    // Call passed in method handler if one exists
    if (this.props.onError) {
        this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
        // Fallback UI
        return <Text style={{ textAlign: 'center', marginTop: 20 }}>Something went wrong. Please try again later.</Text>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
