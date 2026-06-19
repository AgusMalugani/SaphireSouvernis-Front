# Quickstart: 003-shop-catalog-filters

## Tests

```bash
npm test
```

## Smoke mobile

1. Abrir `/shopProducts` en DevTools mobile (~375px).
2. Verificar **una** barra de scroll bajo chips (o ninguna visible gris duplicada).
3. Scroll down → barra búsqueda + categorías permanece sticky bajo header.
4. Escribir `"lla"` → filtra al instante.
5. Escribir `"comunion"` → encuentra productos con acento en nombre.
6. Seleccionar categoría + búsqueda → AND.
7. Limpiar con ✕ → mantiene categoría.

## Smoke desktop

1. Sidebar muestra input + categorías verticales.
2. Misma lógica de filtrado.

## Empty states

- Categoría vacía sin búsqueda → mensaje categoría.
- Búsqueda sin match → cita el término.
- Ambos → mensaje combinado.
