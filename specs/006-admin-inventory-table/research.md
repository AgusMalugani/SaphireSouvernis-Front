# Research: 006-admin-inventory-table

**Date**: 2026-06-23

## R1: Campo `stock` como visibilidad en tienda

**Decision**: Reutilizar `Product.stock: boolean` existente en backend; UI "Activo" /
"Inhabilitado"; no renombrar campo en v1.

**Rationale**: Columna ya en DB y en validación de órdenes (`orderdetails.service`);
cero migración; PUT parcial `{ stock }` suficiente.

**Alternatives rejected**:
- Nuevo campo `isPublished` — migración + duplicación semántica con `stock`
- DELETE lógico — out of scope; más invasivo

## R2: Paginación client-side en inventario admin

**Decision**: Paginar en cliente sobre `products[]` del context; default `limit=10`.

**Rationale**: Catálogo ~13–50 ítems; mismo patrón probado en Pedidos fallback;
sin cambios en `GET /products`.

**Alternatives rejected**:
- Paginación server-side — over-engineering para volumen actual
- Sin paginado — tabla larga poco escaneable con mejoras de filas

## R3: Filtros admin vs tienda pública

**Decision**: Dos pipelines:
- **Tienda**: `filterCatalogProducts` excluye `stock === false` vía `isProductAvailableForSale`
- **Admin**: `filterInventoryProducts` con `statusFilter: all|active|disabled` + búsqueda por nombre

**Rationale**: Admin debe listar inhabilitados; shop no. Separar evita flags confusos en util de catálogo.

**Alternatives rejected**:
- Un solo filtro con flag `includeDisabled` en shop — riesgo de filtrar mal en consumidor público

## R4: Confirmación toggle disponibilidad

**Decision**: Modal Saphire (glass) para inhabilitar **y** habilitar; componente dedicado
`ConfirmProductAvailabilityModal`.

**Rationale**: Clarify 2026-06-23; consistencia con `ModalViewProduct` y design system;
evita `window.confirm` tosco.

**Alternatives rejected**:
- Solo confirm al inhabilitar — asimetría; usuario pidió modal en ambas direcciones vía opción modal_saphire
- Toast undo — complejidad innecesaria v1

## R5: Miniatura 40×40 en fila de tabla

**Decision**: Thumb + nombre + badge categoría en columna Producto; placeholder FiImage;
`toCloudinaryDisplayUrl` para URLs Cloudinary.

**Rationale**: Clarify UX — scaneabilidad tipo data table v0 sin convertir a cards;
reutiliza util de imagen existente.

**Alternatives rejected**:
- Solo texto — menos premium; peor identificación visual
- Cards en mobile — explícitamente out of scope (overflow-x-auto en tabla)

## R6: Columnas de tabla

**Decision**: Producto | Precio | Estado | Acciones (4 columnas); categoría solo dentro de Producto.

**Rationale**: Clarify 2026-06-23 product_only; menos redundancia que columna Categoría separada.

## R7: Backend DTO mínimo

**Decision**: Agregar `@IsOptional() @IsBoolean() stock?: boolean` en `UpdateProductDto`
en `SaphireSouvenirs-Back`; sin filtrar `GET /products`.

**Rationale**: `PartialType(CreateProductDto)` no incluye `stock` hoy; validación explícita
para PUT parcial seguro.

**Alternatives rejected**:
- PATCH dedicado `/products/:id/availability` — endpoint nuevo out of scope
