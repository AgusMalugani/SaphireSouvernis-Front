import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../services/Products/FindAllProducts.service"; 
import {productsJson} from "../../../products"
import { ProductsContext } from "./ProductsContext";
import { UpdateProduct } from "../../services/Products/UpdateProduct"; 
import { FindAllCategories } from "../../services/Categories/FindAllCategories";
import { toast } from "react-toastify";


export const ProductsProvider = ({children})=>{

const[products,setProducts] = useState(()=>{
  const storage = localStorage.getItem("products")
  return storage ? JSON.parse(storage) : [];
})

const[categories,setCategories] = useState(()=>{
  const storage = localStorage.getItem("categories")
  return storage ? JSON.parse(storage):[]
})


useEffect(()=>{
    const response = async ()=>{
      try {
        const res = await fetchAllProducts();
        setProducts(res);
        localStorage.setItem("products", JSON.stringify(res))
        } catch (error) {
        console.log(error);
        //alert("Hubo un error en la base de datos. Brindaremos productos de prueba")
        toast.error("Hubo un error en la base de datos. Brindaremos productos de prueba")
         setProducts(productsJson)
      }
    }
    response();    
  },[])

useEffect(()=>{
  const response = async ()=>{
    const resp = await FindAllCategories();
    setCategories(resp)
    localStorage.setItem("categories",JSON.stringify(resp))
  }
  response()
},[])

const editProduct=(id,product)=>{    
    const response = async ()=> {
        const resp = await UpdateProduct(id,product); //aca mod bd
        const productsMod = products.map(prod =>{ 
          if(prod.id === id){
            
          return  resp
          }else{ 
            return prod
          }
          })
          setProducts(productsMod) //ak evito rerenderizado, y actualizo estado
    }
    response()
  }


const value = {
    products,
    setProducts,
    editProduct,
    categories
}

    return  <ProductsContext.Provider value={value}> {children} </ProductsContext.Provider> 
}

