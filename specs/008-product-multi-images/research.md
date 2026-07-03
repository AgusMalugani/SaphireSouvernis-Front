# Research & Clarifications: 008-product-multi-images (Front)

Decisiones cerradas en spec + clarify 2026-07-03 y contrato Back
`SaphireSouvenirs-Back/specs/008-product-multi-images/contracts/products-api-multi-images.md` v1.0.

Sin `[NEEDS CLARIFICATION]` pendientes para `/speckit-tasks`.

---

## F1 — Unwrap envelope `{ data: T }` en módulo Products

**Pregunta**: ¿Helper centralizado o unwrap inline por service?

**Decisión**: `src/utils/api/unwrapApiData.js` + uso en **todos** los services bajo
`src/services/Products/`.

**Rationale**: Back 008 estandariza envelope en GET/POST/PUT del módulo; un solo helper
evita regresiones y facilita tests.

**Alternativas**: Modificar `apiClient.handleResponse` global — rechazado (otros módulos
siguen legacy hasta migración módulo a módulo).

---

## F2 — `putFormData` en apiClient

**Pregunta**: ¿Cómo enviar PUT multipart para edit con imágenes?

**Decisión**: Agregar `apiClient.putFormData(path, formData)` (mirror de `postFormData`).

**Rationale**: Contrato Back: mismo `PUT /products/:id` acepta JSON o multipart según
`Content-Type`.

---

## F3 — Payload PUT JSON sin campos imagen

**Pregunta**: ¿Enviar `img_url`/`img_urls` en body JSON de edición?

**Decisión**: **Omitir** `img_url`, `img_urls`, `id` en PUT JSON metadata-only.

**Rationale**: Contrato Back: galería intacta en JSON; enviar `img_url` legacy podría
pisar dual-write. `buildProductMetadataPayload(product)` centraliza el strip.

---

## F4 — FormData create/update

**Pregunta**: Shape exacto del multipart.

**Decisión**:

- Create: `name`, `price`, `details`, `categories` (repetido), `files` (1–3 repetidos).
  **No** enviar `img_url`.
- Edit con imágenes: mismos campos metadata + `files` (1–3).
- Edit sin imágenes: PUT JSON metadata only.

Helper: `buildProductMultipartFormData({ product, files })`.

**Rationale**: Alineado a contrato Back v1.0; mismo patrón que `CreateProduct.jsx` actual
para `categories`.

---

## F5 — Estado wizard: `file` → `files[]`

**Pregunta**: ¿Cómo modelar previews en paso 2/3?

**Decisión**:

- Estado: `files: File[]`, `previewUrls: string[]` (blob URLs).
- Persistidas: `existingImageUrls: string[]` derivado de `getProductImageUrls(product)`.
- Paso 2 muestra grid: si `files.length > 0` → blobs; si no → `ProductImagePreview` por
  cada URL persistida.
- Nueva selección **reemplaza** `files[]` completo (no merge con persistidas en UI).

**Rationale**: Contrato edit = reemplazo total al submit con archivos; UX clara.

---

## F6 — Regla `canAdvanceFromImageStep` multi-imagen

**Decisión**: Extender firma:

```js
canAdvanceFromImageStep({
  mode: 'create' | 'edit',
  newFilesCount: number,
  existingImageUrls: string[],
})
// create: newFilesCount >= 1
// edit: newFilesCount >= 1 OR count(valid existingImageUrls) >= 1
```

`hasExistingProductImage` → delegar a `hasValidProductImages(product)` usando
`getProductImageUrls` + filtro placeholder Back.

---

## F7 — `ProductImageGallery` (modal tienda/admin)

**Decisión**:

- Props: `imageUrls: string[]`, `alt: string`.
- 1 imagen: solo `<ProductImagePreview>` / img, sin flechas ni dots.
- 2–3: índice local `activeIndex`, flechas FiChevronLeft/Right, dots, teclas ←/→,
  `aria-label` en controles.
- Swipe mobile: **fuera de v1** (costo vs valor; defer post-MVP).

**Rationale**: FR-001, FR-012, spec Assumptions.

---

## F8 — Thumbnails catálogo/carrito

**Decisión**: `getPrimaryProductImageUrl(product)` + `toCloudinaryDisplayUrl` en
componentes consumidores; carrito guarda URL principal en item (helper al addToCart).

**Archivos**: `Product.jsx`, `Products.jsx`, `TableProducts`, `ViewBuyOrder`,
`PostShopOrderSummary`.

---

## F9 — Deprecar `ImageProduct` en flujos nuevos

**Decisión**: `EditProduct` deja de importar `ImageProduct`; servicio puede quedar sin
uso (eliminar import muerto en tasks). No llamar `POST /upload/:id` en create/edit 008.

**Rationale**: Contrato Back depreca upload separado; submit único PUT multipart.

---

## F10 — Gate de deploy

**Decisión**: Implementación Front **requiere** Back 008 desplegado en entorno dev/staging
(envelope + `files` + `img_urls`). Sin shim dual legacy/plano en v1.

**Rationale**: Breaking change acordado; deploy Back primero (spec Dependencies).

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Cache localStorage sin `img_urls` | Refetch catálogo post-deploy; GET unwrap |
| Blob URL leaks | `URL.revokeObjectURL` en cleanup `useEffect` (patrón CreateProduct) |
| Producto placeholder | `isPlaceholderImageUrl` en helpers |
| Regresión 004 edit sin fotos | Tests + quickstart SC-004 |

---

## APTO para tasks

Coverage FR Front: 12/12 con F1–F10.
Contrato Back v1.0 congelado — referencia en `contracts/products-api-client.md`.
