import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { getLiderComercial, LiderComercial } from '@/lib/tmsApi';
import ContactCTA from './ContactCTA';

const HERO_BACKGROUNDS = [
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_111938161.png?v=1772461187',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Banner-Nosotros-Web-16-anos-scaled.jpg?v=1767878773',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Cascada-fachada-y-letrero-scaled.jpg?v=1767971535',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Sede-Antofagasta-web.jpg?v=1768245326',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112057871.png?v=1772461266',
  'https://cdn.shopify.com/s/files/1/0711/9827/7676/files/imagen_2026-03-02_112143481.png?v=1772461310',
];

// Componentes de iconos personalizados
const XIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.34-.14-3.41.37-1.33.64-2.18 2.08-2.1 3.59.08 1.48 1.21 2.74 2.66 2.96 1.34.23 2.73-.24 3.63-1.23.54-.59.81-1.35.81-2.14V.02Z"/>
  </svg>
);

const Footer = () => {
  const [lider, setLider] = useState<LiderComercial | null>(null);
  const [loadingLider, setLoadingLider] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getLiderComercial().then((data) => {
      setLider(data);
      setLoadingLider(false);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      opacity: number;
      life: number; maxLife: number;
      color: string;
    };

    const COLORS = ['255,255,255', '0,184,222', '72,92,199'];
    const createParticle = (spread = false): Particle => {
      const maxLife = Math.random() * 220 + 100;
      return {
        x: Math.random() * (canvas.width || 800),
        y: spread ? Math.random() * (canvas.height || 400) : (canvas.height || 400) + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.7 + 0.25),
        radius: Math.random() * 2.2 + 0.4,
        opacity: 0,
        life: spread ? Math.floor(Math.random() * maxLife) : 0,
        maxLife,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    };

    const particles: Particle[] = Array.from({ length: 70 }, () => createParticle(true));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.maxLife;
        p.opacity = (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1) * 0.65;

        // glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        glow.addColorStop(0, `rgba(${p.color},${p.opacity})`);
        glow.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${Math.min(p.opacity * 1.8, 1)})`;
        ctx.fill();

        if (p.life >= p.maxLife || p.y < -10) {
          particles[i] = createParticle();
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contacto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const locations = [
    { name: "Sucursal Antofagasta", address: "Copiapó 956, Antofagasta", phone: "55 294 8575" },
    { name: "Casa Matríz", address: "La Cascada 1513, Calama", phone: "55 292 6431" },
    { name: "Sucursal Santiago", address: "Valenzuela Castillo 1063, Santiago", phone: "+56 9 8819 8254" },
  ];

  const siteMap = [
    { label: "Inicio", href: "/" },
    { label: "Cursos", href: "/cursos" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ];

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="gradient-footer text-white" id="footer-root">

      <ContactCTA />

      {/* ── Hero strip "Creciendo Juntos" con parallax ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('${HERO_BACKGROUNDS[bgIndex]}')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out',
        }}
      >
        {/* Overlay degradado para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-insecap-blue/90 via-insecap-blue/75 to-[#2952cc]/80 z-[1]" />
        {/* Canvas de partículas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
        />
        <div className="relative z-10 container mx-auto px-8 md:px-14 lg:px-16 py-14 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            {/* Headline */}
            <div className="lg:max-w-lg">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold italic text-white leading-tight tracking-tight">
                " Creciendo<br />Juntos "
              </h2>
            </div>
            {/* Right side */}
            <div className="lg:max-w-md">
              <p className="text-white/80 text-base mb-7 leading-relaxed">
                ¿Tu empresa necesita capacitación certificada? Somos el socio estratégico que impulsa el desarrollo profesional de tus equipos en todo Chile.
              </p>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 bg-insecap-cyan hover:bg-insecap-cyan/90 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-insecap-cyan/30 hover:-translate-y-0.5"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-8 md:px-14 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo & Social */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex mb-6" onClick={handleLogoClick}>
              <img src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Insecap_Logo-07.png?v=1767801508" alt="logo" className="w-48" />
            </Link>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://instagram.com/insecapcapacitacion" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/insecap" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/insecap" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <XIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/insecap" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/@insecap" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Ubicaciones */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-bold text-lg text-white mb-5 uppercase tracking-widest">Ubicaciones</h4>
            <div className="space-y-5">
              {locations.map((loc) => (
                <div key={loc.name} className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-insecap-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white text-sm">{loc.name}</p>
                    <p className="text-white/70 text-sm mt-0.5">{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contáctanos */}
          <div>
            <h4 className="font-bold text-lg text-white mb-5 uppercase tracking-widest">Contáctanos</h4>
            <div className="space-y-4">
              {[
                { sucursal: 'Sucursal Antofagasta', phone: '55 294 8575', tel: '552948575' },
                { sucursal: 'Casa Matríz (Calama)', phone: '55 292 6431', tel: '552926431' },
                { sucursal: 'Sucursal Santiago', phone: '+56 9 8819 8254', tel: '+56988198254' },
              ].map((c) => (
                <div key={c.tel}>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">{c.sucursal}</p>
                  <a href={`tel:${c.tel}`} className="flex items-center gap-2 text-white/80 text-sm hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-insecap-cyan flex-shrink-0" />
                    {c.phone}
                  </a>
                </div>
              ))}
              {lider?.correo && (
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Correo</p>
                  <a href={`mailto:${lider.correo}`} className="flex items-center gap-2 text-white/80 text-sm hover:text-white transition-colors">
                    <Mail className="w-4 h-4 text-insecap-cyan flex-shrink-0" />
                    {lider.correo}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mapa Web */}
          <div>
            <h4 className="font-bold text-lg text-white mb-5 uppercase tracking-widest">Mapa Web</h4>
            <ul className="space-y-3">
              {siteMap.map((item) => {
                const isAnchor = item.href.includes('#');
                const anchorId = isAnchor ? item.href.split('#')[1] : null;
                const handleClick = (e: React.MouseEvent) => {
                  if (!anchorId) return;
                  const el = document.getElementById(anchorId);
                  if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
                };
                return (
                  <li key={item.label}>
                    <Link to={item.href} onClick={handleClick} className="text-white/70 text-sm hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Insecap Capacitación. Todos los derechos reservados.
          </p>
          <a
            href="/politica-de-privacidad"
            className="text-sm text-white/60 hover:text-white transition-colors duration-200 underline underline-offset-4"
          >
            Política de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;