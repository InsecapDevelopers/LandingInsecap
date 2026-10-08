// ponytail: catálogo estático de la especialidad SAP PM (Insecap Minerals). Son 9 cursos
// fijos; pasar a la API del TMS si la especialidad empieza a cambiar seguido.
//
// Fuente única del banner de la home (SapMineralsBanner) y de la landing /sap-pm.

type Localized = { es: string; en: string; pt: string };

export interface SapCourse {
  id: string;
  hours: number;
  /** Nombre corto en español: viaja al TMS en "Curso de interés" para el equipo comercial. */
  short: string;
  title: Localized;
  axis: Localized;
  description: Localized;
}

export const SAP_COURSES: SapCourse[] = [
  {
    id: 'estrategia',
    hours: 30,
    short: 'Gestión estratégica',
    title: {
      es: 'Gestión Estratégica del Mantenimiento Industrial aplicando SAP S/4HANA PM',
      en: 'Strategic Industrial Maintenance Management with SAP S/4HANA PM',
      pt: 'Gestão Estratégica da Manutenção Industrial com SAP S/4HANA PM',
    },
    axis: { es: 'Estratégico', en: 'Strategy', pt: 'Estratégico' },
    description: {
      es: 'Alinea la estrategia de mantenimiento con lo que SAP PM permite controlar y medir.',
      en: 'Aligns your maintenance strategy with what SAP PM can control and measure.',
      pt: 'Alinha a estratégia de manutenção com o que o SAP PM permite controlar e medir.',
    },
  },
  {
    id: 'bases',
    hours: 8,
    short: 'Bases conceptuales',
    title: {
      es: 'Bases Conceptuales SAP S/4HANA Módulo PM',
      en: 'SAP S/4HANA PM Module Fundamentals',
      pt: 'Bases Conceituais SAP S/4HANA Módulo PM',
    },
    axis: { es: 'Fundamentos', en: 'Fundamentals', pt: 'Fundamentos' },
    description: {
      es: 'Datos maestros, estructura técnica y lógica del módulo: el punto de partida.',
      en: 'Master data, technical structure and module logic: the starting point.',
      pt: 'Dados mestres, estrutura técnica e lógica do módulo: o ponto de partida.',
    },
  },
  {
    id: 'avisos-ot',
    hours: 24,
    short: 'Avisos y OT',
    title: {
      es: 'Gestión de Mantenimiento: Avisos y OT en SAP S/4HANA PM',
      en: 'Maintenance Management: Notifications and Work Orders in SAP S/4HANA PM',
      pt: 'Gestão de Manutenção: Notas e Ordens em SAP S/4HANA PM',
    },
    axis: { es: 'Operativo', en: 'Operations', pt: 'Operacional' },
    description: {
      es: 'Crea, trata y notifica avisos y órdenes con la información que el análisis necesita.',
      en: 'Create, process and confirm notifications and orders with the data analysis needs.',
      pt: 'Crie, trate e confirme notas e ordens com a informação que a análise precisa.',
    },
  },
  {
    id: 'planificacion',
    hours: 20,
    short: 'Planificación',
    title: {
      es: 'Planificación de Mantenimiento SAP S/4HANA Módulo PM',
      en: 'Maintenance Planning in SAP S/4HANA PM',
      pt: 'Planejamento de Manutenção SAP S/4HANA Módulo PM',
    },
    axis: { es: 'Planificación', en: 'Planning', pt: 'Planejamento' },
    description: {
      es: 'Hojas de ruta, planes preventivos y materiales definidos antes de liberar la OT.',
      en: 'Task lists, preventive plans and materials defined before releasing the order.',
      pt: 'Roteiros, planos preventivos e materiais definidos antes de liberar a ordem.',
    },
  },
  {
    id: 'programacion',
    hours: 16,
    short: 'Programación',
    title: {
      es: 'Programación de Mantenimiento SAP S/4HANA Módulo PM',
      en: 'Maintenance Scheduling in SAP S/4HANA PM',
      pt: 'Programação de Manutenção SAP S/4HANA Módulo PM',
    },
    axis: { es: 'Planificación', en: 'Planning', pt: 'Planejamento' },
    description: {
      es: 'Capacidad, prioridades y cumplimiento del programa semanal, con datos del sistema.',
      en: 'Capacity, priorities and weekly schedule compliance, backed by system data.',
      pt: 'Capacidade, prioridades e cumprimento do programa semanal, com dados do sistema.',
    },
  },
  {
    id: 'kpi',
    hours: 16,
    short: 'KPI',
    title: {
      es: 'Indicadores de Gestión del Mantenimiento (KPI) SAP S/4HANA',
      en: 'Maintenance Management KPIs in SAP S/4HANA',
      pt: 'Indicadores de Gestão da Manutenção (KPI) SAP S/4HANA',
    },
    axis: { es: 'Control', en: 'Control', pt: 'Controle' },
    description: {
      es: 'Construye e interpreta indicadores de mantenimiento confiables desde SAP PM.',
      en: 'Build and read reliable maintenance indicators straight from SAP PM.',
      pt: 'Construa e interprete indicadores de manutenção confiáveis a partir do SAP PM.',
    },
  },
  {
    id: 'mejora-continua',
    hours: 16,
    short: 'Mejora continua',
    title: {
      es: 'Mejoramiento Continuo del Mantenimiento SAP S/4HANA PM',
      en: 'Continuous Maintenance Improvement with SAP S/4HANA PM',
      pt: 'Melhoria Contínua da Manutenção SAP S/4HANA PM',
    },
    axis: { es: 'Mejora continua', en: 'Improvement', pt: 'Melhoria contínua' },
    description: {
      es: 'Usa el historial de fallas para priorizar equipos críticos y decidir mejoras.',
      en: 'Use failure history to prioritize critical equipment and decide improvements.',
      pt: 'Use o histórico de falhas para priorizar equipamentos críticos e decidir melhorias.',
    },
  },
  {
    id: 'pm-mm',
    hours: 16,
    short: 'Trazabilidad PM-MM',
    title: {
      es: 'Trazabilidad Módulos PM y MM SAP S/4HANA',
      en: 'PM and MM Traceability in SAP S/4HANA',
      pt: 'Rastreabilidade dos Módulos PM e MM SAP S/4HANA',
    },
    axis: { es: 'Integración', en: 'Integration', pt: 'Integração' },
    description: {
      es: 'Sigue repuestos y costos desde la reserva hasta el cierre de la orden.',
      en: 'Track spare parts and costs from reservation to order close.',
      pt: 'Acompanhe peças e custos da reserva até o encerramento da ordem.',
    },
  },
  {
    id: 'post-mantenimiento',
    hours: 16,
    short: 'Post mantenimiento',
    title: {
      es: 'Post Mantenimiento SAP S/4HANA Módulo PM',
      en: 'Post-Maintenance in SAP S/4HANA PM',
      pt: 'Pós-Manutenção SAP S/4HANA Módulo PM',
    },
    axis: { es: 'Cierre', en: 'Close-out', pt: 'Encerramento' },
    description: {
      es: 'Cierre técnico, notificaciones y documentación que dejan un historial útil.',
      en: 'Technical close, confirmations and records that leave a useful history.',
      pt: 'Encerramento técnico, confirmações e documentação que deixam um histórico útil.',
    },
  },
];

// ponytail: rutas sugeridas por rol, criterio inicial de marketing. Validar con el
// coordinador académico SAP antes de tomarlas como malla oficial.
export const SAP_ROLE_ROUTES: { id: string; label: Localized; courses: string[] }[] = [
  {
    id: 'planificador',
    label: { es: 'Planificador/a y programador/a', en: 'Planner and scheduler', pt: 'Planejador/a e programador/a' },
    courses: ['bases', 'avisos-ot', 'planificacion', 'programacion', 'pm-mm'],
  },
  {
    id: 'tecnico',
    label: { es: 'Técnico/a y mantenedor/a', en: 'Technician', pt: 'Técnico/a de manutenção' },
    courses: ['bases', 'avisos-ot', 'post-mantenimiento'],
  },
  {
    id: 'jefatura',
    label: { es: 'Supervisión y jefatura', en: 'Supervisor and manager', pt: 'Supervisão e chefia' },
    courses: ['estrategia', 'programacion', 'kpi', 'mejora-continua'],
  },
  {
    id: 'confiabilidad',
    label: { es: 'Ingeniería de confiabilidad', en: 'Reliability engineering', pt: 'Engenharia de confiabilidade' },
    courses: ['bases', 'kpi', 'mejora-continua', 'post-mantenimiento'],
  },
];

export const SAP_TOTAL_HOURS = SAP_COURSES.reduce((sum, c) => sum + c.hours, 0);

export const SAP_HREF = '/sap-pm';

/** Logo SAP en WebP local de 80 px de alto (2x del h-10 en que se muestra). */
export const SAP_LOGO = '/images/sap/sap-logo.webp';

// Capturas recomprimidas a WebP en public/ (Fase 6; los JPEG de origen pesaban hasta 414 KB y están en
// storageisecap.sfo2.digitaloceanspaces.com/noticias/<nombre>.jpeg). Mismo tamaño: el zoom las amplía.
const ENV_CDN = '/images/sap';

/**
 * Capturas reales del entorno SAP Insecap Minerals. La primera va en grande (y en el hero de la landing).
 * zoom: las miniaturas muestran la esquina superior izquierda ampliada (el resto de la pantalla es fondo vacío).
 */
export const SAP_ENV_SHOTS = [
  {
    src: `${ENV_CDN}/sap2-23d39a46.webp`, w: 1519, h: 904, zoom: 1.6,
    alt: { es: 'Ubicaciones técnicas en el entorno de práctica', en: 'Functional locations in the practice environment', pt: 'Locais de instalação no ambiente de prática' },
  },
  {
    src: `${ENV_CDN}/sap3-a2c823e9.webp`, w: 1600, h: 855, zoom: 2.2,
    alt: { es: 'Acceso al entorno', en: 'Environment login', pt: 'Acesso ao ambiente' },
  },
  {
    src: `${ENV_CDN}/sap-c238453d.webp`, w: 1514, h: 903, zoom: 1.6,
    alt: { es: 'Menú SAP Easy Access', en: 'SAP Easy Access menu', pt: 'Menu SAP Easy Access' },
  },
];
