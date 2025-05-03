import apiClient from '@/services/apiClient';
import { AuthResponse, LoginRequestDto, SignupRequestDto } from '../types';

export const signUp = async (data: SignupRequestDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
};

export const login = async (data: LoginRequestDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
};
