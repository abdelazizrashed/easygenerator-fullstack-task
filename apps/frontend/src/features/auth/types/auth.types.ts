import { User } from './user.types';

export enum AuthTokenKeys {
    ACCESS_TOKEN = 'accessToken',
}

/**
 *  Data required for Login process
 */
export interface LoginRequestDto {
    email: string;
    password: string;
}

/**
 *  Data required for Signup process
 */
export interface SignupRequestDto {
    name: string;
    email: string;
    password: string;
}

/**
 *  Auth process api response.
 */
export interface AuthResponse {
    token: string;
    user: User;
}
