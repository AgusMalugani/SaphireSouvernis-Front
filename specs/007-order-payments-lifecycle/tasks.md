# Tasks: Ciclo de vida de pagos y cancelación — panel admin y post-shop

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/orders-api-payments-client.md](./contracts/orders-api-payments-client.md)

**Prerequisites**: Clarify Session 2026-06-24 integrada; plan y contratos listos. Backend `005-order-payments-lifecycle` desplegado.

## Format

`[ID] [P?] [Story] Description` — **[P]** = paralelo (archivos distintos, sin deps)

---

## Phase 1: Foundational — Utils, apiClient y tests (bloqueante)

**Purpose**: Guards de estado, validación seña, labels timeline, filtro legacy cancelados y HTTP status antes de UI.

- [x] T001 Modificar `src/services/apiClient.js` — adjuntar `error.status` en `handleResponse` al lanzar
- [x] T002 [P] Crear `src/utils/orders/getApiErrorStatus.js` + `getApiErrorStatus.test.js`
- [x] T003 [P] Modificar `src/utils/orders/orderStatusConfig.js` — `cancelled`, `getOrderStateFilterOptions`, `canRegisterDeposit`, `canCancelOrder`, `isOrderCancelled`. `canRegisterDeposit`: solo `inProcess` + `(depositAmount ?? 0) === 0` + no `cancelled` (legacy `partialPayment` sin campo → false porque `state !== inProcess`)
- [x] T004 [P] Actualizar `src/utils/orders/orderStatusConfig.test.js` — cancelled, guards, filter options; casos legacy `partialPayment` sin `depositAmount` y `inProcess` con `depositAmount` 0
- [x] T005 [P] Crear `src/utils/orders/validateDepositAmount.js` + `validateDepositAmount.test.js`
- [x] T006 [P] Crear `src/utils/orders/orderTimelineLabels.js` + `orderTimelineLabels.test.js` — P1: `payment_updated`, `order_cancelled`; stub `order_edited`
- [x] T007 Modificar `src/utils/orders/filterOrdersClientSide.js` — default excluye `cancelled`; filtro `state=cancelled`
- [x] T008 Actualizar `src/utils/orders/filterOrdersClientSide.test.js` — casos cancelados + default

**Checkpoint**: `npm test -- src/utils/orders` pasa.

---

## Phase 2: US1 — Registrar seña (P1)

**Goal**: Admin ingresa monto una sola vez; PUT `{ depositAmount }` sin `state`.

**Independent Test**: Pedido `inProcess` → Registrar seña → Network PUT solo `{ depositAmount }` → badge Señado; botón oculto tras éxito.

- [x] T009 [US1] Modificar `src/contexts/Orders/OrdersProvider.jsx` — eliminar optimista `state_changed` en `estadoPago`/`registrarSeña`
- [x] T010 [US1] Refactor `src/components/Orders/EditOrder.jsx` — acción `registrarSeña`: input monto ARS, PUT `{ depositAmount }`, validación `validateDepositAmount`; quitar select `state`; badge estado pago **solo lectura** vía `getOrderStateLabel` (FR-005, sin control editable de `state`)
- [x] T011 [US1] Modificar `src/components/Orders/ModalActionOrder.jsx` — wire `registrarSeña`; ocultar si `!canRegisterDeposit(order)`; sin acción que envíe `state` de pago
- [x] T012 [US1] Tras PUT seña exitoso — `clearOptimisticTimelineEvents` + patrón refetch `FindOrderAdmin` en modal Ver

**Checkpoint**: SC-001 — seña sin `state` manual; segunda seña no disponible.

---

## Phase 3: US2 — Ver seña y saldo en panel (P1)

**Goal**: Componente de montos y detalle admin; tarjeta `Order.jsx` se integra en Phase 4 (único pase).

**Independent Test**: Pedido señado → tarjeta y modal Ver muestran tres montos ARS.

- [x] T013 [P] [US2] Crear `src/components/Orders/OrderPaymentSummary.jsx` — seña, total, saldo pendiente
- [x] T015 [US2] Modificar `src/components/Orders/ViewBuyOrder.jsx` — bloque pago admin con `depositAmount`, `totalPrice`, `remainingBalance`

**Checkpoint**: SC-002 (montos en detalle); montos en tarjeta completan en T014.

---

## Phase 4: US2 + US3 — Tarjeta pedido y cancelar (P1)

**Goal**: Un solo pase sobre `Order.jsx` (montos + Registrar seña + Cancelar); modal y context de cancelación.

**Independent Test**: Tarjeta muestra montos; cancelar pedido señado → desaparece del listado default; 409 si pagado.

- [x] T016 [P] [US3] Crear `src/components/Orders/CancelOrderModal.jsx` — glass Saphire, motivo opcional max 500, **trim**; omitir `cancelReason` del body si vacío tras trim; confirmación
- [x] T017 [US3] Modificar `src/contexts/Orders/OrdersProvider.jsx` — `cancelOrderContext`; toast 409; actualizar `orders` en context; tras éxito `clearOptimisticTimelineEvents(id)` + refetch `FindOrderAdmin` si modal Ver abierto (FR-016); 200 idempotente en ya cancelado → sin toast redundante
- [x] T014 [US2] [US3] Modificar `src/components/Orders/Order.jsx` — **único pase**: integrar `OrderPaymentSummary`; renombrar "Pago" → "Registrar seña"; botones `canRegisterDeposit` / `canCancelOrder`; botón Cancelar → `CancelOrderModal` (requiere T016). Badge estado pago solo lectura (FR-005)

**Checkpoint**: SC-002 + SC-003.

> **Nota (ex-T018)**: Los cambios de tarjeta viven en T014; no reabrir `Order.jsx` en otra fase.

---

## Phase 5: US6 — Filtro pedidos cancelados (P1)

**Goal**: Selector incluye Cancelado → `?state=cancelled`.

**Independent Test**: Filtro Cancelado → solo pedidos `cancelled`; default sin cancelados.

- [x] T019 [US6] Modificar `src/components/Orders/Orders.jsx` — usar `getOrderStateFilterOptions()`; opción Cancelado; reset page al cambiar filtro

**Checkpoint**: SC-006.

---

## Phase 6: US4 — Post-shop ante 404 (P1)

**Goal**: 404 genérico sin provisional checkout; error de red distinto.

**Independent Test**: Pedido cancelado → `/post-shop/:id` → "No encontramos este pedido"; sin WhatsApp ni resumen.

- [x] T020 [US4] Modificar `src/views/PostShop.jsx` — `getApiErrorStatus`; 404 limpia `order` provisional; estado `networkError` separado de `loadError`
- [x] T021 [US4] Ajustar `PostShopNotFound` en `PostShop.jsx` — copy fijo "No encontramos este pedido" (FR-013)

**Checkpoint**: SC-004, SC-008 (regresión pedido activo).

---

## Phase 7: US5 — Timeline eventos 005 parcial (P1)

**Goal**: Renderizar `payment_updated` y `order_cancelled` en español; sin duplicados optimista.

**Independent Test**: Tras seña/cancelar → modal Ver → eventos legibles tras refetch admin.

- [x] T022 [US5] Modificar `src/components/Orders/OrderTimeline.jsx` — delegar descripción a `orderTimelineLabels`; iconos para tipos 005
- [x] T023 [US5] Verificar refetch admin en `ViewBuyOrder.jsx` tras mutaciones — timeline servidor sin duplicar optimista pago

**Checkpoint**: SC-005 (parcial P1).

---

## Phase 8: US7 — Edición integral del pedido (P2)

**Goal**: Editar productos/datos cliente; PUT `products` + campos whitelist; timeline `order_edited`.

**Independent Test**: Editar cantidades → PUT sin `orderDetails`; 400 si seña > nuevo total.

- [x] T024 [P2] [US7] Crear o extender flujo edición integral (ej. `EditOrderProducts.jsx` o `EditOrder.jsx`) — PUT `products` + campos cliente
- [x] T025 [P2] [US7] Completar labels `order_edited` en `src/utils/orders/orderTimelineLabels.js` + tests
- [x] T026 [P2] [US7] Bloquear edición en pedido `cancelled` (409); validación cliente seña vs nuevo total

**Checkpoint**: FR-022; SC-005 completo con `order_edited`.

---

## Phase 9: Verify

- [x] T027 Ejecutar `npm test` — suite completa incl. `src/utils/orders/`
- [ ] T028 Smoke manual según [quickstart.md](./quickstart.md) — incl. notas admin en pedido `cancelled` (FR-023), entrega sin regresión, error de red post-shop
- [x] T029 Marcar tasks completadas en este archivo

**Checkpoint**: SC-001–SC-008 (P1); P2 opcional según scope release.

---

## Dependencies & Execution Order

```text
Phase 1 (T001–T008) ──blocks──► Phases 2–7
Phase 2 (US1) ──► antes de Phase 7 (eventos payment_updated)
Phase 3 (US2 parcial) ──► T013/T015 paralelo con inicio Phase 4
Phase 4 (US2 tarjeta + US3) ──► T016 antes de T014; T014 único pase Order.jsx; antes de Phase 5 + Phase 7
Phase 5 (US6) ──► tras Phase 1 (filter options); paralelo con Phase 3–4
Phase 6 (US4) ──► depende T002 (getApiErrorStatus)
Phase 7 (US5) ──► depende T006 + Phases 2 y 4
Phase 8 (P2) ──► post-MVP
```

### MVP sugerido (P1)

1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → T027  
2. Validar quickstart § Seña, Cancelar, Post-shop, Filtro  
3. Phase 8 (P2) en release posterior si se acota scope

### Parallel opportunities

- T002–T006 en paralelo tras T001 (archivos distintos)
- T013 paralelo con T016 (archivos nuevos)
- T016 paralelo con T017 (modal vs context) — integrar ambos en T014 (Order.jsx)
- T019 paralelo con Phase 6 tras Phase 1
- T024–T026 P2 en paralelo entre sí

---

## Notes

### Equivalencia fases `plan.md` ↔ `tasks.md`

| plan.md Phase | tasks.md Phase | Scope |
|---------------|----------------|-------|
| 1 | 1 | Utils + apiClient |
| 2 | 2 | Registrar seña |
| 3 | 3 + 4 (T014) | Montos panel + tarjeta |
| 4 | 4 + 5 | Cancelar + filtro cancelados |
| 5 | 6 | Post-shop 404 |
| 6 | 7 | Timeline P1 |
| 7 | 8 | Edición integral P2 |
| 8 | 9 | Verify |

- Seña **una sola vez** (`depositAmount === 0`); ajustes vía edición integral P2.
- Post-shop 404: siempre "No encontramos este pedido"; sin revelar `cancelled`.
- Cancelar desde **tarjeta** `Order.jsx`, no solo modal Ver.
- `formatProductPrice` reutilizado desde `src/utils/products/formatProductPrice.js`.
- `EditOrderService.js` — misma URL; solo cambian payloads.
- Entrega (`envio/Retiro`) sin regresión — PUT `transactionType` + `address` intacto.
