import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Aquí podrías enviar el error a un servicio de logging
    console.error('Error capturado por boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#666'
        }}>
          <h2>Algo salió mal</h2>
          <p>Por favor, intenta recargar la página</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              background: '#2196f3',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
