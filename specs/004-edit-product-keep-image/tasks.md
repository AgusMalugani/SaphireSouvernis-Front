# Tasks: Edición de producto sin re-subir imagen



**Input**: [spec.md](./spec.md), [plan.md](./plan.md)



## Phase 1: Foundational (regla + tests)



- [x] T001 Crear `canAdvanceFromImageStep.js` + helper `hasExistingProductImage(url)`

- [x] T002 Crear `canAdvanceFromImageStep.test.js` — matriz create/edit × file × img_url



## Phase 2: US1 + US2 — Validación paso Imagen (P1)



- [x] T003 [US1][US2] `FormProduct.jsx`: prop `mode`; pasar a `ProductStep2`

- [x] T004 [US1][US2] `ProductStep2.jsx`: usar regla pura; toasts FR-002 / FR-008

- [x] T005 [US1] `CreateProduct.jsx`: `mode="create"`; `EditProduct.jsx`: `mode="edit"`



## Phase 3: US3 + clarifications UX (P2)



- [x] T006 [US3] `ProductStep2`: "Cambiar imagen" vía input ref (no clear preview)

- [x] T007 Copy FR-007 en paso 2 edición con imagen existente

- [x] T008 Preview Cloudinary + `onError` fallback (`ProductImagePreview`)

- [x] T009 Usar preview con fallback en `ProductStep3`



## Phase 4: Verify



- [x] T010 Ejecutar `npm test`

- [ ] T011 Smoke manual según [quickstart.md](./quickstart.md)



**Checkpoint**: SC-001–SC-006; sin regresión en creación

