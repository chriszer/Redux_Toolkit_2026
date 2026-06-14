import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { fetchUsers } from "./features/users/usersSlice.ts";
import { extendedApiSlice } from "./features/posts/postsSlice.ts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(fetchUsers());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>,
);
