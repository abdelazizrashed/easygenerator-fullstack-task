import apiClient from "@/services/apiClient";
import { HomeApiResponse } from "../types/home-api-response.types";

export const fetchHomeApi = async (): Promise<HomeApiResponse> => {
    const response = await apiClient.get("/");
    return response.data;
}
