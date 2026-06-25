# Feature Specification: Inventario admin — tabla mejorada + inhabilitar producto en tienda

**Feature Branch**: `006-admin-inventory-table`

**Created**: 2026-06-23

**Status**: Ready

**Input**: Mejorar la vista de inventario admin (`/dashboard`) manteniendo formato
**tabla en filas** (no cards): paginado client-side, búsqueda, toolbar, acciones
agrupadas (Ver / Editar / Inhabilitar), columna de estado, y ocultar productos
inhabilitados en la tienda pública. Reutilizar campo backend `stock` como
"visible en tienda" (UI: Activo / Inhabilitado).

**Repo**: `SaphireSouvernis-Front` (principal). Cambio mínimo opcional en
`SaphireSouvenirs-Back` (DTO `stock` en PUT).

## Contexto técnico (referencia)

### Estado actual

| Área | Situación |
|------|-----------|
| Inventario admin | `TableProducts.jsx`: tabla básica nombre + precio; columnas Ver y Editar separadas; sin paginado, búsqueda ni estado |
| Tienda pública | `Products.jsx` y `CarruselProducts.jsx` muestran todos los productos sin filtrar por `stock` |
| Backend | Entidad `Product.stock: boolean` (default `true`); orden rechazada si `stock === false`; `GET /products` devuelve todos |
| PUT producto | `UpdateProduct` vía `apiClient`; DTO backend puede no declarar `stock` explícitamente |
| Patrón referencia | `Orders.jsx`: debounce búsqueda, paginación, estilos rose/stone |
| Semántica v1 | **No renombrar** `stock` → usar en UI como Activo/Inhabilitado |

### Componentes involucrados

- `src/views/DashboardAdmin.jsx`
- `src/components/Products/TableProducts.jsx`
- `src/components/Products/ModalViewProduct.jsx`
- `src/contexts/Products/ProductsProvider.jsx`
- `src/utils/products/filterCatalogProducts.js`
- `src/components/Products/Products.jsx`
- `src/components/Home/CarruselProducts.jsx`
- `src/services/Products/UpdateProduct.js`

## Clarifications

### Session 2026-06-23

- Q: ¿Confirmación al inhabilitar/habilitar? → A: **Modal ligero Saphire** (glass,
  título + copy + Cancelar / Confirmar) para **ambas** direcciones (inhabilitar y habilitar).
- Q: ¿Paginación default? → A: **`page=1`, `limit=10`**; selector `10 | 20 | 50`.
- Q: ¿Búsqueda admin? → A: por **`name`** (case-insensitive, sin acentos; reutilizar
  normalización de catálogo).
- Q: ¿Admin muestra inhabilitados? → A: **Sí, todos por defecto**; filtro toolbar
  `Todos | Activos | Inhabilitados`.
- Q: ¿Campo API para visibilidad? → A: reutilizar **`stock`** (`true` = Activo,
  `false` = Inhabilitado); `undefined`/`null` legacy → Activo.
- Q: ¿Backend en v1? → A: solo agregar `stock?: boolean` en `UpdateProductDto` si falta;
  sin filtrar `GET /products` en servidor.
- Q: ¿Miniatura en fila? → A: **Sí — 40×40px** (`rounded-xl`, `object-cover`) a la
  izquierda del nombre; placeholder con icono FiImage si no hay `img_url`. Sigue siendo
  fila de tabla, no card.
- Q: ¿Columna Categoría separada? → A: **No** — categoría como badge/subtítulo dentro de
  columna **Producto** únicamente; columnas finales: Producto, Precio, Estado, Acciones.

### Mapa de labels UI (canónico v1)

| Valor API (`stock`) | Label visible (español) | Badge |
|---------------------|-------------------------|-------|
| `true` o ausente | Activo | emerald |
| `false` | Inhabilitado | stone/amber |

**Prohibido** mostrar la palabra "stock" al usuario admin en v1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tabla admin en filas con mejor estilo (Priority: P1)

Como administrador, quiero ver el inventario en filas claras con mejor jerarquía visual,
para operar el catálogo sin cambiar a vista tipo card.

**Why this priority**: Es la pantalla operativa diaria del catálogo; hoy es demasiado
plana y poco escaneable.

**Independent Test**: Abrir `/dashboard` → tabla en filas con columnas Producto (thumb +
nombre + categoría), Precio, Estado, Acciones; sin layout tipo card/grid.

**Acceptance Scenarios**:

1. **Given** admin en `/dashboard`, **When** carga inventario, **Then** productos se
   muestran en **filas de tabla** (no cards).
2. **Given** viewport mobile, **When** tabla es más ancha que pantalla, **Then**
   contenedor permite scroll horizontal (`overflow-x-auto`) sin convertir filas en cards.
3. **Given** producto con categorías, **When** renderiza fila, **Then** columna
   **Producto** muestra miniatura 40×40, nombre semibold y badge pill de primera categoría
   (sin columna Categoría separada).
4. **Given** producto sin `img_url`, **When** renderiza fila, **Then** placeholder
   40×40 con icono FiImage en fondo stone/rose (sin romper layout).
5. **Given** precio numérico, **When** se muestra, **Then** formato moneda ARS
   (`Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`).
6. **Given** producto `stock: false`, **When** renderiza fila, **Then** fila atenuada
   (opacity o fondo stone) y badge "Inhabilitado".
7. **Given** header de tabla, **When** hay scroll vertical en listado largo, **Then**
   `thead` sticky opcional permanece visible.
8. **Given** encabezado de sección, **When** admin ve inventario, **Then** CTA
   "+ Cargar producto" navega a `/product/create`.
9. **Given** click en Editar, **When** navega a editar, **Then** no aparece toast
   redundante de redirección.

---

### User Story 2 - Paginado y búsqueda client-side (Priority: P1)

Como administrador, quiero paginar y buscar productos en inventario sin depender
del backend.

**Why this priority**: Escala operación; patrón ya validado en Pedidos.

**Independent Test**: Con 13+ productos, cambiar página y buscar por nombre → resultados
y contador actualizados sin refetch API.

**Acceptance Scenarios**:

1. **Given** catálogo cargado en context, **When** admin está en página 1 con
   `limit=10`, **Then** se muestran máximo 10 filas y footer indica rango
   (ej. "Mostrando 1–10 de 13").
2. **Given** más de una página, **When** admin pulsa Siguiente/Anterior, **Then**
   cambia página con botones deshabilitados en extremos (estilo `Orders.jsx`).
3. **Given** selector de tamaño de página, **When** elige 20 o 50, **Then**
   `limit` cambia y página resetea a 1.
4. **Given** input de búsqueda, **When** admin escribe con debounce ~400ms,
   **Then** filtra por `name` (normalización sin acentos) y resetea página a 1.
5. **Given** filtro Estado "Activos", **When** aplica, **Then** solo productos
   con `stock !== false`.
6. **Given** filtro Estado "Inhabilitados", **When** aplica, **Then** solo
   productos con `stock === false`.
7. **Given** filtro Estado "Todos", **When** aplica, **Then** muestra activos e
   inhabilitados (comportamiento admin por defecto).

---

### User Story 3 - Acciones agrupadas (Priority: P1)

Como administrador, quiero Ver, Editar e Inhabilitar/Habilitar en una sola columna
Acciones alineada a la derecha.

**Why this priority**: Reduce ruido visual y unifica operaciones por fila.

**Independent Test**: Cada fila tiene un grupo compacto de 3 botones icono; Ver abre
modal; Editar navega; tercer botón toggle visibilidad.

**Acceptance Scenarios**:

1. **Given** fila de producto, **When** renderiza, **Then** una sola columna
   "Acciones" (no columnas Ver/Acción separadas).
2. **Given** grupo de acciones, **When** se muestra, **Then** botones en contenedor
   `rounded-full border` con iconos FiEye, FiEdit3, FiEyeOff/FiEye según estado.
3. **Given** click Ver, **When** acción completa, **Then** abre `ModalViewProduct`
   existente con `idProduct`.
4. **Given** click Editar, **When** acción completa, **Then** navega a
   `/product/edit/:id` sin toast.
5. **Given** cualquier botón de acción, **When** renderiza, **Then** tiene
   `aria-label` descriptivo en español.

---

### User Story 4 - Inhabilitar producto (no visible en tienda) (Priority: P1)

Como administrador, quiero inhabilitar un producto para que no aparezca en la venta
pública, y poder reactivarlo después.

**Why this priority**: Operación de negocio sin borrar productos del catálogo.

**Independent Test**: Inhabilitar producto → desaparece de `/shopProducts`; habilitar
→ vuelve a aparecer; inventario admin siempre lo lista.

**Acceptance Scenarios**:

1. **Given** producto activo (`stock !== false`), **When** admin pulsa Inhabilitar,
   **Then** aparece **modal Saphire** de confirmación antes de ejecutar.
2. **Given** producto inhabilitado, **When** admin pulsa Habilitar,
   **Then** aparece el mismo patrón de modal de confirmación.
3. **Given** confirmación aceptada, **When** API responde OK, **Then** `PUT /products/:id`
   envía payload mínimo `{ stock: false }` o `{ stock: true }`; context y fila actualizan; toast éxito.
4. **Given** confirmación cancelada, **When** cierra modal, **Then** no se llama API ni cambia estado.
5. **Given** error de API, **When** toggle falla, **Then** toast error; estado UI
   no cambia optimistamente (o revierte).
6. **Given** producto inhabilitado, **When** admin ve inventario, **Then** sigue
   visible en tabla admin para reactivación.

---

### User Story 5 - Ocultar inhabilitados en tienda pública (Priority: P1)

Como cliente, no debo ver productos inhabilitados en el catálogo ni en destacados del Home.

**Why this priority**: Cierra el loop de negocio de la acción Inhabilitar.

**Independent Test**: Producto con `stock: false` no aparece en `/shopProducts` ni en
carrusel Home; producto activo sí.

**Acceptance Scenarios**:

1. **Given** producto `stock: false`, **When** cliente abre `/shopProducts`, **Then**
   no aparece en grilla ni en filtros de catálogo.
2. **Given** producto `stock: false`, **When** cliente ve Home, **Then** no aparece
   en `CarruselProducts` destacados.
3. **Given** producto sin campo `stock` (legacy), **When** cliente ve tienda,
   **Then** se trata como activo y es visible.
4. **Given** cliente intenta ordenar producto inhabilitado (edge), **When** backend
   procesa orden, **Then** rechaza con error existente ("no esta en stock") — red de
   seguridad documentada.
5. **Given** `filterCatalogProducts`, **When** corre test Vitest de stock,
   **Then** excluye `stock === false`.

---

### Edge Cases

- Catálogo vacío → empty state amigable en inventario (copy existente mejorado).
- Búsqueda sin resultados → mensaje "Sin resultados" / "Ningún producto coincide…".
- Un solo producto en página → paginado oculto o deshabilitado correctamente.
- Toggle en producto mientras búsqueda activa → fila actualiza; si filtro Estado
  excluye el nuevo estado, fila desaparece tras refetch local (comportamiento esperado).
- Producto sin categorías → badge "—" o celda vacía sin crash.
- Precio 0 o null → fallback seguro en formato moneda.
- Admin no autenticado → ruta protegida existente (`ProtectedRoute`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MUST mantener inventario admin como **tabla en filas**; prohibido grid/cards en v1.
- **FR-002**: MUST columnas: **Producto** (thumb 40×40 + nombre + badge categoría), **Precio** (ARS), **Estado**, **Acciones**.
- **FR-002b**: MUST NOT columna Categoría separada en v1.
- **FR-002c**: MUST placeholder imagen (FiImage) cuando `img_url` ausente.
- **FR-003**: MUST paginación client-side con `page`, `limit` (default 10), meta
  `{ total, page, limit, totalPages }`.
- **FR-004**: MUST búsqueda por nombre con debounce ~400ms; reset page al cambiar filtros.
- **FR-005**: MUST filtro toolbar Estado: Todos | Activos | Inhabilitados.
- **FR-006**: MUST acciones agrupadas: Ver, Editar, Inhabilitar/Habilitar en una columna.
- **FR-007**: MUST confirmación vía **modal Saphire** antes de toggle `stock` (inhabilitar y habilitar).
- **FR-008**: MUST `PUT /products/:id` con payload mínimo `{ stock: boolean }` vía `apiClient`.
- **FR-009**: MUST actualizar `ProductsContext` tras toggle exitoso.
- **FR-010**: MUST labels UI "Activo" / "Inhabilitado"; nunca mostrar "stock" al usuario.
- **FR-011**: MUST `filterCatalogProducts` excluir `stock === false` en tienda pública.
- **FR-012**: MUST aplicar mismo criterio en `CarruselProducts.jsx`.
- **FR-013**: MUST helper `isProductAvailableForSale(product)` (`stock !== false`).
- **FR-014**: MUST CTA "+ Cargar producto" en header inventario.
- **FR-015**: MUST NOT toast al navegar a editar desde inventario.
- **FR-016**: MUST usar Tailwind v4, `react-icons` (Fi), design system Saphire.
- **FR-017**: MUST NOT usar `fetch` directo; solo `apiClient`.
- **FR-018**: MUST Vitest para exclusión por `stock` en `filterCatalogProducts.test.js`.

### Contrato API (referencia v1)

```
PUT /products/:id  (admin, Bearer)
Body toggle: { "stock": false } | { "stock": true }
Response: Product actualizado (incl. stock)
```

Backend mínimo (si falta en DTO):

```typescript
@IsOptional()
@IsBoolean()
stock?: boolean;
```

**No** filtrar `GET /products` en backend v1.

### Key Entities (UI / front)

- **Product** (existente): `id`, `name`, `price`, `stock`, `categories[]`, `img_url`, `details`
- **InventoryFilters**: `{ searchQuery, statusFilter: 'all'|'active'|'disabled', page, limit }`
- **PaginatedList**: `{ data: Product[], meta: { total, page, limit, totalPages } }`
- **ProductAvailabilityLabel**: Activo | Inhabilitado

## Success Criteria *(mandatory)*

- **SC-001**: Inventario en `/dashboard` es tabla en filas con paginado funcional (10 default).
- **SC-002**: Búsqueda y filtro Estado funcionan sin refetch backend.
- **SC-003**: Acciones Ver/Editar/Inhabilitar agrupadas en una columna.
- **SC-004**: Inhabilitar → producto ausente en `/shopProducts` y carrusel Home.
- **SC-005**: Habilitar → producto visible de nuevo tras actualizar context.
- **SC-006**: `npm test` pasa incl. test `stock` en filterCatalogProducts.
- **SC-007**: PUT toggle envía solo `{ stock }` (verificable en red).
- **SC-008**: 0 toasts redundantes al editar desde inventario.

## Assumptions

- Volumen catálogo ~13–50 productos → paginación client-side suficiente.
- `GET /products` devuelve `stock` cuando existe en DB; legacy sin campo → activo.
- `ModalViewProduct` y rutas create/edit sin cambio de contrato.
- Confirmación: modal Saphire confirmado en Clarify 2026-06-23.
- Miniatura 40×40 en columna Producto confirmada (UX: scaneabilidad sin cards).
- Backend order validation con `stock === false` ya desplegado.

## Out of Scope

- Vista cards/grid en inventario admin
- Paginación server-side
- Renombrar campo `stock` → `isPublished` / `isActive`
- DELETE producto
- Bloquear URL directa a detalle de producto inhabilitado
- Bulk inhabilitar/habilitar
- Toggle stock desde formulario create/edit v1
- SDD backend completo (solo DTO mínimo)
- Filtrar `GET /products` en servidor

## Dependencias

| Dependencia | Tipo | Notas |
|-------------|------|-------|
| `ProductsContext` | Front | Fuente de verdad catálogo admin + shop |
| `UpdateProduct` | Front service | PUT parcial |
| `UpdateProductDto.stock` | Back opcional | Una línea si no está en DTO |
| `filterCatalogProducts` | Front util | Extender con availability |
| `Orders.jsx` | Patrón UI | Paginado + debounce |

## Archivos previstos (implementación)

**Crear**

- `src/utils/products/paginateItems.js` + `.test.js` (opcional)
- `src/utils/products/formatProductPrice.js` (opcional)
- `src/services/Products/setProductAvailability.js` (opcional wrapper)
- `src/components/Products/ConfirmProductAvailabilityModal.jsx` (modal confirm toggle)

**Modificar**

- `src/components/Products/TableProducts.jsx`
- `src/utils/products/filterCatalogProducts.js`
- `src/utils/products/filterCatalogProducts.test.js`
- `src/contexts/Products/ProductsProvider.jsx`
- `src/components/Products/Products.jsx`
- `src/components/Home/CarruselProducts.jsx`

**Backend (mínimo)**

- `SaphireSouvenirs-Back/src/modules/products/dto/update-product.dto.ts`
