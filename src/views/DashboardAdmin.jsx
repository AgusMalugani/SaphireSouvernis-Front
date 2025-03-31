import React, { useContext } from 'react'
import Sidebar from '../components/Siderbar/Sidebar'
import { ProductsContext } from '../contexts/ProductsContext'

function DashboardAdmin() {
  const {products} = useContext(ProductsContext)
  
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>  
      <Sidebar />
  
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
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Modificar</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((prod, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prod.name}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{prod.price}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}> <button>Modificar</button> </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
    
}

export default DashboardAdmin
