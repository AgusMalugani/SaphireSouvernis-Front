# Data Model: 007-order-payments-lifecycle (Frontend)

**Feature**: 007-order-payments-lifecycle  
**Scope**: Shapes UI/servicios; persistencia vía API backend 005.

## Order (extendido — API)

| Campo | Tipo | Persistido | Admin UI | Post-shop público |
|-------|------|------------|----------|-------------------|
| `id` | UUID | Sí | Listado, detalle | URL |
| `state` | enum | Sí | Badge solo lectura | — |
| `depositAmount` | int ≥ 0 | Sí | Registrar seña (1×); display | No destacar v1 |
| `remainingBalance` | number | No (calc) | Display admin | No v1 |
| `totalPrice` | number | Sí | Display | Resumen |
| `cancelReason` | string? | Sí | Solo lectura si cancelado | — |
| `orderDetails` | array | Sí | Tarjeta productos | Resumen |
| …campos cliente/entrega | … | Sí | Detalle / P2 edit | Resumen |

### StateEnum (pago + ciclo de vida)

| `state` | Label UI | Registrar seña | Cancelar | Editar entrega | Notas admin |
|---------|----------|----------------|----------|----------------|-------------|
| `inProcess` | En proceso | Sí (si deposit 0) | Sí | Sí | Sí |
| `partialPayment` | Señado | No | Sí | Sí | Sí |
| `paid` | Pagado | No | No (409) | Sí | Sí |
| `cancelled` | Cancelado | No (409) | No | No (409) | Sí |

### Derivación de pago (servidor — UI solo lectura)

| Condición | `state` esperado |
|-----------|------------------|
| `depositAmount === 0` | `inProcess` |
| `0 < depositAmount < totalPrice` | `partialPayment` |
| `depositAmount >= totalPrice` | `paid` |

## DepositEditPayload (PUT admin)

```ts
{ depositAmount: number }  // entero ARS, 0 <= n <= totalPrice
```

**Reglas UI**:
- Una sola acción "Registrar seña" por pedido (`depositAmount` pasa de 0 a N).
- No enviar `state` de pago.

## CancelOrderPayload (PUT admin — request separada)

```ts
{
  state: 'cancelled',
  cancelReason?: string  // trim, max 500; omitir si vacío
}
```

**Prohibido** en mismo body que `depositAmount`.

## TransactionEditPayload (existente — sin cambio)

```ts
{ transactionType: 'send' | 'withdraw', address?: string }
```

## IntegralEditPayload (P2)

```ts
{
  products?: [{ productId: string, cuantity: number }],
  nameClient?: string,
  email?: string,
  // …whitelist backend
}
```

## OrderPaymentSummary (display admin)

```ts
{
  depositAmount: number,
  totalPrice: number,
  remainingBalance: number,
}
```

Helper: `buildOrderPaymentSummary(order)` → normaliza defaults (`depositAmount ?? 0`).

## TimelineEvent (union ampliada)

| `type` | Fase | Payload clave |
|--------|------|----------------|
| `payment_updated` | P1 | `fromDeposit`, `toDeposit`, `totalPrice`, `remainingBalance` |
| `order_cancelled` | P1 | `previousState`, `reason?` |
| `order_edited` | P2 | `fields`, `changes`, `productsChanged` |
| `state_changed` | legacy | entrega / legacy pago |
| `transaction_changed` | legacy | entrega |
| `created` | legacy | — |
| `admin_note_added` | legacy | `note` |

## OrdersFilters (admin list — extendido)

| Campo | Valores | Notas |
|-------|---------|-------|
| `state` | `''` \| `inProcess` \| `partialPayment` \| `paid` \| `cancelled` | `''` excluye cancelados (backend default) |
| `transactionType` | `''` \| `send` \| `withdraw` | sin cambio |
| `q`, `page`, `limit`, `sort`, `order` | — | sin cambio |

## CancelOrderModal state

| Campo | Tipo |
|-------|------|
| `isOpen` | boolean |
| `orderId` | string |
| `orderName` | string |
| `cancelReason` | string |
| `isSubmitting` | boolean |

## RegisterDepositModal / EditOrder action

| Campo | Tipo |
|-------|------|
| `depositAmountInput` | string/number |
| `totalPrice` | number (readonly context) |
| validation | `validateDepositAmount` |

## PostShop fetch state

| Estado | UI |
|--------|-----|
| loading + provisional checkout | OK mostrar provisional hasta 200 |
| 404 | `PostShopNotFound` — sin provisional |
| network error | Error conexión — distinto copy |
| 200 | Resumen + WhatsApp |

## HTTP error shape (cliente)

```js
// Error con .status?: number (400|404|409)
```

Helper: `getApiErrorStatus(error)` → `number | undefined`
