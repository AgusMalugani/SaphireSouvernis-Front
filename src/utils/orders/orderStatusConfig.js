export const ORDER_STATE_VALUES = {
  IN_PROCESS: 'inProcess',
  PARTIAL_PAYMENT: 'partialPayment',
  PAID: 'paid',
};

export const ORDER_TRANSACTION_VALUES = {
  SEND: 'send',
  WITHDRAW: 'withdraw',
};

const ORDER_STATE_CONFIG = {
  [ORDER_STATE_VALUES.IN_PROCESS]: {
    label: 'En proceso',
    className: 'text-rose-600 bg-rose-50 border-rose-200',
  },
  [ORDER_STATE_VALUES.PARTIAL_PAYMENT]: {
    label: 'Señado',
    className: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  [ORDER_STATE_VALUES.PAID]: {
    label: 'Pagado',
    className: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
};

const ORDER_TRANSACTION_CONFIG = {
  [ORDER_TRANSACTION_VALUES.SEND]: {
    label: 'Envío',
    className: 'text-sky-600 bg-sky-50 border-sky-200',
  },
  [ORDER_TRANSACTION_VALUES.WITHDRAW]: {
    label: 'Retiro en local',
    className: 'text-violet-600 bg-violet-50 border-violet-200',
  },
};

const UNKNOWN_STATE_CONFIG = {
  label: 'Estado desconocido',
  className: 'text-stone-500 bg-stone-50 border-stone-200',
};

const UNKNOWN_TRANSACTION_CONFIG = {
  label: 'Tipo desconocido',
  className: 'text-stone-500 bg-stone-50 border-stone-200',
};

/**
 * @param {string | null | undefined} state
 * @returns {string}
 */
export function getOrderStateLabel(state) {
  return ORDER_STATE_CONFIG[state]?.label ?? UNKNOWN_STATE_CONFIG.label;
}

/**
 * @param {string | null | undefined} state
 * @returns {{ label: string, className: string }}
 */
export function getOrderStateConfig(state) {
  return ORDER_STATE_CONFIG[state] ?? UNKNOWN_STATE_CONFIG;
}

/**
 * @param {string | null | undefined} transactionType
 * @returns {string}
 */
export function getOrderTransactionLabel(transactionType) {
  return (
    ORDER_TRANSACTION_CONFIG[transactionType]?.label ??
    UNKNOWN_TRANSACTION_CONFIG.label
  );
}

/**
 * @param {string | null | undefined} transactionType
 * @returns {{ label: string, className: string }}
 */
export function getOrderTransactionConfig(transactionType) {
  return ORDER_TRANSACTION_CONFIG[transactionType] ?? UNKNOWN_TRANSACTION_CONFIG;
}

/**
 * @returns {Array<{ value: string, label: string }>}
 */
export function getOrderStateSelectOptions() {
  return Object.entries(ORDER_STATE_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));
}

/**
 * @returns {Array<{ value: string, label: string }>}
 */
export function getOrderTransactionSelectOptions() {
  return Object.entries(ORDER_TRANSACTION_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));
}
