import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { consultationService } from '../services/api';
import { Consultation, ConsultationFormData } from '../types';

interface ConsultationState {
    consultations: Consultation[];
    loading: boolean;
    error: string | null;
}

const initialState: ConsultationState = {
    consultations: [],
    loading: false,
    error: null,
};

export const fetchConsultations = createAsyncThunk(
    'consultation/fetchConsultations',
    async () => {
        try {
            const response = await consultationService.getConsultations();
            console.log('Consultations response:', response);
            return response;
        } catch (error) {
            console.error('Error fetching consultations:', error);
            throw error;
        }
    }
);

export const createConsultation = createAsyncThunk(
    'consultation/createConsultation',
    async (data: ConsultationFormData) => {
        try {
            const response = await consultationService.createConsultation(data);
            console.log('Create consultation response:', response);
            return response;
        } catch (error) {
            console.error('Error creating consultation:', error);
            throw error;
        }
    }
);

export const cancelConsultation = createAsyncThunk(
    'consultation/cancelConsultation',
    async (id: number) => {
        try {
            const response = await consultationService.cancelConsultation(id);
            console.log('Cancel consultation response:', response);
            return response;
        } catch (error) {
            console.error('Error canceling consultation:', error);
            throw error;
        }
    }
);

export const confirmConsultation = createAsyncThunk(
    'consultation/confirmConsultation',
    async (id: number) => {
        try {
            const response = await consultationService.confirmConsultation(id);
            console.log('Confirm consultation response:', response);
            return response;
        } catch (error) {
            console.error('Error confirming consultation:', error);
            throw error;
        }
    }
);

export const completeConsultation = createAsyncThunk(
    'consultation/completeConsultation',
    async (id: number) => {
        try {
            const response = await consultationService.completeConsultation(id);
            console.log('Complete consultation response:', response);
            return response;
        } catch (error) {
            console.error('Error completing consultation:', error);
            throw error;
        }
    }
);

const consultationSlice = createSlice({
    name: 'consultation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Consultations
        builder.addCase(fetchConsultations.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchConsultations.fulfilled, (state, action) => {
            state.loading = false;
            state.consultations = action.payload;
        });
        builder.addCase(fetchConsultations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Erro ao carregar consultas';
        });

        // Create Consultation
        builder.addCase(createConsultation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createConsultation.fulfilled, (state, action) => {
            state.loading = false;
            state.consultations = [...state.consultations, action.payload];
        });
        builder.addCase(createConsultation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Erro ao criar consulta';
        });

        // Cancel Consultation
        builder.addCase(cancelConsultation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(cancelConsultation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.consultations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.consultations[index] = action.payload;
            }
        });
        builder.addCase(cancelConsultation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Erro ao cancelar consulta';
        });

        // Confirm Consultation
        builder.addCase(confirmConsultation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(confirmConsultation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.consultations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.consultations[index] = action.payload;
            }
        });
        builder.addCase(confirmConsultation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Erro ao confirmar consulta';
        });

        // Complete Consultation
        builder.addCase(completeConsultation.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(completeConsultation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.consultations.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.consultations[index] = action.payload;
            }
        });
        builder.addCase(completeConsultation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Erro ao completar consulta';
        });
    },
});

export default consultationSlice.reducer; 