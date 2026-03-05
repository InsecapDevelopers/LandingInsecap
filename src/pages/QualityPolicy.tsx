import React, { useEffect, useRef, useState } from 'react';
import { Target, Eye, CheckCircle2, Award, ShieldCheck, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { ShineBorder } from '@/components/ui/shine-border';

/**
 * Hook de parallax correcto.
 * - `wrapRef` se adjunta al contenedor EXTERIOR (no se transforma → medición limpia).
 * - `offset` se aplica como translateY al elemento INTERIOR.
 * Así no hay bucle de retroalimentación entre getBoundingClientRect y el transform.
 */
function useParallax(speed = 0.18) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const calc = () => {
      const rect = el.getBoundingClientRect();
      // distancia del centro del elemento al centro del viewport
      const dist = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(dist * speed);
    };

    window.addEventListener('scroll', calc, { passive: true });
    window.addEventListener('resize', calc, { passive: true });
    calc();
    return () => {
      window.removeEventListener('scroll', calc);
      window.removeEventListener('resize', calc);
    };
  }, [speed]);

  return { wrapRef, offset };
}

const QualityPolicy = () => {
  const visionCard   = useScrollAnimation({ threshold: 0.2 });
  const missionCard  = useScrollAnimation({ threshold: 0.2 });
  const policyHeader = useScrollAnimation({ threshold: 0.2 });
  const policyText   = useScrollAnimation({ threshold: 0.15 });
  const policyObjectives = useScrollAnimation({ threshold: 0.15 });

  // Parallax refs (wrapRef = medición exterior, offset = transform interior)
  const visionParallax   = useParallax(0.12);
  const missionParallax  = useParallax(0.18);
  const bannerParallax   = useParallax(0.2);
  const orb1Parallax     = useParallax(0.18);
  const orb2Parallax     = useParallax(0.24);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title="Política de Calidad"
          subtitle="Nuestro Compromiso"
          breadcrumbs={[{ label: "Política de Calidad" }]}
        />

        {/* Vision & Mission */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 md:px-14 lg:px-16">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Visión */}
              <div
                ref={visionCard.ref}
                className={`transition-all duration-700 ease-out ${visionCard.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              >
                {/* wrapRef: medición sin transform */}
                <div ref={visionParallax.wrapRef} className="h-full">
                  {/* inner: recibe el translateY */}
                  <div
                    style={{ transform: `translateY(${visionParallax.offset}px)`, willChange: 'transform' }}
                    className="relative bg-white rounded-[2rem] shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden p-10 h-full"
                  >
                    <ShineBorder shineColor={['#2563eb', '#93c5fd', '#1d4ed8']} borderWidth={2} duration={10} />
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-950 mb-4">Visión</h2>
                    <div className="w-12 h-1 bg-blue-600 rounded-full mb-6"></div>
                    <p className="text-slate-600 text-lg leading-relaxed italic">
                      "Ser una empresa líder en servicios de capacitación en el país, siendo referentes por la calidad
                      de competencias otorgadas a cada alumno. Asimismo, que los clientes identifiquen a INSECAP como
                      socio estratégico, en la formación de capital humano."
                    </p>
                  </div>
                </div>
              </div>

              {/* Misión */}
              <div
                ref={missionCard.ref}
                className={`transition-all duration-700 ease-out delay-200 ${missionCard.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              >
                {/* wrapRef: medición sin transform */}
                <div ref={missionParallax.wrapRef} className="h-full">
                  <div
                    style={{ transform: `translateY(${missionParallax.offset}px)`, willChange: 'transform' }}
                    className="relative bg-white rounded-[2rem] shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden p-10 h-full"
                  >
                    <ShineBorder shineColor={['#4f46e5', '#818cf8', '#2563eb']} borderWidth={2} duration={12} />
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-blue-950 mb-4">Misión</h2>
                    <div className="w-12 h-1 bg-indigo-600 rounded-full mb-6"></div>
                    <p className="text-slate-600 text-lg leading-relaxed italic">
                      "Entregar soluciones de capacitación con metodologías de vanguardia, asegurando el aprendizaje
                      efectivo en las Personas, con atención en las necesidades del mercado para enfrentar los
                      desafíos en favor del crecimiento y sustentabilidad de cada cliente. Lo anterior, se materializa
                      en el marco de la eficiencia y eficacia en pos de la mejora continua de INSECAP Capacitación."
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Banner Excelencia en Formación */}
        <section className="py-24 text-white overflow-hidden relative">
          {/* Imagen de fondo con parallax */}
          <div ref={bannerParallax.wrapRef} className="absolute inset-0 pointer-events-none" style={{ top: '-15%', bottom: '-15%' }}>
            <img
              src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Quienes-Somos-Collage-01-2400x1356.jpg?v=1767876559"
              alt=""
              aria-hidden="true"
              style={{ transform: `translateY(${bannerParallax.offset}px)`, willChange: 'transform' }}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlay degradado azul oscuro → primario */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/85 to-primary/75 pointer-events-none" />
          {/* Segundo degradado vertical para profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-blue-950/30 pointer-events-none" />

          {/* Orbe 1 — parallax rápido */}
          <div ref={orb1Parallax.wrapRef} className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] -mr-56 -mt-56">
            <div
              style={{ transform: `translateY(${orb1Parallax.offset}px)`, willChange: 'transform' }}
              className="w-full h-full bg-blue-300 rounded-full blur-[160px] opacity-20"
            />
          </div>
          {/* Orbe 2 — parallax más rápido */}
          <div ref={orb2Parallax.wrapRef} className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] -ml-40 -mb-40">
            <div
              style={{ transform: `translateY(${orb2Parallax.offset}px)`, willChange: 'transform' }}
              className="w-full h-full bg-indigo-400 rounded-full blur-[140px] opacity-15"
            />
          </div>

          {/* Contenido — z-10 para estar sobre la imagen */}
          <div>
            <div
              className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10"
            >
            <div
              ref={policyHeader.ref}
              className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-700 ease-out ${policyHeader.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Excelencia en Formación</h2>
              <p className="text-blue-100 text-xl leading-relaxed">
                Insecap Capacitación, es un Organismo Técnico de Capacitación, dedicado a brindar Servicios
                de Formación de excelencia, a empresas Privadas, Públicas y Particulares, mediante diversas
                metodologías de aprendizaje efectivo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div
                ref={policyText.ref}
                className={`space-y-6 transition-all duration-700 ease-out ${policyText.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              >
                <p className="text-blue-100 text-lg leading-relaxed text-justify">
                  Otorgando capacitación de calidad, orientada a satisfacer plenamente las necesidades
                  y demandas de los Clientes, contando para ello, con experiencia en el rubro, material
                  y equipamiento idóneo, como también relatores calificados y competentes, agregando valor
                  a todas las actividades de Capacitación.
                </p>
                <div className="pt-4">
                  <div className="relative inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-blue-300/50 bg-gradient-to-r from-blue-500/30 to-indigo-500/20 backdrop-blur-sm shadow-lg shadow-blue-900/30 hover:from-blue-400/40 hover:to-indigo-400/30 transition-all duration-300 group">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-400 p-1.5 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-blue-300 uppercase tracking-widest font-medium">Certificación Vigente</span>
                      <span className="font-bold text-white uppercase tracking-wider text-sm">Norma NCh 2728</span>
                    </div>
                    {/* Shine izquierda */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-300 to-blue-500 rounded-l-xl opacity-80" />
                  </div>
                </div>
              </div>

              <div
                ref={policyObjectives.ref}
                className={`relative overflow-hidden bg-gradient-to-br from-blue-900/60 to-indigo-900/40 backdrop-blur-md border border-white/25 p-8 rounded-3xl shadow-2xl shadow-blue-950/50 transition-all duration-700 ease-out delay-200 ${policyObjectives.isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'}`}
              >
                {/* Acento decorativo esquina */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none" />
                {/* Línea superior decorativa */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
                <h3 className="text-2xl font-extrabold mb-7 text-white tracking-tight relative z-10">
                  <span className="text-blue-300">Objetivos</span> de Calidad
                </h3>
                <ul className="space-y-5 relative z-10">
                  <li className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-blue-400/40 to-blue-600/30 p-2.5 rounded-xl h-fit shrink-0 border border-blue-300/30">
                      <ShieldCheck className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">Satisfacción Total</h4>
                      <p className="text-blue-200/80 text-sm leading-relaxed">Entregar servicios de formación de calidad, ocupándose de la satisfacción total de los Clientes.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-indigo-400/40 to-indigo-600/30 p-2.5 rounded-xl h-fit shrink-0 border border-indigo-300/30">
                      <TrendingUp className="w-5 h-5 text-indigo-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">Mejora Continua</h4>
                      <p className="text-blue-200/80 text-sm leading-relaxed">Mejorar continuamente la eficacia de nuestro Sistema de Gestión de Calidad y cumplir requisitos legales.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200">
                    <div className="bg-gradient-to-br from-sky-400/40 to-sky-600/30 p-2.5 rounded-xl h-fit shrink-0 border border-sky-300/30">
                      <CheckCircle2 className="w-5 h-5 text-sky-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1 text-white">Idoneidad de Recursos</h4>
                      <p className="text-blue-200/80 text-sm leading-relaxed">Mantener niveles óptimos en recursos humanos, equipamiento y materiales utilizados.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          </div>{/* /bannerParallax.wrapRef */}
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default QualityPolicy;
