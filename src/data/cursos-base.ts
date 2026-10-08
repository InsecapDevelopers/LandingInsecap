/**
 * Lo mínimo del catálogo que usan módulos del bundle principal (redirecciones, seo-routes, JSON-LD,
 * Pendiente) sin arrastrar los datos de src/data/cursos*.json, que van solo en las páginas de cursos.
 */

/** Texto visible para datos que faltan. TODO: cada uno se completa con INSECAP (sección 4). */
export const PENDIENTE = 'Por confirmar';

/** slug público de la ficha → handle del tema en src/data/cursos.json. */
export const SLUG_A_TEMA: Record<string, string> = {
  'aislacion-y-bloqueo-loto': 'aislacion-bloqueo',
  'alta-tension': 'alta-tension',
  'atencion-al-cliente-y-ventas': 'atencion-cliente-ventas',
  autocad: 'autocad',
  'baja-tension': 'baja-tension',
  'bienestar-y-salud-mental': 'bienestar-salud-mental',
  'bodega-logistica-y-abastecimiento': 'gestion-bodega-logistica',
  'bombas-y-compresores': 'bombas-compresores',
  'computacion-e-informatica-general': 'computacion-general',
  'comunicacion-y-trabajo-en-equipo': 'comunicacion-trabajo-equipo',
  'electricidad-industrial': 'electricidad-general',
  'electronica-e-instrumentacion': 'electronica-instrumentacion',
  'equipos-de-proteccion-personal-epp': 'epp-proteccion-personal',
  'ergonomia-y-trastornos-musculoesqueleticos': 'ergonomia-trastornos',
  'espacios-confinados': 'espacios-confinados',
  'explosivos-y-tronadura': 'explosivos-tronadura',
  'formacion-de-instructores-y-relatores': 'formacion-instructores',
  'gases-y-atmosferas-peligrosas': 'gases-atmosferas-peligrosas',
  'gestion-de-calidad-e-iso': 'calidad-iso',
  'gestion-de-proyectos': 'gestion-proyectos',
  'hidraulica-y-neumatica': 'hidraulica-neumatica',
  'incendio-y-emergencias': 'incendio-emergencias',
  'instalaciones-sanitarias-y-agua': 'agua-sanitaria',
  'instrumentos-de-medicion-y-metrologia': 'instrumentos-medicion',
  'izaje-y-cargas-suspendidas': 'izaje-cargas-suspendidas',
  'lean-manufacturing-5s-y-mejora-continua': 'lean-5s-mejora-continua',
  'liderazgo-y-supervision': 'liderazgo',
  'lubricacion-industrial': 'lubricacion',
  'manejo-defensivo-y-conduccion-segura': 'manejo-defensivo',
  'mantenimiento-mecanico': 'mantenimiento-mecanico',
  'mecanica-general-e-industrial': 'mecanica-general',
  'medioambiente-y-sustentabilidad': 'medioambiente',
  'microsoft-excel': 'excel',
  'microsoft-office-word-powerpoint': 'office-word-powerpoint',
  'montaje-y-uso-de-andamios': 'andamios',
  'operacion-de-bulldozer-y-tractores': 'bulldozer',
  'operacion-de-camion': 'camion-general',
  'operacion-de-camion-de-extraccion-y-especial': 'camion-especial',
  'operacion-de-cargador-frontal': 'cargador-frontal',
  'operacion-de-equipos-menores-y-herramientas': 'equipos-menores',
  'operacion-de-grua-horquilla-y-apilador': 'grua-horquilla',
  'operacion-de-grua-pluma': 'grua-pluma',
  'operacion-de-grua-puente': 'grua-puente',
  'operacion-de-grua-torre': 'grua-torre',
  'operacion-de-motoniveladora': 'motoniveladora',
  'operacion-de-motosierra-y-silvicultura': 'motosierra',
  'operacion-de-plataforma-elevadora-tijera-boom': 'plataforma-elevadora',
  'operacion-de-retroexcavadora': 'retroexcavadora',
  'prevencion-de-riesgos-generales': 'prevencion-riesgos-generales',
  'primeros-auxilios': 'primeros-auxilios',
  'procesos-mineros': 'mineria-procesos',
  sap: 'sap',
  'seguridad-y-prevencion-otros': 'seguridad-prevencion-otros',
  'soldadura-industrial': 'soldadura',
  'tableros-y-distribucion-electrica': 'tableros-electricos',
  'tecnicas-de-rescate': 'rescate',
  'termografia-industrial': 'termografia',
  topografia: 'topografia',
  'trabajo-en-altura': 'trabajo-en-altura',
  'trabajos-en-caliente': 'trabajos-en-caliente',
  'ventilacion-en-mineria-subterranea': 'ventilacion-minera',
};

/** Temas de relleno: noindex aunque algún día tengan párrafo (decisión Fase 2). */
export const NOINDEX_SLUGS = new Set(['seguridad-y-prevencion-otros', 'computacion-e-informatica-general']);

/** Slugs de las fichas /cursos/:slug. */
export const CURSO_SLUGS = Object.keys(SLUG_A_TEMA);

/** Toda ficha tiene párrafo de respuesta (cursos-seo.ts); solo los temas de relleno van con noindex. */
export const isCursoSeoIndexable = (slug: string | undefined): boolean =>
  slug !== undefined && slug in SLUG_A_TEMA && !NOINDEX_SLUGS.has(slug);

/** Horas con coma decimal (2,5), igual en el prerender y en el cliente. */
export const formatHora = (horas: number): string => String(horas).replace('.', ',');
