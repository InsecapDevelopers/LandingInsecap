import { Link } from 'react-router-dom';
import { CalendarDays, Cog } from 'lucide-react';
import { SAP_HREF } from '@/lib/sapCatalog';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { useTranslation } from 'react-i18next';

interface ClientTypeSwitchProps {
  // 'abiertos' reemplaza al antiguo 'particular': el catálogo B2C dejó de ofrecerse.
  activeMode: 'empresa' | 'abiertos' | 'sap';
}

export const ClientTypeSwitch = ({ activeMode }: ClientTypeSwitchProps) => {
  const { localizedPath } = useLocalizedPath();
  const { i18n } = useTranslation();

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

  const isEmpresa = activeMode === 'empresa';
  const isAbiertos = activeMode === 'abiertos';
  const isSap = activeMode === 'sap';

  return (
    <div className="relative z-30 -mt-8 mb-8">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <div className="rounded-2xl bg-card shadow-xl px-6 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
            <span className="text-sm text-muted-foreground">{messages.clientTypeLabel}:</span>
            {/* En móvil las tres pestañas no caben en una fila: se apilan */}
            <div className="flex w-full flex-col gap-1 rounded-2xl border border-border bg-muted/70 p-1 sm:flex-row sm:rounded-full md:w-auto">
              <Link to={localizedPath('/cursos-empresas')} className="flex flex-1 md:flex-none">
                <Button
                  variant={isEmpresa ? 'default' : 'ghost'}
                  disabled={isEmpresa}
                  className={`flex-1 rounded-full px-6 text-sm font-semibold md:flex-none ${
                    isEmpresa
                      ? 'bg-insecap-blue text-white shadow-sm'
                      : 'text-muted-foreground transition-colors hover:text-foreground'
                  }`}
                >
                  {messages.businessClient}
                </Button>
              </Link>
              <Link to={localizedPath('/cursos-abiertos')} className="flex flex-1 md:flex-none">
                <Button
                  variant={isAbiertos ? 'default' : 'ghost'}
                  disabled={isAbiertos}
                  className={`flex-1 rounded-full px-6 text-sm font-semibold md:flex-none ${
                    isAbiertos
                      ? 'bg-insecap-blue text-white shadow-sm'
                      : 'text-muted-foreground transition-colors hover:text-foreground'
                  }`}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {messages.peopleClient}
                </Button>
              </Link>
              <Link to={localizedPath(SAP_HREF)} className="flex flex-1 md:flex-none">
                <Button
                  variant={isSap ? 'default' : 'ghost'}
                  disabled={isSap}
                  className={`flex-1 rounded-full px-6 text-sm font-semibold md:flex-none ${
                    isSap
                      ? 'bg-insecap-blue text-white shadow-sm'
                      : 'text-muted-foreground transition-colors hover:text-foreground'
                  }`}
                >
                  <Cog className="mr-2 h-4 w-4" />
                  {messages.sap}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
