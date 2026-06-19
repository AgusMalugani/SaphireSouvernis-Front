# Quickstart: 002-product-view-cache

## Prerrequisitos

- `.env` válido y backend accesible (o catálogo en localStorage)
- `npm install` en `SaphireSouvernis-Front`

## Tests automatizados

```bash
npm test
```

Debe pasar tests en:
- `src/utils/products/resolveProductFromCatalog.test.js`
- `src/utils/images/cloudinaryDisplayUrl.test.js`

## Smoke manual — Cache hit (SC-001, SC-003, SC-006)

1. Iniciar sesión como admin y abrir `/dashboard`.
2. Esperar que cargue la tabla de productos.
3. Abrir DevTools → Network; filtrar `products/`.
4. Pulsar **Ver** en un producto listado.
5. **Esperado**: modal muestra datos al instante; **no** aparece `GET /products/:id`.
6. Navegar a **Editar** el mismo producto desde la tabla.
7. **Esperado**: formulario precargado sin `GET /products/:id`.

## Smoke manual — Cache miss + skeleton (SC-002)

1. Borrar `localStorage` key `products` (o usar id inexistente en catálogo).
2. Abrir directamente `/product/edit/{id-valido-no-en-cache}`.
3. **Esperado**: skeleton (imagen cuadrada + barras) → formulario completo tras fetch.

## Smoke manual — Cloudinary (SC-004)

1. Abrir **Ver** en producto con imagen Cloudinary (`res.cloudinary.com/.../upload/...`).
2. Inspeccionar URL de imagen en modal.
3. **Esperado**: contiene `w_400,h_400,c_fill` tras `/upload/`.
4. Repetir preview en edición (paso Imagen) sin subir archivo nuevo.

## Smoke manual — Error en cache miss (FR-011)

1. Detener backend o usar id inválido con catálogo vacío.
2. Abrir modal **Ver** o URL de edición.
3. **Esperado**: toast de error + mensaje inline; vista permanece abierta.

## Smoke manual — Modal cerrado (FR-004)

1. En dashboard, **no** abrir modal.
2. **Esperado**: ningún fetch de detalle individual asociado al modal.
