---
description: "Task list for feature 002-product-view-cache (Frontend)"
---

# Tasks: Optimización vista/edición producto (cache-first + UX)

**Input**: Design documents from `specs/002-product-view-cache/`

**Prerequisites**: plan.md, spec.md (Status: Ready)

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Foundational (utils + tests)

- [x] T001 [P] Crear `src/utils/products/resolveProductFromCatalog.js` + `normalizeProductForEdit`
- [x] T002 [P] Crear `src/utils/images/cloudinaryDisplayUrl.js` (elegibilidad host + `/upload/`)
- [x] T003 [P] Tests Vitest: `resolveProductFromCatalog.test.js`, `cloudinaryDisplayUrl.test.js`

## Phase 2: User Story 1 + 2 — Modal cache-first + skeleton (P1)

- [x] T004 [US1] Crear hook `src/hooks/useProductDetail.js` (cache-first, fetch condicionado, cancelación)
- [x] T005 [US2] Crear `ProductDetailSkeleton.jsx` (layout espejo: imagen + textos + precio)
- [x] T006 [US1][US2] Refactor `ModalViewProduct.jsx`: hook, skeleton, Cloudinary, error inline + toast

## Phase 3: User Story 3 + 4 — Edición cache-first + imágenes (P2)

- [x] T007 [US3] Refactor `EditProduct.jsx`: hook, skeleton loading, error inline + toast
- [x] T008 [US4] Preview edición con `toCloudinaryDisplayUrl` en cache hit / fetch miss

## Phase 4: Polish

- [x] T009 Actualizar spec.md clarifications Q1–Q5, Status Ready, FR-011
- [x] T010 [P] Crear plan.md, tasks.md, quickstart.md
- [x] T011 Ejecutar `npm test` y verificar lint en archivos tocados

**Checkpoint**: SC-001–SC-005 verificables; quickstart manual para SC-006
