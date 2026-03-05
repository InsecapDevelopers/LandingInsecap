import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Phone, Mail } from 'lucide-react';
import ContactCTA from './ContactCTA';
import { getLiderComercial, LiderComercial } from '@/lib/tmsApi';

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

const SkeletonLider = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex-shrink-0" />
    <div className="space-y-2">
      <div className="h-4 w-32 rounded bg-primary-foreground/20" />
      <div className="h-3 w-48 rounded bg-primary-foreground/20" />
      <div className="h-3 w-36 rounded bg-primary-foreground/20" />
    </div>
  </div>
);

const Footer = () => {
  const [lider, setLider] = useState<LiderComercial | null>(null);
  const [loadingLider, setLoadingLider] = useState(true);

  useEffect(() => {
    getLiderComercial().then((data) => {
      setLider(data);
      setLoadingLider(false);
    });
  }, []);

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
    <footer className="gradient-footer text-primary-foreground">

      <ContactCTA />

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Social */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6" onClick={handleLogoClick}>
              <img src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Insecap_Logo-07.png?v=1767801508" alt="logo" className="w-60" />
            </Link>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/..." className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/..." className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/..." className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-all">
                <XIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/..." className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://tiktok.com/..." className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-all">
                <TikTokIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Locations */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-lg mb-6">Ubicaciones</h4>
            <div className="grid sm:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <div key={loc.name}>
                  <h5 className="font-medium text-secondary mb-2">{loc.name}</h5>
                  <p className="text-sm text-primary-foreground/70">{loc.address}</p>
                  <a href={`tel:${loc.phone}`} className="text-sm text-secondary hover:underline">{loc.phone}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Mapa Web</h4>
            <ul className="space-y-3">
              {siteMap.map((item) => {
                const isAnchor = item.href.includes('#');
                const anchorId = isAnchor ? item.href.split('#')[1] : null;

                const handleClick = (e: React.MouseEvent) => {
                  if (!anchorId) return;
                  const el = document.getElementById(anchorId);
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                };

                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      onClick={handleClick}
                      className="text-sm text-primary-foreground/70 hover:text-secondary flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Líder Comercial de Turno */}
        {(loadingLider || lider) && (
          <div className="mt-10 pt-8 border-t border-primary-foreground/10">
            <h4 className="font-semibold text-lg mb-4">Tu Líder Comercial</h4>

            {loadingLider && <SkeletonLider />}

            {!loadingLider && lider && (
              <div className="flex items-center gap-4">
                {lider.foto ? (
                  <img
                    src={lider.foto}
                    alt={lider.nombre}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
                    {lider.nombre.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{lider.nombre}</p>
                  <a
                    href={`mailto:${lider.correo}`}
                    className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    {lider.correo}
                  </a>
                  <a
                    href={`tel:${lider.telefono}`}
                    className="text-sm text-white/80 hover:text-white hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {lider.telefono}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-2 text-center md:text-left">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Insecap Capacitación.
          </p>
          <a
            href="/politica-de-privacidad"
            className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-200 underline underline-offset-4"
          >
            Política de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;