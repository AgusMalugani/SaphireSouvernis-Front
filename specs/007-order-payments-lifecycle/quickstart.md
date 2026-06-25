# Quickstart: 007-order-payments-lifecycle

## Prerrequisitos

- Backend `005-order-payments-lifecycle` desplegado (migración `depositAmount`, enum `cancelled`)
- `.env` con `VITE_API_URL`, `VITE_SHOP_URL`, `VITE_WHATSAPP_NUM`
- Admin login para `/orders`
- Pedido de prueba con `totalPrice` conocido (ej. $15.000)

## Tests automatizados

```bash
cd SaphireSouvernis-Front
npm test
```

Debe pasar (nuevos + existentes):

- `src/utils/orders/validateDepositAmount.test.js`
- `src/utils/orders/orderTimelineLabels.test.js`
- `src/utils/orders/orderStatusConfig.test.js`
- `src/utils/orders/filterOrdersClientSide.test.js` (cancelled)
- Suite existente sin regresiones

## Smoke — Registrar seña (SC-001)

1. Login admin → `/orders`.
2. Abrir pedido **En proceso** (`depositAmount` 0).
3. Click **Registrar seña** → ingresar `5000` → guardar.
4. DevTools Network: `PUT /orders/:id` body **`{ "depositAmount": 5000 }`** sin `state`.
5. **Esperado**: badge **Señado**; seña $5.000; saldo $10.000 (si total $15.000).
6. Botón **Registrar seña** ya **no** visible en tarjeta.

## Smoke — Seña completa → Pagado

1. En pedido en proceso, registrar seña = `totalPrice`.
2. **Esperado**: badge **Pagado**; `remainingBalance` $0.

## Smoke — Validación seña (SC-001)

1. Intentar seña mayor al total.
2. **Esperado**: error cliente o 400; sin cambio en UI.

## Smoke — Montos en panel (SC-002)

1. Pedido señado → tarjeta muestra seña, total y saldo formateados ARS.
2. Modal **Ver** (admin) → mismos tres montos.

## Smoke — Cancelar pedido (SC-003)

1. Pedido señado → botón **Cancelar** en tarjeta.
2. Modal → motivo opcional → confirmar.
3. Network: `PUT { "state": "cancelled", "cancelReason": "..." }` (sin `depositAmount`).
4. Listado default → pedido **ausente**.
5. Filtro **Cancelado** → pedido visible con badge Cancelado.

## Smoke — No cancelar pagado (SC-003)

1. Pedido **Pagado** → sin botón Cancelar.
2. Si se fuerza API → 409 → toast error; UI sin cambio.

## Smoke — Post-shop 404 (SC-004, SC-008)

1. Cancelar pedido del paso anterior.
2. Abrir `/post-shop/:id` (sin `location.state` de checkout).
3. **Esperado**: "No encontramos este pedido"; sin resumen ni WhatsApp.
4. Crear pedido nuevo → post-shop activo → resumen + WhatsApp OK (regresión SC-008).

## Smoke — Post-shop error de red

1. Simular offline o API caída en GET público.
2. **Esperado**: mensaje **distinto** a "no encontramos" (no confundir con 404).

## Smoke — Timeline P1 (SC-005)

1. Tras registrar seña → modal Ver → historial con evento **seña** legible (`payment_updated`).
2. Tras cancelar → filtro Cancelado → Ver → `order_cancelled` con motivo si hubo.
3. Sin duplicados optimista + servidor tras refetch.

## Smoke — Notas admin en pedido cancelado (FR-023)

1. Filtrar **Cancelado** → abrir pedido cancelado en modal Ver.
2. **Esperado**: sin acciones Registrar seña / Cancelar / edición integral (P2); **AdminOrderNotes** operativo (crear/leer nota).

## Smoke — Filtro cancelados (SC-006)

1. Selector estado incluye **Cancelado**.
2. Query incluye `state=cancelled`.
3. Cambiar filtro resetea página 1.

## Smoke — Entrega sin regresión

1. Editar **Envío/Retiro** en pedido activo.
2. **Esperado**: PUT solo `transactionType` + `address`; timeline `transaction_changed` legacy OK.

## P2 — Edición integral (post-MVP)

1. Editar productos/cantidades en pedido editable.
2. PUT con `products` array; sin `orderDetails`.
3. Timeline `order_edited`; error 400 si seña > nuevo total.

## Referencias

- [contracts/orders-api-payments-client.md](./contracts/orders-api-payments-client.md)
- [data-model.md](./data-model.md)
- Backend smoke: `SaphireSouvenirs-Back/specs/005-order-payments-lifecycle/quickstart.md`
