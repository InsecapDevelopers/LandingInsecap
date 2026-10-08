import { PENDIENTE } from '@/data/cursos-base';

/**
 * Dato pendiente de INSECAP (TODO de la sección 4 del registro de la tarea #8). Se ve como
 * "Por confirmar" y lleva `data-todo` para encontrarlo en el HTML prerenderizado
 * (`grep -c data-todo dist/es/...`).
 */
const Pendiente = ({ campo, children }: { campo: string; children?: React.ReactNode }) => (
  <span data-todo={campo} className="italic text-muted-foreground">
    {children ?? PENDIENTE}
  </span>
);

export default Pendiente;
