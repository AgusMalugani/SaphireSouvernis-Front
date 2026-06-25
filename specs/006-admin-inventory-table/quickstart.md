# Quickstart: 006-admin-inventory-table

## Prerrequisitos

- `.env` con `VITE_API_URL`
- Admin login para `/dashboard`
- Backend con columna `Product.stock` (default true)
- Opcional: `UpdateProductDto.stock` desplegado en back

## Tests automatizados

```bash
npm test
```

Debe pasar (nuevos + existentes):

- `src/utils/products/filterCatalogProducts.test.js` (exclusión `stock: false`)
- `src/utils/products/filterInventoryProducts.test.js`
- `src/utils/products/paginateItems.test.js`
- `src/utils/products/productAvailabilityConfig.test.js` (si se crea)

## Smoke — Tabla admin (SC-001, SC-003)

1. Login admin → `/dashboard`.
2. **Esperado**: tabla en filas; columnas Producto (thumb+ nombre + categoría), Precio, Estado, Acciones.
3. Grupo acciones: Ver | Editar | Inhabilitar/Habilitar en una columna.
4. Click Editar → `/product/edit/:id` **sin toast** de redirección.
5. CTA "+ Cargar producto" → `/product/create`.

## Smoke — Paginado y búsqueda (SC-002)

1. Con 13+ productos, verificar footer "Mostrando 1–10 de N".
2. Siguiente / Anterior funcionan; deshabilitados en extremos.
3. Cambiar "Mostrar" a 20 → reset página 1.
4. Buscar por nombre (debounce) → resultados filtrados.
5. Filtro Estado: Activos / Inhabilitados / Todos.

## Smoke — Inhabilitar / Habilitar (SC-004, SC-005, SC-007)

1. DevTools Network abierto.
2. Inhabilitar producto → modal Saphire → Confirmar.
3. **Esperado**: `PUT /products/:id` body **solo** `{ "stock": false }`.
4. Badge fila → "Inhabilitado"; fila atenuada.
5. Abrir `/shopProducts` → producto **no** visible.
6. Home → carrusel **no** muestra producto.
7. Volver admin → Habilitar → `{ "stock": true }` → visible en shop.

## Smoke — Modal confirmación cancelar

1. Inhabilitar → Cancelar en modal.
2. **Esperado**: sin PUT; estado sin cambios.

## Smoke — Labels (SC-010 implícito)

- UI nunca muestra la palabra "stock".
- Badges: "Activo" / "Inhabilitado" únicamente.
