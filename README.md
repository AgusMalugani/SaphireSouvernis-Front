# 💎 SaphireSouvenirs — Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Context API](https://img.shields.io/badge/State-Context_API-F7DF1E?style=for-the-badge&logo=react&logoColor=black)]()

---

## 📖 Introduction

**SaphireSouvenirs Frontend** is the client-side application for a personalized souvenir e-commerce platform. It allows customers to browse a product catalog, place custom orders, and track their purchases — while providing admins with a protected dashboard to manage products and orders.

Built with a **modular, clean-code architecture**: centralized API communication, role-based route protection, and a fully environment-variable-driven configuration. No legacy dependencies, no hardcoded URLs.

---

## 🛠️ Tech Stack

| Category | Technology | Notes |
|----------|-----------|-------|
| **Core** | React 19 + Vite 6 (SWC) | JSX, fast HMR via SWC transformer |
| **Styling** | Tailwind CSS v4 | CSS-first config via `@import "tailwindcss"` — no `tailwind.config.js` required |
| **State Management** | Context API | Three isolated contexts: `Auth`, `Products`, `Orders` |
| **Routing** | React Router Dom v7 | `BrowserRouter` + `ProtectedRoute` RBAC guard |
| **HTTP Client** | Native `fetch` | Centralized via `apiClient.js` — no Axios |
| **Auth** | JWT (`jwt-decode`) | Token stored in `localStorage`, decoded client-side |
| **Notifications** | React Toastify v11 | App-wide toast system |
| **Modals** | React Modal v3 | Product and order modal interactions |
| **Icons** | React Icons v5 | Used in the admin `Sidebar` |

---

## 📁 Project Structure

```
src/
├── App.jsx                     # Route declarations and layout wrappers
├── main.jsx                    # Entry point — Provider chain + BrowserRouter
│
├── views/                      # Full-page screens (mapped 1:1 to routes)
│   ├── Home.jsx
│   ├── ShopProducts.jsx
│   ├── PostShop.jsx            # Post-purchase confirmation + WhatsApp redirect
│   ├── Login.jsx
│   ├── CreateProduct.jsx       # Admin: product creation form
│   ├── ViewEditProduct.jsx     # Admin: product edit wrapper
│   ├── DashboardAdmin.jsx      # Admin: product table + management
│   ├── ViewOrders.jsx          # Admin: orders management
│   └── NotFound.jsx
│
├── components/                 # Reusable UI grouped by domain
│   ├── Home/                   # Hero, carousel, footer, "Quiénes Somos"
│   ├── Navbar/                 # Top navigation with auth state
│   ├── Products/               # Product card, table, form, modals, image upload
│   │   └── formProductStep/    # Multi-step product form (Step1, 2, 3)
│   ├── Orders/                 # Order list, detail, edit, modals
│   ├── Login/                  # Login form component
│   ├── Siderbar/               # Admin sidebar navigation (React Icons)
│   └── RedirectToWhatsapp.jsx  # Floating WhatsApp CTA (CSS Module)
│
├── contexts/                   # Global state via Context API
│   ├── Auth/                   # AuthContext + AuthProvider (token lifecycle)
│   ├── Products/               # ProductsContext + ProductsProvider (catalog + cache)
│   └── Orders/                 # OrdersContext + OrdersProvider (order management)
│
├── services/                   # All API interactions — one file per resource
│   ├── apiClient.js            # ⭐ Central HTTP wrapper (fetch + auth injection)
│   ├── Auth/
│   ├── Products/               # FindAll, FindById, Create, Update, Delete, ImageUpload
│   ├── Orders/                 # FindAll, FindOne, Create, Edit
│   └── Categories/
│
├── utils/
│   └── ProtectedRoute.jsx      # JWT-based RBAC route guard
│
└── formValidations/            # Pure validation functions for Order and Product forms
```

---

## 🔌 API & Connectivity

### `apiClient.js` — Centralized HTTP Wrapper

All network communication is routed through `src/services/apiClient.js`. It abstracts the native `fetch` API and provides a consistent interface for every service module.

```js
export const apiClient = {
  get:          (path)           => fetch(`${API_URL}${path}`, { headers }).then(handleResponse),
  post:         (path, body)     => fetch(..., { method: 'POST', body: JSON.stringify(body) }).then(handleResponse),
  put:          (path, body)     => fetch(..., { method: 'PUT',  body: JSON.stringify(body) }).then(handleResponse),
  delete:       (path)           => fetch(..., { method: 'DELETE' }).then(handleResponse),
  postFormData: (path, formData) => fetch(..., { method: 'POST', body: formData }).then(handleResponse),
};
```

#### 🔐 Automatic Auth Injection

On every request, `buildHeaders()` reads the JWT directly from `localStorage`:

```js
const buildHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  return {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
```

- If a token exists → `Authorization: Bearer <token>` is injected automatically.
- For `postFormData` calls → `Content-Type` is intentionally omitted so the browser sets the correct `multipart/form-data` boundary.
- `handleResponse` centralizes error handling: throws `Error(message)` on non-OK responses and handles `204 No Content` gracefully.

> **No service module manages headers manually.** Token handling is the exclusive responsibility of `apiClient.js`.

---

### 🌍 Environment Variables

Create a `.env` file at the project root based on `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ **Mandatory** | Base URL of the backend API (e.g. `http://localhost:3000`) |
| `VITE_SHOP_URL` | ✅ **Mandatory** | Public frontend URL — used in the post-purchase WhatsApp message |
| `VITE_LOGO_URL` | ✅ **Mandatory** | Cloudinary URL for the brand logo (used in Navbar and Footer) |

```env
# .env
VITE_API_URL=http://localhost:3000
VITE_SHOP_URL=https://saphire-souvenirs-shop.vercel.app
VITE_LOGO_URL=https://res.cloudinary.com/your-cloud/image/upload/logo.png
```

> ⚠️ All variables **must** be prefixed with `VITE_`. Vite exposes them to the browser via `import.meta.env`. Never use `process.env` or the `dotenv` package in this project.

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js `>= 18`
- npm `>= 9`

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/saphire-souvenirs-front.git
cd saphire-souvenirs-front

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your actual values

# 4. Start the development server
npm run dev
```

> ❗ **The `.env` file is mandatory.** Without `VITE_API_URL`, `apiClient.js` will send all requests to `undefined` and every API call will fail silently or throw a network error.

---

## 🔒 Security & Routing

### Route Architecture

Routes are declared in `src/App.jsx` and fall into two categories:

| Type | Routes |
|------|--------|
| **Public** | `/`, `/shopProducts`, `/postShop/:id`, `/login` |
| **Protected (Admin)** | `/dashboard`, `/product/create`, `/product/edit/:id`, `/orders` |

### `ProtectedRoute` — Role-Based Access Control

`src/utils/ProtectedRoute.jsx` is the RBAC guard. It wraps any admin route and enforces access in two steps:

**Step 1 — Authentication check:**
```jsx
const { token } = useContext(AuthContext);
if (!token) return <Navigate to="/" />;
```

**Step 2 — Authorization check:**
```jsx
const decodedToken = jwtDecode(token);
if (requiredRole && decodedToken.roles !== requiredRole) {
  return <Navigate to="/" />;
}
```

Usage in `App.jsx`:
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <DashboardAdmin />
    </ProtectedRoute>
  }
/>
```

Any decode error (malformed token, expiry) results in an immediate redirect to `/`. Token expiration is also checked proactively in `AuthProvider` via a 20-minute `setInterval`.

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the local development server with HMR |
| `npm run build` | Compile and bundle for production (outputs to `dist/`) |
| `npm run preview` | Serve the production build locally for verification |
| `npm run lint` | Run ESLint across the entire project |

---

## 🧹 Maintenance Notes

This project follows a **Clean Code** standard enforced after a deliberate dependency audit. The following conventions must be maintained by all contributors:

| Rule | Status | Reason |
|------|--------|--------|
| `axios` | 🚫 **Banned** | Removed. All HTTP calls use the native `fetch` via `apiClient.js` |
| `bootstrap` / `react-bootstrap` | 🚫 **Banned** | Removed. All styling is done exclusively with Tailwind CSS v4 |
| `dotenv` | 🚫 **Banned** | Removed. Vite handles env vars natively via `import.meta.env` |
| `postcss` / `autoprefixer` | 🚫 **Removed** | Redundant with Tailwind v4's Vite plugin (`@tailwindcss/vite`) |
| Direct `fetch` in components | 🚫 **Forbidden** | All API calls must go through a function in `src/services/` |
| Hardcoded URLs | 🚫 **Forbidden** | All external URLs must use `import.meta.env.VITE_*` variables |
| Token passed as parameter | 🚫 **Forbidden** | Token injection is handled exclusively by `apiClient.js` |
| Tailwind CSS | ✅ **Required** | The only permitted styling mechanism |
| Service pattern | ✅ **Required** | One file per resource endpoint under `src/services/` |

---

<div align="center">
  <sub>Built with ❤️ by the Saphire team · Maintained with Clean Code principles</sub>
</div>
