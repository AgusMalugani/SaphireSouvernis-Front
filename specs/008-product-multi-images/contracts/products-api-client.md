# Contract: Products API Client (Front 008)

**Feature**: 008-product-multi-images  
**Version**: 1.0  
**Status**: Approved — mirrors Back contract v1.0  
**Source of truth (Back)**: `SaphireSouvenirs-Back/specs/008-product-multi-images/contracts/products-api-multi-images.md`

## Base URL

`VITE_API_URL` (incluye `/api/v1`) + path relativo `/products`.

## Services affected

| Service | Cambio |
|---------|--------|
| `FindAllProducts.service.js` | unwrap `{ data: Product[] }` |
| `OneProductById.js` | unwrap `{ data: Product }` |
| `CreateNewProduct.js` | multipart `files[]`; unwrap response |
| `UpdateProduct.js` | JSON metadata OR delegate `UpdateProductWithFiles.js` |
| `setProductAvailability.js` | unwrap via UpdateProduct |
| `ImageProduct.js` | **sin uso** en flujos 008 (legacy deprecado) |

## apiClient additions

```js
putFormData(path, formData) // PUT multipart, headers sin Content-Type JSON
```

## unwrapApiData

```js
/**
 * @template T
 * @param {{ data?: T } | T} response
 * @returns T
 */
export function unwrapApiData(response) {
  if (response != null && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response;
}
```

Usar en todos los services Products post-Back-008.

## Create — POST `/products`

**Content-Type**: `multipart/form-data`  
**Auth**: Bearer admin

```js
const formData = buildProductMultipartFormData({ product, files });
// files: File[] length 1–3
await apiClient.postFormData('/products', formData);
```

**No incluir**: `img_url`, `file` (singular).

## Update — PUT `/products/:id`

### Metadata only (galería intacta)

```js
const payload = buildProductMetadataPayload(product);
await apiClient.put(`/products/${id}`, payload);
```

### Con imágenes (reemplazo total)

```js
const formData = buildProductMultipartFormData({ product, files });
await apiClient.putFormData(`/products/${id}`, formData);
```

## Read — GET

```js
const raw = await apiClient.get('/products');
const products = unwrapApiData(raw); // Product[]
```

## Product type (consumo)

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  details: string;
  stock: boolean;
  img_urls: string[];
  img_url: string;
  categories: Array<{ name: string }>;
}
```

## Error handling (UI)

| Status | Acción Front |
|--------|--------------|
| 400 | `toast.error(error.message)` — 0/>3 files, MIME |
| 401/403 | Toast + redirect según auth existente |

## Breaking change gate

Front 008 MUST NOT desplegarse contra API legacy sin envelope ni `img_urls`.
Verificar Back 008 en dev antes de smoke tests.

## Congelamiento

Cambios al wire format requieren amend spec + clarify en **ambos** repos.
