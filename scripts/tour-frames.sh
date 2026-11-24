#!/usr/bin/env bash
# Divide los videos del tour de una sede en fotogramas WebP para la página /tour-virtual
# (src/data/tour-virtual.ts). El contrato de check-dist no admite medios de más de 200 KB, así
# que el recorrido no va como MP4: cada estación es una secuencia que el scroll recorre en un canvas.
#
#   bash scripts/tour-frames.sh ~/Desktop/Tour            # carpeta con los .mp4 originales
#   bash scripts/tour-frames.sh ~/Desktop/Tour practica   # solo una estación
#
# Requiere ffmpeg y cwebp. Cada línea: clave, video, inicio (s), duración (s), escala. Un video que
# empieza con @ es un montaje armado abajo (varias tomas unidas con fundido). Se toman FPS
# fotogramas por segundo de video: más densidad = scroll más fluido, a costa de peso (~30 KB por cuadro).
# Los tramos se eligieron sin personas a la vista; si cambia uno, actualizar `frames` en tour-virtual.ts.
set -euo pipefail
SRC="${1:?Uso: bash scripts/tour-frames.sh <carpeta con los videos> [estación]}"
SOLO="${2:-}"
OUT="public/images/tour/calama"
FPS=15
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Zona de práctica: todas las tomas del galpón con la luz encendida, en orden de recorrido, unidas con
# un fundido de 0,4 s. La primera es vertical y se recorta a 16:9 (un poco arriba del centro).
if [ -z "$SOLO" ] || [ "$SOLO" = "practica" ]; then
  ffmpeg -nostdin -v error -y \
    -ss 28.5 -t 6.3 -i "$SRC/20261104_143916.mp4" \
    -ss 44.2 -t 3.0 -i "$SRC/20261104_143800.mp4" \
    -t 1.94 -i "$SRC/20261104_144038.mp4" \
    -filter_complex "[0:v]crop=1080:608:0:(ih-608)*0.4,scale=1920:1080,fps=30,format=yuv420p,setsar=1[a];\
[1:v]scale=1920:1080,fps=30,format=yuv420p,setsar=1[b];[2:v]scale=1920:1080,fps=30,format=yuv420p,setsar=1[c];\
[a][b]xfade=transition=fade:duration=0.4:offset=5.9[ab];[ab][c]xfade=transition=fade:duration=0.4:offset=8.5[v]" \
    -map "[v]" -c:v libx264 -crf 16 "$TMP/practica.mp4"
fi

while read -r clave video inicio dur escala; do
  [ -z "$clave" ] && continue
  [ -n "$SOLO" ] && [ "$clave" != "$SOLO" ] && continue
  filtro="fps=$FPS,scale=$escala"
  origen="$SRC/$video.mp4"
  [ "${video#@}" != "$video" ] && origen="$TMP/${video#@}.mp4"
  rm -rf "${OUT:?}/$clave" && mkdir -p "$OUT/$clave" "$TMP/$clave"
  ffmpeg -nostdin -v error -y -ss "$inicio" -t "$dur" -i "$origen" \
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
practica    @practica        0.0 10.4  960:-2
clases      20261104_134235 32.0  4.5  960:-2
computacion 20261104_121719 13.0 10.5  960:-2
simulacion  20261104_134235 38.5 11.0  960:-2
TRAMOS
