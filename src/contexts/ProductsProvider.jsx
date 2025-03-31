import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/Products.service";
import {productsJson} from "../../products"
import { ProductsContext } from "./ProductsContext";


export const ProductsProvider = ({children})=>{

const[products,setProducts] = useState([])


useEffect(()=>{
    const response = async ()=>{
      try {
        const res = await fetchAllProducts();
        setProducts(res);
        } catch (error) {
        console.log(error);
        alert("Hubo un error en la base de datos. Brindaremos productos de prueba")
         setProducts(productsJson)
      }
    }
    response();
  },[])


const editProduct = (product)=>{
//aca recibo el producto, mando al back, con la id para modificar el producto y los datos modificados

}

const value = {
    products,
    setProducts
}

    return  <ProductsContext.Provider value={value}> {children} </ProductsContext.Provider> 
}

