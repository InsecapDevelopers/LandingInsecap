# ⚠️ CORS Issue - Action Required

## Problema identificado

El frontend en **`https://insecap.cl`** no puede acceder al API en **`https://tms.insecap.cl`** debido a restricciones de CORS (Cross-Origin Resource Sharing).

### Síntomas
- Error en consola: `Failed to fetch`
- No aparecen datos en los selectores (profesiones, disponibilidades, idiomas, etc.)
- No hay requests a `tms.insecap.cl` en la pestaña Network (bloqueados por el navegador)

### Causa
El navegador bloquea requests entre diferentes dominios por seguridad. Necesita autorización explícita del servidor.

---

## Solución

**El equipo de backend en .NET debe configurar CORS** en `https://tms.insecap.cl`

### Opción 1: Habilitar CORS en .NET Framework/Core

#### Para ASP.NET Core:

**En `Program.cs` o `Startup.cs`:**

```csharp
var builder = WebApplicationBuilder.CreateBuilder(args);

// Agregar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowInsecap",
        builder =>
        {
            builder
                .WithOrigins(
                    "https://insecap.cl",
                    "https://www.insecap.cl"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});

var app = builder.Build();

// Usar CORS middleware (ANTES de otras middlewares)
app.UseCors("AllowInsecap");

// ... resto de configuración
```

#### Para ASP.NET Framework (MVC/WebAPI):

**En `web.config`:**

```xml
<system.webServer>
    <httpProtocol>
        <customHeaders>
            <add name="Access-Control-Allow-Origin" value="https://insecap.cl" />
            <add name="Access-Control-Allow-Methods" value="GET, POST, OPTIONS, PUT, DELETE" />
            <add name="Access-Control-Allow-Headers" value="Content-Type, Authorization, ngrok-skip-browser-warning, User-Agent" />
            <add name="Access-Control-Allow-Credentials" value="true" />
        </customHeaders>
    </httpProtocol>
</system.webServer>
```

**O en el código:**

```csharp
protected void Application_BeginRequest()
{
    HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "https://insecap.cl");
    HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, ngrok-skip-browser-warning, User-Agent");
    
    if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
    {
        HttpContext.Current.Response.End();
    }
}
```

---

### Opción 2: Usar un Proxy en el Frontend (Alternativa)

Si no quieren habilitar CORS, pueden servir el API a través del mismo dominio:

En **`vite.config.ts`** (para producción):

```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      proxy: {
        '/api': {
          target: 'https://tms.insecap.cl',
          changeOrigin: true,
          secure: false, // Para certificados auto-firmados
          headers: { 'ngrok-skip-browser-warning': 'true' },
        },
      },
    },
    // ... resto de config
  };
});
```

Luego en BeRelator.tsx:

```typescript
const getApiUrl = (endpoint: string) => {
  // Siempre usar rutas relativas (será proxiadas)
  return endpoint;
};
```

---

## Verificación

Una vez el backend esté configurado:

### 1. Verificar headers CORS

```bash
curl -i https://tms.insecap.cl/api/publica/profesiones \
  -H "Origin: https://insecap.cl" \
  -H "ngrok-skip-browser-warning: true"
```

Debe devolver headers como:
```
Access-Control-Allow-Origin: https://insecap.cl
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning, User-Agent
```

### 2. En el navegador

1. Abre `https://insecap.cl/es/trabaja-con-nosotros`
2. Presiona **F12** → **Network**
3. Recarga la página
4. Busca requests a `tms.insecap.cl`
5. ✅ Si aparecen con status **200** = Funciona
6. ✅ Si no aparecen pero ves logs `[BeRelator]` = Aún hay CORS

### 3. En consola

Deberías ver:
```
[BeRelator] ✓ Carga de selectores completada exitosamente
```

---

## Headers requeridos

El frontend envía estos headers en todos los requests:

```
ngrok-skip-browser-warning: true
User-Agent: insecap-capacitaciones
Content-Type: application/json (solo en POST)
```

El backend debe permitirlos en la configuración CORS.

---

## Testing en desarrollo

Para testear localmente antes de deployar a producción:

### En desarrollo local (localhost:3000):

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocal",
        builder =>
        {
            builder
                .WithOrigins(
                    "http://localhost:3000",
                    "http://localhost:8080",
                    "http://localhost:8081",
                    "https://insecap.cl"
                )
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        });
});
```

---

## ❌ NO HACER

- ❌ `Access-Control-Allow-Origin: *` (inseguro, permite cualquier origen)
- ❌ Deshabilitar CORS completamente
- ❌ Usar `allowCredentials()` sin especificar orígenes exactos

---

## Recursos

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [ASP.NET Core CORS](https://docs.microsoft.com/es-es/aspnet/core/security/cors)
- [Postman: Testing CORS](https://learning.postman.com/docs/sending-requests/troubleshooting/cors/)

---

## Próximos pasos

1. **Comparte este archivo** con el equipo de backend
2. **Aplica la configuración CORS** según tu framework
3. **Deploy a production**
4. **Verifica** que funcione en https://insecap.cl
5. **Confirma** que ves logs `[BeRelator] ✓ Carga de selectores completada exitosamente`

Si necesitas más ayuda, revisa [DEBUGGING_GUIDE.md](./DEBUGGING_GUIDE.md)
