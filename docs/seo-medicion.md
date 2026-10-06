# Medición de SEO y visibilidad en IA (Tarea #8, Fase 9)

Qué se mide, dónde y qué hay que hacer a mano (fuera del código). Dominio canónico:
`https://insecap.cl` (sin www, sin barra final). Sitemap: `https://insecap.cl/sitemap-index.xml`.

| Qué | Dónde | En el repo |
|---|---|---|
| Rendimiento, accesibilidad y SEO técnico por PR | GitHub Actions, workflow **Lighthouse** | `.github/workflows/lighthouse.yml`, `lighthouserc.json` |
| Aviso de URLs cambiadas a Bing, Yandex y otros | Paso **IndexNow** del workflow **Deploy** | `scripts/indexnow.mjs`, `public/<clave>.txt` |
| Indexación y consultas en Google | Google Search Console | — |
| Indexación y consultas en Bing (y Copilot / ChatGPT Search, que usan su índice) | Bing Webmaster Tools | — |
| Visitas que llegan desde asistentes de IA | GA4, canal personalizado **IA** | — |
| Rastreo de bots de IA y buscadores | Log de nginx del VPS | `docs/nginx-vps.conf` (`log_format insecap_ua`) |

---

## 1. Google Search Console

1. Entrar a <https://search.google.com/search-console> con la cuenta de marketing de INSECAP.
2. **Agregar propiedad → Dominio** → `insecap.cl` (cubre http/https y www).
3. Verificar con el registro **TXT** que entrega Google en el DNS del dominio. Esperar a que propague
   y pulsar **Verificar**.
4. **Sitemaps** → enviar `https://insecap.cl/sitemap-index.xml`. Debe quedar "Correcto" y listar
   `sitemap-es.xml` y `sitemap-intl.xml`.
5. **Inspección de URLs** → probar y pedir indexación de `https://insecap.cl/es`, una ficha
   (`https://insecap.cl/es/cursos/trabajo-en-altura`) y una noticia. En "Ver página rastreada"
   el HTML debe traer el contenido completo (prerender) y el JSON-LD.
6. Durante **4 semanas** después del deploy de la tarea #8, revisar cada semana:
   - **Páginas → No indexadas**: "No encontrada (404)" y "Página con redirección" deben
     corresponder a URLs antiguas (`ea-*`, `curso-empresa/…`, `cursos-empresas`, www). Un 404 de una
     URL que debería existir es un error a corregir.
   - **Mejoras**: Breadcrumbs, FAQ y Cursos sin errores.
   - **Experiencia → Core Web Vitals** (datos de campo, tardan ~28 días en aparecer).

## 2. Bing Webmaster Tools

1. Entrar a <https://www.bing.com/webmasters>.
2. **Importar desde Google Search Console** (más rápido: trae la propiedad verificada y el sitemap)
   o agregar `https://insecap.cl` y verificar con el registro **CNAME/TXT** en el DNS.
3. **Sitemaps** → enviar `https://insecap.cl/sitemap-index.xml`.
4. **IndexNow** (menú lateral): después del primer deploy con IndexNow deben aparecer las URLs
   enviadas desde el workflow (ver sección 5).
5. Revisar **Herramienta de inspección de URL** con `/es` y una ficha, igual que en GSC.

Bing alimenta a Copilot y a ChatGPT Search: estar bien indexado ahí importa tanto como en Google.

## 3. GA4: canal "IA"

Para separar las visitas que llegan desde ChatGPT, Perplexity, Claude, Gemini y Copilot (hoy caen en
"Referral").

1. GA4 → **Administrar → Visualización de datos → Grupos de canales → Crear un grupo de canales
   nuevo**. Nombre: `Canales INSECAP` (parte como copia del grupo predeterminado).
2. **Agregar canal nuevo** → nombre `IA`, condición:
   **Fuente de la sesión** · **coincide con la expresión regular** ·
   ```
   chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com
   ```
3. **Reordenar**: `IA` tiene que quedar **arriba de "Referral"** (GA4 asigna el primer canal que
   coincide). Guardar.
4. Ver los datos en **Informes → Adquisición → Adquisición de tráfico**, cambiando la dimensión a
   "Grupo de canales de la sesión: Canales INSECAP". El grupo se aplica también a datos anteriores.
5. Opcional: crear una **exploración** con Fuente de la sesión × Página de destino filtrada por el
   canal IA, para ver qué páginas citan los asistentes.

Si aparece otro referrer de IA en "Referral" (por ejemplo `chat.openai.com` o
`edgeservices.bing.com`), se agrega a la regex con `|`.

## 4. Bots de IA en el log de nginx (VPS)

El nginx del VPS registra el User-Agent con `log_format insecap_ua` (`$http_user_agent`) en
`/var/log/nginx/insecap.access.log` (`docs/nginx-vps.conf`). Comprobar que esté aplicado:

```sh
sudo nginx -T 2>/dev/null | grep -E 'log_format insecap_ua|access_log .*insecap_ua'
```

**Resumen por bot** (hits y respuestas 4xx/5xx, incluye los logs rotados `.1` y `.gz`):

```sh
zcat -f /var/log/nginx/insecap.access.log* | awk -F'"' '
  BEGIN { n = split("GPTBot OAI-SearchBot ChatGPT-User ClaudeBot Claude-SearchBot PerplexityBot bingbot Googlebot", B, " ") }
  { split($3, s, " ")
    for (i = 1; i <= n; i++) if (index($6, B[i])) { hits[B[i]]++; if (s[1] >= 400) err[B[i]]++; break } }
  END { for (i = 1; i <= n; i++) printf "%-17s %7d hits %6d 4xx/5xx\n", B[i], hits[B[i]], err[B[i]] }'
```

**Hits por día de un bot** y **URLs más pedidas por un bot**:

```sh
BOT=ClaudeBot
zcat -f /var/log/nginx/insecap.access.log* | grep "$BOT" | awk '{print substr($4, 2, 11)}' | sort | uniq -c
zcat -f /var/log/nginx/insecap.access.log* | grep "$BOT" | awk -F'"' '{print $2}' | awk '{print $2}' | sort | uniq -c | sort -rn | head -20
```

Qué mirar:
- GPTBot, ClaudeBot y PerplexityBot deben aparecer después de unas semanas. Si no aparecen nunca,
  revisar fail2ban, rate limits o un WAF que los bloquee (sección 5 del registro de decisiones).
- Muchos 4xx de un bot = está pidiendo URLs antiguas o rotas; cruzar con las URLs más pedidas.
- El User-Agent se puede falsificar. Para confirmar un Googlebot o bingbot real se usa DNS inverso
  (`host <ip>` debe terminar en `googlebot.com` / `search.msn.com`); OpenAI, Anthropic y Perplexity
  publican sus rangos de IP.
- Diferencias: `GPTBot` y `ClaudeBot` rastrean para entrenamiento; `OAI-SearchBot`,
  `Claude-SearchBot` y `PerplexityBot` indexan para búsqueda; `ChatGPT-User` es una visita puntual
  pedida por una persona dentro de ChatGPT.

## 5. IndexNow

- La clave es `public/<32 hex>.txt` (un solo archivo con ese patrón en `public/`); se publica en
  `https://insecap.cl/<clave>.txt` y `scripts/check-bots.sh` comprueba que se sirva.
- En cada deploy (`push` a main, cron diario y `workflow_dispatch` del TMS Plus):
  1. el job `build-test-push` guarda los sitemaps del build probado (artefacto `indexnow-sitemaps`);
  2. el job `deploy`, **antes** de desplegar, guarda los sitemaps que están publicados;
  3. después del deploy espera a que `/<clave>.txt` responda con la clave y hace `POST` a
     `https://api.indexnow.org/indexnow` con las URLs nuevas, retiradas o con `<lastmod>` distinto
     (máximo 10.000).
- Es tolerante a fallos: todos sus pasos son `continue-on-error`, nunca bloquean ni revierten el deploy.
- **Cómo verificar**: en el log del paso **IndexNow** del job `deploy` debe aparecer
  `IndexNow 200` o `IndexNow 202` (202 = clave en verificación, normal la primera vez), o
  `sin cambios: no se avisa.` cuando ninguna URL cambió. Luego, en Bing Webmaster → IndexNow.
- El primer deploy envía todas las URLs (el sitio anterior no tenía sitemap).
- Probar sin enviar:
  ```sh
  node scripts/indexnow.mjs snapshot dist /tmp/sm-nuevo
  node scripts/indexnow.mjs snapshot https://insecap.cl /tmp/sm-publicado
  node scripts/indexnow.mjs submit /tmp/sm-nuevo /tmp/sm-publicado --dry-run
  ```
- **Cambiar la clave**: borrar el `.txt` actual de `public/`, crear otro con
  `k=$(openssl rand -hex 16); printf '%s' "$k" > public/$k.txt` y desplegar.

## 6. Lighthouse CI

`.github/workflows/lighthouse.yml` corre en cada pull request a `main` o `dev` (y a mano con
**Run workflow**). Construye la misma imagen Docker que se despliega, levanta el contenedor y corre
`npx @lhci/cli autorun` con `lighthouserc.json`: Lighthouse **móvil**, 3 corridas por URL
(se evalúa la mediana) sobre `/es`, `/en`, `/pt`, `/es/cursos/trabajo-en-altura` y `/es/noticias`.

| Presupuesto | Auditoría |
|---|---|
| LCP ≤ 2.500 ms | `largest-contentful-paint` |
| Peso total ≤ 1,5 MB (1.500.000 bytes) | `total-byte-weight` |
| Accesibilidad ≥ 95 | `categories:accessibility` |
| SEO ≥ 95 | `categories:seo` |

**Modo aviso hasta el 2026-10-20**: el paso de Lighthouse es `continue-on-error`, así que un
presupuesto incumplido no hace fallar el PR; el paso queda marcado con advertencia. Desde esa fecha
hay que quitar `continue-on-error` (TODO en el workflow) para que falle el job.

Cómo leerlo:
1. En el PR, **Checks → Lighthouse → lighthouse**.
2. **Summary** del job: tabla por URL con rendimiento, accesibilidad, SEO, LCP y peso de la corrida
   representativa. `(fuera)` marca lo que no cumple el presupuesto.
3. Log del paso **Lighthouse CI (autorun)**: cada `✘` dice la auditoría, el valor esperado
   (`expected`) y el obtenido (`found`).
4. Artefacto **lighthouse** (abajo en la página del run): reportes HTML completos de cada corrida,
   con el detalle de qué recursos pesan o qué elemento es el LCP.

Notas:
- Se mide contra el contenedor en `localhost` del runner, sin la red real ni el TLS del VPS: sirve
  para comparar PRs entre sí, no reemplaza a PageSpeed Insights ni a los datos de campo de GSC.
- El peso incluye los terceros (GTM, gtag, Meta Pixel), que se cargan diferidos pero dentro de la
  ventana de Lighthouse.
- Correrlo local (contra un contenedor en el puerto 8080):
  `npx --yes @lhci/cli@0.15 autorun --config=lighthouserc.json`.
