# Data Model: 001-env-config-hardening (Frontend)

Esta feature no modifica entidades de negocio ni Context API. El modelo documenta
**variables de entorno Vite** y el **objeto `envs` exportado**.

## Environment Variables (input — `.env` / Vercel)

| Variable | Tipo | Required | Validación |
|----------|------|----------|------------|
| `VITE_API_URL` | string (URL) | Sí | No vacía; MUST terminar en `/api/v1` |
| `VITE_SHOP_URL` | string (URL) | Sí | No vacía; URL válida http(s) |
| `VITE_LOGO_URL` | string (URL) | Sí | No vacía; URL válida http(s) |
| `VITE_WHATSAPP_NUM` | string | Sí | 7–15 dígitos; sin `+` ni espacios |

Prefijo `VITE_` obligatorio por Vite. Valores ausentes o `""` → fail-fast.

## ClientEnvInput (parseClientEnv argument)

| Campo | Fuente |
|-------|--------|
| `VITE_API_URL` | `import.meta.env.VITE_API_URL` |
| `VITE_SHOP_URL` | `import.meta.env.VITE_SHOP_URL` |
| `VITE_LOGO_URL` | `import.meta.env.VITE_LOGO_URL` |
| `VITE_WHATSAPP_NUM` | `import.meta.env.VITE_WHATSAPP_NUM` |

## ClientEnvs (output — `export const envs`)

| Propiedad | Tipo | Origen | Consumidor(es) |
|-----------|------|--------|----------------|
| `apiUrl` | string | `VITE_API_URL` | `apiClient.js` |
| `shopUrl` | string | `VITE_SHOP_URL` | *(ninguno en 001 — contrato futuro)* |
| `logoUrl` | string | `VITE_LOGO_URL` | `Navbar`, `Footer`, `AboutUs` |
| `whatsappNum` | string | `VITE_WHATSAPP_NUM` | `App`, `Footer`, `HeaderQuienSomos` |

## State Transitions

No aplica. Config evaluada una vez al importar `env.js` (module singleton).

## Relationships

```text
.env / Vercel env
    → import.meta.env (Vite inject)
        → env.js
            → parseClientEnv(raw)
                → Zod validate + transform
                    → envs { apiUrl, shopUrl, logoUrl, whatsappNum }
                        ├── apiClient.js
                        ├── App.jsx / Footer / HeaderQuienSomos
                        └── Navbar / AboutUs (logoUrl)
```

## Out of Scope (data)

- Instagram URL, hero images, favicon — permanecen hardcode hasta feature SDD futura
- `VITE_SHOP_URL` sin binding UI en 001
