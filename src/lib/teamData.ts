/**
 * Nuestro Equipo: se edita en el TMS Plus (Gestión Página Web > Nuestro Equipo) y la web lo lee de
 * /api/publica/equipo, ya ordenado. La primera área es la destacada (Gerencia).
 */
export interface TeamMember {
  name: string;
  role: string;
  email?: string;
  photo?: string;
  location?: string;
}

export interface TeamArea {
  area: string;
  members: TeamMember[];
}

interface ApiArea {
  area: string;
  miembros: { nombre: string; cargo: string; correo: string | null; foto: string | null; ubicacion: string | null }[];
}

/** En dev va por el proxy de Vite, como las noticias. Lanza si falla: mejor cortar el prerender que publicar la página vacía. */
export async function fetchTeam(): Promise<TeamArea[]> {
  const base = (import.meta.env.VITE_TMS_PLUS_API_URL || '').replace(/\/+$/, '');
  const res = await fetch(`${import.meta.env.PROD ? base : ''}/api/publica/equipo`);
  if (!res.ok) throw new Error(`Error al cargar el equipo: ${res.status}`);
  return ((await res.json()) as ApiArea[]).map((a) => ({
    area: a.area,
    members: a.miembros.map((m) => ({
      name: m.nombre,
      role: m.cargo,
      email: m.correo ?? undefined,
      photo: m.foto ?? undefined,
      location: m.ubicacion ?? undefined,
    })),
  }));
}
