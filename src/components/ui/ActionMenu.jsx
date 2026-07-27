import { useEffect, useId, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

/**
 * Menú de acciones desplegable.
 * @param {{ label?: string, items: Array<{ id: string, label: string, icon?: import('react').ComponentType, onClick: () => void, tone?: 'default' | 'danger' | 'rose' | 'violet' | 'sky' }> }} props
 */
function ActionMenu({ label = 'Acciones', items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!items.length) return null;

  const toneClassByVariant = {
    default: 'text-stone-600 hover:bg-stone-50 hover:text-stone-800',
    danger: 'text-red-500 hover:bg-red-50',
    rose: 'text-rose-500 hover:bg-rose-50',
    violet: 'text-violet-500 hover:bg-violet-50',
    sky: 'text-sky-500 hover:bg-sky-50',
  };

  return (
    <div ref={menuRef} className="relative w-full">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
      >
        {label}
        <FiChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute bottom-full left-0 z-20 mb-2 w-full overflow-hidden rounded-2xl border border-stone-100 bg-white py-1 shadow-lg shadow-stone-200/60"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const toneClass =
              toneClassByVariant[item.tone] || toneClassByVariant.default;

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors ${toneClass}`}
              >
                {Icon ? <Icon size={15} aria-hidden="true" /> : null}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
