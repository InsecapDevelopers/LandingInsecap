'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArgentinaFlag, BrazilFlag, ChileFlag, ParaguayFlag } from '@/app/components/flags/CountryFlags';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

interface Section {
  href: string;
  label: string;
  subsections?: { href: string; label: string }[];
}

type Country = 'ar' | 'br' | 'cl' | 'py' | null;

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);
  const [isTransparent, setIsTransparent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const sections: Section[] = [
    { href: '/overview', label: 'Inicio' },
    {
      href: '/corredor',
      label: 'El Corredor',
      subsections: [
        { href: '/corredor', label: '¿Qué es el corredor?' }
      ]
    },
    {
      href: '/infraestructura',
      label: 'Infraestructura',
      subsections: [
        { href: '/infraestructura/rutas', label: 'Rutas y Tramos' },
        { href: '/infraestructura/pasos-fronterizos', label: 'Pasos Fronterizos' },
        { href: '/infraestructura/tiempos-distancias', label: 'Tiempos y Distancias' }
      ]
    },
    {
      href: '/servicios',
      label: 'Servicios',
      subsections: [
        { href: '/servicios/documentacion', label: 'Documentación' },
        { href: '/servicios/logistica', label: 'Servicios Logísticos' }
      ]
    },
    { href: '/investigacion', label: 'Investigación' },
    {
      href: '/gis',
      label: 'GIS',
      subsections: [
        { href: '/gis', label: 'GIS' },
        { href: '/observatorio', label: 'Observatorio' }
      ]
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Tamaño grande cuando está arriba (cualquier página)
      setIsAtTop(scrollY < 100);

      // Transparente en todas las páginas cuando está arriba, excepto GIS (fondo blanco)
      setIsTransparent(scrollY < 100 && pathname !== '/gis');
    };

    // Ejecutar al montar y al cambiar de ruta
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isActive = (section: Section): boolean => {
    if (pathname === section.href) return true;
    if (section.subsections) {
      return section.subsections.some(sub => pathname === sub.href);
    }
    return false;
  };

  return (
    <motion.nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[9999] transition-all duration-300',
        isAtTop ? 'pt-0 px-0' : 'py-2 px-2 md:px-4'
      )}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <motion.div
        className={cn(
          'mx-auto transition-all duration-300',
          isAtTop
            ? isTransparent
              ? 'max-w-full bg-transparent backdrop-blur-none'
              : 'max-w-full bg-white/95 backdrop-blur-md shadow-lg border border-gray-200'
            : 'max-w-[95vw] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl bg-white/95 backdrop-blur-md shadow-lg rounded-full border border-gray-200'
        )}
        layout
      >
        <div className={cn(
          'flex items-center justify-between gap-2 transition-all duration-300',
          isAtTop ? 'px-4 md:px-6 py-3' : 'px-3 md:px-4 lg:px-6 py-2'
        )}>
          {/* Logo & Branding */}
          <Link href="/overview" className="flex-shrink-0">
            <motion.div
              className="flex items-center gap-2 md:gap-3 cursor-pointer"
              layout
            >
              <img
                src="/images/logo.png"
                alt="CILOG Logo"
                className={cn(
                  'object-contain transition-all duration-300',
                  isAtTop ? 'w-14 h-14 md:w-16 md:h-16' : 'w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12'
                )}
              />
              <div className={cn(
                'border-l pl-2 md:pl-3 transition-all duration-300',
                isTransparent ? 'border-white/30' : 'border-gray-300',
                !isAtTop && 'hidden md:block'
              )}>
                <h1 className={cn(
                  'font-bold leading-tight transition-all duration-300 whitespace-nowrap',
                  isAtTop ? 'text-base md:text-lg' : 'text-sm md:text-base',
                  isTransparent ? 'text-white' : 'text-[#1E3A5F]'
                )}>
                  CILOG
                </h1>
                {isAtTop && (
                  <motion.p
                    className={cn("text-xs leading-tight hidden md:block", isTransparent ? "text-white/80" : "text-gray-500")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Centro de Investigación Logística
                  </motion.p>
                )}
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className={cn(
            "hidden xl:flex items-center flex-1 justify-center",
            isAtTop ? "gap-2" : "gap-1"
          )}>
            {sections.map((section) => (
              <div
                key={section.href}
                className="relative group"
                onMouseEnter={() => setHoveredSection(section.href)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <Link href={section.subsections ? section.subsections[0].href : section.href}>
                  <motion.button
                    className={cn(
                      'rounded-full font-medium transition-all flex items-center whitespace-nowrap relative z-10 focus:outline-none',
                      isAtTop
                        ? 'px-3 py-2 text-sm gap-1'
                        : 'px-2 py-1.5 text-xs gap-0.5',
                      // Página activa con hover en otro botón
                      isActive(section) && hoveredSection !== null && hoveredSection !== section.href
                        ? isTransparent ? 'text-white' : 'text-[#1E3A5F]'
                        // Hover activo o página activa sin hover en otro: texto blanco
                        : (hoveredSection === section.href || (isActive(section) && hoveredSection === null))
                          ? 'text-white'
                          // Estado normal
                          : isTransparent ? 'text-white/90' : 'text-gray-700'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Borde animado: visible solo cuando hay hover en otro item */}
                    {isActive(section) && hoveredSection !== null && hoveredSection !== section.href && (
                      <motion.div
                        className={cn(
                          'absolute inset-0 rounded-full border-2 pointer-events-none',
                          isTransparent ? 'border-white' : 'border-[#1E3A5F]'
                        )}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    {/* Fondo para hover o página activa sin hover */}
                    {(hoveredSection === section.href || (isActive(section) && hoveredSection === null)) && (
                      <motion.div
                        layoutId="navHover"
                        className={cn(
                          "absolute inset-0 rounded-full",
                          isTransparent ? "bg-white/25" : "bg-[#1E3A5F]"
                        )}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30
                        }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <span className="relative z-10">{section.label}</span>
                    {section.subsections && (
                      <ChevronDown className={cn(
                        "opacity-60 relative z-10",
                        isAtTop ? "w-3 h-3" : "w-2.5 h-2.5"
                      )} />
                    )}
                  </motion.button>
                </Link>

                {/* Desktop Dropdown */}
                {section.subsections && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-55 z-50 py-1 overflow-hidden">
                    {section.subsections.map((subsection) => (
                      <Link key={subsection.href} href={subsection.href}>
                        <motion.button
                          className={cn(
                            'block w-full text-left px-4 py-2.5 text-sm transition-colors focus:outline-none',
                            pathname === subsection.href
                              ? 'bg-[#1E3A5F] text-white font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                          whileHover={{ x: 4 }}
                        >
                          {subsection.label}
                        </motion.button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions (Country Flags + Login) */}
          <div className={cn(
            "hidden xl:flex items-center flex-shrink-0",
            isAtTop ? "gap-4" : "gap-2"
          )}>
            {/* Country Flags */}
            <div className={cn(
              "flex items-center",
              isAtTop ? "gap-1.5" : "gap-1"
            )}>
              <motion.button
                onClick={() => setSelectedCountry('ar')}
                className={cn(
                  'rounded-md transition-all focus:outline-none',
                  isAtTop ? 'p-1' : 'p-0.5',
                  selectedCountry === 'ar'
                    ? 'ring-2 ring-offset-1 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105',
                  isTransparent ? 'ring-white ring-offset-transparent' : 'ring-[#1E3A5F] ring-offset-white'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Argentina"
              >
                <ArgentinaFlag className={isAtTop ? "w-8 h-5" : "w-6 h-4"} />
              </motion.button>
              <motion.button
                onClick={() => setSelectedCountry('br')}
                className={cn(
                  'rounded-md transition-all focus:outline-none',
                  isAtTop ? 'p-1' : 'p-0.5',
                  selectedCountry === 'br'
                    ? 'ring-2 ring-offset-1 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105',
                  isTransparent ? 'ring-white ring-offset-transparent' : 'ring-[#1E3A5F] ring-offset-white'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Brasil"
              >
                <BrazilFlag className={isAtTop ? "w-8 h-5" : "w-6 h-4"} />
              </motion.button>
              <motion.button
                onClick={() => setSelectedCountry('cl')}
                className={cn(
                  'rounded-md transition-all focus:outline-none',
                  isAtTop ? 'p-1' : 'p-0.5',
                  selectedCountry === 'cl'
                    ? 'ring-2 ring-offset-1 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105',
                  isTransparent ? 'ring-white ring-offset-transparent' : 'ring-[#1E3A5F] ring-offset-white'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Chile"
              >
                <ChileFlag className={isAtTop ? "w-8 h-5" : "w-6 h-4"} />
              </motion.button>
              <motion.button
                onClick={() => setSelectedCountry('py')}
                className={cn(
                  'rounded-md transition-all focus:outline-none',
                  isAtTop ? 'p-1' : 'p-0.5',
                  selectedCountry === 'py'
                    ? 'ring-2 ring-offset-1 scale-105'
                    : 'opacity-70 hover:opacity-100 hover:scale-105',
                  isTransparent ? 'ring-white ring-offset-transparent' : 'ring-[#1E3A5F] ring-offset-white'
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Paraguay"
              >
                <ParaguayFlag className={isAtTop ? "w-8 h-5" : "w-6 h-4"} />
              </motion.button>
            </div>

            {/* Login Button with Magic UI */}
            <Link href="/login">
              <InteractiveHoverButton
                className={cn(
                  "bg-[#1E3A5F] hover:bg-[#2a4f7c] text-white border-[#1E3A5F] transition-all whitespace-nowrap",
                  isAtTop
                    ? "!px-4 md:!px-5 lg:!px-6 !py-2 text-sm md:text-base"
                    : "!px-3 md:!px-4 !py-1 md:!py-1.5 text-xs md:text-sm"
                )}
              >
                Área Privada
              </InteractiveHoverButton>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild className="xl:hidden flex-shrink-0">
              <Button suppressHydrationWarning variant="ghost" size="icon" className={cn(
                "transition-all",
                isAtTop ? "h-10 w-10" : "h-8 w-8",
                isTransparent ? "text-white hover:bg-white/20" : ""
              )}>
                <Menu className={cn(
                  "transition-all",
                  isAtTop ? "w-5 h-5" : "w-4 h-4"
                )} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-100 !bg-white">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/logo.png"
                      alt="CILOG Logo"
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-[#1E3A5F]">CILOG</h2>
                      <p className="text-xs text-gray-600">Centro de Investigación Logística</p>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Navigation */}
              <div className="mt-6 flex flex-col gap-2">
                {sections.map((section) => (
                  <div key={section.href}>
                    {section.subsections ? (
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === section.href ? null : section.href)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-left transition-colors font-medium focus:outline-none',
                          isActive(section)
                            ? 'bg-[#1E3A5F] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {section.label}
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform',
                            openSubmenu === section.href && 'rotate-180'
                          )}
                        />
                      </button>
                    ) : (
                      <Link href={section.href}>
                        <button
                          onClick={() => setIsSheetOpen(false)}
                          className={cn(
                            'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-left transition-colors font-medium focus:outline-none',
                            isActive(section)
                              ? 'bg-[#1E3A5F] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          )}
                        >
                          {section.label}
                        </button>
                      </Link>
                    )}

                    {/* Mobile Submenu */}
                    <AnimatePresence>
                      {section.subsections && openSubmenu === section.href && (
                        <motion.div
                          className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-gray-200 pl-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {section.subsections.map((subsection) => (
                            <Link key={subsection.href} href={subsection.href}>
                              <button
                                onClick={() => {
                                  setIsSheetOpen(false);
                                  setOpenSubmenu(null);
                                }}
                                className={cn(
                                  'w-full px-3 py-2 rounded-md text-sm text-left transition-colors focus:outline-none',
                                  pathname === subsection.href
                                    ? 'bg-[#1E3A5F] text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                )}
                              >
                                {subsection.label}
                              </button>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <div>
                  <p className="text-xs text-gray-600 mb-2">País:</p>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedCountry('ar')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        selectedCountry === 'ar'
                          ? 'bg-[#1E3A5F]/10 ring-2 ring-[#1E3A5F]'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                      aria-label="Argentina"
                    >
                      <ArgentinaFlag className="w-12 h-8 mx-auto" />
                    </button>
                    <button
                      onClick={() => setSelectedCountry('br')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        selectedCountry === 'br'
                          ? 'bg-[#1E3A5F]/10 ring-2 ring-[#1E3A5F]'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                      aria-label="Brasil"
                    >
                      <BrazilFlag className="w-12 h-8 mx-auto" />
                    </button>
                    <button
                      onClick={() => setSelectedCountry('cl')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        selectedCountry === 'cl'
                          ? 'bg-[#1E3A5F]/10 ring-2 ring-[#1E3A5F]'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                      aria-label="Chile"
                    >
                      <ChileFlag className="w-12 h-8 mx-auto" />
                    </button>
                    <button
                      onClick={() => setSelectedCountry('py')}
                      className={cn(
                        'p-2 rounded-lg transition-all',
                        selectedCountry === 'py'
                          ? 'bg-[#1E3A5F]/10 ring-2 ring-[#1E3A5F]'
                          : 'bg-gray-100 hover:bg-gray-200'
                      )}
                      aria-label="Paraguay"
                    >
                      <ParaguayFlag className="w-12 h-8 mx-auto" />
                    </button>
                  </div>
                </div>

                <Link href="/login" className="block">
                  <InteractiveHoverButton className="w-full bg-[#1E3A5F] hover:bg-[#2a4f7c] text-white border-[#1E3A5F]">
                    Área Privada
                  </InteractiveHoverButton>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </motion.nav>
  );
};
