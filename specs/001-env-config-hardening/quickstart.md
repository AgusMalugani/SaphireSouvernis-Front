# Quickstart: Validar 001-env-config-hardening

Guía para verificar manualmente la feature después de `/speckit-implement`.

## Prerequisites

- Node.js ≥ 18, `npm install` ejecutado
- Backend NestJS opcional (para SC-007); catálogo tiene fallback `products.js` si API caída
- `.env` local copiado desde `.env.example` actualizado

## 1. Tests unitarios Vitest

```bash
npm test
```

**Esperado**: Matriz en [contracts/runtime-config.md](./contracts/runtime-config.md) — 4+
casos en `parseClientEnv.test.js` pasan.

## 2. Lint

```bash
npm run lint
```

**Esperado**: Sin errores nuevos.

## 3. Verificar cero `import.meta.env` en src/

```bash
rg "import\.meta\.env" src/
```

**Esperado**: Solo coincidencias en `src/config/env.js` (idealmente una sola línea por
variable o bloque delegado).

## 4. Arranque local con config válida

`.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SHOP_URL=https://saphire-souvenirs-shop.vercel.app
VITE_LOGO_URL=https://res.cloudinary.com/dxt4qdckz/image/upload/v1744589272/logo-saphire_it2k6r.png
VITE_WHATSAPP_NUM=3417120039
```

```bash
npm run dev
```

**Esperado**:

- App carga sin error de config en consola
- Logo visible en Navbar
- FAB WhatsApp visible en Home
- `/shopProducts` intenta cargar productos (backend o fallback toast)

## 5. Fail-fast — variable faltante

Renombrar temporalmente en `.env`: `# VITE_API_URL=...` (comentada).

```bash
npm run dev
```

**Esperado**: Error explícito al cargar módulo env (no pantalla con API `undefined`).

Restaurar `.env` después.

## 6. Fail-fast — API sin `/api/v1`

```env
VITE_API_URL=http://localhost:3000
```

**Esperado**: Error explícito mencionando regla `/api/v1`.

Restaurar URL correcta.

## 7. WhatsApp consistente

Navegar: Home (FAB), Footer, `/about-us` (hero).

**Esperado**: Todos los enlaces WhatsApp usan `5493417120039` (o número configurado en env),
no `3413857748` hardcodeado.

## 8. Build producción

```bash
npm run build
```

**Esperado**: Build exitoso con `.env` completo.

Con variable comentada, build MUST fallar (fail-fast en import chain).

## 9. Vercel checklist

En el dashboard del proyecto, confirmar las 4 variables `VITE_*` configuradas.

`VITE_API_URL` MUST apuntar al backend Render **incluyendo** `/api/v1`, por ejemplo:

```text
https://tu-backend.onrender.com/api/v1
```

## Referencias

- Contrato: [contracts/runtime-config.md](./contracts/runtime-config.md)
- Modelo: [data-model.md](./data-model.md)
- Plan: [plan.md](./plan.md)
