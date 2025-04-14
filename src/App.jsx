
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
      <Route path='/dashboard' element={<DashboardAdmin/>}/>
      <Route path='/product/edit/:id' element={<ViewEditProduct/>} />
      <Route path='/product/create' element={<CreateProduct/>} />
      <Route path='/orders' element={<ViewOrders/>} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
