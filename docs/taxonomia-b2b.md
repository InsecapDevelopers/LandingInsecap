# Taxonomía del catálogo B2B — análisis de CategoriaR11 / SubCategoriaR11

Fuente: `DB_SGC` (SQL Server local). Objetivo: reducir el catálogo B2B a las subcategorías que
tengan al menos un curso **y** sentido con el catálogo B2B actual (61 productos en Shopify).

## 1. Diagnóstico

| Métrica | Valor |
|---|---|
| Categorías raíz (`CategoriaR11`) | **596** |
| Subcategorías (`SubCategoriaR11`) | **304** |
| Subcategorías con ≥1 curso | **93** (31%) |
| Subcategorías vacías | **211** (69%) |
| Categorías raíz que realmente agrupan cursos | **16** de 596 |

La relación curso↔subcategoría vive en **`R11`** (la ficha técnica): `R11.idCurso`,
`R11.idSubCategoriaR11`. La tabla `Curso` no tiene columna de categoría.

### 1.1 Hay dos taxonomías mezcladas en la misma tabla

`CategoriaR11` contiene dos cosas distintas:

- **Estándares de cliente** — 58 subcategorías con prefijo `[DIVISIONAL]` y `[VP]`, nombradas
  `RF 01 ENERGÍA ELÉCTRICA`, `RF 02 TRABAJO EN ALTURA`, etc. Son marcos normativos de Codelco,
  **no categorías de catálogo**. 43 tienen cursos (75 en total).
- **Categorías temáticas** — 246 subcategorías, de las cuales solo **49 tienen cursos** (611).

En el catálogo B2B actual esa distinción ya existe y está bien resuelta: el estándar (Codelco,
MEL, Spence…) es una **dimensión de la combinación de dictado**, no la categoría del curso.
**Los `[DIVISIONAL]`/`[VP]` no deben convertirse en categorías del catálogo.**

## 2. Cruce con el catálogo B2B actual

Comparando los 61 productos de Shopify contra los 444 cursos temáticos de la base
(coincidencia por tokens del título, umbral 0.5):

- **39 de 61** tienen equivalente identificable en la base.
- **22 no lo tienen**: AutoCAD, Microsoft Excel, Microsoft Office, Topografía, Lean
  Manufacturing, Medioambiente y Sustentabilidad, Baja Tensión, Electrónica e Instrumentación,
  Bodega y Logística, Atención al Cliente, Operación de Bulldozer / Cargador Frontal /
  Motosierra / Plataforma Elevadora, Instalaciones Sanitarias, Gases y Atmósferas, entre otros.

Esos 22 son cursos que la web ofrece pero que **no tienen ficha técnica R11** en el sistema.
Antes de migrar hay que decidir: crear la ficha, o sacarlos del catálogo.

Las subcategorías que efectivamente cubren el catálogo B2B actual son **17**.

## 3. Taxonomía propuesta

Solo categorías temáticas con ≥1 curso: **16 categorías, 49 subcategorías, 611 cursos**.
`[B2B]` marca las que ya cubren productos del catálogo actual.

| Categoría | Cursos | Subcat |
|---|---|---|
| Seguridad, Prevención de Riesgos y Salud Ocupacional | 353 | 9 |
| Soldadura y Procesos de Unión | 130 | 9 |
| Izaje y Maniobras de Carga, Rigger | 37 | 2 |
| Tecnologías de la Información, Computación e Informática | 28 | 3 |
| Área de la Salud | 27 | 3 |
| Operación de Equipos de Servicio / Equipos Móviles | 9 | 4 |
| Competencias Transversales y Habilidades Blandas | 8 | 5 |
| Procesos Mineros e Industriales | 6 | 2 |
| Transporte, Logística y Conducción | 3 | 3 |
| Construcción y Obras Civiles | 2 | 1 |
| Habilidades Blandas y Desarrollo Personal | 2 | 2 |
| Operación de Equipos de Alto Tonelaje | 2 | 2 |
| Gestión de Calidad e Innovación | 1 | 1 |
| Liderazgo y Gestión | 1 | 1 |
| Marco Legal, Normativa Laboral y Cumplimiento | 1 | 1 |
| Recursos Humanos | 1 | 1 |

### 3.1 Detalle de las subcategorías vigentes

```
SEGURIDAD, PREVENCIÓN DE RIESGOS Y SALUD OCUPACIONAL (353)
  [B2B] 150  Otros asociados            ⚠️ cajón de sastre
  [B2B]  91  Trabajo en Altura
         32  Almacenamiento y manejo de sustancias peligrosas
  [B2B]  26  Espacios confinados
  [B2B]  24  Armado y desarme de andamios
  [B2B]  12  Aislación y Bloqueo
          9  Manejo y uso de extintores
          8  Trabajo y Rescate en Altura      ⚠️ solapa con "Trabajo en Altura"
          1  Primeros auxilios                ⚠️ duplica Área de la Salud

SOLDADURA Y PROCESOS DE UNIÓN (130)
  [B2B]  64  Otros asociados            ⚠️ cajón de sastre
  [B2B]  32  Ensayos No Destructivos (END)
         10  Oxicorte y corte térmico
         10  Soldadura SMAW · 5 GTAW/TIG · 3 GMAW/MIG-MAG · 2 FCAW
          2  Soldadura en posición · 2 Inspección y control de calidad

IZAJE Y MANIOBRAS DE CARGA, RIGGER (37)
  [B2B]  35  Operador/a de Grúa (puente grúa, pluma, horquilla)
  [B2B]   2  Rigger de baja

TECNOLOGÍAS DE LA INFORMACIÓN, COMPUTACIÓN E INFORMÁTICA (28)
  [B2B]  24  Software de gestión ERP (SAP, Oracle u otros)
          3  Inteligencia Artificial aplicada al trabajo
          1  Manejo y Análisis de Datos

ÁREA DE LA SALUD (27)
  [B2B]  20  Primeros Auxilios y DEA
          5  Hipobaria
  [B2B]   2  Primeros Auxilios Psicológicos (PAP)

OPERACIÓN DE EQUIPOS DE SERVICIO / EQUIPOS MÓVILES (9)
          6  Operador/a de Alzahombre / Plataforma de Trabajo Elevada
  [B2B]   1  Operador/a de Excavadora · 1 Bulldozer · 1 Minicargador

Resto: Competencias Transversales (8) · Procesos Mineros (6) · Transporte (3) ·
Construcción (2) · Habilidades Blandas (2) · Alto Tonelaje (2) ·
Gestión de Calidad (1) · Liderazgo (1) · Marco Legal (1) · RR.HH. (1)
```

## 4. Problemas de la taxonomía actual (a resolver antes de migrar)

1. **Los cajones "Otros asociados" concentran el 35% de los cursos** — 150 en Seguridad, 64 en
   Soldadura, 5 en Procesos Mineros. Una subcategoría con 150 cursos no filtra nada: hay que
   reclasificarlos o el catálogo será inutilizable para el usuario.
2. **Categorías duplicadas conceptualmente**: `COMPETENCIAS TRANSVERSALES, HABILIDADES BLANDAS Y
   DESARROLLO ORGANIZACIONAL` (8) vs `HABILIDADES BLANDAS Y DESARROLLO PERSONAL` (2) vs
   `LIDERAZGO Y GESTIÓN` (1). Son lo mismo: fusionar en una.
3. **Subcategorías duplicadas dentro de una categoría**: `Diversidad, inclusión y equidad de
   género (Ley…)` y `Diversidad, inclusión y equidad de género **en el trabajo** (Ley…)`, con
   1 curso cada una. También `Trabajo en Altura` vs `Trabajo y Rescate en Altura`.
4. **596 categorías raíz para 16 en uso** — el 97% es ruido. Conviene marcar `softDelete` sobre
   las vacías o filtrarlas siempre en la consulta.
5. **Las 10 categorías de cola tienen 1-3 cursos cada una.** Como filtros no aportan; considera
   agruparlas en una categoría "Gestión y Desarrollo Organizacional".

## 5. Recomendación

**Taxonomía de dos niveles, filtrando por uso real:**

```sql
-- Categorías y subcategorías vigentes para el catálogo B2B
SELECT c.categoria, s.subCategoria, COUNT(DISTINCT r.idCurso) AS cursos
FROM SubCategoriaR11 s
JOIN CategoriaR11 c ON c.idCategoria = s.idCategoria
JOIN R11 r ON r.idSubCategoriaR11 = s.idSubCategoriaR11 AND ISNULL(r.softDelete,0) = 0
WHERE ISNULL(s.softDelete,0) = 0
  AND ISNULL(c.softDelete,0) = 0
  AND c.categoria NOT LIKE '[[]DIVISIONAL]%'   -- estándares de cliente, no categorías
  AND c.categoria NOT LIKE '[[]VP]%'
GROUP BY c.categoria, s.subCategoria
HAVING COUNT(DISTINCT r.idCurso) > 0
ORDER BY c.categoria, cursos DESC;
```

Pasos concretos:

1. **Excluir `[DIVISIONAL]` y `[VP]`** del catálogo: el estándar ya es una dimensión de la
   combinación de dictado (§1.1), no una categoría.
2. **Quedarse con las 16 categorías / 49 subcategorías** que tienen cursos. Pasa de 596 a 16
   categorías visibles.
3. **Reclasificar los "Otros asociados"** (219 cursos entre las tres) — es el trabajo de fondo
   con mayor impacto en la usabilidad del filtro.
4. **Fusionar los duplicados** del punto 4.2 y 4.3.
5. **Decidir sobre los 22 cursos del catálogo actual sin ficha R11** (§2): crear ficha o retirar
   del catálogo.
6. Al migrar (ver [modulo-cursos-empresas.md](modulo-cursos-empresas.md)), reemplazar el
   `productType` de Shopify por este par categoría/subcategoría, y usar `categoria_slug` +
   `subcategoria_slug` para los filtros de la web.
