import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsisThreshold = 2;

    // Siempre mostrar primera página
    pages.push(1);

    // Calcular rango alrededor de la página actual
    const leftBound = Math.max(2, currentPage - 1);
    const rightBound = Math.min(totalPages - 1, currentPage + 1);

    // Ellipsis izquierdo
    if (leftBound > 2) {
      pages.push('ellipsis-left');
    }

    // Páginas centrales
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    // Ellipsis derecho
    if (rightBound < totalPages - 1) {
      pages.push('ellipsis-right');
    }

    // Siempre mostrar última página (si hay más de 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-rose-200 px-4 text-sm font-medium text-rose-500 transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <FiChevronLeft size={15} aria-hidden="true" />
        Anterior
      </button>

      {pageNumbers.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span
              key={`${page}-${index}`}
              className="flex h-11 w-11 items-center justify-center text-stone-400"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Ir a página ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`h-11 w-11 rounded-full text-sm font-semibold transition-all duration-200
              ${
                currentPage === page
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-md shadow-rose-300/40'
                  : 'text-stone-500 hover:bg-rose-50 hover:text-rose-500'
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        className="inline-flex min-h-[44px] items-center gap-1 rounded-full border border-rose-200 px-4 text-sm font-medium text-rose-500 transition-all duration-200 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Siguiente
        <FiChevronRight size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

export default Pagination;
