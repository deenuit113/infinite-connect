import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";

registerSW(); // PWA 등록
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("새로운 업데이트가 있습니다. 새로고침할까요?")) {
      updateSW(true);
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
