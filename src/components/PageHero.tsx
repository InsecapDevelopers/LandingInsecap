import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

const PageHero = ({ 
  title, 
  subtitle, 
  backgroundImage = "https://cdn.shopify.com/s/files/1/0711/9827/7676/files/E-Sala-6-Image-2024-08-05-at-13.13.42-2.jpg?v=1769004992", 
  breadcrumbs,
  className
}: PageHeroProps) => {
  return (
    <section 
      className={`relative w-full h-[450px] flex items-center overflow-hidden ${className || ''}`}
    >
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          <span className="text-blue-400 font-semibold uppercase tracking-wider text-sm mb-4 block animate-in fade-in slide-in-from-left-4 duration-700">
            {subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-in fade-in slide-in-from-left-6 duration-1000">
            {title}
          </h1>
          <nav className="flex text-sm text-slate-300 gap-2 items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to="/" className="hover:text-blue-400 transition-colors">Inicio</Link>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <span className="text-slate-500">/</span>
                {item.href ? (
                  <Link to={item.href} className="hover:text-blue-400 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PageHero;