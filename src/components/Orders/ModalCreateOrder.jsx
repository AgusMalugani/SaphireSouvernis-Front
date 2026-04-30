import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { fetchCreateOrder } from '../../services/Orders/CreateOrder.service';
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { onValidateOrder } from '../../formValidations/OnValidateOrder';
import { toast } from 'react-toastify';
import { HiX } from 'react-icons/hi';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

function ModalCreateOrder({ isOpen, onClose, products, cartItems = [], total = 0 }) {
  const navigate = useNavigate();
  const { setOrders } = useContext(OrdersContext);

  const [orderForm, setOrderForm] = useState({
    endOrder: '',
    transactionType: '',
    address: '',
    theme: '',
    nameClient: '',
    personalizationName: '',
    numCel: '',
    num2Cel: '',
    products: [],
    email: '',
  });
  const [errors, setErrors] = useState(null);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (products && products.length > 0) {
      setOrderForm((prevOrderForm) => ({ ...prevOrderForm, products }));
    }
  }, [products]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    if (name === 'endOrder') {
      const selectedDate = new Date(value);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      if (selectedDate < minDate) {
        toast.error('La fecha debe ser al menos 7 días después del día actual.');
        return;
      }
    }

    setOrderForm({ ...orderForm, [name]: value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const errores = onValidateOrder(orderForm);

    if (!errores) {
      try {
        const newOrder = await toast.promise(fetchCreateOrder(orderForm), {
          pending: 'Creando orden...',
          success: 'Orden creada ✅',
          error: 'Falló 😓',
        });
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        setErrors(null);
        onClose();
        // Pasar el formulario completo + carrito para el mensaje de WhatsApp en PostShop
        navigate(`/postShop/${newOrder.id}`, {
          state: { orderForm, cartItems, total },
        });
      } catch (error) {
        console.log('Error al crear la orden');
        throw error;
      }
    } else {
      toast.error('Revisá los errores en el formulario.');
      setErrors(errores);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-stone-200 rounded-2xl bg-white/70 placeholder-stone-400 focus:outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all duration-200';
  const labelClass = 'block text-sm font-semibold text-stone-700 mb-1.5';
  const errorClass =
    'text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 mt-1';

  return (
    <Modal
      isOpen={isOpen}
      appElement={document.getElementById('root') || undefined}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          inset: 'unset',
          padding: 0,
          border: 'none',
          background: 'none',
          overflow: 'visible',
        },
      }}
    >
      <div className="relative bg-white/90 backdrop-blur-md border border-white/60 rounded-3xl shadow-2xl w-[92vw] sm:w-[520px] max-h-[92vh] overflow-y-auto scrollbar-thin-rose">

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-200"
        >
          <HiX size={16} />
        </button>

        <div className="p-6 sm:p-8">

          {/* Encabezado */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100">
                <FiShoppingBag size={15} className="text-rose-500" />
              </div>
              <span className="uppercase tracking-[0.25em] text-rose-400 text-xs font-medium">
                Tu pedido
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-stone-800 font-bold leading-tight">
              Completá tu pedido
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Todos los campos son obligatorios.
            </p>
          </div>

          <form onSubmit={handleOnSubmit} className="flex flex-col gap-6">

            {/* ── Sección 1: Datos personales ── */}
            <div>
              <h3 className="font-display text-lg text-stone-700 font-semibold mb-4 pb-2 border-b border-stone-100">
                Tus datos
              </h3>
              <div className="flex flex-col gap-4">

                <div>
                  <label className={labelClass}>Nombre completo</label>
                  <input
                    type="text"
                    name="nameClient"
                    value={orderForm.nameClient}
                    onChange={handleOnChange}
                    placeholder="Ana García"
                    className={inputClass}
                  />
                  {errors?.nameClient && <p className={errorClass}>{errors.nameClient}</p>}
                </div>

                <div>
                  <label className={labelClass}>Nombre para el diseño</label>
                  <input
                    type="text"
                    name="personalizationName"
                    value={orderForm.personalizationName}
                    onChange={handleOnChange}
                    placeholder="ANA GARCIA"
                    className={inputClass}
                  />
                  {errors?.personalizationName && <p className={errorClass}>{errors.personalizationName}</p>}
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={orderForm.email}
                    onChange={handleOnChange}
                    placeholder="ana@email.com"
                    className={inputClass}
                  />
                  {errors?.email && <p className={errorClass}>{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Teléfono principal</label>
                    <input
                      type="text"
                      name="numCel"
                      value={orderForm.numCel}
                      onChange={handleOnChange}
                      placeholder="3411234567"
                      className={inputClass}
                    />
                    {errors?.numCel && <p className={errorClass}>{errors.numCel}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Teléfono secundario</label>
                    <input
                      type="text"
                      name="num2Cel"
                      value={orderForm.num2Cel}
                      onChange={handleOnChange}
                      placeholder="3417654321"
                      className={inputClass}
                    />
                    {errors?.num2Cel && <p className={errorClass}>{errors.num2Cel}</p>}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Sección 2: Detalles del pedido ── */}
            <div>
              <h3 className="font-display text-lg text-stone-700 font-semibold mb-4 pb-2 border-b border-stone-100">
                Tu pedido
              </h3>
              <div className="flex flex-col gap-4">

                <div>
                  <label className={labelClass}>Forma de entrega</label>
                  <select
                    name="transactionType"
                    value={orderForm.transactionType}
                    onChange={handleOnChange}
                    className={inputClass}
                  >
                    <option value="">Seleccioná Envío o Retiro</option>
                    <option value="withdraw">Retiro en local</option>
                    <option value="send">Envío a domicilio</option>
                  </select>
                  {errors?.transactionType && <p className={errorClass}>{errors.transactionType}</p>}
                </div>

                <div>
                  <label className={labelClass}>Dirección de envío</label>
                  <input
                    name="address"
                    value={orderForm.address}
                    onChange={handleOnChange}
                    type="text"
                    placeholder="Av. Siempre Viva 742"
                    className={inputClass}
                  />
                  {errors?.address && <p className={errorClass}>{errors.address}</p>}
                </div>

                <div>
                  <label className={labelClass}>Tema del evento</label>
                  <textarea
                    name="theme"
                    value={orderForm.theme}
                    onChange={handleOnChange}
                    rows={3}
                    placeholder="Ej: Jardín provenzal, colores pastel..."
                    className={`${inputClass} resize-none`}
                  />
                  {errors?.theme && <p className={errorClass}>{errors.theme}</p>}
                </div>

                <div>
                  <label className={labelClass}>Fecha del evento</label>
                  <input
                    type="date"
                    name="endOrder"
                    value={orderForm.endOrder}
                    onChange={handleOnChange}
                    className={inputClass}
                  />
                  {errors?.endOrder && <p className={errorClass}>{errors.endOrder}</p>}
                </div>

              </div>
            </div>

            {/* Resumen del total */}
            <div className="flex items-center justify-between bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
              <span className="text-stone-600 font-medium text-sm">Total del carrito</span>
              <span className="text-rose-500 font-bold text-xl">${total}</span>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-300/40 hover:shadow-rose-400/60 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Confirmar pedido
              <FiArrowRight size={16} />
            </button>

          </form>
        </div>
      </div>
    </Modal>
  );
}

export default ModalCreateOrder;
