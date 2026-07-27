import './App.css';
import Navbar from './components/Navbar/Navbar';
import CreateProduct from './views/CreateProduct';
import DashboardAdmin from './views/DashboardAdmin';
import Home from './views/Home';
import Login from './views/Login';
import ViewOrders from './views/ViewOrders';
import PostShop, { LegacyPostShopRedirect } from './views/PostShop';
import ShopProducts from './views/ShopProducts';
import { Routes, Route, useLocation, useMatch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ViewEditProduct from './views/ViewEditProduct';
import Footer from './components/Home/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import NotFound from './views/NotFound';
import PrivacyPolicy from './views/PrivacyPolicy';
import TermsOfService from './views/TermsOfService';
import AboutUs from './views/AboutUs';
import RedirectToWhatsapp from './components/RedirectToWhatsapp';
import { envs } from './config/env.js';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  const { pathname } = useLocation();
  const postShopRouteMatch = useMatch('/post-shop/:id');
  const legacyPostShopRouteMatch = useMatch('/postShop/:id');
  const shopProductsRouteMatch = useMatch('/shopProducts');
  
  // Rutas admin que usan AdminLayout (sin Navbar/Footer)
  const isAdminRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/product/') ||
    pathname === '/orders';

  const showFAB =
    postShopRouteMatch == null &&
    legacyPostShopRouteMatch == null &&
    shopProductsRouteMatch == null &&
    !isAdminRoute;

  return (
    <>
      <ScrollToTop />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="saphire-toast"
      />

      {!isAdminRoute && <Navbar />}

      <main className={`w-full flex-1 overflow-x-clip${pathname !== '/' && !isAdminRoute ? ' pt-20' : ''}`}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/shopProducts" element={<ShopProducts />} />
          <Route path="/post-shop/:id" element={<PostShop />} />
          <Route path="/postShop/:id" element={<LegacyPostShopRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Rutas admin con layout persistente (Sidebar) */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path="/product/edit/:id" element={<ViewEditProduct />} />
            <Route path="/product/create" element={<CreateProduct />} />
            <Route path="/orders" element={<ViewOrders />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      {/* FAB global de WhatsApp — oculto en /post-shop/:id y /shopProducts */}
      {showFAB && (
        <RedirectToWhatsapp
          variant="fab"
          num={envs.whatsappNum}
          msj="Hola, quisiera consultar sobre souvenirs personalizados de Saphire Souvenirs. ¿Podrían informarme disponibilidad y tiempos de entrega?"
        />
      )}
    </>
  );
}

export default App;
