/**
 * JSON-LD global del sitio (Fase 1, tarea #8): grafo mínimo con la organización (#org) y el
 * sitio (#website), con @id estables para que las fichas, sedes y noticias de la Fase 4 los
 * referencien. Se emite en todas las páginas desde RouteMeta (AppShell.tsx).
 */
import { SITE_URL } from './locale-routing';

export const ORG_ID = `${SITE_URL}/#org`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const credential = (name: string) => ({ '@type': 'EducationalOccupationalCredential', name });

const organization = {
  '@type': 'EducationalOrganization',
  '@id': ORG_ID,
  name: 'INSECAP Capacitación',
  alternateName: 'INSECAP',
  url: `${SITE_URL}/es`,
  // TODO: logo SVG oficial en el dominio de INSECAP (sección 4, punto 10).
  email: 'contacto@insecap.cl',
  telephone: '+56 55 292 6431',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'La Cascada 1513',
    addressLocality: 'Calama',
    addressRegion: 'Región de Antofagasta',
    addressCountry: 'CL',
  },
  areaServed: { '@type': 'Country', name: 'Chile' },
  knowsAbout: [
    'Capacitación en seguridad laboral',
    'Prevención de riesgos en minería',
    'Trabajo en altura',
    'Manejo defensivo 4x4 en alta montaña',
    'Aislación y bloqueo (LOTO)',
    'Espacios confinados',
    'Manejo seguro de sustancias peligrosas',
    'Armado de andamios',
    'Operación de grúa horquilla',
    'Riesgos eléctricos NFPA 70E',
    'Primeros auxilios',
    'SAP S/4HANA PM',
  ],
  hasCredential: [
    credential('OTEC acreditada por SENCE, Resolución N° 12208'),
    credential('NCh 2728:2015'),
    credential('ISO 9001:2015'),
  ],
  memberOf: [
    { '@type': 'Organization', name: 'Cámara de Comercio de Santiago (CCS)' },
    { '@type': 'Organization', name: 'SICEP' },
  ],
  // Solo perfiles confirmados en el contexto de negocio.
  // TODO: agregar LinkedIn, Facebook y TikTok cuando INSECAP confirme las URL oficiales
  // (el Footer enlaza facebook.com/insecap y linkedin.com/company/insecap sin verificar, y TikTok
  // sin perfil). TODO: confirmar que x.com/insecap es la cuenta oficial (sección 4, punto 9).
  sameAs: [
    'https://www.instagram.com/insecapcapacitacion/',
    'https://x.com/insecap',
  ],
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: 'INSECAP Capacitación',
  publisher: { '@id': ORG_ID },
  inLanguage: ['es-CL', 'en', 'pt'],
};

/** Grafo global serializado (sin `<`, seguro dentro de <script>). */
export const siteJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [organization, website],
});
