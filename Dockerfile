# syntax=docker/dockerfile:1.7

# ---------- Stage 1: build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (better cache)
COPY package.json package-lock.json* bun.lockb* ./
# Try `npm ci` first (reproducible). If the lockfile is out of sync,
# fall back to `npm install` so the build doesn't break the deploy.
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund || npm install --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Copy source and build. Incluye .source-lastmod.json si CI lo generó (fechas de commit para el
# <lastmod> de los sitemaps; sin .git en la imagen, scripts/source-lastmod.mjs). Sin él, las
# páginas estáticas salen sin <lastmod>.
COPY . .

# VITE_* build-time vars (se embeben en el bundle).
# Pasa valores con `docker build --build-arg VITE_X=...` o desde CI.
ARG VITE_TMS_PLUS_API_URL
ARG VITE_ECOMMERCE_ENABLED
ARG VITE_LECTURA_JSON
ARG VITE_B2B_CATALOG_ENABLED
ARG VITE_B2B_SHOPIFY_QUERY
ARG VITE_SIMULATORS_ENABLED
ARG VITE_OPEN_COURSE_OFFER
ARG VITE_URL_APPSTORE
ARG VITE_URL_PLAYSTORE

ENV VITE_TMS_PLUS_API_URL=$VITE_TMS_PLUS_API_URL \
    VITE_ECOMMERCE_ENABLED=$VITE_ECOMMERCE_ENABLED \
    VITE_LECTURA_JSON=$VITE_LECTURA_JSON \
    VITE_B2B_CATALOG_ENABLED=$VITE_B2B_CATALOG_ENABLED \
    VITE_B2B_SHOPIFY_QUERY=$VITE_B2B_SHOPIFY_QUERY \
    VITE_SIMULATORS_ENABLED=$VITE_SIMULATORS_ENABLED \
    VITE_OPEN_COURSE_OFFER=$VITE_OPEN_COURSE_OFFER \
    VITE_URL_APPSTORE=$VITE_URL_APPSTORE \
    VITE_URL_PLAYSTORE=$VITE_URL_PLAYSTORE

# BUILD_ID cambia en cada ejecución de CI (github.run_id): invalida la caché de la
# capa del build para que el cron diario vuelva a pedir noticias y productos de Shopify a sus
# APIs en vez de reutilizar el dist/ de una ejecución anterior (cache type=gha).
ARG BUILD_ID=local
RUN echo "BUILD_ID=${BUILD_ID}" && npm run build \
    && mkdir -p /app/nginx && mv dist/redirects.map /app/nginx/redirects.map \
    && mv dist/csp.conf /app/nginx/csp.conf \
    && rm -rf dist/_report

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine AS runtime

# nginx: 404 real, 301 a /es, shell noindex y cabeceras (Tarea #8, decisión 1.2)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY snippets/security-headers.conf /etc/nginx/snippets/security-headers.conf
# 301 de las URLs antiguas (generado en el build; fuera de la raíz pública)
COPY --from=build /app/nginx/redirects.map /etc/nginx/redirects.map
# CSP Report-Only con los hashes de los scripts inline de este build (Fase 7)
COPY --from=build /app/nginx/csp.conf /etc/nginx/snippets/csp.conf

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
