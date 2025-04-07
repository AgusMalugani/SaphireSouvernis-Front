import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/Products/FindAllProducts.service"; 
import {productsJson} from "../../products"
import { ProductsContext } from "./ProductsContext";
import { UpdateProduct } from "../services/Products/UpdateProduct"; 


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
    console.log("context");
    
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
    editProduct
}

    return  <ProductsContext.Provider value={value}> {children} </ProductsContext.Provider> 
}

