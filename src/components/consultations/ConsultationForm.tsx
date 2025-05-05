import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createConsultation, fetchConsultations } from '../../store/consultationSlice';
import { ConsultationFormData, User } from '../../types';
import { doctorService, consultationService } from '../../services/api';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    MenuItem,
    Paper,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import ErrorBoundary from '../common/ErrorBoundary';
import { format, addHours, isBefore, isAfter, setHours, setMinutes } from 'date-fns';

const ConsultationForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const { error } = useSelector((state: RootState) => state.consultation);
    const [doctors, setDoctors] = useState<User[]>([]);
    const [formData, setFormData] = useState<ConsultationFormData>({
        patient_id: currentUser?.id || 0,
        doctor_id: 0,
        date_time: new Date().toISOString().slice(0, 16),
        reason: ''
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await doctorService.getDoctors();
                setDoctors(response);
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: 'Erro ao carregar lista de médicos',
                    severity: 'error',
                });
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!formData.doctor_id || !selectedDate) return;

            setLoadingSlots(true);
            try {
                console.log('Buscando disponibilidade para médico:', formData.doctor_id, 'data:', selectedDate);
                const bookedSlots = await doctorService.getDoctorAvailability(formData.doctor_id, selectedDate);
                console.log('Slots ocupados:', bookedSlots);
                
                // Gerar slots de 30 em 30 minutos das 8h às 18h
                const startTime = setHours(new Date(selectedDate), 8);
                const endTime = setHours(new Date(selectedDate), 18);
                const allSlots: string[] = [];
                let currentTime = startTime;

                while (isBefore(currentTime, endTime)) {
                    allSlots.push(format(currentTime, 'HH:mm'));
                    currentTime = addHours(currentTime, 0.5);
                }

                console.log('Todos os slots possíveis:', allSlots);

                // Filtrar slots já ocupados
                const bookedTimes = bookedSlots.map((slot: any) => 
                    format(new Date(slot.date_time), 'HH:mm')
                );

                console.log('Horários ocupados:', bookedTimes);

                const available = allSlots.filter(slot => !bookedTimes.includes(slot));
                console.log('Horários disponíveis:', available);
                
                setAvailableSlots(available);
            } catch (err) {
                console.error('Erro ao buscar disponibilidade:', err);
                setSnackbar({
                    open: true,
                    message: 'Erro ao carregar horários disponíveis',
                    severity: 'error',
                });
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
    }, [formData.doctor_id, selectedDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!currentUser) {
            setFormError('Usuário não autenticado');
            return;
        }

        if (!formData.doctor_id) {
            setFormError('Selecione um médico');
            return;
        }

        if (!formData.date_time) {
            setFormError('Selecione uma data e hora');
            return;
        }

        if (!formData.reason.trim()) {
            setFormError('Digite o motivo da consulta');
            return;
        }

        try {
            const formattedDateTime = new Date(formData.date_time).toISOString();
            const consultationData = {
                ...formData,
                date_time: formattedDateTime,
                patient_id: currentUser.id
            };

            await dispatch(createConsultation(consultationData) as any);
            await dispatch(fetchConsultations() as any);
            
            setSnackbar({
                open: true,
                message: 'Consulta agendada com sucesso!',
                severity: 'success',
            });
            
            navigate('/consultations');
        } catch (err: any) {
            console.error('Erro ao criar consulta:', err);
            
            if (err.response?.data) {
                const errorData = err.response.data;
                if (errorData.date_time) {
                    setFormError(errorData.date_time[0]);
                } else if (errorData.non_field_errors) {
                    setFormError(errorData.non_field_errors[0]);
                } else {
                    setFormError('Erro ao agendar consulta. Por favor, tente novamente.');
                }
            } else {
                setFormError('Erro ao agendar consulta. Por favor, tente novamente.');
            }
            
            setSnackbar({
                open: true,
                message: 'Erro ao agendar consulta. Por favor, tente novamente.',
                severity: 'error',
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'doctor_id' ? Number(value) : value
        }));

        if (name === 'doctor_id') {
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeSelect = (time: string) => {
        // selectedDate está no formato 'YYYY-MM-DD', time está no formato 'HH:mm'
        const dateTimeLocal = `${selectedDate}T${time}`;
        setFormData(prev => ({
            ...prev,
            date_time: dateTimeLocal
        }));
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ErrorBoundary>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" component="h1" gutterBottom align="center">
                        Agendar Consulta
                    </Typography>
                    
                    {formError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {formError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Médico"
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!formError && !formData.doctor_id}
                        >
                            <MenuItem value={0}>Selecione um médico</MenuItem>
                            {doctors.map((doctor: User) => (
                                <MenuItem key={doctor.id} value={doctor.id}>
                                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty}
                                </MenuItem>
                            ))}
                        </TextField>

                        {formData.doctor_id > 0 && (
                            <>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Data"
                                    name="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    margin="normal"
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        min: new Date().toISOString().split('T')[0]
                                    }}
                                />

                                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                    Horários Disponíveis
                                </Typography>

                                {loadingSlots ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : availableSlots.length > 0 ? (
                                    <Box sx={{ 
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                        gap: 1,
                                        mt: 2
                                    }}>
                                        {availableSlots.map((time) => (
                                            <Button
                                                key={time}
                                                variant={formData.date_time.includes(time) ? 'contained' : 'outlined'}
                                                color="primary"
                                                fullWidth
                                                onClick={() => handleTimeSelect(time)}
                                                sx={{ mb: 1 }}
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </Box>
                                ) : (
                                    <Alert severity="info">
                                        Não há horários disponíveis para esta data.
                                    </Alert>
                                )}
                            </>
                        )}

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Motivo da Consulta"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!formError && !formData.reason.trim()}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!formData.doctor_id || !formData.date_time || !formData.reason.trim()}
                        >
                            Agendar Consulta
                        </Button>
                    </Box>
                </Paper>

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
            </Container>
        </ErrorBoundary>
    );
};

export default ConsultationForm; 