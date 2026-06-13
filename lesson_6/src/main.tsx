import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./features/api/apiSlice.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApiProvider api={apiSlice}>
      <App />
    </ApiProvider>
  </StrictMode>,
);
