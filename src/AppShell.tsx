/**
 * Árbol de la app común al cliente y al servidor (prerender).
 * El router lo pone cada entrada: BrowserRouter en entry-client, StaticRouter en entry-server.
 */
import { useEffect, useRef } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HydrationBoundary, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useTranslation } from 'react-i18next';
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
// import PromoPopup from "./components/PromoPopup";
import Index from "./pages/Index";
import CourseDetail from "./pages/CourseDetail";
import Blog from "./pages/Blog";
import ArticleDetail from "./pages/ArticleDetail";
import AboutUs from "./pages/AboutUs";
import OurTeam from "./pages/OurTeam";
import HonorTeam from "./pages/HonorTeam";
import QualityPolicy from "./pages/QualityPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import B2bCourseCatalogPage from "./pages/B2bCourseCatalogPage";
import OpenCoursesCatalog from "./pages/OpenCoursesCatalog";
import SapSpecialty from "./pages/SapSpecialty";
import B2bCourseDetailPage from "./pages/B2bCourseDetailPage";
import SimulatorCatalog from "./pages/SimulatorCatalog";
import SimulatorModels from "./pages/SimulatorModels";
import SimulatorExtinguisherDetail from "./pages/SimulatorExtinguisherDetail";
import BeRelator from "./pages/BeRelator";
import OpenCourseForm from "./pages/OpenCourseForm";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import ExperienciaYRespaldo from "./pages/Xp";
import { buildLocalizedPath, getLocaleFromPath, getLocaleMeta, isAppLanguage } from "./lib/locale-routing";
import { getRobotsForPath } from "./lib/seo-routes";
import { siteJsonLd } from "./lib/jsonld";
import { useCartStore } from "./stores/cartStore";
import { fallbackLanguage } from "./lib/translations";
import { isCapinChatEnabled, isSimulatorsEnabled } from "./lib/featureFlags";
import CapinBubble from "./components/capin/CapinBubble";
import { trackAttribution } from "./lib/attribution";

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

/** /cursos (catálogo B2C retirado) → /cursos-abiertos, conservando el prefijo de idioma.
 *  Un `Navigate` relativo caería en la ruta `cursos/:handle` y daría "Curso no encontrado". */
const CursosRedirect = () => {
  const { locale } = useParams();

  return <Navigate to={locale ? `/${locale}/cursos-abiertos` : '/cursos-abiertos'} replace />;
};

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

/** Metadatos por defecto de cada ruta (idioma del <html>, title, description y robots según
 *  seo-routes) y el JSON-LD global (#org, #website). El <SEO> de cada página sobrescribe los
 *  metadatos porque se monta después; el JSON-LD de la página se suma al global. */
const RouteMeta = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const localeMeta = getLocaleMeta(getLocaleFromPath(pathname) ?? fallbackLanguage);

  return (
    <Helmet htmlAttributes={{ lang: localeMeta.htmlLang }}>
      <title>{t('seo.defaultTitle')}</title>
      <meta name="description" content={t('seo.defaultDescription')} />
      <meta name="robots" content={getRobotsForPath(pathname)} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t('seo.defaultTitle')} />
      <meta property="og:description" content={t('seo.defaultDescription')} />
      <meta property="og:site_name" content={t('seo.siteName')} />
      <meta property="og:locale" content={localeMeta.ogLocale} />
      <meta property="og:image" content="https://storage.googleapis.com/gpt-engineer-file-uploads/gakLUeb1NqeODjO4gfzigCGfMjb2/social-images/social-1767794256256-Insecap_ISOTIPO-08.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{siteJsonLd}</script>
    </Helmet>
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
  { path: 'curso/:handle', element: <CourseDetail /> },
  { path: 'cursos/:handle', element: <CourseDetail /> },
  // El catálogo particular (B2C) se retiró: /cursos redirige a los cursos abiertos.
  { path: 'cursos', element: <CursosRedirect /> },
  { path: 'cursos-abiertos', element: <OpenCoursesCatalog /> },
  { path: 'cursos-empresas', element: <B2bCourseCatalogPage /> },
  { path: 'especialidades/sap-pm', element: <SapSpecialty /> },
  { path: 'curso-empresa/:handle', element: <B2bCourseDetailPage /> },
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
  { path: 'Experiencia-y-Respaldo', element: <ExperienciaYRespaldo /> },
  { path: 'relator-trabaja-con-nosotros', element: <BeRelator /> },
  { path: 'noticias', element: <Blog /> },
  { path: 'noticias/:blogHandle/:articleHandle', element: <ArticleDetail /> },
] as const;

const LegacyRedirect = () => {
  const location = useLocation();

  return <Navigate to={`${buildLocalizedPath(location.pathname, fallbackLanguage)}${location.search}${location.hash}`} replace />;
};

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

export const AppRoutes = () => (
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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BackToTop />
          <ScrollToTop />
          <MetaPixelPageView />
          <AttributionTracker />
          <RouteMeta />
          <CartRehydrate />
          {isCapinChatEnabled && <CapinBubble />}
          {/*<PromoPopup />*/}
          <AppRoutes />
        </TooltipProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  </HelmetProvider>
);
