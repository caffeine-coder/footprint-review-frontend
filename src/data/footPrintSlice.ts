import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ProductFootPrint {
    id: number;
    productName: string;
    supplierName: string;
    emissionsKgCo2e: number;
    uncertaintyPercent: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewComment: string | null;
    submittedAt: string;
    reviewedAt: string | null;
}

interface FootprintState {
    footprintData: ProductFootPrint[];
    loading: boolean;
    error: string | null;
}

const initialState: FootprintState = {
    footprintData: [],
    loading: false,
    error: null
};

const footprintSlice = createSlice({
    name: "footprints",
    initialState,
    reducers: {
        setFootprintData: (state, action: PayloadAction<ProductFootPrint[]>) => {
            state.footprintData = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

export const { setFootprintData, setLoading, setError } = footprintSlice.actions;

export default footprintSlice.reducer;