# Implementation Plan: Hardening de configuración de entorno del frontend

**Branch**: `001-env-config-hardening` | **Date**: 2026-06-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-env-config-hardening/spec.md`

## Summary

Centralizar las cuatro variables `VITE_*` obligatorias en `src/config/env.js` con validación
Zod y export `envs` (camelCase). Eliminar `import.meta.env` directo en `src/`, corregir
`.env.example` para incluir `/api/v1`, alinear WhatsApp en `HeaderQuienSomos`, e introducir
Vitest con tests de la función pura `parseClientEnv`. Paridad conceptual con el backend
(`envs.ts` + Zod fail-fast).

## Technical Context

**Language/Version**: JavaScript (JSX), React 19, Node.js ≥ 18

**Primary Dependencies**: Vite 6, Zod (nuevo runtime), Vitest + `@vitest/coverage-v8` (dev)

**Storage**: N/A — config en memoria; Vite inyecta `import.meta.env` en build

**Testing**: Vitest unit tests en `src/config/parseClientEnv.test.js`

**Target Platform**: Desarrollo local (Windows/macOS/Linux) + Vercel (production SPA)

**Project Type**: SPA React (`SaphireSouvernis-Front`)

**Performance Goals**: Sin impacto perceptible (parse único al importar `env.js`)

**Constraints**: Sin `import.meta.env` en `src/` fuera de `env.js`; sin TypeScript; sin
cambios de contrato API; `VITE_SHOP_URL` exportada sin consumidor UI

**Scale/Scope**: ~8 archivos fuente modificados/creados, 1 test file, `package.json`,
`.env.example`, `vite.config.js` (plugin Vitest)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Reference: `.specify/memory/constitution.md` (v1.0.0)

- [x] HTTP solo vía `apiClient` — N/A en esta feature (solo migra URL base a `envs.apiUrl`)
- [x] Config centralizada: `src/config/env.js` + `.env.example`; prohibido `import.meta.env` en `src/`
- [x] Arquitectura Context API — sin cambios de estado
- [x] `ProtectedRoute` — N/A
- [x] Contratos API legacy — N/A (sin cambios en services paths)
- [x] Tailwind / design system — N/A
- [x] Vitest en feature nueva — definido en este plan
- [x] JSX/JS — sin TypeScript
- [x] Workflow SDD: specify ✅ → clarify ✅ → plan (este doc) → tasks → analyze

**Post-design re-check**: Sin violaciones. No se requiere Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-env-config-hardening/
├── spec.md
├── plan.md              # Este archivo
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── runtime-config.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── config/
│   ├── env.js                 # CREATE: import.meta.env → parseClientEnv → export envs
│   ├── parseClientEnv.js      # CREATE: función pura + schema Zod
│   └── parseClientEnv.test.js # CREATE: matriz Vitest
├── services/
│   └── apiClient.js           # MODIFY: envs.apiUrl
├── App.jsx                    # MODIFY: envs.whatsappNum
├── components/
│   ├── Navbar/Navbar.jsx      # MODIFY: envs.logoUrl
│   ├── Home/Footer.jsx        # MODIFY: envs.logoUrl, envs.whatsappNum
│   └── Home/HeaderQuienSomos.jsx # MODIFY: envs.whatsappNum (quitar hardcode)
└── views/
    └── AboutUs.jsx            # MODIFY: envs.logoUrl

.env.example                   # MODIFY: VITE_API_URL con /api/v1
package.json                   # MODIFY: zod, vitest, script test
vite.config.js                 # MODIFY: test config (Vitest)
```

**Structure Decision**: Separar `parseClientEnv.js` (pura, testeable) de `env.js` (único
punto que lee `import.meta.env`), espejo del patrón backend `resolveRuntimeConfig` +
`envs.ts`.

## Phase 0: Research

Ver [research.md](./research.md) — todas las decisiones resueltas, sin NEEDS CLARIFICATION.

## Phase 1: Design

| Artefacto | Propósito |
|-----------|-----------|
| [data-model.md](./data-model.md) | Variables `VITE_*` y objeto `envs` exportado |
| [contracts/runtime-config.md](./contracts/runtime-config.md) | Reglas de validación y fail-fast |
| [quickstart.md](./quickstart.md) | Validación manual post-implementación |

## Implementation Approach

### 1. `src/config/parseClientEnv.js` (nuevo)

Función pura exportada:

```javascript
/**
 * @param {Record<string, string | undefined>} rawViteEnv
 * @returns {{ apiUrl: string, shopUrl: string, logoUrl: string, whatsappNum: string }}
 */
export function parseClientEnv(rawViteEnv)
```

**Schema Zod** (sobre objeto con keys `VITE_*`):

| Campo raw | Regla |
|-----------|-------|
| `VITE_API_URL` | `z.string().min(1)` + `.refine(endsWith('/api/v1'))` |
| `VITE_SHOP_URL` | `z.string().url().min(1)` |
| `VITE_LOGO_URL` | `z.string().url().min(1)` |
| `VITE_WHATSAPP_NUM` | `z.string().regex(/^\d{7,15}$/)` |

**Output** (transform): `{ apiUrl, shopUrl, logoUrl, whatsappNum }`.

En error: lanzar `Error` con mensaje que incluya path Zod (ej. `VITE_API_URL: ...`) para
SC-003 y FR-004.

### 2. `src/config/env.js` (nuevo)

```javascript
import { parseClientEnv } from './parseClientEnv';

export const envs = parseClientEnv({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SHOP_URL: import.meta.env.VITE_SHOP_URL,
  VITE_LOGO_URL: import.meta.env.VITE_LOGO_URL,
  VITE_WHATSAPP_NUM: import.meta.env.VITE_WHATSAPP_NUM,
});
```

Único archivo bajo `src/` permitido a leer `import.meta.env` (constitución).

### 3. Migración de consumidores

| Archivo | Antes | Después |
|---------|-------|---------|
| `apiClient.js` | `import.meta.env.VITE_API_URL` | `envs.apiUrl` |
| `App.jsx` | `import.meta.env.VITE_WHATSAPP_NUM` | `envs.whatsappNum` |
| `Navbar.jsx` | `import.meta.env.VITE_LOGO_URL` | `envs.logoUrl` |
| `Footer.jsx` | logo + whatsapp env directo | `envs.logoUrl`, `envs.whatsappNum` |
| `AboutUs.jsx` | `import.meta.env.VITE_LOGO_URL` | `envs.logoUrl` |
| `HeaderQuienSomos.jsx` | `https://wa.me/3413857748` | `549${envs.whatsappNum}` vía patrón existente |

### 4. Vitest setup

- `npm install -D vitest`
- `npm install zod`
- `vite.config.js`: agregar bloque `test: { environment: 'node', globals: false }`
- `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`
- Tests en `parseClientEnv.test.js` — **no** importar `env.js` (evitar side effect de
  `import.meta.env` real en tests)

**Matriz de tests** (FR-008):

| Caso | Input | Esperado |
|------|-------|----------|
| Happy path | 4 vars válidas, API con `/api/v1` | objeto camelCase |
| Missing | omitir `VITE_API_URL` | throw, mensaje menciona `VITE_API_URL` |
| Empty | `VITE_LOGO_URL: ''` | throw |
| Bad API suffix | `http://localhost:3000` | throw, mensaje sobre `/api/v1` |

### 5. `.env.example`

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SHOP_URL=https://saphire-souvenirs-shop.vercel.app
VITE_LOGO_URL=https://res.cloudinary.com/...
VITE_WHATSAPP_NUM=3417120039
```

Comentario: URL base **incluye** `/api/v1`; sin barra final tras `v1`.

### 6. Verificación estática post-migración

```bash
# Debe retornar 0 matches fuera de src/config/env.js
rg "import\.meta\.env" src/
```

## Complexity Tracking

> Sin violaciones de constitución que requieran justificación.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Risks & Mitigations

| Riesgo | Mitigación |
|--------|------------|
| Vite reemplaza `import.meta.env` en build; vars faltantes → `undefined` | Fail-fast al importar `env.js`; documentar vars en Vercel quickstart |
| Dev con `.env` viejo sin `/api/v1` | Fail-fast claro; actualizar `.env` local al implementar |
| `env.js` importado antes de validar en tests | Tests solo sobre `parseClientEnv`, no sobre `env.js` |
| Dependencia `zod` nueva | Única dep runtime; alineada a backend y FR-011 |

## Next Step

Ejecutar `/speckit-tasks` para generar `tasks.md` atómico, luego `/speckit-analyze`.
