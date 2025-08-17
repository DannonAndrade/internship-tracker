import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
