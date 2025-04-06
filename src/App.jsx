
import './App.css'
import Navbar from './components/Navbar';
import ImageProduct from './components/Products/ImageProduct';
import CreateProduct from './views/CreateProduct';
import DashboardAdmin from './views/DashboardAdmin';
import EditProduct from './views/EditProduct';
import Home from './views/Home'
import Login from './views/Login';
import ViewOrders from './views/Orders';
import PostShop from './views/PostShop';
import ShopProducts from './views/ShopProducts';
import {Routes,Route} from "react-router-dom"

function App() {

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/' element= {<Home/>} />
      <Route path='/shopProducts' element={<ShopProducts/>}/>
      <Route path='/postShop/:id' element={<PostShop/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path='/dashboard' element={<DashboardAdmin/>}/>
      <Route path='/product/edit/:id' element={<EditProduct/>} />
      <Route path='/product/create' element={<CreateProduct/>} />
      <Route path='/orders' element={<ViewOrders/>} />
    </Routes>
    </>
  )
}

export default App
