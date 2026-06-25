# Tasks: Inventario admin — tabla mejorada + inhabilitar producto



**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/products-api-client.md](./contracts/products-api-client.md)



**Prerequisites**: Clarify Session 2026-06-23 integrado; plan y contratos listos.



## Format



`[ID] [P?] [Story] Description` — **[P]** = paralelo (archivos distintos, sin deps)



---



## Phase 1: Foundational — Utils + tests (bloqueante)



**Purpose**: Helpers puros de disponibilidad, filtros admin/shop, paginación y precio antes de UI.



- [x] T001 [P] Crear `src/utils/products/isProductAvailableForSale.js` — `stock !== false`; legacy activo

- [x] T002 [P] Crear `src/utils/products/productAvailabilityConfig.js` — labels Activo/Inhabilitado, badges emerald/stone

- [x] T003 [P] Crear `src/utils/products/productAvailabilityConfig.test.js`

- [x] T004 [P] Crear `src/utils/products/formatProductPrice.js` — `Intl` ARS; fallback `—`

- [x] T005 [P] Crear `src/utils/products/formatProductPrice.test.js`

- [x] T006 [P] Crear `src/utils/products/paginateItems.js` — `{ data, meta }` client-side

- [x] T007 [P] Crear `src/utils/products/paginateItems.test.js`

- [x] T008 Crear `src/utils/products/filterInventoryProducts.js` — searchQuery + statusFilter all|active|disabled

- [x] T009 Crear `src/utils/products/filterInventoryProducts.test.js`

- [x] T010 [US5] Modificar `src/utils/products/filterCatalogProducts.js` — excluir `stock === false` vía `isProductAvailableForSale`

- [x] T011 [US5] Actualizar `src/utils/products/filterCatalogProducts.test.js` — casos stock false + legacy sin stock



**Checkpoint**: `npm test -- src/utils/products` pasa.



---



## Phase 2: Services + Context (bloqueante para toggle)



**Purpose**: PUT mínimo `{ stock }` y actualización de `ProductsContext`.



- [x] T012 [P] [US4] Crear `src/services/Products/setProductAvailability.js` — wrapper `UpdateProduct(id, { stock })`

- [x] T013 [US4] Modificar `src/contexts/Products/ProductsProvider.jsx` — `setProductAvailability`; sync localStorage; sin optimismo



**Checkpoint**: toggle actualiza array `products` en context tras API OK.



---



## Phase 3: US1 — Tabla admin en filas con estilo (P1)



**Goal**: Tabla premium en filas; thumb 40px; columnas Producto | Precio | Estado | Acciones.



**Independent Test**: `/dashboard` → tabla filas; thumb + badge categoría; precio ARS; fila inhabilitada atenuada.



- [x] T014 [US1] Refactor `src/components/Products/TableProducts.jsx` — layout header + CTA "+ Cargar producto"

- [x] T015 [US1] Columna Producto — thumb 40×40 (`toCloudinaryDisplayUrl`), placeholder FiImage, nombre + badge 1ª categoría

- [x] T016 [US1] Columnas Precio (right-aligned), Estado (badge config), filas inhabilitadas atenuadas

- [x] T017 [US1] thead sticky; contenedor glass + `overflow-x-auto`; quitar toast al editar



**Checkpoint**: SC-001 parcial (tabla estilo); SC-008 (sin toast editar).



---



## Phase 4: US2 — Paginado y búsqueda client-side (P1)



**Goal**: Toolbar con búsqueda debounced, filtro Estado, selector page size, footer paginado.



**Independent Test**: 13+ productos → paginar; buscar por nombre; filtrar Activos/Inhabilitados.



- [x] T018 [US2] Toolbar — input búsqueda debounce ~400ms (patrón `Orders.jsx`)

- [x] T019 [US2] Select Estado: Todos | Activos | Inhabilitados; reset page al cambiar filtros

- [x] T020 [US2] Select Mostrar: 10 | 20 | 50; integrar `filterInventoryProducts` + `paginateItems`

- [x] T021 [US2] Footer — "Mostrando X–Y de Z" + Anterior/Siguiente; empty states búsqueda/sin productos



**Checkpoint**: SC-001, SC-002.



---



## Phase 5: US3 + US4 — Acciones agrupadas + toggle disponibilidad (P1)



**Goal**: Ver/Editar/Inhabilitar en una columna; modal confirm; PUT `{ stock }`.



**Independent Test**: Acciones agrupadas; modal confirm; Network PUT solo `{ stock }`.



- [x] T022 [P] [US4] Crear `src/components/Products/ConfirmProductAvailabilityModal.jsx` — glass Saphire; disable/enable copy

- [x] T023 [US3] Columna Acciones — grupo rounded-full: FiEye, FiEdit3, FiEyeOff/FiEye; aria-labels español

- [x] T024 [US3][US4] Wire Ver → `ModalViewProduct`; Editar → `/product/edit/:id`; toggle → modal → `setProductAvailability`

- [x] T025 [US4] Toast éxito/error; cancel modal sin API; error sin cambio optimista de UI



**Checkpoint**: SC-003, SC-005, SC-007.



---



## Phase 6: US5 — Ocultar inhabilitados en tienda pública (P1)



**Goal**: Shop y Home no muestran productos `stock === false`.



**Independent Test**: Inhabilitar en admin → ausente en `/shopProducts` y carrusel Home.



- [x] T026 [US5] Verificar `filterCatalogProducts` aplicado en `src/components/Products/Products.jsx` (sin bypass)

- [x] T027 [US5] Modificar `src/components/Home/CarruselProducts.jsx` — filtrar `isProductAvailableForSale` antes de destacados



**Checkpoint**: SC-004.



---



## Phase 7: Backend mínimo (paralelo con Phase 2–5)



**Purpose**: DTO acepte `stock` en PUT parcial.



- [x] T028 [US4] `SaphireSouvenirs-Back/src/modules/products/dto/update-product.dto.ts` — `@IsOptional() @IsBoolean() stock?: boolean`



**Checkpoint**: PUT `{ stock: false }` persiste en DB (smoke manual o test existente back).



---



## Phase 8: Verify



- [x] T029 Ejecutar `npm test` — suite completa incl. `src/utils/products/`

- [ ] T030 Smoke manual según [quickstart.md](./quickstart.md)

- [x] T031 Marcar tasks completadas en este archivo



**Checkpoint**: SC-001–SC-008.



---



## Dependencies & Execution Order



```text

Phase 1 (T001–T011) ──blocks──► Phase 2–6

Phase 2 (T012–T013) ──blocks──► Phase 5 (T024 toggle)

Phase 3 (US1) + Phase 4 (US2) ──► overlap tras T001–T011 (mismo TableProducts.jsx)

Phase 5 (US3/4) ──► depende T013 + T022

Phase 6 (US5) ──► depende T010–T011 (filterCatalog)

Phase 7 (T028 back) ──► paralelo; no bloquea front si Object.assign ya persiste stock

```



### MVP sugerido (tabla usable rápido)



1. Phase 1 → Phase 3 → Phase 4 → T029  

2. Validar quickstart § Tabla + Paginado  

3. Luego Phase 2 + 5 + 6 + 7 (toggle + shop + DTO)



### Parallel opportunities



- T001–T007 en paralelo (archivos distintos)

- T012 + T022 en paralelo tras Phase 1

- T026 + T027 en paralelo tras T010

- T028 back en paralelo con front Phases 2–5



---



## Notes



- **NO** cards/grid en inventario admin (FR-001).

- UI nunca muestra "stock"; solo Activo/Inhabilitado.

- `apiClient` only; sin `fetch` directo.

- Reutilizar `normalizeSearchText` / `productMatchesName` desde `filterCatalogProducts.js` en admin filter.

- Backend order validation (`stock === false`) es red de seguridad; no reemplaza filtro shop.

