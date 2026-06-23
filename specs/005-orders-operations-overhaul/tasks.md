# Tasks: Operaciones de pedidos — admin y post-compra (Frontend)

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/orders-api-client.md](./contracts/orders-api-client.md)

**Prerequisites**: Clarify Q1–Q5 integrado; plan y contratos listos.

## Format

`[ID] [P?] [Story] Description` — **[P]** = paralelo (archivos distintos, sin deps)

---

## Phase 1: Foundational — Utils + tests (bloqueante)

**Purpose**: Config central, normalización legacy y helpers puros antes de UI.

- [x] T001 [P] Crear `src/utils/orders/orderStatusConfig.js` — labels español, badges, select options, fallbacks
- [x] T002 [P] Crear `src/utils/orders/orderStatusConfig.test.js`
- [x] T003 [P] Crear `src/utils/orders/buildWhatsAppOrderMessage.js` + `normalizeShopUrl` helper
- [x] T004 [P] Crear `src/utils/orders/buildWhatsAppOrderMessage.test.js` — template B, shopUrl trailing slash
- [x] T005 [P] Crear `src/utils/orders/filterOrdersClientSide.js` — state, transactionType, q, sort, page, limit
- [x] T006 [P] Crear `src/utils/orders/filterOrdersClientSide.test.js`
- [x] T007 Crear `src/utils/orders/normalizeOrdersListResponse.js` — híbrido array vs `{ data, meta }`
- [x] T008 Crear `src/utils/orders/normalizeOrdersListResponse.test.js`

**Checkpoint**: `npm test -- src/utils/orders` pasa.

---

## Phase 2: US1 + US7 — Estados correctos y labels español (P1)

**Goal**: Eliminar `inProcces`; UI siempre en español vía config central.

**Independent Test**: Filtro "En proceso" muestra pedidos `inProcess`; grep `inProcces` → 0.

- [x] T009 [US1][US7] Refactor `src/components/Orders/Order.jsx` — import `orderStatusConfig`; quitar mapas locales
- [x] T010 [P] [US1][US7] Refactor `src/components/Orders/ViewBuyOrder.jsx` — labels desde config
- [x] T011 [P] [US1][US7] Refactor `src/components/Orders/EditOrder.jsx` — select values `inProcess`; labels español
- [x] T012 [P] [US1][US7] Refactor `src/components/Orders/Orders.jsx` — filtro estado con value `inProcess`, label "En proceso"

**Checkpoint**: SC-001, SC-002, SC-003 parcial (labels en componentes existentes).

---

## Phase 3: US2 — Ruta `/post-shop/:id` + legacy (P1)

**Goal**: URL canónica kebab-case; redirect camelCase.

**Independent Test**: Checkout → `/post-shop/:id`; `/postShop/:id` redirige.

- [x] T013 [US2] `src/App.jsx` — route `/post-shop/:id`; redirect `/postShop/:id` (replace); `useMatch` FAB
- [x] T014 [US2] `src/components/Orders/ModalCreateOrder.jsx` — navigate `/post-shop/${id}`
- [x] T015 [P] [US2] Actualizar `README.md` — rutas públicas con `/post-shop/:id`

**Checkpoint**: SC-004.

---

## Phase 4: US3 — WhatsApp en PostShop (P1)

**Goal**: CTA con mensaje detallado; funciona tras refresh.

**Independent Test**: CTA abre wa.me con template B y link `envs.shopUrl/post-shop/:id`.

- [x] T016 [US3] `src/views/PostShop.jsx` — `RedirectToWhatsapp` variant block; armar mensaje con order API + `location.state` fallback
- [x] T017 [US3] Integrar `buildWhatsAppOrderMessage({ order, shopUrl: envs.shopUrl })` en PostShop

**Checkpoint**: SC-005, SC-006.

---

## Phase 5: US4 — Listado admin híbrido (P2)

**Goal**: Filtros server-side + fallback cliente; paginación; productos en tarjetas.

**Independent Test**: Cambiar filtro → refetch; legacy array filtra en cliente.

- [x] T018 [US4] Refactor `src/services/Orders/FindAllOrders.js` — aceptar filters query; retornar raw
- [x] T019 [US4] Refactor `src/contexts/Orders/OrdersProvider.jsx` — filters, meta, fetchOrders, loading, error; fix async useEffect
- [x] T020 [US4] Refactor `src/components/Orders/Orders.jsx` — búsqueda debounce, refetch, paginación, empty/loading states
- [x] T021 [US4] `src/components/Orders/Order.jsx` — chips/lista compacta de productos desde `orderDetails.product`

**Checkpoint**: SC-007.

---

## Phase 6: US5 + US6 — Timeline, notas, edición segura (P2)

**Goal**: Detalle admin con timeline optimista y notas append-only; PUT mínimo.

**Independent Test**: Modal Ver con timeline; PostShop sin timeline; PUT sin orderDetails.

- [x] T022 [P] [US5] Crear `src/services/Orders/FindOrderAdmin.js`
- [x] T023 [P] [US5] Crear `src/services/Orders/AddOrderNote.js`
- [x] T024 [P] [US5] Crear `src/components/Orders/OrderTimeline.jsx` — eventos optimistas + server; labels español
- [x] T025 [P] [US5] Crear `src/components/Orders/AdminOrderNotes.jsx` — append-only; 404 graceful
- [x] T026 [US5] `src/components/Orders/ViewBuyOrder.jsx` — prop `variant="public"|"admin"`; admin incluye timeline + notas
- [x] T027 [US5] `src/components/Orders/ModalActionOrder.jsx` — pasar variant admin en acción "ver"
- [x] T028 [US6] `src/components/Orders/EditOrder.jsx` — PUT payload mínimo (`state` o `transactionType`+`address`)
- [x] T029 [US5][US6] Tras `editOrderContext` OK — append evento optimista en timeline del modal abierto

**Checkpoint**: SC-008, SC-009.

---

## Phase 7: Verify

- [x] T030 Ejecutar `npm test` — suite completa incl. `src/utils/orders/`
- [ ] T031 Smoke manual según [quickstart.md](./quickstart.md)
- [x] T032 Marcar tasks completadas; documentar endpoints backend pendientes en spec si aplica

**Checkpoint**: SC-001–SC-010.

---

## Dependencies & Execution Order

```text
Phase 1 (T001–T008) ──blocks──► Phase 2–7
Phase 2 (US1) ──► puede overlap con Phase 3–4 tras T001–T002
Phase 3 (US2) ──► antes de Phase 4 (WhatsApp link post-shop)
Phase 4 (US3) ──► depende T003–T004, T013–T014
Phase 5 (US4) ──► depende T005–T008, T009–T012 (labels en filtros)
Phase 6 (US5/6) ──► depende T009–T010 (ViewBuyOrder), T019 (context edit)
```

### MVP sugerido (P1 only)

1. Phase 1 → Phase 2 → Phase 3 → Phase 4 → T030  
2. Validar quickstart § Labels, Rutas, WhatsApp  
3. Luego Phase 5–6 para admin completo

### Parallel opportunities

- T001–T006 en paralelo (archivos distintos)
- T009–T012 en paralelo tras T001–T002
- T022–T025 en paralelo tras T026 planificado

---

## Notes

- NO modificar `SaphireSouvenirs-Back` en esta feature.
- `envs.shopUrl` y `envs.whatsappNum` vía `src/config/env.js` únicamente.
- grep `inProcces` debe quedar en 0 antes de cerrar T031.

### Backend pendiente (v2 — fuera de alcance frontend v1)

- `GET /orders?state=&transactionType=&q=&page=&limit=&sort=&order=` → `{ data, meta }` (hoy: array plano; fallback cliente implementado)
- `GET /orders/:id/admin` → timeline + notes (404 graceful en frontend)
- `POST /orders/:id/notes` → append nota interna
- `PUT /orders/:id` → actualización parcial (sin `orderDetails`)
