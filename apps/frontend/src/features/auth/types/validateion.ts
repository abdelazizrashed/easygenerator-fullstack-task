import { z } from 'zod';

const passwordValidation = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character',
    });

export const signInSchema = z.object({
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(1, { message: 'Password is required' }), // Full password validation in login is annoying.
});

export const signUpSchema = z
    .object({
        name: z
            .string()
            .min(3, { message: 'Name must be at least 3 characters' }),
        email: z.string().email({ message: 'Invalid email format' }),
        password: passwordValidation,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
