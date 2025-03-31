
import './App.css'
import Navbar from './components/Navbar';
import DashboardAdmin from './views/DashboardAdmin';
import Home from './views/Home'
import Login from './views/Login';
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
    </Routes>
    </>
  )
}

export default App
