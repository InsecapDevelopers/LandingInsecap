import React, { useState, useCallback, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from 'react-i18next';
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
// import PromoPopup from "./components/PromoPopup";
import Index from "./pages/Index";
import CourseDetail from "./pages/CourseDetail";
import Blog from "./pages/Blog";
import ArticleDetail from "./pages/ArticleDetail";
import CourseCatalog from "./pages/CourseCatalog";
import AboutUs from "./pages/AboutUs";
import OurTeam from "./pages/OurTeam";
import HonorTeam from "./pages/HonorTeam";
import QualityPolicy from "./pages/QualityPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import B2bCourseCatalogPage from "./pages/B2bCourseCatalogPage";
import B2bCourseDetailPage from "./pages/B2bCourseDetailPage";
import SimulatorCatalog from "./pages/SimulatorCatalog";
import SimulatorModels from "./pages/SimulatorModels";
import SimulatorExtinguisherDetail from "./pages/SimulatorExtinguisherDetail";
import BeRelator from "./pages/BeRelator";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import ExperienciaYRespaldo from "./pages/Xp";
import { buildLocalizedPath, isAppLanguage } from "./lib/locale-routing";
import { fallbackLanguage } from "./lib/translations";
import { isSimulatorsEnabled } from "./lib/featureFlags";

const queryClient = new QueryClient();

const routeDefinitions = [
  { path: '', element: <Index /> },
  { path: 'curso/:handle', element: <CourseDetail /> },
  { path: 'cursos/:handle', element: <CourseDetail /> },
  { path: 'cursos', element: <CourseCatalog /> },
  { path: 'cursos-empresas', element: <B2bCourseCatalogPage /> },
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
  { path: 'Experiencia-y-Respaldo', element: <ExperienciaYRespaldo /> },
  { path: 'relator-trabaja-con-nosotros', element: <BeRelator /> },
  { path: 'noticias', element: <Blog /> },
  { path: 'noticias/:blogHandle/:articleHandle', element: <ArticleDetail /> },
] as const;

const LegacyRedirect = () => {
  const location = useLocation();

  return <Navigate to={`${buildLocalizedPath(location.pathname, fallbackLanguage)}${location.search}${location.hash}`} replace />;
};

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

const App = () => {
  const { i18n } = useTranslation();

  // showSplash: muestra el splash
  // showApp: difiere el montado de la app pesada hasta que el splash haya terminado
  const [showSplash, setShowSplash] = useState(true);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? 'es';
  }, [i18n.resolvedLanguage]);

  const handleSplashDone = useCallback(() => {
    setShowSplash(false);
    setShowApp(true);
  }, []);

  return (
    <HelmetProvider>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      {showApp && (
      <div className="app-reveal">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BackToTop />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          {/*<PromoPopup />*/}
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
      </div>
      )}
    </HelmetProvider>
  );
};
export default App;
