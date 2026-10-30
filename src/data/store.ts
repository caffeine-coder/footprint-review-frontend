
import { configureStore } from '@reduxjs/toolkit';
import footprintReducer from './footPrintSlice';

export const store = configureStore({
    reducer: {
        footprints: footprintReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
