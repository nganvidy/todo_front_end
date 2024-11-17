import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";

const store = configureStore({
    reducer: {
        // reducerPath is the name of the slice default is "api"
        [apiSlice.reducerPath]: apiSlice.reducer,        
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware);
    },
    // devTools must set to false in production
    devTools: true,
});

export default store;
