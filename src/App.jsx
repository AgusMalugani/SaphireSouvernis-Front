
import './App.css'
import Navbar from './components/Navbar';
import Home from './views/Home'
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
    </Routes>
    </>
  )
}

export default App
