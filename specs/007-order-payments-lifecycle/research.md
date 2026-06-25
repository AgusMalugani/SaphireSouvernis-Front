# Research: 007-order-payments-lifecycle (Frontend)

**Feature**: 007-order-payments-lifecycle  
**Date**: 2026-06-24

## R1 — Semántica `depositAmount` en UI

**Decision**: Input de "Registrar seña" = monto total de seña (único registro); visible solo si `depositAmount === 0` y `state !== 'cancelled'`.

**Rationale**: Alineado con backend (campo persistido absoluto). Clarify: ajustes posteriores vía edición integral P2, no segundo formulario de seña.

**Alternatives considered**:
- Pago incremental (sumar al existente) — rechazado; duplica lógica del servidor.
- Select de estado manual — rechazado; backend 400.

## R2 — Optimismo timeline de pago

**Decision**: Eliminar rama `estadoPago` → `state_changed` en `OrdersProvider.appendOptimisticEditEvent`. Tras PUT exitoso (seña/cancel/entrega): `clearOptimisticTimelineEvents(id)` + refetch `FindOrderAdmin` en modal Ver si está abierto.

**Rationale**: Backend emite `payment_updated` / `order_cancelled`; optimista duplicaba eventos.

**Alternatives considered**:
- Optimista `payment_updated` — rechazado; más complejo y propenso a drift de payload.

## R3 — Post-shop 404 vs error de red

**Decision**: Extender error de `apiClient` con propiedad `status` numérica en el `Error` lanzado. PostShop: si `status === 404` → pantalla genérica sin provisional; si no hay status / timeout → mensaje de error de conexión distinto.

**Rationale**: `handleResponse` ya incluye `Error ${response.status}` en message; adjuntar `.status` es cambio mínimo y reutilizable para 409 en cancelación.

**Alternatives considered**:
- Parsear `error.message` con regex — frágil.
- `fetch` directo en PostShop — viola constitución.

## R4 — Filtro estado en listado admin

**Decision**: Separar `getOrderStateFilterOptions()` (incluye `cancelled`) de cualquier select de edición de pago. Opción vacía `""` = default backend (excluye cancelados). Opción `cancelled` → `?state=cancelled`.

**Rationale**: `getOrderStateSelectOptions()` hoy alimenta filtro y EditOrder; edición de pago desaparece; filtro necesita cuarto valor.

**Alternatives considered**:
- Tab separado "Cancelados" — más UI; rechazado por clarify P1.

## R5 — Cancelación UX

**Decision**: `CancelOrderModal` glass Saphire; botón en tarjeta `Order.jsx` (no en `ModalActionOrder`). PUT separado; `cancelReason` opcional trim max 500.

**Rationale**: Clarify session; acción destructiva visible pero separada de seña.

**Alternatives considered**:
- Cancelar solo en modal Ver — rechazado en clarify.

## R6 — Timeline P1 vs P2

**Decision**: P1 implementa labels para `payment_updated` y `order_cancelled` en `orderTimelineLabels.js`. `order_edited` stub o mensaje genérico hasta P2 edición integral.

**Rationale**: Clarify: parcial en P1; edición productos es P2.

## R7 — Legacy listado (array plano)

**Decision**: En `filterOrdersClientSide`, si `state === 'cancelled'` filtrar `order.state === 'cancelled'`; si `state` vacío excluir cancelados (alinear default backend).

**Rationale**: Modo híbrido 005 front debe comportarse igual con API legacy.

## R8 — Montos ARS

**Decision**: Reutilizar `formatProductPrice` de `src/utils/products/formatProductPrice.js` para seña, total y saldo en admin.

**Rationale**: Ya existe post-006; consistencia visual.

## R9 — HTTP 409 en cancelación

**Decision**: `editOrderContext` / servicio propaga error con `.status`; toast específico si `409` al cancelar pagado: "No se puede cancelar un pedido pagado".

**Rationale**: FR-009; sin cambio optimista en context.
