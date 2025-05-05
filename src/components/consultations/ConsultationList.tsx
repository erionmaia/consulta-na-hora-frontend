import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    fetchConsultations,
    cancelConsultation,
    confirmConsultation,
    completeConsultation,
} from '../../store/consultationSlice';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Consultation } from '../../types';
import ErrorBoundary from '../common/ErrorBoundary';

const ConsultationList: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const { consultations, loading, error } = useSelector((state: RootState) => state.consultation);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const loadConsultations = async () => {
            try {
                await dispatch(fetchConsultations() as any);
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: 'Erro ao carregar consultas. Por favor, tente novamente.',
                    severity: 'error',
                });
            }
        };
        loadConsultations();
    }, [dispatch]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SC':
                return 'warning';
            case 'CF':
                return 'success';
            case 'CA':
                return 'error';
            case 'CO':
                return 'info';
            default:
                return 'primary';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'SC':
                return 'Agendada';
            case 'CF':
                return 'Confirmada';
            case 'CA':
                return 'Cancelada';
            case 'CO':
                return 'Concluída';
            default:
                return status;
        }
    };

    const handleCancel = async (id: number) => {
        if (window.confirm('Deseja realmente cancelar esta consulta?')) {
            try {
                await dispatch(cancelConsultation(id) as any);
                setSnackbar({
                    open: true,
                    message: 'Consulta cancelada com sucesso!',
                    severity: 'success',
                });
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: 'Erro ao cancelar consulta. Por favor, tente novamente.',
                    severity: 'error',
                });
            }
        }
    };

    const handleConfirm = async (id: number) => {
        try {
            await dispatch(confirmConsultation(id) as any);
            setSnackbar({
                open: true,
                message: 'Consulta confirmada com sucesso!',
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Erro ao confirmar consulta. Por favor, tente novamente.',
                severity: 'error',
            });
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await dispatch(completeConsultation(id) as any);
            setSnackbar({
                open: true,
                message: 'Consulta concluída com sucesso!',
                severity: 'success',
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: 'Erro ao concluir consulta. Por favor, tente novamente.',
                severity: 'error',
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!consultations || consultations.length === 0) {
        return (
            <Container>
                <Typography variant="body1" sx={{ p: 3, textAlign: 'center' }}>
                    Nenhuma consulta encontrada.
                </Typography>
            </Container>
        );
    }

    return (
        <ErrorBoundary>
            <Container maxWidth="lg">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Minhas Consultas
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Data</TableCell>
                                    <TableCell>Paciente</TableCell>
                                    <TableCell>Médico</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Motivo</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {consultations.map((consultation) => (
                                    <TableRow key={consultation.id}>
                                        <TableCell>
                                            {consultation.date_time && !isNaN(new Date(consultation.date_time).getTime())
                                                ? format(
                                                    new Date(consultation.date_time),
                                                    "dd 'de' MMMM 'de' yyyy 'às' HH:mm",
                                                    { locale: ptBR }
                                                )
                                                : 'Data inválida'}
                                        </TableCell>
                                        <TableCell>
                                            {consultation.patient?.first_name} {consultation.patient?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            Dr. {consultation.doctor?.first_name} {consultation.doctor?.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color={getStatusColor(consultation.status) as any}
                                                size="small"
                                                disabled
                                            >
                                                {getStatusText(consultation.status)}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{consultation.reason}</TableCell>
                                        <TableCell>
                                            {user?.user_type === 'DO' && consultation.status === 'SC' && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleConfirm(consultation.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Confirmar
                                                </Button>
                                            )}
                                            {user?.user_type === 'DO' && consultation.status === 'CF' && (
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    size="small"
                                                    onClick={() => handleComplete(consultation.id)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Concluir
                                                </Button>
                                            )}
                                            {(consultation.status === 'SC' || consultation.status === 'CF') && (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleCancel(consultation.id)}
                                                >
                                                    Cancelar
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert
                            onClose={handleCloseSnackbar}
                            severity={snackbar.severity}
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Box>
            </Container>
        </ErrorBoundary>
    );
};

export default ConsultationList; 