# Implementation Plan: Edición de producto sin re-subir imagen

**Branch**: `004-edit-product-keep-image` | **Date**: 2026-06-19 | **Spec**: [spec.md](./spec.md)

## Summary

Corregir validación del paso Imagen en edición: permitir avanzar si `img_url` existe
sin archivo nuevo. Mantener imagen obligatoria en creación. UX de edición con copy
claro, "Cambiar imagen" sin borrar preview, preview Cloudinary con fallback, regla
pura testeada con Vitest.

## Technical Context

**Stack**: React 19, Tailwind v4, Vitest, react-toastify

**Root cause**: `ProductStep2.handleAvanzar` valida solo `file`; ignora `img_url` en edición.

**Submit OK**: `EditProduct.handleSubmit` ya preserva `img_url` cuando `file` es null.

## Files

| Acción | Archivo |
|--------|---------|
| CREATE | `src/utils/products/canAdvanceFromImageStep.js` |
| CREATE | `src/utils/products/canAdvanceFromImageStep.test.js` |
| CREATE | `src/components/Products/ProductImagePreview.jsx` (opcional: `onError` fallback) |
| MODIFY | `src/components/Products/formProductStep/ProductStep2.jsx` |
| MODIFY | `src/components/Products/FormProduct.jsx` |
| MODIFY | `src/components/Products/EditProduct.jsx` |
| MODIFY | `src/views/CreateProduct.jsx` (prop `mode="create"`) |

## Design

### Regla pura

```js
canAdvanceFromImageStep({
  mode: 'create' | 'edit',
  hasNewFile: boolean,
  existingImageUrl: string,
})
// create: requires hasNewFile
// edit: requires hasNewFile OR existingImageUrl.trim().length > 0
```

### Wizard mode

- `FormProduct` recibe `mode` y lo pasa a `ProductStep2`.
- `CreateProduct` → `mode="create"`; `EditProduct` → `mode="edit"`.

### ProductStep2 (edición)

- `handleAvanzar`: usa `canAdvanceFromImageStep` + toasts según FR-002 / FR-008.
- Si `mode === 'edit'` y hay `img_url`: mostrar preview + FR-007 copy.
- "Cambiar imagen": `<input type="file" ref>` oculto; botón dispara `.click()` **sin**
  llamar `handleOnChangeImage(null)`.
- Preview: componente con `src={displayUrl}` y `onError` → `src={originalUrl}`.

### EditProduct

- Ajustar `handleOnChangeImage(null)` si aún se usa: en edit no debe borrar preview
  cuando hay `img_url` (o dejar de pasar null desde paso 2).

## Constitution Check

- [x] Sin cambios backend / apiClient
- [x] Vitest en utils puros (FR-010)
- [x] Tailwind + design system Saphire
- [x] Diff mínimo; wizard 3 pasos intacto

## Phase Breakdown

1. Utils + tests (`canAdvanceFromImageStep`)
2. `FormProduct` mode + `ProductStep2` validación/UX
3. Preview fallback + EditProduct "Cambiar imagen"
4. Smoke manual quickstart + `npm test`
