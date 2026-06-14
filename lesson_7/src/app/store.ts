import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import usersReducer from "../features/users/usersSlice";
import postsReducer from "../features/posts/postsSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    posts: postsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
