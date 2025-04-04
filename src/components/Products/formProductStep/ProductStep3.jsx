
import React from 'react'

function ProductStep3({product,volverStep,handleSubmit}) {
  return (
<div>
      <h1>{product.name}</h1>
      <button onClick={volverStep} >Volver</button>
      <button onClick={handleSubmit}>
        Terminar
      </button>
    </div>
  )
}

export default ProductStep3
