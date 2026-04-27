import React, { useState } from 'react';
import { ImageProduct as uploadProductImage } from '../../services/Products/ImageProduct';
import { toast } from 'react-toastify';

function ImageProduct({ productId }) {
  const [file, setFile] = useState(null);

  const handleOnChangeImage = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Seleccioná una imagen primero.');
      return;
    }
    try {
      const data = await uploadProductImage(productId, file);
      toast.success('Imagen subida correctamente.');
      console.log(data);
    } catch (error) {
      toast.error('Error al subir la imagen.');
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input type="file" name="file" onChange={handleOnChangeImage} />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default ImageProduct;
