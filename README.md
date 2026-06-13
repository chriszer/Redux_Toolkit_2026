# Redux Toolkit Learning Journey

A progressive series of React + TypeScript projects following [Dave Gray's Redux Toolkit course](https://www.youtube.com/@DaveGrayTeachesCode). Each folder builds on the last, moving from a simple counter to a full posts app with async data, routing, normalized state, and a local JSON API.

## Tech Stack

- **React 19** + **TypeScript**
- **Redux Toolkit** (`createSlice`, `createAsyncThunk`, `createEntityAdapter`, `createSelector`)
- **React Redux** (typed hooks)
- **Vite**
- **React Router** (lessons 4–5)
- **Axios** + **JSONPlaceholder** (lessons 3–5)
- **json-server** (lesson 6)
- **date-fns**, **Font Awesome** (where used)

## Project Structure

```
dave/
├── lesson_1/   # Counter — Redux basics
├── lesson_2/   # Posts — slices, selectors, prepare
├── lesson_3/   # Async posts — createAsyncThunk + API
├── lesson_4/   # Routing — CRUD, edit/delete posts
├── lesson_5/   # Entity adapter — normalized state, users
└── lesson_6/   # Todos — json-server + RTK Query prep
```

Each lesson is a standalone Vite app. Run commands from inside the lesson folder you want to work on.

## How to Run

```bash
cd lesson_1   # or lesson_2, lesson_3, etc.
pnpm install
pnpm run dev
```

**Lesson 6** also needs the JSON API in a second terminal:

```bash
cd lesson_6
pnpm run server   # http://localhost:3500
pnpm run dev      # Vite app (separate terminal)
```

> **Note:** The API data file is `lesson_6/data/data.json`. If `pnpm run server` fails with "file not found", point the script at `data/data.json` instead of `data/db.json`.

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

### Lesson 6 — Todos & json-server

**Goal:** Local REST API and todo app (in progress).

- **json-server** on port `3500`
- Todo list UI with Font Awesome
- Foundation for RTK Query / API integration

**Data:** `data/data.json` (todos endpoint)

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

---

## Common Gotchas (and Fixes)

1. **`state` is `unknown`** — Use `useAppSelector` from `app/hooks.ts`, not raw `useSelector`.
2. **`post.userId` / author not found** — API returns numeric IDs; normalize to strings in `usersSlice`.
3. **Duplicate React keys** — Don't `concat` fetched posts twice; dedupe or use `upsertMany`.
4. **`.substring` on undefined** — Map `post.body` from the API, not `post.content`.
5. **JSX in `.ts` files** — Rename to `.tsx` (e.g. `UsersList.tsx`).
6. **json-server v1** — No `--watch` flag; use `-p 3500` and run via `pnpm exec` or `pnpm run server`.

---

## Progress

This repo is a hands-on workbook—not a polished product. Each lesson keeps the previous concepts and adds one layer. Typing, async flow, routing, normalized state, and local APIs are the through-line from lesson 1 to lesson 6.

Based on Dave Gray's Redux Toolkit tutorials, built with React 19, TypeScript, and Vite.
