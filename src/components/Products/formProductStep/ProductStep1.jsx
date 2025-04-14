import React, { useState } from 'react';
import { onValidateProduct } from '../../../formValidations/OnValidateProduct';

function ProductStep1({ avanzarStep, product, handleOnChange, categorias, categoriasSeleccionadas }) {
  const [errors,setErrors]=useState(null)

const handleOnSubmit = ()=>{
 const errores = onValidateProduct(product)
 if(!errores){
  avanzarStep()
} else {
  setErrors(errores)
  console.log(errores);
}

}

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
      <label style={{ fontWeight: "bold", width: "100%" }}>
        Nombre
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleOnChange}
          style={{width: "100%",padding: "8px",marginTop: "4px",borderRadius: "5px",border: "1px solid #ccc"}}/>
      </label>
      {errors && errors.name && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.name}
  </p>)}


      <label style={{ fontWeight: "bold", width: "100%" }}>
        Detalles
        <textarea
          name="details"
          value={product.details}
          onChange={handleOnChange}
          style={{width: "100%",padding: "8px",marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc", resize: "none", height: "80px"}}/>
      </label>
      {errors && errors.details && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.details}
  </p>)}


      <label style={{ fontWeight: "bold", width: "100%" }}>
        Precio unitario
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleOnChange}
          style={{width: "100%",padding: "8px",marginTop: "4px", borderRadius: "5px", border: "1px solid #ccc", resize: "none", height: "80px"}}/>
      </label>
      {errors && errors.price && ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.price}
  </p>)}


      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {categorias?.map((categoria) => (
          <label key={categoria.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              name="categories"
              value={categoria.name}
              checked={categoriasSeleccionadas?.includes(categoria.name)}
              onChange={handleOnChange}
            />
            {categoria.name}
          </label>
        ))}
      </div>
      {errors && errors.categories &&  ( <p style={{ color: '#721c24', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', padding: '8px 12px',borderRadius: '4px',fontSize: '0.9rem',marginTop: '4px',marginBottom: '4px',fontWeight: '500'}}>
    {errors.categories}
  </p>)}


      <button
        //onClick={avanzarStep}
        onClick={handleOnSubmit}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%"
        }}
      >
        Siguiente
      </button>
    </div>
  );
}

export default ProductStep1;
