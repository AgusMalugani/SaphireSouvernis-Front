import React, { useContext } from 'react'
import { ProductsContext } from '../../contexts/Products/ProductsContext'; 
import { useNavigate } from 'react-router-dom';

function TableProducts({viewProduct}) {
 const {products} = useContext(ProductsContext)
 const navigate = useNavigate();
 //creo un stado con los datos modificados y los mando al contexto. 
 // Ahi los tengo que modificar. una vez modificados, deberia
 //volver a traer todos los productos y actualizar el context
const handleEditProduct=(id)=>{
alert(`Sera redirigido para editar el producto.`)
navigate(`/product/edit/${id}`)
}


   return (
       <div
         style={{
           border: "1px solid #ddd",
           width: "100%",
           display: "flex",
           flexDirection: "column",
           paddingTop: "80px", // Espacio para evitar solapamiento con el Navbar
           padding: "20px",
           overflowY: "auto",
           flex: 1, // Ocupa todo el espacio restante
         }}
       >
         <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
           Inventario de Productos
         </h2>
   
         <table
           style={{
             width: "100%",
             borderCollapse: "collapse",
             background: "white",
             boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
           }}
         >
           <thead>
             <tr style={{ background: "#007bff", color: "white" }}>
               <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Nombre</th>
               <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Precio</th>
               <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}></th>
               <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}></th>
             </tr>
           </thead>
           <tbody>
             {products?.map((prod, index) => (
               <tr key={index}>
                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prod.name}</td>
                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prod.price}</td>
                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}> <button onClick={()=>viewProduct(prod.id)} >Ver</button> </td>
                 <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}> <button onClick={()=>handleEditProduct(prod.id)} >Editar</button></td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
   );
}

export default TableProducts
