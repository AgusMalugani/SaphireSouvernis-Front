# Feature Specification: Ciclo de vida de pagos y cancelación — panel admin y post-shop (Frontend)

**Feature Branch**: `007-order-payments-lifecycle`

**Created**: 2026-06-24

**Status**: Ready (clarify ✅ · plan ✅)

**Input**: Adaptar el módulo de pedidos del frontend al contrato backend
`005-order-payments-lifecycle`: pagos por **seña** (`depositAmount`), estado de pago
**derivado** (solo lectura en UI), **cancelación** (`state: cancelled`), timeline
ampliado, listado con filtro de cancelados, y post-shop ante pedidos no disponibles.
Solo frontend; backend ya implementado/desplegado.

**Repo**: `SaphireSouvernis-Front` únicamente.

**Depends on**: `SaphireSouvenirs-Back` feature `005-order-payments-lifecycle`.

## Contexto técnico (referencia)

### Estado actual (brecha post front-005)

| Área | Situación |
|------|-----------|
| Edición pago | `EditOrder.jsx` acción `estadoPago` envía `{ state: order.state }` — backend 005 rechaza `state` de pago manual (400) |
| Config estado | `orderStatusConfig.js` sin `cancelled`; `getOrderStateSelectOptions` alimenta select de pago obsoleto |
| Optimismo | `OrdersProvider.jsx` agrega `state_changed` tras cambio de pago — duplica con `payment_updated` del servidor |
| Timeline | `OrderTimeline.jsx` no renderiza `payment_updated`, `order_edited`, `order_cancelled` |
| Panel pedido | `Order.jsx` sin seña/saldo; botón "Pago" en lugar de "Registrar seña" |
| Post-shop | `PostShop.jsx` ante 404 puede mostrar datos provisionales del checkout; no distingue cancelado |
| Listado | `Orders.jsx` sin filtro `Cancelado` (`?state=cancelled`); default backend ya excluye cancelados |
| Edición integral | No existe UI para editar productos/datos cliente vía PUT integral (P2) |
| Cancelación | No existe modal/acción dedicada de cancelar pedido |

### Contratos de referencia

| Documento | Ubicación |
|-----------|-----------|
| API pagos (delta 005) | `SaphireSouvenirs-Back/specs/005-order-payments-lifecycle/contracts/orders-api-payments.md` |
| Smoke backend | `SaphireSouvenirs-Back/specs/005-order-payments-lifecycle/quickstart.md` |
| Baseline front pedidos | `SaphireSouvernis-Front/specs/005-orders-operations-overhaul/spec.md` |
| Cliente HTTP actual | `SaphireSouvernis-Front/specs/005-orders-operations-overhaul/contracts/orders-api-client.md` |

### Componentes involucrados

- `src/views/PostShop.jsx`
- `src/views/ViewOrders.jsx`
- `src/components/Orders/EditOrder.jsx`
- `src/components/Orders/Order.jsx`
- `src/components/Orders/Orders.jsx`
- `src/components/Orders/ViewBuyOrder.jsx`
- `src/components/Orders/OrderTimeline.jsx`
- `src/components/Orders/ModalActionOrder.jsx`
- `src/contexts/Orders/OrdersProvider.jsx`
- `src/utils/orders/orderStatusConfig.js`
- `src/services/Orders/EditOrderService.js` (misma URL; nuevo payload)
- **Nuevos sugeridos**: `CancelOrderModal.jsx`, util labels timeline pagos

## Clarifications

### Session 2026-06-24

- Q: ¿Admin elige estado de pago manualmente? → A: **No**. Solo ingresa monto de
  seña (`depositAmount` entero ARS). El backend deriva `inProcess` / `partialPayment` / `paid`.
- Q: ¿Cancelar y registrar seña en el mismo formulario? → A: **No**. Cancelación en
  modal/acción **dedicada**; requests PUT separadas.
- Q: ¿Mostrar `remainingBalance` en post-shop público? → A: **No** en v1. Post-shop
  sigue mostrando resumen cliente (total, productos, fechas); sin timeline/notas.
  Ante 404 (cancelado o inexistente): mensaje de no disponibilidad sin datos provisionales.
- Q: ¿Optimismo en timeline de pago? → A: **Eliminar** optimista `state_changed` para
  pago; tras PUT exitoso refetch `GET /orders/:id/admin` y limpiar optimistas de pago.
- Q: ¿Pedido legacy `partialPayment` sin `depositAmount`? → A: Sin migración automática;
  admin registra seña en primera edición; UI muestra campos del API.
- Q: ¿Notas en pedido cancelado? → A: **Sí** — `POST /orders/:id/notes` permitido;
  edición/seña **no**.
- Q: ¿Label `cancelled`? → A: **"Cancelado"**; badge gris/rojo suave; sin acciones de
  edición ni seña en tarjeta.
- Q: ¿Formato montos? → A: Reutilizar `formatProductPrice` (ARS, sin decimales).
- Q: ¿Numeración feature? → A: `007-order-payments-lifecycle` (tras `006-admin-inventory-table`).
- Q: ¿Semántica del input "Registrar seña" (total acumulado vs incremental)? → A: **Solo
  primera seña** — la acción "Registrar seña" aplica **una única vez** por pedido
  (típicamente desde `inProcess` con `depositAmount` 0). Cualquier ajuste posterior
  del monto abonado o del total se realiza al **editar el pedido** (edición integral),
  no reabriendo el formulario de seña.
- Q: ¿Post-shop ante 404 — mensaje cancelado vs inexistente? → A: **Solo genérico** —
  nunca inferir cancelación en UI pública; siempre copy "No encontramos este pedido"
  (mismo layout para cualquier 404 del GET público).
- Q: ¿Filtro "Cancelado" en MVP? → A: **P1** — incluir opción `Cancelado` en selector
  de estado en el mismo release que la acción cancelar pedido (`?state=cancelled`).
- Q: ¿Ubicación acción "Cancelar pedido"? → A: **Tarjeta** — botón en `Order.jsx`
  junto a Ver / Registrar seña / Envío; visible solo si `inProcess` \| `partialPayment`;
  abre `CancelOrderModal` dedicado.
- Q: ¿Timeline eventos 005 en MVP? → A: **P1 parcial** — renderizar `payment_updated` y
  `order_cancelled` en P1; `order_edited` queda **P2** con edición integral.

### Mapa de labels UI (canónico v1 — ampliación)

| Valor API (`state`) | Label visible (español) | Editable por admin |
|---------------------|-------------------------|-------------------|
| `inProcess` | En proceso | No (derivado) |
| `partialPayment` | Señado | No (derivado) |
| `paid` | Pagado | No (derivado) |
| `cancelled` | Cancelado | Solo vía acción cancelar (irreversible en UI v1) |

**Prohibido** enviar `inProcess` | `partialPayment` | `paid` en PUT.

### State machine (UI)

#### Derivación de pago (solo lectura)

| Condición (`depositAmount` vs `totalPrice`) | `state` esperado del API |
|---------------------------------------------|--------------------------|
| `depositAmount === 0` | `inProcess` |
| `0 < depositAmount < totalPrice` | `partialPayment` |
| `depositAmount >= totalPrice` | `paid` |

#### Cancelación

| Estado actual | Acción UI | PUT body | Resultado |
|---------------|-----------|----------|-----------|
| `inProcess` \| `partialPayment` | Cancelar pedido | `{ state: "cancelled", cancelReason? }` | `cancelled`; ausente en listado default |
| `paid` | Cancelar pedido | mismo | **409** — toast error, sin cambio UI |
| `cancelled` | Editar / seña | cualquier edición | **409** — solo lectura + notas |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registrar seña (Priority: P1)

Como administrador, quiero ingresar el monto de seña en pesos para que el sistema
actualice automáticamente el estado de pago y el saldo pendiente.

**Why this priority**: Es el flujo operativo diario de cobro; sin esto el panel
rompe contra el backend 005.

**Independent Test**: Abrir pedido `inProcess` → "Registrar seña" → ingresar monto
→ Network PUT solo `{ depositAmount }` → UI muestra Señado + saldo.

**Acceptance Scenarios**:

1. **Given** pedido `inProcess` con `totalPrice` 15000 y `depositAmount` 0,
   **When** admin confirma seña 5000, **Then** request es `PUT { depositAmount: 5000 }`
   sin campo `state`.
2. **Given** PUT exitoso, **When** UI actualiza, **Then** badge "Señado",
   `depositAmount` 5000, `remainingBalance` 10000.
3. **Given** seña igual al total, **When** PUT exitoso, **Then** badge "Pagado",
   `remainingBalance` 0.
4. **Given** monto > `totalPrice`, **When** admin intenta guardar, **Then** validación
   cliente y/o error 400 con mensaje claro; sin cambio optimista.
5. **Given** PUT exitoso, **When** admin abre timeline, **Then** evento `payment_updated`
   visible tras refetch admin (sin duplicar optimista `state_changed`).
6. **Given** pedido `cancelled`, **When** admin intenta registrar seña, **Then** acción
   deshabilitada u oculta; PUT devuelve 409 si se fuerza.
7. **Given** pedido con `depositAmount` > 0 (ya señado), **When** admin ve acciones,
   **Then** "Registrar seña" **no** está disponible; ajustes de monto vía edición del
   pedido (US7), no segundo registro de seña.
8. **Given** pedido `inProcess` con `depositAmount` 0, **When** admin registra seña,
   **Then** input es monto total de seña (único registro); PUT `{ depositAmount }` una sola vez.

---

### User Story 2 - Ver seña y saldo en panel (Priority: P1)

Como administrador, quiero ver seña abonada, total y saldo pendiente en el listado
y en el detalle del pedido.

**Why this priority**: Visibilidad financiera sin calcular manualmente.

**Independent Test**: Pedido señado → tarjeta en `/orders` y modal "Ver" muestran los
tres montos formateados ARS.

**Acceptance Scenarios**:

1. **Given** pedido con `depositAmount` > 0, **When** renderiza tarjeta en listado,
   **Then** muestra seña, total y saldo pendiente (`remainingBalance`).
2. **Given** detalle admin o público en modal Ver, **When** carga orden, **Then**
   mismos montos con `formatProductPrice`.
3. **Given** pedido `inProcess` sin seña, **When** renderiza, **Then** seña $0 y saldo
   = total (o copy equivalente claro).

---

### User Story 3 - Cancelar pedido (Priority: P1)

Como administrador, quiero cancelar un pedido en proceso o señado con motivo opcional,
en una acción separada de la seña.

**Why this priority**: Cierra el ciclo de vida; impacta listado y post-shop.

**Independent Test**: Cancelar pedido señado → desaparece del listado default → visible
con filtro Cancelado → post-shop 404.

**Acceptance Scenarios**:

1. **Given** pedido `inProcess` o `partialPayment`, **When** admin confirma cancelación
   en modal dedicado, **Then** `PUT { state: "cancelled", cancelReason?: "..." }`.
2. **Given** cancelación exitosa, **When** listado sin filtro estado, **Then** pedido
   no aparece.
3. **Given** filtro `Cancelado`, **When** aplica, **Then** solo pedidos `cancelled`.
4. **Given** pedido `paid`, **When** admin intenta cancelar, **Then** error 409 con
   mensaje "No se puede cancelar un pedido pagado" (o similar); UI sin cambio.
5. **Given** pedido `cancelled`, **When** admin ve tarjeta, **Then** badge "Cancelado",
   sin botones Registrar seña / Editar pago; notas admin siguen disponibles.
6. **Given** modal cancelar, **When** admin deja motivo vacío, **Then** PUT sin
   `cancelReason` es válido.
7. **Given** motivo > 500 chars, **When** intenta enviar, **Then** validación cliente
   impide submit.
8. **Given** pedido `inProcess` o `partialPayment`, **When** admin ve tarjeta en listado,
   **Then** botón "Cancelar" visible en `Order.jsx` (no solo dentro del modal Ver).
9. **Given** pedido `paid` o `cancelled`, **When** admin ve tarjeta, **Then** botón
   "Cancelar" oculto/deshabilitado.

---

### User Story 4 - Post-shop ante pedido no disponible (404) (Priority: P1)

Como cliente con link a un pedido que ya no está disponible (cancelado o inexistente),
quiero ver un mensaje claro sin datos del checkout ni detalles del motivo.

**Why this priority**: Evita confusión y filtración de datos provisionales del checkout.

**Independent Test**: Pedido cancelado o id inválido → abrir `/post-shop/:id` → copy
genérico **"No encontramos este pedido"**; sin resumen ni WhatsApp; sin revelar
cancelación.

**Acceptance Scenarios**:

1. **Given** `GET /orders/:id` público responde 404 (cancelado o id inválido), **When**
   cliente abre `/post-shop/:id`, **Then** mensaje genérico **"No encontramos este pedido"**
   (sin distinguir causa; no revelar cancelación).
2. **Given** 404 público, **When** página carga, **Then** **no** se muestran datos
   provisionales de `location.state` del checkout.
3. **Given** error de red (no 404), **When** falla el fetch, **Then** mensaje distinto
   de "no encontrado" (ej. reintentar / error de conexión).
4. **Given** pedido activo, **When** refresh en post-shop, **Then** sin regresión:
   resumen + WhatsApp operativos (SC-008).

---

### User Story 5 - Timeline eventos 005 (Priority: P1 parcial / P2 completo)

Como administrador, quiero leer en español los eventos de pago y cancelación en el
historial del pedido; la edición integral (`order_edited`) se completa en P2.

**Why this priority**: Auditoría operativa; P1 cubre seña y cancelación; edición de
productos en P2.

**Independent Test**: Registrar seña → timeline `payment_updated`; cancelar →
`order_cancelled`; edición productos → `order_edited` solo tras P2.

**Acceptance Scenarios**:

1. **Given** evento `payment_updated` (**P1**), **When** renderiza timeline, **Then**
   copy español con montos formateados (`fromDeposit`, `toDeposit`, `remainingBalance`).
2. **Given** evento `order_cancelled` (**P1**), **When** renderiza, **Then** muestra
   motivo si presente en payload.
3. **Given** evento `order_edited` (**P2**), **When** renderiza, **Then** resumen
   legible sin JSON crudo (`fields`, `changes`, `productsChanged`).
4. **Given** eventos legacy `state_changed` / `transaction_changed`, **When** renderiza,
   **Then** comportamiento actual preservado.
5. **Given** refetch admin tras PUT, **When** timeline carga, **Then** sin duplicar
   evento optimista de pago ya presente en servidor.

---

### User Story 6 - Filtro pedidos cancelados (Priority: P1)

Como administrador, quiero filtrar pedidos cancelados en el listado admin en el mismo
release en que puedo cancelar pedidos.

**Why this priority**: Sin filtro, pedidos cancelados desaparecen del listado default
sin forma de consultarlos; bloquea el flujo operativo post-cancelación.

**Independent Test**: Selector estado incluye "Cancelado" → query `state=cancelled` →
solo cancelados.

**Acceptance Scenarios**:

1. **Given** listado admin sin filtro estado, **When** carga, **Then** cancelados
   excluidos (comportamiento backend default).
2. **Given** filtro "Cancelado", **When** aplica, **Then** request incluye
   `state=cancelled`.
3. **Given** cambio de filtro, **When** aplica, **Then** reset a página 1 (patrón
   existente en Orders.jsx).

---

### User Story 7 - Edición integral del pedido (Priority: P2)

Como administrador, quiero editar productos/cantidades y datos del cliente desde el
panel para reflejar cambios reales del pedido.

**Why this priority**: Paridad con backend 005; mayor complejidad — post-MVP.

**Independent Test**: Editar cantidades → PUT con `products` + campos cliente → total
recalculado; error 400 si seña > nuevo total.

**Acceptance Scenarios**:

1. **Given** pedido editable (`not cancelled`), **When** admin guarda productos
   `[{ productId, cuantity }]`, **Then** PUT sin `orderDetails` anidados.
2. **Given** edición exitosa, **When** UI actualiza, **Then** refetch admin para
   timeline `order_edited` y nota automática.
3. **Given** `depositAmount` > nuevo `totalPrice` tras bajar productos, **When** PUT,
   **Then** 400 con mensaje; pedido sin cambios en UI.
4. **Given** pedido `cancelled`, **When** intenta edición integral, **Then** 409;
   UI bloqueada.

---

### Edge Cases

- PUT con `depositAmount` + `state: "cancelled"` → UI no debe permitir; backend 400.
- PUT con `state: "paid"` manual ignorado por backend — UI no envía `state` de pago.
- Error de red vs 404 vs 409 → toasts/mensajes distintos.
- Listado legacy (array plano) + filtro cancelados → modo híbrido sin crash.
- Pedido `partialPayment` legacy sin `depositAmount` en respuesta → tratar como 0
  hasta primera edición de seña; si ya `partialPayment` con monto persistido, no
  mostrar "Registrar seña" (solo edición de pedido).
- Admin intenta segunda "Registrar seña" → acción no disponible; derivar a edición pedido.
- `cancelReason` solo espacios → trim; vacío omitido en body.
- Idempotencia re-cancelar → backend 200 sin duplicar; UI sin toast redundante.
- Post-shop: error de red ≠ 404 — no mostrar "no encontrado" si fue timeout; 404 siempre
  copy genérico sin inferir cancelación.
- Timeline vacío tras 404 admin → copy graceful existente preservado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MUST registrar seña vía `PUT /orders/:id` con body `{ depositAmount: number }` únicamente.
- **FR-002**: MUST NOT enviar `state` de pago (`inProcess` | `partialPayment` | `paid`) en PUT.
- **FR-003**: MUST validar `depositAmount` entero ≥ 0 y ≤ `totalPrice` antes de submit.
- **FR-004**: MUST mostrar `depositAmount`, `totalPrice`, `remainingBalance` en listado y detalle admin.
- **FR-005**: MUST tratar estado de pago como **solo lectura** derivado del API.
- **FR-006**: MUST reemplazar acción "Pago" / `estadoPago` select por formulario "Registrar seña"
  (una sola vez por pedido, solo si `depositAmount === 0` y no `cancelled`).
- **FR-006b**: MUST ocultar/deshabilitar "Registrar seña" si `depositAmount` > 0; ajustes
  posteriores de monto vía edición integral del pedido (FR-022).
- **FR-007**: MUST cancelar vía `PUT { state: "cancelled", cancelReason?: string }` en
  `CancelOrderModal` dedicado, abierto desde botón en tarjeta `Order.jsx`.
- **FR-007b**: MUST mostrar botón "Cancelar" en tarjeta solo si `inProcess` o
  `partialPayment`; oculto en `paid` y `cancelled`.
- **FR-008**: MUST NOT combinar `depositAmount` y `state: cancelled` en un mismo submit.
- **FR-009**: MUST manejar 409 al cancelar `paid` y al editar `cancelled` con mensajes claros.
- **FR-010**: MUST agregar filtro listado `Cancelado` → query `state=cancelled` (**P1**,
  mismo release que cancelación).
- **FR-011**: MUST listado default coherente con backend (sin cancelados).
- **FR-012**: MUST PostShop ante 404 público sin datos provisionales del checkout.
- **FR-013**: MUST PostShop 404 usar copy genérico **"No encontramos este pedido"** para
  cancelado e inexistente; prohibido revelar `cancelled` al cliente público.
- **FR-014**: MUST extender `orderStatusConfig.js` con `cancelled` → "Cancelado".
- **FR-015**: MUST eliminar optimista `state_changed` para cambios de pago en `OrdersProvider`.
- **FR-016**: MUST tras PUT pago/cancelación/edición: refetch `FindOrderAdmin` y limpiar optimistas de pago.
- **FR-017**: MUST renderizar timeline types `payment_updated` y `order_cancelled` (**P1**).
- **FR-017b**: MUST renderizar `order_edited` en **P2** (edición integral).
- **FR-018**: MUST mantener `ViewBuyOrder` variantes `public` | `admin`; post-shop sin timeline/notas.
- **FR-019**: MUST formato montos con `formatProductPrice` o util ARS compartido.
- **FR-020**: MUST `apiClient` only; labels español centralizados; design system Saphire.
- **FR-021**: MUST Vitest en utils de estado/timeline labels y validación seña.
- **FR-022** (P2): MUST edición integral PUT con `products` y campos cliente whitelist.
- **FR-023**: MUST pedido `cancelled` — ocultar acciones seña/edición; permitir notas admin.

### Contrato API cliente (delta 007 — referencia)

**Campos nuevos en Order (respuestas)**

| Campo | Tipo | UI |
|-------|------|-----|
| `depositAmount` | int ≥ 0 | Editable (seña); default 0 |
| `remainingBalance` | number | Solo lectura |

**PUT /orders/:id [admin]**

| Acción | Body |
|--------|------|
| Registrar seña | `{ depositAmount: number }` |
| Cancelar | `{ state: "cancelled", cancelReason?: string }` |
| Editar entrega (existente) | `{ transactionType, address? }` |
| Editar integral (P2) | `products`, `nameClient`, `email`, … (whitelist backend) |

**Prohibido en PUT**: `totalPrice`, `orderDetails`, `remainingBalance`, `state` de pago,
`depositAmount` + `cancelled` juntos.

**GET /orders [admin]**

| Query | Comportamiento |
|-------|----------------|
| (sin state) | Excluye cancelados |
| `state=cancelled` | Solo cancelados |

**GET /orders/:id [público]**

| Condición | UI |
|-----------|-----|
| 200 | Post-shop normal |
| 404 | No disponible / no encontrado — sin provisional checkout |

**Timeline types (completo)**

`created` | `state_changed`* | `transaction_changed`* | `admin_note_added` |
`payment_updated` | `order_edited` | `order_cancelled`

\* Legacy entrega; pago por seña usa `payment_updated`.

### Key Entities (UI / front)

- **Order** (extendido): `depositAmount`, `remainingBalance`, `state` (+ `cancelled`), `cancelReason?`
- **DepositEditPayload**: `{ depositAmount: number }`
- **CancelOrderPayload**: `{ state: 'cancelled', cancelReason?: string }`
- **TimelineEvent**: `type` union ampliada + payloads documentados en contrato backend
- **OrderPaymentSummary**: `{ depositAmount, totalPrice, remainingBalance }` (display)

## Success Criteria *(mandatory)*

- **SC-001**: Admin registra seña sin enviar `state` manual; UI refleja Señado/Pagado correctamente.
- **SC-002**: Admin ve seña, total y saldo en listado y detalle.
- **SC-003**: Admin cancela pedido señado; no puede cancelar pagado (409).
- **SC-004**: Post-shop con GET público 404 muestra "No encontramos este pedido" sin
  datos provisionales (cancelado e inexistente indistinguibles para el cliente).
- **SC-005**: Timeline P1 muestra `payment_updated` y `order_cancelled` en español sin
  duplicados optimista+servidor; `order_edited` en P2.
- **SC-006**: Filtro "Cancelado" funciona con `?state=cancelled` (**P1** / MVP).
- **SC-007**: `npm test` pasa incl. utils timeline/estado/seña; quickstart smoke documentado.
- **SC-008**: Sin regresión WhatsApp post-shop para pedidos activos.

## Assumptions

- Backend `005-order-payments-lifecycle` desplegado con migración `depositAmount` y enum `cancelled`.
- `GET /orders/:id/admin` devuelve pedidos cancelados con timeline completo.
- Feature front `005-orders-operations-overhaul` y `006-admin-inventory-table` permanecen como base.
- `formatProductPrice` ya existe en `src/utils/products/formatProductPrice.js`.
- Volumen de pedidos compatible con filtros híbridos existentes en `Orders.jsx`.
- Checkout `POST /orders` sin cambios de contrato.

## Out of Scope

- Cambios en `POST /orders` checkout
- Migración/backfill automática de pedidos legacy sin `depositAmount`
- Editar/borrar notas admin (sigue append-only)
- Email/notificaciones
- Cambios en backend
- Mostrar `remainingBalance` en post-shop público v1
- Reembolsos / reversión de cancelación

## Dependencias

| Dependencia | Tipo | Notas |
|-------------|------|-------|
| Backend 005 | API | Contrato `orders-api-payments.md` |
| `orderStatusConfig.js` | Front | Extender con `cancelled` |
| `OrdersProvider` | Front | Quitar optimismo pago legacy |
| `formatProductPrice` | Front util | Montos ARS |
| `FindOrderAdmin` | Front service | Refetch post-PUT |
| `EditOrderService` | Front service | Misma URL PUT |
| PostShop (front 005) | Front | Ajuste 404 sin provisional |

## Archivos previstos (implementación)

**Crear**

- `src/components/Orders/CancelOrderModal.jsx`
- `src/utils/orders/orderTimelineLabels.js` (+ `.test.js`) — labels eventos 005
- `src/utils/orders/validateDepositAmount.js` (+ `.test.js`) — opcional

**Modificar**

- `src/components/Orders/EditOrder.jsx`
- `src/components/Orders/Order.jsx`
- `src/components/Orders/Orders.jsx`
- `src/components/Orders/ViewBuyOrder.jsx`
- `src/components/Orders/OrderTimeline.jsx`
- `src/components/Orders/ModalActionOrder.jsx`
- `src/contexts/Orders/OrdersProvider.jsx`
- `src/utils/orders/orderStatusConfig.js`
- `src/views/PostShop.jsx`
- `specs/005-orders-operations-overhaul/contracts/orders-api-client.md` — delta 007 (en plan)
