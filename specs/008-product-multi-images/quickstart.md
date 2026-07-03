# Quickstart: 008-product-multi-images

## Prerequisites

- Back 008 desplegado en dev (`GET /api/v1/products` → `{ data: [...] }` con `img_urls`).
- Front `.env` con `VITE_API_URL` apuntando al Back 008.
- Admin logueado para create/edit.

## Tests unitarios

```bash
npm test
```

Deben pasar (mínimo):

- `src/utils/products/productImageUrls.test.js`
- `src/utils/products/canAdvanceFromImageStep.test.js`
- `src/utils/products/buildProductMultipartFormData.test.js`
- `src/utils/api/unwrapApiData.test.js`

## Smoke — Galería modal 2–3 fotos (SC-001)

1. Tienda → producto con 2+ imágenes → ícono ojo (Ver).
2. Modal muestra flechas + dots; navegar entre fotos.
3. Teclado ←/→ cambia imagen activa.

## Smoke — Producto 1 imagen (SC-001)

1. Producto con 1 foto → modal sin flechas/dots superfluos.

## Smoke — Legacy solo img_url (SC-002)

1. Producto migrado con solo `img_url` → modal y catálogo muestran 1 imagen sin error.

## Smoke — Thumbnail principal (SC-005)

1. Producto con 3 fotos → tarjeta shop muestra solo primera.
2. Agregar al carrito → ítem usa misma URL principal que tarjeta.

## Smoke — Create 2 imágenes (US3)

1. Admin → Nuevo producto → paso 1 OK.
2. Paso 2 → seleccionar 2 archivos → grid 2 previews.
3. Paso 3 → resumen 2 imágenes → crear.
4. Red: POST multipart con 2× campo `files` (DevTools).
5. Dashboard/modal muestran galería.

## Smoke — Create sin imagen (SC-003)

1. Paso 2 sin archivos → Siguiente bloqueado con toast mínimo 1 imagen.

## Smoke — Create 4 archivos (SC-003)

1. Seleccionar 4 → toast máximo 3.

## Smoke — Edit sin cambiar fotos (SC-004, SC-007)

1. Editar producto con imágenes → paso 2 muestra actuales.
2. Cambiar solo precio paso 1 → paso 2 Siguiente sin nuevos archivos.
3. Guardar → red: **solo PUT JSON**, sin upload; `img_urls` iguales post-save.

## Smoke — Edit reemplazar galería (US3)

1. Editar → paso 2 → seleccionar 2 archivos nuevos.
2. Guardar → red: **PUT multipart** con 2× `files`.
3. Modal/listado muestran 2 nuevas fotos.

## Smoke — Placeholder sin imagen (004)

1. Producto con `img_urls: []` y placeholder → edit paso 2 sin archivos → toast 004.

## Smoke — Admin tabla + órdenes (SC-005)

1. Dashboard thumb = primera imagen del producto.
2. Resumen orden/post-compra usa misma imagen principal.

## Referencias

- [data-model.md](./data-model.md)
- [contracts/products-api-client.md](./contracts/products-api-client.md)
- Back: `SaphireSouvenirs-Back/specs/008-product-multi-images/contracts/products-api-multi-images.md`
