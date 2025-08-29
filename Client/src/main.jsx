import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootLayout from "./Layouts/RootLayout.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootLayout></RootLayout>
  </StrictMode>
);
