Approach
Think before acting. Read existing files before writing code.
Be concise in output but thorough in reasoning.
Prefer editing over rewriting whole files.
Do not re-read files you have already read unless the file may have changed.
Test your code before declaring done.
No sycophantic openers or closing fluff.
Keep solutions simple and direct.
User instructions always override this file.

# SEO y GEO (visibilidad en buscadores y en IA): reglas para todo cambio

El sitio se **prerenderiza en el build**: cada ruta sale como HTML completo en `dist/<locale>/<ruta>/index.html` y luego se hidrata con React. Así GPTBot, ClaudeBot, PerplexityBot, Googlebot y bingbot leen el contenido sin ejecutar JS. Si se rompe esto, el sitio vuelve a ser invisible para las IA. Contexto completo en el issue #8.

## Antes de dar por terminado cualquier cambio
1. `npm run build` debe terminar OK. El build corre `scripts/check-dist.mjs`, que **es el contrato SEO**: si falla, se corrige el código, **nunca se afloja ni se salta el check**.
2. Si tocaste nginx, Docker, rutas o `<head>`, levanta el contenedor y corre `B=http://localhost:8080 bash scripts/check-bots.sh` (es lo mismo que corre CI antes de publicar).
3. Si tocaste componentes que se ven en la carga inicial, corre `node scripts/check-hydration.mjs <url>`: cero avisos de hidratación.
4. Después de publicar en `main`, verifica producción: `B=https://insecap.cl bash scripts/check-bots.sh`.

CI (`.github/workflows/deploy.yml`) construye la imagen, la prueba con `check-bots.sh` y solo entonces la publica. Si falla, producción queda con la imagen anterior.

## Render (SSR/prerender)
- El contenido que deben ver los bots se pinta en el render, no en `useEffect`. Los datos remotos (noticias del TMS Plus, catálogo) se piden **en el build** con las `queryFn` de `src/lib/queries.ts` y viajan hidratados (`window.__RQ__`).
- Render determinista: nada de `Math.random()`, `new Date()` ni `window`/`localStorage` en el render, porque el HTML del servidor no coincide con el del cliente. Si hace falta, se lee en un `useEffect`.
- Animaciones sobre el pliegue con `initial={false}` (framer-motion): el texto debe estar visible en el HTML sin JS.
- `React.lazy` funciona porque `src/entry-server.tsx` espera `onAllReady`. No cambiarlo a `renderToString`.
- El splash es un overlay fuera de React que solo aparece en la primera visita y nunca a bots (`index.html`). No volver a gatear el montaje de la app con él.

## Agregar o cambiar una página
1. La ruta va en `src/AppShell.tsx` (`routeDefinitions`) **y** en `src/lib/seo-routes.ts`, la tabla única de la que salen robots, hreflang, sitemap, `llms.txt` y la lista de rutas a prerenderizar.
   - `kind: 'institucional'`: está traducida y se indexa en es, en y pt.
   - `kind: 'datos'`: contenido solo en español; se indexa en `/es` y en `/en` y `/pt` va con `noindex`.
   - Rutas con parámetro: sus paths van en `listDynamicPaths` de `src/entry-server.tsx`.
2. Title y description escritos a mano en `seo.pages.<clave>` de `src/lib/translations.ts`, para es, en y pt: title de **60 caracteres o menos** (keyword al inicio, `| INSECAP` al final) y description de **140 a 155**, únicos entre páginas.
3. **Un solo `<h1>` por página.** El resto, `h2`/`h3` en orden y sin saltos.
4. Breadcrumb visible (`<nav aria-label><ol>`, con `aria-current="page"`) en cursos, categorías, sedes y noticias.
5. Si la página tiene un tipo de schema (curso, sede, FAQ, noticia), su JSON-LD sale de `src/lib/jsonld.ts`. Un solo bloque `@graph` por página, `@id` estables y **nunca** "TODO" ni "Por confirmar" dentro del JSON-LD.
6. **Nunca cambiar ni borrar una URL publicada sin 301.** Las redirecciones salen de `src/lib/legacy-redirects.ts` hacia `redirects.map`: un solo salto, con prefijo de idioma y conservando la query (`gclid`, `utm`). Los enlaces internos apuntan directo a la URL final, no a una que redirige.

## Contenido (GEO: que las IA citen a INSECAP)
- **No inventar datos de negocio.** Lo que falte va como `TODO:` en el código y en pantalla con `<Pendiente>` ("Por confirmar"). Una ficha de curso sin párrafo de respuesta real queda con `noindex`.
- Las páginas clave abren con un párrafo de respuesta de 40 a 60 palabras con entidades explícitas: INSECAP, OTEC, ciudad, acreditaciones (`src/data/respuestas.ts`).
- Dirección y teléfono de las sedes (NAP) **solo** desde `src/data/sedes.ts`; no hardcodear teléfonos ni direcciones en componentes.
- Hechos confirmados: fundación 2009; SENCE Resolución N° 12208; NCh 2728:2015; ISO 9001:2015; acreditada por Codelco. Redes: Instagram, Facebook, LinkedIn y TikTok (**no X**).
- Textos de enlace descriptivos (nada de "ver más" o "aquí" sueltos) y `alt` en toda imagen (`alt=""` solo en las decorativas).

## Rendimiento (Core Web Vitals)
- Ninguna imagen de más de **200 KB**: WebP al tamaño de render, con `width`/`height` y `loading="lazy"` bajo el pliegue. Las fotos remotas viven en DigitalOcean Spaces (repositorio de imágenes del TMS, categoría "Catálogo de Imágenes Web"), que no redimensiona: se suben ya en WebP al ancho de render. Lo que va sobre el pliegue (logo, imagen LCP) va local en `public/images/` (`src/lib/images.ts`). Nada de Shopify.
- Fuentes: solo Montserrat woff2 autoalojada (400 a 700). Nada de Google Fonts ni pesos nuevos.
- Terceros (GTM, Meta Pixel, Clarity) solo por el cargador diferido de `index.html`, nunca como `<script src>` en el HTML.
- Librerías pesadas con `import()` dinámico, fuera de la ruta inicial. Presupuesto móvil: LCP < 2,5 s, peso < 1,5 MB (lo vigila `.github/workflows/lighthouse.yml`).

## Seguridad y servidor
- Un `<script>` inline nuevo necesita su hash en la CSP: lo calcula `scripts/prerender.mjs`. Nada de `onclick="…"` ni `javascript:`.
- Un origen externo nuevo (API, CDN, píxel) se agrega en `scripts/csp.mjs`, o la CSP lo reporta.
- En `nginx.conf`, toda `location` con `add_header` propio debe incluir `snippets/security-headers.conf`; si no, pierde las cabeceras de seguridad.
- El nginx del VPS no está en el repo; su referencia es `docs/nginx-vps.conf`. Canónico: `https://insecap.cl/es`, sin www y sin barra final.

## Archivos para crawlers (se generan solos en el build; no editarlos a mano en `dist/`)
`robots.txt`, `sitemap-index.xml`, `llms.txt` y `llms-full.txt` salen de `seo-routes` y los datos (`src/lib/crawler-files.ts`). `/.well-known/ai-catalog.json` no debe existir. Medición y pasos fuera de código: `docs/seo-medicion.md`.

## Marca
Colores y tipografía en `DESIGN.md`: índigo `#485CC7`; cian `#00B8DE` solo decorativo, nunca con texto blanco encima; texto cian con `insecap-cyan-ink` (`#00778F`). Contraste AA mínimo de 4,5:1.
