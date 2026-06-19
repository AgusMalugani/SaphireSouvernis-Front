# Implementation Plan: Filtros catálogo público

**Branch**: `003-shop-catalog-filters` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Corregir doble scroll en categorías mobile, agregar barra sticky con búsqueda live
por nombre (solo `name`, sin acentos, AND con categoría), paridad desktop en sidebar.
Lógica pura en `filterCatalogProducts.js` + Vitest.

## Technical Context

**Stack**: React 19, Tailwind v4, Vitest, ProductsContext

**Files touched**:
- `src/utils/products/filterCatalogProducts.js` (CREATE)
- `src/components/Products/CatalogFilters.jsx` (CREATE, reemplaza SearchProducts)
- `src/components/Products/Products.jsx` (MODIFY)
- `src/App.css` (MODIFY — utility `scrollbar-none`)
- Delete `SearchProducts.jsx`

## Design

- Estado en `Products.jsx`: `selectedCategory`, `searchQuery`
- `productsFilter = useMemo(() => filterCatalogProducts(...), [...])`
- `CatalogFilters` layouts: `mobile-sticky` | `sidebar`
- Sticky: `sticky top-20 z-30 bg-stone-50/95 backdrop-blur-md`

## Constitution Check

- [x] Sin fetch directo — filtro client-side
- [x] Context API — products/categories existentes
- [x] Vitest — tests en utils
- [x] Tailwind + design system
