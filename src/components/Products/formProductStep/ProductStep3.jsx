import React from 'react';

function ProductStep3({ product, volverStep, handleSubmit }) {
  return (
    <div style={{ textAlign: "center", padding: "20px", width: "100%" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>{product.name}</h1>

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
          onClick={handleSubmit}
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "100%"
          }}
        >
          Terminar
        </button>
      </div>
    </div>
  );
}

export default ProductStep3;
