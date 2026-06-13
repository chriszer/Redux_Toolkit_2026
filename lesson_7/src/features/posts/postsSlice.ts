import {
  createSlice,
  type PayloadAction,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";
import { sub } from "date-fns";
import type { ApiPost, NewPost, Post, ReactionName } from "../../types/types";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
  error: null as string | null,
  count: 0,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get<ApiPost[]>(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: NewPost) => {
    const response = await axios.post<ApiPost>(POSTS_URL, initialPost);
    return response.data;
  },
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (initialPost: Partial<Post>) => {
    const { id } = initialPost;
    const response = await axios.put<ApiPost>(
      `${POSTS_URL}/${id}`,
      initialPost,
    );
    return response.data;
  },
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost: Partial<Post>) => {
    const { id } = initialPost;
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    if (response.status === 200) return initialPost;
  },
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>,
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state) {
      state.count = state.count + 1;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts: Post[] = action.payload.map((post) => ({
          id: post.id.toString(),
          title: post.title,
          body: post.body,
          userId: post.userId.toString(),
          date: sub(new Date(), { minutes: min++ }).toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        }));

        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        const post: Post = {
          id: action.payload.id.toString(),
          title: action.payload.title,
          body: action.payload.body,
          userId: action.payload.userId.toString(),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        };
        postsAdapter.addOne(state, post);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }

        const postId = action.payload.id.toString();

        postsAdapter.updateOne(state, {
          id: postId,
          changes: {
            title: action.payload.title,
            body: action.payload.body,
            userId: action.payload.userId.toString(),
            date: new Date().toISOString(),
          },
        });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

//geSelectors creates these selectors and we rename them with aliases using destructing
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const getCount = (state: RootState) => state.posts.count;

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId),
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
