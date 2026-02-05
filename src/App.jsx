import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./Routes";

const serverBaseName = "/";

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={serverBaseName}>
    <MainRoutes />
  </BrowserRouter>
);
