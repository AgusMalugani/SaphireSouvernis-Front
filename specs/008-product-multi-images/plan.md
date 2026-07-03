# Implementation Plan: Galería multi-imagen por producto (1–3 fotos)

**Branch**: `008-product-multi-images` | **Date**: 2026-07-03 | **Spec**: [spec.md](./spec.md)

## Summary

Extender la UI de productos para soportar 1–3 imágenes: galería en `ModalViewProduct`,
thumbnails vía helper centralizado, wizard admin multi-upload (paso 2/3), y servicios
Products adaptados al contrato Back 008 (`img_urls[]`, campo multipart `files`, envelope
`{ data: T }`). Extiende 004 (edit sin re-upload) y 002 (cache detalle).

**Gate**: Back 008 desplegado en dev/staging antes de smoke manual.

**Contrato**: [contracts/products-api-client.md](./contracts/products-api-client.md) (mirror Back v1.0).

## Technical Context

**Stack**: React 19, Vite, Tailwind v4, Vitest, Context API, `apiClient`, react-toastify, react-icons (Fi/Hi)

**Root causes**:
- UI acoplada a `img_url` singular y `file` único en wizard
- `EditProduct` usa `ImageProduct` + PUT JSON con objeto completo (incl. `img_url`)
- Services Products sin unwrap envelope ni `putFormData`
- `ModalViewProduct` render single-image

**Patrones existentes**: `ProductImagePreview`, `canAdvanceFromImageStep` (004),
`useProductDetail` (002), `toCloudinaryDisplayUrl`

## Project Structure

```text
src/
├── utils/
│   ├── api/
│   │   ├── unwrapApiData.js              # CREATE
│   │   └── unwrapApiData.test.js         # CREATE
│   └── products/
│       ├── productImageUrls.js           # CREATE — getProductImageUrls, primary, placeholder
│       ├── productImageUrls.test.js      # CREATE
│       ├── buildProductMetadataPayload.js    # CREATE
│       ├── buildProductMultipartFormData.js  # CREATE
│       ├── buildProductMultipartFormData.test.js
│       ├── canAdvanceFromImageStep.js    # MODIFY — multi files + existingImageUrls[]
│       ├── canAdvanceFromImageStep.test.js   # MODIFY
│       └── resolveProductFromCatalog.js  # MODIFY — preserve img_urls in normalize
├── services/
│   ├── apiClient.js                      # MODIFY — putFormData
│   └── Products/
│       ├── FindAllProducts.service.js    # MODIFY — unwrap
│       ├── OneProductById.js             # MODIFY — unwrap
│       ├── CreateNewProduct.js           # MODIFY — files + unwrap
│       ├── UpdateProduct.js              # MODIFY — metadata payload + unwrap
│       └── updateProductWithFiles.js     # CREATE — PUT multipart
├── components/Products/
│   ├── ProductImageGallery.jsx           # CREATE
│   ├── ModalViewProduct.jsx              # MODIFY — gallery
│   ├── Product.jsx                       # MODIFY — primary thumb
│   ├── Products.jsx                      # MODIFY — pass primary URL
│   ├── FormProduct.jsx                   # MODIFY — files[], existingImageUrls
│   ├── EditProduct.jsx                   # MODIFY — submit JSON vs multipart
│   ├── TableProducts.jsx                 # MODIFY — primary thumb helper
│   └── formProductStep/
│       ├── ProductStep2.jsx              # MODIFY — multi input, grid previews
│       └── ProductStep3.jsx              # MODIFY — multi summary
├── views/
│   └── CreateProduct.jsx                 # MODIFY — files[], FormData files
├── components/Orders/
│   ├── ViewBuyOrder.jsx                  # MODIFY — primary thumb
│   └── PostShopOrderSummary.jsx          # MODIFY — primary thumb
```

## Design

### 1. productImageUrls (F6, F8)

```js
export const PRODUCT_IMAGE_PLACEHOLDER_URL = 'http://www.exampleImg.com';

export function getProductImageUrls(product) { /* img_urls → fallback img_url → [] */ }
export function getPrimaryProductImageUrl(product) { /* [0] or undefined */ }
export function hasValidProductImages(product) { /* length >= 1, no placeholder-only */ }
export function isPlaceholderImageUrl(url) { /* trim + compare */ }
```

### 2. API layer (F1, F2, F3, F4)

**apiClient.putFormData** — PUT con `buildHeaders(true)`, body FormData.

**unwrapApiData** — aplicar en todos los returns de services Products.

**buildProductMetadataPayload(product)** — pick `name, price, details, categories, stock`;
map categories a strings si vienen como objetos.

**buildProductMultipartFormData({ product, files })** — metadata + `files.forEach(f => formData.append('files', f))` + categories repetidas.

**EditProduct.handleSubmit**:

```js
if (files.length > 0) {
  await updateProductWithFiles(id, buildProductMultipartFormData({ product, files }));
} else {
  await UpdateProduct(id, buildProductMetadataPayload(product));
}
// Sin ImageProduct
```

**CreateProduct.handleSubmit** — requiere `files.length >= 1`; FormData sin `img_url`/`file`.

### 3. canAdvanceFromImageStep (F6)

```js
canAdvanceFromImageStep({
  mode,
  newFilesCount: files.length,
  existingImageUrls: getProductImageUrls(product),
})
```

Toasts existentes; mensaje create sin cambio; edit usa `hasValidProductImages` vía URLs.

### 4. ProductImageGallery (F7)

- Props: `imageUrls`, `alt`
- `length === 1`: single preview, sin chrome
- `length >= 2`: state `activeIndex`, prev/next buttons, dots, `onKeyDown` ArrowLeft/Right
- Cada slide: `ProductImagePreview` con `originalUrl={url}`
- Clases: rose accents, rounded-3xl, glass border

### 5. ModalViewProduct

Reemplazar bloque single `<img>` por:

```jsx
<ProductImageGallery
  imageUrls={getProductImageUrls(product)}
  alt={product.name}
/>
```

Mantener skeleton/error de 002.

### 6. Thumbnails (F8)

Patrón único:

```js
const primaryUrl = getPrimaryProductImageUrl(product);
const displayUrl = primaryUrl ? toCloudinaryDisplayUrl(primaryUrl) : undefined;
```

Aplicar en `Product.jsx` (prop desde `Products.jsx`), `TableProducts`, órdenes.
Carrito: `addToCart({ ..., img_url: getPrimaryProductImageUrl(...) })`.

### 7. Wizard paso 2 — ProductStep2 (F5)

- `<input type="file" accept="image/*" multiple />`
- Al select: validar count ≤3; si >3 toast "Máximo 3 imágenes"
- Grid 1–3 celdas `aspect-square rounded-3xl`
- Edit sin files nuevos: grid de `existingImageUrls` con `ProductImagePreview`
- Edit con files nuevos: grid blobs (reemplazo visual antes submit)
- Copy edit: "Imagenes actuales — no es necesario cambiarlas" cuando hay persistidas y `files.length === 0`
- Drag-drop: mantener solo primer archivo si se reutiliza handler — **actualizar** a multi-file en drop

**FormProduct props**: `files`, `previewUrls`, `existingImageUrls`, `mode`; quitar `file`/`previewUrl`/`existingImageUrl` singulares.

### 8. Wizard paso 3 — ProductStep3

Grid resumen: URLs persistidas (si no hay files) o blob previews (si hay files).
Reutilizar lógica de paso 2 para fuente de imágenes.

### 9. EditProduct state (F5, F9)

- `files: File[]`, `previewUrls: string[]`
- Init `existingImageUrls` from `getProductImageUrls(product)` on load
- Revoke blob URLs on cleanup
- `buildEditStateFromProduct`: incluir `img_urls` del API

### 10. Cache / context (FR-008)

- `FindAllProducts` unwrap → productos en context incluyen `img_urls`
- `useProductDetail` sin cambio de patrón; beneficia cache con `img_urls`
- `normalizeProductForEdit`: preservar `img_urls`

## Constitution Check

*GATE: pre-design ✅ | post-design ✅*

- [x] **I apiClient**: todos los HTTP vía `apiClient`; nuevo `putFormData` en mismo módulo
- [x] **II env**: sin `import.meta.env` en `src/`
- [x] **III Context**: ProductsProvider sin Redux; cambios mínimos en editProduct flow
- [x] **IV Routing**: sin cambios rutas admin
- [x] **V Contratos**: envelope `{ data: T }` documentado para módulo Products (migración acordada Back 008)
- [x] **VI Design system**: galería rose-gold, glass, Fi/Hi, `font-display` en títulos modal
- [x] **VII Vitest**: helpers puros + `canAdvanceFromImageStep` + `unwrapApiData` + FormData builder
- [x] **VIII SDD**: spec ✅ clarify ✅ plan ✅ → tasks → analyze
- [x] Sin axios/bootstrap
- [x] Sin cambios en repo Back (consumidor only)
- [x] Diff acotado dominio Products + Orders thumbs

## Complexity Tracking

Sin violaciones de constitución que requieran excepción.

## Phase Breakdown

| Phase | Scope | Deliverable |
|-------|-------|-------------|
| **0** | Research | [research.md](./research.md) F1–F10 |
| **1a** | Utils + apiClient | productImageUrls, payload builders, unwrap, putFormData, tests |
| **1b** | Services | unwrap all Products services; updateProductWithFiles; drop ImageProduct from edit |
| **2a** | Galería + modal | ProductImageGallery, ModalViewProduct |
| **2b** | Thumbs | Product, Products, TableProducts, ViewBuyOrder, PostShopOrderSummary |
| **3a** | Wizard utils | canAdvanceFromImageStep multi |
| **3b** | Wizard UI | FormProduct, Step2, Step3, CreateProduct, EditProduct |
| **4** | Verify | `npm test` + [quickstart.md](./quickstart.md) |

## Files Matrix

| Acción | Archivo | FR |
|--------|---------|-----|
| CREATE | `src/utils/api/unwrapApiData.js` | FR-010 |
| CREATE | `src/utils/products/productImageUrls.js` | FR-002 |
| CREATE | `src/utils/products/buildProductMetadataPayload.js` | FR-007 |
| CREATE | `src/utils/products/buildProductMultipartFormData.js` | FR-007 |
| CREATE | `src/services/Products/updateProductWithFiles.js` | FR-007, FR-009 |
| CREATE | `src/components/Products/ProductImageGallery.jsx` | FR-001, FR-012 |
| MODIFY | `src/services/apiClient.js` | FR-009 |
| MODIFY | `FindAllProducts`, `OneProductById`, `UpdateProduct`, `CreateNewProduct` (+ unwrap) | FR-010 |
| MODIFY | `src/utils/products/canAdvanceFromImageStep.js` | FR-011 |
| MODIFY | `ModalViewProduct.jsx` | FR-003 |
| MODIFY | `Product.jsx`, `Products.jsx` | FR-004 |
| MODIFY | `TableProducts.jsx`, order summaries | FR-004 |
| MODIFY | `FormProduct`, Step2, Step3 | FR-005, FR-006 |
| MODIFY | `CreateProduct.jsx`, `EditProduct.jsx` | FR-007 |
| MODIFY | `resolveProductFromCatalog.js` | FR-008 |

## Dependencies & Deploy

1. Merge + deploy **Back 008** en dev/staging.
2. Verificar GET devuelve `{ data: Product }` con `img_urls`.
3. Implementar Front 008.
4. Smoke [quickstart.md](./quickstart.md).

## Next Steps

1. `/speckit-tasks` — checklist atómica
2. `/speckit-analyze` — sin issues CRITICAL
3. `/speckit-implement` — tras OK analyze
