---
name: INSECAP Capacitaciones
description: Sitio de marca de INSECAP — capacitación industrial chilena, confiable y cercana, en índigo/cian con Capín como gesto humano.
colors:
  primary: "#485CC7"
  primary-light: "#7080DB"
  primary-dark: "#3547B1"
  primary-deep: "#233076"
  secondary: "#00B8DE"
  cyan-ink: "#00778F"
  footer-start: "#0095B2"
  neutral-bg: "#F9FAFB"
  surface: "#FFFFFF"
  muted: "#F3F5F7"
  ink: "#0D1C3F"
  muted-ink: "#607085"
  border: "#E1E7EF"
  destructive: "#EF4444"
  sap-blue: "#284FD8"
  sap-navy: "#101D42"
  sap-cyan: "#08B8EC"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(1.9rem, 6.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  card: "32px"
  pill: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "64px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    hoverBackgroundColor: "{colors.primary-dark}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  badge-cyan:
    backgroundColor: "{colors.cyan-ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  stat-chip:
    backgroundColor: "#FFFFFFE6"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  pill-badge:
    backgroundColor: "#FFFFFF1A"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
---

# INSECAP — Sistema de Diseño

> Fuente de los colores: la paleta que hoy se sirve en insecap.cl para /es, /en y /pt (`/assets/index-BnNG1Oj_.css`, idéntica a `src/index.css:16-61`), más los ajustes de contraste de la tarea #8. Los tokens nuevos se aplican en el código por fases: theme-color en la Fase 3, fuentes en la Fase 6 y contraste (cyan-ink, muted-foreground) en la Fase 7. Mientras tanto, este documento manda.

## 1. Overview

Sitio de marca de una OTEC industrial chilena: **serio para el gerente minero, cálido para la persona que se capacita**. La estrella norte es "Creciendo Juntos" — cada superficie balancea prueba de credibilidad (certificaciones, stats, fotografía real de sedes y faenas) con un gesto humano (la mascota Capín, color vivo, motion suave).

**The Creciendo Juntos Rule.** Ningún bloque es solo corporativo ni solo simpático: si una sección muestra logos y números, algo humano la acompaña (Capín asomado, una foto real, una onda de color). Si una sección es juguetona, un dato duro la ancla.

**The Wave Rule.** Las secciones de la home nunca se cortan con una línea horizontal dura. Se conectan con ondas SVG curvas, blobs radiales desenfocados y gradientes compartidos que cruzan la costura entre secciones. Prueba de auditoría: si al hacer scroll se percibe "donde termina una sección y empieza otra" como un borde recto, falta empalme.

Estructura de la home (`src/pages/Index.tsx`): VideoHero oscuro full-viewport → onda hacia fondo claro → bloque sobre gradiente único (`from-[hsl(210,20%,98%)] via-white to-gray-50`): hero claro con carrusel → franja de acreditaciones → `WaveDivider` → oferta de Cursos Abiertos → noticias — luego Catálogo, banner de simuladores, clientes, innovación, estadísticas (NumberTicker), DUA y Cursos Destacados. Cursos Abiertos y simuladores se apagan vía `src/lib/featureFlags.ts`.

**Splash: solo en la primera visita.** El contenido (y el HTML prerenderizado) se renderiza e hidrata siempre; el splash nunca lo bloquea ni lo reemplaza.

- Es un overlay fuera de React: `<div id="splash" aria-hidden="true">` en la plantilla, fuera de `#root`, con `display:none` por defecto.
- Marca: logo en SVG inline sobre el índigo de marca (`#485CC7`), sin Meteors ni PNG remotos. El subtítulo lo inyecta el prerender según el locale.
- Un script inline (después de charset y viewport, antes del CSS, dentro de `try/catch`) agrega `html.splash-on` solo si: no existe `localStorage['insecap-splash-v1']`, `!navigator.webdriver`, el UA no es bot/crawler/Lighthouse/headless, no hay `prefers-reduced-motion: reduce` y no hay `saveData`.
- La marca en storage se escribe al mostrarlo. Dura como máximo **1,2 s** y sale con un fade de opacity, retirado por un timer del mismo script (independiente de la hidratación). Si storage falla, no se muestra.

## 2. Colors: índigo que dirige, cian que acompaña

**The One-Blue Rule.** El índigo INSECAP (`#485CC7`) es identidad, estructura y acción principal; el cian de marca (`#00B8DE`) es energía: superficies, bordes, íconos y degradados. Los tokens `insecap-orange*` existen por herencia pero están **aliased a cian**: está prohibido introducir naranjo u otro acento nuevo.

| Rol | Hex | Token | Uso |
|---|---|---|---|
| Primario, índigo INSECAP | **#485CC7** | `--insecap-blue` / `--primary`: `231 54% 53%` | CTA, botones, badges y títulos de sección. Texto blanco encima: 5,78:1 ✓ |
| Índigo claro | #7080DB | `--insecap-blue-light`: `231 60% 65%` | acentos decorativos, nunca texto sobre claro |
| Índigo oscuro | #3547B1 / #233076 | tramos de `--gradient-footer` | hover de botones y fondos profundos |
| Secundario, cian de marca | **#00B8DE** | `--insecap-cyan` / `--secondary`: `190 100% 44%` | superficies, bordes, íconos, subrayados y degradados. **Prohibido el texto blanco encima** (2,36:1 ✗) |
| **cyan-ink** (nuevo) | **#00778F** | `--insecap-cyan-ink: 190 100% 28%` | texto cian sobre fondos claros y fondo de botones o badges cian con texto blanco (5,20 sobre blanco / 4,98 sobre fondo / 4,76 sobre muted ✓) |
| Tinta | #0D1C3F | `--foreground`: `222 65% 15%` | texto principal (≈15:1 sobre el fondo). Es la tinta alternativa sobre cian #00B8DE: 7,10:1 ✓ |
| Fondo / superficie / muted / borde | #F9FAFB / #FFFFFF / #F3F5F7 / #E1E7EF | `--background` / `--card` / `--muted` / `--border` | estructura neutra |
| Texto secundario | **#607085** | `--muted-foreground: 215 16% 45%` | 4,84 sobre el fondo y 4,63 sobre muted ✓ |
| Subpaleta SAP Insecap Mineral | #284FD8 · #101D42 · #08B8EC | literales | **solo** en `SapSpecialty`, `SapEntorno` y `motion-carousel` |

Reglas de contraste (WCAG AA, 4,5:1 para texto normal):

- **Nunca texto blanco sobre cian `#00B8DE`.** Un botón, badge o chip cian con texto blanco usa `bg-insecap-cyan-ink`; si debe ser cian de marca, el texto va en tinta `#0D1C3F`.
- Texto cian sobre fondo claro (eyebrows, enlaces, palabras destacadas) usa `text-insecap-cyan-ink`, no `text-insecap-cyan`.
- `muted-foreground` sube de 47% (`#65758B`, 4,49 sobre el fondo: falla) a 45% (`#607085`).
- Se descartó `#007F99` como cyan-ink: da 4,47 sobre `#F9FAFB` (falla).

Degradados documentados:

- **Header al hacer scroll y menú móvil** (`Header.tsx`): `from-insecap-cyan-ink to-insecap-blue/95` con texto del menú encima. Medido en la Fase 7: el inicio anterior, `insecap-cyan/85` sobre blanco, daba 2,11:1 con blanco (1,95 con el `white/90` del menú); con cyan-ink sólido da 5,20 (4,53 con `white/90`) y el extremo índigo da 5,21.
- **Footer** (`--gradient-footer`, 135°): `#0095B2 → #3547B1 → #233076`. El tramo inicial `#0095B2` con blanco da 3,53:1, apto solo para texto grande (≥24px, o ≥18,66px en negrita); el texto normal se apoya en los tramos índigo.
- **Overlays oscuros**: sobre video/fotos se usa `blue-950` con gradiente negro→azul (45–70% de opacidad); el texto encima es claro y la palabra clave puede ir en gradiente cian, solo porque el fondo es oscuro.
- **Fondos decorativos**: blobs radiales desenfocados (sky-400 e indigo-400 a 25–40% de opacidad) y retícula de puntos slate al 35%. Nunca llevan texto.
- Tailwind `slate` es la escala neutra de apoyo (bordes, botones fantasma, tarjetas de fechas).

**theme-color:** `#485CC7`, en `index.html` y en el manifest si se crea (reemplaza al azul actual, que no pertenece a la paleta).

**Retirado del código en la Fase 7:** el naranjo de `--shadow-cta` (ahora índigo) y de `.dark --accent` (ahora cian con texto en tinta), `--gradient-hero` y el CTA sky, que pasó a índigo en Hero, Header, Oferta de Cursos Abiertos y el banner SAP. `--secondary-foreground` y `--accent-foreground` pasan a tinta, porque son texto sobre cian.

**Pendiente de retirar del código** (por fase, no son parte del sistema):

- cualquier referencia a los colores del TMS: el sitio público usa solo esta paleta.

## 3. Typography

Una sola familia: **Montserrat**, autoalojada en woff2 (subsets latin y latin-ext), pesos **400 / 500 / 600 / 700**, `font-display: swap`, con preload de 400 y 700. Sin Google Fonts en `index.html` (hoy convive con `@fontsource`; se quita en la Fase 6).

- **No se carga el 800.** Con la cara 700 disponible el navegador elige la más cercana y no sintetiza, así que `font-extrabold` y `font-black` ya se ven en 700. En código nuevo se usa `font-bold`; `font-light` pasa a `font-normal`.
- **Display (heroes)**: bold 700, `clamp(1.9rem, 6.5vw, 3rem)` (hasta `clamp(1.8rem, 6vw, 4rem)` en headings uppercase de sección tipo Cursos Abiertos), tracking apretado (-0.025em), `leading-[1.1–1.15]`. La palabra clave va destacada (cyan-ink sobre claro, gradiente cian solo sobre oscuro) o rotando (WordRotate).
- **Headings de sección**: bold 700, 30–48px, en índigo INSECAP sobre claro o blanco sobre oscuro; subrayado corto de 4px cian (`h-1 w-16 bg-insecap-cyan`) como firma decorativa.
- **Body**: regular 400, 16–18px, `leading-relaxed`, máx ~65ch. Los párrafos van **justificados globalmente** (`p { text-align: justify }` en `index.css`, reforzado en `.article-body`); no pelear contra eso con overrides locales.
- **Labels/eyebrows**: semibold 600, 12–14px, uppercase, tracking amplio (0.18–0.25em), en cyan-ink. Se usa **una vez por página como apertura de sección clave**, no encima de cada heading.
- Cifras destacadas (53k+, 2.3K+, 16 años): bold, junto a ícono Lucide de 20px en cian.
- Un solo `<h1>` por página.

## 4. Elevation

Plano por defecto; la elevación es funcional, no decorativa.

- **Tarjetas en reposo**: `--shadow-card` = `0 4px 20px -4px hsl(231 54% 53% / 0.1)` — sombra teñida del índigo de marca, nunca negro puro.
- **Hover**: `--shadow-hover` = `0 8px 30px -4px hsl(222 65% 28% / 0.15)` + traslación -4px / scale 1.01.
- **CTAs**: glow suave teñido de índigo, intensificado al hover (sin naranjo).
- **Chips de vidrio**: `bg-white/90 + backdrop-blur-md + borde blanco` — solo flotando sobre fotos, jamás como estilo de tarjeta general.
- Jerarquía z: fondo decorativo (0) → contenido (10) → ondas de empalme (20) → elementos flotantes (30) → nav/modales (40+) → splash (sobre todo, solo primera visita).

## 5. Components

- **Botón primario**: pill (`rounded-full`), fondo índigo `#485CC7`, texto blanco semibold 14px, hover `#3547B1`, flecha Lucide opcional; hover scale 1.04, tap 0.97.
- **Botón secundario**: pill fantasma, borde 2px `slate-300`, texto `slate-700`; hover borde y texto a cyan-ink. Siempre acompaña al primario, nunca compite.
- **Badge cian**: fondo cyan-ink `#00778F` con texto blanco, o fondo cian `#00B8DE` con texto en tinta `#0D1C3F`.
- **Tarjeta de imagen hero**: `rounded-[2rem]`, sombra 2xl, marco de gradiente cian→índigo rotado -2° detrás (`-inset-3`), crossfade de fotos cada 5s (opacity + scale 1.05, 1.4s).
- **Stat-chip**: vidrio blanco 90%, ícono en cápsula tinted (sky-100/indigo-100), cifra bold + label 12px en texto secundario `#607085`; flota sobre las esquinas de las fotos con drift vertical de ±8px.
- **Pill-badge (sobre oscuro)**: vidrio blanco 10% + borde blanco 25%, punto pulsante cian (`animate-ping`) + ícono + texto semibold.
- **Ondas de empalme**: componente `WaveDivider` (y el empalme del VideoHero, mismas curvas): SVG `preserveAspectRatio="none"`, 3 paths superpuestos — sky-400 al 75% → indigo-400 al 60% → cierre sólido contra el fondo de la sección siguiente (`#f0f9ff`) — altura 90px móvil / 130px desktop, con `-mb-px` para evitar la costura de 1px. Son superficies decorativas, sin texto.
- **Oferta de Cursos Abiertos**: carrusel loop sobre gradiente `sky-50 → indigo-50 → white`; foto cuadrada `rounded-3xl` con badge de modalidad en cyan-ink, heading bold en dos tonos (blue-950 + blue-600), subrayado grueso `blue-600 → indigo-400`, fechas en tarjetas `slate-50` con borde `slate-100`, CTA pill índigo. Los links de fecha preseleccionan curso y modalidad en el formulario.
- **Header**: transparente arriba del todo; al hacer scroll, degradado cian→índigo (ver §2). El CTA del header es índigo.
- **Footer**: `--gradient-footer` (ver §2), no un azul plano.
- **Capín (mascota)**: aparece asomado en esquinas de tarjetas/secciones (nunca centrado ni gigante), con drop-shadow; máximo una aparición por sección. Hoy vive en el Hero y en el 404; assets en `public/` (`Capin-14.webp`, `CapinReportero.webp` e `images/capin/` (el Hero usa `capin-saludo-320.webp`, estático)).
- **Motion**: framer-motion; entradas `fadeUp` 0.6s ease-out con stagger 0.12s, `viewport={{ once: true }}`; shine de texto (`animate-shine`, 6s, brillo sky-300); micro-interacciones táctiles en botones (`active:scale-95`, 100–150ms). Solo se animan `transform` y `opacity`. **Todo respeta reduced motion**: `useReducedMotion` en secciones animadas y `motion-reduce:transform-none` en interacciones CSS. Los transforms de framer pisan los de Tailwind: centrados dentro de elementos animados van como `style={{ x: '-50%' }}`. Lo que está sobre el pliegue no arranca invisible (`initial={false}`), para que el HTML prerenderizado se vea sin esperar JS.

## 6. Do's and Don'ts

**Do:**
- Fotografía real de INSECAP (sedes, faenas, alumnos) desde el CDN de Shopify; alt text descriptivo en español.
- Todo texto visible pasa por i18n (`t(...)`, ES/EN/PT); años de experiencia siempre vía `getYearsOfExperience()`, nunca hardcodeados.
- Texto cian sobre claro siempre en cyan-ink; el cian de marca queda para superficies, bordes, íconos y degradados.
- Todo lo interactivo lleva `focus-visible:ring-2` (índigo o cian según fondo) con `ring-offset`.
- Terminar cada sección con un camino a "Ver cursos" o "Contáctanos".

**Don't:**
- **Texto blanco sobre cian `#00B8DE`: prohibido** (2,36:1). Usar cyan-ink de fondo o tinta como texto.
- **"Corporativo frío"** (anti-referencia de PRODUCT.md): prohibido el gris banco/consultora, secciones sin ningún gesto humano, stock genérico de oficinas.
- **"Infantil/caricaturesco"** (anti-referencia de PRODUCT.md): Capín no protagoniza heroes ni se repite en cada bloque; nada de tipografías redondeadas "divertidas" ni paletas arcoíris.
- Prohibido introducir naranjo, CTAs sky u otros acentos nuevos (One-Blue Rule). La subpaleta SAP no sale de sus tres componentes.
- Prohibidos los cortes rectos entre secciones de la home (Wave Rule).
- Un splash que bloquee el contenido o se repita en cada visita.
- Cargar Montserrat 800 o fuentes desde Google Fonts.
- Nada de emojis como íconos: solo Lucide SVG, un solo grosor de trazo.
- Glassmorphism solo en chips/badges flotando sobre fotos; jamás como estilo base de tarjetas.
- Prueba de auditoría: si una sección podría pertenecer al sitio de un banco o de un jardín infantil, está fuera de registro.
