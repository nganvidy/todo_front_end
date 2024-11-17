import { apiSlice } from "../../api/apiSlice";
export const requestTodoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRequestTodos: builder.query({
      query: () => `/todo`,
      keepUnusedDataFor: 5,
    }),
    getRequestTodoByUuid: builder.query({
      query: (uuid) => `/todo/${uuid}`,
      providesTags: ["requestTodo"],
    }),
    createRequestTodo: builder.mutation({
      query: (todo) => ({
        url: "/todo",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["requestTodo"],
    }),
    updateRequestTodo: builder.mutation({
      query: ({ uuid, todo }) => ({
        url: `/todo/${uuid}`,
        method: "PUT",
        body: todo,
      }),
      invalidatesTags: ["requestTodo"],
    }),
    deleteRequestTodo: builder.mutation({
      query: (uuid) => ({
        url: `/todo/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["requestTodo"],
    }),
  }),
});

export const {
  useGetRequestTodosQuery,
  useCreateRequestTodoMutation,
  useGetRequestTodoByUuidQuery,
  useUpdateRequestTodoMutation,
  useDeleteRequestTodoMutation,
} = requestTodoApiSlice;
