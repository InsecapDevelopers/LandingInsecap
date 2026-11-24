#!/usr/bin/env bash
# Divide los videos del tour de una sede en fotogramas WebP para la página /tour-virtual
# (src/data/tour-virtual.ts). El contrato de check-dist no admite medios de más de 200 KB, así
# que el recorrido no va como MP4: cada estación es una secuencia que el scroll recorre en un canvas.
#
#   bash scripts/tour-frames.sh ~/Desktop/Tour            # carpeta con los .mp4 originales
#
# Requiere ffmpeg y cwebp. Cada línea: clave, video, inicio (s), duración (s), fotogramas, escala.
# Los tramos se eligieron sin personas a la vista; si cambia uno, actualizar `frames` en tour-virtual.ts.
set -euo pipefail
SRC="${1:?Uso: bash scripts/tour-frames.sh <carpeta con los videos>}"
OUT="public/images/tour/calama"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

while read -r clave video inicio dur frames escala; do
  [ -z "$clave" ] && continue
  rm -rf "${OUT:?}/$clave" && mkdir -p "$OUT/$clave" "$TMP/$clave"
  ffmpeg -nostdin -v error -y -ss "$inicio" -t "$dur" -i "$SRC/$video.mp4" \
    -vf "fps=$frames/$dur,scale=$escala" -frames:v "$frames" "$TMP/$clave/%02d.png"
  for png in "$TMP/$clave"/*.png; do
    cwebp -quiet -q 40 -m 6 "$png" -o "$OUT/$clave/$(basename "${png%.png}").webp"
  done
  echo "$clave: $(ls "$OUT/$clave" | wc -l | tr -d ' ') fotogramas, $(du -sk "$OUT/$clave" | cut -f1) KB"
done <<'TRAMOS'
acceso     20261104_143632  0.0  4.0  28 1280:-2
recepcion  20261104_143800  4.5  4.5  32 1280:-2
taller     20261104_143800 12.0  7.5  48 1280:-2
patio      20261104_143800 25.5  7.0  46 1280:-2
bloqueo    20261104_144159  0.5  6.0  40 720:-2
practica   20261104_143800 41.5  5.5  38 1280:-2
clases     20261104_134235 32.0  4.5  32 1280:-2
computacion 20261104_121719 13.0 10.5 64 1280:-2
simulacion 20261104_134235 38.5 11.0  64 1280:-2
TRAMOS
