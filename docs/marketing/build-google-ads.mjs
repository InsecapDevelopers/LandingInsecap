// node docs/marketing/build-google-ads.mjs — genera los CSV de Google Ads Editor y valida límites de caracteres (30 titulo / 90 descripcion / 15 path).
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('.', import.meta.url)); // esta misma carpeta
const B = 'https://insecap.cl/es';
const curso = (h) => `${B}/cursos/${h}`;

// [campaña, grupo, url, titulo1, path2, keywords[]]
const G = [
  ['Estandares Mineros', 'Altura - Mineras', curso('trabajo-en-altura'), 'Trabajo en Altura Codelco', 'altura', [
    'curso trabajo en altura codelco', 'curso trabajo en altura estandar codelco', 'curso trabajo en altura minera escondida',
    'curso trabajo en altura collahuasi', 'curso trabajo en altura mineria', 'curso altura fisica mineria']],
  ['Estandares Mineros', 'LOTO - Mineras', curso('aislacion-y-bloqueo-loto'), 'Aislación y Bloqueo Codelco', 'loto', [
    'curso aislacion y bloqueo codelco', 'curso loto codelco', 'curso aislacion y bloqueo', 'curso bloqueo y etiquetado',
    'curso loto mineria', 'curso aislacion y bloqueo de energias']],
  ['Estandares Mineros', 'Espacios Confinados - Mineras', curso('espacios-confinados'), 'Espacios Confinados Minería', 'confinados', [
    'curso espacios confinados codelco', 'curso espacios confinados mineria', 'curso espacios confinados minera escondida',
    'curso espacios confinados bhp']],
  ['Estandares Mineros', 'Izaje - Mineras', curso('izaje-y-cargas-suspendidas'), 'Curso Rigger para Minería', 'izaje', [
    'curso rigger codelco', 'curso izaje codelco', 'curso rigger mineria', 'curso izaje minera escondida', 'curso rigger bhp',
    'curso cargas suspendidas codelco']],
  // ponytail: no hay ficha propia de riesgos críticos; aterriza en el catálogo. Crear ficha si el grupo convierte.
  ['Estandares Mineros', 'Riesgos Criticos', `${B}/cursos`, 'Curso Riesgos Críticos', 'criticos', [
    'curso riesgos criticos', 'capacitacion riesgos criticos', 'curso riesgos criticos mineria', 'curso riesgos criticos codelco',
    'curso controles criticos', 'curso verificacion de controles criticos', 'curso riesgos criticos bhp',
    'curso riesgos criticos antofagasta minerals', 'curso riesgos de fatalidad', 'curso estandares de control de fatalidades']],
  ['Estandares Mineros', 'Estandares - General', `${B}/cursos`, 'Cursos Estándar Codelco', 'mineria', [
    'cursos estandar codelco', 'cursos ecf codelco', 'cursos acreditacion codelco', 'cursos para contratistas codelco',
    'cursos contratistas minera escondida', 'cursos acreditacion minera', 'capacitacion contratistas mineria',
    'cursos antofagasta minerals contratistas', 'cursos collahuasi contratistas', 'cursos bhp spence contratistas']],

  ['Seguridad Empresas', 'Trabajo en Altura', curso('trabajo-en-altura'), 'Curso Trabajo en Altura', 'altura', [
    'curso trabajo en altura', 'curso trabajo en altura sence', 'curso trabajo en altura empresas',
    'capacitacion trabajo en altura', 'curso altura fisica', 'curso trabajo en altura e-learning']],
  ['Seguridad Empresas', 'Espacios Confinados', curso('espacios-confinados'), 'Curso Espacios Confinados', 'confinados', [
    'curso espacios confinados', 'curso espacios confinados sence', 'capacitacion espacios confinados',
    'curso espacios confinados online']],
  ['Seguridad Empresas', 'Izaje y Rigger', curso('izaje-y-cargas-suspendidas'), 'Curso Rigger e Izaje', 'izaje', [
    'curso rigger', 'curso rigger sence', 'curso izaje de cargas', 'curso maniobras de izaje', 'certificacion rigger',
    'curso rigger alta y baja']],
  ['Seguridad Empresas', 'Andamios', curso('montaje-y-uso-de-andamios'), 'Curso Montaje de Andamios', 'andamios', [
    'curso andamios', 'curso montaje de andamios', 'curso andamiero', 'curso armado de andamios', 'curso andamios codelco']],
  ['Seguridad Empresas', 'Trabajos en Caliente', curso('trabajos-en-caliente'), 'Curso Trabajos en Caliente', 'caliente', [
    'curso trabajos en caliente', 'capacitacion trabajos en caliente', 'curso trabajos en caliente codelco']],
  ['Seguridad Empresas', 'Incendio y Extintores', curso('incendio-y-emergencias'), 'Curso Uso de Extintores', 'emergencias', [
    'curso uso de extintores', 'curso uso y manejo de extintores', 'curso brigada de emergencia',
    'capacitacion extintores empresas', 'curso prevencion de incendios empresas']],
  ['Seguridad Empresas', 'Primeros Auxilios', curso('primeros-auxilios'), 'Curso Primeros Auxilios', 'auxilios', [
    'curso primeros auxilios empresas', 'curso primeros auxilios sence', 'capacitacion primeros auxilios empresas',
    'curso primeros auxilios trabajadores']],
  ['Seguridad Empresas', 'Manejo Defensivo', curso('manejo-defensivo-y-conduccion-segura'), 'Curso Manejo Defensivo', 'conduccion', [
    'curso manejo defensivo', 'curso manejo defensivo sence', 'curso conduccion a la defensiva',
    'curso manejo defensivo mineria', 'curso manejo defensivo codelco', 'curso conduccion alta montaña']],

  ['Operacion de Equipos', 'Grua Horquilla', curso('operacion-de-grua-horquilla-y-apilador'), 'Curso Grúa Horquilla', 'grua', [
    'curso grua horquilla', 'curso operador grua horquilla', 'curso grua horquilla sence', 'certificacion grua horquilla',
    'curso apilador electrico']],
  ['Operacion de Equipos', 'Grua Puente', curso('operacion-de-grua-puente'), 'Curso Operador Puente Grúa', 'grua', [
    'curso puente grua', 'curso operador puente grua', 'curso grua puente', 'certificacion operador puente grua']],
  ['Operacion de Equipos', 'CAEX', curso('operacion-de-camion-de-extraccion-y-especial'), 'Curso Operador CAEX', 'caex', [
    'curso operador caex', 'curso caex', 'curso camion de extraccion', 'curso operador camion minero']],
  ['Operacion de Equipos', 'Maquinaria Pesada', `${B}/cursos`, 'Cursos Maquinaria Pesada', 'equipos', [
    'curso operador maquinaria pesada', 'curso retroexcavadora', 'curso operador retroexcavadora', 'curso cargador frontal',
    'curso operador cargador frontal', 'curso motoniveladora', 'curso bulldozer']],
  ['Operacion de Equipos', 'Plataforma Elevadora', curso('operacion-de-plataforma-elevadora-tijera-boom'), 'Curso Plataforma Elevadora', 'equipos', [
    'curso plataforma elevadora', 'curso alza hombre', 'curso operador alza hombre', 'curso manlift']],
  ['Operacion de Equipos', 'Grua Pluma y Torre', curso('operacion-de-grua-pluma'), 'Curso Operador Camión Pluma', 'grua', [
    'curso camion pluma', 'curso operador camion pluma', 'curso grua pluma', 'curso grua torre', 'curso operador grua torre']],

  ['Tecnicos Industriales', 'Soldadura', curso('soldadura-industrial'), 'Curso Soldadura Industrial', 'soldadura', [
    'curso soldadura industrial', 'curso soldadura sence', 'curso soldadura empresas', 'capacitacion soldadura']],
  ['Tecnicos Industriales', 'Hidraulica y Neumatica', curso('hidraulica-y-neumatica'), 'Curso Hidráulica Industrial', 'hidraulica', [
    'curso hidraulica industrial', 'curso oleohidraulica', 'curso neumatica industrial', 'curso hidraulica y neumatica',
    'curso hidraulica maquinaria pesada']],
  ['Tecnicos Industriales', 'Electricidad', curso('electricidad-industrial'), 'Curso Electricidad Industrial', 'electricidad', [
    'curso electricidad industrial', 'curso alta tension', 'curso riesgos electricos', 'curso baja tension',
    'curso maniobras alta tension']],
  ['Tecnicos Industriales', 'Mantenimiento', curso('mantenimiento-mecanico'), 'Curso Mantenimiento Mecánico', 'mantencion', [
    'curso mantenimiento mecanico', 'curso lubricacion industrial', 'curso termografia', 'curso bombas y compresores',
    'curso mantenimiento industrial sence']],

  ['Local Norte', 'OTEC Calama', `${B}/cursos`, 'OTEC en Calama', 'calama', [
    'otec calama', 'otec en calama', 'cursos sence calama', 'capacitacion calama', 'cursos de capacitacion calama']],
  ['Local Norte', 'OTEC Antofagasta', `${B}/cursos`, 'OTEC en Antofagasta', 'antofagasta', [
    'otec antofagasta', 'otec en antofagasta', 'cursos sence antofagasta', 'capacitacion empresas antofagasta']],
  ['Local Norte', 'OTEC Atacama', `${B}/cursos`, 'OTEC en Vallenar', 'vallenar', [
    'otec vallenar', 'cursos vallenar', 'cursos sence vallenar', 'otec atacama', 'capacitacion vallenar']],
  ['Local Norte', 'Cursos Abiertos Calama', `${B}/cursos-abiertos`, 'Cursos con Fecha en Calama', 'calama', [
    'curso trabajo en altura calama', 'curso espacios confinados calama', 'curso sustancias peligrosas calama',
    'curso manejo de sustancias peligrosas', 'curso guardia de seguridad calama', 'curso os10 calama']],

  ['General OTEC', 'OTEC Empresas', `${B}/cursos`, 'OTEC para Empresas', 'empresas', [
    'otec capacitacion empresas', 'cursos sence para empresas', 'capacitacion empresas sence',
    'cursos franquicia tributaria sence', 'otec mineria', 'cursos de capacitacion para empresas']],

  ['Marca', 'Insecap', `${B}`, 'INSECAP Sitio Oficial', 'oficial', [
    'insecap', 'insecap capacitaciones', 'insecap calama', 'otec insecap', 'insecap cursos']],
];


// Campaña 2: especialidad SAP PM. Todo aterriza en su landing, que ya trae el formulario.
const SAP = `${B}/sap-pm`;
const SAP_G = [
  ['SAP PM', 'SAP PM General', SAP, 'Especialidad SAP S/4HANA PM', 'especialidad', [
    'curso sap pm', 'capacitacion sap pm', 'curso sap s4hana pm', 'curso sap modulo pm', 'curso sap mantenimiento',
    'curso sap pm empresas', 'curso sap pm mineria', 'curso sap plant maintenance', 'capacitacion sap mantenimiento']],
  ['SAP PM', 'Planificacion y Programacion', SAP, 'Planificación en SAP PM', 'planificacion', [
    'curso planificacion de mantenimiento', 'curso planificacion mantenimiento sap', 'curso programacion de mantenimiento',
    'curso planificador de mantenimiento', 'curso ordenes de trabajo sap', 'curso avisos y ordenes sap pm']],
  ['SAP PM', 'KPI y Confiabilidad', SAP, 'KPI de Mantenimiento en SAP', 'kpi', [
    'curso indicadores de mantenimiento', 'curso kpi mantenimiento', 'curso confiabilidad mantenimiento',
    'curso gestion del mantenimiento', 'curso mejora continua mantenimiento', 'curso gestion estrategica del mantenimiento']],
  ['SAP PM', 'PM MM', SAP, 'Trazabilidad SAP PM y MM', 'pm-mm', [
    'curso sap pm mm', 'curso sap pm y mm', 'curso sap materiales mantenimiento']],
];

const HEADLINES = [
  'INSECAP Capacitaciones', 'OTEC con 16+ Años en Chile', 'Cursos con Código SENCE', 'Cotiza para tu Empresa Hoy',
  'Presencial y E-learning', 'Sedes en Calama y Antofagasta', 'Solicita tu Cotización', 'Certificación para tu Equipo',
  'Cursos Cerrados para Empresas',
];
const MINERIA_H = 'Estándares de Mineras';
const DESCS = [
  'Capacita a tu equipo con una OTEC de 16+ años. Presencial, sincrónico o e-learning.',
  'Cursos con código SENCE para usar tu franquicia tributaria. Cotiza en línea.',
  'Sedes en Calama, Antofagasta, Santiago y Vallenar. Cursos cerrados para empresas.',
  'Elige modalidad, horas y estándar según tu operación. Pide tu cotización hoy.',
];
// SAP: sin "código SENCE" (la propia landing dice "consúltanos").
const SAP_HEADLINES = [
  'Insecap Minerals', 'SAP PM a Medida de tu Empresa', '9 Cursos Modulares, 162 h', 'Rutas por Rol de tu Equipo',
  'Práctica en Entorno Propio', 'Agenda un Diagnóstico', 'Calama, Antofagasta y Online', 'Del Aviso al Análisis',
  'Tu SAP ya Está Pagado', 'Para Minería e Industria',
];
const SAP_DESCS = [
  'Formación SAP S/4HANA PM para equipos de mantenimiento: 9 cursos y 162 horas.',
  'Rutas por rol: planificador, técnico, jefatura y confiabilidad. Arma tu programa.',
  'Práctica en nuestro propio entorno SAP: tu sistema productivo no se toca.',
  'Antes de proponer cursos revisamos cómo usa SAP PM tu equipo. Agenda tu diagnóstico.',
];
const NEG = ['gratis', 'gratuito', 'gratuitos', 'pdf', 'ppt', 'descargar', 'manual', 'que es', 'youtube', 'video',
  'empleo', 'ofertas de trabajo', 'vacantes', 'sueldo', 'cuanto gana', 'beca', 'becas', 'licencia clase d',
  'inacap', 'duoc', 'aiep', 'examen', 'respuestas', 'decreto', 'arriendo'];
// Cada campaña excluye los términos de la otra para no competir entre sí.
const CAMPS = [
  { name: 'INS | Search | Web', groups: G, headlines: HEADLINES, descs: DESCS, path1: 'cursos', neg: [...NEG, 'sap'] },
  { name: 'INS | Search | SAP PM', groups: SAP_G, headlines: SAP_HEADLINES, descs: SAP_DESCS, path1: 'sap-pm',
    neg: [...NEG, 'certificacion sap', 'consultor sap', 'sap fico', 'sap hr', 'sap abap'] },
];

const csv = (rows) => rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n') + '\r\n';

const kw = [['Campaign', 'Ad Group', 'Keyword', 'Criterion Type', 'Final URL']];
const ads = [['Campaign', 'Ad Group', 'Ad type', ...Array.from({ length: 12 }, (_, i) => `Headline ${i + 1}`),
  'Description 1', 'Description 2', 'Description 3', 'Description 4', 'Path 1', 'Path 2', 'Final URL']];
const seen = new Set();
const groupNames = new Set();

// Solo se publican keywords con volumen medido en el Planificador (planificador-2026-10.csv).
// ponytail: las demás quedan en el script como candidatas; la concordancia de frase de las
// genéricas ("curso trabajo en altura") ya cubre sus variantes largas ("... codelco").
const CON_VOLUMEN = new Set(readFileSync(`${OUT}/planificador-2026-10.csv`, 'utf8').split('\n').slice(1).map((l) => l.split(',')[0].trim()).filter(Boolean));
const sinVolumen = [];

for (const { name, groups, headlines, descs, path1, neg } of CAMPS) {
  for (const d of descs) assert(d.length <= 90, `descripcion >90 (${d.length}): ${d}`);
  let n = 0;
  let nGroups = 0;
  for (const [tema, g, url, h1, path2, all] of groups) {
    const kws = all.filter((k) => CON_VOLUMEN.has(k));
    sinVolumen.push(...all.filter((k) => !CON_VOLUMEN.has(k)));
    if (!kws.length) continue;
    nGroups++;
    const group = name.endsWith('Web') ? `${tema} - ${g}` : g;
    assert(!groupNames.has(group), `grupo repetido: ${group}`);
    groupNames.add(group);
    for (const k of kws) {
      assert(!seen.has(k), `keyword duplicada: ${k}`);
      assert(!neg.some((x) => ` ${k} `.includes(` ${x} `)), `keyword bloqueada por negativa: ${k}`);
      seen.add(k);
      kw.push([name, group, k, 'Phrase', url]);
      n++;
    }
    const extra = name.endsWith('Web') ? [tema === 'Marca' ? 'Creciendo Juntos' : MINERIA_H] : [];
    const hs = [h1, ...headlines, ...extra];
    assert(hs.length <= 12 && new Set(hs).size === hs.length, `titulos repetidos o >12 en ${group}`);
    for (const h of hs) assert(h.length <= 30, `titulo >30 (${h.length}): ${h}`);
    assert(path1.length <= 15 && path2.length <= 15);
    ads.push([name, group, 'Responsive search ad', ...hs, ...Array(12 - hs.length).fill(''), ...descs, path1, path2, url]);
  }
  for (const x of neg) kw.push([name, '', x, 'Campaign Negative Phrase', '']);
  console.log(`${name}: ${nGroups} grupos, ${n} keywords, ${neg.length} negativas`);
}

mkdirSync(OUT, { recursive: true });
// BOM para que Excel y Google Ads Editor lean bien los acentos
writeFileSync(`${OUT}/google-ads-keywords.csv`, '\ufeff' + csv(kw));
writeFileSync(`${OUT}/google-ads-anuncios.csv`, '\ufeff' + csv(ads));
console.log(`total: ${seen.size} keywords, ${ads.length - 1} anuncios; sin volumen (no publicadas): ${sinVolumen.length}`);
