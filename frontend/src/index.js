import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import App from "./App";
import { store } from "./redux/store";
import setupAxiosInterceptors from "./utils/axiosConfig";
import "./index.css";

// Setup axios interceptors for authentication
setupAxiosInterceptors();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#4CAF50",
            borderRadius: 4,
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
