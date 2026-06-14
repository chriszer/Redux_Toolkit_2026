# Redux Toolkit Learning Journey

A progressive series of React + TypeScript projects following [Dave Gray's Redux Toolkit course](https://www.youtube.com/@DaveGrayTeachesCode). Each folder builds on the last, moving from a simple counter to a full posts app with async data, routing, normalized state, a local JSON API, and RTK Query.

## Tech Stack

- **React 19** + **TypeScript**
- **Redux Toolkit** (`createSlice`, `createAsyncThunk`, `createEntityAdapter`, `createSelector`)
- **RTK Query** (`createApi`, `fetchBaseQuery`, `injectEndpoints`, cache tags)
- **React Redux** (typed hooks)
- **Vite**
- **React Router** (lessons 4–7)
- **Axios** + **JSONPlaceholder** (users in lessons 3–5 and 7)
- **json-server** (lessons 6–7)
- **date-fns**, **Font Awesome** (where used)

## Project Structure

```
dave/
├── lesson_1/   # Counter — Redux basics
├── lesson_2/   # Posts — slices, selectors, prepare
├── lesson_3/   # Async posts — createAsyncThunk + API
├── lesson_4/   # Routing — CRUD, edit/delete posts
├── lesson_5/   # Entity adapter — normalized state, users
├── lesson_6/   # Todos — RTK Query + json-server
└── lesson_7/   # Posts app — RTK Query + entity adapter + optimistic updates
```

Each lesson is a standalone Vite app. Run commands from inside the lesson folder you want to work on.

## How to Run

```bash
cd lesson_1   # or lesson_2, lesson_3, etc.
pnpm install
pnpm run dev
```

**Lessons 6 and 7** also need the JSON API in a second terminal:

```bash
cd lesson_6   # or lesson_7
pnpm run server   # http://localhost:3500
pnpm run dev      # Vite app (separate terminal)
```

Both lessons use `data/db.json` as the json-server data file.

---

## Lesson Overview

### Lesson 1 — Counter

**Goal:** Understand the Redux data flow.

- `configureStore`, `createSlice`, `Provider`
- `useAppSelector` / `useAppDispatch` (typed hooks)
- `RootState` and `AppDispatch` types
- Basic reducers: `increment`, `decrement`

**Key files:** `src/features/counter/couterSlice.ts`, `src/app/store.ts`, `src/app/hooks.ts`

---

### Lesson 2 — Posts (Local State)

**Goal:** Feature-based slices and connecting UI to state.

- Post list with seed data
- `postAdded` with a `prepare` callback
- Selectors: `selectAllPosts`
- Author display via `usersSlice`
- Reactions, `TimeAgo`, add-post form

**Concepts:** slice colocation, `PayloadAction` typing, passing `userId` on posts

---

### Lesson 3 — Async Posts

**Goal:** Fetch data from an API with thunks.

- `createAsyncThunk` — `fetchPosts`, `addNewPost`
- `extraReducers` for `pending` / `fulfilled` / `rejected`
- Loading and error UI in `PostsList`
- Map API shape (`body`) to app shape (`body` / `Post` type)
- Shared types in `src/types/types.ts`

**API:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts)

---

### Lesson 4 — Routing & CRUD

**Goal:** Multi-page app with full post lifecycle.

- **React Router** — list, single post, add, edit
- `updatePost` and `deletePost` thunks
- `selectPostById`, `PostsExcerpt`, `EditPostForm`
- Layout and header components

---

### Lesson 5 — Entity Adapter & Users

**Goal:** Normalize state and scale selectors.

- `createEntityAdapter` — `entities` + `ids` instead of a manual `posts[]` array
- Adapter methods: `addOne`, `addMany`, `updateOne`, `removeOne`, `upsertMany`
- Generated selectors: `selectAllPosts`, `selectPostById`, `selectPostIds`
- `createSelector` — `selectPostsByUser`
- User routes: `UsersList`, `UserPage`
- Fetch users from API; normalize string IDs for author lookup

---

### Lesson 6 — Todos & RTK Query

**Goal:** Replace manual async logic with RTK Query against a local REST API.

- **json-server** on port `3500` (`data/db.json`)
- `createApi` + `fetchBaseQuery` — base API slice with todo endpoints
- Generated hooks: `useGetTodosQuery`, `useAddTodoMutation`, `useUpdateTodoMutation`, `useDeleteTodoMutation`
- `ApiProvider` instead of a hand-rolled Redux store (RTK Query only in this lesson)
- Cache tags: `providesTags` / `invalidatesTags` for automatic refetching
- `transformResponse` to sort todos (copy array first — `.sort()` mutates in place)
- Full todo CRUD UI with Font Awesome icons

**Key files:** `src/features/api/apiSlice.ts`, `src/features/todos/TodoList.tsx`

---

### Lesson 7 — Posts App with RTK Query

**Goal:** Apply RTK Query to the full posts app from earlier lessons, combining it with normalized state and optimistic updates.

- **Split API setup:** base `apiSlice` + `injectEndpoints` in `postsSlice.ts`
- Posts from **json-server** (`/posts`); users still from **JSONPlaceholder** via `createAsyncThunk`
- Redux store combines `[apiSlice.reducerPath]`, a small `posts` slice (counter only), and `users` reducer
- Entity adapter selectors read from the RTK Query cache via `extendedApiSlice.endpoints.getPosts.select()`
- Query endpoints: `getPosts`, `getPostsByUserId`
- Mutation endpoints: `addNewPost`, `updatePost`, `deletePost`, `addReaction`
- Cache tags per post + `LIST` tag; `invalidatesTags` on mutations
- **Optimistic updates:** `onQueryStarted` + `updateQueryData` + `patchResult.undo()` on failure
- Pre-fetch posts on app load: `store.dispatch(extendedApiSlice.endpoints.getPosts.initiate())`
- Forms use mutation hooks (`.unwrap()`) instead of dispatching thunks
- `loadPostsFromResponse` normalizes `id` and `userId` to strings and fills missing `date` / `reactions`

**Key files:** `src/api/apiSlice.ts`, `src/features/posts/postsSlice.ts`, `src/app/store.ts`, `src/main.tsx`

---

## Concepts Learned Along the Way

| Topic | What it solves |
|--------|----------------|
| Typed hooks | `state` is no longer `unknown` in selectors |
| `prepare` | Custom payload shape before it hits the reducer |
| `createAsyncThunk` | Side effects (fetch, POST, PUT, DELETE) |
| `extraReducers` | Respond to async lifecycle actions |
| Normalized IDs | String vs number ID mismatches (`userId`, `post.id`) |
| Entity adapter | Efficient lookups, less manual array filtering |
| `createSelector` | Memoized derived data (e.g. posts by user) |
| API mapping | JSONPlaceholder uses `body`; app uses typed `Post` |
| RTK Query | Auto caching, loading/error states, generated hooks |
| Cache tags | Targeted invalidation instead of refetching everything |
| `injectEndpoints` | Extend a shared API slice from feature modules |
| Optimistic updates | Instant UI feedback with rollback on failure |

---

## Common Gotchas (and Fixes)

1. **`state` is `unknown`** — Use `useAppSelector` from `app/hooks.ts`, not raw `useSelector`.
2. **Author always "Unknown"** — json-server returns numeric `userId` (`1`); users use string ids (`"1"`). Normalize both `id` and `userId` to strings in `transformResponse` (lesson 7) and in `usersSlice` (lessons 3–5, 7).
3. **`users.find` crash** — Register `usersReducer` in the store; `state.users` is `undefined` without it.
4. **Duplicate React keys** — Don't `concat` fetched posts twice; dedupe or use `upsertMany`.
5. **`.substring` on undefined** — Map `post.body` from the API, not `post.content`.
6. **JSX in `.ts` files** — Rename to `.tsx` (e.g. `UsersList.tsx`).
7. **json-server v1** — No `--watch` flag; use `-p 3500` and run via `pnpm exec` or `pnpm run server`.
8. **DELETE mutation errors** — Don't send a `body` on DELETE requests to json-server.
9. **`providesTags` type error** — Use `{ type: "Post" as const, id }` so TypeScript narrows the tag type literal.
10. **`onQueryStarted` syntax** — Use method body `{ }`, not arrow syntax `=> { }`, inside endpoint definitions.
11. **`.sort()` mutates** — Copy the response array before sorting in `transformResponse`.

---

## Progress

This repo is a hands-on workbook—not a polished product. Each lesson keeps the previous concepts and adds one layer:

**Local Redux → async thunks → routing & CRUD → normalized state → RTK Query (todos) → RTK Query (full posts app with optimistic updates).**

Currently through **Lesson 7**.

Based on Dave Gray's Redux Toolkit tutorials, built with React 19, TypeScript, and Vite.
