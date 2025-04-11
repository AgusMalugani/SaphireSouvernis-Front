import React, { useContext, useState } from 'react'
import { ProductsContext } from '../../contexts/Products/ProductsContext';

function SearchProducts({handleOnChangeCategories}) {
  const { categories } = useContext(ProductsContext);
  const [categorias]= useState([...categories,{name:"TODOS"}])

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3>Categorias</h3>
        {categorias?.map((categoria) => (
          <label key={categoria.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="radio"
              name="categories"
              value={categoria.name}
              //checked={categoriasSeleccionadas?.includes(categoria.name)}
              onChange={handleOnChangeCategories}
            />
            {categoria.name}
          </label>
        ))}
      </div>
  )
}



export default SearchProducts
