# Quickstart: 005-orders-operations-overhaul

## Prerrequisitos

- `.env` con `VITE_API_URL`, `VITE_SHOP_URL`, `VITE_WHATSAPP_NUM`
- Backend accesible (array legacy en `GET /orders` OK)
- Admin login para `/orders`

## Tests automatizados

```bash
npm test
```

Debe pasar:
- `src/utils/orders/orderStatusConfig.test.js`
- `src/utils/orders/buildWhatsAppOrderMessage.test.js`
- `src/utils/orders/normalizeOrdersListResponse.test.js`
- `src/utils/orders/filterOrdersClientSide.test.js`

## Smoke — Labels y filtro "En proceso" (SC-001, SC-002, SC-003)

1. Login admin → `/orders`.
2. Crear pedido desde shop (estado default `inProcess`).
3. Filtrar **En proceso**.
4. **Esperado**: pedido visible; badge dice "En proceso" (no enum crudo).
5. `grep inProcces src/` → 0 resultados.

## Smoke — Rutas post-shop (SC-004)

1. Checkout → URL `/post-shop/:id`.
2. Abrir `/postShop/:id` manualmente → redirect a `/post-shop/:id`.
3. FAB global WhatsApp oculto en post-shop.

## Smoke — WhatsApp (SC-005, SC-006)

1. En `/post-shop/:id` → botón WhatsApp visible.
2. Click → mensaje con productos, total, link `{shopUrl}/post-shop/:id`.
3. Refresh página → CTA sigue funcionando.

## Smoke — Filtros híbridos (SC-007)

1. `/orders` → cambiar filtro estado → refetch (Network tab).
2. Con backend legacy: filtros siguen funcionando (client-side fallback).
3. Búsqueda por nombre con debounce.

## Smoke — Timeline y notas admin (SC-008)

1. Modal **Ver** → sección timeline + notas.
2. Cambiar estado → evento optimista en timeline.
3. `/post-shop/:id` → sin timeline ni notas.

## Smoke — PUT mínimo (SC-009)

1. DevTools Network → editar pago.
2. **Esperado**: body solo `{ state: "..." }` sin `orderDetails`.
