# Catálogo de cursos de la web

Las páginas `/cursos`, `/cursos/categoria/:area` y `/cursos/:slug` y los Cursos Destacados de la home salen de
**`src/data/cursos.json`**: 61 temas en 8 áreas. Son datos estáticos que viajan en el bundle y salen completos
en el HTML prerenderizado. Ni Shopify ni ninguna API intervienen.

## De dónde salen los datos

Cada tema agrupa cursos vigentes del catálogo del TMS (`DB_SGC`). La versión actual se verificó contra una
copia de producción con datos al **2026-10-01**.

- **Cursos vigentes:** `Curso` activo, con ficha `R11` en estado `Listo`.
- **Exclusiones** (en orden):
  - `softDelete`
  - recertificaciones (`tipoEjecucion` 3, 4 y 5, o "recertific*" en el nombre)
  - precontratos (categoría R11 `PRE-CONTRATO` o "precontrat*" en el nombre)
  - cursos sin ficha o con la ficha en Borrador
  - cursos internos de INSECAP
  - cursos marcados "obsoleto"
  - el resultado: 2.289 cursos vigentes
- **Tema:** una regex sobre el nombre del curso (sin tildes, en minúsculas). Las reglas se prueban en orden y
  gana la primera que calza.
- **Horas:** `horasTeoricas + horasPracticas`, con decimales: 2,5 h es real (cursos RF de Codelco). Solo se
  publican combinaciones de 1 a 100 h. Los programas más largos (diplomados, formaciones de 120 a 720 h) quedan
  fuera para no deformar el rango "X a Y horas" de títulos y descripciones.
- **Menos de 4 horas:** una combinación de menos de 4 h solo se publica si algún curso del tema con esa
  modalidad y esas horas se cotizó en el último año (desde 2025-10-01 en la verificación de octubre
  2026). Así quedan los RF cortos de Codelco que sí se venden y salen los cursos breves sin ventas
  (21 combinaciones en 9 temas).
- **Estándar:** el primer patrón que calza en el nombre (Codelco, MEL, Spence, Sierra Gorda…). Si ninguno
  calza y la categoría R11 es `[VP]` o `[DIVISIONAL]`, el estándar es Codelco; si tampoco, Genérico.

Las reglas exactas, las exclusiones y los `idCurso` de cada tema están en
[catalogo-cursos-reglas.json](catalogo-cursos-reglas.json).

Seis temas tienen una agrupación demasiado heurística para recalcularla: `computacion-general`,
`equipos-menores`, `mantenimiento-mecanico`, `mecanica-general`, `mineria-procesos` y
`seguridad-prevencion-otros`. Esos seis conservan los valores anteriores. "Otros" sigue con `noindex` y con la
nota de horas por confirmar.

## Qué cambió en la verificación de octubre 2026

- **52 de los 61 temas** tenían datos desactualizados. Ninguno pierde modalidades y 15 ganan alguna.
- **Plataforma elevadora:** era el más atrasado. Pasó de "e-learning 8 h" a 28 cursos en las 3 modalidades,
  de 2,5 a 32 h, con versión Codelco.
- **Cursos RF de Codelco:** los que no dicen "Codelco" en el nombre figuraban como Genérico. Ahora salen como
  Codelco.
- **Horas decimales:** las horas con decimales estaban truncadas (2,5 aparecía como 2). Ahora se publican con
  coma.
- **Estándares nuevos:** Sierra Gorda, Minera Candelaria, CMQB, Antofagasta Minerals y Minera Centinela.

## Fotos

El campo `imagen` de cada tema es una URL de DigitalOcean Spaces en `repositorio/catalogo-web/`. Se administra
en el TMS, en Noticias → Repositorio de Imágenes → Catálogo de Imágenes Web.

- **Formato:** WebP de 800 px y menos de 200 KB.
- **Cursos sin foto:** con `imagen: null`, la tarjeta muestra el ícono del área. Son 23 de los 61.
- **Cambiar una foto:** súbela en esa categoría con el nombre `curso-<handle>` y pega la URL en `imagen`.

## Pendiente (decisión de INSECAP)

- **Temas nuevos** que la base respalda bien y la web no tiene: Sustancias peligrosas (44 cursos), Riesgo
  eléctrico NFPA 70E (26), Grúa telescópica, móvil y pedestal (34), Mantenimiento predictivo y análisis de
  fallas (41), Legislación laboral y Ley Karin (42), Climatización (17), Power BI (17).
  - Cada tema nuevo necesita su ruta en `SLUG_A_TEMA`, title y description en los 3 idiomas y un párrafo de
    respuesta (ver CLAUDE.md).
- **Trabajo en altura de 150 h, e-learning asincrónico** (curso 939): existe, pero sin cotizaciones desde
  2025-09. Hay que decidir si se publica.
- **Tableros** y **Ventilación minera**: tienen 3 cursos cada uno y ninguna cotización desde 2025.

## Cómo actualizarlo

1. En una copia de `DB_SGC`, aplicar las exclusiones y las reglas de `catalogo-cursos-reglas.json`.
2. Por cada tema, recalcular `modalidades`, `estandares` y `combinaciones` (modalidad × horas × estándar,
   sin duplicados).
3. Reemplazar esos campos en `src/data/cursos.json`. No tocar `handle`: es la URL publicada.
4. Correr `npm run build`. El build revisa largos de title y description, JSON-LD y redirecciones.
