#!/usr/bin/env bash
# Divide los videos del tour de una sede en fotogramas WebP para la página /tour-virtual
# (src/data/tour-virtual.ts). El contrato de check-dist no admite medios de más de 200 KB, así
# que el recorrido no va como MP4: cada estación es una secuencia que el scroll recorre en un canvas.
#
#   bash scripts/tour-frames.sh ~/Desktop/Tour            # carpeta con los .mp4 originales
#   bash scripts/tour-frames.sh ~/Desktop/Tour practica   # solo una estación
#
# Requiere ffmpeg y cwebp. Cada línea: clave, video, inicio (s), duración (s), escala y, opcional, un
# corte "desde-hasta" (s, relativo al inicio) que se salta, p. ej. un destello de la cámara. Se toman FPS
# fotogramas por segundo de video: más densidad = scroll más fluido, a costa de peso (~30 KB por cuadro).
# Los tramos se eligieron sin personas a la vista; si cambia uno, actualizar `frames` en tour-virtual.ts.
set -euo pipefail
SRC="${1:?Uso: bash scripts/tour-frames.sh <carpeta con los videos> [estación]}"
SOLO="${2:-}"
OUT="public/images/tour/calama"
FPS=15
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

while read -r clave video inicio dur escala corte; do
  [ -z "$clave" ] && continue
  [ -n "$SOLO" ] && [ "$clave" != "$SOLO" ] && continue
  # Sin el tramo cortado y con los cuadros renumerados, para que no quede un salto en el tiempo.
  filtro="fps=$FPS,scale=$escala"
  [ -n "$corte" ] && filtro="select='not(between(t,${corte%-*},${corte#*-}))',setpts=N/FRAME_RATE/TB,$filtro"
  rm -rf "${OUT:?}/$clave" && mkdir -p "$OUT/$clave" "$TMP/$clave"
  ffmpeg -nostdin -v error -y -ss "$inicio" -t "$dur" -i "$SRC/$video.mp4" \
    -vf "$filtro" "$TMP/$clave/%02d.png"
  for png in "$TMP/$clave"/*.png; do
    cwebp -quiet -q 40 -m 6 "$png" -o "$OUT/$clave/$(basename "${png%.png}").webp"
  done
  echo "$clave: $(ls "$OUT/$clave" | wc -l | tr -d ' ') fotogramas, $(du -sk "$OUT/$clave" | cut -f1) KB"
done <<'TRAMOS'
acceso      20261104_143632  0.0  4.0  960:-2
recepcion   20261104_143800  4.5  4.5  960:-2
taller      20261104_143800 12.0  7.5  960:-2
patio       20261104_143800 25.5  7.0  960:-2
bloqueo     20261104_144159  0.5  6.0  540:-2
practica    20261104_143800 38.5  9.0  960:-2 4.95-5.65
clases      20261104_134235 32.0  4.5  960:-2
computacion 20261104_121719 13.0 10.5  960:-2
simulacion  20261104_134235 38.5 11.0  960:-2
TRAMOS
