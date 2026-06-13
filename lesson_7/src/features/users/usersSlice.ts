import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";
import type { ApiUser, User } from "../../types/types";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

const initialState: User[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get<ApiUser[]>(USERS_URL);
  return response.data;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (_state, action) => {
      return action.payload.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
      }));
    });
  },
});

export const selectAllUsers = (state: RootState) => state.users;

export const selectUserById = (state: RootState, userId: string) =>
  state.users.find((user) => user.id === userId);

export default usersSlice.reducer;
