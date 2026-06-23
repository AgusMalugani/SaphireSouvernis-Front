# Research: 005-orders-operations-overhaul

**Date**: 2026-06-19

## R1: Filtros con API legacy (híbrido)

**Decision**: Siempre enviar query params; si respuesta es `Array`, normalizar y
aplicar `filterOrdersClientSide` + paginación local.

**Rationale**: UI lista para backend futuro; filtros funcionan hoy sin esperar deploy back.

**Alternatives rejected**:
- Solo server — filtros inútiles hasta backend
- Solo client sin params — no prepara contrato API

## R2: Base URL mensaje WhatsApp

**Decision**: `envs.shopUrl` + `/post-shop/:id` con helper `normalizeShopUrl`.

**Rationale**: Primer consumidor de `VITE_SHOP_URL`; URL estable en prod (Vercel)
independiente de `window.location.origin` en previews locales.

**Alternatives rejected**:
- `window.location.origin` — distinto en dev vs prod desplegado
- Hardcode — viola constitución env

## R3: Template WhatsApp detallado

**Decision**: Template B — productos línea por línea + tema; sin estado/entrega en v1.

**Rationale**: Negocio coordina diseño por WhatsApp; menos ida y vuelta.

## R4: Timeline optimista

**Decision**: Tras PUT OK, append evento local en modal admin.

**Rationale**: Feedback inmediato; backend futuro persiste eventos reales.

**Alternatives rejected**:
- Solo vacío — mala UX operativa
- Persistir en localStorage — complejidad innecesaria v1

## R5: Notas append-only

**Decision**: Solo agregar notas; lista cronológica; sin edit/delete v1.

**Rationale**: Mínimo viable; alinea con audit trail.

## R6: Labels español vs enum

**Decision**: Config central; `inProcess` → "En proceso"; nunca mostrar enum en UI.

**Rationale**: Corrige typo y unifica copy; tests previenen regresión.
