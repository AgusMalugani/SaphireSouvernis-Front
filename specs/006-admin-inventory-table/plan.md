# Implementation Plan: Inventario admin — tabla mejorada + inhabilitar producto

**Branch**: `006-admin-inventory-table` | **Date**: 2026-06-23 | **Spec**: [spec.md](./spec.md)

## Summary

Refactor de `TableProducts.jsx`: tabla premium en **filas** con thumb 40×40, paginación
client-side, búsqueda debounced, filtro Estado, acciones agrupadas (Ver/Editar/Inhabilitar),
modal de confirmación Saphire, y toggle `stock` vía PUT mínimo. Ocultar productos
inhabilitados en shop (`Products.jsx`, `CarruselProducts.jsx`). Cambio mínimo backend:
`stock?: boolean` en `UpdateProductDto`.

**Clarify 2026-06-23**: modal confirm ambas direcciones; thumb 40px; categoría solo en
columna Producto; columnas Producto | Precio | Estado | Acciones.

## Technical Context

**Stack**: React 19, Vite, Tailwind v4, Vitest, Context API, `apiClient`, react-toastify

**Root causes**:
- `TableProducts` plano sin paginado/filtros/estado
- Shop no filtra `stock === false`
- `UpdateProductDto` no declara `stock` (CreateProductDto tampoco)
- Toast redundante al editar desde inventario

**Patrón referencia**: `Orders.jsx` (debounce, paginación, selects rounded-full)

## Project Structure

```text
src/
├── utils/products/
│   ├── isProductAvailableForSale.js      # CREATE (o inline en filter)
│   ├── productAvailabilityConfig.js      # CREATE — labels/badges Activo/Inhabilitado
│   ├── filterInventoryProducts.js        # CREATE — admin search + statusFilter
│   ├── filterCatalogProducts.js          # MODIFY — excluir stock false en shop
│   ├── paginateItems.js                  # CREATE
│   ├── formatProductPrice.js             # CREATE
│   └── *.test.js
├── components/Products/
│   ├── TableProducts.jsx                 # MODIFY — refactor principal
│   ├── ConfirmProductAvailabilityModal.jsx  # CREATE
│   └── InventoryProductRow.jsx           # CREATE (opcional — fila + acciones)
├── contexts/Products/
│   └── ProductsProvider.jsx              # MODIFY — setProductAvailability
├── services/Products/
│   └── setProductAvailability.js         # CREATE — wrapper PUT { stock }
├── components/Products/Products.jsx      # MODIFY — shop filter vía util
└── components/Home/CarruselProducts.jsx  # MODIFY — filter activos

SaphireSouvenirs-Back/
└── src/modules/products/dto/update-product.dto.ts  # MODIFY — stock optional
```

## Design

### 1. productAvailabilityConfig (P1)

```js
// stock !== false → { label: 'Activo', className: '...emerald...' }
// stock === false → { label: 'Inhabilitado', className: '...stone/amber...' }
getProductAvailabilityConfig(product)
isProductActive(product) // stock !== false
```

Nunca exponer "stock" en UI.

### 2. filterInventoryProducts (P1 — admin)

```js
filterInventoryProducts(products, {
  searchQuery: '',
  statusFilter: 'all' | 'active' | 'disabled',
})
// search: productMatchesName (reuse normalizeSearchText)
// status: all | active (stock !== false) | disabled (stock === false)
```

Separado de `filterCatalogProducts` para no mezclar reglas admin/shop.

### 3. filterCatalogProducts + shop (P1)

```js
isProductAvailableForSale(product) → product?.stock !== false

filterCatalogProducts(...):
  products.filter(isProductAvailableForSale)
    .filter(category)
    .filter(name)
```

`CarruselProducts`: filtrar con `isProductAvailableForSale` antes de `slice`.

### 4. paginateItems + formatProductPrice (P1)

```js
paginateItems(items, { page, limit }) → { data, meta }
formatProductPrice(price) → Intl ARS; fallback '—' si null
```

### 5. TableProducts layout (P1)

**Header row**:
- Título + contador + CTA "+ Cargar producto"

**Toolbar**:
- Input búsqueda (FiSearch, debounce 400ms)
- Select Estado (Todos/Activos/Inhabilitados)
- Select Mostrar (10/20/50)

**Table** (glass card, overflow-x-auto):
- thead sticky
- Columnas: Producto | Precio | Estado | Acciones
- Producto cell: flex row — thumb 40×40 (`toCloudinaryDisplayUrl`) + name + category badge
- Precio: right-aligned, semibold
- Estado: badge from config
- Acciones: icon group rounded-full border (FiEye, FiEdit3, FiEyeOff|FiEye)

**Footer**:
- "Mostrando X–Y de Z" + Anterior/Página N de M/Siguiente

**Empty states**:
- Sin productos en catálogo
- Sin resultados de búsqueda/filtro

### 6. ConfirmProductAvailabilityModal (P1)

Props: `isOpen`, `productName`, `mode: 'disable'|'enable'`, `onConfirm`, `onCancel`, `isSubmitting`

Copy ejemplo:
- Inhabilitar: "¿Inhabilitar «{name}»? Dejará de verse en la tienda."
- Habilitar: "¿Habilitar «{name}»? Volverá a mostrarse en la tienda."

Estilo: glass `bg-white/90 backdrop-blur`, botones Cancelar (ghost) + Confirmar (rose gradient).

### 7. ProductsProvider.setProductAvailability (P1)

```js
async setProductAvailability(productId, stock) {
  const updated = await setProductAvailabilityService(productId, stock);
  setProducts(prev => prev.map(p => p.id === productId ? updated : p));
  localStorage sync (existing pattern)
  return updated;
}
```

Sin update optimista; esperar respuesta API.

### 8. Backend DTO (P1 — mínimo)

```typescript
// update-product.dto.ts
@IsOptional()
@IsBoolean()
stock?: boolean;
```

Verificar que `Object.assign` en `products.service.update` persiste `stock`.

## Constitution Check

- [x] `apiClient` para `UpdateProduct` / `setProductAvailability`
- [x] Context API — `ProductsProvider`
- [x] Vitest en utils puros (filter, paginate, availability)
- [x] Tailwind v4 + design system Saphire + react-icons Fi
- [x] Sin axios/bootstrap
- [x] Tabla en filas — NO cards/grid (FR-001)
- [x] Backend diff mínimo (solo DTO)
- [x] Diff acotado dominio Products + 1 DTO back

## Phase Breakdown

| Phase | Scope | Deliverable |
|-------|-------|-------------|
| 1 | Utils + tests | availability config, isProductAvailableForSale, filterInventory, paginate, formatPrice, filterCatalog stock |
| 2 | Services + context | setProductAvailability service, ProductsProvider method |
| 3 | UI admin | ConfirmProductAvailabilityModal, TableProducts refactor |
| 4 | Shop | Products.jsx + CarruselProducts filter |
| 5 | Backend | UpdateProductDto.stock |
| 6 | Verify | npm test + quickstart manual |

## Dependencies

```text
Phase 1 ──blocks──► Phase 2–4
Phase 2 ──blocks──► Phase 3 (toggle)
Phase 5 (back DTO) ──parallel──► Phase 2–3 (front funciona si back ya persiste stock vía assign)
```

## References

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/products-api-client.md](./contracts/products-api-client.md)
- [quickstart.md](./quickstart.md)
