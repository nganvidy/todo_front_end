import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create a base query with no authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL, // Your API base URL
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json'); // Basic content type
    return headers;
  }
});

// Create an API slice with the simple base query
export const apiSlice = createApi({
  reducerPath: 'api', // Set the reducer path for your API slice
  baseQuery: baseQuery,
  tagTypes: ['Data'], // Tag types for cache invalidation (if needed)
  endpoints: (builder) => ({
    // // Add your endpoints here
    // // For example:
    // fetchData: builder.query({
    //   query: () => '/data', // Your API endpoint
    // }),
  }),
});

// Export hooks for calling the API endpoints
export const { useFetchDataQuery } = apiSlice;
