import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../auth/types";
import * as homeApi from "./api";
import { RootState } from "@/store/store";
import { HomeApiResponse } from "./types/home-api-response.types";
import { logout as authLogout } from "../auth/authSlice";

interface HomeState {
    user: User | null;
    message: string | null;
    status: HomeStatus;
    error: string | null;
}

export enum HomeStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error',
}

const initialState: HomeState = {
    user: null,
    message: null,
    status: HomeStatus.IDLE,
    error: null,
};


export const fetchHomeData = createAsyncThunk<HomeApiResponse>(
    'home/fetchData',
    async (_, { rejectWithValue }) => {
        try {
            const res = homeApi.fetchHomeApi();
            return res;
        } catch (error: any) {
            const message = error.response.data.message || 'Error while getting data';
            return rejectWithValue(message);
        }

    });


const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        clearHomeData: (state) => {
            state.user = null;
            state.user = null;
            state.status = HomeStatus.IDLE;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHomeData.pending, (state) => {
                state.status = HomeStatus.LOADING;
                state.error = null;
            })
            .addCase(fetchHomeData.fulfilled, (state, action) => {
                state.user = action.payload.data;
                state.message = action.payload.message;
                state.status = HomeStatus.SUCCESS;
                state.error = null;
            })
            .addCase(fetchHomeData.rejected, (state, action) => {
                state.status = HomeStatus.ERROR;
                state.error = action.payload as string;
            })
            // ************ on Logout **************
            .addCase(authLogout, (state) => {
                state.user = null;
                state.message = null;
                state.status = HomeStatus.IDLE;
                state.error = null;
            })

            ;
    },
});


export const { clearHomeData } = homeSlice.actions;


export const selectHomeCurrentUser = (state: RootState): User | null =>
    state.auth.user;
export const selectHomeMessage = (state: RootState): string | null =>
    state.home.message;
export const selectHomeStatus = (state: RootState): HomeStatus =>
    state.home.status;
export const selectHomeError = (state: RootState): string | null =>
    state.auth.error;

export default homeSlice.reducer;
