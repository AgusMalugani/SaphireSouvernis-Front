# Research: 001-env-config-hardening (Frontend)

**Date**: 2026-06-18

## R1: Lectura de variables en Vite vs backend

**Decision**: Un solo archivo `src/config/env.js` lee `import.meta.env`; el resto de `src/`
importa `envs`.

**Rationale**: Vite expone variables en compile-time vía `import.meta.env.VITE_*`. No usar
`process.env` ni `dotenv` (prohibido en README/constitución). Centralizar en un módulo cumple
principio II.

**Alternatives considered**:

- `process.env` + dotenv — rechazado; prohibido en proyecto
- Acceso directo disperso — rechazado; estado actual a remediar

## R2: Función pura testeable separada del módulo env

**Decision**: `parseClientEnv(rawViteEnv)` en `parseClientEnv.js`; `env.js` solo delega.

**Rationale**: Vitest no debe depender del `.env` real del desarrollador; tests inyectan
objetos mock. Paridad con backend `resolveRuntimeConfig.ts`.

**Alternatives considered**:

- Mockear `import.meta.env` global en Vitest — rechazado; frágil con ESM/Vite
- Tests e2e únicamente — rechazado; spec exige matriz unitaria FR-008

## R3: Validación Zod y regla `/api/v1`

**Decision**: Schema Zod con `.min(1)` en strings obligatorias y `.refine()` en
`VITE_API_URL` que exija sufijo `/api/v1` (sin auto-append).

**Rationale**: Clarify Q1/Q2; mensajes Zod identificables por variable; alineado a FR-004.

**Alternatives considered**:

- Validación manual if/throw — rechazado en clarify (opción Zod elegida)
- Auto-append `/api/v1` — rechazado en clarify

## R4: Setup Vitest con Vite 6

**Decision**: Vitest como devDependency; configuración `test` en `vite.config.js` con
`environment: 'node'` para tests de `parseClientEnv` (sin jsdom).

**Rationale**: Vitest comparte config con Vite; no requiere Jest ni jsdom para función pura.
Constitución VII exige Vitest.

**Alternatives considered**:

- Jest — rechazado; no está en stack frontend
- jsdom + Testing Library — rechazado; out of scope; no se testean componentes en 001

## R5: Formato de export `envs` (camelCase)

**Decision**: Transform Zod de `VITE_*` → `{ apiUrl, shopUrl, logoUrl, whatsappNum }`.

**Rationale**: Clarify Q5; consumo limpio en JSX; `shopUrl` reservado para feature futura.

**Alternatives considered**:

- Mantener nombres `VITE_*` en objeto — rechazado en clarify
- Named exports sueltos — rechazado en clarify

## R6: Validación de URLs y WhatsApp

**Decision**:

- `VITE_SHOP_URL`, `VITE_LOGO_URL`: `z.string().url()` (http/https)
- `VITE_WHATSAPP_NUM`: regex `^\d{7,15}$` (consistente con `OnValidateOrder.js`)

**Rationale**: Fail-fast temprano; evita URLs malformadas en producción.

**Alternatives considered**:

- Solo `.min(1)` sin `.url()` — rechazado; menor seguridad de config

## R7: Fail-fast en build vs runtime

**Decision**: Fail-fast al **importar** `env.js` (dev y build), porque Vite evalúa el módulo
durante `vite build` con env de CI/Vercel.

**Rationale**: SC-003; bundle no debe generarse con config inválida si el import es estático
(desde `apiClient` → cadena de imports al bootstrap).

**Alternatives considered**:

- Validar solo en runtime post-mount — rechazado; permite bundle roto en Vercel
