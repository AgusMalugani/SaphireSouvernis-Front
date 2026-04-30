import './App.css';
import Navbar from './components/Navbar/Navbar';
import CreateProduct from './views/CreateProduct';
import DashboardAdmin from './views/DashboardAdmin';
import Home from './views/Home';
import Login from './views/Login';
import ViewOrders from './views/ViewOrders';
import PostShop from './views/PostShop';
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

function App() {
  const { pathname } = useLocation();
  const postShopRouteMatch = useMatch('/postShop/:id');
  const shopProductsRouteMatch = useMatch('/shopProducts');

  const showFAB = postShopRouteMatch == null && shopProductsRouteMatch == null;

  return (
    <>
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
        theme="dark"
      />

      <Navbar />

      <main className={`w-full flex-1 overflow-x-clip${pathname !== '/' ? ' pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shopProducts" element={<ShopProducts />} />
          <Route path="/postShop/:id" element={<PostShop />} />
          <Route path="/login" element={<Login />} />

          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/about-us" element={<AboutUs />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <ViewEditProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <ViewOrders />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* FAB global de WhatsApp — oculto en /postShop/:id y /shopProducts */}
      {showFAB && (
        <RedirectToWhatsapp
          variant="fab"
          num={import.meta.env.VITE_WHATSAPP_NUM}
          msj="Hola, quisiera consultar sobre souvenirs personalizados de Saphire Souvenirs. ¿Podrían informarme disponibilidad y tiempos de entrega?"
        />
      )}
    </>
  );
}

export default App;
