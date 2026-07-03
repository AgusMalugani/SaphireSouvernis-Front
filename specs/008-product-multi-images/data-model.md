# Data Model: 008-product-multi-images (Frontend)

**Feature**: 008-product-multi-images  
**Scope**: Shapes UI, estado wizard y consumo API. Persistencia en Back.

## Product (API — post Back 008)

| Campo | Tipo | UI |
|-------|------|-----|
| `id` | UUID | Rutas, cache |
| `name` | string | Catálogo, wizard |
| `price` | number | Catálogo, wizard |
| `details` | string | Detalle modal, wizard |
| `stock` | boolean | Admin inventario |
| `img_urls` | `string[]` | Galería, wizard previews persistidas (0–3) |
| `img_url` | string | Alias `[0]` o placeholder legacy |
| `categories` | `{ name }[]` \| string[] (form) | Badges, wizard |

### Placeholder sin imagen real (Back C8)

| `img_urls` | `img_url` | Tratamiento Front |
|------------|-----------|-------------------|
| `[]` | `http://www.exampleImg.com` | Sin imagen válida — bloqueo edit/create |
| `['https://...']` | misma URL `[0]` | 1 imagen |
| `['u0','u1','u2']` | `u0` | Galería 3 |

Constante: `PRODUCT_IMAGE_PLACEHOLDER_URL` en `productImageUrls.js`.

## Normalización (helpers)

```js
getProductImageUrls(product) → string[]
// 1. Si img_urls?.length > 0 (filtrar placeholders vacíos) → usar
// 2. Si img_url válida (non-empty, no placeholder) → [img_url]
// 3. Else → []

getPrimaryProductImageUrl(product) → string | undefined
// getProductImageUrls(product)[0]

hasValidProductImages(product) → boolean
// getProductImageUrls(product).length >= 1
```

## WizardImageState (CreateProduct / EditProduct)

| Campo | Tipo | Notas |
|-------|------|-------|
| `files` | `File[]` | 0–3 seleccionados; create requiere ≥1 al submit |
| `previewUrls` | `string[]` | `URL.createObjectURL` por file; revoke on unmount |
| `existingImageUrls` | `string[]` | Solo edit; de `getProductImageUrls(product)` |

## ProductMetadataPayload (PUT JSON)

Campos permitidos:

```js
{ name, price, details, categories, stock }
```

**Excluidos**: `id`, `img_url`, `img_urls`.

## MultipartFormData (POST create / PUT edit con imágenes)

| Campo | Cardinalidad |
|-------|--------------|
| `name` | 1 |
| `price` | 1 |
| `details` | 1 |
| `categories` | 1..n (append repetido) |
| `stock` | 1 (edit/create si aplica) |
| `files` | 1–3 (append por archivo) |

## CartItem (shop — shape existente)

| Campo | Cambio |
|-------|--------|
| `img_url` | Valor = `getPrimaryProductImageUrl(product)` al addToCart |

## GalleryUIState (ProductImageGallery — local)

| Campo | Tipo | Default |
|-------|------|---------|
| `activeIndex` | number | `0` |
| `imageUrls` | string[] | prop |

Controles visibles solo si `imageUrls.length > 1`.

## API response unwrap

```js
// GET list
{ data: Product[] }

// GET one / POST / PUT
{ data: Product }
```

Services devuelven `Product` / `Product[]` ya unwrapped al caller.

## HTTP flows (referencia)

| Flujo | Request |
|-------|---------|
| Create con 2 fotos | POST multipart + 2× `files` |
| Edit solo precio | PUT JSON metadata |
| Edit reemplazar galería | PUT multipart + 1–3× `files` |
| Listado tienda | GET → unwrap → `img_urls` en cache |

Contrato completo: [products-api-client.md](./contracts/products-api-client.md).
