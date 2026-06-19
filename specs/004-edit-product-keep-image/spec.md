# Feature Specification: Edición de producto sin re-subir imagen

**Feature Branch**: `004-edit-product-keep-image`

**Created**: 2026-06-19

**Status**: Ready

**Input**: Al editar un producto en el panel admin, el administrador debe poder
modificar datos (precio, nombre, categorías, etc.) sin estar obligado a volver a
subir la imagen, conservando la foto existente si no elige un archivo nuevo.

## Contexto técnico (referencia)

Componentes actuales involucrados:

- `src/components/Products/EditProduct.jsx` — carga producto y submit; ya preserva
  `img_url` cuando no hay archivo nuevo.
- `src/components/Products/FormProduct.jsx` — wizard de 3 pasos compartido con creación.
- `src/components/Products/formProductStep/ProductStep2.jsx` — validación que exige `file`
  para avanzar (bug en edición).
- `src/views/CreateProduct.jsx` — flujo de creación; imagen debe seguir siendo obligatoria.

**Causa raíz conocida**: Paso 2 valida solo la presencia de `file`, ignorando imagen
existente (`img_url` / `previewUrl`) en modo edición.

**Decisión de producto (pre-clarify)**: Opción A — mantener paso Imagen en edición,
pero hacerlo opcional si ya existe imagen. No saltar el paso automáticamente.

## Clarifications

### Session 2026-06-19

- Q: ¿Comportamiento de "Cambiar imagen" en edición? → A: Abrir selector sin limpiar
  preview; reemplazar solo al confirmar archivo nuevo.
- Q: ¿Qué cuenta como imagen existente? → A: `product.img_url` non-empty tras `trim`
  (fuente de verdad; preview rota no bloquea).
- Q: ¿Copy/UX paso Imagen en edición? → A: Preview + texto "Imagen actual — no es
  necesario cambiarla" + botón "Cambiar imagen".
- Q: ¿Edición sin `img_url`? → A: Toast específico: "Este producto no tiene imagen.
  Subí una para continuar."
- Q: ¿URL de preview en edición? → A: `toCloudinaryDisplayUrl` con fallback a
  `img_url` original en `onError` de la etiqueta imagen.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Editar datos sin cambiar imagen (Priority: P1)

Como administrador, quiero modificar el precio, nombre u otros datos de un producto
existente y completar el wizard sin subir una imagen nueva, conservando la foto
que ya tiene el producto.

**Why this priority**: Es el flujo más frecuente en mantenimiento de catálogo y hoy
está bloqueado por una validación pensada solo para creación.

**Independent Test**: Abrir edición de un producto con imagen, cambiar solo el precio
en paso 1, avanzar paso 2 sin seleccionar archivo, confirmar en paso 3 y verificar
que el producto guardado mantiene la misma imagen.

**Acceptance Scenarios**:

1. **Given** un producto con `img_url` válida, **When** el admin edita solo el precio
   y avanza del paso Imagen sin elegir archivo, **Then** puede llegar al paso Resumen
   y guardar sin toast de error por imagen faltante.
2. **Given** edición completada sin archivo nuevo, **When** se guarda el producto,
   **Then** la imagen visible en dashboard/tienda es la misma que antes de editar.
3. **Given** paso Imagen en edición con imagen existente, **When** el admin pulsa
   Siguiente sin tocar la imagen, **Then** no aparece "Debés seleccionar una imagen
   para continuar."

---

### User Story 2 - Creación sigue exigiendo imagen (Priority: P1)

Como administrador al crear un producto nuevo, debo seguir viendo la imagen como
campo obligatorio en el paso 2, para no publicar productos sin foto.

**Why this priority**: Evitar regresión en el flujo de alta; el wizard es compartido
entre creación y edición.

**Independent Test**: Iniciar creación de producto, completar paso 1, intentar
avanzar paso 2 sin imagen y verificar bloqueo con mensaje claro.

**Acceptance Scenarios**:

1. **Given** flujo de creación de producto, **When** el admin intenta avanzar paso 2
   sin seleccionar archivo, **Then** se muestra error y no avanza al paso Resumen.
2. **Given** creación con imagen seleccionada, **When** completa el wizard, **Then**
   el producto se crea con la imagen subida (sin regresión).

---

### User Story 3 - Cambiar imagen opcionalmente en edición (Priority: P2)

Como administrador, quiero poder reemplazar la imagen en edición si lo deseo,
sin perder la imagen actual hasta que confirme un archivo nuevo.

**Why this priority**: Complementa US1; el botón "Cambiar imagen" hoy puede borrar
el preview y dejar al admin sin imagen visible aunque el producto aún tenga `img_url`.

**Independent Test**: En edición, pulsar "Cambiar imagen", cancelar o no elegir
archivo, y verificar que la preview vuelve a mostrar la imagen existente; alternativamente,
elegir archivo nuevo y verificar reemplazo al guardar.

**Acceptance Scenarios**:

1. **Given** edición con imagen existente, **When** el admin sube un archivo nuevo,
   **Then** la preview muestra la nueva imagen y al guardar se actualiza en backend.
2. **Given** edición con imagen existente, **When** el admin pulsa "Cambiar imagen"
   pero cancela el selector sin elegir archivo, **Then** el preview y `img_url`
   permanecen sin cambios y puede avanzar.

---

### User Story 4 - Regla de validación testeable (Priority: P2)

Como equipo, quiero una regla pura que distinga creación vs edición para el paso
Imagen, verificable con tests automatizados.

**Why this priority**: Alineado con constitución frontend (Vitest); evita regresiones
futuras al compartir `ProductStep2` entre flujos.

**Independent Test**: Ejecutar suite de tests unitarios de la regla con matriz
create/edit × con/sin file × con/sin imagen existente.

**Acceptance Scenarios**:

1. **Given** modo creación sin archivo, **When** se evalúa si puede avanzar paso Imagen,
   **Then** resultado es falso.
2. **Given** modo edición con `img_url` existente y sin archivo nuevo, **When** se
   evalúa si puede avanzar, **Then** resultado es verdadero.

---

### Edge Cases

- ¿Producto en edición sin `img_url` (vacía o nunca tuvo imagen)? Paso 2 debe
  exigir archivo nuevo; toast: "Este producto no tiene imagen. Subí una para continuar."
- ¿Preview rota pero `img_url` existe en datos? Debe poder avanzar (validación por
  `img_url` trim non-empty); preview usa Cloudinary display con fallback a original
  en error de carga.
- ¿Admin cambia datos en paso 1 y navega paso 2 → 3 → guardar sin tocar imagen?
  `img_url` original debe enviarse intacta al backend.
- ¿Producto cargado desde cache de sesión vs fetch individual? Misma regla de
  edición independiente del origen de datos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: En modo **edición**, el paso Imagen MUST permitir avanzar si
  `product.img_url` es non-empty tras `trim`, aunque no haya archivo nuevo.
- **FR-002**: En modo **creación**, el paso Imagen MUST seguir exigiendo un archivo
  nuevo para avanzar; toast: "Debés seleccionar una imagen para continuar."
- **FR-003**: Al guardar en edición sin archivo nuevo, el sistema MUST conservar
  la `img_url` existente (sin re-subida al servicio de imágenes).
- **FR-004**: Al guardar en edición con archivo nuevo, el sistema MUST subir la
  imagen y actualizar `img_url` (sin regresión del flujo actual).
- **FR-005**: El wizard MUST distinguir explícitamente modo creación vs edición
  (`mode: 'create' | 'edit'` en `FormProduct` / paso 2).
- **FR-006**: "Cambiar imagen" en edición MUST abrir el selector de archivo sin
  limpiar el preview; solo reemplaza al confirmar archivo nuevo.
- **FR-007**: En edición con imagen existente, paso 2 MUST mostrar copy auxiliar:
  "Imagen actual — no es necesario cambiarla".
- **FR-008**: En edición sin `img_url`, MUST bloquear avance con toast: "Este
  producto no tiene imagen. Subí una para continuar."
- **FR-009**: Preview en edición MUST usar variante Cloudinary display cuando aplique,
  con fallback a `img_url` original en error de carga (`onError`).
- **FR-010**: MUST incluir tests Vitest de regla pura `canAdvanceFromImageStep`.
- **FR-011**: MUST NOT introducir cambios en backend ni contratos API en v1.

### Key Entities

- **Imagen existente**: `product.img_url` con texto non-empty tras `trim`; no depende
  de que el preview renderice correctamente.
- **Archivo de imagen nuevo**: Selección opcional en edición; obligatoria en creación.
- **Modo del wizard**: `create` | `edit` — determina reglas de validación del paso 2.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% de ediciones que cambian solo campos de texto/precio/categorías
  completan el wizard sin error de imagen obligatoria (prueba manual quickstart).
- **SC-002**: 100% de intentos de creación sin imagen en paso 2 siguen bloqueados
  (sin regresión).
- **SC-003**: Tras editar sin archivo nuevo, la URL de imagen del producto en
  listado admin es idéntica a la previa (verificable en red o UI).
- **SC-004**: Suite de tests de `canAdvanceFromImageStep` (FR-010) pasa con un solo
  comando de test del proyecto.
- **SC-005**: Edición con archivo nuevo reemplaza imagen correctamente (prueba manual).
- **SC-006**: Preview en edición muestra imagen (Cloudinary o fallback original) en
  paso 2 cuando `img_url` es válida (prueba manual).

## Assumptions

- **Alcance**: Solo panel admin — rutas de edición (`EditProduct` / `ViewEditProduct`)
  y creación (`CreateProduct`); tienda pública fuera de alcance.
- **Submit existente**: `EditProduct.jsx` ya omite `ImageProduct` cuando no hay
  `file`; la feature corrige validación UI del wizard, no el guardado backend.
- **Wizard compartido**: Se mantiene estructura de 3 pasos; no se salta paso 2
  automáticamente en edición (Opción A).
- **Backend**: `UpdateProduct` y upload de imagen sin cambios en v1.
- **Constitución**: Vitest para lógica pura; Context API y `apiClient` sin cambios
  de patrón.

## Out of Scope

- Saltar automáticamente el paso Imagen en edición (Opción B/C).
- Hacer la imagen opcional también en **creación**.
- Cambios en backend, DTOs o endpoints de productos/imágenes.
- Refactor completo del wizard a un solo formulario.
- Tests e2e / Playwright (unitarios + quickstart manual en v1).
