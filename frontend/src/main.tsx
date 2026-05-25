import { createRoot } from "react-dom/client";
import App from "./page/App.tsx";
import "./styles/index.css";
import "./i18n/config";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
