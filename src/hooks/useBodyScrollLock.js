import { useEffect } from 'react';

/**
 * Bloquea el scroll del body cuando el modal está abierto.
 * El cleanup restaura overflow automáticamente al cerrar o al desmontar
 * el componente (cubre el caso de navigate() mid-modal).
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    document.body.style.overflow = isLocked ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
}
