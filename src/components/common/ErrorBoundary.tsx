import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Box, Button, Container, Typography } from '@mui/material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="md">
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Oops! Algo deu errado.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {this.state.error?.message || 'Ocorreu um erro inesperado.'}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => window.location.reload()}
                            >
                                Recarregar Página
                            </Button>
                        </Alert>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 