# Implementation Plan: Operaciones de pedidos — admin y post-compra

**Branch**: `005-orders-operations-overhaul` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Overhaul frontend del módulo de órdenes: corregir typo `inProcces` → `inProcess`,
labels español centralizados ("En proceso", etc.), ruta canónica `/post-shop/:id`
con redirect legacy, CTA WhatsApp con mensaje detallado vía `envs.shopUrl`,
listado admin con filtros híbridos (server params + fallback cliente legacy),
timeline optimista y notas append-only en modal admin. Sin cambios en backend v1.

## Technical Context

**Stack**: React 19, Vite, Tailwind v4, Vitest, Context API, `apiClient`, `envs`

**Root causes**:
- Typo `inProcces` rompe filtros admin
- PostShop sin CTA WhatsApp; `location.state` no consumido
- Filtros solo client-side; sin paginación
- `EditOrder` envía orden completa en PUT
- `ViewBuyOrder` sin separación public/admin

**Clarify 2026-06-19**: WhatsApp template B; filtros híbridos A; link `envs.shopUrl`;
timeline optimista A; notas append-only A.

## Project Structure

```text
src/
├── utils/orders/
│   ├── orderStatusConfig.js          # CREATE
│   ├── buildWhatsAppOrderMessage.js  # CREATE
│   ├── normalizeOrdersListResponse.js # CREATE
│   └── filterOrdersClientSide.js     # CREATE
├── components/Orders/
│   ├── OrderTimeline.jsx             # CREATE
│   ├── AdminOrderNotes.jsx           # CREATE
│   ├── Orders.jsx, Order.jsx, ...    # MODIFY
├── contexts/Orders/OrdersProvider.jsx # MODIFY
├── services/Orders/
│   ├── FindAllOrders.js              # MODIFY
│   ├── FindOrderAdmin.js             # CREATE
│   └── AddOrderNote.js               # CREATE
├── views/PostShop.jsx                # MODIFY
└── App.jsx                           # MODIFY
```

## Design

### 1. orderStatusConfig (P1)

```js
ORDER_STATES = { inProcess, partialPayment, paid }
// label: "En proceso" | "Señado" | "Pagado"
getOrderStateLabel(state) → string
getOrderStateConfig(state) → { label, className }
getOrderTransactionLabel(type) → string
// fallback: "Estado desconocido" — nunca enum crudo
```

Reemplazar mapas en `Order.jsx`, `ViewBuyOrder.jsx`, `EditOrder.jsx`, `Orders.jsx`.

### 2. Rutas post-shop (P1)

- `App.jsx`: `<Route path="/post-shop/:id" />` + redirect `/postShop/:id`
- `ModalCreateOrder`: `navigate('/post-shop/${id}')`
- `useMatch('/post-shop/:id')` para ocultar FAB

### 3. buildWhatsAppOrderMessage (P1)

Input: `{ order, shopUrl }`  
Output: string multilínea (template B):

- Saludo + ID + nombre + total + endOrder + theme (si hay)
- Líneas `Producto × cantidad`
- Link: `${normalizeShopUrl(shopUrl)}/post-shop/${id}`

Tests: con/sin productos, sin theme, shopUrl con trailing slash.

`PostShop`: `RedirectToWhatsapp` con `envs.whatsappNum`; mensaje desde order API
post-refresh; enriquecer con `location.state` si disponible antes del fetch.

### 4. Listado híbrido (P2)

```
FindAllOrders(filters) → raw API
normalizeOrdersListResponse(raw, filters) →
  if Array → filterOrdersClientSide(array, filters) → { data, meta }
  if { data, meta } → passthrough
```

`OrdersProvider`: `ordersFilters`, `ordersMeta`, `fetchOrders`, loading/error.  
`Orders.jsx`: debounce 400ms en `q`; refetch on filter change; paginación UI.

### 5. ViewBuyOrder variants (P2)

- `variant="public"` (default): PostShop — sin timeline/notas
- `variant="admin"`: modal Ver — + `OrderTimeline` + `AdminOrderNotes`

`FindOrderAdmin(id)` → timeline + notes; 404 → empty graceful.  
Tras `editOrderContext` OK → append optimistic timeline event.

### 6. AdminOrderNotes (P2)

Append-only: textarea + submit → `AddOrderNote(id, { note })`.  
Lista cronológica local + server cuando exista endpoint.

### 7. EditOrder payload mínimo (P2)

- Pago: `{ state }`
- Envío: `{ transactionType, address }`

## Constitution Check

- [x] `apiClient` para todos los services
- [x] `envs` para `whatsappNum` y `shopUrl` (no `import.meta.env` en UI)
- [x] Context API — `OrdersProvider`
- [x] Vitest en utils puros (4 módulos)
- [x] Tailwind v4 + design system Saphire
- [x] Sin cambios backend (FR-020)
- [x] Diff acotado al dominio Orders

## Phase Breakdown

| Phase | Scope | Deliverable |
|-------|-------|-------------|
| 1 | Utils + tests | orderStatusConfig, buildWhatsApp, normalize, filterClient |
| 2 | P1 UX | Fix typo/labels, rutas post-shop, PostShop WhatsApp |
| 3 | P2 Admin list | OrdersProvider, FindAllOrders, Orders.jsx, Order.jsx products |
| 4 | P2 Admin detail | ViewBuyOrder variants, Timeline, Notes, EditOrder payload |
| 5 | Verify | npm test + quickstart manual |

## References

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/orders-api-client.md](./contracts/orders-api-client.md)
- [quickstart.md](./quickstart.md)
