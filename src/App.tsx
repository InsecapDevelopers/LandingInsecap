import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
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
import Contact from "./pages/Contact";
import BeRelator from "./pages/BeRelator";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import ExperienciaYRespaldo from "./pages/Xp";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BackToTop />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          {/*<PromoPopup />*/}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/curso/:handle" element={<CourseDetail />} />
            <Route path="/cursos" element={<CourseCatalog />} />
            <Route path="/nuestros-clientes" element={<Clients />} />
            <Route path="/nosotros" element={<AboutUs />} />
            <Route path="/nuestro-equipo" element={<OurTeam />} />
            <Route path="/equipo-honor" element={<HonorTeam />} />
            <Route path="/politica-calidad" element={<QualityPolicy />} />
            <Route path="/Experiencia-y-Respaldo" element={<ExperienciaYRespaldo />} />
            {/* 
              La ruta /contacto ha sido desactivada temporalmente para producción 
              ya que el formulario de contacto se incluye modularmente en el footer/hero.
              No eliminar la página por si se desea volver a utilizar la vista dedicada.
              <Route path="/contacto" element={<Contact />} />
            */}
            <Route path="/relator-trabaja-con-nosotros" element={<BeRelator />} />
            <Route path="/noticias" element={<Blog />} />
            <Route path="/noticias/:blogHandle/:articleHandle" element={<ArticleDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
