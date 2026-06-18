<!--
Sync Impact Report
- Version change: template (unratified) → 1.0.0
- Modified principles: placeholder template → 8 principios ratificados (I–VIII)
- Added sections: Restricciones Técnicas, Workflow SDD, Prohibitions, AI Protocol
- Removed sections: ninguna (plantilla reemplazada)
- Templates: ✅ tasks-template.md (tests Vitest obligatorios) | ⚠ plan-template.md (Constitution Check genérico, sin cambios) | ⚠ spec-template.md (sin cambios estructurales)
- Runtime guidance: ✅ .cursor/SaphireSouvenirs-Frontend-Rules.mdc (alineación env centralizado + design system)
- Follow-up TODOs: feature 001-env-config-hardening; extracción de URLs de marketing a env; consumo de VITE_SHOP_URL en feature futura
-->

# Constitución del Proyecto — SaphireSouvenirs-Front

SPA React (Vite) para e-commerce de souvenirs personalizados — catálogo público,
pedidos y panel administrativo.

## Core Principles

### I. HTTP Centralizado (`apiClient`)

Toda comunicación con el backend MUST pasar por `src/services/apiClient.js`.
Queda prohibido usar `fetch` directamente en `views/`, `components/`, `contexts/`
o fuera de `apiClient.js`.

Los módulos en `src/services/` MUST delegar en `apiClient` (get, post, put, delete,
postFormData). El token JWT MUST inyectarse solo vía `apiClient`; prohibido pasar
`token` como argumento en services.

**Rationale:** Un solo punto de auth, headers y manejo de errores evita
inconsistencias y fugas de credenciales en la UI.

### II. Configuración Centralizada

Queda prohibido usar `import.meta.env` directamente dentro de `src/`.
Toda variable `VITE_*` MUST accederse exclusivamente vía `src/config/env.js`.
Cambios MUST actualizar `.env.example`.

Variables de contrato actuales: `VITE_API_URL`, `VITE_SHOP_URL`, `VITE_LOGO_URL`,
`VITE_WHATSAPP_NUM`. URLs externas de marketing (Instagram, imágenes hero, favicon)
MUST declararse como `VITE_*` y consumirse vía el mismo módulo; la extracción de
hardcodes existentes se realiza en features SDD acordadas (no inline en otros cambios).

`VITE_API_URL` MUST incluir el prefijo `/api/v1` del backend (corrección en
`001-env-config-hardening`). `VITE_SHOP_URL` permanece en contrato de env; su uso
en UI/mensajes WhatsApp queda para feature futura documentada en `spec.md`.

**Rationale:** Fail-fast en arranque, contrato de env predecible y alineación con
el backend NestJS (`api/v1`).

### III. Arquitectura por Dominio

Estado global MUST usar Context API: `Auth`, `Products`, `Orders` (patrón actual).
Pantallas completas en `src/views/`; UI reutilizable en `src/components/` agrupada
por dominio. Lógica de API en `src/services/` (un archivo por operación/recurso).
Validaciones puras de formularios en `src/formValidations/`.

No se introducirán Redux, Zustand ni capas UseCase/Domain salvo aprobación explícita
en `plan.md`.

**Rationale:** El proyecto ya opera con Context + services; capas extra no aportan
en el alcance actual.

### IV. Routing y Seguridad Cliente

React Router Dom v7. Rutas administrativas MUST envolverse con `ProtectedRoute` y
`requiredRole="admin"`. JWT en `localStorage`; decodificación con `jwt-decode`.
Sin token, rol incorrecto o token inválido → redirect a `/` (comportamiento actual).

La seguridad de autorización real MUST permanecer en el backend; el frontend solo
aplica guardas de UX.

**Rationale:** RBAC client-side complementa, no reemplaza, los guards del API.

### V. Contratos API (Mixto Legacy)

El backend expone prefijo global `api/v1`. Consumo desde services con paths relativos
a `VITE_API_URL` (que incluye el prefijo).

- **Auth:** envelope `{ data: { token, ... } }` — consumir `response.data` (ej.
  `LoginSignin.jsx`).
- **Legacy (products, orders, categories):** respuesta directa (array/objeto) hasta
  que el backend estandarice módulo a módulo (política gradual alineada al back).

Features que integren endpoints nuevos MUST documentar en `plan.md` si esperan
envelope `{ data: T }` o formato legacy.

**Rationale:** Evita big-bang en integración mientras el backend migra contratos.

### VI. Design System Saphire (Tailwind v4)

Tailwind CSS v4 es el único mecanismo de estilo permitido (utility classes en JSX).
Config CSS-first en `App.css`; no se requiere `tailwind.config.js`.

Estética: minimalista, premium, rose-gold y glassmorphism. Títulos con `font-display`
(Playfair Display). Iconos con `react-icons` (Fi, Hi, Fa, Io). Prohibido reinstalar
`axios`, `bootstrap` o `react-bootstrap`.

**Rationale:** Consistencia visual y deuda de dependencias ya depurada.

### VII. Calidad Gradual con Vitest

La deuda de tests en código legacy queda ratificada y no bloquea entregas.
Features nuevas MUST incluir tests unitarios con Vitest; `plan.md` define alcance.
Bugfixes que toquen `services/`, `contexts/` o lógica crítica MUST incluir test
mínimo del cambio cuando aplique. Validación manual vía `quickstart.md` de la feature.
Sin umbral numérico de cobertura.

**Rationale:** Mejora incremental sin remediación masiva retroactiva.

### VIII. Simplicidad (YAGNI)

El codebase MUST permanecer en JSX/JS. Prohibida migración a TypeScript salvo
enmienda explícita de esta constitución. Sin abstracciones prematuras; hooks,
services y contexts son suficientes.

No revertir typos legacy documentados (`Siderbar/`, `inProcces`) sin feature SDD
explícita de alineación con backend.

**Rationale:** Mantener el stack actual legible y evitar churn innecesario.

## Restricciones Técnicas

- **Runtime:** React 19, Vite 6 (SWC), JSX, Node.js ≥ 18.
- **Deploy:** Vercel — SPA rewrites en `vercel.json`; build → `dist/`.
- **Lint:** ESLint 9 — `npm run lint`.
- **Persistencia cliente:** `localStorage` para `token`, cache de `products` y
  `categories`; fallback de catálogo vía `products.js` en raíz si falla la API.
- **Notificaciones / modales:** React Toastify, React Modal.
- **CI/CD:** sin gates obligatorios por ahora.
- **Guía operativa:** `.cursor/SaphireSouvenirs-Frontend-Rules.mdc` complementa esta
  constitución; en conflicto gana la regla más específica al dominio afectado cuando
  no contradiga principios fundamentales.

## Workflow SDD

Para cualquier cambio en el repositorio (incluido `src/`, config, docs,
`package.json`, `vite`, env):

1. `/speckit-specify` — definición funcional (`spec.md`)
2. `/speckit-clarify` — obligatorio antes de planificar
3. `/speckit-plan` — diseño técnico (`plan.md`) con Constitution Check
4. `/speckit-tasks` — checklist atómica (`tasks.md`)
5. `/speckit-analyze` — siempre obligatorio; no implementar con issues CRITICAL
6. `/speckit-implement` — ejecución guiada por `tasks.md`

**Layout de features:**

```text
specs/<###-feature-name>/
├── spec.md
├── plan.md
├── tasks.md
└── contracts/    # cuando aplique (Phase 1 del plan)
```

**Primera feature acordada:** `001-env-config-hardening` (módulo env, `/api/v1`,
alineación WhatsApp, contrato `VITE_SHOP_URL`).

## Prohibitions

- Usar `import.meta.env` directamente en `src/`
- Usar `fetch` fuera de `apiClient.js`
- Reinstalar `axios`, `bootstrap`, `react-bootstrap` o `dotenv`
- Hardcodear secrets, tokens o credenciales
- Hardcodear URLs externas que deban ser configurables (API, logo, WhatsApp, shop,
  Instagram, assets de marketing) — MUST ir a `VITE_*` vía `src/config/env.js`
- Escribir código sin `spec.md` + `plan.md` + `tasks.md` aprobados
- Saltar `/speckit-clarify` o `/speckit-analyze`
- Commitear `.env`
- Pasar `token` como argumento en services
- Introducir TypeScript sin enmienda de constitución
- Introducir Redux/Zustand o capas UseCase/Domain sin aprobación en `plan.md`
- Entregar features o bugfixes aplicables sin tests Vitest cuando corresponda
- Revertir typos legacy (`Siderbar/`, `inProcces`) sin feature SDD explícita

## AI Protocol

El agente MUST NOT modificar archivos del proyecto sin completar el workflow SDD.
No hay excepciones por tamaño del cambio ni por tipo de archivo (config, docs,
dependencias, una línea, etc.). Implementación y cambios de infraestructura solo
tras `tasks.md` aprobado y `/speckit-analyze` sin issues CRITICAL.

## Governance

- Cambios a esta constitución requieren aprobación explícita de Agustin Malugani.
- La constitución es la referencia de gobernanza SDD del repositorio.
- Reglas MDC más específicas prevalecen en su dominio cuando no contradigan
  principios fundamentales.
- **Versionado:** MAJOR para cambios incompatibles de gobernanza; MINOR para nuevos
  principios o secciones; PATCH para clarificaciones sin cambio semántico.
- **Cumplimiento:** Todo `plan.md` MUST incluir Constitution Check antes de Phase 0.

**Version**: 1.0.0 | **Ratified**: 2026-06-18 | **Last Amended**: 2026-06-18 | **Authority**: Agustin Malugani
