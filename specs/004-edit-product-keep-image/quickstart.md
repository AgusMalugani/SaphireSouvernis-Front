# Quickstart: 004-edit-product-keep-image

## Tests

```bash
npm test
```

Debe pasar `src/utils/products/canAdvanceFromImageStep.test.js`.

## Smoke — Editar sin cambiar imagen (SC-001, SC-003)

1. Login admin → dashboard → Editar producto **con imagen**.
2. Paso 1: cambiar solo el **precio**.
3. Paso 2: ver copy "Imagen actual — no es necesario cambiarla" y preview visible.
4. Pulsar **Siguiente** sin subir archivo → debe avanzar a Resumen.
5. Confirmar → guardar → verificar en listado misma imagen (misma URL).

## Smoke — Creación sin regresión (SC-002)

1. Crear producto nuevo → paso 1 OK → paso 2 sin imagen → **Siguiente**.
2. Debe mostrar: "Debés seleccionar una imagen para continuar."

## Smoke — Cambiar imagen (SC-005)

1. Editar producto → paso 2 → **Cambiar imagen** → elegir archivo nuevo.
2. Preview actualiza → guardar → imagen nueva en listado.

## Smoke — Cancelar cambio (US3)

1. Editar → paso 2 → **Cambiar imagen** → cancelar selector.
2. Preview original intacto → **Siguiente** funciona.

## Smoke — Producto sin imagen (FR-008)

1. Editar producto sin `img_url` (si existe en datos de prueba).
2. Paso 2 sin archivo → toast: "Este producto no tiene imagen. Subí una para continuar."

## Smoke — Preview fallback (SC-006)

1. Editar producto Cloudinary → paso 2 muestra imagen (transform o original tras error).
