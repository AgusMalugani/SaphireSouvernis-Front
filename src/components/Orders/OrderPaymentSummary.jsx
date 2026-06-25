import { formatProductPrice } from '../../utils/products/formatProductPrice';

function PaymentRow({ label, value, emphasized = false }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-stone-500">{label}</span>
      <span
        className={
          emphasized
            ? 'font-semibold text-rose-500'
            : 'font-medium text-stone-700'
        }
      >
        {value}
      </span>
    </div>
  );
}

function OrderPaymentSummary({ order, compact = false }) {
  const depositAmount = Number(order?.depositAmount ?? 0);
  const totalPrice = order?.totalPrice;
  const remainingBalance =
    order?.remainingBalance != null
      ? Number(order.remainingBalance)
      : Math.max(Number(totalPrice ?? 0) - depositAmount, 0);

  if (compact) {
    return (
      <div className="mt-2 space-y-1 rounded-2xl border border-stone-100 bg-stone-50/80 px-3 py-2">
        <PaymentRow label="Seña" value={formatProductPrice(depositAmount)} />
        <PaymentRow label="Saldo" value={formatProductPrice(remainingBalance)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3">
      <PaymentRow label="Seña" value={formatProductPrice(depositAmount)} />
      <PaymentRow label="Total" value={formatProductPrice(totalPrice)} />
      <PaymentRow
        label="Saldo pendiente"
        value={formatProductPrice(remainingBalance)}
        emphasized
      />
    </div>
  );
}

export default OrderPaymentSummary;
