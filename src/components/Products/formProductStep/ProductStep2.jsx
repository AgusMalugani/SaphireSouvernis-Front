import React from 'react'

function ProductStep2({handleOnChangeImage,volverStep,avanzarStep}) {
  return (
    <div>
    <input type="file" name="file" onChange={handleOnChangeImage} />
      <button onClick={volverStep}>Volver</button>
      <button onClick={avanzarStep} >Siguiente</button>
     </div>
 )
}

export default ProductStep2
