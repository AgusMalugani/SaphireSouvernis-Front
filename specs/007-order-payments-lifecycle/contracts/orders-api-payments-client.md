# Contract: Orders API Client — Payments & Lifecycle (delta 007)

**Feature**: 007-order-payments-lifecycle (Frontend)  
**Version**: 1.0  
**Status**: Approved for implementation  
**Base**: [005 orders-api-client.md](../../005-orders-operations-overhaul/contracts/orders-api-client.md)  
**Backend reference**: `SaphireSouvenirs-Back/specs/005-order-payments-lifecycle/contracts/orders-api-payments.md`

## Base path

`/orders` (relativo a `VITE_API_URL` que incluye `/api/v1`)

## Cambios respecto a contrato front 005

### Nuevos campos en Order (respuestas)

| Campo | Tipo | UI |
|-------|------|-----|
| `depositAmount` | number (int ≥ 0) | Admin: registrar/mostrar; default `0` |
| `remainingBalance` | number | Admin: solo lectura |

### StateEnum UI

+ `cancelled` → label **"Cancelado"**

Estados de pago en PUT: **prohibidos** salvo `cancelled`.

---

## PUT /orders/:id [admin]

Reemplaza body mínimo de pago de 005.

### Acciones y bodies

| Acción UI | Body | Notas |
|-----------|------|-------|
| Registrar seña (1×) | `{ "depositAmount": 5000 }` | Sin `state` |
| Cancelar pedido | `{ "state": "cancelled", "cancelReason": "..." }` | Request separada; reason opcional |
| Editar entrega | `{ "transactionType": "send", "address": "..." }` | Sin cambio |
| Edición integral (P2) | `{ "products": [...], "nameClient": "..." }` | Whitelist backend |

### Prohibido en PUT

- `{ "state": "paid" \| "partialPayment" \| "inProcess" }`
- `{ "state": "cancelled", "depositAmount": N }` en mismo request
- `orderDetails`, `totalPrice`, `remainingBalance` en body

### Errores UI

| Status | Condición | Toast / UX |
|--------|-----------|------------|
| 400 | seña > total, validación DTO | Mensaje validación |
| 409 | cancelar `paid`, editar `cancelled` | Mensaje específico; sin cambio lista |
| 401/403 | auth | Flujo login existente |

**Servicio**: `EditOrderService.js` — misma URL; payloads según acción.

---

## GET /orders [admin]

| Query `state` | Comportamiento esperado |
|---------------|-------------------------|
| omitido / `""` | Sin cancelados |
| `cancelled` | Solo cancelados |
| `inProcess` \| `partialPayment` \| `paid` | Ese estado; sin cancelados |

**Filtro UI**: `getOrderStateFilterOptions()` incluye opción Cancelado → `cancelled`.

**Legacy**: `filterOrdersClientSide` replica reglas si API devuelve array.

---

## GET /orders/:id [público]

| Response | PostShop UI |
|----------|-------------|
| 200 | Flujo normal |
| 404 | "No encontramos este pedido"; **sin** `location.state` provisional |

---

## GET /orders/:id/admin [admin]

Sin cambio de path. Post-PUT seña/cancelación: **refetch** para timeline/notas.

---

## Timeline types (render P1)

| Type | Label ejemplo |
|------|----------------|
| `payment_updated` | Seña: $X → $Y · Saldo: $Z |
| `order_cancelled` | Pedido cancelado · motivo |
| `order_edited` | P2 — resumen campos/productos |

Legacy: `created`, `state_changed`, `transaction_changed`, `admin_note_added`.

---

## Servicios front (sin cambio de URL)

| Servicio | Método | Cambio |
|----------|--------|--------|
| `EditOrderService.js` | PUT | Nuevos payloads |
| `FindAllOrders.js` | GET | `state=cancelled` en query |
| `OneOrder.js` | GET | Consumir nuevos campos; propagar 404 |
| `FindOrderAdmin.js` | GET | Refetch post-mutación |

**Nuevos helpers** (no HTTP):
- `validateDepositAmount.js`
- `orderTimelineLabels.js`
- `getApiErrorStatus.js` (o `apiClient` con `.status`)

---

## Failure matrix (ampliada)

| Condición | Comportamiento UI |
|-----------|-------------------|
| PUT pago con `{ state }` manual | No enviar desde UI |
| Segunda "Registrar seña" | Botón oculto |
| Cancelar éxito | Remover de listado default; visible con filtro Cancelado |
| GET público 404 post-cancel | PostShop not found genérico |
| Optimista pago | Eliminado |
| Admin GET cancelado | 200 + timeline `order_cancelled` |

---

## Tests Vitest sugeridos

- `validateDepositAmount.test.js`
- `orderTimelineLabels.test.js`
- `orderStatusConfig.test.js` (cancelled, filter options, canDeposit/canCancel)
- `filterOrdersClientSide.test.js` (cancelled filter + default exclude)
- `getApiErrorStatus.test.js` (si se extrae helper)
