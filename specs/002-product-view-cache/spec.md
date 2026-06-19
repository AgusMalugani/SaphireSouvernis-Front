# Feature Specification: Optimización de vista/edición de producto (cache-first + UX)

**Feature Branch**: `002-product-view-cache`

**Created**: 2026-06-19

**Status**: Ready

**Input**: User description: "Optimización de vista/edición de producto en panel admin:
cache-first desde catálogo ya cargado, skeleton en modal, fetch condicionado a apertura,
imágenes optimizadas en detalle/edición; sin cambios de backend en v1."

## Clarifications

### Session 2026-06-19

- Q: ¿Qué transformación Cloudinary usar para imágenes optimizadas en modal/edición? → A: `w_400,h_400,c_fill` (cuadrado 400px, recorte centrado).
- Q: ¿Qué cuenta como "catálogo de sesión" para cache-first? → A: Cualquier producto en el array `products` de ProductsContext (hidratación localStorage, post-fetch, o tras edición).
- Q: ¿UX cuando falla la carga en cache miss? → A: Toast de error + mensaje inline; modal/form permanece abierto.
- Q: ¿Forma del skeleton en cache miss? → A: Espejo del layout final (bloque cuadrado imagen + 2–3 líneas texto + barra precio) en modal y edición.
- Q: ¿Cuándo una URL es elegible para Cloudinary? → A: Host contiene `cloudinary.com` **y** ruta incluye segmento `/upload/`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver producto al instante desde el dashboard (Priority: P1)

Como administrador en el dashboard, quiero abrir el detalle de un producto con el
botón "Ver" y ver nombre, imagen, descripción y precio de inmediato cuando ese
producto ya forma parte del catálogo cargado en la sesión, sin esperar una nueva
consulta al servidor.

**Why this priority**: Es el flujo más frecuente y el que hoy genera la demora más
visible; el catálogo completo ya está disponible en memoria tras cargar el inventario.

**Independent Test**: Con el dashboard mostrando la tabla de productos, abrir el modal
"Ver" y comprobar que el detalle aparece sin demora perceptible y sin solicitud
redundante al endpoint de producto individual.

**Acceptance Scenarios**:

1. **Given** el catálogo admin ya cargado con el producto X, **When** el admin pulsa
   "Ver" sobre X, **Then** el modal muestra los datos de X usando la información ya
   disponible en la sesión.
2. **Given** el catálogo admin ya cargado, **When** el admin abre "Ver" sobre cualquier
   producto listado, **Then** no se realiza una consulta individual al servidor para
   obtener datos que ya están en el catálogo de la sesión.
3. **Given** el modal cerrado, **When** el admin no ha abierto "Ver", **Then** no se
   dispara carga de detalle de producto asociada a ese modal.

---

### User Story 2 - Feedback visual mientras se obtiene un producto no cacheado (Priority: P1)

Como administrador, quiero ver un indicador de carga coherente con el layout final
cuando el detalle del producto aún no está en la sesión, para no enfrentarme a un
modal vacío o con saltos bruscos de contenido.

**Why this priority**: Mejora la percepción de calidad en cache miss (acceso directo,
catálogo vacío o producto ausente del listado) y evita la sensación de pantalla rota.

**Independent Test**: Simular un producto no presente en el catálogo de sesión,
abrir su vista de detalle y verificar placeholder de carga antes del contenido final.

**Acceptance Scenarios**:

1. **Given** el producto solicitado no está en el catálogo de sesión, **When** el
   admin abre el modal "Ver", **Then** se muestra un estado de carga que respeta la
   forma del contenido final (imagen + textos) antes de mostrar los datos.
2. **Given** el modal abierto y datos pendientes, **When** la consulta al servidor
   finaliza con éxito, **Then** el contenido reemplaza al placeholder sin cambiar
   bruscamente las dimensiones del layout.
3. **Given** el modal cerrado (`isOpen` falso), **When** existe un identificador de
   producto asociado al componente, **Then** no se inicia carga remota de detalle
   hasta que el modal esté abierto.

---

### User Story 3 - Editar producto reutilizando el catálogo de sesión (Priority: P2)

Como administrador, quiero entrar a la pantalla de edición de un producto y ver el
formulario precargado de inmediato si ese producto ya está en el catálogo cargado,
reservando la consulta individual al servidor solo cuando falte en sesión.

**Why this priority**: Mismo patrón de redundancia que el modal "Ver"; reduce espera
al editar desde la tabla de inventario.

**Independent Test**: Desde dashboard con catálogo cargado, navegar a editar un
producto listado y comprobar formulario precargado sin consulta individual; repetir
con URL directa sin catálogo previo y verificar carga remota.

**Acceptance Scenarios**:

1. **Given** el catálogo de sesión contiene el producto Y, **When** el admin navega a
   editar Y desde el inventario, **Then** el formulario se precarga con los datos de Y
   sin consulta individual al servidor.
2. **Given** el catálogo de sesión no contiene el producto Z, **When** el admin abre
   la URL de edición de Z, **Then** el sistema obtiene Z del servidor y completa el
   formulario tras un estado de carga visible.
3. **Given** edición iniciada desde cache de sesión, **When** el admin guarda cambios,
   **Then** el comportamiento de guardado existente no regresiona (misma experiencia
   de éxito/error que hoy).

---

### User Story 4 - Imágenes más livianas en detalle y edición (Priority: P2)

Como administrador, quiero que las imágenes mostradas en el modal de detalle y en la
vista previa de edición carguen más rápido, usando versiones optimizadas para
visualización en pantalla cuando la URL del asset lo permita.

**Why this priority**: Parte de la demora percibida puede deberse al peso de la
imagen original almacenada en el CDN, no solo a la consulta de datos.

**Independent Test**: Comparar tiempo/peso de carga de imagen en modal antes y después
en un producto con imagen alojada en Cloudinary; verificar fallback para URLs no
transformables.

**Acceptance Scenarios**:

1. **Given** un producto con imagen alojada en Cloudinary, **When** se muestra en el
   modal "Ver" o preview de edición, **Then** se solicita una variante `w_400,h_400,c_fill`
   (menor peso que la original de catálogo completo).
2. **Given** un producto con URL de imagen que no admite transformación, **When** se
   muestra en detalle/edición, **Then** se usa la URL original sin error visible.
3. **Given** imagen optimizada en modal, **When** el usuario abre el detalle, **Then**
   no se degrada la calidad de forma que impida identificar el producto.

---

### Edge Cases

- ¿Qué ocurre si el catálogo de sesión está vacío al abrir "Ver"? Debe aplicarse
  flujo de cache miss: placeholder + consulta individual.
- ¿Qué ocurre si el admin accede directamente a `/product/edit/:id` sin haber cargado
  el dashboard? Consulta individual permitida; placeholder en formulario hasta respuesta.
- ¿Qué ocurre si el modal se cierra mientras una consulta individual está en curso?
  No debe actualizar estado del modal cerrado ni provocar errores en consola.
- ¿Qué ocurre si el producto fue eliminado en backend pero aún aparece en cache de
  sesión? La vista puede mostrar datos cacheados; error al guardar/consultar fresca
  queda fuera de alcance v1 (sin invalidación de cache).
- ¿Qué ocurre con URLs de imagen vacías o inválidas? Debe mostrarse fallback visual
  sin romper el modal o el formulario.
- ¿Qué ocurre si el backend no responde en cache miss? Toast de error (`react-toastify`)
  + mensaje inline en modal/form; la vista permanece abierta; no pantalla en blanco indefinida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Al abrir el modal "Ver producto", el sistema MUST intentar resolver el
  detalle desde el catálogo ya cargado en la sesión admin antes de consultar al servidor.
- **FR-002**: El sistema MUST consultar al servidor por producto individual solo en
  cache miss (producto ausente del catálogo de sesión).
- **FR-003**: El modal "Ver producto" MUST mostrar un skeleton que replica el layout final
  (imagen cuadrada + líneas de texto + precio) cuando los datos aún no están disponibles.
- **FR-004**: El modal MUST iniciar carga remota de detalle solo cuando está abierto
  y el producto no está en cache de sesión.
- **FR-005**: La pantalla de edición MUST aplicar la misma estrategia cache-first:
  precarga desde catálogo de sesión; consulta individual solo en cache miss.
- **FR-006**: En vistas de detalle (modal) y preview de edición, el sistema MUST usar
  variantes Cloudinary `w_400,h_400,c_fill` cuando la URL es elegible (host `cloudinary.com`
  y segmento `/upload/` en la ruta).
- **FR-007**: Para URLs de imagen no elegibles, el sistema MUST usar la URL
  original sin fallar.
- **FR-008**: La feature MUST incluir tests automatizados de la lógica pura de
  resolución de cache y transformación de URL de imagen (sin montar interfaz completa).
- **FR-009**: Toda comunicación con el servidor MUST seguir el cliente HTTP centralizado
  del proyecto; prohibido acceso directo fuera del patrón establecido.
- **FR-010**: El comportamiento funcional de guardado, navegación admin y permisos
  MUST permanecer equivalente al actual (sin regresión en flujos de edición).
- **FR-011**: En cache miss fallido, el sistema MUST mostrar toast de error y mensaje
  inline en modal o formulario, manteniendo la vista abierta.

### Key Entities

- **Catálogo de sesión admin**: Array `products` en ProductsContext — incluye hidratación
  desde localStorage, datos post-`fetchAllProducts` y actualizaciones tras edición;
  fuente primaria para detalle/edición en cache hit.
- **Detalle de producto**: Identificador, nombre, descripción, precio, stock, imagen,
  categorías — datos necesarios para modal "Ver" y formulario de edición.
- **Cache hit / cache miss**: Hit = producto encontrado en catálogo de sesión; miss =
  requiere consulta individual al servidor.
- **Variante optimizada de imagen**: URL derivada de la original con transformación
  Cloudinary `w_400,h_400,c_fill` para visualización en detalle/edición.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Con catálogo admin cargado, 100% de aperturas del modal "Ver" sobre
  productos listados completan la visualización del detalle sin consulta individual
  al servidor (verificable en herramientas de red del navegador).
- **SC-002**: En cache miss, 100% de aperturas muestran estado de carga visible antes
  del contenido final (sin modal vacío > 300 ms).
- **SC-003**: Desde inventario con catálogo cargado, 100% de navegaciones a editar un
  producto listado precargan el formulario sin consulta individual al servidor.
- **SC-004**: Imágenes Cloudinary en modal y preview de edición usan URL con
  `w_400,h_400,c_fill` en 100% de los casos elegibles; URLs no elegibles mantienen
  fallback sin error.
- **SC-005**: La suite de tests automatizados documentada en FR-008 pasa con un solo
  comando de test del proyecto.
- **SC-006**: Un administrador percibe apertura "instantánea" del modal "Ver" en
  condiciones de catálogo precargado (validación manual en quickstart; sin regresión
  funcional en guardado).

## Assumptions

- **Audiencia**: Solo panel administrativo (`ModalViewProduct`, `EditProduct`); el
  catálogo público de la tienda queda fuera de alcance v1.
- **Fuente de cache**: Array `products` en ProductsContext (localStorage inicial + fetch +
  edición); sin nueva librería de estado global.
- **Freshness v1**: No hay revalidación en background tras cache hit; se confía en el
  catálogo de sesión hasta recarga de página o nueva carga del inventario.
- **Imágenes**: La mayoría de `img_url` provienen de Cloudinary; transformación fija
  `w_400,h_400,c_fill` en modal y preview de edición; elegibilidad = host `cloudinary.com`
  + segmento `/upload/` (sin nueva variable de entorno en v1).
- **Backend**: Sin cambios en `GET /products/:id` ni cache server-side en esta entrega.
- **Constitución**: Cumple principios I (cliente HTTP centralizado), III (Context API
  de productos) y VII (tests Vitest) del frontend.

## Out of Scope

- Cambios en backend (`findOneById`, cache NestJS, DTOs, paginación de listado).
- React Query, SWR, Redux o refactor completo del proveedor de productos.
- Optimización de imágenes en catálogo público, carrito u otras vistas fuera de
  modal "Ver" y preview de edición.
- Invalidación automática de cache cuando un producto cambia en otro tab/sesión.
- Prefetch al hover sobre el botón "Ver".
- Tests e2e o Playwright (unitarios + quickstart manual en esta feature).
