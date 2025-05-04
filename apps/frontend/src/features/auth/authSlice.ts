import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    AuthResponse,
    AuthTokenKeys,
    LoginRequestDto,
    SignupRequestDto,
    User,
} from './types';
import { RootState } from '@/store/store';
import * as authApi from '@/features/auth/api';

interface AuthState {
    user: User | null;
    token: string | null;
    status: AuthStatus | AuthStatus.IDLE;
    error: string | null;
}

export enum AuthStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
}

const getToken = () => localStorage.getItem(AuthTokenKeys.ACCESS_TOKEN);

const initialState: AuthState = {
    user: null,
    token: getToken(),
    status: AuthStatus.IDLE,
    error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, LoginRequestDto>(
    'auth/login',
    async (dto, { rejectWithValue }) => {
        try {
            const response = await authApi.login(dto);
            localStorage.setItem(AuthTokenKeys.ACCESS_TOKEN, response.token);
            return response;
        } catch (error: any) {
            const message = error.response.data.message || 'Login failed';
            return rejectWithValue(message);
        }
    },
);

export const registerUser = createAsyncThunk<AuthResponse, SignupRequestDto>(
    'auth/signup',
    async (dto, { rejectWithValue }) => {
        try {
            const response = await authApi.signUp(dto);
            localStorage.setItem(AuthTokenKeys.ACCESS_TOKEN, response.token);
            return response;
        } catch (error: any) {
            const message = error.response.data.message || 'Signup failed';
            return rejectWithValue(message);
        }
    },
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    // Sync operations
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.status = AuthStatus.IDLE;
            state.error = null;
            localStorage.removeItem(AuthTokenKeys.ACCESS_TOKEN);
        },
        clearAuthError: (state) => {
            state.error = null;
            state.status = AuthStatus.IDLE;
        },
    },
    extraReducers: (builder) => {
        builder
            // **************** Login **************
            .addCase(loginUser.pending, (state) => {
                state.status = AuthStatus.LOADING;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = AuthStatus.SUCCESS;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.status = AuthStatus.ERROR;
                state.error =
                    (action.payload as string) ??
                    action.error.message ??
                    'Login failed';
            })

            // **************** Register **************
            .addCase(registerUser.pending, (state) => {
                state.status = AuthStatus.LOADING;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.status = AuthStatus.SUCCESS;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.user = null;
                state.token = null;
                state.status = AuthStatus.ERROR;
                state.error =
                    (action.payload as string) ??
                    action.error.message ??
                    'Signup failed';
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state: RootState): User | null =>
    state.auth.user;
export const selectCurrentToken = (state: RootState): string | null =>
    state.auth.token;
export const selectAuthStatus = (state: RootState): AuthStatus =>
    state.auth.status;
export const selectAuthError = (state: RootState): string | null =>
    state.auth.error;

export default authSlice.reducer;
