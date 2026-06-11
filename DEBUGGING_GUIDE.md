# Guía de Debugging - BeRelator.tsx

## Cómo ver los logs en producción

1. **Abre el navegador** en la página de "Trabaja con nosotros"
2. **Presiona F12** o **Ctrl+Shift+I** (Windows/Linux) / **Cmd+Option+I** (Mac)
3. **Ve a la pestaña "Console"**
4. **Filtra por `[BeRelator`** en la barra de búsqueda de la consola

## Qué buscar

### ✓ Flujo correcto de carga de selectores

Deberías ver estos logs en orden:

```
[BeRelator] Iniciando carga de selectores...
[BeRelator] Ambiente: { PROD: true, MODE: 'production' }
[BeRelator] URLs finales: { profesiones: 'https://tms.insecap.cl/api/publica/profesiones', ... }
[BeRelator] Respuestas recibidas: { profesiones: { ok: true, status: 200, contentType: 'application/json' }, ... }
[BeRelator] setProfesiones llamado con 252 items
[BeRelator] ✓ Carga de selectores completada exitosamente
```

Si ves esto, **TODO FUNCIONA CORRECTAMENTE** ✅

---

### ✗ Error: HTML en lugar de JSON

**Síntoma en consola:**
```
[BeRelator] ERROR profesiones - Status: 200 OK
{
  status: 200,
  statusText: 'OK',
  contentType: 'text/html; charset=utf-8',
  responseStart: '<!doctype html>...'
}
```

**Causas posibles:**
1. El servidor no está disponible
2. Hay un error en el backend (retorna página de error HTML)
3. Falta el header `ngrok-skip-browser-warning`
4. CORS bloqueado

**Solución:**
- Verifica que `https://tms.insecap.cl` esté disponible
- Contacta al equipo de backend para revisar errores del servidor
- Revisa las respuestas de red en la pestaña "Network" del navegador

---

### ✗ Error: JSON parsing error

**Síntoma en consola:**
```
[BeRelator] ERROR parseando JSON de profesiones:
{
  error: 'Unexpected token < in JSON at position 0',
  responseSample: '<!doctype html>...'
}
```

**Causa:** El servidor está retornando HTML en lugar de JSON

**Verificar:**
1. Haz click en el log de "Respuesta de profesiones" 
2. Copia los primeros 500 caracteres
3. Si empieza con `<`, es HTML (error del servidor)
4. Si empieza con `{`, es JSON (problema de parsing)

---

### ✗ Error: Status 404, 500, etc.

**Síntoma en consola:**
```
[BeRelator] ERROR profesiones - Status: 404 Not Found
{
  status: 404,
  statusText: 'Not Found',
  contentType: 'application/json',
  responseStart: '{"error":"Endpoint not found"}'
}
```

**Soluciones según status:**

| Status | Significado | Solución |
|--------|-------------|----------|
| 404 | Endpoint no existe | Verifica que la URL sea correcta |
| 500 | Error del servidor | Contacta al equipo de backend |
| 503 | Servidor no disponible | Espera y reintentar |
| 403 | Acceso prohibido | Revisa CORS o autenticación |

---

## Debugging del formulario

### ✓ Submit correcto

Deberías ver:
```
[BeRelator.doSubmit] Iniciando submit del formulario...
[BeRelator.doSubmit] Enviando fetch...
[BeRelator.doSubmit] Respuesta recibida: { ok: true, status: 200, ... }
[BeRelator.doSubmit] ✓ Postulación enviada exitosamente
```

### ✗ Error en submit

**Busca estos logs de error:**
```
[BeRelator.doSubmit] ✗ Respuesta HTTP no OK: { status: 500, ... }
[BeRelator.doSubmit] ✗ Backend retornó error: { error: true, message: '...' }
[BeRelator.doSubmit] ✗ Exception al hacer fetch: { error: 'Network error' }
```

**Qué revisar:**
1. El campo `status`: ¿qué código HTTP recibiste?
2. El campo `message`: ¿qué error reportó el backend?
3. Asegúrate de que todos los campos requeridos estén llenos

---

## Información ambiente

Los logs mostrarán el ambiente en el que se ejecuta:

```json
{
  "PROD": true,      // true = producción, false = desarrollo
  "MODE": "production"
}
```

Si `PROD` es `false`, significa que estás en **modo desarrollo** y las URLs usarán el proxy local.

---

## URLs esperadas

### Desarrollo (PROD = false)
```
/api/publica/profesiones
/api/publica/disponibilidades
/api/publica/idiomas
/api/publica/categorias
/api/publica/ciudades
```
Estas son proxiadas automáticamente por Vite a `https://tms.insecap.cl`

### Producción (PROD = true)
```
https://tms.insecap.cl/api/publica/profesiones
https://tms.insecap.cl/api/publica/disponibilidades
https://tms.insecap.cl/api/publica/idiomas
https://tms.insecap.cl/api/publica/categorias
https://tms.insecap.cl/api/publica/ciudades
```

---

## Pasos para reportar un bug

1. **Abre la consola** (F12 → Console)
2. **Filtra por `[BeRelator`**
3. **Copia TODO lo que aparece** desde "Iniciando carga" hasta el error
4. **Abre la pestaña Network** (F12 → Network)
5. **Recarga la página** y busca los requests a `tms.insecap.cl`
6. **Haz click en cada uno** y copia:
   - Status code
   - Response headers (especialmente Content-Type)
   - Response body (primeros 500 caracteres)
7. **Reporta con esta información**

---

## Headers que debemos enviar

El código envía automáticamente:
```
'ngrok-skip-browser-warning': 'true'
'User-Agent': 'insecap-capacitaciones'
```

Si ves errores de HTML, revisa en la pestaña Network si estos headers están presentes en la request.
