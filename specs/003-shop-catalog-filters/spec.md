# Feature Specification: Filtros del catálogo público (búsqueda + categorías mobile)

**Feature Branch**: `003-shop-catalog-filters`

**Created**: 2026-06-19

**Status**: Ready

**Input**: Mejorar filtros del catálogo público (`/shopProducts`): corregir doble scroll
horizontal en categorías mobile, barra sticky con búsqueda live por nombre y filtros
combinados con categoría; client-side sobre productos en contexto.

## Clarifications

### Session 2026-06-19

- Q: Layout mobile categorías → A: Barra sticky unificada (búsqueda + chips).
- Q: Campo de búsqueda → A: Solo `name`.
- Q: Ignorar acentos → A: Sí (normalización NFD).
- Q: Mínimo de caracteres → A: 0 (desde la primera letra).
- Q: Empty states diferenciados → A: Sí.
- Q: Sticky al scroll en mobile → A: Sí.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Barra de filtros usable en mobile (Priority: P1)

Como visitante en mobile, quiero una barra con búsqueda y categorías sin doble
scrollbar, que permanezca accesible al hacer scroll en el catálogo.

**Independent Test**: Abrir `/shopProducts` en viewport mobile; verificar una sola zona
de scroll horizontal en chips y barra sticky visible al scroll.

**Acceptance Scenarios**:

1. **Given** viewport mobile en el catálogo, **When** se muestra la barra de filtros,
   **Then** no hay contenedores anidados con doble `overflow-x-auto` visible.
2. **Given** scroll hacia abajo en el listado, **When** la barra sticky está activa,
   **Then** búsqueda y categorías siguen accesibles bajo el header.

---

### User Story 2 - Búsqueda live por nombre (Priority: P1)

Como visitante, quiero escribir en un campo y ver al instante los productos cuyo
nombre coincida parcialmente.

**Independent Test**: Escribir texto en el input; la grilla se actualiza sin recargar
ni llamar al backend.

**Acceptance Scenarios**:

1. **Given** catálogo cargado, **When** escribo `"lla"`, **Then** aparecen productos
   cuyo `name` contiene `"lla"` (case-insensitive, sin acentos).
2. **Given** input vacío o solo espacios, **When** filtro, **Then** no se aplica filtro
   por nombre (solo categoría activa).
3. **Given** texto en el input, **When** pulso limpiar, **Then** se borra la búsqueda
   y se mantiene la categoría seleccionada.

---

### User Story 3 - Filtros combinados categoría + nombre (Priority: P2)

Como visitante, quiero que categoría y búsqueda se apliquen juntas (AND).

**Acceptance Scenarios**:

1. **Given** categoría `BAUTISMO` y búsqueda `"cert"`, **When** filtro, **Then** solo
   productos de BAUTISMO cuyo nombre contiene `"cert"`.
2. **Given** categoría `TODOS` y búsqueda activa, **When** filtro, **Then** busco en
   todo el catálogo.
3. **Given** cambio de categoría o texto, **When** filtro, **Then** paginación vuelve
   a página 1.

---

### User Story 4 - Paridad desktop (Priority: P2)

Como visitante en desktop, quiero el mismo input de búsqueda en el sidebar junto a
categorías.

**Acceptance Scenarios**:

1. **Given** viewport desktop, **When** uso el sidebar, **Then** veo input de búsqueda
   y lista de categorías con la misma lógica de filtrado que mobile.

---

### User Story 5 - Mensajes sin resultados claros (Priority: P2)

Como visitante, quiero entender por qué no hay productos visibles.

**Acceptance Scenarios**:

1. **Given** categoría sin productos y sin búsqueda, **When** lista vacía, **Then**
   mensaje de categoría vacía.
2. **Given** búsqueda sin coincidencias, **When** lista vacía, **Then** mensaje con
   el término buscado.
3. **Given** categoría + búsqueda sin coincidencias, **When** lista vacía, **Then**
   mensaje que menciona ambos criterios.

---

### Edge Cases

- Producto sin `categories` → no coincide con filtro de categoría específica; sí con TODOS.
- Categorías cargadas async → chips reflejan `ProductsContext.categories` actualizado.
- Input solo espacios → trim; equivale a búsqueda vacía.
- FAB carrito no debe tapar la barra sticky (z-index coordinado).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Eliminar doble scroll horizontal en mobile; un solo contenedor scrollable
  para chips de categoría.
- **FR-002**: Barra mobile sticky (`top` bajo navbar) con input de búsqueda + chips.
- **FR-003**: Filtrar por `product.name` contains; case-insensitive; sin acentos; desde
  la primera letra (sin mínimo).
- **FR-004**: Combinar categoría + búsqueda con lógica AND.
- **FR-005**: Reset de paginación a página 1 al cambiar categoría o búsqueda.
- **FR-006**: Botón limpiar búsqueda visible cuando hay texto.
- **FR-007**: Mensajes empty state diferenciados según causa.
- **FR-008**: Función pura `filterCatalogProducts` + tests Vitest.
- **FR-009**: Filtrado client-side sobre `ProductsContext.products`; sin backend.
- **FR-010**: Input de búsqueda en sidebar desktop con paridad funcional.
- **FR-011**: Categorías derivadas del contexto (no snapshot congelado al mount).

### Key Entities

- **Filtro de catálogo**: `{ category: string, searchQuery: string }`.
- **Producto listado**: `id`, `name`, `categories[]`, demás campos existentes.

## Success Criteria *(mandatory)*

- **SC-001**: Mobile — una sola barra horizontal en zona de chips (sin doble scrollbar).
- **SC-002**: Escribir 1 letra actualiza grilla al instante (client-side).
- **SC-003**: `"comunion"` encuentra producto `"Comunión"` (test unitario).
- **SC-004**: Categoría + texto aplican AND (test unitario).
- **SC-005**: `npm test` pasa suite de `filterCatalogProducts`.
- **SC-006**: Sticky verificable manualmente al scroll en mobile.

## Assumptions

- Alcance: ruta `/shopProducts` únicamente (no admin ni carrusel Home).
- Catálogo completo ya en memoria vía `ProductsContext`.
- Design system Saphire: rose-gold, glassmorphism, `react-icons`.

## Out of Scope

- Búsqueda en `details`, precio o stock.
- API server-side de búsqueda.
- Autocomplete / historial.
- Highlight del texto en cards.
