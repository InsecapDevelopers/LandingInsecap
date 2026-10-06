import { createRoot, hydrateRoot } from "react-dom/client";
import type { ReactElement } from "react";
import { BrowserRouter, matchRoutes, type RouteObject } from "react-router-dom";
import type { DehydratedState } from "@tanstack/react-query";
import { AppShell, createQueryClient, routeDefinitions, routerFuture } from "./AppShell";
import type { LazyPage } from "./lib/lazy-page";
import i18n from "./lib/i18n";
import { getLocaleFromPath } from "./lib/locale-routing";
import { fallbackLanguage } from "./lib/translations";
import "./index.css";

declare global {
  interface Window {
    /** Estado de react-query que deja el prerender (scripts/prerender.mjs). */
    __RQ__?: DehydratedState;
    /** Cargador diferido de terceros (index.html): ejecuta `fn` cuando se insertan GTM y Meta Pixel. */
    __on3p?: (fn: () => void) => void;
  }
}

// Clarity va con los demás terceros (requestIdleCallback o primera interacción) y en su propio chunk.
window.__on3p?.(() => {
  void import("@microsoft/clarity").then(({ default: Clarity }) => Clarity.init("vqiykaqr50"));
});

// Un deploy nuevo borra los chunks del anterior: si una pestaña abierta pide uno que ya no existe,
// se recarga una vez para tomar el HTML nuevo (sessionStorage evita un bucle si el fallo persiste).
window.addEventListener("vite:preloadError", (event) => {
  try {
    if (sessionStorage.getItem("insecap-chunk-reload")) return;
    sessionStorage.setItem("insecap-chunk-reload", "1");
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

/**
 * Descarga el chunk de la página que corresponde a `pathname` (si es una página lazy). Se espera antes
 * de hidratar: así la ruta actual hidrata de inmediato, sin suspender sobre el HTML.
 * Vive aquí y no en AppShell para que ese módulo solo exporte componentes (react-refresh).
 */
function preloadRoute(pathname: string): Promise<unknown> {
  const routes: RouteObject[] = [{
    path: ":locale",
    children: routeDefinitions.map((routeDefinition) => (
      routeDefinition.path === ""
        ? { index: true, element: routeDefinition.element }
        : { path: routeDefinition.path, element: routeDefinition.element }
    )),
  }];
  const element = matchRoutes(routes, pathname)?.at(-1)?.route.element as ReactElement | undefined;
  const page = element?.type as Partial<LazyPage> | undefined;
  return page?.preload?.() ?? Promise.resolve();
}

const container = document.getElementById("root")!;
const queryClient = createQueryClient();
const dehydratedState = window.__RQ__;
delete window.__RQ__;

const app = (
  <BrowserRouter future={routerFuture}>
    <AppShell queryClient={queryClient} dehydratedState={dehydratedState} />
  </BrowserRouter>
);

// El idioma sale del path: debe coincidir con el del HTML prerenderizado antes de hidratar. El chunk
// de la página actual (React.lazy) se baja en paralelo para que la hidratación no suspenda.
void Promise.all([
  i18n.changeLanguage(getLocaleFromPath(window.location.pathname) ?? fallbackLanguage),
  preloadRoute(window.location.pathname).catch(() => undefined),
]).then(() => {
  try {
    sessionStorage.removeItem("insecap-chunk-reload");
  } catch {
    // Sin storage no hay recarga automática: nada que limpiar.
  }
  // HTML prerenderizado → hidratar. _shell.html (rutas dinámicas fuera del build) y dev → render normal.
  if (container.firstElementChild) {
    hydrateRoot(container, app, {
      onRecoverableError: (error) => console.warn("[hydrate]", error),
    });
  } else {
    createRoot(container).render(app);
  }
});
