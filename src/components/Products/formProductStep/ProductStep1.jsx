import React from 'react'

function ProductStep1({avanzarStep,product,handleOnChange, categorias, categoriasSeleccionadas}) {
  return (
    <div>
      <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    }}
  >
    <label style={{ fontWeight: "bold", textAlign: "left" }}>
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
          border: "1px solid #ccc",
        }}
      />
    </label>

    <label style={{ fontWeight: "bold", textAlign: "left" }}>
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
          height: "80px",
        }}
      />
    </label>

    <label style={{ fontWeight: "bold", textAlign: "left" }}>
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
          border: "1px solid #ccc",
        }}
      />
    </label>

    {categorias?.map((categoria) => (
        <label key={categoria.id}>
          <input
            type="checkbox"
            name='categories'
            value={categoria.name}
            checked={categoriasSeleccionadas.includes(categoria.name)}
            onChange={handleOnChange}
          />
          {categoria.name}
        </label>
      ))}
     <button onClick={avanzarStep}>Siguiente</button>
  </div>
    </div>
  )
}

export default ProductStep1
