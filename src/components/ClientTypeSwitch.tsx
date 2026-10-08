import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { CalendarDays, Cog } from 'lucide-react';
import { SAP_HREF } from '@/lib/sapCatalog';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { useTranslation } from 'react-i18next';

interface ClientTypeSwitchProps {
  // 'abiertos' reemplaza al antiguo 'particular': el catálogo B2C dejó de ofrecerse.
  activeMode: 'empresa' | 'abiertos' | 'sap';
}

export const ClientTypeSwitch = ({ activeMode }: ClientTypeSwitchProps) => {
  const { localizedPath } = useLocalizedPath();
  const { i18n } = useTranslation();
  // Pestaña resaltada: cambia al hacer clic, antes de que cargue la página siguiente.
  const [selected, setSelected] = useState(activeMode);
  const reduceMotion = useReducedMotion();

  const content = {
    es: {
      clientTypeLabel: 'Tipo de cliente',
      peopleClient: 'Cursos Abiertos',
      businessClient: 'Empresa',
      sap: 'Especialidad SAP',
    },
    en: {
      clientTypeLabel: 'Client type',
      peopleClient: 'Open Courses',
      businessClient: 'Corporate',
      sap: 'SAP Specialization',
    },
    pt: {
      clientTypeLabel: 'Tipo de cliente',
      peopleClient: 'Cursos Abertos',
      businessClient: 'Empresa',
      sap: 'Especialização SAP',
    },
  };

  const locale = (i18n.language?.split('-')[0] || 'es') as 'es' | 'en' | 'pt';
  const messages = content[locale] || content['es'];

  const tabs = [
    { mode: 'empresa' as const, to: '/cursos', label: messages.businessClient, Icon: null },
    { mode: 'abiertos' as const, to: '/cursos-abiertos', label: messages.peopleClient, Icon: CalendarDays },
    { mode: 'sap' as const, to: SAP_HREF, label: messages.sap, Icon: Cog },
  ];

  return (
    <div className="relative z-30 -mt-8 mb-8">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <div className="rounded-2xl bg-card shadow-xl px-6 py-5 md:px-8 md:py-6">
          <nav aria-label={messages.clientTypeLabel} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
            <span className="text-sm text-muted-foreground">{messages.clientTypeLabel}:</span>
            {/* En móvil las tres pestañas no caben en una fila: se apilan */}
            <ul className="flex w-full flex-col gap-1 rounded-2xl border border-border bg-muted/70 p-1 sm:flex-row sm:rounded-full md:w-auto">
              {tabs.map(({ mode, to, label, Icon }) => {
                const isSelected = selected === mode;
                return (
                  <li key={mode} className="flex flex-1 md:flex-none">
                    <Link
                      to={localizedPath(to)}
                      aria-current={mode === activeMode ? 'page' : undefined}
                      onClick={() => setSelected(mode)}
                      className={`relative flex h-10 flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-insecap-blue focus-visible:ring-offset-2 md:flex-none ${
                        isSelected ? 'text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isSelected && (
                        // Píldora compartida: se desliza a la pestaña elegida al hacer clic (layoutId) y la
                        // página siguiente la monta ya en su lugar. Sin animación inicial (HTML prerenderizado).
                        <motion.span
                          layoutId="client-type-pill"
                          initial={false}
                          transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }}
                          className="absolute inset-0 rounded-full bg-insecap-blue shadow-sm"
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative flex items-center">
                        {Icon && <Icon className="mr-2 h-4 w-4" aria-hidden="true" />}
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};
