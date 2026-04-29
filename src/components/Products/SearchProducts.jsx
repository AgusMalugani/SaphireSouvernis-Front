import React, { useContext, useState } from 'react';
import { ProductsContext } from '../../contexts/Products/ProductsContext';

function SearchProducts({ handleOnChangeCategories }) {
  const { categories } = useContext(ProductsContext);
  const [categorias] = useState([...categories, { name: 'TODOS', id: 'TODOS' }]);
  const [selected, setSelected] = useState('TODOS');

  const handleChange = (e) => {
    setSelected(e.target.value);
    handleOnChangeCategories(e);
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl shadow-sm p-5">
      <h3 className="font-display text-stone-700 text-base font-semibold mb-4">
        Categorías
      </h3>

      <div className="flex flex-col gap-2">
        {categorias.map((categoria) => (
          <label
            key={categoria.id}
            className={`flex items-center gap-2.5 cursor-pointer px-3 py-2 rounded-full text-sm transition-all duration-200
              ${selected === categoria.name
                ? 'bg-rose-400 text-white font-medium shadow-sm'
                : 'text-stone-600 hover:bg-rose-50 hover:text-rose-500'
              }
            `}
          >
            <input
              type="radio"
              name="categories"
              value={categoria.name}
              onChange={handleChange}
              className="sr-only"
              defaultChecked={categoria.name === 'TODOS'}
            />
            {categoria.name}
          </label>
        ))}
      </div>
    </div>
  );
}

export default SearchProducts;
