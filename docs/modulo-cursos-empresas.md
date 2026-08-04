# Módulo de Cursos para Empresas (B2B) — ETL de migración e implementación

Objetivo: sacar el catálogo B2B de Shopify — contenido en la base de datos del TMS, imágenes en
DigitalOcean Spaces, y la web consumiendo una API interna. Es la **última** parte del sitio que
todavía depende de Shopify: noticias y cursos abiertos ya migraron.

Mismo procedimiento que [modulo-noticias.md](modulo-noticias.md).

## 1. Situación actual

```
Shopify (qvs57u-ve.myshopify.com)
   │  Storefront API, query "tag:b2b", token embebido en src/lib/shopify.ts:7
   ▼
src/lib/b2bCatalogData.ts ──► B2bCourseCatalog / B2bCourseDetail  (/cursos-empresas)
   └── fallback: src/data/b2bCatalog.json  ⚠️ HOY ESTÁ VACÍO (0 temas)
```

Dos hallazgos del código actual:

- **El fallback no protege nada.** Si Shopify falla, `b2bCatalog.json` devuelve 0 temas y la
  página queda en blanco. Se regenera desde un Excel con `npm run catalog:b2b:build`.
- **Hay una rama muerta.** `b2bCatalogData.ts` agrupa por tags `tema:` y `tema-handle:`, pero
  **ningún producto los tiene** (0 de 61). El agrupamiento real ocurre por `productType`.

## 2. Pipeline

```
Shopify ──scripts/export-b2b.mjs──> b2b-export/products.json  (crudo + images/)
                                            │
                                   scripts/etl-b2b.mjs         (limpia y normaliza)
                                            ▼
                                   b2b-export/cursos.json      ← esto se importa
```

```bash
node scripts/export-b2b.mjs      # extract   (ya ejecutado: 61 productos, 39 imágenes)
node scripts/etl-b2b.mjs         # transform (--report no escribe, --test corre los asserts)
```

## 3. Perfilado del origen — qué hay realmente

Medido sobre los 61 productos, no supuesto:

| Campo de Shopify | Cobertura | Decisión |
|---|---|---|
| `title` | 61/61 | **Se migra** → `titulo` |
| `handle` | 61/61, únicos | **Se migra** → `slug` (preserva URLs) |
| `productType` | 61/61, 8 valores | **Se migra** → `categoria`. Es el agrupador real |
| `descriptionHtml` | 61/61 | **Se migra** como texto plano → `descripcion` (ver §4) |
| `featuredImage` | **38/61** | **Se migra** → `imagen`. 23 cursos no tienen |
| `variants` | 615 | **Se migran** → `combinaciones` (lo más valioso, ver §4) |
| `vendor` | 61/61, un solo valor `"Tu Empresa"` | Se descarta: no distingue nada |
| `priceRange` | 61/61, **todos en 0** | Se descarta: el modelo es "precio a cotizar" |
| `tags` | 61/61 | Se descartan `b2b`, `cotizacion`, `empresa` (plomería de la tienda). El resto duplica `productType` |
| `collections` | 61/61 | Se descarta: **coinciden con `productType` en los 61**, solo cambian mayúsculas |
| `id` (gid) | 61/61 | **Se descarta**: Shopify queda fuera |

Las 8 categorías: Computación e Informática (5 cursos), Electricidad y Electrónica (6),
Mecánica Industrial (6), Operación de Equipos (12), Procesos Industriales (6),
Seguridad y Prevención de Riesgos (14), Técnicas Aplicadas (7), Técnicas de Habilidades Blandas (5).

## 4. Dos decisiones que definen el modelo

### 4.1 Las variantes son combinaciones de dictado, no SKUs

Cada producto tiene entre 1 y 50 variantes, y las tres opciones son siempre las mismas:
**Modalidad × Estándar × Horas**. No son unidades vendibles: describen de cuántas formas se puede
dictar el curso. Por eso en el modelo nuevo son una tabla propia y no "variantes".

- **Modalidad** (3): Presencial, E-learning Sincrónico, E-learning Asincrónico.
- **Estándar** (16): Estándar, Codelco, Minera Escondida (MEL), BHP Spence, Collahuasi, Lomas Bayas…
- **Horas** (45 valores): mayoritariamente numéricas (8, 16, 24, 4, 40…), pero **6 combinaciones
  dicen "A definir"** → se guardan como `NULL`, no como 0.

El ETL deduplica: 615 variantes → **614 combinaciones** (había una repetida).

### 4.2 La descripción es una plantilla, no contenido

Los 61 textos siguen el mismo molde autogenerado, entre 146 y 193 caracteres:

> "Curso de **AutoCAD** — área: Computación e Informática. Disponible en múltiples modalidades y
> estándares. Producto orientado a empresas. Precio a cotizar."

No aporta información real: repite el título, la categoría y el modelo de venta, todo lo cual ya
está en columnas propias. Se migra para no perderla, pero **conviene reescribirla** desde el admin
nuevo. El ETL la guarda como texto plano (el HTML era solo un `<p>` envolvente).

## 5. Modelo de datos final

Dos tablas: el curso y sus formas de dictado.

```sql
CREATE TABLE cursos_empresa (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  titulo          VARCHAR(500) NOT NULL,
  descripcion     TEXT NULL,
  categoria       VARCHAR(120) NOT NULL,
  categoria_slug  VARCHAR(120) NOT NULL,   -- para filtrar por URL
  imagen          VARCHAR(500) NULL,       -- URL absoluta en Spaces
  visible         TINYINT(1) NOT NULL DEFAULT 1,
  creado_en       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en  DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  eliminado_en    DATETIME NULL,           -- soft delete, igual que noticias
  INDEX idx_activos (eliminado_en, categoria_slug, titulo)
);

CREATE TABLE cursos_empresa_combinaciones (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  curso_id   BIGINT UNSIGNED NOT NULL,
  modalidad  VARCHAR(60) NOT NULL,   -- Presencial | E-learning Sincrónico | E-learning Asincrónico
  estandar   VARCHAR(120) NOT NULL,  -- Estándar | Codelco | MEL | …
  horas      SMALLINT UNSIGNED NULL, -- NULL = "A definir"
  UNIQUE KEY uq_combo (curso_id, modalidad, estandar, horas),
  FOREIGN KEY (curso_id) REFERENCES cursos_empresa(id) ON DELETE CASCADE
);
```

Decisiones deliberadas:

- **Sin tabla de categorías**: son 8 valores estables y sin atributos propios. Si algún día
  necesitan descripción o icono, se promueve a tabla; hoy sería una unión de más sin ganancia.
- **Sin precios**: los 61 vienen en 0 y el flujo es cotización. Añadir la columna invitaría a
  llenarla y a mostrarla por error.
- **`horas` nullable** en vez de 0: "A definir" es un estado real del negocio, no una duración.
- **`UNIQUE` sobre la combinación**: el propio origen traía una duplicada; que la base lo impida.
- **Soft delete** con `eliminado_en`, consistente con el módulo de noticias.

## 6. Campos derivados por el ETL

| Campo | Cómo se obtiene |
|---|---|
| `categoria_slug` | `categoria` normalizada a `[a-z0-9-]` (sin tildes) |
| `modalidades` / `estandares` | valores distintos de las combinaciones, para pintar filtros sin recorrer todo |
| `combinaciones` | variantes deduplicadas por (modalidad, estándar, horas) |
| `descripcion` | `descriptionHtml` sin etiquetas y con la puntuación corregida |

## 7. Avisos del ETL (revisar antes de importar)

1. **23 de 61 cursos no tienen imagen** (`hidraulica-y-neumatica`, `lubricacion-industrial`,
   `mantenimiento-mecanico`, `soldadura-industrial`…). Hay que conseguirlas o definir una imagen
   por categoría; si no, el catálogo se verá disparejo. La UI ya tolera `imagen = null`.
2. **6 combinaciones con horas "A definir"**: entran como `NULL`. Decidir si se completan o si la
   ficha debe mostrar "Duración a convenir".
3. **Las descripciones son plantilla** (§4.2): migran, pero deberían reescribirse.

## 8. Importación

### 8.1 Cargar `cursos.json`

Upsert por `slug` para poder re-correr el ETL sin duplicar:

```js
const cursos = JSON.parse(fs.readFileSync('cursos.json'));
for (const c of cursos) {
  const cursoId = upsertPorSlug({
    slug: c.slug, titulo: c.titulo, descripcion: c.descripcion,
    categoria: c.categoria, categoria_slug: c.categoria_slug,
    imagen: c.imagen, visible: c.visible ? 1 : 0,
  });
  // Reemplazo completo: es idempotente y el volumen es chico (614 filas)
  borrarCombinaciones(cursoId);
  for (const k of c.combinaciones) insertarCombinacion({ curso_id: cursoId, ...k });
}
```

### 8.2 Imágenes a Spaces

Hoy las URLs son relativas (`/cursos/<archivo>`) porque el export corrió sin credenciales.
Para dejarlas absolutas en el CDN, re-correr con credenciales y luego el ETL:

```bash
DO_SPACES_KEY=... DO_SPACES_SECRET=... DO_SPACES_REGION=sfo2 \
DO_SPACES_BUCKET=storageisecap DO_SPACES_PREFIX=cursos \
node scripts/export-b2b.mjs && node scripts/etl-b2b.mjs
```

Alternativa manual: `s3cmd sync b2b-export/images/ s3://storageisecap/cursos/ --acl-public` y
reemplazar el prefijo `/cursos/` por la URL del CDN durante el import.

## 9. API pública

Mismo patrón que noticias (`/api/publica/*` en el TMS Plus), camelCase, sin token,
`Cache-Control: public, max-age=300`, solo `eliminado_en IS NULL`.

```
GET /api/publica/cursos-empresa?page=1&per_page=12&categoria=<slug>&modalidad=<valor>
→ { "data": [ { id, slug, titulo, categoria, categoriaSlug, imagen,
                modalidades: [], estandares: [] } ],
    "total": 61, "page": 1, "per_page": 12 }
    // sin descripcion ni combinaciones: el listado no los necesita

GET /api/publica/cursos-empresa/{slug}
→ { …todo, incluido descripcion y combinaciones: [{ modalidad, estandar, horas }] }
→ 404 si no existe o está eliminado

GET /api/publica/cursos-empresa/categorias
→ [ { categoria, categoriaSlug, total } ]   // para los filtros, sin traer los 61 cursos
```

## 10. Cambios en la web (este repo)

La UI ya existe; solo cambia la fuente de datos.

**`src/lib/b2bData.ts`** (nuevo) — mantener la forma de `B2bCatalogTopic`
([b2bCatalogData.ts](../src/lib/b2bCatalogData.ts)) para no reescribir los componentes:

```ts
const toTopic = (c: ApiCursoEmpresa): B2bCatalogTopic => ({
  tema: c.titulo,
  handle: c.slug,
  categoria: c.categoria,
  image: c.imagen ? { url: c.imagen, altText: c.titulo } : undefined,
  cursos_fuente: 1,
  modalidades: c.modalidades,
  estandares: c.estandares,
  combinaciones: c.combinaciones ?? [],
});
```

| Archivo | Llamada actual | Reemplazo |
|---|---|---|
| [B2bCourseCatalog.tsx](../src/components/B2bCourseCatalog.tsx) | `loadB2bCatalogTopics()` | `fetchCursosEmpresa(page, filtros)` |
| [B2bCourseDetail.tsx](../src/components/B2bCourseDetail.tsx) | busca en la lista completa | `fetchCursoEmpresaBySlug(handle)` |

**URLs**: las rutas `/cursos-empresas` y `/curso-empresa/:handle` no cambian, y los `slug` son los
mismos `handle` de Shopify, así que no hacen falta redirects.

## 11. Orden de corte

1. Backend: tablas + endpoints + import (§5, §8, §9). Shopify sigue sirviendo la web.
2. Frontend: `b2bData.ts` + flag apagado → deploy → encender y validar.
3. Conseguir las 23 imágenes faltantes y reescribir descripciones desde el admin nuevo.
4. Congelar edición en Shopify, re-correr export+ETL+import una última vez (upsert).
5. Sin regresiones: **apagar Shopify por completo**. Borrar `src/lib/shopify.ts` entero (con el
   token embebido), `b2bCatalogData.ts`, `src/data/b2bCatalog.json`, el script
   `build-b2b-catalog.mjs` y la dependencia del catálogo JSON local.
   Este es el último módulo: al terminar, el sitio deja de depender de Shopify.
