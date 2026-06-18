# Contract: Cliente Client Configuration

**Feature**: 001-env-config-hardening  
**Type**: Internal module contract (no HTTP API)

## Purpose

Define el comportamiento garantizado del módulo de configuración del frontend SPA.
Consumidores: `apiClient.js`, componentes UI, operadores (Vercel), tests Vitest.

## Input Contract

| Variable | Required | Validation |
|----------|----------|------------|
| `VITE_API_URL` | Yes | Non-empty string; MUST end with `/api/v1` |
| `VITE_SHOP_URL` | Yes | Non-empty valid URL |
| `VITE_LOGO_URL` | Yes | Non-empty valid URL |
| `VITE_WHATSAPP_NUM` | Yes | `^\d{7,15}$` |

Absent, `undefined`, or `""` for any required variable → **MUST** throw before app renders.

## Output Contract (`envs`)

| Field | Type | Source |
|-------|------|--------|
| `apiUrl` | string | Validated `VITE_API_URL` |
| `shopUrl` | string | Validated `VITE_SHOP_URL` |
| `logoUrl` | string | Validated `VITE_LOGO_URL` |
| `whatsappNum` | string | Validated `VITE_WHATSAPP_NUM` |

## Failure Matrix (parseClientEnv)

| Condition | Result |
|-----------|--------|
| All 4 vars valid; API ends with `/api/v1` | Returns `envs` object |
| Missing `VITE_*` key or empty string | Throw; message identifies field |
| `VITE_API_URL` without `/api/v1` suffix | Throw; message references `/api/v1` rule |
| Invalid URL for shop/logo | Throw; Zod URL error |
| Invalid WhatsApp format | Throw; regex validation error |

## Import Rules

| Rule | Guarantee |
|------|-----------|
| `import.meta.env` in `src/` | ONLY allowed in `src/config/env.js` |
| Public API | `import { envs } from '../config/env.js'` (path relative) |

## WhatsApp URL Convention (unchanged)

UI components MUST continue prefixing country code `549` when building `wa.me` links:
`https://wa.me/549${envs.whatsappNum}` (or equivalent template).

Official business number in env: `3417120039`.

## Versioning

Changes to required variables or validation rules require a new SDD feature and contract bump.
