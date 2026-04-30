# Insecap Landing

Sitio web institucional y landing de Insecap. SPA construida con Vite + React + TypeScript, estilizada con Tailwind CSS y componentes shadcn/ui. Incluye catálogo B2B, integración con Shopify, mapas de sedes, blog, simulador y soporte multilenguaje (i18next).

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **React Router**, **TanStack Query**, **Zustand**
- **i18next** (es / en)
- **Framer Motion** / **Swiper** / **Embla**

## Requisitos

- Node.js 20+ y npm (o Bun, ver `bun.lockb`)
- Docker (opcional, para despliegue)

## Desarrollo local

```sh
# 1. Clonar
git clone <URL_DEL_REPO>
cd LandingInsecap

# 2. Instalar dependencias
npm install

# 3. Servidor de desarrollo (http://localhost:8080)
npm run dev
```

### Scripts disponibles

| Script                       | Descripción                                            |
| ---------------------------- | ------------------------------------------------------ |
| `npm run dev`                | Servidor de desarrollo con HMR en `:8080`              |
| `npm run build`              | Build de producción a `dist/`                          |
| `npm run build:dev`          | Build con `mode=development`                           |
| `npm run preview`            | Sirve el build localmente                              |
| `npm run lint`               | Linter (ESLint)                                        |
| `npm run catalog:b2b:build`  | Regenera `src/data/b2bCatalog.json` desde el script    |

### Variables de entorno

Crea un archivo `.env.local` en la raíz si necesitas sobreescribir valores. Las variables expuestas al cliente deben prefijarse con `VITE_`.

| Variable             | Uso                                                                         |
| -------------------- | --------------------------------------------------------------------------- |
| `TMS_PROXY_TARGET`   | Target del proxy `/api` en dev server (default `https://tms.insecap.cl`)    |
| `VITE_*`             | Cualquier variable expuesta al cliente (se embebe en el bundle al build)    |

> El proxy `/api` definido en [vite.config.ts](vite.config.ts) aplica **solo** al servidor de desarrollo. En producción configura el reverse proxy a nivel de infraestructura/CDN.

## Estructura del proyecto

```
src/
  components/     Componentes UI y secciones (Header, Hero, Catalog, ...)
  pages/          Rutas (Index, AboutUs, CourseDetail, Blog, ...)
  lib/            Utilidades, i18n, datos del catálogo, integraciones
  hooks/          Custom hooks (useMobile, useScrollAnimation, ...)
  stores/         Estado global con Zustand (cartStore)
  data/           Datasets estáticos (b2bCatalog.json, clients)
  assets/         Imágenes y logos
public/           Activos servidos tal cual (robots.txt, isotipos, mockups)
scripts/          Scripts de build (build-b2b-catalog.mjs)
```

## Docker

El proyecto incluye un [`Dockerfile`](Dockerfile) multi-stage (build con Node 20 + servido con Nginx), [`nginx.conf`](nginx.conf) con fallback SPA y un [`docker-compose.yml`](docker-compose.yml) pensado para el VPS (consume la imagen publicada en GHCR).

### Build local de la imagen

```sh
docker build -t insecap-landing:latest .
```

### Ejecutar el contenedor en local

```sh
docker run --rm -p 8080:80 --name insecap-landing insecap-landing:latest
```

Luego abre http://localhost:8080.

### Variables de entorno en el build

Las variables `VITE_*` se embeben durante el build. Para inyectarlas pásalas como build args:

```sh
docker build \
  --build-arg VITE_TMS_API_URL=https://tms.insecap.cl \
  --build-arg VITE_B2B_CATALOG_ENABLED=true \
  -t insecap-landing:latest .
```

### Despliegue con `docker-compose.yml` (VPS)

En el VPS, junto al compose, crea un `.env`:

```env
IMAGE=ghcr.io/insecapdevelopers/landinginsecap
TAG=latest          # o sha-xxxxxxx para fijar version / rollback
```

Luego:

```sh
docker login ghcr.io -u <usuario> --password-stdin <<< "<PAT>"
docker compose pull
docker compose up -d
```

### Notas

- Puerto interno del contenedor: `80`. En el VPS se expone solo en `127.0.0.1:8080` para que tu Nginx del host haga el TLS y el proxy.
- Nginx interno con fallback SPA, cache largo para `/assets/*` con hash, no-cache para `index.html` y headers de seguridad básicos.
- `HEALTHCHECK` incluido en el `Dockerfile`. Logs rotados a 10MB × 5 archivos. Filesystem read-only con `tmpfs` para `/var/cache/nginx`, `/var/run`, `/tmp`.

## Despliegue

- **Vercel**: configuración en [vercel.json](vercel.json). Build: `npm run build`, output: `dist/`.
- **Docker**: ver sección anterior.
- **Estático genérico**: cualquier hosting que sirva `dist/` con fallback a `index.html` para rutas SPA.

## Túnel local (opcional)

Para exponer el dev server a internet (pruebas con dispositivos externos o webhooks):

```sh
ngrok http 8080 --log=stdout
```
