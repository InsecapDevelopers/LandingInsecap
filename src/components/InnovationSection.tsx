import React from 'react';
import { Users, Mic, ArrowRight, Download, CalendarCheck, ClipboardList, MessageCircle, Apple } from 'lucide-react';

/* ── Autoservicio data ───────────────────────────────── */
const autoservicio = {
  title: 'Autoservicio del Cliente',
  subtitle: 'Tu capacitación al alcance de tu mano',
  description:
    'Consulta tus cursos, descarga certificados, revisa horarios y gestiona tus inscripciones desde cualquier lugar. Todo lo que necesitas, en una sola app.',
  features: ['Consulta de cursos inscritos', 'Descarga de certificados', 'Historial de capacitaciones', 'Notificaciones en tiempo real'],
};

/* ── RelatoresYA "How it works" steps ────────────────── */
const relatoresData = {
  description:
    'Plataforma de uso interno diseñada para nuestros relatores. Permite aceptar ofertas de cursos, gestionar tu disponibilidad, revisar asignaciones y mantenerte conectado con el equipo de coordinación de forma ágil y centralizada.',
};

const relatoresSteps = [
  {
    icon: <CalendarCheck className="w-5 h-5 text-insecap-blue" />,
    title: 'Acepta Ofertas',
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-insecap-blue" />,
    title: 'Gestiona Clases',
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-insecap-blue" />,
    title: 'Coordina',
  },
];

/* ── Phone mockup ────────────────────────────────────── */
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[220px] h-[440px] md:w-[240px] md:h-[480px]">
      <div className="absolute inset-0 rounded-[2.5rem] bg-gray-900 shadow-2xl border-[3px] border-gray-700 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />
        <div className="absolute inset-[3px] rounded-[2.2rem] overflow-hidden bg-black">
          <div className="w-full h-full pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Store badges (SVG-based) ────────────────────────── */
function AppStoreBadge() {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-2 bg-black text-white rounded-lg px-5 py-2.5 hover:bg-gray-800 transition-colors"
    >
      <Apple className="w-7 h-7" />
      <div className="text-left leading-tight">
        <span className="text-[10px] block opacity-80">Descárgalo en</span>
        <span className="text-sm font-semibold">App Store</span>
      </div>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-2 bg-black text-white rounded-lg px-5 py-2.5 hover:bg-gray-800 transition-colors"
    >
      {/* Play triangle icon */}
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zM5.864 2.658L16.8 9.99l-2.302 2.302L5.864 2.658zm12.8 7.494l2.607 1.51a1 1 0 0 1 0 1.735l-2.607 1.51-2.585-2.585 2.585-2.585v.415z"/>
      </svg>
      <div className="text-left leading-tight">
        <span className="text-[10px] block opacity-80">Disponible en</span>
        <span className="text-sm font-semibold">Google Play</span>
      </div>
    </a>
  );
}

/* ── Main Section ────────────────────────────────────── */
export default function InnovationSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-insecap-blue/10 to-purple-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-400/10 to-purple-500/10 blur-3xl" />
        <svg className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04]" viewBox="0 0 600 800" fill="none">
          <path d="M300,0 Q600,200 400,400 T500,800" stroke="currentColor" strokeWidth="120" className="text-insecap-blue" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-insecap-blue/10 text-insecap-blue text-sm font-semibold tracking-wide uppercase mb-4">
            Tecnología & Educación
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Innovación
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Llevamos la capacitación al siguiente nivel con herramientas digitales diseñadas para ti.
          </p>
        </div>

        {/* ─── Autoservicio del Cliente ─────────────────── */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-insecap-blue via-indigo-600 to-purple-700" />

            <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-10">
              {/* Text */}
              <div className="flex-1 text-center md:text-left order-2 md:order-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-insecap-blue via-indigo-600 to-purple-700 text-white mb-5 shadow-lg">
                  <Users className="w-8 h-8" />
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  {autoservicio.title}
                </h3>
                <p className="text-insecap-blue font-semibold text-sm mb-4">
                  {autoservicio.subtitle}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {autoservicio.description}
                </p>

                <ul className="space-y-2 mb-8">
                  {autoservicio.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-insecap-blue via-indigo-600 to-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
                  <Download className="w-4 h-4" />
                  Próximamente
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Phone Mockup */}
              <div className="order-1 md:order-2 shrink-0">
                <div className="relative">
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 w-0 h-0"
                    style={{
                      borderLeft: '100px solid transparent',
                      borderRight: '100px solid transparent',
                      borderBottom: '80px solid',
                      borderBottomColor: '#fbbf24',
                      opacity: 0.25,
                    }}
                  />
                  <PhoneMockup>
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-indigo-600 to-purple-700 p-6 text-white">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <p className="text-sm font-bold tracking-wide">INSECAP</p>
                      <p className="text-[10px] opacity-75 mb-6">Autoservicio</p>
                      <div className="w-full space-y-3">
                        <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">📋 Mis Cursos</div>
                        <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">📜 Certificados</div>
                        <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">🔔 Notificaciones</div>
                        <div className="bg-white/20 rounded-full py-2 text-xs text-center font-semibold mt-2">Ingresar</div>
                      </div>
                    </div>
                  </PhoneMockup>
                </div>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute top-6 right-6 grid grid-cols-3 gap-1 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-insecap-blue" />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ─── RelatoresYA — Full-width App Section ──────── */}
      <div className="relative mt-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 border-y border-gray-200/60 overflow-hidden">

        {/* Decorative blurs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">

          {/* Hero: texto izq / teléfono der */}
          <div className="grid md:grid-cols-[1.2fr_0.8fr] items-center gap-14 max-w-7xl mx-auto">

            {/* Texto */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-insecap-blue/10 border border-insecap-blue/20 text-insecap-blue text-xs font-semibold tracking-wide uppercase mb-6">
                <Mic className="w-3.5 h-3.5" />
                Plataforma para Relatores
              </span>

              <h3 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
                Gestiona tu labor<br />
                <span className="text-insecap-blue">docente</span><br />
                desde tu celular
              </h3>

              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {relatoresData.description}
              </p>

              {/* Cómo funciona — inline compacto */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {relatoresSteps.map((step, i) => (
                  <React.Fragment key={i}>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700">
                      {step.icon}
                      {step.title}
                    </span>
                    {i < relatoresSteps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Store buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <AppStoreBadge />
                <GooglePlayBadge />
              </div>
            </div>

            {/* Teléfono con cards flotantes */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                {/* Floating card top-left */}
                <div className="absolute -top-4 -left-8 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 z-20 hidden md:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Nueva Oferta</p>
                    <p className="text-[9px] text-gray-400">Curso Seguridad</p>
                  </div>
                </div>

                {/* Floating card bottom-left */}
                <div className="absolute bottom-16 -left-10 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 z-20 hidden md:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">Asistencia</p>
                    <p className="text-[9px] text-gray-400">12/15 alumnos</p>
                  </div>
                </div>

                <PhoneMockup>
                  <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-purple-700 to-indigo-600 p-6 text-white">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <Mic className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm font-bold tracking-wide">RelatoresYA</p>
                    <p className="text-[10px] opacity-75 mb-6">INSECAP</p>
                    <div className="w-full space-y-3">
                      <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">📅 Mi Agenda</div>
                      <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">✅ Asistencia</div>
                      <div className="bg-white/10 rounded-lg px-3 py-2 text-xs">💬 Coordinación</div>
                      <div className="bg-white/20 rounded-full py-2 text-xs text-center font-semibold mt-2">Ingresar</div>
                    </div>
                  </div>
                </PhoneMockup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
