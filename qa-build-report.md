# Reporte QA — Builds Manuales — Fase 1
**Proyecto:** Tu Cancha  
**Fecha:** 2026-05-09  
**QA Engineer:** Edwin  
**Herramientas:** Jest (backend), Vitest (frontend), NestJS CLI build, Nuxt build

---

## Resumen Ejecutivo

| Componente | Estado Build | Tests Configurados | Tests Pasando |
|---|---|---|---|
| **Backend** (NestJS) | ✅ EXITOSO | ✅ Sí (Jest) | ✅ 18/18 |
| **Frontend** (Nuxt 4) | ❌ FALLIDO | ✅ Sí (Vitest) | ✅ 17/17 |

---

## Backend — Resultado del Build

**Comando:** `npm run build` (NestJS CLI → `nest build`)  
**Estado:** ✅ **EXITOSO** — Compiló sin errores ni advertencias.  
**Tiempo:** ~18 segundos  

```
> tucancha-backend@1.0.0 build
> nest build

[Build completado sin errores]
```

---

## Frontend — Resultado del Build

**Comando:** `npm run build` (Nuxt 4 → `nuxt build`)  
**Estado:** ❌ **FALLIDO**  
**Tiempo hasta error:** ~9.52 segundos  

### ERROR CRÍTICO #1 — Import incorrecto en RichTextEditor

**Severidad:** 🔴 CRÍTICA — Bloquea el build de producción  
**Archivo:** `app/components/shared/RichTextEditor.client.vue` (línea 16)

**Mensaje de error:**
```
RollupError: "default" is not exported by 
"node_modules/@tiptap/extension-text-style/dist/index.js", 
imported by "app/components/shared/RichTextEditor.client.vue"
```

**Causa raíz:**  
El componente `RichTextEditor.client.vue` importa extensiones de TipTap usando **default imports** (e.g., `import TextAlign from '@tiptap/extension-text-align'`). Sin embargo, la versión de TipTap instalada (`^3.22.4`) **exporta con named exports**, no con default export.

**Líneas problemáticas identificadas:**
```typescript
// INCORRECTO (default import — no funciona con TipTap 3.x)
import TextAlign from '@tiptap/extension-text-align'   // línea 16
import TextStyle from '@tiptap/extension-text-style'   // línea 18

// CORRECTO (named import)
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
```

**Solución recomendada:**  
➡️ **Asignado al Desarrollador Frontend Senior** (Israel) — Actualizar todos los imports de TipTap en `RichTextEditor.client.vue` para usar named imports. Verificar también `Underline`, `Image`, `Link` y otras extensiones.

---

### ADVERTENCIA #1 — Imagen faltante `hero-court.png`

**Severidad:** 🟡 MEDIA — No bloquea el build pero causa error 404 en producción  
**Ubicación:** Referenciada desde algún componente de la landing page

**Mensaje:**
```
WARN: /hero-court.png referenced in /hero-court.png didn't resolve at build time,
it will remain unchanged to be resolved at runtime
```

**Causa raíz:**  
El archivo `public/hero-court.png` no existe en el repositorio. La imagen es referenciada en el hero de la landing page pero nunca fue agregada al proyecto.

**Solución recomendada:**  
➡️ **Asignado al Desarrollador Frontend Senior** (Israel) — Agregar la imagen real en `frontend/public/hero-court.png` o corregir la referencia en el componente a una imagen existente.

---

### ADVERTENCIA #2 — Sourcemap no generado por plugin

**Severidad:** 🟢 BAJA — Solo afecta la depuración en producción, no la funcionalidad  
**Plugin:** `nuxt:module-preload-polyfill`

**Mensaje:**
```
WARN: Sourcemap is likely to be incorrect: a plugin (nuxt:module-preload-polyfill) 
was used to transform files, but didn't generate a sourcemap for the transformation.
```

**Causa raíz:**  
El plugin interno de Nuxt para polyfills no genera sourcemaps. Esto es un comportamiento conocido de Nuxt 4 y no es accionable por el equipo del proyecto.

**Solución recomendada:**  
➡️ Sin acción requerida. Monitorear si futuras versiones de Nuxt lo resuelven.

---

## Entorno de Tests Configurado

### Backend — Jest

| Configuración | Valor |
|---|---|
| Framework | Jest 29.x con ts-jest |
| Entorno | Node.js |
| Archivos de test | `src/**/*.spec.ts` |
| Scripts | `npm test`, `npm run test:watch`, `npm run test:cov` |

**Tests creados:**

| Archivo | Tests | Estado |
|---|---|---|
| `src/auth/auth.service.spec.ts` | 7 tests (register, login, smoke) | ✅ PASANDO |
| `src/bookings/bookings.service.spec.ts` | 11 tests (slots, create, findOne) | ✅ PASANDO |

**Resultado:**
```
Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Time:        8.522 s
```

---

### Frontend — Vitest

| Configuración | Valor |
|---|---|
| Framework | Vitest 4.x |
| Entorno | jsdom (simulación del navegador) |
| Archivos de test | `tests/**/*.spec.ts` |
| Scripts | `npm test`, `npm run test:watch`, `npm run test:cov` |

**Tests creados:**

| Archivo | Tests | Estado |
|---|---|---|
| `tests/unit/utils.spec.ts` | 17 tests (precios, fechas, validaciones) | ✅ PASANDO |

**Resultado:**
```
Test Files  1 passed (1)
Tests       17 passed (17)
Duration    2.88s
```

---

## Prioridad de Correcciones

| # | Error | Severidad | Responsable | Impacto |
|---|---|---|---|---|
| 1 | Import incorrecto TipTap en `RichTextEditor.client.vue` | 🔴 CRÍTICA | Dev Frontend (Israel) | Bloquea deploy a producción |
| 2 | Imagen `/hero-court.png` faltante | 🟡 MEDIA | Dev Frontend (Israel) | Error 404 en la landing page |
| 3 | Sourcemap warning en nuxt:module-preload-polyfill | 🟢 BAJA | N/A | Solo afecta debugging |

---

## Comandos de Referencia

```bash
# Ejecutar tests
cd backend && npm test              # Ejecuta todos los tests del backend
cd frontend && npm test             # Ejecuta todos los tests del frontend

# Ejecutar con cobertura
cd backend && npm run test:cov      # Genera reporte de cobertura en /coverage/backend
cd frontend && npm run test:cov     # Genera reporte de cobertura en /coverage/frontend

# Modo watch (re-ejecuta al guardar)
cd backend && npm run test:watch
cd frontend && npm run test:watch

# Builds
cd backend && npm run build         # ✅ Funciona
cd frontend && npm run build        # ❌ Falla (ver ERROR CRÍTICO #1)
```
