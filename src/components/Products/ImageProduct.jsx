import React, { useState } from 'react'

function ImageProduct() {
    const[file,setFile]=useState(null);

    const handleOnChangeImage=(e)=>{
        const file = e.target.files[0]
        setFile(file)
    }

const handleOnSubmit=async (e)=>{
    e.preventDefault();
const id = "123"
const formData = new FormData();
  formData.append("file", file); // Solo enviamos la imagen

        const resp =  await fetch(`http://localhost:3000/files/uploadImage/${id}`,{
            method:"POST",
              body:formData
        })
        const data = await resp.json()

        console.log(data);
}

  return (
    <div>
        <form onSubmit={handleOnSubmit}>

      <input type="file" name="file" onChange={handleOnChangeImage} />
       <button>enviar</button>
        </form>
    </div>
  )
}

export default ImageProduct
