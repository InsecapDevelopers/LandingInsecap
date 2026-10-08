import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  Cog,
  Factory,
  Monitor,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { getRangoHoras, type CursoSeo } from '@/data/cursos-seo';
import { useLocalizedPath } from '@/hooks/use-localized-path';

export const AREA_ICONS: Record<string, LucideIcon> = {
  'Seguridad y Prevención de Riesgos': ShieldCheck,
  'Operación de Equipos': Truck,
  'Electricidad y Electrónica': Zap,
  'Mecánica Industrial': Cog,
  'Procesos Industriales': Factory,
  'Técnicas Aplicadas': Wrench,
  'Técnicas de Habilidades Blandas': Users,
  'Computación e Informática': Monitor,
};

export const areaIcon = (area: string): LucideIcon => AREA_ICONS[area] ?? BadgeCheck;

interface CursoCardProps {
  curso: CursoSeo;
  /** Nivel del título según la página: h2 en una categoría, h3 bajo el h2 de cada área. */
  titulo?: 'h2' | 'h3';
  label?: string;
}

/**
 * Tarjeta de un curso del catálogo con su foto (Spaces, repositorio/catalogo-web/). Los cursos sin
 * foto muestran el ícono de su área. La foto es decorativa: el nombre del curso ya está en el enlace.
 */
export const CursoCard = ({ curso, titulo: Titulo = 'h3', label = 'Ver curso' }: CursoCardProps) => {
  const { localizedPath } = useLocalizedPath();
  const { tema } = curso;
  const rango = getRangoHoras(tema);
  const Icon = areaIcon(tema.categoria);

  return (
    <Link
      to={localizedPath(`/cursos/${curso.slug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-insecap-blue/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-insecap-blue/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-insecap-blue to-[#233076]">
        {tema.imagen ? (
          <img
            src={tema.imagen}
            alt=""
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-14 w-14 text-white/60" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Titulo className="text-lg font-semibold leading-snug text-foreground group-hover:text-insecap-blue">
          {tema.tema}
        </Titulo>
        <span className="mt-3 flex flex-wrap items-center gap-1.5">
          {tema.modalidades.map((modalidad) => (
            <span key={modalidad} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {modalidad}
            </span>
          ))}
        </span>
        {rango && (
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-insecap-cyan-ink">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {rango}
          </span>
        )}
        <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-insecap-blue transition-all group-hover:gap-2">
          {label} <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};
