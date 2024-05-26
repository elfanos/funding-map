import { Theme } from "@radix-ui/themes";
import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Theme
      appearance="light"
      accentColor="gray"
      grayColor="olive"
      panelBackground="solid"
    >
      <App />
    </Theme>
  </React.StrictMode>
);
