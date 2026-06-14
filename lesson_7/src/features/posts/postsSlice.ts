import {
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "../../app/store";
import { sub } from "date-fns";
import type { Post, ReactionName } from "../../types/types";
import { apiSlice } from "../../api/apiSlice";

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState();

const loadPostsFromResponse = (responseData: Post[]) => {
  let min = 1;
  const loadedPosts = responseData.map((post) => {
    const normalizedPost: Post = {
      ...post,
      id: String(post.id),
      userId: String(post.userId),
      date:
        post.date ?? sub(new Date(), { minutes: min++ }).toISOString(),
      reactions: post.reactions ?? {
        thumbsUp: 0,
        wow: 0,
        heart: 0,
        rocket: 0,
        coffee: 0,
      },
    };
    return normalizedPost;
  });
  return postsAdapter.setAll(initialState, loadedPosts);
};

const postsSlice = createSlice({
  name: "posts",
  initialState: { count: 0 },
  reducers: {
    increaseCount(state) {
      state.count += 1;
    },
  },
});

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<typeof initialState, void>({
      query: () => "/posts",
      transformResponse: (responseData: Post[]) =>
        loadPostsFromResponse(responseData),
      providesTags: (result) => {
        if (!result) return [{ type: "Post" as const, id: "LIST" }];
        return [
          { type: "Post" as const, id: "LIST" },
          ...result.ids.map((id) => ({ type: "Post" as const, id })),
        ];
      },
    }),
    getPostsByUserId: builder.query<typeof initialState, string>({
      query: (id) => `/posts?userId=${id}`,
      transformResponse: (responseData: Post[]) =>
        loadPostsFromResponse(responseData),
      providesTags: (result) => {
        if (!result) return [{ type: "Post", id: "LIST" }];
        return result.ids.map((id) => ({ type: "Post", id }));
      },
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...initialPost,
          userId: initialPost.userId,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: "PUT",
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Post", id: arg.id! },
      ],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Post", id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: "PATCH",
        //In real app, we'd probably need to base this on the user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted(
        { postId, reactions },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          extendedApiSlice.util.updateQueryData(
            "getPosts",
            undefined,
            (draft) => {
              const post = draft.entities[postId];
              if (post) post.reactions = reactions;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = extendedApiSlice;

//returns the query result object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

//Creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data,
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(
  //Pass in a selector that returns the posts slice of data
  (state: RootState) => selectPostsData(state) ?? initialState,
);

export const getPostsStatus = (state: RootState) => {
  const { isLoading, isSuccess, isError } = selectPostsResult(state);
  if (isLoading) return "loading";
  if (isSuccess) return "succeeded";
  if (isError) return "failed";
  return "idle";
};

export const getPostsError = (state: RootState) =>
  selectPostsResult(state).error;

export const getCount = (state: RootState) => state.posts.count;

export const selectPostsByUser = createSelector(
  [selectAllPosts, (_state: RootState, userId: string) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId),
);

export const { increaseCount } = postsSlice.actions;

export const reactionAdded =
  (payload: { postId: string; reaction: ReactionName }) =>
  (dispatch: AppDispatch) => {
    dispatch(
      extendedApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
        const post = draft.entities[payload.postId];
        if (post) post.reactions[payload.reaction]++;
      }),
    );
  };

// export const addNewPost = extendedApiSlice.endpoints.addNewPost.initiate;
// export const updatePost = extendedApiSlice.endpoints.updatePost.initiate;
// export const deletePost = (post: Partial<Post>) =>
//   extendedApiSlice.endpoints.deletePost.initiate(post.id!);

export default postsSlice.reducer;
