import { User } from "@/features/auth/types";

export interface HomeApiResponse {
    status: string;
    message: string;
    data: User | null,
} 
