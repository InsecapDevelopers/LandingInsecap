---
name: INSECAP Capacitaciones
description: Sitio de marca de INSECAP — capacitación industrial chilena, confiable y cercana, en azul/cyan con Capín como gesto humano.
colors:
  primary: "#485CC7"
  primary-light: "#7080DB"
  secondary: "#00B8DE"
  secondary-light: "#00D4FF"
  sky-accent: "#38BDF8"
  sky-deep: "#0EA5E9"
  sky-highlight: "#7DD3FC"
  neutral-bg: "#F8FAFB"
  surface: "#FFFFFF"
  ink: "#0D1C3F"
  muted-ink: "#64748B"
  border: "#E2E8F0"
  destructive: "#EF4444"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(1.9rem, 6.5vw, 3rem)"
    fontWeight: 800
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
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
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

## 1. Overview

Sitio de marca de una OTEC industrial chilena: **serio para el gerente minero, cálido para la persona que se capacita**. La estrella norte es "Creciendo Juntos" — cada superficie balancea prueba de credibilidad (certificaciones, stats, fotografía real de sedes y faenas) con un gesto humano (la mascota Capín, color vivo, motion suave).

**The Creciendo Juntos Rule.** Ningún bloque es solo corporativo ni solo simpático: si una sección muestra logos y números, algo humano la acompaña (Capín asomado, una foto real, una onda de color). Si una sección es juguetona, un dato duro la ancla.

**The Wave Rule.** Las secciones de la home nunca se cortan con una línea horizontal dura. Se conectan con ondas SVG curvas, blobs radiales desenfocados y gradientes compartidos que cruzan la costura entre secciones. Prueba de auditoría: si al hacer scroll se percibe "donde termina una sección y empieza otra" como un borde recto, falta empalme.

Estructura de la home (`src/pages/Index.tsx`): VideoHero oscuro full-viewport → onda hacia fondo claro → bloque sobre gradiente único (`from-[hsl(210,20%,98%)] via-white to-gray-50`): hero claro con carrusel → franja de acreditaciones → `WaveDivider` → oferta de Cursos Abiertos → noticias — luego Catálogo, banner de simuladores, clientes, innovación, estadísticas (NumberTicker), DUA y productos Shopify. Cursos Abiertos y simuladores se apagan vía `src/lib/featureFlags.ts`. La app abre con SplashScreen y revela el contenido con `.app-reveal` (800ms, cubic-bezier suave).

## 2. Colors: azul que dirige, cyan que actúa

**The One-Blue Rule.** El azul INSECAP (`#485CC7`) es identidad y estructura; el cyan (`#00B8DE` / sky `#38BDF8`) es acción y energía. Los tokens "orange" existen por herencia pero están **aliased a cyan**: está prohibido introducir naranjo u otro acento nuevo.

- **Primary — Azul INSECAP (#485CC7)**: títulos de sección, nav, botón "volver arriba". Es el color que firma. El footer usa `--gradient-footer` (cyan profundo → azul INSECAP oscuro, 135°), no azul plano.
- **Secondary — Cyan (#00B8DE) y Sky (#38BDF8)**: CTAs, palabras destacadas en gradiente `sky-500 → cyan-400`, eyebrows, íconos activos. Todo lo clickeable o enfático tira a cyan.
- **Neutral**: fondo del sitio `#F8FAFB` (hsl 210 20% 98%), superficies blancas, tinta `#0D1C3F` (azul muy oscuro, nunca negro puro), texto secundario `#64748B`, bordes `#E2E8F0`.
- **Overlays oscuros**: sobre video/fotos se usa `blue-950` con gradiente negro→azul (45–70% de opacidad) para legibilidad; el texto encima es blanco con la palabra clave en gradiente cyan.
- **Fondos decorativos**: blobs radiales desenfocados (`#38BDF8`, `#818cf8` a 25–40% de opacidad) y retícula de puntos slate al 35%.

Contraste: cuerpo `#0D1C3F` sobre `#F8FAFB` ≈ 15:1 ✓. El texto `#64748B` se reserva para secundario ≥14px. Texto blanco sobre cyan solo en negrita ≥14px.

## 3. Typography

Una sola familia: **Montserrat**. Solo se importan los pesos 400 / 500 / 600 / 700 (`@fontsource`); los heroes usan `font-extrabold` (800), que el navegador sintetiza desde 700 — no cargar el 800 real sin decidirlo a propósito. La voz sale del contraste de peso y tamaño, no de mezclar familias — identidad ya comprometida, no se cambia.

- **Display (heroes)**: `font-extrabold`, `clamp(1.9rem, 6.5vw, 3rem)` (hasta `clamp(1.8rem, 6vw, 4rem)` en headings uppercase de sección tipo Cursos Abiertos), tracking apretado (-0.025em), `leading-[1.1–1.15]`. La palabra clave va en gradiente cyan o rotando (WordRotate).
- **Headings de sección**: bold 700, 30–48px, en azul INSECAP sobre claro o blanco sobre oscuro; subrayado corto de 4px cyan (`h-1 w-16 bg-insecap-cyan`) como firma.
- **Body**: regular 400, 16–18px, `leading-relaxed`, máx ~65ch. Los párrafos van **justificados globalmente** (`p { text-align: justify }` en `index.css`, reforzado en `.article-body`); no pelear contra eso con overrides locales.
- **Labels/eyebrows**: semibold 600, 12–14px, uppercase, tracking amplio (0.18–0.25em), en cyan. Se usa **una vez por página como apertura de sección clave**, no encima de cada heading.
- Cifras destacadas (53k+, 2.3K+, 16 años): bold, junto a ícono Lucide de 20px en cyan.

## 4. Elevation

Plano por defecto; la elevación es funcional, no decorativa.

- **Tarjetas en reposo**: `--shadow-card` = `0 4px 20px -4px hsl(231 54% 53% / 0.1)` — sombra teñida del azul de marca, nunca negro puro.
- **Hover**: `--shadow-hover` = `0 8px 30px -4px hsl(222 65% 28% / 0.15)` + traslación -4px / scale 1.01.
- **CTAs**: glow cyan `shadow-sky-500/30`, intensificado al hover.
- **Chips de vidrio**: `bg-white/90 + backdrop-blur-md + borde blanco` — solo flotando sobre fotos, jamás como estilo de tarjeta general.
- Jerarquía z: fondo decorativo (0) → contenido (10) → ondas de empalme (20) → elementos flotantes (30) → nav/modales (40+).

## 5. Components

- **Botón primario**: pill (`rounded-full`), gradiente `#0ea5e9 → #38BDF8`, texto blanco semibold 14px, glow cyan, flecha Lucide opcional; hover scale 1.04, tap 0.97.
- **Botón secundario**: pill fantasma, borde 2px `slate-300`, texto `slate-700`; hover borde y texto a cyan. Siempre acompaña al primario, nunca compite.
- **Tarjeta de imagen hero**: `rounded-[2rem]`, sombra 2xl, marco de gradiente cyan→indigo rotado -2° detrás (`-inset-3`), crossfade de fotos cada 5s (opacity + scale 1.05, 1.4s).
- **Stat-chip**: vidrio blanco 90%, ícono en cápsula tinted (sky-100/indigo-100), cifra bold + label 12px gris; flota sobre las esquinas de las fotos con drift vertical de ±8px.
- **Pill-badge (sobre oscuro)**: vidrio blanco 10% + borde blanco 25%, punto pulsante cyan (`animate-ping`) + ícono + texto semibold.
- **Ondas de empalme**: componente `WaveDivider` (y el empalme del VideoHero, mismas curvas): SVG `preserveAspectRatio="none"`, 3 paths superpuestos — sky `#38BDF8` al 75% → indigo `#818cf8` al 60% → cierre sólido contra el fondo de la sección siguiente (`#f0f9ff`) — altura 90px móvil / 130px desktop, con `-mb-px` para evitar la costura de 1px.
- **Oferta de Cursos Abiertos**: carrusel loop sobre gradiente `sky-50 → indigo-50 → white`; foto cuadrada `rounded-3xl` con badge cyan de modalidad, heading extrabold en dos tonos (blue-950 + blue-600), subrayado grueso `blue-600 → indigo-400`, fechas en tarjetas `slate-50` con borde `slate-100`, CTA pill con glow `shadow-sky-500/30`. Los links de fecha preseleccionan curso y modalidad en el formulario.
- **Capín (mascota)**: aparece asomado en esquinas de tarjetas/secciones (nunca centrado ni gigante), con drop-shadow; máximo una aparición por sección. Hoy vive en el Hero y en el 404; assets en `public/` (`Capin-14.png`, `CapinMov.webp`, `CapinReportero.webp`).
- **Motion**: framer-motion; entradas `fadeUp` 0.6s ease-out con stagger 0.12s, `viewport={{ once: true }}`; shine de texto (`animate-shine`, 6s, brillo sky-300); micro-interacciones táctiles en botones (`active:scale-95`, 100–150ms). **Todo respeta reduced motion**: `useReducedMotion` en secciones animadas y `motion-reduce:transform-none` en interacciones CSS. Los transforms de framer pisan los de Tailwind: centrados dentro de elementos animados van como `style={{ x: '-50%' }}`.

## 6. Do's and Don'ts

**Do:**
- Fotografía real de INSECAP (sedes, faenas, alumnos) desde el CDN de Shopify; alt text descriptivo en español.
- Todo texto visible pasa por i18n (`t(...)`, ES/EN/PT); años de experiencia siempre vía `getYearsOfExperience()`, nunca hardcodeados.
- Palabra clave del hero en gradiente cyan; el resto del título en tinta o blanco sólido.
- Todo lo interactivo lleva `focus-visible:ring-2` (azul o cyan según fondo) con `ring-offset`.
- Terminar cada sección con un camino a "Ver cursos" o "Contáctanos".

**Don't:**
- **"Corporativo frío"** (anti-referencia de PRODUCT.md): prohibido el gris banco/consultora, secciones sin ningún gesto humano, stock genérico de oficinas.
- **"Infantil/caricaturesco"** (anti-referencia de PRODUCT.md): Capín no protagoniza heroes ni se repite en cada bloque; nada de tipografías redondeadas "divertidas" ni paletas arcoíris.
- Prohibido introducir naranjo o acentos nuevos (One-Blue Rule).
- Prohibidos los cortes rectos entre secciones de la home (Wave Rule).
- Nada de emojis como íconos: solo Lucide SVG, un solo grosor de trazo.
- Glassmorphism solo en chips/badges flotando sobre fotos; jamás como estilo base de tarjetas.
- Prueba de auditoría: si una sección podría pertenecer al sitio de un banco o de un jardín infantil, está fuera de registro.
