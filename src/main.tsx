import { createRoot } from "react-dom/client";
import Clarity from "@microsoft/clarity";
import App from "./App.tsx";
import "./lib/i18n";
import "./index.css";

Clarity.init("vqiykaqr50");

createRoot(document.getElementById("root")!).render(<App />);
