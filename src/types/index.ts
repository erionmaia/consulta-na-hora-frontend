export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: 'PA' | 'DO';
    crm?: string;
    specialty?: string;
}

export interface Consultation {
    id: number;
    patient: User;
    doctor: User;
    date_time: string;
    status: 'SC' | 'CF' | 'CA' | 'CO';
    reason: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface ConsultationState {
    consultations: Consultation[];
    loading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    password2: string;
    first_name: string;
    last_name: string;
    user_type: 'PA' | 'DO';
    crm?: string;
    specialty?: string;
}

export interface ConsultationFormData {
    patient_id: number;
    doctor_id: number;
    date_time: string;
    reason: string;
} 