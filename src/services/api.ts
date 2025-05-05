import axios from 'axios';
import { LoginCredentials, RegisterData, ConsultationFormData } from '../types';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

let token: string | null = null;

export const setAuthToken = (newToken: string | null) => {
    token = newToken;
};

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth services
export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/users/login/', credentials);
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post('/users/register/', data);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/users/profile/');
        return response.data;
    },

    changePassword: async (data: { old_password: string; new_password: string; new_password2: string }) => {
        const response = await api.post('/users/change-password/', data);
        return response.data;
    },
};

// Doctor services
export const doctorService = {
    getDoctors: async () => {
        const response = await api.get('/users/doctors/');
        return response.data;
    },

    getDoctorAvailability: async (doctorId: number, date: string) => {
        const response = await api.get(`/consultations/doctor/${doctorId}/availability/?date=${date}`);
        return response.data;
    },
};

// Consultation services
export const consultationService = {
    getConsultations: async () => {
        const response = await api.get('/consultations/');
        return response.data;
    },

    getConsultation: async (id: number) => {
        const response = await api.get(`/consultations/${id}/`);
        return response.data;
    },

    createConsultation: async (data: ConsultationFormData) => {
        const response = await api.post('/consultations/', data);
        return response.data;
    },

    updateConsultationStatus: async (id: number, status: string) => {
        const response = await api.patch(`/consultations/${id}/status/`, { status });
        return response.data;
    },

    cancelConsultation: async (id: number) => {
        return await consultationService.updateConsultationStatus(id, 'CA');
    },

    confirmConsultation: async (id: number) => {
        return await consultationService.updateConsultationStatus(id, 'CF');
    },

    completeConsultation: async (id: number) => {
        return await consultationService.updateConsultationStatus(id, 'CO');
    },

    getDoctorAvailability: async (doctorId: number, date: string) => {
        const response = await api.get(`/consultations/doctor/${doctorId}/availability/?date=${date}`);
        return response.data;
    },
};

export const userApi = {
    getProfile: () => api.get('/users/profile/'),
    updateProfile: (data: any) => api.put('/users/profile/', data),
    getDoctors: () => api.get('/users/doctors/'),
};

export default api; 