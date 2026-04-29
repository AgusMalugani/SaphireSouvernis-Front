import './App.css';
import Navbar from './components/Navbar/Navbar';
import CreateProduct from './views/CreateProduct';
import DashboardAdmin from './views/DashboardAdmin';
import Home from './views/Home';
import Login from './views/Login';
import ViewOrders from './views/ViewOrders';
import PostShop from './views/PostShop';
import ShopProducts from './views/ShopProducts';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ViewEditProduct from './views/ViewEditProduct';
import Footer from './components/Home/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import NotFound from './views/NotFound';
import RedirectToWhatsapp from './components/RedirectToWhatsapp';

// El FAB de WhatsApp aparece en todas las rutas excepto /postShop
// (en PostShop ya hay un botón inline prominente)
const FAB_EXCLUDED_ROUTES = ['/postShop'];

function App() {
  const { pathname } = useLocation();

  const showFAB = !FAB_EXCLUDED_ROUTES.some((route) => pathname.startsWith(route));

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

      <main className={pathname !== '/' ? 'pt-20' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shopProducts" element={<ShopProducts />} />
          <Route path="/postShop/:id" element={<PostShop />} />
          <Route path="/login" element={<Login />} />

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

      {/* FAB global de WhatsApp — visible en todas las rutas excepto /postShop */}
      {showFAB && (
        <RedirectToWhatsapp
          variant="fab"
          num={import.meta.env.VITE_WHATSAPP_NUM}
          msj="Hola! Quisiera consultar sobre los souvenirs de Saphire 🌸"
        />
      )}
    </>
  );
}

export default App;
