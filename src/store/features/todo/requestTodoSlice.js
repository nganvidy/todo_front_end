import { apiSlice } from "../../api/apiSlice";

export const requestTodoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRequestTodos: builder.query({
      query: () => `/todo`,
      keepUnusedDataFor: 5,
      providesTags: ['requestTodo'], // Provide tags here
    }),
    getRequestTodoByUuid: builder.query({
      query: (uuid) => `/todo/${uuid}`,
      providesTags: ["requestTodo"], // Ensure this tag is specified
    }),
    createRequestTodo: builder.mutation({
      query: (todo) => ({
        url: "/todo",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["requestTodo"], // Invalidate tags here
    }),
    updateRequestTodo: builder.mutation({
      query: ({ uuid, todo }) => ({
        url: `/todo/${uuid}`,
        method: 'PUT',
        body: { todo },
      }),
      invalidatesTags: ["requestTodo"], // Invalidate tags here
    }),
    deleteRequestTodo: builder.mutation({
      query: (uuid) => ({
        url: `/todo/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["requestTodo"], // Invalidate tags here
    }),
    updateRequestIsCompleted: builder.mutation({
      query: ({ uuid, isCompleted }) => ({
        url: `/todo/isCompleted/${uuid}`,
        method: 'PUT',
        body: { isCompleted },
      }),
      invalidatesTags: ["requestTodo"], // Invalidate tags here
    }),
  }),
  // tagTypes: ['requestTodo'], // Define tagTypes here, making sure 'requestTodo' is specified
});

export const {
  useGetRequestTodosQuery,
  useCreateRequestTodoMutation,
  useGetRequestTodoByUuidQuery,
  useUpdateRequestTodoMutation,
  useDeleteRequestTodoMutation,
  useUpdateRequestIsCompletedMutation,
} = requestTodoApiSlice;
