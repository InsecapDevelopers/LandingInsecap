import { Link } from 'react-router-dom';
import { BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/hooks/use-localized-path';
import { useTranslation } from 'react-i18next';

interface ClientTypeSwitchProps {
  activeMode: 'empresa' | 'particular';
}

export const ClientTypeSwitch = ({ activeMode }: ClientTypeSwitchProps) => {
  const { localizedPath } = useLocalizedPath();
  const { t } = useTranslation();

  const content = {
    es: {
      clientTypeLabel: 'Tipo de cliente',
      peopleClient: 'Particular',
      businessClient: 'Empresa',
    },
    en: {
      clientTypeLabel: 'Client type',
      peopleClient: 'Individual',
      businessClient: 'Corporate',
    },
    pt: {
      clientTypeLabel: 'Tipo de cliente',
      peopleClient: 'Particular',
      businessClient: 'Empresa',
    },
  };

  const locale = (t('language') || 'es') as 'es' | 'en' | 'pt';
  const messages = content[locale] || content['es'];

  const isEmpresa = activeMode === 'empresa';

  return (
    <div className="relative z-30 -mt-8 mb-8">
      <div className="container mx-auto px-8 md:px-14 lg:px-16">
        <div className="rounded-2xl bg-card shadow-xl px-6 py-5 md:px-8 md:py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
            <span className="text-sm text-muted-foreground">{messages.clientTypeLabel}:</span>
            <div className="inline-flex w-full rounded-full border border-border bg-muted/70 p-1 md:w-auto">
              <Link to={localizedPath('/cursos-empresas')} className="flex-1 md:flex-none">
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
              <Link to={localizedPath('/cursos')} className="flex-1 md:flex-none">
                <Button
                  variant={!isEmpresa ? 'default' : 'ghost'}
                  disabled={!isEmpresa}
                  className={`flex-1 rounded-full px-6 text-sm font-semibold md:flex-none ${
                    !isEmpresa
                      ? 'bg-insecap-blue text-white shadow-sm'
                      : 'text-muted-foreground transition-colors hover:text-foreground'
                  }`}
                >
                  <BriefcaseBusiness className="mr-2 h-4 w-4" />
                  {messages.peopleClient}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
