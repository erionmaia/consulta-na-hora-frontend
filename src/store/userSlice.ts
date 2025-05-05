import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../types';

interface UserState {
  doctors: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  doctors: [],
  loading: false,
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  'user/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const mockDoctors: User[] = [
        {
          id: 1,
          username: 'joao.silva',
          email: 'joao.silva@example.com',
          first_name: 'João',
          last_name: 'Silva',
          user_type: 'DO',
          crm: '12345',
          specialty: 'Cardiologista',
        },
        {
          id: 2,
          username: 'maria.santos',
          email: 'maria.santos@example.com',
          first_name: 'Maria',
          last_name: 'Santos',
          user_type: 'DO',
          crm: '67890',
          specialty: 'Pediatra',
        },
      ];
      return mockDoctors;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer; 