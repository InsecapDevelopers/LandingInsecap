import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { Button } from '@/components/ui/button';
import { RippleButton } from "@/components/ui/ripple-button";
import CartDrawer from './CartDrawer';
import { isEcommerceEnabled } from '@/lib/featureFlags';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
type NavItem = {
  label: string;
  href: string;
  isLink?: boolean;
  isAnchor?: boolean;
  dropdown?: {
    label: string;
    href: string;
    isLink?: boolean;
    isAnchor?: boolean;
  }[];
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Inicio', href: '/', isLink: true },
    {
      label: 'Cursos',
      href: '/cursos',
      dropdown: [
        { label: 'Listado de cursos', href: '/cursos', isLink: true },
      ]
    },
    {
      label: 'Nosotros',
      href: '/nosotros',
      dropdown: [
        { label: 'Nosotros', href: '/nosotros', isLink: true },
        { label: 'Nuestro Equipo', href: '/nuestro-equipo', isLink: true },
        { label: 'Experiencia y Respaldo', href: '/Experiencia-y-Respaldo', isLink: true },
        { label: 'Equipo Honor y Felicidad', href: '/equipo-honor', isLink: true },
        { label: 'Política de Calidad', href: '/politica-calidad', isLink: true },
        { label: 'Contáctanos', href: '#contacto', isAnchor: true },
      ]
    },
    {
      label: '¿Quieres ser Relator?',
      href: '/relator-trabaja-con-nosotros',
      isLink: true,
      dropdown: [
        { label: 'Trabaja con Nosotros', href: '/relator-trabaja-con-nosotros', isLink: true },
      ]
    },
    {
      label: 'Noticias',
      href: '/noticias',
      isLink: true,
    }
  ];

  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-500 ease-in-out">
      {/* Main Navigation */}
      <nav
        className={`transition-all duration-500 ease-in-out ${isAtTop
          ? 'bg-transparent py-3 px-6 md:px-10'
          : 'bg-gradient-to-r from-insecap-cyan/85 to-insecap-blue/95 border-b border-white/15 shadow-xl py-1.5 px-6 md:px-10'
          }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
            <div className="text-primary-foreground font-bold text-2xl flex items-center">
              <img
                src="https://cdn.shopify.com/s/files/1/0711/9827/7676/files/Insecap_Logo-07.png?v=1767801508"
                alt="insecap logo"
                className={`object-contain transition-all duration-500 ease-in-out ${isAtTop ? 'w-60' : 'w-40'
                  }`}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center transition-all duration-500 ${isAtTop ? 'gap-6' : 'gap-4'}`}>
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.isLink ? (
                  <Link
                    to={item.href}
                    className={`text-primary-foreground/90 hover:text-primary-foreground flex items-center gap-1 py-2 font-medium transition-all duration-300 ${isAtTop ? 'text-sm' : 'text-xs'
                      }`}
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </Link>
                ) : item.isAnchor ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`text-primary-foreground/90 hover:text-primary-foreground flex items-center gap-1 py-2 font-medium transition-all duration-300 cursor-pointer ${isAtTop ? 'text-sm' : 'text-xs'
                      }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={`text-primary-foreground/90 hover:text-primary-foreground flex items-center gap-1 py-2 font-medium transition-all duration-300 cursor-pointer ${isAtTop ? 'text-sm' : 'text-xs'
                      }`}
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </span>
                )}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 bg-card rounded-md shadow-card-hover py-2 min-w-[200px] animate-fade-in">
                    {item.dropdown.map((subItem) => (
                      subItem.isLink ? (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ) : subItem.isAnchor ? (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          onClick={(e) => {
                            e.preventDefault();
                            document.querySelector(subItem.href)?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          {subItem.label}
                        </a>
                      ) : (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          {subItem.label}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Access Buttons & Cart */}
          <div className="hidden lg:flex items-center gap-3">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`bg-sky-500 text-white hover:bg-sky-400 hover:text-white focus:bg-sky-400 focus:text-white data-[state=open]:bg-sky-400 data-[state=open]:text-white transition-all duration-500 border-none ${isAtTop ? 'h-9 px-4 text-sm' : 'h-8 px-3 text-xs'}`}
                  >
                    Acceso
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="flex flex-col w-[200px] p-2 bg-popover rounded-md shadow-md gap-1">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="https://tms.insecap.cl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted hover:text-primary transition-colors rounded-md select-none"
                          >
                            Acceso Clientes
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            href="https://portal.insecap.cl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-popover-foreground hover:bg-muted hover:text-primary transition-colors rounded-md select-none"
                          >
                            Acceso Alumnos
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {isEcommerceEnabled && <CartDrawer />}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-primary-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gradient-to-br from-insecap-cyan/85 to-insecap-blue/95 border border-white/15 mt-3 rounded-lg p-4 animate-fade-in max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-primary-foreground/10 last:border-0">
                <div className="flex items-center justify-between">
                  {item.isLink ? (
                    <Link
                      to={item.href}
                      className="block py-3 text-primary-foreground/90 hover:text-primary-foreground flex-grow"
                      onClick={() => !item.dropdown && setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : item.isAnchor ? (
                    <a
                      href={item.href}
                      className="block py-3 text-primary-foreground/90 hover:text-primary-foreground flex-grow"
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                        setIsMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className="block w-full text-left py-3 text-primary-foreground/90 hover:text-primary-foreground"
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                    >
                      {item.label}
                    </button>
                  )}
                  {item.dropdown && (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      className="p-3 text-primary-foreground/90"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {item.dropdown && activeDropdown === item.label && (
                  <div className="pl-4 pb-3 flex flex-col gap-2 animate-fade-in">
                    {item.dropdown.map((subItem) => (
                      subItem.isLink ? (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ) : subItem.isAnchor ? (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          onClick={(e) => {
                            e.preventDefault();
                            document.querySelector(subItem.href)?.scrollIntoView({ behavior: "smooth" });
                            setIsMenuOpen(false);
                          }}
                          className="block py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          {subItem.label}
                        </a>
                      ) : (
                        <a
                          key={subItem.label}
                          href={subItem.href}
                          className="block py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          {subItem.label}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 mt-4">
              <a href="https://tms.insecap.cl" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-sm">
                  Acceso Clientes
                </Button>
              </a>
              <a href="https://portal.insecap.cl" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-sky-500 text-white hover:bg-sky-400 text-sm">
                  Acceso Alumnos
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>
      {/* Scroll progress bar — visible solo cuando se ha scrolleado */}
      {!isAtTop && (
        <ScrollProgress className="bg-white" />
      )}
    </header>
  );
};

export default Header;
