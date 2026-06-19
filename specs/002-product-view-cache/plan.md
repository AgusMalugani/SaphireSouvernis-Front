# Implementation Plan: Optimización vista/edición producto (cache-first + UX)

**Branch**: `002-product-view-cache` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-product-view-cache/spec.md`

## Summary

Eliminar fetches redundantes a `GET /products/:id` en `ModalViewProduct` y `EditProduct`
mediante resolución cache-first desde `ProductsContext.products` (incluye localStorage).
En cache miss: skeleton espejo del layout, fetch condicionado, toast + error inline.
Imágenes Cloudinary elegibles usan `w_400,h_400,c_fill`. Lógica pura testeada con Vitest.

## Technical Context

**Language/Version**: JavaScript (JSX), React 19, Vitest 3

**Primary Dependencies**: React Context, react-toastify, react-modal (existentes)

**Testing**: Vitest unit tests en `src/utils/products/` y `src/utils/images/`

**Target Platform**: Panel admin SPA (`SaphireSouvernis-Front`)

**Constraints**: Sin cambios backend; sin React Query; `apiClient` obligatorio; sin fetch directo

## Constitution Check

- [x] HTTP solo vía `apiClient` — `OneProductById` ya lo usa; sin cambios
- [x] Context API — reutiliza `ProductsContext` como cache
- [x] Vitest — tests en utils puros
- [x] Tailwind — skeleton con utilidades existentes
- [x] Workflow SDD: specify ✅ → clarify ✅ → plan (este doc) → tasks ✅ → implement

## Project Structure

```text
src/
├── hooks/
│   └── useProductDetail.js           # CREATE: cache-first + fetch miss
├── utils/
│   ├── products/
│   │   ├── resolveProductFromCatalog.js
│   │   └── resolveProductFromCatalog.test.js
│   └── images/
│       ├── cloudinaryDisplayUrl.js
│       └── cloudinaryDisplayUrl.test.js
├── components/Products/
│   ├── ModalViewProduct.jsx          # MODIFY
│   ├── EditProduct.jsx               # MODIFY
│   └── ProductDetailSkeleton.jsx     # CREATE
```

## Design Decisions

| Decisión | Elección |
|----------|----------|
| Cache source | `products` array en ProductsContext (localStorage + fetch + edit) |
| Fetch trigger | Solo `enabled && cache miss` (modal: `isOpen`) |
| Cancelación | Flag `cancelled` en cleanup de `useEffect` |
| Cloudinary | Insertar `w_400,h_400,c_fill` tras `/upload/` si host + path elegibles |
| Error UX | `toast.error` + mensaje inline; vista abierta |
| Skeleton | `ProductDetailSkeleton` compartido modal + edición loading |

## Phase Breakdown

1. **Utils + tests** — `resolveProductFromCatalog`, `cloudinaryDisplayUrl`, Vitest
2. **Hook** — `useProductDetail` centraliza cache-first y fetch miss
3. **UI** — Skeleton, refactor modal y edición
4. **Verify** — `npm test`, smoke manual (quickstart)
