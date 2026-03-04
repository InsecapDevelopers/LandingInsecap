import React from 'react';
import { Target, Eye, CheckCircle2, Award, ShieldCheck, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

const QualityPolicy = () => {
  // Animaciones de scroll
  const visionCard = useScrollAnimation({ threshold: 0.2 });
  const missionCard = useScrollAnimation({ threshold: 0.2 });
  const policyHeader = useScrollAnimation({ threshold: 0.2 });
  const policyText = useScrollAnimation({ threshold: 0.15 });
  const policyObjectives = useScrollAnimation({ threshold: 0.15 });
  const ctaSection = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title="Política de Calidad"
          subtitle="Nuestro Compromiso"
          breadcrumbs={[{ label: "Política de Calidad" }]}
        />

        {/* Vision & Mission Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Vision */}
              <div
                ref={visionCard.ref}
                className={`bg-slate-50 p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-700 ease-out ${visionCard.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
              >
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Visión</h2>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  "Ser una empresa líder en servicios de capacitación en el país, siendo referentes por la calidad
                  de competencias otorgadas a cada alumno. Asimismo, que los clientes identifiquen a INSECAP como
                  socio estratégico, en la formación de capital humano."
                </p>
              </div>

              {/* Mission */}
              <div
                ref={missionCard.ref}
                className={`bg-slate-50 p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-700 ease-out delay-200 ${missionCard.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-12'
                  }`}
              >
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Misión</h2>
                <p className="text-slate-600 text-lg leading-relaxed italic">
                  "Entregar soluciones de capacitación con metodologías de vanguardia, asegurando el aprendizaje
                  efectivo en las Personas, con atención en las necesidades del mercado para enfrentar los
                  desafíos en favor del crecimiento y sustentabilidad de cada cliente. Lo anterior, se materializa
                  en el marco de la eficiencia y eficacia en pos de la mejora continua de INSECAP Capacitación."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Policy Section */}
        <section className="py-20 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[150px] opacity-15 -mr-48 -mt-48"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div
              ref={policyHeader.ref}
              className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-700 ease-out ${policyHeader.isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
                }`}
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
                className={`space-y-6 transition-all duration-700 ease-out ${policyText.isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-12'
                  }`}
              >
                <p className="text-blue-100 text-lg leading-relaxed">
                  Otorgando capacitación de calidad, orientada a satisfacer plenamente las necesidades
                  y demandas de los Clientes, contando para ello, con experiencia en el rubro, material
                  y equipamiento idóneo, como también relatores calificados y competentes, agregando valor
                  a todas las actividades de Capacitación.
                </p>
                <div className="pt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 text-blue-200 rounded-full border border-white/20">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold uppercase tracking-wider text-sm">Norma NCh 2728</span>
                  </div>
                </div>
              </div>
              <div
                ref={policyObjectives.ref}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl transition-all duration-700 ease-out delay-200 ${policyObjectives.isVisible
                  ? 'opacity-100 translate-x-0 scale-100'
                  : 'opacity-0 translate-x-12 scale-95'
                  }`}
              >
                <h3 className="text-2xl font-bold mb-6 text-white">Objetivos de Calidad</h3>
                <ul className="space-y-6">
                  <li className="flex gap-4">
                    <div className="bg-white/15 p-2 rounded-lg h-fit">
                      <ShieldCheck className="w-6 h-6 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Satisfacción Total</h4>
                      <p className="text-blue-200 text-sm">Entregar servicios de formación de calidad, ocupándose de la satisfacción total de los Clientes.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="bg-white/15 p-2 rounded-lg h-fit">
                      <TrendingUp className="w-6 h-6 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Mejora Continua</h4>
                      <p className="text-blue-200 text-sm">Mejorar continuamente la eficacia de nuestro Sistema de Gestión de Calidad y cumplir requisitos legales.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="bg-white/15 p-2 rounded-lg h-fit">
                      <CheckCircle2 className="w-6 h-6 text-blue-200" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Idoneidad de Recursos</h4>
                      <p className="text-blue-200 text-sm">Mantener niveles óptimos en recursos humanos, equipamiento y materiales utilizados.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default QualityPolicy;
