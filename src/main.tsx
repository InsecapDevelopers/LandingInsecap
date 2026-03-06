import { createRoot } from "react-dom/client";
import Clarity from "@microsoft/clarity";
import App from "./App.tsx";
import "./index.css";

Clarity.init("vr6vp2at33");

createRoot(document.getElementById("root")!).render(<App />);
