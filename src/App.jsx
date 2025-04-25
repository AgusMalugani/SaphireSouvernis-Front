
import './App.css'
import Navbar from './components/Navbar/Navbar'; 
import CreateProduct from './views/CreateProduct';
import DashboardAdmin from './views/DashboardAdmin';
import Home from './views/Home'
import Login from './views/Login';
import ViewOrders from './views/ViewOrders'; 
import PostShop from './views/PostShop';
import ShopProducts from './views/ShopProducts';
import {Routes,Route} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import ViewEditProduct from './views/ViewEditProduct';
import Footer from './components/Home/Footer';
import ProtectedRoute from './utils/ProtectedRoute'; 
import NotFound from './views/NotFound';

function App() {

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

    <Navbar/>
    <Routes>
      <Route path='/' element= {<Home/>} />
      <Route path='/shopProducts' element={<ShopProducts/>}/>
      <Route path='/postShop/:id' element={<PostShop/>}/>
      <Route path="/login" element={<Login/>}/>

      <Route path='/dashboard' element={
        <ProtectedRoute requiredRole="admin">
        <DashboardAdmin />
      </ProtectedRoute> }/>

      <Route path='/product/edit/:id' element={
        <ProtectedRoute requiredRole="admin">
        <ViewEditProduct/>
        </ProtectedRoute> } />

      <Route path='/product/create' element={
        <ProtectedRoute requiredRole="admin">
        <CreateProduct/>
        </ProtectedRoute>} />

      <Route path='/orders' element={
        <ProtectedRoute requiredRole="admin">
        <ViewOrders/>
        </ProtectedRoute>} />

         {/* Ruta para manejar páginas no encontradas */}
      <Route path="*" element={<NotFound />} />

    </Routes>
    <Footer/>
    </>
  )
}

export default App
