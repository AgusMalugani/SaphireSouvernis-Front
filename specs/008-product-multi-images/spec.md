# Feature Specification: Galería multi-imagen por producto (1–3 fotos)

**Feature Branch**: `008-product-multi-images`

**Created**: 2026-07-03

**Status**: Ready (specify ✅ clarify ✅)

**Input**: Visualizar y administrar entre 1 y 3 fotos por producto — galería en modal
de tienda y preview en admin create/edit — consumiendo `img_urls[]` del backend con
fallback a `img_url`.

**Repo**: `SaphireSouvernis-Front` (principal). Depende de Back `008-product-multi-images`.

## Contexto técnico (referencia)

### Estado actual

| Área | Situación |
|------|-----------|
| Tienda — catálogo | `Product.jsx`: thumbnail única vía prop `img_url`; carrito recibe `img_url` |
| Tienda / Admin — detalle | `ModalViewProduct.jsx`: una imagen (`img_url` + `toCloudinaryDisplayUrl`) |
| Admin — wizard | `FormProduct` paso 2 (`ProductStep2`): input `file` único; paso 3 (`ProductStep3`): una imagen |
| Admin — edición | `EditProduct.jsx`: `file` + `previewUrl`; preserva `img_url` sin re-upload (004) |
| Upload | `ImageProduct.js` → `POST /products/upload/:id` con un solo `file` en FormData |
| Utils | `toCloudinaryDisplayUrl`, `ProductImagePreview`, `canAdvanceFromImageStep` (regla 1 imagen) |
| Cache | `useProductDetail` / `ProductsContext` — producto con `img_url` única |
| Consumidores thumb | `TableProducts`, `ViewBuyOrder`, `PostShopOrderSummary` usan `product.img_url` |

### Specs previas relacionadas

- `002-product-view-cache` — cache de detalle y skeleton en `ModalViewProduct`
- `004-edit-product-keep-image` — avanzar paso Imagen en edición sin re-subir

### Reglas de proyecto

- HTTP exclusivamente vía `apiClient` en `src/services/`
- Design system: rose-gold, glassmorphism, `font-display`, `react-icons` (Fi/Hi)
- Prohibido `fetch` directo y `import.meta.env` en `src/`

## Clarifications

### Session 2026-07-03

- Q: ¿Dónde mostrar galería? → A: Modal detalle tienda y admin create/edit (paso imagen
  + resumen paso 3). Al editar, el admin MUST ver las fotos actuales del producto.
- Q: ¿Cuántas fotos? → A: Mín 1, máx 3 (1, 2 o 3 válidas).
- Q: ¿UX admin upload? → A: Selector múltiple libre hasta 3 con preview de cada imagen
  seleccionada/subida.
- Q: ¿Compat `img_url`? → A: Consumir `img_urls` como fuente primaria; fallback a
  `img_url` si `img_urls` ausente/vacío (transición).

### Session 2026-07-03 (clarify — alineación Back 008)

- Q: ¿Campo multipart en create/update? → A: `files` (1–3 archivos); orden de
  selección = orden en `img_urls[]`; reemplazar flujo legacy `file` único.
- Q: ¿Submit edición sin archivos nuevos? → A: `PUT` JSON solo metadata; galería
  persistida intacta; no llamar upload deprecado.
- Q: ¿Submit edición con archivos nuevos? → A: `PUT` multipart con 1–3 `files`;
  reemplazo total de galería (no merge parcial en v1).
- Q: ¿Endpoint `POST /products/upload/:id`? → A: Deprecado; Front MUST migrar a
  batch en `POST /products` (create) y `PUT /products/:id` (edit con imágenes).
- Q: ¿Respuestas API envelope? → A: Servicios products MUST leer `response.data`
  cuando Back 008 entregue `{ data: Product }` (mismo deploy).
- Q: ¿Placeholder sin imagen real? → A: `img_urls: []` + `img_url` placeholder
  Back → tratar como sin imagen (bloqueo creación/edición según reglas 004).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Galería en modal detalle (Priority: P1)

Como cliente (o admin en vista rápida), quiero ver 1–3 fotos al abrir el detalle del
producto, para evaluar el artículo desde distintos ángulos.

**Why this priority**: Es la experiencia central de descubrimiento; hoy solo se muestra
una foto aunque el backend soporte más.

**Independent Test**: Abrir modal desde tienda con producto de 2–3 imágenes; navegar
galería; repetir con producto legacy de solo `img_url`.

**Acceptance Scenarios**:

1. **Given** producto con 1 imagen, **When** abro modal, **Then** una foto visible sin
   controles de navegación superfluos (sin flechas/dots innecesarios).
2. **Given** producto con 2–3 imágenes, **When** abro modal, **Then** galería navegable
   con flechas + indicadores (dots), estilo Saphire, accesible por teclado
   (`aria-label` en controles, focus visible).
3. **Given** fallo de carga en imagen secundaria (Cloudinary), **When** ocurre `onError`,
   **Then** fallback a URL original (mismo patrón que `ProductImagePreview`).
4. **Given** producto legacy sin `img_urls`, **When** abro modal, **Then** se muestra
   `img_url` como única imagen (compatibilidad transición).

---

### User Story 2 - Thumbnail principal en catálogo y carrito (Priority: P1)

Como cliente, en listado y carrito veo solo la imagen principal del producto.

**Why this priority**: Mantiene UI de catálogo limpia; evita duplicar lógica de
"primera imagen" en cada componente.

**Independent Test**: Producto con 3 fotos → tarjeta shop y ítem carrito muestran
solo la primera; producto legacy con solo `img_url` sin cambio visible.

**Acceptance Scenarios**:

1. **Given** producto con `img_urls[0]` o solo `img_url`, **When** veo tarjeta en shop,
   **Then** thumbnail = imagen principal (primera del array normalizado).
2. **Given** agrego producto al carrito, **When** reviso el ítem, **Then** usa imagen
   principal vía helper centralizado (no `img_url` hardcodeado en cada sitio).

---

### User Story 3 - Admin: subir y previsualizar 1–3 imágenes (Priority: P1)

Como administrador, quiero seleccionar hasta 3 fotos con preview al crear o editar, y
ver las existentes sin re-subirlas si no cambio nada.

**Why this priority**: Habilita la carga multi-imagen alineada al backend; extiende
004 sin regresión en edición sin cambios.

**Independent Test**: Crear con 2 archivos → previews + submit OK; editar producto con
3 URLs persistidas → ver las 3, avanzar sin nuevos archivos; seleccionar 4 → toast error.

**Acceptance Scenarios**:

1. **Given** creación, **When** selecciono 2 archivos en input múltiple, **Then** veo
   2 previews en grid y puedo avanzar wizard + submit.
2. **Given** creación sin archivos, **When** intento avanzar o submit, **Then** error:
   mínimo 1 imagen requerida.
3. **Given** selecciono 4 archivos, **When** confirmo selección, **Then** toast error:
   máximo 3 imágenes.
4. **Given** edición con 3 imágenes persistidas, **When** abro paso imagen, **Then**
   veo las 3 actuales; puedo continuar sin seleccionar archivos nuevos (extiende 004).
5. **Given** edición, **When** selecciono nuevos archivos, **Then** previews muestran
   la selección nueva antes de submit; reemplazo según contrato Back (set completo).
6. **Given** paso 3 resumen, **When** reviso antes de guardar, **Then** muestra todas
   las imágenes (existentes o nuevas previews).

---

### User Story 4 - Helpers y reglas testeables (Priority: P2)

Como equipo, quiero helpers puros para normalizar URLs de imagen y validar cantidad
1–3, verificables con Vitest.

**Why this priority**: Alineado con constitución (Vitest); evita regresiones al migrar
de `img_url` a `img_urls`.

**Independent Test**: Suite Vitest cubre normalización, min/max y avance paso imagen
en edición con URLs existentes.

**Acceptance Scenarios**:

1. **Given** producto con `img_urls: ['a','b']`, **When** normalizo, **Then**
   `getProductImageUrls` devuelve `['a','b']`.
2. **Given** producto solo con `img_url: 'x'`, **When** normalizo, **Then** devuelve `['x']`.
3. **Given** edición con ≥1 URL persistida y sin archivos nuevos, **When** evalúo avance
   paso imagen, **Then** resultado verdadero.

---

### Edge Cases

- Producto sin imágenes (`img_urls` vacío y sin `img_url`): creación bloqueada; edición
  bloqueada con toast de 004 ("Este producto no tiene imagen…").
- Producto legacy solo `img_url`: toda la UI funciona como 1 imagen (transición).
- Error Cloudinary en thumbnail de catálogo: fallback a URL original donde aplique
  `ProductImagePreview` o patrón `onError`.
- Edición: nueva selección de archivos reemplaza el set completo (no merge parcial en v1).
- Edición sin archivos nuevos: submit JSON único; URLs persistidas sin re-upload.
- Placeholder Back (`http://www.exampleImg.com`) con `img_urls: []`: sin imagen real.
- MIME inválido en upload: error 400 del Back; Front muestra toast con mensaje del API.
- `ModalViewProduct` compartido por tienda (`Product.jsx`) y admin (`DashboardAdmin`):
  galería aplica en ambos contextos.
- Cache hit en `useProductDetail`: producto incluye `img_urls` cuando Back los exponga.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: MUST existir componente reutilizable de galería (p. ej. `ProductImageGallery`)
  para modal detalle, soportando 1–3 imágenes con navegación condicional.
- **FR-002**: MUST existir `getProductImageUrls(product)` que normalice `img_urls[]` con
  fallback a `[img_url]` si ausente/vacío; y `getPrimaryProductImageUrl(product)` → índice 0.
- **FR-003**: `ModalViewProduct` MUST usar galería multi-imagen; reemplaza render
  single-image actual.
- **FR-004**: `Product.jsx`, `TableProducts`, `ViewBuyOrder`, `PostShopOrderSummary` MUST
  usar imagen principal vía helper centralizado.
- **FR-005**: `ProductStep2` MUST aceptar input múltiple (max 3), previews en grid y
  mensajes de validación min 1 / max 3.
- **FR-006**: `ProductStep3` MUST mostrar resumen multi-imagen (existentes + previews nuevas).
- **FR-007**: `CreateProduct` MUST enviar `POST /products` multipart con campo `files`
  (1–3) + metadata; `EditProduct` MUST usar `PUT` JSON sin archivos si galería no cambia,
  o `PUT` multipart con 1–3 `files` para reemplazo total.
- **FR-008**: `useProductDetail` y cache en `ProductsContext` MUST incluir `img_urls` en
  el modelo de producto consumido por la UI.
- **FR-009**: Servicios en `src/services/Products/` MUST usar `apiClient` exclusivamente;
  agregar `putFormData` si falta; dejar de usar `ImageProduct` + upload separado en edit.
- **FR-010**: Servicios products MUST normalizar respuestas envelope `{ data: T }` del
  Back 008 antes de devolver al caller.
- **FR-011**: MUST incluir tests Vitest: normalización helpers, validación cantidad 1–3,
  lógica avance paso imagen en edición con URLs existentes.
- **FR-012**: Galería con 2–3 imágenes MUST ser accesible: `aria-label` en flechas,
  indicadores, navegación por teclado, focus visible.

### Non-Functional Requirements

- **NFR-001**: UI MUST seguir design system Saphire (Tailwind v4, `font-display`,
  rose-gold, glassmorphism, bordes `border-white/60`).
- **NFR-002**: Iconografía MUST usar `react-icons` (Fi/Hi) con acento `text-rose-400`.
- **NFR-003**: MUST NOT usar `fetch` directo ni `import.meta.env` en `src/`.

### Key Entities

- **Imagen de producto**: URL persistida (Cloudinary) en `img_urls[]`; alias legacy
  `img_url` (primera imagen o única).
- **Archivos de upload**: 1–3 archivos locales seleccionados en admin; previews vía
  `URL.createObjectURL`; en edición reemplazan set completo al submit.
- **Imagen principal**: Primera URL del array normalizado; usada en catálogo, carrito,
  miniaturas admin y órdenes.

### API Contract Summary (consumo Front — delta Back 008)

```
POST /products              multipart: "files" (1–3) + metadata → { data: Product }
PUT  /products/:id          JSON → galería intacta → { data: Product }
PUT  /products/:id          multipart: "files" (1–3) → reemplazo galería → { data: Product }
GET  /products / :id        → { data: ... } con img_urls[] + img_url (= img_urls[0])
POST /products/upload/:id   @deprecated — no usar en flujos nuevos
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de productos con 2–3 imágenes muestran galería navegable en modal
  detalle (prueba manual quickstart).
- **SC-002**: 100% de productos legacy solo `img_url` siguen mostrando una imagen sin
  error (compatibilidad transición).
- **SC-003**: Creación sin imagen sigue bloqueada; selección de 4+ archivos muestra
  error claro en ≤1 interacción.
- **SC-004**: Edición con imágenes persistidas completa wizard sin re-upload cuando no
  se eligen archivos nuevos (sin regresión 004).
- **SC-005**: Catálogo, carrito, tabla admin y resúmenes de orden muestran la misma
  imagen principal para un producto dado.
- **SC-006**: Suite Vitest de helpers y validación paso imagen ejecuta con un solo
  comando de test del proyecto.
- **SC-007**: Edición sin archivos nuevos no invoca upload; galería post-save idéntica
  a la pre-edit (verificable en UI o red).
- **SC-008**: Create/edit con imágenes usan campo `files` (no `file` legacy) en FormData.

## Assumptions

- Galería modal: flechas + dots en v1; swipe mobile diferido a plan (opcional, bajo costo).
- En edición, imágenes persistidas se muestran con `ProductImagePreview`; archivos nuevos
  con `URL.createObjectURL`.
- Reemplazo de galería en edit es total (1–3 archivos reemplazan set completo); sin merge
  parcial en v1.
- Back `008-product-multi-images` mergeado o API disponible en dev antes de implementar
  upload multi-file y envelope.
- Contrato Back congelado: `img_urls: string[]` + alias `img_url` (= `img_urls[0]`).
- Deploy Back antes de Front; congelar contrato JSON antes de UI.

## Dependencies

- **Back 008-product-multi-images**: entidad/DTO con `img_urls[]`, upload multi-file,
  `img_url` como alias de compatibilidad.
- **Front 002-product-view-cache**: cache de detalle sin cambio de patrón.
- **Front 004-edit-product-keep-image**: reglas de avance paso imagen en edición (extender
  a array).

## Out of Scope

- Cambios entidad TypeORM / Cloudinary en Back (repo Back).
- Lightbox fullscreen / zoom pinch.
- Drag-and-drop para reordenar imágenes.
- Crop o edición de imágenes in-browser.
- Merge parcial de galería (añadir 1 foto sin reemplazar las demás).
- Uso de `POST /products/upload/:id` en flujos nuevos (legacy deprecado).
- Tests e2e / Playwright (unitarios + quickstart manual en v1).
