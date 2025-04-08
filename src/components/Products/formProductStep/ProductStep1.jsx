import React from 'react';

function ProductStep1({ avanzarStep, product, handleOnChange, categorias, categoriasSeleccionadas }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
      <label style={{ fontWeight: "bold", width: "100%" }}>
        Nombre
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleOnChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
      </label>

      <label style={{ fontWeight: "bold", width: "100%" }}>
        Detalles
        <textarea
          name="details"
          value={product.details}
          onChange={handleOnChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            resize: "none",
            height: "80px"
          }}
        />
      </label>

      <label style={{ fontWeight: "bold", width: "100%" }}>
        Precio unitario
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleOnChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />
      </label>

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

      <button
        onClick={avanzarStep}
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
