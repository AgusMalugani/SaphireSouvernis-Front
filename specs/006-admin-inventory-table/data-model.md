# Data Model: 006-admin-inventory-table (Frontend + DTO mínimo)

**Feature**: 006-admin-inventory-table  
**Scope**: Shapes UI/servicios; persistencia vía `Product.stock` existente.

## Product (existente — API)

| Campo | Tipo | Admin UI | Shop UI |
|-------|------|----------|---------|
| `id` | UUID | Acciones, modal | Catálogo |
| `name` | string | Columna Producto | Catálogo |
| `price` | number | Columna Precio (ARS) | Catálogo |
| `stock` | boolean | Estado Activo/Inhabilitado | Filtro visibilidad |
| `img_url` | string | Thumb 40×40 | Catálogo |
| `categories` | `{ name }[]` | Badge 1ª categoría en Producto | Filtros |
| `details` | string | — | Detalle |

### Semántica `stock` (v1)

| Valor | Label admin | Visible en shop |
|-------|-------------|-----------------|
| `true` | Activo | Sí |
| `undefined` / `null` | Activo (legacy) | Sí |
| `false` | Inhabilitado | No |

## InventoryFilters (UI state — admin only)

| Campo | Default | Notas |
|-------|---------|-------|
| `searchQuery` | `''` | Debounce ~400ms; match en `name` |
| `statusFilter` | `'all'` | `'all'` \| `'active'` \| `'disabled'` |
| `page` | `1` | Reset al cambiar search/status/limit |
| `limit` | `10` | Selector 10 \| 20 \| 50 |

## PaginatedList (normalizado client-side)

```js
{
  data: Product[],
  meta: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  }
}
```

## ProductAvailabilityConfig (UI)

| Condición | label | badgeClassName |
|-----------|-------|----------------|
| `stock !== false` | Activo | emerald border/bg |
| `stock === false` | Inhabilitado | stone/amber border/bg |

Helper: `getProductAvailabilityConfig(product)` → `{ label, className, isActive }`

## ConfirmAvailabilityModal state

| Campo | Tipo | Notas |
|-------|------|-------|
| `isOpen` | boolean | |
| `productId` | string | |
| `productName` | string | Copy modal |
| `nextStock` | boolean | `false` = inhabilitar |
| `isSubmitting` | boolean | Disable confirm |

## CatalogFilters (shop — sin cambio de shape)

`filterCatalogProducts` aplica `isProductAvailableForSale` antes de categoría/búsqueda.

## HTTP toggle (referencia)

```
PUT /products/:id
Authorization: Bearer {admin}
Body: { "stock": false | true }
Response: Product (incl. stock)
```
