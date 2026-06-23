# Contract: Orders API Client (Frontend)

**Feature**: 005-orders-operations-overhaul  
**Type**: HTTP via `apiClient` + normalización legacy

## Endpoints usados v1

| Método | Path | Auth | Uso |
|--------|------|------|-----|
| POST | `/orders` | No | Checkout (sin cambios) |
| GET | `/orders` | Bearer admin | Listado admin |
| GET | `/orders/:id` | No | PostShop + detalle público |
| PUT | `/orders/:id` | Bearer admin | Editar state / entrega |
| GET | `/orders/:id/admin` | Bearer admin | Timeline + notas (futuro; 404 OK) |
| POST | `/orders/:id/notes` | Bearer admin | Agregar nota (futuro; 404 OK) |

## GET /orders — query params (siempre enviados)

| Param | Tipo | Ejemplo |
|-------|------|---------|
| `state` | string | `inProcess` |
| `transactionType` | string | `send` |
| `q` | string | `maria` |
| `page` | number | `1` |
| `limit` | number | `20` |
| `sort` | string | `createAt` |
| `order` | string | `desc` |

## Respuesta objetivo (backend futuro)

```json
{
  "data": [ { "id": "...", "state": "inProcess", "orderDetails": [...] } ],
  "meta": { "total": 42, "page": 1, "limit": 20, "totalPages": 3 }
}
```

## Respuesta legacy (hoy)

```json
[ { "id": "...", "state": "inProcess", ... } ]
```

## Normalización híbrida

```
normalizeOrdersListResponse(raw, filters):
  if Array.isArray(raw):
    filtered = filterOrdersClientSide(raw, filters)
    return { data: pageSlice(filtered), meta: computeMeta(filtered, filters) }
  if raw?.data && raw?.meta:
    return raw
  throw or return empty safe shape
```

## PUT /orders/:id — body mínimo

**Pago**: `{ "state": "paid" }`  
**Envío**: `{ "transactionType": "send", "address": "..." }`

Prohibido: enviar `orderDetails` anidados.

## POST /orders/:id/notes

```json
{ "note": "Cliente confirmó diseño por teléfono" }
```

Append-only; sin PUT/DELETE en v1.

## Failure matrix

| Condición | Comportamiento UI |
|-----------|-------------------|
| GET /orders 401 | Lista vacía / redirect login |
| GET /orders/:id/admin 404 | Timeline vacío + copy informativo |
| POST /orders/:id/notes 404 | Toast error; nota solo local opcional |
| Array legacy | Modo híbrido cliente |
| Valor state desconocido | Label "Estado desconocido" |
