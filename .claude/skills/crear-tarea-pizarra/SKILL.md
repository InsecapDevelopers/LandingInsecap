---
name: crear-tarea-pizarra
description: Crea una tarea en el Backlog de la Pizarra Desarrollo TICA (TMS Plus, Página Web o RelatoresYa) llamando a la integración de TMS Plus en producción (tmsplus.insecap.cl), asignándole siempre prioridad y tamaño. Úsala cuando el usuario pida "crea una tarea/ticket en la pizarra/backlog", "anota esto en el backlog de TMS Plus / web / relatores" o dé un requerimiento para registrarlo como tarea de desarrollo.
---

# Crear una tarea en la Pizarra Desarrollo TICA

Crea la tarea en GitHub (issue + rama + campos del proyecto) por la integración de TMS Plus, **siempre en la columna Backlog y siempre con prioridad y tamaño**. Las tareas se crean en **producción** (`https://tmsplus.insecap.cl`): el servidor valida la clave y crea los issues de verdad. No mueve, edita ni borra tareas existentes: eso se hace desde la pizarra.

## Antes de llamar: confirma con el usuario

Esto crea issues reales en GitHub, en producción. **Nunca lo envíes sin mostrar antes un resumen y recibir un sí claro**:

- **Proyecto**: `tms-plus` (por defecto: TMS Plus; crea 2 issues, Backend y Frontend), `pagina-web` (Página Web; 1 issue) o `RelatoresYa` (RelatoresYA; 1 issue). Si no queda claro de cuál es, pregunta.
- **Título** (obligatorio, máx. 200 caracteres) y **descripción** (qué hay que hacer y por qué; máx. 5000).
- **Prioridad y tamaño: los decides tú, siempre** (ver abajo), y los muestras en el resumen con la razón en una línea para que el usuario los corrija si no está de acuerdo. Si el usuario ya dio uno de los dos, usa el suyo.
- Opcionales: **responsable** (login de GitHub; si no se indica queda sin asignar) y si **crear la rama** (por defecto sí).

## Cómo asignar prioridad y tamaño

Los tres proyectos usan los mismos valores. Son nombres exactos de las opciones del GitHub Project: **no inventes otros ni cambies un solo carácter**.

**Prioridad** — qué tan urgente es:

| Valor | Cuándo |
|---|---|
| `⚠️` (baja) | Mejora o nice-to-have, sin plazo ni impacto en la operación |
| `⚠️⚠️` (media) | Afecta el trabajo diario pero hay una alternativa, o es una mejora comprometida con alguien |
| `⚠️⚠️⚠️` (alta) | Error en producción, algo que bloquea a un área, riesgo de datos o seguridad, o plazo cercano |

**Tamaño** — cuánto esfuerzo de desarrollo (suma back y front si es TMS Plus):

| Valor | Esfuerzo aproximado |
|---|---|
| `⭐` | Cambio mínimo: un texto, un color, un campo, menos de medio día |
| `⭐⭐` | Pequeño y acotado: un día |
| `⭐⭐⭐` | Mediano: 2–3 días, una pantalla o un endpoint con su lógica |
| `⭐⭐⭐⭐` | Grande: alrededor de una semana, varias piezas que se tocan entre sí |
| `⭐⭐⭐⭐⭐` | Muy grande: más de una semana o un módulo nuevo; considera proponer partirla en tareas más chicas |

Si dudas entre dos, elige la menor prioridad y el mayor tamaño (mejor sobrestimar el esfuerzo que subestimarlo), y dilo en el resumen.

## Llamada

**URL: producción.** `URL = os.environ.get("TMS_API_URL", "https://tmsplus.insecap.cl")`, sin barra final ni `/api` (la ruta ya lo incluye). Solo se usa otra (por ejemplo `http://localhost:5231`) si el usuario pide expresamente probar contra su desarrollo local.

**La clave** (cabecera `X-Api-Key`) es la misma que tiene el servidor en `Integraciones:PizarraTica:ApiKey`. Nunca la escribas en esta skill ni en otro archivo, no la imprimas ni la repitas en la conversación. Obtenla dentro del mismo comando de la llamada, en este orden:
1. La variable de entorno `PIZARRA_TICA_API_KEY`, si está definida.
2. Si no, el `appsettings.Development.json` local del backend (`C:/Users/insec/source/repos/TMS2/tmsBackend/src/Tms.Api/appsettings.Development.json`, clave `Integraciones` → `PizarraTica` → `ApiKey`; puede tener líneas `//` de comentario). Es la misma clave que usa producción.
3. Si no hay ninguna, pide al usuario que defina `PIZARRA_TICA_API_KEY`; no la inventes.

**El JSON va siempre desde un archivo UTF-8, y los emojis de prioridad y tamaño como escapes.** En Windows, mandar el JSON inline con `curl -d` rompe las tildes (el servidor responde 400 "no se pudo convertir… $.titulo"), y un emoji al que le falta su selector de variación (`⚠` en vez de `⚠️`) no calza con ninguna opción y el servidor lo rechaza. Todo en un solo script de Python, para no pasar la clave por la línea de comandos ni por pantalla:

```python
import json, os, re, urllib.request, urllib.error

URL = os.environ.get("TMS_API_URL", "https://tmsplus.insecap.cl")

def clave():
    k = os.environ.get("PIZARRA_TICA_API_KEY")
    if k:
        return k
    ruta = "C:/Users/insec/source/repos/TMS2/tmsBackend/src/Tms.Api/appsettings.Development.json"
    texto = re.sub(r"^\s*//.*$", "", open(ruta, encoding="utf-8-sig").read(), flags=re.M)
    return json.loads(texto)["Integraciones"]["PizarraTica"]["ApiKey"]

W = "\u26a0\ufe0f"   # ⚠️  (con selector de variación)
S = "\u2b50"         # ⭐
cuerpo = {
    "titulo": "…", "descripcion": "…", "proyecto": "tms-plus",
    "prioridad": W * 2,   # 1, 2 o 3 veces → baja, media, alta
    "tamano": S * 3,      # 1 a 5 veces
    "crearRama": True,
}
req = urllib.request.Request(
    URL + "/api/integraciones/pizarra-tica/tareas",
    data=json.dumps(cuerpo, ensure_ascii=False).encode("utf-8"),
    headers={"X-Api-Key": clave(), "Content-Type": "application/json; charset=utf-8"},
    method="POST")
try:
    with urllib.request.urlopen(req, timeout=90) as r:
        print(r.status, r.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print(e.code, e.read().decode("utf-8"))
```

`titulo`, `prioridad` y `tamano` van siempre; `proyecto` por defecto es `tms-plus`. Ejecútalo con `PYTHONIOENCODING=utf-8` para que se vean bien las tildes. Con la estructura de arriba, `json.dumps` escapa bien las comillas y saltos de línea de la descripción.

## Respuesta

- **200**: en `data.partes[]` vienen los issues creados (`repo`, `numero`, `url`, `rama`, `prioridad`, `tamano`). Dile al usuario qué proyecto, qué issues, la prioridad y el tamaño que quedaron, y los enlaces.
- **400**: el `message` explica qué falló (proyecto no permitido, "no tiene esa prioridad / ese tamaño", título vacío…). Corrige con el usuario y reintenta; no repitas a ciegas.
- **401**: la clave no coincide con la del servidor (¿se cambió en la VM?). Avisa al usuario; no pruebes otras claves.
- **404**: la integración está apagada en ese servidor (no hay clave configurada).
- **429**: tope de tareas por hora alcanzado; espera.
- Si una creación falla a medias, el mensaje indica en qué repo quedó el issue: avísalo, no lo reintentes (duplicaría la tarea).

No reintentes una creación exitosa ni crees "otra por si acaso".
