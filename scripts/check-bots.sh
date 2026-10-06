#!/usr/bin/env bash
# Aceptación de las Fases 1 y 2 (Tarea #8): lo que ven los bots en el HTML inicial,
# sin ejecutar JS, más las reglas de nginx (404 real, 301 con query, caché, cabeceras)
# y las URLs en español con los 301 de las URLs antiguas en un solo salto.
#
# Uso:
#   scripts/check-bots.sh                      # contra el contenedor local (B=http://localhost:8080)
#   B=https://insecap.cl scripts/check-bots.sh # contra producción
#
# REDIRECTS_MAP (por defecto dist/redirects.map, si existe): de ahí sale un ea-* real para probar
# su 301 a la categoría y se corre `check-dist.mjs --no-redirect-chains`. Sin el archivo
# (p. ej. en CI, donde el dist/ está dentro de la imagen) esas dos revisiones se omiten.
#
# Revisión de hidratación (scripts/check-hydration.mjs, Chrome headless por CDP):
#   HYDRATION=required  falla si no hay Chrome (CI).
#   HYDRATION=skip      no la corre.
#   (por defecto)       la corre si encuentra Chrome; si no, la omite con aviso.
#
# Sale con código 1 si falla cualquier revisión.

set -u

B="${B:-http://localhost:8080}"
B="${B%/}"
UAS="${UAS:-GPTBot ClaudeBot PerplexityBot OAI-SearchBot Googlebot bingbot}"
HYDRATION="${HYDRATION:-auto}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REDIRECTS_MAP="${REDIRECTS_MAP:-$SCRIPT_DIR/../dist/redirects.map}"

fails=0
ok() { printf 'OK    %s\n' "$*"; }
ko() { printf 'FALLA %s\n' "$*"; fails=$((fails + 1)); }
check() { # check <descripción> <condición de test(1)…>
  local desc="$1"; shift
  if "$@"; then ok "$desc"; else ko "$desc"; fi
}

# Cuenta ocurrencias (no líneas: el HTML viene minificado en pocas líneas).
count() { grep -o -- "$1" | wc -l | tr -d ' '; }
counti() { grep -oi -- "$1" | wc -l | tr -d ' '; }
# Palabras visibles: sin <script>, <style> ni etiquetas.
words() { perl -0777 -pe 's/<script\b.*?<\/script>//gis; s/<style\b.*?<\/style>//gis; s/<[^>]*>/ /g' | wc -w | tr -d ' '; }
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
# Cabecera (sin distinguir mayúsculas) de una respuesta; vacío si no está.
header() { # header <nombre> <curl args…>
  local name="$1"; shift
  curl -s -o /dev/null -D - "$@" | tr -d '\r' | grep -i "^$name:" | head -1 | cut -d' ' -f2-
}

echo "== Fase 1 contra $B"

# 1. Cada bot ve en /es, /en y /pt: 200, un H1, enlaces reales y JSON-LD; >800 palabras en /es.
for ua in $UAS; do
  for l in es en pt; do
    code=$(status -A "$ua" "$B/$l")
    h=$(curl -s -A "$ua" "$B/$l")
    h1=$(printf '%s' "$h" | count '<h1')
    w=$(printf '%s' "$h" | words)
    a=$(printf '%s' "$h" | count '<a href="/')
    ld=$(printf '%s' "$h" | count 'application/ld+json')
    desc="$ua /$l code=$code h1=$h1 words=$w a=$a ld=$ld"
    if [ "$code" = 200 ] && [ "$h1" -eq 1 ] && [ "$a" -gt 0 ] && [ "$ld" -ge 1 ] \
      && { [ "$l" != es ] || [ "$w" -gt 800 ]; }; then ok "$desc"; else ko "$desc"; fi
  done
done

# 2. 404 real: ruta inexistente y locale inválido.
c=$(status "$B/es/noexiste");  check "/es/noexiste → 404 ($c)" test "$c" = 404
c=$(status "$B/fr");           check "/fr → 404 ($c)" test "$c" = 404
c=$(status "$B/fr/nosotros");  check "/fr/nosotros → 404 ($c)" test "$c" = 404
c=$(status "$B/llms-no-existe.txt"); check "/llms-no-existe.txt → 404 sin redirigir ($c)" test "$c" = 404
h=$(curl -s "$B/es/noexiste")
check "el 404 trae noindex" grep -qi 'name="robots" content="noindex' <<<"$h"

# 3. 301 de la home y de rutas sin idioma, conservando la query. Location relativa (sin :80).
c=$(status "$B/?gclid=T"); loc=$(header location "$B/?gclid=T")
check "/?gclid=T → 301 /es?gclid=T ($c $loc)" test "$c" = 301 -a "$loc" = "/es?gclid=T"
c=$(status "$B/nosotros"); loc=$(header location "$B/nosotros")
check "/nosotros → 301 /es/nosotros ($c $loc)" test "$c" = 301 -a "$loc" = "/es/nosotros"
loc=$(header location "$B/nosotros?utm_source=x")
check "/nosotros?utm_source=x conserva la query ($loc)" test "$loc" = "/es/nosotros?utm_source=x"
c=$(status "$B/es/nosotros/"); loc=$(header location "$B/es/nosotros/?a=1")
check "/es/nosotros/ → 301 sin barra final ($c $loc)" test "$c" = 301 -a "$loc" = "/es/nosotros?a=1"

# 4. Un solo host: www → https://insecap.cl.
if [[ "$B" == https://insecap.cl ]]; then
  c=$(status https://www.insecap.cl/es); loc=$(header location https://www.insecap.cl/es)
else
  c=$(status -H 'Host: www.insecap.cl' "$B/es"); loc=$(header location -H 'Host: www.insecap.cl' "$B/es")
fi
check "www → 301 https://insecap.cl/es ($c $loc)" test "$c" = 301 -a "$loc" = "https://insecap.cl/es"

# 5. html lang por idioma.
for pair in es:es-CL en:en pt:pt; do
  l="${pair%%:*}"; want="${pair#*:}"
  got=$(curl -s "$B/$l" | grep -o '<html lang="[^"]*"' | head -1)
  check "/$l $got" test "$got" = "<html lang=\"$want\""
done

# 6. Fichas y noticias en el HTML inicial.
h=$(curl -s -A GPTBot "$B/es/cursos/trabajo-en-altura")
n=$(printf '%s' "$h" | count '<h1')
check "GPTBot ficha /es/cursos/trabajo-en-altura h1=$n" test "$n" -eq 1
n=$(curl -s -A GPTBot "$B/es/noticias" | count 'href="/es/noticias/')
check "GPTBot /es/noticias enlaces a noticias=$n (>=10)" test "$n" -ge 10

# 7. Ruta dinámica que no estaba en el build: shell 200 con noindex.
c=$(status "$B/es/noticias/no-existe-en-el-build")
h=$(curl -s "$B/es/noticias/no-existe-en-el-build")
check "noticia fuera del build → 200 ($c)" test "$c" = 200
check "noticia fuera del build → noindex" grep -qi 'name="robots" content="noindex' <<<"$h"

# 8. Healthcheck, caché y cabeceras de seguridad.
c=$(status "$B/healthz"); check "/healthz → 200 ($c)" test "$c" = 200
cc=$(header cache-control "$B/es"); check "/es Cache-Control: $cc" test "$cc" = "no-cache"
asset=$(curl -s "$B/es" | grep -o '/assets/[^"]*\.js' | head -1)
if [ -n "$asset" ]; then
  cc=$(header cache-control "$B$asset")
  check "$asset Cache-Control: $cc" grep -q immutable <<<"$cc"
else
  ko "no se encontró un /assets/*.js en /es"
fi
for url in "$B/es" "$B$asset" "$B/es/noexiste" "$B/healthz"; do
  n=0
  for name in x-content-type-options x-frame-options referrer-policy; do
    [ -n "$(header "$name" "$url")" ] && n=$((n + 1))
  done
  check "cabeceras de seguridad en ${url#"$B"} ($n/3)" test "$n" -eq 3
done

# 9. Fase 2: URLs en español. Páginas nuevas 200 con un H1 en /es; las de datos, 200 + noindex en /en y /pt.
for p in cursos cursos/trabajo-en-altura cursos/categoria/operacion-de-equipos sedes/calama franquicia-sence \
  acreditaciones sap-pm preguntas-frecuentes simuladores nosotros; do
  c=$(status -A GPTBot "$B/es/$p")
  n=$(curl -s -A GPTBot "$B/es/$p" | count '<h1')
  check "GPTBot /es/$p → $c h1=$n" test "$c" = 200 -a "$n" -eq 1
done
for l in en pt; do
  for p in cursos cursos/trabajo-en-altura cursos/categoria/operacion-de-equipos sedes/calama \
    franquicia-sence preguntas-frecuentes; do
    c=$(status -A GPTBot "$B/$l/$p")
    robots=$(curl -s -A GPTBot "$B/$l/$p" | grep -o 'name="robots" content="[^"]*"' | head -1)
    check "GPTBot /$l/$p → $c $robots" \
      test "$c" = 200 -a -n "$(grep -i 'noindex' <<<"$robots")"
  done
done
robots=$(curl -s "$B/es/cursos/trabajo-en-altura" | grep -o 'name="robots" content="[^"]*"' | head -1)
check "/es/cursos/trabajo-en-altura indexable ($robots)" test -n "$robots" -a -z "$(grep -i 'noindex' <<<"$robots")"
n=$(curl -s "$B/es/cursos/trabajo-en-altura" | count 'Última actualización')
check "/es/cursos/trabajo-en-altura 'Última actualización'=$n" test "$n" -eq 1
c=$(status "$B/es/cursos/no-existe"); check "/es/cursos/no-existe → 404 ($c)" test "$c" = 404

# 10. 301 de las URLs antiguas: un solo salto (el destino responde 200), con prefijo y conservando la query.
redirect_ok() { # redirect_ok <ruta antigua> <Location esperada>
  local from="$1" want="$2" c loc final
  c=$(status "$B$from"); loc=$(header location "$B$from")
  final=$(status "$B$loc")
  check "$from → $c $loc ($final)" test "$c" = 301 -a "$loc" = "$want" -a "$final" = 200
}
redirect_ok /es/curso-empresa/curso-trabajo-en-altura /es/cursos/trabajo-en-altura
redirect_ok /es/noticias/noticias/insecap-otec-validada-por-codelco /es/noticias/insecap-otec-validada-por-codelco
redirect_ok "/es/Experiencia-y-Respaldo?utm_source=x" "/es/acreditaciones?utm_source=x"
redirect_ok /en/experiencia-y-respaldo /en/acreditaciones
redirect_ok "/es/cursos-empresas?gclid=T" "/es/cursos?gclid=T"
redirect_ok /pt/cursos-empresas/ /pt/cursos
redirect_ok /es/especialidades/sap-pm /es/sap-pm
redirect_ok /es/curso/ea-no-existe-en-shopify /es/cursos
redirect_ok /es/curso-empresa/curso-no-existe /es/cursos
# Sin prefijo de idioma: al destino final en un salto (no /es/cursos-empresas → /es/cursos).
redirect_ok /cursos-empresas /es/cursos
redirect_ok "/curso-empresa/curso-trabajo-en-altura?utm_source=x" "/es/cursos/trabajo-en-altura?utm_source=x"
redirect_ok /Experiencia-y-Respaldo /es/acreditaciones
redirect_ok /cursos /es/cursos
if [ -f "$REDIRECTS_MAP" ]; then
  ea=$(grep -o '^"/es/curso/ea-[^"/]*" "[^"]*"' "$REDIRECTS_MAP" | head -1)
  if [ -n "$ea" ]; then
    from=$(cut -d'"' -f2 <<<"$ea"); want=$(cut -d'"' -f4 <<<"$ea")
    redirect_ok "$from" "$want"
  else
    ko "redirects.map sin productos ea-*"
  fi
  if node "$SCRIPT_DIR/check-dist.mjs" --no-redirect-chains; then ok "check-dist --no-redirect-chains"
  else ko "check-dist --no-redirect-chains"; fi
else
  echo "SKIP  ea-* real y check-dist --no-redirect-chains (no está $REDIRECTS_MAP)"
fi

# 11. Consola del navegador sin warnings de hidratación en /es, /en y /pt.
if [ "$HYDRATION" = skip ]; then
  echo "SKIP  hidratación (HYDRATION=skip)"
else
  node "$SCRIPT_DIR/check-hydration.mjs" "$B/es" "$B/en" "$B/pt"
  rc=$?
  if [ "$rc" -eq 0 ]; then ok "hidratación sin warnings en /es /en /pt"
  elif [ "$rc" -eq 2 ] && [ "$HYDRATION" != required ]; then echo "SKIP  hidratación (no se encontró Chrome; define CHROME_BIN)"
  else ko "hidratación (código $rc)"
  fi
fi

echo
if [ "$fails" -gt 0 ]; then
  echo "$fails revisión(es) fallaron"
  exit 1
fi
echo "Todo OK"
