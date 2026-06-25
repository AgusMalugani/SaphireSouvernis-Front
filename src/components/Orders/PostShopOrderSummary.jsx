import { FiImage } from 'react-icons/fi';
import { toCloudinaryDisplayUrl } from '../../utils/images/cloudinaryDisplayUrl';
import { formatProductPrice } from '../../utils/products/formatProductPrice';
import { getOrderTransactionLabel } from '../../utils/orders/orderStatusConfig';

function PostShopOrderSummarySkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-busy="true" aria-label="Cargando resumen del pedido">
      <div className="space-y-2">
        <div className="h-3 w-28 animate-pulse rounded bg-stone-200/70" />
        <div className="h-7 w-48 animate-pulse rounded-lg bg-stone-200/70" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-stone-100/80" />
        ))}
      </div>
      <div className="h-14 animate-pulse rounded-2xl bg-rose-50/80" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl bg-stone-100/80" />
        ))}
      </div>
    </div>
  );
}

function SummaryField({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] uppercase tracking-wider text-stone-400">{label}</p>
      <p className="text-sm font-medium text-stone-700">{value}</p>
    </div>
  );
}

function PostShopOrderSummary({ order, isLoading = false }) {
  if (isLoading && !order?.nameClient) {
    return <PostShopOrderSummarySkeleton />;
  }

  const orderDetails = order?.orderDetails ?? [];
  const summaryFields = [
    { label: 'Fecha de entrega', value: order?.endOrder },
    { label: 'Tema del evento', value: order?.theme },
    { label: 'Nombre para el diseño', value: order?.personalizationName },
    {
      label: 'Tipo de entrega',
      value: order?.transactionType
        ? getOrderTransactionLabel(order.transactionType)
        : null,
    },
  ].filter((field) => field.value);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
          Tu pedido
        </span>
        <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
          {order?.nameClient || 'Cliente'}
        </h2>
      </div>

      {summaryFields.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {summaryFields.map(({ label, value }) => (
            <SummaryField key={label} label={label} value={value} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
        <span className="text-sm font-medium text-stone-600">Total a pagar</span>
        <span className="text-xl font-bold text-rose-500">
          {formatProductPrice(order?.totalPrice)}
        </span>
      </div>

      {orderDetails.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
            Productos
          </p>

          {orderDetails.map((orderDetail, index) => {
            const product = orderDetail.product ?? {};
            const displayImageUrl = product.img_url
              ? toCloudinaryDisplayUrl(product.img_url)
              : null;

            return (
              <div
                key={orderDetail.id ?? `${product.name}-${index}`}
                className="flex gap-4 rounded-2xl border border-stone-100 bg-stone-50/80 p-3"
              >
                {displayImageUrl ? (
                  <img
                    src={displayImageUrl}
                    alt={product.name ?? 'Producto'}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-stone-100"
                  />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-300 ring-1 ring-stone-100">
                    <FiImage size={20} aria-hidden="true" />
                  </span>
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="text-sm font-semibold leading-snug text-stone-800">
                    {product.name ?? 'Producto'}
                  </h3>
                  <div className="mt-auto flex items-center gap-3 pt-1">
                    <span className="text-sm font-bold text-rose-500">
                      {formatProductPrice(product.price)}
                    </span>
                    <span className="text-xs text-stone-400">
                      ×{orderDetail.cuantity ?? orderDetail.quantity ?? 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PostShopOrderSummary;
