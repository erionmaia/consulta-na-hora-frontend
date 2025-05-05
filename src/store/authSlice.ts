import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, setAuthToken } from '../services/api';
import { LoginCredentials, RegisterData, User } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Set initial token if it exists
if (initialState.token) {
    setAuthToken(initialState.token);
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue, dispatch }) => {
        try {
            // Primeiro, faz o login para obter o token
            const loginResponse = await authService.login(credentials);
            const { access } = loginResponse;
            
            // Armazena o token
            localStorage.setItem('token', access);
            setAuthToken(access);
            
            // Depois, busca os dados do usuário
            const userResponse = await authService.getProfile();
            
            return {
                token: access,
                user: userResponse
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao fazer login');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao registrar');
        }
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getProfile();
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Erro ao carregar perfil');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            setAuthToken(null);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Get Profile
        builder.addCase(getProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        });
        builder.addCase(getProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 