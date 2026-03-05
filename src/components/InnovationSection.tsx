import React, { useState } from 'react';
import {
  Users, Mic, ArrowRight, Download,
  CalendarCheck, ClipboardList, MessageCircle, Apple, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/use-scroll-animation';

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
      href="https://play.google.com/store/apps/details?id=com.insecap.relatoresya&pcampaignid=web_share"
      target="_blank"
      rel="noopener noreferrer"
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

/* ── SLIDE: Autoservicio del Cliente ────────────────── */
function SlideAutoservicio() {
  const textAnim  = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const phoneAnim = useScrollAnimation({ threshold: 0.08, triggerOnce: true });

  return (
    <div className="grid md:grid-cols-2 items-center gap-8 lg:gap-12">
      <div
        ref={textAnim.ref}
        className={`transition-all duration-[900ms] ease-out ${textAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-semibold tracking-wide uppercase mb-6">
          <Users className="w-3.5 h-3.5" />
          Para Clientes
        </span>
        <h3 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-[1.1] mb-4">
          {autoservicio.title}
        </h3>
        <p className="text-insecap-blue font-semibold text-sm mb-4">{autoservicio.subtitle}</p>
        <p className="text-slate-500 text-base leading-relaxed mb-6">{autoservicio.description}</p>
        <ul className="space-y-2 mb-8">
          {autoservicio.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-insecap-blue via-indigo-600 to-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
          <Download className="w-4 h-4" />
          Próximamente
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={phoneAnim.ref}
        className={`flex justify-center transition-all duration-[1000ms] ease-out delay-200 ${phoneAnim.isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'}`}
      >
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-purple-300/25 blur-3xl" />
          <div className="phone-float relative">
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
            <div className="glow-ring absolute -bottom-3 left-1/2 w-[70%] h-4 bg-purple-400/50 blur-xl rounded-full" />
          </div>
          <div className="absolute -right-8 top-8 grid grid-cols-4 gap-2 opacity-35">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SLIDE: RelatoresYA ──────────────────────────────── */
function SlideRelatores() {
  const textAnim  = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const phoneAnim = useScrollAnimation({ threshold: 0.08, triggerOnce: true });
  const badgeAnim = useScrollAnimation({ threshold: 0.15, triggerOnce: true });
  const stepsAnim = useStaggerAnimation({ threshold: 0.1 });

  return (
    <div className="grid md:grid-cols-2 items-center gap-8 lg:gap-12">
      <div
        ref={textAnim.ref}
        className={`transition-all duration-[900ms] ease-out ${textAnim.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
      >
        <div ref={badgeAnim.ref} className={`transition-all duration-700 ${badgeAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-insecap-blue/10 border border-insecap-blue/20 text-insecap-blue text-xs font-semibold tracking-wide uppercase mb-6">
            <Mic className="w-3.5 h-3.5" />
            Plataforma para Relatores
          </span>
        </div>
        <h3 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-[1.1] mb-6">
          Gestiona tu labor<br />
          <span className="text-insecap-blue">docente</span><br />
          desde tu celular
        </h3>
        <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl">{relatoresData.description}</p>
        <div ref={stepsAnim.ref} className="flex flex-wrap items-center gap-3 mb-8">
          {relatoresSteps.map((step, i) => (
            <React.Fragment key={i}>
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 transition-all duration-500 ${stepsAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: stepsAnim.isVisible ? stepsAnim.getDelay(i, 120) : '0ms' }}
              >
                {step.icon}{step.title}
              </span>
              {i < relatoresSteps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>
        <div className={`flex flex-wrap items-center gap-3 transition-all duration-700 delay-500 ${textAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <AppStoreBadge />
          <GooglePlayBadge />
        </div>
      </div>
      <div
        ref={phoneAnim.ref}
        className={`flex justify-center transition-all duration-[1000ms] ease-out delay-300 ${phoneAnim.isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95'}`}
      >
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-blue-300/30 blur-3xl" />
          <div className="phone-float relative">
            <PhoneMockup>
              <img src="/mockups/RelatoresYA.png" alt="RelatoresYA app" className="w-full h-full object-cover object-top" />
            </PhoneMockup>
            <div className="glow-ring absolute -bottom-3 left-1/2 w-[70%] h-4 bg-blue-300/60 blur-xl rounded-full" />
          </div>
          <div className="absolute -right-8 top-8 grid grid-cols-4 gap-2 opacity-40">
            {Array.from({ length: 16 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-insecap-blue" />)}
          </div>
          <div className="absolute -left-8 bottom-8 grid grid-cols-4 gap-2 opacity-25">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

const slidesConfig = [
  { id: 'autoservicio', label: 'Autoservicio del Cliente', accent: 'from-indigo-500 to-purple-600', orb1Color: 'bg-purple-200/50', orb2Color: 'bg-indigo-200/40', orb3Color: 'bg-violet-100/60', dotColor: '#818cf8' },
  { id: 'relatores',    label: 'RelatoresYA',              accent: 'from-insecap-blue to-cyan-500', orb1Color: 'bg-blue-200/50',   orb2Color: 'bg-indigo-200/40', orb3Color: 'bg-cyan-100/60',   dotColor: '#60a5fa' },
];

/* ── Main Section ────────────────────────────────────── */
export default function InnovationSection() {
  const [active, setActive] = useState(0);
  const headerAnim = useScrollAnimation({ threshold: 0.2 });

  const prev = () => setActive(i => (i - 1 + slidesConfig.length) % slidesConfig.length);
  const next = () => setActive(i => (i + 1) % slidesConfig.length);
  const slide = slidesConfig[active];

  return (
    <section className="relative py-24 overflow-hidden bg-white">
      <style>{`
        @keyframes floatPhone{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        .phone-float{animation:floatPhone 4s ease-in-out infinite}
        @keyframes pulseGlowLight{0%,100%{opacity:.4;transform:translateX(-50%) scaleX(1)}50%{opacity:.75;transform:translateX(-50%) scaleX(1.2)}}
        .glow-ring{animation:pulseGlowLight 4s ease-in-out infinite}
        @keyframes orb1kf{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.1)}}
        @keyframes orb2kf{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,25px) scale(1.08)}}
        .orb-1{animation:orb1kf 8s ease-in-out infinite}
        .orb-2{animation:orb2kf 10s ease-in-out infinite}
        @keyframes slideInRight{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
        .slide-enter{animation:slideInRight .5s cubic-bezier(.22,.68,0,1.1) both}
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-insecap-blue/[0.08] to-purple-600/[0.08] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-400/[0.08] to-purple-500/[0.08] blur-3xl" />
      </div>

      <div className="container mx-auto px-8 md:px-14 lg:px-16 relative z-10">
        <div
          ref={headerAnim.ref}
          className={`text-center mb-12 transition-all duration-700 ease-out ${headerAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-insecap-blue/10 text-insecap-blue text-sm font-semibold tracking-wide uppercase mb-4">
            Tecnología & Educación
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 mb-4">Innovación</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Llevamos la capacitación al siguiente nivel con herramientas digitales diseñadas para ti.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
            {slidesConfig.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${i === active ? 'bg-insecap-blue text-white border-insecap-blue shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-insecap-blue/40 hover:text-insecap-blue'}`}
              >
                <span className={`w-2 h-2 rounded-full ${i === active ? 'bg-white' : 'bg-slate-300'}`} />
                {s.label}
              </button>
            ))}
          </div>

          <div className="relative rounded-3xl border border-blue-100 overflow-hidden shadow-xl">
            <div className={`h-1.5 bg-gradient-to-r ${slide.accent} transition-all duration-500`} />
            <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/40 px-8 md:px-14 py-14">
              <div className="absolute inset-0 opacity-[0.28] pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, ${slide.dotColor} 1px, transparent 1px)`, backgroundSize: '28px 28px' }} />
              <div className={`orb-1 absolute top-[-60px] right-[8%] w-[360px] h-[360px] rounded-full ${slide.orb1Color} blur-[100px] pointer-events-none`} />
              <div className={`orb-2 absolute bottom-[-50px] left-[4%] w-[300px] h-[300px] rounded-full ${slide.orb2Color} blur-[90px] pointer-events-none`} />
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full ${slide.orb3Color} blur-[75px] pointer-events-none`} />
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]" preserveAspectRatio="none" viewBox="0 0 1200 600">
                <line x1="0" y1="600" x2="1200" y2="0" stroke="#3b82f6" strokeWidth="150" />
              </svg>
              <div key={active} className="slide-enter relative z-10">
                {active === 0 ? <SlideAutoservicio /> : <SlideRelatores />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 px-1">
            <button onClick={prev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:border-insecap-blue/50 hover:text-insecap-blue hover:shadow-sm transition-all duration-200 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Anterior
            </button>
            <div className="flex gap-2">
              {slidesConfig.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${i === active ? 'w-6 h-2.5 bg-insecap-blue' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`} />
              ))}
            </div>
            <button onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-insecap-blue text-white text-sm font-medium hover:bg-insecap-blue/90 hover:shadow-md transition-all duration-200 group">
              Siguiente
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
