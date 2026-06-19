import { useContext, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { ProductsContext } from '../../contexts/Products/ProductsContext';

const ALL_CATEGORIES_OPTION = { name: 'TODOS', id: 'TODOS' };

function SearchInput({ searchQuery, onSearchChange }) {
  const hasSearchText = searchQuery.trim().length > 0;

  return (
    <div className="relative">
      <FiSearch
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400"
        size={18}
        aria-hidden="true"
      />
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar souvenirs..."
        aria-label="Buscar productos por nombre"
        className="w-full rounded-2xl border border-stone-100 bg-white/70 py-3 pl-11 pr-11 text-sm text-stone-700 shadow-sm placeholder:text-stone-400 focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200"
      />
      {hasSearchText && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}

function CategoryChips({
  categoryOptions,
  selectedCategory,
  onCategoryChange,
  inputName,
  layout,
}) {
  const isWrap = layout === 'wrap';

  const chipList = (
    <div
      className={
        isWrap
          ? 'flex flex-wrap justify-center gap-2'
          : 'flex flex-col gap-2'
      }
    >
      {categoryOptions.map((categoryOption) => (
        <label
          key={categoryOption.id}
          className={`flex cursor-pointer items-center whitespace-nowrap text-sm font-medium transition-all duration-200
            ${isWrap ? 'rounded-full px-4 py-2' : 'gap-2.5 rounded-full px-3 py-2'}
            ${
              selectedCategory === categoryOption.name
                ? 'bg-rose-400 text-white shadow-sm shadow-rose-300/40'
                : isWrap
                  ? 'border border-stone-100 bg-white/70 text-stone-600 hover:bg-rose-50 hover:text-rose-500'
                  : 'text-stone-600 hover:bg-rose-50 hover:text-rose-500'
            }
          `}
        >
          <input
            type="radio"
            name={inputName}
            value={categoryOption.name}
            checked={selectedCategory === categoryOption.name}
            onChange={() => onCategoryChange(categoryOption.name)}
            className="sr-only"
          />
          {categoryOption.name}
        </label>
      ))}
    </div>
  );

  return chipList;
}

function CatalogFilters({
  layout = 'sidebar',
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}) {
  const { categories } = useContext(ProductsContext);

  const categoryOptions = useMemo(
    () => [...categories, ALL_CATEGORIES_OPTION],
    [categories],
  );

  if (layout === 'mobile-sticky') {
    return (
      <div className="sticky top-20 z-30 max-w-full overflow-x-hidden border-b border-white/60 bg-stone-50/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-3">
          <SearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />
          <CategoryChips
            categoryOptions={categoryOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            inputName="categories-mobile"
            layout="wrap"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/60 bg-white/60 p-5 shadow-sm backdrop-blur-md">
      <SearchInput searchQuery={searchQuery} onSearchChange={onSearchChange} />

      <h3 className="mb-4 mt-5 font-display text-base font-semibold text-stone-700">
        Categorías
      </h3>

      <CategoryChips
        categoryOptions={categoryOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        inputName="categories-desktop"
        layout="vertical"
      />
    </div>
  );
}

export default CatalogFilters;
