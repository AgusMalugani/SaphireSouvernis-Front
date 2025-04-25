import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { fetchCreateOrder } from '../../services/Orders/CreateOrder.service';
import { useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { onValidateOrder } from '../../formValidations/OnValidateOrder';
import { toast } from 'react-toastify';

function ModalCreateOrder({ isOpen, onClose, products }) {
  const navigate = useNavigate();
  const { setOrders } = useContext(OrdersContext);
  const [orderForm, setOrderForm] = useState({
    endOrder: '',
    transactionType: '',
    address: '',
    theme: '',
    nameClient: '',
    nameForCard: '',
    numCel: '',
    num2Cel: '',
    products: [],
    email: ''
  });
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (products && products.length > 0) {
      setOrderForm((prevOrderForm) => ({
        ...prevOrderForm,
        products
      }));
    }
  }, [products]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
  
    if (name === "endOrder") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setDate(today.getDate() + 7); // Agrega 7 días al día actual
  
      if (selectedDate < today) {
        toast.error("La fecha debe ser al menos 7 días después del día actual.");
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
          error: 'Falló 😓'
        });
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        setErrors(null);
        onClose();
        navigate(`/postShop/${newOrder.id}`);
      } catch (error) {
        console.log('Error al crear la orden');
        throw error;
      }
    } else {
      toast.error('Hubo errores en el formulario.');
      setErrors(errores);
    }
  };

  return (
    <Modal
  isOpen={isOpen}
  appElement={document.getElementById('root') || undefined}
  onRequestClose={onClose}
  shouldCloseOnOverlayClick={false}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      inset: 'unset', // elimina top/right/bottom/left predeterminados
      padding: 0,
      border: 'none',
      background: 'none',
      overflow: 'visible',
    }
  }}
>
  <div className="relative bg-white w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6">
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-red-500 transition"
    >
      ✖
    </button>

    <form onSubmit={handleOnSubmit} className="flex flex-col gap-4">
      <label className="font-bold">
        Nombre completo
        <input
          type="text"
          name="nameClient"
          value={orderForm.nameClient}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>
      {errors?.nameClient && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.nameClient}
        </p>
      )}

      <label className="font-bold">
        Nombre para tarjeta
        <input
          type="text"
          name="nameForCard"
          value={orderForm.nameForCard}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>
      {errors?.nameForCard && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.nameForCard}
        </p>
      )}

      <label className="font-bold">
        Email
        <input
          type="email"
          name="email"
          value={orderForm.email}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>
      {errors?.email && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.email}
        </p>
      )}

      <label className="font-bold">
        Forma de entrega
        <select
          name="transactionType"
          value={orderForm.transactionType}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        >
          <option value="">Seleccione Envio - Retiro</option>
          <option value="withdraw">Retiro en local</option>
          <option value="send">Envío</option>
        </select>
      </label>

      <label className="font-bold">
        Dirección de envío
        <input
          name="address"
          value={orderForm.address}
          onChange={handleOnChange}
          type="text"
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
          placeholder="Ingrese su dirección"
        />
      </label>
      {errors?.address && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.address}
        </p>
      )}

      <label className="font-bold">
        Tema
        <textarea
          name="theme"
          value={orderForm.theme}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>
      {errors?.theme && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.theme}
        </p>
      )}

      <label className="font-bold">
        Teléfono principal
        <input
          type="text"
          name="numCel"
          value={orderForm.numCel}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>
      {errors?.numCel && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.numCel}
        </p>
      )}

      <label className="font-bold">
        Teléfono secundario
        <input
          type="text"
          name="num2Cel"
          value={orderForm.num2Cel}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>
      {errors?.num2Cel && (
        <p className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">
          {errors.num2Cel}
        </p>
      )}

      <label className="font-bold">
        Fecha evento
        <input
          type="date"
          name="endOrder"
          value={orderForm.endOrder}
          onChange={handleOnChange}
          className="w-full p-2 mt-2 border rounded-md border-gray-300"
        />
      </label>

      <button
        type="submit"
        className="mt-4 p-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
      >
        Crear orden
      </button>
    </form>
  </div>
</Modal>
  );
}

export default ModalCreateOrder;
