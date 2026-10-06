/**
 * Árbol de la app común al cliente y al servidor (prerender).
 * El router lo pone cada entrada: BrowserRouter en entry-client, StaticRouter en entry-server.
 */
import { Suspense, useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from 'react-i18next';
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
// import PromoPopup from "./components/PromoPopup";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { buildLocalizedPath, getLocaleFromPath, getLocaleMeta, isAppLanguage } from "./lib/locale-routing";
import SEO from "./components/SEO";
import { resolveLegacyPath } from "./lib/legacy-redirects";
import { siteJsonLd } from "./lib/jsonld";
import { useCartStore } from "./stores/cartStore";
import { fallbackLanguage } from "./lib/translations";
import { isCapinChatEnabled, isSimulatorsEnabled } from "./lib/featureFlags";
import CapinBubble from "./components/capin/CapinBubble";
import { trackAttribution } from "./lib/attribution";
import { lazyPage } from "./lib/lazy-page";

// Páginas: cada una en su propio chunk (Fase 6). Index va en el bundle principal porque es la
// entrada más visitada y su LCP no debe esperar otra descarga.
const Blog = lazyPage(() => import("./pages/Blog"));
const ArticleDetail = lazyPage(() => import("./pages/ArticleDetail"));
const AboutUs = lazyPage(() => import("./pages/AboutUs"));
const OurTeam = lazyPage(() => import("./pages/OurTeam"));
const HonorTeam = lazyPage(() => import("./pages/HonorTeam"));
const QualityPolicy = lazyPage(() => import("./pages/QualityPolicy"));
const PrivacyPolicy = lazyPage(() => import("./pages/PrivacyPolicy"));
const Contact = lazyPage(() => import("./pages/Contact"));
const OpenCoursesCatalog = lazyPage(() => import("./pages/OpenCoursesCatalog"));
const SapSpecialty = lazyPage(() => import("./pages/SapSpecialty"));
const SimulatorCatalog = lazyPage(() => import("./pages/SimulatorCatalog"));
const SimulatorModels = lazyPage(() => import("./pages/SimulatorModels"));
const SimulatorExtinguisherDetail = lazyPage(() => import("./pages/SimulatorExtinguisherDetail"));
const BeRelator = lazyPage(() => import("./pages/BeRelator"));
const OpenCourseForm = lazyPage(() => import("./pages/OpenCourseForm"));
const Clients = lazyPage(() => import("./pages/Clients"));
const ExperienciaYRespaldo = lazyPage(() => import("./pages/Xp"));
const CursosIndex = lazyPage(() => import("./pages/CursosIndex"));
const CursoFicha = lazyPage(() => import("./pages/CursoFicha"));
const CursoCategoria = lazyPage(() => import("./pages/CursoCategoria"));
const SedeDetail = lazyPage(() => import("./pages/SedeDetail"));
const FranquiciaSence = lazyPage(() => import("./pages/FranquiciaSence"));
const PreguntasFrecuentes = lazyPage(() => import("./pages/PreguntasFrecuentes"));

/** Un QueryClient por render en el servidor y uno por sesión en el cliente.
 *  staleTime alto: los datos llegan prerenderizados en window.__RQ__ y no deben volver a pedirse al hidratar. */
export const createQueryClient = (options: { server?: boolean } = {}) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000,
        ...(options.server ? { retry: false } : {}),
      },
    },
  });

export const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

/** Meta Pixel en SPA: el snippet de index.html registra solo la primera carga;
 *  cada navegación interna se reporta aquí como un PageView nuevo. */
const MetaPixelPageView = () => {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq?.('track', 'PageView');
  }, [pathname]);

  return null;
};

/** Guarda el gclid / utm de la URL en cada navegación, para enviarlos con el formulario de contacto. */
const AttributionTracker = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    trackAttribution(search, pathname);
  }, [pathname, search]);

  return null;
};

/** Metadatos por defecto de cada ruta (idioma del <html> y <SEO> con los textos de seo.pages,
 *  canonical, hreflang y robots según seo-routes) y el JSON-LD global (#org, #website). El <SEO>
 *  de cada página sobrescribe los metadatos porque se monta después; el JSON-LD de la página se
 *  suma al global. */
const RouteMeta = () => {
  const { pathname } = useLocation();
  const localeMeta = getLocaleMeta(getLocaleFromPath(pathname) ?? fallbackLanguage);

  return (
    <>
      <Helmet htmlAttributes={{ lang: localeMeta.htmlLang }}>
        <script type="application/ld+json">{siteJsonLd}</script>
      </Helmet>
      <SEO base />
    </>
  );
};

/** El carrito persiste en localStorage: se rehidrata después de montar para que el primer
 *  render del cliente coincida con el HTML prerenderizado (carrito vacío). */
const CartRehydrate = () => {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
};

export const routeDefinitions = [
  { path: '', element: <Index /> },
  // Índice, categorías y fichas SEO de los 61 temas (Fase 2).
  { path: 'cursos', element: <CursosIndex /> },
  { path: 'cursos/categoria/:area', element: <CursoCategoria /> },
  { path: 'cursos/:slug', element: <CursoFicha /> },
  { path: 'cursos-abiertos', element: <OpenCoursesCatalog /> },
  { path: 'sap-pm', element: <SapSpecialty /> },
  ...(isSimulatorsEnabled
    ? [
      { path: 'simuladores', element: <SimulatorCatalog /> },
      { path: 'simuladores/modelos', element: <SimulatorModels /> },
      { path: 'simuladores/extintores', element: <SimulatorExtinguisherDetail /> },
    ]
    : []),
  { path: 'nuestros-clientes', element: <Clients /> },
  { path: 'nosotros', element: <AboutUs /> },
  { path: 'nuestro-equipo', element: <OurTeam /> },
  { path: 'equipo-honor', element: <HonorTeam /> },
  { path: 'politica-calidad', element: <QualityPolicy /> },
  { path: 'politica-de-privacidad', element: <PrivacyPolicy /> },
  { path: 'contacto', element: <Contact /> },
  { path: 'formulario/cursos-abiertos', element: <OpenCourseForm /> },
  { path: 'acreditaciones', element: <ExperienciaYRespaldo /> },
  { path: 'sedes/:sede', element: <SedeDetail /> },
  { path: 'franquicia-sence', element: <FranquiciaSence /> },
  { path: 'preguntas-frecuentes', element: <PreguntasFrecuentes /> },
  { path: 'relator-trabaja-con-nosotros', element: <BeRelator /> },
  { path: 'noticias', element: <Blog /> },
  { path: 'noticias/:slug', element: <ArticleDetail /> },
  // URLs antiguas: en producción las redirige nginx (301, dist/redirects.map) antes de llegar aquí;
  // estas rutas solo cubren el desarrollo sin nginx y la navegación en el cliente.
  { path: 'cursos-empresas', element: <LegacyRedirect /> },
  { path: 'curso-empresa/:handle', element: <LegacyRedirect /> },
  { path: 'curso/:handle', element: <LegacyRedirect /> },
  { path: 'especialidades/sap-pm', element: <LegacyRedirect /> },
  { path: 'Experiencia-y-Respaldo', element: <LegacyRedirect /> },
  { path: 'noticias/:blogHandle/:articleHandle', element: <LegacyRedirect /> },
] as const;

/** Rutas sin idioma (→ /es/…) y URLs antiguas (src/lib/legacy-redirects.ts): al destino final en un salto. */
function LegacyRedirect() {
  const location = useLocation();
  const target = resolveLegacyPath(location.pathname) ?? buildLocalizedPath(location.pathname, fallbackLanguage);

  return <Navigate to={`${target}${location.search}${location.hash}`} replace />;
}

/** Mantiene i18n alineado con el idioma de la URL al navegar entre /es, /en y /pt.
 *  En la primera carga ya viene alineado: entry-client y entry-server cambian el idioma antes de renderizar. */
const LocaleRouteSync = () => {
  const { locale } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isAppLanguage(locale) || i18n.resolvedLanguage === locale) {
      return;
    }

    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  if (!isAppLanguage(locale)) {
    return <NotFound />;
  }

  return <Outlet />;
};

/** El <Suspense> cubre las páginas lazy: en la navegación (startTransition del router) React
 *  mantiene la página anterior mientras baja el chunk, así que el fallback no llega a verse. */
export const AppRoutes = () => (
  <Suspense fallback={null}>
    <Routes>
      {routeDefinitions.map((routeDefinition) => (
        <Route
          key={`legacy-${routeDefinition.path || 'home'}`}
          path={routeDefinition.path || '/'}
          element={<LegacyRedirect />}
        />
      ))}
      <Route path=":locale" element={<LocaleRouteSync />}>
        {routeDefinitions.map((routeDefinition) => (
          <Route
            key={`localized-${routeDefinition.path || 'home'}`}
            index={routeDefinition.path === ''}
            path={routeDefinition.path || undefined}
            element={routeDefinition.element}
          />
        ))}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

interface AppShellProps {
  queryClient: QueryClient;
  /** Solo en el servidor: react-helmet-async deja aquí los tags del <head>. */
  helmetContext?: Record<string, unknown>;
  /** Solo en el cliente: estado de react-query prerenderizado (window.__RQ__). */
  dehydratedState?: DehydratedState;
}

/** Providers y rutas. Debe renderizarse dentro de un router (BrowserRouter o StaticRouter). */
export const AppShell = ({ queryClient, helmetContext, dehydratedState }: AppShellProps) => (
  <HelmetProvider context={helmetContext}>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Toaster />
        <BackToTop />
        <ScrollToTop />
        <MetaPixelPageView />
        <AttributionTracker />
        <RouteMeta />
        <CartRehydrate />
        {isCapinChatEnabled && <CapinBubble />}
        {/*<PromoPopup />*/}
        <AppRoutes />
      </HydrationBoundary>
    </QueryClientProvider>
  </HelmetProvider>
);
