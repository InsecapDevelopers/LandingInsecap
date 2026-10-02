# Campaña Google Ads INSECAP — plan de lanzamiento

Borrador del 30-09-2026. Los volúmenes de búsqueda y CPC **no están medidos**: las keywords salen del
catálogo real (61 temas B2B) y de revisar quién aparece en Google para esas búsquedas. Antes de
invertir hay que pasarlas por el Planificador de Palabras Clave de la cuenta.

Archivos para importar en Google Ads Editor:

- [google-ads-keywords.csv](google-ads-keywords.csv) — 184 keywords en concordancia de frase + negativas por campaña.
- [google-ads-anuncios.csv](google-ads-anuncios.csv) — 34 anuncios responsivos de búsqueda (uno por grupo).

Los dos CSV se generan con `node docs/marketing/build-google-ads.mjs`, que además valida largos
(30/90/15), keywords duplicadas y keywords que choquen con una negativa. Para cambiar keywords o
anuncios se edita el script, no los CSV.

## 1. Arreglar antes de gastar

Medido en producción (`insecap.cl`) y en el código:

| # | Problema | Dónde | Efecto en Ads |
|---|---|---|---|
| 1 | El canonical de **todas** las páginas apunta a `insecap-capacitaciones.myshopify.com` | `index.html:34`, `src/components/SEO.tsx:53` | Le dice a Google que la página real es otra; daña SEO y la experiencia de página de destino |
| 2 | La mayoría de las páginas muestran el `<title>` y la descripción genéricos | el componente `SEO` existe, pero solo lo usan 5 páginas; la ficha de curso empresa y la home no | Baja relevancia anuncio → landing, Quality Score peor, CPC más caro |
| 3 | La conversión `contacto_enviado` solo se dispara desde `ContactCTA` (home y footer) | `src/components/ContactCTA.tsx:10` | Los envíos desde `/formulario/cursos-abiertos` y la landing SAP no se cuentan (salvo que GTM los capture por otro trigger: revisar en GTM) |
| 4 | La ficha de curso empresa no tiene formulario: manda a `/contacto?origen=b2b&curso=…` | `src/components/B2bCourseDetail.tsx` | Un clic extra justo en la página donde aterriza el anuncio |
| 5 | No existe `sitemap.xml` (la URL devuelve el HTML de la app) | `public/` | Solo SEO, no bloquea Ads |
| 6 | Fichas de curso con muy poco texto (modalidades, horas, estándares y nada más) | catálogo B2B | Poca relevancia para keywords como "curso rigger codelco" |

Mínimo para lanzar: 1, 3 y 4. Sin el 3 la cuenta optimiza a ciegas.

## 2. Dónde está el hueco frente a la competencia

Quién aparece hoy para las búsquedas genéricas ("curso trabajo en altura", "curso LOTO"):
agregadores y OTEC genéricas (gocursos.cl, redcapacitacion.cl, otec.cl, conductoreschile.cl) y el
buscador de SENCE. Compiten por precio en el término genérico.

El catálogo de INSECAP tiene algo que esos sitios no muestran: el mismo curso en versión
**estándar de la minera mandante** (Codelco, Minera Escondida, BHP Spence, Collahuasi, Antofagasta
Minerals, Centinela, El Abra, Lomas Bayas, Candelaria). De ahí salen tres apuestas:

1. **Curso + mandante** — "curso trabajo en altura codelco", "curso rigger minera escondida",
   "cursos para contratistas codelco", y el concepto que usan las mineras para agruparlos:
   **riesgos críticos / controles críticos** ("curso riesgos criticos", "curso controles
   criticos", "curso estandares de control de fatalidades"). Menos volumen, intención de compra mucho más alta (el
   contratista necesita el curso para acreditar). Competidor directo visible: Ultracción.
2. **Curso + ciudad del norte** — "otec calama", "cursos sence vallenar", "curso espacios
   confinados calama". INSECAP tiene sede física; los agregadores no.
3. **Equipos y técnicos de nicho** — puente grúa, CAEX, alza hombre, oleohidráulica.
   Temas con muchos cursos en catálogo y poca oferta visible.
4. **SAP PM aplicado a mantenimiento** — la competencia en "curso sap" son consultoras y cursos
   genéricos de SAP. La especialidad de Insecap Minerals se puede comprar también por el problema
   ("curso planificacion de mantenimiento", "curso kpi mantenimiento"), donde SAP no compite.

Esto es una hipótesis razonada, no un dato: para confirmar qué keywords usa cada competidor hace
falta el Planificador de Google Ads (pestaña "empezar con un sitio web" con el dominio del
competidor) o una herramienta tipo Ahrefs/Semrush.

## 3. Estructura

Dos campañas, solo Búsqueda. Sin Display ni Performance Max hasta tener conversiones medidas.
Presupuesto separado para que SAP, de ticket más alto, no compita por presupuesto con el resto.

| Campaña | Landing | Grupos | Keywords | % presupuesto sugerido |
|---|---|---|---|---|
| `INS \| Search \| Web` | fichas de `/curso-empresa/…`, `/cursos-empresas`, `/cursos-abiertos` | 30 | 160 | 70 % |
| `INS \| Search \| SAP PM` | `/especialidades/sap-pm` | 4 | 24 | 30 % |

Grupos de la campaña Web (el prefijo es el tema, para leer los informes agrupados):

| Tema | Grupos | Keywords |
|---|---|---|
| Estándares Mineros | 6 | 42 |
| Seguridad Empresas | 8 | 39 |
| Operación de Equipos | 6 | 29 |
| Local Norte | 4 | 20 |
| Técnicos Industriales | 4 | 19 |
| General OTEC | 1 | 6 |
| Marca | 1 | 5 |

Grupos de la campaña SAP PM: SAP PM General (9), Planificación y Programación (6), KPI y
Confiabilidad (6), PM MM (3).

Lo que se pierde al juntar todo lo no-SAP en una campaña: no se puede dar presupuesto ni
ubicación distintos por tema. Las keywords de Local Norte ya llevan la ciudad, así que funcionan
con geo Chile. La marca infla el CTR y las conversiones de la campaña Web: leer sus números
por grupo, no por campaña. Si un tema se come el presupuesto, se separa en su propia campaña.

Configuración común:

- Red: solo Búsqueda de Google (desactivar partners de búsqueda y Display).
- Ubicación: Chile, "Presencia: personas que están en la ubicación", no "interés".
- Idioma: español.
- Puja: Maximizar clics con CPC máximo las primeras 2–3 semanas; pasar a Maximizar conversiones
  cuando haya ~30 conversiones registradas por campaña.
- Horario: lunes a viernes en horario de oficina.
- Extensiones Web: enlaces de sitio (Cursos Empresas, Cursos Abiertos, Contacto, Nosotros),
  llamada, ubicación (sedes), texto destacado (SENCE, presencial/e-learning).
- Extensiones SAP: enlaces a las anclas de la landing (`#catalogo`, `#tu-programa`, `#cotizar`).
- Negativas: lista común (gratis, pdf, empleo, sueldo, becas, inacap, etc.). La Web excluye `sap`
  para no pisarse con la otra campaña; SAP excluye búsquedas de certificación/consultoría SAP
  (`certificacion sap`, `consultor sap`, `sap fico`, `sap hr`, `sap abap`).

## 4. Verificar antes de publicar los anuncios

- **Marcas de mineras en el texto**: "Trabajo en Altura Codelco", "Cursos Estándar Codelco" y
  similares usan marcas de terceros. Como keyword se permite; en el texto del anuncio Google
  puede rechazarlo y, sobre todo, INSECAP debe estar efectivamente habilitada para impartir ese
  estándar. Confirmar con el área comercial cuáles están vigentes.
- **Riesgos críticos**: el catálogo no tiene una ficha con ese nombre, así que el grupo aterriza
  en `/cursos-empresas`. Si INSECAP dicta un curso de riesgos/controles críticos, crear su ficha
  y apuntar ahí el grupo; si el grupo convierte, también.
- **Marca SAP en el texto**: la landing ya aclara que Insecap no está afiliado a SAP SE. Google
  permite usar marcas de software en anuncios de formación, pero si SAP tiene una restricción
  registrada los anuncios se rechazan: en ese caso, quitar "SAP" del texto y dejarlo solo en keywords.
- **Afirmaciones**: "16+ años", "código SENCE" y las cuatro sedes salen de `PRODUCT.md` y del
  sitio. Confirmar que cada curso anunciado tiene código SENCE vigente.
- **Importación**: los CSV siguen el formato de columnas de Google Ads Editor pero no se han
  probado importando en la cuenta. Las campañas hay que crearlas primero (tipo Búsqueda,
  presupuesto diario) o agregar esas columnas cuando se defina el monto.

## 5. RankMeFast

Se puede instalar, pero no aporta aquí: no rastrea ni consulta Google por sí mismo, solo llama a
proveedores pagados (DataForSEO, Firecrawl, APIs de Google) con claves propias. Sin claves
devuelve datos de demostración fijos. Es un stack de 6 servicios Docker en beta pública con un
solo mantenedor. Para este trabajo alcanza con el Planificador de Google Ads (gratis con la
cuenta) y Search Console.
