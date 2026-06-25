import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { FiCheck, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { ProductsContext } from '../../contexts/Products/ProductsContext';
import { getApiErrorStatus } from '../../utils/orders/getApiErrorStatus';
import {
  buildIntegralEditPayload,
  canEditOrderIntegral,
  estimateIntegralEditTotal,
  mapOrderToIntegralEditForm,
} from '../../utils/orders/orderIntegralEdit';
import { validateIntegralOrderEdit } from '../../utils/orders/validateIntegralOrderEdit';
import { formatProductPrice } from '../../utils/products/formatProductPrice';
import { isProductAvailableForSale } from '../../utils/products/isProductAvailableForSale';

function EditOrderIntegral({ id, onClose }) {
  const {
    getOrderById,
    editOrderContext,
    clearOptimisticTimelineEvents,
    signalAdminRefetch,
  } = useContext(OrdersContext);
  const { products: catalogProducts } = useContext(ProductsContext);

  const originalOrder = getOrderById(id);
  const [editForm, setEditForm] = useState(() =>
    mapOrderToIntegralEditForm(originalOrder ?? {}),
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    if (originalOrder) {
      setEditForm(mapOrderToIntegralEditForm(originalOrder));
    }
  }, [originalOrder]);

  const availableCatalogProducts = useMemo(
    () => (catalogProducts ?? []).filter(isProductAvailableForSale),
    [catalogProducts],
  );

  const estimatedTotal = useMemo(
    () => estimateIntegralEditTotal(editForm.products, catalogProducts),
    [catalogProducts, editForm.products],
  );

  if (!originalOrder || !canEditOrderIntegral(originalOrder)) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-6 text-sm text-stone-600">
        Este pedido no se puede editar.
      </div>
    );
  }

  const handleFieldChange = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setEditForm((previousForm) => ({ ...previousForm, [name]: value }));
    setFieldErrors((previousErrors) => {
      const { [name]: _removedError, ...remainingErrors } = previousErrors;
      return remainingErrors;
    });
  };

  const handleQuantityChange = (lineIndex, nextQuantity) => {
    const parsedQuantity = Number(nextQuantity);
    if (!Number.isFinite(parsedQuantity)) {
      return;
    }

    setEditForm((previousForm) => ({
      ...previousForm,
      products: previousForm.products.map((lineItem, currentIndex) =>
        currentIndex === lineIndex
          ? { ...lineItem, cuantity: parsedQuantity }
          : lineItem,
      ),
    }));
  };

  const handleRemoveProductLine = (lineIndex) => {
    setEditForm((previousForm) => ({
      ...previousForm,
      products: previousForm.products.filter(
        (_, currentIndex) => currentIndex !== lineIndex,
      ),
    }));
  };

  const handleAddProductLine = () => {
    if (!selectedProductId) {
      return;
    }

    const catalogProduct = availableCatalogProducts.find(
      (productItem) => productItem.id === selectedProductId,
    );

    if (!catalogProduct) {
      return;
    }

    const existingLineIndex = editForm.products.findIndex(
      (lineItem) => lineItem.productId === selectedProductId,
    );

    if (existingLineIndex >= 0) {
      handleQuantityChange(
        existingLineIndex,
        editForm.products[existingLineIndex].cuantity + 1,
      );
      setSelectedProductId('');
      return;
    }

    setEditForm((previousForm) => ({
      ...previousForm,
      products: [
        ...previousForm.products,
        {
          productId: catalogProduct.id,
          cuantity: 1,
          productName: catalogProduct.name,
          unitPrice: Number(catalogProduct.price ?? 0),
        },
      ],
    }));
    setSelectedProductId('');
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    const validationResult = validateIntegralOrderEdit(editForm, catalogProducts);

    if (!validationResult.valid) {
      setFieldErrors(validationResult.errors ?? {});
      toast.error('Revisá los errores en el formulario.');
      return;
    }

    const payload = buildIntegralEditPayload(editForm, originalOrder);

    try {
      await toast.promise(editOrderContext(id, payload), {
        pending: 'Guardando cambios...',
        success: 'Pedido actualizado ✅',
        error: 'No se pudo actualizar el pedido 😓',
      });

      clearOptimisticTimelineEvents(id);
      signalAdminRefetch(id);
      onClose();
    } catch (error) {
      const errorStatus = getApiErrorStatus(error);

      if (errorStatus === 409) {
        toast.error('No se puede editar un pedido cancelado.');
      } else if (errorStatus === 400) {
        toast.error(
          error?.message ?? 'La seña no puede superar el total del pedido.',
        );
      }

      console.error('Error al editar pedido integral', error);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all';
  const labelClass = 'text-sm font-semibold text-stone-700';
  const errorClass = 'text-xs text-rose-600';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
          Edición integral
        </span>
        <h2 className="mt-1 font-display text-2xl font-bold text-stone-800">
          Editar pedido
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Modificá datos del cliente, productos y seña si corresponde.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass} htmlFor="nameClient">
            Nombre completo
          </label>
          <input
            id="nameClient"
            name="nameClient"
            value={editForm.nameClient}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.nameClient && (
            <p className={errorClass}>{fieldErrors.nameClient}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass} htmlFor="personalizationName">
            Nombre para el diseño
          </label>
          <input
            id="personalizationName"
            name="personalizationName"
            value={editForm.personalizationName}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.personalizationName && (
            <p className={errorClass}>{fieldErrors.personalizationName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={editForm.email}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="numCel">
            Teléfono principal
          </label>
          <input
            id="numCel"
            name="numCel"
            value={editForm.numCel}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.numCel && <p className={errorClass}>{fieldErrors.numCel}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="num2Cel">
            Teléfono secundario
          </label>
          <input
            id="num2Cel"
            name="num2Cel"
            value={editForm.num2Cel}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.num2Cel && (
            <p className={errorClass}>{fieldErrors.num2Cel}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass} htmlFor="theme">
            Tema del evento
          </label>
          <textarea
            id="theme"
            name="theme"
            rows={2}
            value={editForm.theme}
            onChange={handleFieldChange}
            className={`${inputClass} resize-none`}
          />
          {fieldErrors.theme && <p className={errorClass}>{fieldErrors.theme}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="endOrder">
            Fecha del evento
          </label>
          <input
            id="endOrder"
            type="date"
            name="endOrder"
            value={editForm.endOrder}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.endOrder && (
            <p className={errorClass}>{fieldErrors.endOrder}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="transactionType">
            Forma de entrega
          </label>
          <select
            id="transactionType"
            name="transactionType"
            value={editForm.transactionType}
            onChange={handleFieldChange}
            className={inputClass}
          >
            <option value="">Seleccioná Envío o Retiro</option>
            <option value="withdraw">Retiro en local</option>
            <option value="send">Envío a domicilio</option>
          </select>
          {fieldErrors.transactionType && (
            <p className={errorClass}>{fieldErrors.transactionType}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass} htmlFor="address">
            Dirección
          </label>
          <input
            id="address"
            name="address"
            value={editForm.address}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.address && (
            <p className={errorClass}>{fieldErrors.address}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-lg font-semibold text-stone-800">
          Productos
        </h3>

        {editForm.products.map((lineItem, lineIndex) => (
          <div
            key={`${lineItem.productId}-${lineIndex}`}
            className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/80 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-stone-800">
                {lineItem.productName}
              </p>
              <p className="text-xs text-stone-500">
                {formatProductPrice(lineItem.unitPrice)} c/u
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(lineIndex, Math.max(1, lineItem.cuantity - 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-rose-200 hover:text-rose-500"
                aria-label="Disminuir cantidad"
              >
                <FiMinus size={14} />
              </button>
              <input
                type="number"
                min="1"
                step="1"
                value={lineItem.cuantity}
                onChange={(changeEvent) =>
                  handleQuantityChange(lineIndex, changeEvent.target.value)
                }
                className="w-14 rounded-xl border border-stone-200 px-2 py-1 text-center text-sm"
              />
              <button
                type="button"
                onClick={() => handleQuantityChange(lineIndex, lineItem.cuantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 hover:border-rose-200 hover:text-rose-500"
                aria-label="Aumentar cantidad"
              >
                <FiPlus size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveProductLine(lineIndex)}
              disabled={editForm.products.length <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
              aria-label="Quitar producto"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}

        {fieldErrors.products && (
          <p className={errorClass}>{fieldErrors.products}</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedProductId}
            onChange={(changeEvent) => setSelectedProductId(changeEvent.target.value)}
            className={inputClass}
            aria-label="Agregar producto"
          >
            <option value="">Agregar producto del catálogo</option>
            {availableCatalogProducts.map((catalogProduct) => (
              <option key={catalogProduct.id} value={catalogProduct.id}>
                {catalogProduct.name} — {formatProductPrice(catalogProduct.price)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddProductLine}
            disabled={!selectedProductId}
            className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Total estimado
          </p>
          <p className="text-xl font-bold text-rose-500">
            {formatProductPrice(estimatedTotal)}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="depositAmount">
            Seña (ARS)
          </label>
          <input
            id="depositAmount"
            name="depositAmount"
            type="number"
            min="0"
            step="1"
            value={editForm.depositAmount}
            onChange={handleFieldChange}
            className={inputClass}
          />
          {fieldErrors.depositAmount && (
            <p className={errorClass}>{fieldErrors.depositAmount}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 py-3 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition hover:scale-[1.02]"
      >
        <FiCheck size={16} />
        Guardar cambios
      </button>
    </form>
  );
}

export default EditOrderIntegral;
