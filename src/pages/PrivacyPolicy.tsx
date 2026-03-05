import React from 'react';
import {
  FileText,
  UserCheck,
  Target,
  CalendarClock,
  ShieldAlert,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/PageHero';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';

const sections = [
  {
    id: 1,
    icon: <FileText className="w-7 h-7 text-white" />,
    title: '1. Objeto del Servicio',
    content: (
      <p className="text-slate-600 text-base leading-relaxed">
        El sistema <strong>TMS.INSECAP.CL</strong> permite a empresas usuarias y colaboradores registrados:
      </p>
    ),
    items: [
      'Registrar información de trabajadores que serán participantes en procesos de capacitación.',
      'Agendar reuniones virtuales o presenciales para informar sobre programas, fechas, asistencia y evaluaciones de los cursos impartidos.',
    ],
  },
  {
    id: 2,
    icon: <UserCheck className="w-7 h-7 text-white" />,
    title: '2. Ingreso de Datos de Participantes Externos',
    content: (
      <p className="text-slate-600 text-base leading-relaxed">
        Al ingresar los datos de trabajadores pertenecientes a empresas externas:
      </p>
    ),
    items: [
      'Se declara que la empresa que utiliza el sistema cuenta con autorización expresa de sus trabajadores para compartir sus datos personales (nombre, RUT, correo electrónico, teléfono, cargo, etc.) con INSECAP Capacitación, exclusivamente para fines de gestión formativa.',
      'INSECAP no se hace responsable por el ingreso de información sin consentimiento, siendo esta responsabilidad directa de la empresa usuaria del sistema.',
      'Los datos serán tratados conforme a la Ley N° 19.628 sobre Protección de la Vida Privada y otras normas aplicables en Chile.',
    ],
  },
  {
    id: 3,
    icon: <Target className="w-7 h-7 text-white" />,
    title: '3. Finalidad del Tratamiento de Datos',
    content: (
      <p className="text-slate-600 text-base leading-relaxed">
        Los datos ingresados serán utilizados únicamente para:
      </p>
    ),
    items: [
      'Coordinar el desarrollo de las actividades de capacitación.',
      'Realizar seguimiento al avance del participante.',
      'Emitir certificados, informes y reportes.',
      'Programar reuniones informativas con los participantes o representantes de su empresa.',
    ],
  },
  {
    id: 4,
    icon: <CalendarClock className="w-7 h-7 text-white" />,
    title: '4. Agenda de Reuniones',
    content: (
      <p className="text-slate-600 text-base leading-relaxed">
        El sistema <strong>TMS.INSECAP.CL</strong> habilita a los usuarios autorizados a:
      </p>
    ),
    items: [
      'Programar reuniones con anticipación para informar sobre el proceso formativo.',
      'Notificar por correo electrónico u otros medios a los participantes y/o encargados de RRHH de su empresa.',
      'Realizar seguimiento posterior a las reuniones a través de registros internos del sistema.',
    ],
  },
  {
    id: 5,
    icon: <ShieldAlert className="w-7 h-7 text-white" />,
    title: '5. Responsabilidad del Usuario',
    content: null,
    items: [
      'La empresa que utilice la plataforma será responsable de la veracidad y exactitud de los datos ingresados.',
      'Cualquier uso indebido, falsificación de información o falta de consentimiento informado por parte de los participantes será responsabilidad exclusiva del usuario que ejecutó el registro.',
    ],
  },
  {
    id: 6,
    icon: <Lock className="w-7 h-7 text-white" />,
    title: '6. Confidencialidad y Seguridad',
    content: null,
    items: [
      'Toda la información ingresada será almacenada en servidores seguros bajo estándares de cifrado y acceso controlado.',
      'INSECAP se compromete a no divulgar, vender ni transferir información personal a terceros, salvo obligación legal.',
    ],
  },
];

const PrivacyPolicy = () => {
  const introSection = useScrollAnimation({ threshold: 0.2 });
  const cardsSection = useStaggerAnimation({ threshold: 0.1 });
  const acceptanceSection = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <PageHero
          title="Condiciones del Servicio"
          subtitle="TMS.INSECAP.CL"
          breadcrumbs={[{ label: "Política de Privacidad" }]}
        />

        {/* Intro Banner */}
        <section className="py-16 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[150px] opacity-10 -mr-48 -mt-48" />
          <div className="container mx-auto px-4 relative z-10">
            <div
              ref={introSection.ref}
              className={`max-w-3xl mx-auto text-center transition-all duration-700 ease-out ${
                introSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
                Aplicación TMS.INSECAP.CL
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Términos y Condiciones de Uso
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                La presente declaración establece los términos y condiciones de uso del sistema{' '}
                <strong className="text-white">TMS.INSECAP.CL</strong>, propiedad de INSECAP Capacitación,
                respecto al tratamiento de datos de trabajadores de empresas externas y la programación
                de reuniones informativas con fines de coordinación y seguimiento de capacitaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Sections Grid */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div ref={cardsSection.ref} className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {sections.map((sec, index) => (
                <div
                  key={sec.id}
                  className={`bg-white rounded-[1.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-500 ${
                    cardsSection.isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{
                    transitionDelay: cardsSection.isVisible
                      ? cardsSection.getDelay(index, 100)
                      : '0ms',
                  }}
                >
                  {/* Icon + title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      {sec.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 leading-snug pt-1">
                      {sec.title}
                    </h3>
                  </div>

                  {sec.content && <div className="mb-4">{sec.content}</div>}

                  <ul className="space-y-3">
                    {sec.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Aceptación CTA */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div
              ref={acceptanceSection.ref}
              className={`max-w-3xl mx-auto bg-primary rounded-[2rem] p-12 text-white text-center overflow-hidden relative transition-all duration-700 ease-out ${
                acceptanceSection.isVisible
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-10 scale-[0.97]'
              }`}
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-15 -ml-32 -mb-32" />
              <div className="relative z-10">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">7. Aceptación</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  El uso del sistema implica la <strong className="text-white">aceptación plena</strong> de
                  estas condiciones. Cualquier modificación será informada por los canales oficiales de{' '}
                  <strong className="text-white">INSECAP Capacitación</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
