import {
  createSlice,
  nanoid,
  type PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";
import { sub } from "date-fns";
import type { ApiPost, NewPost, Post, ReactionName } from "../../types/types";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

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

const initialState = {
  posts: [] as Post[],
  status: "idle" as "idle" | "loading" | "succeeded" | "failed",
  error: null as string | null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action: PayloadAction<Post>) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            body: content,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },

    reactionAdded(
      state,
      action: PayloadAction<{ postId: string; reaction: ReactionName }>,
    ) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        //Adding date and reactions
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

        const newPosts = loadedPosts.filter(
          (post) => !state.posts.some((existing) => existing.id === post.id),
        );

        //Add any fetched posts to the array
        state.posts = state.posts.concat(...newPosts);
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
        state.posts.unshift(post);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Update could not complete");
          console.log(action.payload);
          return;
        }

        const postId = action.payload.id.toString();
        const existingPost = state.posts.find((post) => post.id === postId);

        const updatedPost: Post = {
          id: postId,
          title: action.payload.title,
          body: action.payload.body,
          userId: action.payload.userId.toString(),
          date: new Date().toISOString(),
          reactions: existingPost?.reactions ?? {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        };

        state.posts = state.posts
          .filter((post) => post.id !== postId)
          .concat(updatedPost);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const selectPostById = (state: RootState, postId: number) =>
  state.posts.posts.find((post) => post.id === postId.toString());

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
