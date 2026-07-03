# Tasks: Galería multi-imagen por producto (1–3 fotos)

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/products-api-client.md](./contracts/products-api-client.md)

**Prerequisites**: Back 008 desplegado en dev/staging (envelope + `img_urls` + `files`). Spec ✅ clarify ✅ plan ✅.

**Tests**: Vitest obligatorio (constitución VII; FR-011) — helpers puros y regla paso imagen.

**Organization**: Por user story — US1 galería modal, US2 thumbs, US3 admin wizard, US4 helpers.

## Format

`[ID] [P?] [Story] Description` — **[P]** = paralelo (archivos distintos, sin deps)

---

## Phase 1: Setup (gate)

**Purpose**: Confirmar API Back 008 antes de integrar servicios.

- [ ] T001 Verificar gate Back 008: `GET /api/v1/products` devuelve `{ data: [...] }` con `img_urls`; documentar en notas de sesión si OK

---

## Phase 2: Foundational — Utils, apiClient, services (bloqueante)

**Purpose**: Helpers de imagen, envelope unwrap, `putFormData` y lectura API antes de UI.

**⚠️ CRITICAL**: Ninguna user story UI hasta completar checkpoint Phase 2.

- [x] T002 [P] Crear `src/utils/api/unwrapApiData.js` — unwrap `{ data: T }` con fallback legacy
- [x] T003 [P] Crear `src/utils/api/unwrapApiData.test.js` — casos envelope y respuesta plana
- [x] T004 Agregar `putFormData(path, formData)` en `src/services/apiClient.js`
- [x] T005 [P] Crear `src/utils/products/productImageUrls.js` — `getProductImageUrls`, `getPrimaryProductImageUrl`, `hasValidProductImages`, `isPlaceholderImageUrl`, constante placeholder
- [x] T006 [P] Crear `src/utils/products/productImageUrls.test.js` — img_urls, fallback img_url, placeholder, vacío
- [x] T007 [P] Crear `src/utils/products/buildProductMetadataPayload.js` — strip `id`, `img_url`, `img_urls`; pick metadata DTO
- [x] T008 Crear `src/utils/products/buildProductMultipartFormData.js` — metadata + `categories` repetidas + `files` (1–3)
- [x] T009 Crear `src/utils/products/buildProductMultipartFormData.test.js` — keys FormData sin `file`/`img_url`
- [x] T010 [P] Modificar `src/services/Products/FindAllProducts.service.js` — `unwrapApiData` en response
- [x] T011 [P] Modificar `src/services/Products/OneProductById.js` — `unwrapApiData` en response
- [x] T012 Modificar `src/services/Products/UpdateProduct.js` — `unwrapApiData`; aceptar payload metadata ya construido
- [x] T013 Crear `src/services/Products/updateProductWithFiles.js` — `apiClient.putFormData` + unwrap
- [x] T014 Modificar `src/utils/products/resolveProductFromCatalog.js` — `normalizeProductForEdit` preserva `img_urls`

**Checkpoint**: `npm test -- src/utils/api src/utils/products/productImageUrls src/utils/products/buildProductMultipartFormData` pasa; GET productos devuelve objetos con `img_urls` en context.

---

## Phase 3: US4 — Helpers y regla paso imagen (Priority: P2)

**Goal**: Regla pura multi-imagen testeable; prerequisito de wizard US3.

**Independent Test**: Vitest matriz create/edit × files count × existingImageUrls.

- [x] T015 [US4] Modificar `src/utils/products/canAdvanceFromImageStep.js` — `newFilesCount`, `existingImageUrls[]`; delegar validación a `hasValidProductImages`
- [x] T016 [US4] Modificar `src/utils/products/canAdvanceFromImageStep.test.js` — casos 0/1/3 files; edit con URLs persistidas; placeholder sin imagen

**Checkpoint**: `npm test -- canAdvanceFromImageStep` pasa.

---

## Phase 4: US1 — Galería en modal detalle (Priority: P1) 🎯 MVP

**Goal**: 1–3 fotos navegables en `ModalViewProduct` (tienda + admin Ver).

**Independent Test**: Producto 2–3 imgs → modal con flechas/dots; 1 img sin controles; legacy solo `img_url` OK.

- [x] T017 [US1] Crear `src/components/Products/ProductImageGallery.jsx` — props `imageUrls`, `alt`; 1 vs 2–3 slides; Fi chevrons; dots; teclado ←/→; `aria-label`; `ProductImagePreview` por slide
- [x] T018 [US1] Modificar `src/components/Products/ModalViewProduct.jsx` — reemplazar single `<img>` por `ProductImageGallery` + `getProductImageUrls(product)`; mantener skeleton/error 002

**Checkpoint**: Smoke US1 parcial en quickstart (galería modal) con Back 008.

---

## Phase 5: US2 — Thumbnail principal catálogo y carrito (Priority: P1)

**Goal**: Solo imagen principal en shop, carrito, admin thumb y órdenes.

**Independent Test**: Producto 3 fotos → tarjeta y carrito muestran `img_urls[0]`; mismo URL en tabla admin.

- [x] T019 [P] [US2] Modificar `src/components/Products/Products.jsx` — pasar `getPrimaryProductImageUrl(prod)` a `Product`
- [x] T020 [P] [US2] Modificar `src/components/Products/Product.jsx` — thumb + `addToCart` con URL principal vía helper/`toCloudinaryDisplayUrl`
- [x] T021 [P] [US2] Modificar `src/components/Products/TableProducts.jsx` — thumb 40×40 con `getPrimaryProductImageUrl` + `toCloudinaryDisplayUrl`
- [x] T022 [P] [US2] Modificar `src/components/Orders/ViewBuyOrder.jsx` — imagen principal helper
- [x] T023 [P] [US2] Modificar `src/components/Orders/PostShopOrderSummary.jsx` — imagen principal helper

**Checkpoint**: SC-005 — misma imagen principal en catálogo, carrito, tabla y órdenes.

---

## Phase 6: US3 — Admin subir y previsualizar 1–3 imágenes (Priority: P1)

**Goal**: Wizard create/edit multi-file; submit POST/PUT según contrato; sin `ImageProduct` en edit.

**Independent Test**: Create 2 files; edit 3 persistidas sin re-upload; edit reemplazo con PUT multipart; 4 files → toast max 3.

- [x] T024 [US3] Modificar `src/components/Products/FormProduct.jsx` — props `files[]`, `previewUrls[]`, `existingImageUrls[]`; pasar a Step2/3
- [x] T025 [US3] Modificar `src/components/Products/formProductStep/ProductStep2.jsx` — input `multiple`; grid previews; max 3 toast; min 1 create; edit URLs persistidas; drag-drop multi; `canAdvanceFromImageStep` nueva firma
- [x] T026 [US3] Modificar `src/components/Products/formProductStep/ProductStep3.jsx` — resumen grid multi (persistidas o blobs)
- [x] T027 [US3] Modificar `src/views/CreateProduct.jsx` — estado `files[]`/`previewUrls[]`; revoke blobs; submit `buildProductMultipartFormData` + `CreateNewProduct`; sin `img_url`/`file`; en catch submit mostrar `toast.error(error.message)` (400 MIME u otros del API)
- [x] T028 [US3] Modificar `src/services/Products/CreateNewProduct.js` — `unwrapApiData` en response (FR-010); path sin cambio; caller envía FormData con `files`
- [x] T029 [US3] Modificar `src/components/Products/EditProduct.jsx` — `files[]`; init `existingImageUrls`; submit JSON metadata vs `updateProductWithFiles`; **eliminar** `ImageProduct`; revoke blobs; en catch submit mostrar `toast.error(error.message)` (400 MIME u otros del API)

**Checkpoint**: SC-003, SC-004, SC-007, SC-008; quickstart create/edit completo.

---

## Phase 7: Polish & Verify

**Purpose**: Tests globales, limpieza, smoke manual.

- [x] T030 Ejecutar `npm test` — suite completa verde
- [x] T031 [P] Eliminar imports muertos de `ImageProduct` si ningún caller restante en `src/`
- [ ] T032 Smoke manual según [quickstart.md](./quickstart.md) — todos los escenarios con Back 008 en dev

**Checkpoint**: Feature lista para `/speckit-analyze` → `/speckit-implement` cierre.

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (gate) → Phase 2 (foundational) → Phase 3 (US4) ─┐
                                                        ├→ Phase 6 (US3) needs US4
Phase 2 → Phase 4 (US1) ────────────────────────────────┘
Phase 2 → Phase 5 (US2)
Phase 4 + 5 + 6 → Phase 7 (polish)
```

### User Story Dependencies

| Story | Depende de | Independiente tras |
|-------|------------|-------------------|
| US1 Galería | Phase 2 (productImageUrls, GET unwrap) | Phase 4 |
| US2 Thumbs | Phase 2 (productImageUrls) | Phase 5 |
| US3 Admin | Phase 2 + US4 (canAdvance) + services | Phase 6 |
| US4 Helpers | Phase 2 (productImageUrls) | Phase 3 |

### Parallel Opportunities

**Phase 2** (tras T004 apiClient):

```text
T002+T003 | T005+T006 | T007+T008+T011 (utils paralelos)
T010+T011 (services GET paralelos)
```

**Phase 5 US2** — T019–T023 en paralelo (5 archivos distintos).

**Phase 7** — T031 paralelo a T030 si otro dev hace smoke.

---

## Parallel Example: US2

```bash
# Tras Phase 2, lanzar juntos:
T019 Products.jsx
T020 Product.jsx
T021 TableProducts.jsx
T022 ViewBuyOrder.jsx
T023 PostShopOrderSummary.jsx
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Phase 1 gate + Phase 2 foundational
2. Phase 4 US1 (galería modal)
3. **STOP** — demo galería en tienda con Back 008

### Incremental Delivery

1. Foundational → US1 galería → US2 thumbs → US4+US3 admin → Polish
2. Cada checkpoint validable sin romper anterior

### Suggested MVP Scope

**US1 + Phase 2** — galería modal consumiendo `img_urls` del API (valor visible en tienda).

---

## Notes

- No usar `POST /products/upload/:id` en flujos nuevos (contrato deprecado).
- PUT JSON edit: **omitir** campos imagen (`buildProductMetadataPayload`).
- Errores API upload (400 MIME, 0/>3 archivos): propagar `error.message` del `apiClient` en toast (T027, T029).
- Deploy Back antes de smoke manual (plan gate).
- Commit sugerido por phase o por checkpoint.
