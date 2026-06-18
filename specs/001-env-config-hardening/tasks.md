---
description: "Task list for feature 001-env-config-hardening (Frontend)"
---

# Tasks: Hardening de configuración de entorno del frontend

**Input**: Design documents from `specs/001-env-config-hardening/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/runtime-config.md

**Tests**: Incluidos (FR-008 / clarify Session 2026-06-18) — unit tests Vitest en `src/config/parseClientEnv.test.js`

**Organization**: Tareas agrupadas por user story para entregas incrementales verificables.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencias pendientes)
- **[USn]**: User story del spec.md

## Path Conventions

- Frontend SPA: `src/` en raíz del repositorio `SaphireSouvernis-Front`

---

## Phase 1: Setup

**Purpose**: Alinear implementación con artefactos de diseño

- [x] T001 Revisar matriz de validación en `specs/001-env-config-hardening/contracts/runtime-config.md` y modelo en `specs/001-env-config-hardening/data-model.md` antes de codificar

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Módulo env, Vitest, Zod y tests — **bloquea todas las user stories**

**⚠️ CRITICAL**: No comenzar US1/US2/US3 hasta completar esta fase

- [x] T002 Instalar dependencias: `zod` (runtime) y `vitest` (dev) vía `package.json`
- [x] T003 Agregar scripts `"test": "vitest run"` y `"test:watch": "vitest"` en `package.json`
- [x] T004 Configurar bloque `test: { environment: 'node', globals: false }` en `vite.config.js`
- [x] T005 Crear `src/config/parseClientEnv.js` con schema Zod, regla `/api/v1`, transform a `{ apiUrl, shopUrl, logoUrl, whatsappNum }` y fail-fast con mensajes identificables según `specs/001-env-config-hardening/plan.md`
- [x] T006 [P] Crear `src/config/parseClientEnv.test.js` con matriz completa: happy path, variable faltante, string vacío, `VITE_API_URL` sin `/api/v1` (assert mensaje de error)
- [x] T007 Crear `src/config/env.js` como único módulo que lee `import.meta.env` y exporta `envs` vía `parseClientEnv`
- [x] T008 [P] Actualizar `.env.example`: `VITE_API_URL` con `/api/v1`, comentarios claros; mantener `VITE_SHOP_URL`, `VITE_LOGO_URL`, `VITE_WHATSAPP_NUM`

**Checkpoint**: `npm test` pasa; importar `env.js` con `.env` válido no lanza error

---

## Phase 3: User Story 1 - Arranque predecible con configuración completa (Priority: P1) 🎯 MVP

**Goal**: Fail-fast ante config inválida; `envs` expone cuatro valores no vacíos con `.env` completo

**Independent Test**: `npm run dev` con `.env` válido — sin errores de config; comentar una variable → fail-fast explícito (ver `specs/001-env-config-hardening/quickstart.md` §4-6)

### Implementation for User Story 1

- [x] T009 [US1] Verificar que `src/config/env.js` falla al importarse cuando falta o está vacía cualquier `VITE_*` obligatoria (ajustar `parseClientEnv.js` si hace falta tras prueba manual)
- [x] T010 [US1] Documentar en comentarios de `src/config/env.js` que es el **único** archivo permitido a usar `import.meta.env` en `src/`

**Checkpoint**: US1 verificable — quickstart §4 (arranque válido) y §5 (fail-fast variable faltante)

---

## Phase 4: User Story 2 - API alineada al backend NestJS (Priority: P2)

**Goal**: Peticiones API usan base URL con `/api/v1`

**Independent Test**: Con backend local en `:3000`, catálogo carga vía `.../api/v1/products`; quickstart §6 (fail si URL sin sufijo)

### Implementation for User Story 2

- [x] T011 [US2] Migrar `src/services/apiClient.js`: reemplazar `import.meta.env.VITE_API_URL` por `envs.apiUrl` desde `src/config/env.js`
- [x] T012 [US2] Actualizar `.env` local (no commitear): `VITE_API_URL=http://localhost:3000/api/v1` siguiendo `.env.example`

**Checkpoint**: US2 verificable — Network tab muestra requests a `/api/v1/...`; quickstart §6

---

## Phase 5: User Story 3 - WhatsApp y assets desde config centralizada (Priority: P3)

**Goal**: Cero `import.meta.env` en `src/`; WhatsApp consistente en todos los componentes

**Independent Test**: Navegar Home, Footer, `/about-us`; enlaces WhatsApp usan `549` + `envs.whatsappNum`; `rg "import.meta.env" src/` solo en `env.js`

### Implementation for User Story 3

- [x] T013 [P] [US3] Migrar `src/App.jsx`: `envs.whatsappNum` para FAB WhatsApp
- [x] T014 [P] [US3] Migrar `src/components/Navbar/Navbar.jsx`: `envs.logoUrl`
- [x] T015 [P] [US3] Migrar `src/components/Home/Footer.jsx`: `envs.logoUrl` y `envs.whatsappNum`
- [x] T016 [P] [US3] Migrar `src/views/AboutUs.jsx`: `envs.logoUrl`
- [x] T017 [US3] Migrar `src/components/Home/HeaderQuienSomos.jsx`: eliminar hardcode `3413857748`; usar `envs.whatsappNum` con prefijo `549` (patrón `Footer.jsx`)

**Checkpoint**: US3 verificable — quickstart §7; SC-001 y SC-004 cumplidos

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validación final, lint y documentación operativa

- [x] T018 Ejecutar `npm test` y corregir regresiones si las hay
- [x] T019 Ejecutar `npm run lint` y corregir issues introducidos
- [x] T020 Verificar `rg "import\.meta\.env" src/` — solo coincidencias en `src/config/env.js`
- [x] T021 [P] Ejecutar validación manual de `specs/001-env-config-hardening/quickstart.md` (§1-9) y anotar resultados
- [x] T022 [P] Ejecutar `npm run build` con `.env` completo; confirmar build falla con variable obligatoria comentada

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias
- **Foundational (Phase 2)**: Depende de Setup — **bloquea US1, US2, US3**
- **US1 (Phase 3)**: Depende de T005-T008
- **US2 (Phase 4)**: Depende de T007 (envs exportado) + T011
- **US3 (Phase 5)**: Depende de T007; T013-T017 paralelizables entre sí
- **Polish (Phase 6)**: Depende de US1 + US2 + US3

### User Story Dependencies

- **US1 (P1)**: Tras Phase 2 — MVP verificable con env válido/fail-fast
- **US2 (P2)**: Tras US1 checkpoint; solo `apiClient.js`
- **US3 (P3)**: Tras T007; independiente de US2 en archivos distintos

### Within Each Phase

- T005 `parseClientEnv.js` antes de T006 tests (o TDD: test primero con stub)
- T005 antes de T007 `env.js`
- T011 requiere T007
- T013-T016 paralelos; T017 puede ir en paralelo con T013-T016

### Parallel Opportunities

- T006 y T008 en paralelo tras T005
- T013, T014, T015, T016 en paralelo tras T007
- T021 y T022 en paralelo al final

---

## Parallel Example: Foundational

```bash
# Tras T005, en paralelo:
Task T006: "Crear src/config/parseClientEnv.test.js"
Task T008: "Actualizar .env.example"
```

---

## Parallel Example: User Story 3

```bash
# Tras T007, en paralelo:
Task T013: "Migrar src/App.jsx"
Task T014: "Migrar src/components/Navbar/Navbar.jsx"
Task T015: "Migrar src/components/Home/Footer.jsx"
Task T016: "Migrar src/views/AboutUs.jsx"
# Luego o en paralelo:
Task T017: "Migrar src/components/Home/HeaderQuienSomos.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 + Phase 2 (T001-T008)
2. Completar T009-T010 [US1]
3. **STOP y VALIDAR**: quickstart §4-5 — arranque y fail-fast
4. Opcional: continuar US2/US3 antes de merge

### Incremental Delivery

1. Foundational → `parseClientEnv` + `env.js` + tests
2. US1 → fail-fast y arranque predecible (MVP)
3. US2 → `apiClient` con `/api/v1`
4. US3 → migración UI + WhatsApp
5. Polish → lint, rg, build, quickstart completo

---

## Notes

- No commitear `.env` local
- No modificar consumo de `VITE_SHOP_URL` en UI (out of scope)
- No migrar Instagram/hero/favicon en esta feature
- Total tasks: **22** (T001-T022)
