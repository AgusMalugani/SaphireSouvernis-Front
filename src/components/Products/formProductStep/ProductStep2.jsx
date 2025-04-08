import React, { useState } from 'react';

function ProductStep2({ handleOnChangeImage, volverStep, avanzarStep, imgProduct }) {
  const[image, setImage]=useState(imgProduct ? true : false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center", width: "100%" }}>
      {image && (<div>
        <img
          src={imgProduct}
          alt="Preview"
          style={{ width: "100%", maxWidth: "300px", height: "auto", borderRadius: "10px" }}
          />
      <button onClick={()=>{setImage(false)}} style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%"
          }} > Cambiar imagen </button>
          </div>
      )}

{!image &&
      <input type="file" name="file" onChange={handleOnChangeImage} style={{ width: "100%" }} />
}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
        <button
          onClick={volverStep}
          style={{
            padding: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%"
          }}
        >
          Volver
        </button>
        <button
          onClick={avanzarStep}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%"
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default ProductStep2;
