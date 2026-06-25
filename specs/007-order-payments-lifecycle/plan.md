# Implementation Plan: Ciclo de vida de pagos y cancelación — panel admin y post-shop

**Branch**: `007-order-payments-lifecycle` | **Date**: 2026-06-24 | **Spec**: [spec.md](./spec.md)

## Summary

Adaptar el módulo de pedidos del frontend al backend **005-order-payments-lifecycle**:
registrar **seña** (`depositAmount`, una sola vez), mostrar saldo en panel, **cancelar**
pedidos desde tarjeta, filtro **Cancelado**, timeline P1 (`payment_updated`, `order_cancelled`),
Post-shop ante 404 sin datos provisionales, y eliminar envío manual de `state` de pago.
P2: edición integral + `order_edited` en timeline.

**Clarify 2026-06-24**: seña única; post-shop 404 genérico; filtro cancelados P1; cancelar
en tarjeta; timeline parcial P1.

## Technical Context

**Stack**: React 19, Vite, Tailwind v4, Vitest, Context API, `apiClient`, `react-toastify`, `formatProductPrice`

**Root causes** (brecha actual):
- `EditOrder.jsx` → `{ state }` en `estadoPago` (backend 400)
- `OrdersProvider` optimista `state_changed` en pago
- `OrderTimeline` sin tipos 005
- `Order.jsx` sin montos ni cancelar; botón "Pago"
- `Orders.jsx` sin filtro `cancelled`
- `PostShop` usa provisional si hay error con checkout state
- `apiClient` no expone HTTP status en errores

**Depends on**: Backend `005-order-payments-lifecycle` desplegado.

## Project Structure

```text
src/
├── utils/orders/
│   ├── orderStatusConfig.js           # MODIFY — cancelled, filter options, guards
│   ├── orderStatusConfig.test.js      # CREATE/MODIFY
│   ├── validateDepositAmount.js       # CREATE
│   ├── validateDepositAmount.test.js  # CREATE
│   ├── orderTimelineLabels.js         # CREATE — P1 types + P2 stub order_edited
│   ├── orderTimelineLabels.test.js    # CREATE
│   ├── filterOrdersClientSide.js      # MODIFY — cancelled + default exclude
│   └── getApiErrorStatus.js           # CREATE (opcional si apiClient adjunta .status)
├── utils/products/formatProductPrice.js  # REUSE — montos admin
├── components/Orders/
│   ├── EditOrder.jsx                  # MODIFY — registrarSeña + deposit input
│   ├── Order.jsx                      # MODIFY — montos, botones condicionales, cancelar
│   ├── Orders.jsx                     # MODIFY — filtro Cancelado
│   ├── OrderTimeline.jsx              # MODIFY — delegar a orderTimelineLabels
│   ├── ViewBuyOrder.jsx               # MODIFY — bloque pago admin (montos)
│   ├── CancelOrderModal.jsx           # CREATE
│   ├── OrderPaymentSummary.jsx        # CREATE (opcional — fila seña/total/saldo)
│   └── ModalActionOrder.jsx           # MODIFY — action registrarSeña
├── contexts/Orders/OrdersProvider.jsx # MODIFY — quitar optimismo pago; cancel helper
├── services/
│   ├── apiClient.js                   # MODIFY — error.status mínimo
│   └── Orders/EditOrderService.js     # sin cambio URL
└── views/PostShop.jsx                 # MODIFY — 404 sin provisional; error red

specs/007-order-payments-lifecycle/    # SDD artifacts (este plan)
```

## Design

### 1. orderStatusConfig (P1 — foundational)

```js
ORDER_STATE_VALUES.CANCELLED = 'cancelled'

ORDER_STATE_CONFIG.cancelled = {
  label: 'Cancelado',
  className: 'text-stone-600 bg-stone-100 border-stone-300',
}

getOrderStateFilterOptions()  // inProcess | partialPayment | paid | cancelled
// Deprecar uso de getOrderStateSelectOptions en EditOrder (eliminar select pago)

canRegisterDeposit(order) →
  order?.state !== 'cancelled' && (order?.depositAmount ?? 0) === 0

canCancelOrder(order) →
  order?.state === 'inProcess' || order?.state === 'partialPayment'

isOrderCancelled(order) → order?.state === 'cancelled'
```

### 2. validateDepositAmount (P1)

```js
validateDepositAmount(depositAmount, totalPrice) → { valid, errorMessage? }
// entero, >= 0, <= totalPrice
```

### 3. apiClient error status (P1)

```js
// handleResponse: const error = new Error(...); error.status = response.status; throw error
getApiErrorStatus(error) → error?.status ?? parseFromMessage(error.message)
```

### 4. EditOrder — Registrar seña (P1)

- Renombrar acción `estadoPago` → `registrarSeña` (o mantener id interno y cambiar UI).
- Formulario: input `type="number"` monto ARS; mostrar `totalPrice` readonly.
- Submit: `{ depositAmount: Number(input) }` únicamente.
- Ocultar formulario si `!canRegisterDeposit(order)`.

### 5. CancelOrderModal + Order.jsx (P1) — único pase en T014

**CancelOrderModal** (glass Saphire, `useBodyScrollLock`):
- Textarea motivo opcional (max 500); **trim**; omitir `cancelReason` si vacío tras trim
- Confirmar → `PUT { state: 'cancelled', cancelReason? }`
- 409 → toast "No se puede cancelar un pedido pagado"

**Order.jsx** (T014 — montos + seña + cancelar en un solo commit):
- Bloque `OrderPaymentSummary`: Seña | Total | Saldo (`formatProductPrice`)
- Botón "Registrar seña" si `canRegisterDeposit` → modal `registrarSeña`
- Botón "Cancelar" si `canCancelOrder` → `CancelOrderModal` (estado local, no `ModalActionOrder`)
- Ocultar ambos si `cancelled` / `paid` según reglas
- Renombrar label "Pago" → "Registrar seña"

### 6. OrdersProvider (P1)

```js
// Eliminar bloque estadoPago en appendOptimisticEditEvent

cancelOrderContext(orderId, { cancelReason }) →
  EditOrderService(orderId, { state: 'cancelled', ... })
  actualizar orders en context
  clearOptimisticTimelineEvents(orderId)
  refetch FindOrderAdmin si modal Ver abierto (FR-016)
  200 idempotente en ya cancelado → sin toast redundante

// Tras editOrderContext / cancelOrderContext exitoso:
// consumidor (modal) llama FindOrderAdmin refetch — patrón existente ViewBuyOrder
```

Opcional: `refetchOrderAdmin(orderId)` helper en context.

### 7. OrderTimeline + orderTimelineLabels (P1 parcial)

```js
// payment_updated
`Seña actualizada: ${format(fromDeposit)} → ${format(toDeposit)} · Saldo ${format(remainingBalance)}`

// order_cancelled
`Pedido cancelado${reason ? ` · ${reason}` : ''}`

// order_edited (P2)
// placeholder: 'Pedido editado' o detalle fields
```

`OrderTimeline.jsx` importa `getTimelineDescription` desde util.

### 8. Orders.jsx filtro (P1)

- Usar `getOrderStateFilterOptions()` en select estado.
- Opción **Cancelado** → `state=cancelled`.
- Default `""` → sin cancelados (backend).

### 9. filterOrdersClientSide (P1 — legacy)

```js
if (!filters.state) → exclude state === 'cancelled'
if (filters.state === 'cancelled') → only cancelled
```

### 10. ViewBuyOrder admin (P1)

- Sección "Pago" en variante admin: `depositAmount`, `totalPrice`, `remainingBalance`.
- Variante public (modal Ver desde admin usa admin): mismos montos OK.
- Post-shop usa `PostShopOrderSummary` — sin `remainingBalance` v1 (spec).

### 11. PostShop.jsx (P1)

```js
catch (error) {
  if (getApiErrorStatus(error) === 404) {
    setOrder(null)           // limpiar provisional
    setLoadError(true)       // PostShopNotFound — copy fijo
    return
  }
  setNetworkError(true)      // mensaje distinto
}
```

- Nunca mostrar provisional tras 404.
- `PostShopNotFound`: título "No encontramos este pedido" (FR-013).

### 12. Edición integral (P2)

- Nuevo flujo o extensión `EditOrder` / `EditOrderProducts.jsx`
- PUT con `products` + campos cliente
- Timeline `order_edited` completo
- Validar 400 seña > nuevo total

## Constitution Check

- [x] `apiClient` only — extensión mínima `error.status`
- [x] `envs` vía `src/config/env.js` — sin cambios
- [x] Context API — `OrdersProvider`
- [x] Vitest en utils puros (validate, timeline labels, status config, filter)
- [x] Tailwind v4 + Saphire glass + `react-icons` Fi
- [x] Labels español centralizados — `orderStatusConfig` + `orderTimelineLabels`
- [x] Sin axios/bootstrap
- [x] Solo frontend — sin cambios backend
- [x] Diff acotado dominio Orders

## Phase Breakdown

| Phase | Scope | User stories | Deliverable |
|-------|-------|--------------|-------------|
| 0 | Research | — | research.md ✅ |
| 1 | Utils + apiClient | — | orderStatusConfig, validateDepositAmount, getApiErrorStatus, filterOrdersClientSide, tests |
| 2 | Registrar seña | US1 | EditOrder, ModalActionOrder, OrdersProvider sin optimismo pago |
| 3 | Saldo en panel | US2 | OrderPaymentSummary, ViewBuyOrder |
| 4 | Tarjeta + cancelar + filtro | US2, US3, US6 | Order.jsx (único pase T014), CancelOrderModal, Orders.jsx filter |
| 5 | Post-shop 404 | US4 | PostShop.jsx + PostShopNotFound |
| 6 | Timeline P1 | US5 parcial | orderTimelineLabels, OrderTimeline |
| 7 | P2 edición integral | US7 | EditOrder products, order_edited labels |
| 8 | Verify | SC-001–008 | npm test + quickstart smoke |

## Dependencies

```text
Phase 1 ──blocks──► Phases 2–6
Phase 2 + 3 ──► pueden solaparse tras Phase 1
Phase 4 ──► depende Phase 1 (canCancel, filter options)
Phase 5 ──► depende Phase 1 (getApiErrorStatus)
Phase 6 ──► depende Phase 2–4 (eventos reales vía refetch admin)
Phase 7 (P2) ──► post-MVP
```

### MVP sugerido (P1)

Phases 1 → 2 → 3 → 4 → 5 → 6 → 8 (omitir Phase 7)

## Risks & Mitigations

| Riesgo | Mitigación |
|--------|------------|
| Legacy `partialPayment` sin `depositAmount` | Tratar `depositAmount ?? 0`; ocultar registrar seña si > 0 |
| apiClient sin status | Phase 1 adjunta `.status` |
| Duplicados timeline | Sin optimismo pago; refetch admin |
| Provisional PostShop en 404 | Limpiar order + loadError en catch 404 |

## References

- [spec.md](./spec.md)
- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/orders-api-payments-client.md](./contracts/orders-api-payments-client.md)
- [quickstart.md](./quickstart.md)
- Backend: `SaphireSouvenirs-Back/specs/005-order-payments-lifecycle/`
