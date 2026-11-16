# Contrato: `POST api/publica/derechos-datos` (Ley 21.719, requerimiento #4)

Formulario público de ejercicio de derechos sobre datos personales en `insecap.cl/<locale>/derechos-datos`
(`src/pages/DerechosDatos.tsx`). El esquema y la validación del cliente están en `src/lib/derechosDatos.ts`
(check: `src/lib/derechosDatos.check.ts`).

**Estado:** el endpoint **aún no existe**. Se construye en el TMS Plus en la Ola 2, junto con el módulo de
bitácora (requerimiento #1). Hasta entonces el formulario muestra el error genérico con el correo
alternativo `privacidad@insecap.cl`.

## Petición

- Host: el mismo de la postulación de relatores (`api/publica/postular`): `VITE_TMS_PLUS_API_URL` en
  producción; en desarrollo, el proxy de Vite (`/api` → `TMS_PLUS_PROXY_TARGET`).
- Método y ruta: `POST /api/publica/derechos-datos`, anónimo (sin token).
- Cuerpo: `multipart/form-data` (el navegador pone el `boundary`; no se envían headers propios, para no
  disparar un preflight extra de CORS).

| Campo | Tipo | Obligatorio | Validación (cliente y backend) |
|---|---|---|---|
| `Derechos[0]`, `Derechos[1]`, … | string (lista) | Sí, al menos 1 | Valores: `acceso`, `rectificacion`, `supresion`, `oposicion`, `portabilidad`, `bloqueo`. Sin repetidos |
| `NombreCompleto` | string | Sí | Recortado, 1–150 caracteres |
| `Run` | string | Sí | Normalizado `cuerpo-DV` sin puntos (ej. `11111111-1`), cuerpo de 6–8 dígitos sin cero inicial, DV módulo 11 (`0-9` o `K` mayúscula) |
| `Correo` | string | Sí | Formato de correo, máx. 254. Destino del acuse de recibo y de la respuesta |
| `Telefono` | string | No (se omite si va vacío) | `^\+?[0-9 ()-]{8,20}$` |
| `EsRepresentante` | `"true"` / `"false"` | Sí | Booleano |
| `NombreRepresentante` | string | Solo si `EsRepresentante=true` (si no, se omite) | Recortado, 1–150 caracteres |
| `Descripcion` | string | Sí | Recortado, 10–2000 caracteres |
| `Adjunto` | archivo | No | PDF, JPG o PNG (extensión **y** contenido; el backend debe verificar los bytes mágicos, no solo el `Content-Type`), 1 byte–5 MB. Uno solo |
| `AceptaPolitica` | `"true"` | Sí | Debe ser `true` (checkbox no premarcado) |
| `Idioma` | `es` / `en` / `pt` | Sí | Idioma del acuse de recibo |
| `SitioWeb` | string | Sí (vacío) | Honeypot: si trae texto, es un bot |
| `TiempoLlenadoMs` | entero | Sí | Milisegundos desde que se cargó el formulario. El cliente no envía con menos de 4000 |

Notas para el backend:

- Revalidar todo en el servidor: el cliente es solo comodidad.
- Anti-spam: si `SitioWeb` no está vacío o `TiempoLlenadoMs` < 4000, descartar **sin** registrar y
  responder igual que un éxito falso o un 400 genérico (decisión del backend; el cliente no distingue).
- **Rate limit** por IP (lo implementa el backend), responde 429.
- El cliente no reintenta solo.
- Registrar en la bitácora (procedimiento ARCOP §6): folio = `numeroSeguimiento`, fecha de recepción,
  titular (nombre, RUN), canal `Formulario web`, derechos ejercidos, identidad verificada = no (pendiente),
  y el adjunto en almacenamiento **privado** (requerimiento #5: nada de ACL `PublicRead`).
- Enviar el acuse de recibo a `Correo` en el `Idioma` indicado, con el número de seguimiento y el plazo
  (30 días corridos, prorrogable una vez por 30; bloqueo en 2 días hábiles).
- No escribir datos del formulario en logs.
- CORS: permitir el origen `https://insecap.cl` para este POST (igual que `api/publica/postular`).

## Respuestas

### 201 Created

```json
{ "numeroSeguimiento": "DD-2026-000123" }
```

`numeroSeguimiento`: string no vacío, único (el formato lo define el backend; el ejemplo es
ilustrativo). La pantalla de éxito lo muestra y avisa que llegará un acuse al correo. Si un 2xx viene sin
número, el cliente igual muestra el éxito, sin número.

### 400 Bad Request (validación)

`ValidationProblemDetails` de ASP.NET Core:

```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": { "Run": ["El RUN no es válido."], "Derechos[0]": ["Valor no permitido."] }
}
```

El cliente marca como inválidos los campos cuyas claves reconoce (`Run` → `run`, `Derechos[0]` →
`derechos`, etc.) y muestra un mensaje general. Los textos de `errors` no se muestran tal cual.

### 429 Too Many Requests

Cuerpo libre; se recomienda `Retry-After`. El cliente pide esperar unos minutos y ofrece el correo
alternativo.

### Otros (5xx, red, CORS)

Mensaje genérico con el correo alternativo `privacidad@insecap.cl`.

## Privacidad del cliente

- Sin `console.log` de los datos del formulario.
- Nada se envía a terceros (GTM, `dataLayer`, Meta Pixel, Clarity): el formulario solo hace el POST al TMS Plus.
- Sin captcha de terceros (requeriría consentimiento de cookies).
