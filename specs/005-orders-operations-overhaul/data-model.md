# Data Model: 005-orders-operations-overhaul (Frontend)

**Feature**: 005-orders-operations-overhaul  
**Scope**: Tipos y shapes en UI/servicios; persistencia en backend fase posterior.

## Order (existente — API)

| Campo | Tipo | UI |
|-------|------|-----|
| `id` | UUID string | Mostrar en detalle/WhatsApp |
| `state` | `inProcess` \| `partialPayment` \| `paid` | Label español vía config |
| `transactionType` | `send` \| `withdraw` | Label español |
| `nameClient` | string | Tarjeta, detalle |
| `totalPrice` | number | Tarjeta, WhatsApp |
| `endOrder` | date string | Tarjeta, WhatsApp |
| `theme` | string | WhatsApp si non-empty |
| `orderDetails` | array | Productos en tarjeta/detalle |

## OrderListFilters (UI state)

| Campo | Default | Notas |
|-------|---------|-------|
| `state` | `''` | Enum value en query |
| `transactionType` | `''` | Enum value |
| `q` | `''` | Búsqueda debounced |
| `page` | `1` | Reset al cambiar filtros |
| `limit` | `20` | |
| `sort` | `createAt` | |
| `order` | `desc` | |

## OrderListResponse (normalizado)

```js
{
  data: Order[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  }
}
```

Legacy: `meta` calculada tras `filterOrdersClientSide`.

## OrderTimelineEvent (UI)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | string | UUID local o server |
| `type` | enum | `created`, `state_changed`, `transaction_changed`, `admin_note_added`, `optimistic_*` |
| `payload` | object | `{ fromLabel?, toLabel?, note? }` — labels español |
| `createdAt` | ISO string | |
| `isOptimistic` | boolean | true hasta sync backend |

## AdminNote (UI v1)

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | string | |
| `text` | string | Append-only |
| `createdAt` | ISO string | |

## OrderStatusConfig entry

| Valor API | label | badgeClassName |
|-----------|-------|----------------|
| `inProcess` | En proceso | rose |
| `partialPayment` | Señado | amber |
| `paid` | Pagado | emerald |

## WhatsAppOrderMessage

String multilínea generada por `buildWhatsAppOrderMessage({ order, shopUrl })`.

## Env consumption

| envs field | Uso en feature |
|------------|----------------|
| `whatsappNum` | RedirectToWhatsapp |
| `shopUrl` | Link en mensaje WhatsApp |
