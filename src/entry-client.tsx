import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import type { DehydratedState } from "@tanstack/react-query";
import Clarity from "@microsoft/clarity";
import { AppShell, createQueryClient, routerFuture } from "./AppShell";
import i18n from "./lib/i18n";
import { getLocaleFromPath } from "./lib/locale-routing";
import { fallbackLanguage } from "./lib/translations";
import "./index.css";

declare global {
  interface Window {
    /** Estado de react-query que deja el prerender (scripts/prerender.mjs). */
    __RQ__?: DehydratedState;
  }
}

Clarity.init("vqiykaqr50");

const container = document.getElementById("root")!;
const queryClient = createQueryClient();
const dehydratedState = window.__RQ__;
delete window.__RQ__;

const app = (
  <BrowserRouter future={routerFuture}>
    <AppShell queryClient={queryClient} dehydratedState={dehydratedState} />
  </BrowserRouter>
);

// El idioma sale del path: debe coincidir con el del HTML prerenderizado antes de hidratar.
void i18n.changeLanguage(getLocaleFromPath(window.location.pathname) ?? fallbackLanguage).then(() => {
  // HTML prerenderizado → hidratar. _shell.html (rutas dinámicas fuera del build) y dev → render normal.
  if (container.firstElementChild) {
    hydrateRoot(container, app, {
      onRecoverableError: (error) => console.warn("[hydrate]", error),
    });
  } else {
    createRoot(container).render(app);
  }
});
