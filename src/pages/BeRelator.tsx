import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useLocalizedPath } from '@/hooks/use-localized-path';

const BeRelator = () => {
  const { locale } = useLocalizedPath();
  const heading = useScrollAnimation({ triggerOnce: true });
  const p1 = useScrollAnimation({ triggerOnce: true });
  const p2 = useScrollAnimation({ triggerOnce: true });

  const content = {
    es: {
      title: 'TRABAJA CON NOSOTROS',
      subtitle: 'Insecap Capacitacion',
      breadcrumb: 'TRABAJA CON NOSOTROS',
      brand: 'Insecap Capacitacion',
      paragraph1: 'Estamos en constante busqueda de talento apasionado por la ensenanza y la capacitacion. Si eres un relator de capacitacion con experiencia y compromiso por compartir tu conocimiento, te invitamos a formar parte de nuestro dinamico equipo de facilitadores.',
      paragraph2: 'Para iniciar el proceso, te pedimos que completes nuestro formulario de contacto. En el podras proporcionarnos informacion sobre tu experiencia, areas de especializacion y como crees que puedes contribuir a nuestro equipo.',
      formTitle: 'Formulario Trabaja con Nosotros',
    },
    en: {
      title: 'WORK WITH US',
      subtitle: 'Insecap Training',
      breadcrumb: 'WORK WITH US',
      brand: 'Insecap Training',
      paragraph1: 'We are constantly looking for talented professionals who are passionate about teaching and training. If you are an instructor with experience and a real commitment to sharing your knowledge, we invite you to join our dynamic facilitator team.',
      paragraph2: 'To begin the process, please complete our contact form. There you can provide information about your experience, areas of expertise and how you believe you can contribute to our team.',
      formTitle: 'Work With Us Form',
    },
    pt: {
      title: 'TRABALHE CONOSCO',
      subtitle: 'Insecap Capacitacao',
      breadcrumb: 'TRABALHE CONOSCO',
      brand: 'Insecap Capacitacao',
      paragraph1: 'Estamos em busca constante de talentos apaixonados por ensino e capacitacao. Se voce e um instrutor com experiencia e compromisso em compartilhar conhecimento, convidamos voce a fazer parte da nossa equipe dinamica de facilitadores.',
      paragraph2: 'Para iniciar o processo, pedimos que preencha nosso formulario de contato. Nele voce podera fornecer informacoes sobre sua experiencia, areas de especializacao e como acredita que pode contribuir para a nossa equipe.',
      formTitle: 'Formulario Trabalhe Conosco',
    },
  }[locale];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <PageHero 
          title={content.title}
          subtitle={content.subtitle}
          breadcrumbs={[{ label: content.breadcrumb }]}
        />

        <section className="py-20 bg-slate-50 relative overflow-hidden">
          {/* Fondo decorativo */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
             <img 
               src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Insecap_Logo-07.png?v=1767801508" 
               className="absolute -right-20 -bottom-20 w-1/2 rotate-12"
               alt=""
             />
          </div>
          {/* Orbe decorativo superior izquierdo */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
          {/* Orbe decorativo inferior derecho */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16">

              {/* Heading con gradiente + línea decorativa animada */}
              <div
                ref={heading.ref}
                className={`mb-6 transition-all duration-700 ease-out ${heading.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
              >
                <h3 className="text-3xl font-extrabold uppercase tracking-tight bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                  {content.brand}
                </h3>
                {/* Línea decorativa central */}
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className={`h-px bg-gradient-to-r from-transparent to-blue-400 transition-all duration-700 delay-200 ${heading.isVisible ? 'w-16 opacity-100' : 'w-0 opacity-0'}`} />
                  <div className={`w-2.5 h-2.5 rounded-full bg-blue-500 transition-all duration-500 delay-300 ${heading.isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full bg-indigo-400 transition-all duration-500 delay-400 ${heading.isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                  <div className={`w-1 h-1 rounded-full bg-blue-300 transition-all duration-500 delay-500 ${heading.isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                  <div className={`h-px bg-gradient-to-l from-transparent to-indigo-400 transition-all duration-700 delay-200 ${heading.isVisible ? 'w-16 opacity-100' : 'w-0 opacity-0'}`} />
                </div>
              </div>

              <div className="space-y-5 max-w-3xl mx-auto">
                {/* Párrafo 1 — con borde izquierdo y fondo suave */}
                <div
                  ref={p1.ref}
                  className={`relative text-left bg-white/70 backdrop-blur-sm border-l-4 border-blue-500 pl-5 pr-6 py-4 rounded-r-2xl shadow-sm transition-all duration-700 ease-out delay-100 ${p1.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                >
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {content.paragraph1}
                  </p>
                </div>

                {/* Párrafo 2 — igual pero espejo desde la derecha */}
                <div
                  ref={p2.ref}
                  className={`relative text-left bg-white/70 backdrop-blur-sm border-r-4 border-indigo-400 pr-5 pl-6 py-4 rounded-l-2xl shadow-sm transition-all duration-700 ease-out delay-200 ${p2.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                >
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {content.paragraph2}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="w-full flex justify-center p-0 md:p-4">
                <iframe 
                  src="https://tms.insecap.cl/Relator/TrabajaConNosotros" 
                  width="1000" 
                  height="1100"
                  className="w-full border-none min-h-[1100px]"
                  title={content.formTitle}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BeRelator;
