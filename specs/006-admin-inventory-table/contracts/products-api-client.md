# Contract: Products API Client (Frontend) — availability toggle

**Feature**: 006-admin-inventory-table  
**Type**: HTTP via `apiClient`

## Endpoints usados v1

| Método | Path | Auth | Uso |
|--------|------|------|-----|
| GET | `/products` | No | Catálogo admin + shop (context) |
| GET | `/products/:id` | No | ModalViewProduct |
| PUT | `/products/:id` | Bearer admin | Toggle `{ stock }` + edit existente |

## PUT /products/:id — toggle disponibilidad

**Request (mínimo v1)**:

```json
{ "stock": false }
```

```json
{ "stock": true }
```

**Response**: objeto `Product` actualizado (incluye `stock`, `categories`, etc.)

**Prohibido en toggle**: enviar `name`, `price`, `categories`, `img_url` junto con stock
salvo que el servicio wrapper lo restrinja a payload mínimo.

## GET /products — sin cambio v1

- Devuelve array completo (activos + inhabilitados)
- Filtrado shop: **frontend** vía `isProductAvailableForSale`
- Filtrado admin: **frontend** vía `filterInventoryProducts`

## Backend DTO (mínimo)

`UpdateProductDto` debe aceptar:

```typescript
@IsOptional()
@IsBoolean()
stock?: boolean;
```

## Failure matrix

| Condición | Comportamiento UI |
|-----------|-------------------|
| PUT 401/403 | Toast error; modal cierra; sin cambio local |
| PUT 4xx/5xx | Toast error; estado UI sin cambio optimista |
| GET products sin `stock` en item | Tratar como activo |
| Product `stock: false` en shop | Excluido de grilla y carrusel |
| Orden con producto inhabilitado | Backend 400 (red de seguridad) |

## Services front

| Función | Archivo | Notas |
|---------|---------|-------|
| `fetchAllProducts` | `FindAllProducts.service.js` | Sin cambio |
| `UpdateProduct` | `UpdateProduct.js` | Reutilizar |
| `setProductAvailability` | `setProductAvailability.js` (nuevo) | Wrapper `UpdateProduct(id, { stock })` |
