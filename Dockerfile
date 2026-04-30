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

# Copy source and build
COPY . .

# VITE_* build-time vars (se embeben en el bundle).
# Pasa valores con `docker build --build-arg VITE_X=...` o desde CI.
ARG VITE_TMS_API_URL
ARG VITE_ECOMMERCE_ENABLED
ARG VITE_LECTURA_JSON
ARG VITE_B2B_CATALOG_ENABLED
ARG VITE_B2B_SHOPIFY_QUERY
ARG VITE_SIMULATORS_ENABLED
ARG VITE_URL_APPSTORE
ARG VITE_URL_PLAYSTORE

ENV VITE_TMS_API_URL=$VITE_TMS_API_URL \
    VITE_ECOMMERCE_ENABLED=$VITE_ECOMMERCE_ENABLED \
    VITE_LECTURA_JSON=$VITE_LECTURA_JSON \
    VITE_B2B_CATALOG_ENABLED=$VITE_B2B_CATALOG_ENABLED \
    VITE_B2B_SHOPIFY_QUERY=$VITE_B2B_SHOPIFY_QUERY \
    VITE_SIMULATORS_ENABLED=$VITE_SIMULATORS_ENABLED \
    VITE_URL_APPSTORE=$VITE_URL_APPSTORE \
    VITE_URL_PLAYSTORE=$VITE_URL_PLAYSTORE

RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
