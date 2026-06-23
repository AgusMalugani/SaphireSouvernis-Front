# Feature Specification: Operaciones de pedidos — admin y post-compra (Frontend)

**Feature Branch**: `005-orders-operations-overhaul`

**Created**: 2026-06-19

**Status**: Ready

**Input**: Overhaul del módulo de órdenes en el panel admin y la página post-compra:
corregir estado `inProcess`, labels en español para el usuario, ruta canónica
`/post-shop/:id`, WhatsApp en confirmación, listado admin con filtros en servidor,
timeline + notas internas, y edición segura de pedidos. Solo frontend; backend en
fase posterior.

**Repo**: `SaphireSouvernis-Front` únicamente.

## Contexto técnico (referencia)

### Estado actual

| Área | Situación |
|------|-----------|
| Estado pago | Backend: `inProcess`, `partialPayment`, `paid`. Front: typo `inProcces` en filtros, badges y edición → filtro no matchea pedidos reales. |
| Labels UI | Mapas duplicados en `Order.jsx`, `ViewBuyOrder.jsx`, `EditOrder.jsx`, `Orders.jsx`; mezcla "Sin pagar" vs valor `inProcess`. |
| Ruta post-compra | Hoy `/postShop/:id` (camelCase) en `App.jsx`, `ModalCreateOrder.jsx`, README. |
| PostShop | Copy pide WhatsApp sin CTA; `ModalCreateOrder` pasa `location.state` sin consumir. |
| Listado admin | `Orders.jsx` filtra solo en cliente; `FindAllOrders` sin query params; sin paginación. |
| API listado hoy | `GET /orders` devuelve array plano sin `orderDetails.product`. |
| Detalle | `ViewBuyOrder` compartido admin/público sin separación de datos sensibles. |
| Edición | `EditOrder` envía objeto orden completo del contexto (puede incluir `orderDetails`). |
| Constitución | Documentaba `inProcces` como typo legacy — **esta feature lo corrige con SDD explícito**. |

### Componentes involucrados

- `src/views/PostShop.jsx`, `src/views/ViewOrders.jsx`
- `src/components/Orders/*`
- `src/contexts/Orders/OrdersProvider.jsx`
- `src/services/Orders/*`
- `src/components/RedirectToWhatsapp.jsx`
- `src/App.jsx`

## Clarifications

### Session 2026-06-19

- Q: ¿Ruta post-compra canónica? → A: **`/post-shop/:id`** (kebab-case). Legacy
  **`/postShop/:id`** redirige con `Navigate replace`.
- Q: ¿Label para `inProcess`? → A: **"En proceso"** (no "Sin pagar").
- Q: ¿Mostrar enums al usuario? → A: **Nunca**; solo texto español vía config central.
- Q: ¿Migrar `shopProducts`? → A: **No** en v1; solo `post-shop`.
- Q: ¿Timeline en GET público? → A: **No**; solo variante admin o endpoint admin futuro.
- Q: ¿Backend en esta feature? → A: **No**; adaptador legacy + contrato documentado.
- Q: ¿Paginación default? → A: `page=1`, `limit=20`, `sort=createAt`, `order=desc`.
- Q: ¿Capitalización labels? → A: Primera mayúscula por palabra significativa:
  "En proceso", "Señado", "Pagado", "Envío", "Retiro en local".
- Q: ¿Template mensaje WhatsApp? → A: **Detallado (B)** — saludo, ID, nombre,
  total, fecha entrega, link `/post-shop/:id`, lista `Producto × cantidad` (una línea
  por ítem), tema del evento si existe. Sin estado de pago ni tipo de entrega en v1.
- Q: ¿Filtros con API legacy (sin query params)? → A: **Híbrido (A)** — siempre
  enviar query params al API; si la respuesta es array legacy, normalizar y aplicar
  filtros, búsqueda y paginación en cliente hasta backend nuevo.
- Q: ¿Base URL del link WhatsApp? → A: **`envs.shopUrl`** (VITE_SHOP_URL) +
  `/post-shop/:id`; normalizar `shopUrl` sin slash final antes de concatenar.
- Q: ¿Timeline sin backend de eventos? → A: **Optimista (A)** — tras PUT exitoso,
  agregar evento local en timeline del modal (labels español); backend futuro
  reemplaza/complementa.
- Q: ¿Notas internas v1? → A: **Solo agregar (A)** — append cronológico; sin
  editar ni borrar notas en v1.

### Mapa de labels UI (canónico v1)

| Valor API (interno) | Label visible (español) |
|---------------------|-------------------------|
| `inProcess` | En proceso |
| `partialPayment` | Señado |
| `paid` | Pagado |
| `send` | Envío |
| `withdraw` | Retiro en local |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estados correctos y labels en español (Priority: P1)

Como administrador o cliente, quiero ver el estado del pedido siempre en español
claro ("En proceso", "Pagado", etc.) y que los filtros admin funcionen con el
valor real del backend, para operar sin confusión ni filtros vacíos.

**Why this priority**: Bug activo (`inProcces`) y copy inconsistente afectan admin
y post-compra.

**Independent Test**: Pedido nuevo → filtrar "En proceso" en admin → visible;
detalle y badges nunca muestran `inProcess` ni `inProcces`.

**Acceptance Scenarios**:

1. **Given** pedido con `state: inProcess`, **When** admin filtra por "En proceso",
   **Then** el pedido aparece en el listado.
2. **Given** cualquier pantalla de órdenes, **When** se muestra estado al usuario,
   **Then** el texto es español desde config central (nunca el enum crudo).
3. **Given** código en `src/`, **When** se busca `inProcces`, **Then** 0 ocurrencias.
4. **Given** badge en tarjeta, **When** estado es `inProcess`, **Then** label es
   "En proceso" con estilos del design system.

---

### User Story 2 - Post-compra en `/post-shop/:id` + legacy (Priority: P1)

Como cliente, quiero una URL clara en kebab-case tras comprar, y que links viejos
en camelCase sigan funcionando.

**Why this priority**: Mejora URLs y compatibilidad con emails ya enviados.

**Independent Test**: Checkout → `/post-shop/:id`; abrir `/postShop/:id` → redirect.

**Acceptance Scenarios**:

1. **Given** checkout exitoso, **When** navega el front, **Then** URL es `/post-shop/:id`.
2. **Given** usuario abre `/postShop/:id`, **When** carga la app, **Then** redirect
   a `/post-shop/:id` con `replace`.
3. **Given** usuario en `/post-shop/:id`, **When** página carga, **Then** FAB global
   WhatsApp está oculto (comportamiento actual preservado).
4. **Given** README y rutas documentadas, **When** se consulta, **Then** canónica
   es `/post-shop/:id`.

---

### User Story 3 - WhatsApp en PostShop (Priority: P1)

Como cliente, después de crear mi pedido quiero un botón de WhatsApp con mensaje
prearmado para coordinar pago y personalización sin reescribir todo.

**Why this priority**: Cierra el flujo de negocio manual actual.

**Independent Test**: Crear pedido → `/post-shop/:id` → CTA → `wa.me` con datos del pedido.

**Acceptance Scenarios**:

1. **Given** pedido recién creado, **When** usuario está en PostShop, **Then** ve
   botón "Contactar por WhatsApp" (`RedirectToWhatsapp`, variant block).
2. **Given** click en CTA, **When** abre WhatsApp, **Then** mensaje detallado incluye:
   saludo, ID pedido, nombre cliente, total, fecha entrega, link `/post-shop/:id`,
   tema del evento (si existe), y lista de productos con formato `Nombre × cantidad`
   (una línea por ítem). No incluye estado de pago ni tipo de entrega en v1.
3. **Given** refresh de la página (sin `location.state`), **When** carga detalle
   vía API, **Then** mensaje WhatsApp se arma desde datos fetchados.
4. **Given** configuración, **When** se usa número WhatsApp, **Then** proviene de
   `envs.whatsappNum` (no `import.meta.env` directo).
5. **Given** link al pedido en mensaje, **When** se construye URL, **Then** usa
   `{envs.shopUrl}/post-shop/:id` (shopUrl sin `/` final).

---

### User Story 4 - Listado admin con filtros en servidor (Priority: P2)

Como administrador, quiero buscar y filtrar pedidos en el servidor con paginación
y ver productos en cada tarjeta, sin filtrar todo en memoria.

**Why this priority**: Escala operación; prepara integración backend.

**Independent Test**: Cambiar filtro → refetch; backend legacy → adaptador no rompe UI.

**Acceptance Scenarios**:

1. **Given** admin autenticado, **When** cambia filtro estado o tipo entrega,
   **Then** `GET /orders` incluye query params y actualiza listado.
2. **Given** búsqueda con debounce (~400ms), **When** usuario escribe, **Then**
   refetch con `q` y página resetea a 1.
3. **Given** respuesta `{ data, meta }`, **When** hay más páginas, **Then** UI
   muestra controles y total desde `meta.total`.
4. **Given** respuesta legacy (array), **When** normaliza adaptador, **Then** UI
   funciona sin error y aplica filtros/búsqueda/paginación en cliente (modo híbrido).
5. **Given** orden con `orderDetails.product`, **When** renderiza tarjeta,
   **Then** muestra nombres de productos compactos.
6. **Given** contador de resultados, **When** hay filtros, **Then** muestra total
   desde meta (ej. "12 órdenes encontradas") — meta calculada en legacy si aplica.

---

### User Story 5 - Timeline y notas internas (admin) (Priority: P2)

Como administrador, quiero historial de cambios y notas internas en el detalle,
sin exponerlos al cliente en post-compra.

**Why this priority**: Trazabilidad operativa entre admins.

**Independent Test**: Modal "Ver" admin muestra timeline + notas; `/post-shop/:id` no.

**Acceptance Scenarios**:

1. **Given** admin abre "Ver", **When** carga detalle admin, **Then** ve timeline
   y sección de notas internas.
2. **Given** admin agrega nota, **When** guarda, **Then** llama `POST /orders/:id/notes`
   (o muestra error claro si 404) y la nota se agrega a la lista (append-only).
3. **Given** cliente en `/post-shop/:id`, **When** ve detalle público, **Then** no
   ve timeline ni `adminNotes`.
4. **Given** endpoint admin no desplegado, **When** abre timeline, **Then** mensaje
   informativo sin datos mock.
5. **Given** admin cambia estado o envío y PUT OK, **When** timeline visible,
   **Then** aparece evento optimista local con labels español hasta sync backend.

---

### User Story 6 - Edición segura de pedido (Priority: P2)

Como administrador, al cambiar pago o entrega el sistema debe enviar solo campos
editados, no la orden completa.

**Why this priority**: Evita payloads incorrectos; alinea con timeline futuro.

**Independent Test**: Cambiar estado → PUT body solo `{ state }`.

**Acceptance Scenarios**:

1. **Given** acción "Pago", **When** admin guarda, **Then** PUT envía solo `state`
   (valor enum, label español solo en UI).
2. **Given** acción "Envío", **When** admin guarda, **Then** PUT envía solo
   `transactionType` y `address` cuando aplique.
3. **Given** edición exitosa, **When** vuelve al listado, **Then** tarjeta refleja
   nuevo estado con label español.
4. **Given** edición exitosa con modal Ver abierto, **When** PUT completa,
   **Then** timeline recibe evento optimista (state o transaction).

---

### User Story 7 - Config centralizada testeable (Priority: P2)

Como equipo, quiero un módulo único para estados y tipos de entrega con tests
Vitest, evitando mapas duplicados.

**Why this priority**: Previene regresión del typo y divergencia de labels.

**Independent Test**: `npm test` pasa tests de `orderStatusConfig` y helpers relacionados.

**Acceptance Scenarios**:

1. **Given** `orderStatusConfig.js`, **When** componentes importan labels/badges,
   **Then** no hay mapas locales duplicados de estado/transacción.
2. **Given** valor desconocido del API, **When** se pide label, **Then** fallback
   "Estado desconocido" / "Tipo desconocido" sin exponer enum.

---

### Edge Cases

- Pedido no encontrado en `/post-shop/:id` → mensaje amigable + link inicio.
- Token admin expirado en `/orders` → sin crash; lista vacía o flujo login existente.
- `q` vacío → no romper refetch; omitir param o enviar vacío sin error cliente.
- Orden sin `orderDetails` → detalle y WhatsApp sin lista de productos.
- `orderDet.product` null → fallback seguro en imagen/nombre.
- Filtros + página 2 → al cambiar filtro, volver a página 1.
- API admin 404 → timeline/notas con copy graceful.
- Valor estado futuro no mapeado → fallback label sin mostrar string técnico.
- `shopUrl` con trailing slash → normalizar antes de armar link WhatsApp.
- Backend ignora query params → modo híbrido filtra en cliente sin romper UI.
- Nota vacía en textarea → no enviar POST; toast validación.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MUST eliminar `inProcces`; valor canónico interno: `inProcess`.
- **FR-002**: MUST centralizar estados en `src/utils/orders/orderStatusConfig.js`
  (+ tipo entrega en mismo módulo o `orderTransactionConfig.js`).
- **FR-003**: MUST mostrar labels en español al usuario; prohibido enum crudo en UI.
- **FR-004**: `inProcess` MUST mostrarse como **"En proceso"** (no "Sin pagar").
- **FR-005**: Ruta canónica MUST ser **`/post-shop/:id`**.
- **FR-006**: MUST existir redirect **`/postShop/:id` → `/post-shop/:id`** (`replace`).
- **FR-007**: `PostShop.jsx` MUST renderizar `RedirectToWhatsapp` (variant block).
- **FR-008**: MUST existir `buildWhatsAppOrderMessage` (pura + Vitest) con link
  `${normalizeShopUrl(envs.shopUrl)}/post-shop/${id}`, textos en español y template
  **detallado (B)**: saludo, ID, nombre, total, fecha entrega, tema (si existe),
  lista `Producto × cantidad` por línea. Sin estado de pago ni tipo de entrega en v1.
- **FR-009**: Mensaje WhatsApp MUST funcionar tras refresh vía `OneOrder`.
- **FR-010**: `FindAllOrders` MUST aceptar filtros query y retornar shape normalizado.
- **FR-011**: MUST existir `normalizeOrdersListResponse` (pura + Vitest) para legacy;
  modo **híbrido (A)**: si respuesta es array, filtrar/paginar en cliente tras normalizar.
- **FR-011b**: MUST existir `filterOrdersClientSide` (pura + Vitest) para legacy:
  state, transactionType, q, sort, page, limit.
- **FR-012**: `OrdersProvider` MUST exponer orders, meta, filters, fetch, loading, error.
- **FR-013**: `Orders.jsx` MUST refetch server-side; debounce en búsqueda.
- **FR-014**: `Order.jsx` MUST mostrar productos cuando `orderDetails.product` exista.
- **FR-015**: `ViewBuyOrder` MUST soportar `variant="public" | "admin"` (default public).
- **FR-016**: Variante admin MUST incluir `OrderTimeline` + `AdminOrderNotes`.
- **FR-016b**: Timeline MUST soportar eventos **optimistas** tras PUT exitoso (A).
- **FR-016c**: Notas MUST ser **append-only** en v1; sin editar/borrar.
- **FR-017**: Servicios `FindOrderAdmin`, `AddOrderNote` MUST usar `apiClient`.
- **FR-018**: `EditOrder` MUST enviar payload mínimo en PUT.
- **FR-019**: MUST usar `apiClient` y `envs`; prohibido `fetch` e `import.meta.env` en UI.
- **FR-020**: MUST NOT modificar `SaphireSouvenirs-Back` en esta feature.
- **FR-021**: Tests Vitest para `orderStatusConfig`, `buildWhatsAppOrderMessage`,
  `normalizeOrdersListResponse`, `filterOrdersClientSide`.

### Contrato API objetivo (backend futuro — referencia)

```
GET /orders?state=&transactionType=&q=&page=1&limit=20&sort=createAt&order=desc
→ { data: Order[], meta: { total, page, limit, totalPages } }
  (Order incluye orderDetails[].product: id, name, img_url mínimo)

GET /orders/:id          → detalle público (sin adminNotes, sin timeline)
GET /orders/:id/admin    → detalle + timeline[] + adminNotes
POST /orders/:id/notes   → { note: string }
PUT /orders/:id          → parcial (state | transactionType + address)
```

**Timeline event** (referencia): `{ id, type, payload, createdAt, createdBy? }`  
**Types**: `created` | `state_changed` | `transaction_changed` | `admin_note_added`

### Key Entities (UI / front)

- **OrderStatusConfig**: valor enum → label español, badge className, select options.
- **OrderTransactionConfig**: `send` | `withdraw` → labels español.
- **OrderListFilters**: state, transactionType, q, page, limit, sort, order.
- **OrderListResponse**: `{ data, meta }` normalizado.
- **OrderTimelineEvent**: evento de auditoría para UI admin.
- **WhatsAppOrderMessage**: texto generado para CTA.

## Success Criteria *(mandatory)*

- **SC-001**: Filtro "En proceso" muestra 100% de pedidos `inProcess` (manual).
- **SC-002**: `grep inProcces src/` → 0 ocurrencias.
- **SC-003**: 0 pantallas muestran enum crudo (`inProcess`, `paid`, etc.) al usuario final.
- **SC-004**: Checkout navega a `/post-shop/:id`; `/postShop/:id` redirige correctamente.
- **SC-005**: CTA WhatsApp funcional en ≤ 2 clics desde post-compra.
- **SC-006**: Refresh en `/post-shop/:id` mantiene WhatsApp operativo.
- **SC-007**: Filtros admin disparan refetch; legacy array no rompe UI.
- **SC-008**: PostShop no muestra timeline/notas; modal Ver admin sí (o vacío graceful).
- **SC-009**: PUT edición sin `orderDetails` en body (verificable en red).
- **SC-010**: Tests unitarios nuevos en `src/utils/orders/` pasan con `npm test`.

## Assumptions

- Backend actual devuelve array en `GET /orders` hasta fase backend.
- `POST /orders` y `GET /orders/:id` públicos sin cambios en esta fase.
- Un rol `admin`; sin permisos granulares en UI.
- Mensaje WhatsApp en español rioplatense.
- Paginación offset suficiente para volumen actual.
- `RedirectToWhatsapp` existente; no rediseñar FAB global.
- Constitución front: Context API, Tailwind v4, react-icons, design system Saphire.
- Deploy front puede preceder al backend; adaptador híbrido cubre transición.
- **`envs.shopUrl`** es primer consumidor UI en esta feature (link WhatsApp).

## Out of Scope

- Cambios en `SaphireSouvenirs-Back` (auth, entidades, email templates).
- Migración `/shopProducts` → `/shop-products`.
- Kanban, pagos online, email al admin, SMS.
- Edición de líneas del pedido (productos/cantidades).
- Soft delete / cancelación formal.
- Tests e2e / Playwright.
- `CartContext` o refactor carrito shop.
- Cambiar enum de estados en backend.
- Sidebar en `/orders` (mejora futura).

## Dependencias backend (fase posterior)

| Endpoint / cambio | Prioridad | Notas |
|-------------------|-----------|-------|
| `GET /orders` query + paginación + productos | Alta | Contrato en spec |
| Auth `GET/PUT /orders` admin | Alta | Seguridad |
| `GET /orders/:id/admin` | Media | Timeline + notas |
| `POST /orders/:id/notes` | Media | Notas internas |
| Timeline auto en PUT | Media | Eventos server-side |
| Email CTA `{URL_CLIENT}/post-shop/{id}` | Media | Tras deploy front |

## Archivos previstos (implementación)

**Crear**

- `src/utils/orders/orderStatusConfig.js` + `.test.js`
- `src/utils/orders/buildWhatsAppOrderMessage.js` + `.test.js`
- `src/utils/orders/normalizeOrdersListResponse.js` + `.test.js`
- `src/utils/orders/filterOrdersClientSide.js` + `.test.js`
- `src/components/Orders/OrderTimeline.jsx`
- `src/components/Orders/AdminOrderNotes.jsx`
- `src/services/Orders/FindOrderAdmin.js`
- `src/services/Orders/AddOrderNote.js`

**Modificar**

- `src/App.jsx`
- `src/views/PostShop.jsx`
- `src/components/Orders/ModalCreateOrder.jsx`
- `src/components/Orders/Orders.jsx`, `Order.jsx`, `ViewBuyOrder.jsx`, `EditOrder.jsx`
- `src/components/Orders/ModalActionOrder.jsx` (si aplica)
- `src/contexts/Orders/OrdersProvider.jsx`
- `src/services/Orders/FindAllOrders.js`
- `README.md`
