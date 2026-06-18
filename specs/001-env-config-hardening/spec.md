# Feature Specification: Hardening de configuración de entorno del frontend

**Feature Branch**: `001-env-config-hardening`

**Created**: 2026-06-18

**Status**: Ready

**Input**: User description: "Hardening de configuración de entorno del frontend:
centralizar variables VITE_* en módulo único; prohibir import.meta.env directo en src/;
VITE_API_URL con prefijo /api/v1; alinear WhatsApp; VITE_SHOP_URL en contrato sin uso UI;
tests Vitest; actualizar .env.example; quickstart manual."

## Clarifications

### Session 2026-06-18

- Q: ¿Qué hacer si `VITE_API_URL` no termina en `/api/v1`? → A: Fail-fast con mensaje de error explícito al cargar el módulo de configuración.
- Q: ¿Fail-fast solo si falta la variable o también si es string vacío? → A: Fail-fast en ambos casos (ausente o `""`).
- Q: ¿Cómo validar las variables obligatorias? → A: Schema Zod en el módulo centralizado (paridad conceptual con backend `envs.ts`).
- Q: ¿Alcance mínimo de tests Vitest? → A: Matriz completa — caso feliz, variable faltante, string vacío, `VITE_API_URL` sin `/api/v1`, con mensaje de error identificable; función pura testeable con mocks (sin montar React).
- Q: ¿Superficie del módulo exportado? → A: `export const envs` con propiedades camelCase (`apiUrl`, `shopUrl`, `logoUrl`, `whatsappNum`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Arranque predecible con configuración completa (Priority: P1)

Como desarrollador local, necesito que la aplicación cliente arranque con todas las
variables de entorno obligatorias resueltas desde un único punto de configuración,
para evitar pantallas rotas, llamadas a API contra URLs indefinidas o assets sin
cargar por olvidar una variable en `.env`.

**Why this priority**: Sin `VITE_API_URL` válida, todas las peticiones fallan; es el
riesgo operativo más grave del frontend hoy.

**Independent Test**: Configurar un `.env` completo según `.env.example`, iniciar
`npm run dev` y verificar que catálogo, logo y WhatsApp cargan sin errores de config
en consola.

**Acceptance Scenarios**:

1. **Given** un `.env` con las cuatro variables obligatorias definidas, **When** la
   aplicación arranca, **Then** `envs` expone valores no vacíos para API, shop URL,
   logo y WhatsApp.
2. **Given** falta una variable obligatoria o está definida como string vacío (`""`),
   **When** el módulo de configuración se evalúa, **Then** la aplicación falla de
   forma explícita con un mensaje que indica qué variable es inválida (fail-fast).
3. **Given** `.env.example` actualizado, **When** un desarrollador nuevo copia la
   plantilla, **Then** puede configurar el entorno sin leer código fuente para
   descubrir nombres de variables.

---

### User Story 2 - API alineada al backend NestJS (Priority: P2)

Como desarrollador u operador, necesito que la URL base del API incluya el prefijo
`/api/v1` acordado con el backend, para que las rutas relativas (`/products`,
`/orders`, `/auth/signin`) resuelvan correctamente en local y en Vercel.

**Why this priority**: Hoy `.env.example` documenta la base sin prefijo; el backend
expone `api/v1` globalmente — desalineación que provoca 404 silenciosos o errores de
red.

**Independent Test**: Con `VITE_API_URL` apuntando a `.../api/v1`, abrir la tienda y
confirmar que el listado de productos carga desde el backend (o fallback documentado si
el backend no está disponible).

**Acceptance Scenarios**:

1. **Given** `VITE_API_URL=http://localhost:3000/api/v1`, **When** el cliente
   solicita productos, **Then** la petición targetea `/api/v1/products` en el host
   configurado.
2. **Given** `.env.example` revisado, **When** un operador configura producción,
   **Then** el ejemplo muestra explícitamente el sufijo `/api/v1` en la URL del API.
3. **Given** `VITE_API_URL=http://localhost:3000` (sin `/api/v1`), **When** el módulo
   de configuración se evalúa, **Then** falla con mensaje explícito (fail-fast).

---

### User Story 3 - WhatsApp y assets desde config centralizada (Priority: P3)

Como visitante del sitio, necesito que el número de WhatsApp y el logo sean
consistentes en todas las secciones (navbar, footer, FAB global, página Quiénes Somos),
usando el mismo valor oficial del negocio definido en configuración.

**Why this priority**: Existe un número hardcodeado distinto en la sección hero de
Quiénes Somos respecto a `VITE_WHATSAPP_NUM` (oficial: 3417120039).

**Independent Test**: Navegar Home, Footer, FAB y `/about-us`; verificar que todos los
enlaces WhatsApp usan el número de la config centralizada.

**Acceptance Scenarios**:

1. **Given** `VITE_WHATSAPP_NUM=3417120039`, **When** el usuario abre el enlace
   WhatsApp desde cualquier componente migrado, **Then** el número en la URL coincide
   con el valor configurado (prefijo país 549 aplicado según convención actual).
2. **Given** ningún componente migrado, **When** se busca `import.meta.env` en `src/`,
   **Then** no quedan referencias directas — solo imports de `envs` desde
   `src/config/env.js`.

---

### Edge Cases

- ¿Qué ocurre si `VITE_API_URL` no termina en `/api/v1`? Fail-fast con mensaje
  explícito; no se normaliza ni auto-append del sufijo.
- ¿Qué ocurre si una variable obligatoria está ausente o es string vacío? Fail-fast
  vía validación Zod con mensaje identificable por variable.
- ¿Qué ocurre si `VITE_SHOP_URL` está definida pero no se usa en UI? Debe exportarse
  en `envs.shopUrl` para contrato futuro; no debe romper arranque.
- ¿Qué ocurre en build de Vercel sin una variable? El build o el bootstrap del cliente
  debe fallar con mensaje claro, no generar bundle con `undefined` silencioso.
- ¿Qué ocurre si el backend no responde? Comportamiento de fallback de catálogo
  (`products.js`) permanece fuera de alcance de esta feature — no debe regresionar.
- ¿Qué ocurre con variables de marketing (Instagram, hero, favicon)? Permanece
  hardcode hasta feature SDD dedicada; no se migran en 001.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST centralizar `VITE_API_URL`, `VITE_SHOP_URL`,
  `VITE_LOGO_URL` y `VITE_WHATSAPP_NUM` en `src/config/env.js`, validadas con schema
  Zod, y exportar `export const envs` con propiedades camelCase: `apiUrl`, `shopUrl`,
  `logoUrl`, `whatsappNum`.
- **FR-002**: Queda prohibido usar `import.meta.env` directamente en cualquier archivo
  bajo `src/` tras esta feature; todos los consumidores actuales MUST migrar a `envs`.
- **FR-003**: `VITE_API_URL` MUST documentarse en `.env.example` incluyendo el prefijo
  `/api/v1` (ej. `http://localhost:3000/api/v1`).
- **FR-004**: El módulo centralizado MUST aplicar fail-fast (Zod) cuando falte una
  variable obligatoria, cuando sea string vacío, o cuando `VITE_API_URL` no termine en
  `/api/v1`; el mensaje MUST identificar la variable o regla incumplida.
- **FR-005**: `VITE_SHOP_URL` MUST exportarse como `envs.shopUrl` y permanecer en
  `.env.example` aunque su consumo en UI o mensajes WhatsApp post-compra quede
  diferido.
- **FR-006**: El componente de Quiénes Somos (`HeaderQuienSomos`) MUST dejar de usar
  el número WhatsApp hardcodeado y MUST usar `envs.whatsappNum` (oficial: `3417120039`
  vía env).
- **FR-007**: Los cinco puntos de consumo con `import.meta.env` MUST migrar a `envs`:
  `apiClient.js`, `App.jsx`, `Navbar.jsx`, `Footer.jsx`, `AboutUs.jsx`.
- **FR-008**: La feature MUST incluir tests unitarios Vitest de la función pura de
  resolución/validación (mocks de `import.meta.env`): caso feliz, variable faltante,
  string vacío, `VITE_API_URL` sin `/api/v1`; cada fallo MUST assertar mensaje
  identificable; sin montar React.
- **FR-009**: `.env.example` MUST actualizarse; `.env` real MUST NOT commitearse.
- **FR-010**: El comportamiento funcional visible (catálogo, login admin, pedidos,
  modales) MUST permanecer equivalente salvo corrección de URL API y WhatsApp.
- **FR-011**: La dependencia `zod` MUST agregarse al proyecto para el schema de env
  (única dependencia nueva de runtime para esta feature).

### Key Entities

- **Configuración de runtime del cliente (`envs`)**: Objeto exportado con `apiUrl`,
  `shopUrl`, `logoUrl`, `whatsappNum` — derivado de `VITE_*` validadas por Zod.
- **Variable obligatoria**: Entrada `VITE_*` requerida, no vacía, con reglas adicionales
  para `VITE_API_URL` (sufijo `/api/v1`); incumplimiento provoca fail-fast.
- **Variable en contrato diferido**: `shopUrl` — presente en `envs`, sin consumidor UI
  en esta entrega.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 referencias a `import.meta.env` en `src/` tras la implementación
  (verificable por búsqueda estática).
- **SC-002**: 100% de los cinco consumidores legacy importan exclusivamente `envs`
  desde `src/config/env.js`; `HeaderQuienSomos` usa `envs.whatsappNum`.
- **SC-003**: Con `.env` incompleto (variable faltante, vacía, o API sin `/api/v1`),
  100% de intentos de arranque/build relevantes fallan con mensaje explícito antes de
  render útil.
- **SC-004**: 100% de enlaces WhatsApp en componentes migrados usan `envs.whatsappNum`,
  no valores hardcodeados alternos.
- **SC-005**: Un desarrollador nuevo configura el entorno local siguiendo solo
  `.env.example` en menos de 10 minutos.
- **SC-006**: La matriz de tests Vitest documentada en FR-008 pasa con un solo comando
  de test documentado en `quickstart.md`.
- **SC-007**: Tras desplegar en Vercel con variables configuradas, la tienda carga
  productos cuando el backend está disponible (validación manual en quickstart).

## Assumptions

- **Plataforma**: Deploy en Vercel; variables `VITE_*` se configuran en el panel de
  Vercel para producción.
- **Backend**: NestJS con prefijo global `api/v1`; paths en services del frontend
  permanecen relativos (`/products`, etc.).
- **WhatsApp oficial**: `3417120039` (sin prefijo de país en env; prefijo `549` se
  aplica en UI como hoy).
- **Módulo de config**: Archivo `src/config/env.js`; export `envs` (camelCase); validación
  Zod al import del módulo.
- **Validación API URL**: Fail-fast si no termina en `/api/v1`; sin auto-append.
- **Constitución**: Cumple principios II (config centralizada), VII (Vitest) y workflow
  SDD del frontend.

## Out of Scope

- Consumo de `VITE_SHOP_URL` en PostShop o mensajes WhatsApp post-compra (feature
  futura).
- Migración a variables de entorno de Instagram, imágenes hero, favicon en `index.html`
  u otros assets de marketing.
- Cambios en contratos API backend o envelope `{ data: T }`.
- Migración a TypeScript.
- Pipeline CI/CD con gates automáticos.
- Tests e2e o Playwright smoke (solo unitarios Vitest + quickstart manual en 001).
