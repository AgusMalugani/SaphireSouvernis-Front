import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FiShoppingBag,
  FiUser,
  FiCalendar,
  FiTruck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { BaseModal, Button, Input } from '../ui';
import { fetchCreateOrder } from '../../services/Orders/CreateOrder.service';
import { OrdersContext } from '../../contexts/Orders/OrdersContext';
import { onValidateOrder } from '../../formValidations/OnValidateOrder';

const SELECT_CLASS =
  'w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm text-stone-700 transition-all duration-200 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200';

const LABEL_CLASS = 'mb-1.5 block text-sm font-semibold text-stone-700';

const ERROR_CLASS =
  'mt-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600';

const STEPS = [
  { id: 1, label: 'Datos', icon: FiUser },
  { id: 2, label: 'Evento', icon: FiCalendar },
  { id: 3, label: 'Entrega', icon: FiTruck },
  { id: 4, label: 'Revisar', icon: FiCheckCircle },
];

function ModalCreateOrder({ isOpen, onClose, products, cartItems = [], total = 0 }) {
  const navigate = useNavigate();
  const { setOrders } = useContext(OrdersContext);

  const [currentStep, setCurrentStep] = useState(1);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      setOrderForm((previousOrderForm) => ({ ...previousOrderForm, products }));
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

    if (name === 'transactionType') {
      setOrderForm({
        ...orderForm,
        transactionType: value,
        address: value === 'withdraw' ? 'Retiro en local' : '',
      });
      return;
    }

    setOrderForm({ ...orderForm, [name]: value });
  };

  const validateCurrentStep = () => {
    const stepErrors = {};

    if (currentStep === 1) {
      if (!orderForm.nameClient.trim()) stepErrors.nameClient = 'El nombre es obligatorio.';
      if (!orderForm.email.trim()) stepErrors.email = 'El email es obligatorio.';
      if (!orderForm.numCel.trim()) stepErrors.numCel = 'El teléfono principal es obligatorio.';
    }

    if (currentStep === 2) {
      if (!orderForm.personalizationName.trim()) {
        stepErrors.personalizationName = 'El nombre para el diseño es obligatorio.';
      }
      if (!orderForm.theme.trim()) stepErrors.theme = 'El tema del evento es obligatorio.';
      if (!orderForm.endOrder) stepErrors.endOrder = 'La fecha del evento es obligatoria.';
    }

    if (currentStep === 3) {
      if (!orderForm.transactionType) {
        stepErrors.transactionType = 'Seleccioná una forma de entrega.';
      }
      if (orderForm.transactionType === 'send' && !orderForm.address.trim()) {
        stepErrors.address = 'La dirección es obligatoria para envío a domicilio.';
      }
    }

    setErrors(Object.keys(stepErrors).length > 0 ? stepErrors : null);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error('Completá todos los campos antes de continuar.');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors(null);
  };

  // Confirmación solo por click explícito en el botón (nunca por submit implícito / Enter / swap de botones).
  const handleConfirmOrder = async () => {
    if (currentStep !== 4 || isSubmitting) return;

    const validationErrors = onValidateOrder(orderForm);

    if (validationErrors) {
      toast.error('Revisá los errores en el formulario.');
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await toast.promise(fetchCreateOrder(orderForm), {
        pending: 'Creando orden...',
        success: 'Orden creada ✅',
        error: 'Falló 😓',
      });
      setOrders((previousOrders) => [...previousOrders, newOrder]);
      setErrors(null);
      setCurrentStep(1);
      onClose();
      navigate(`/post-shop/${newOrder.id}`, {
        state: { orderForm, cartItems, total },
      });
    } catch (error) {
      console.log('Error al crear la orden');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWithdraw = orderForm.transactionType === 'withdraw';
  const isSend = orderForm.transactionType === 'send';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="action"
      closeOnOverlayClick={false}
      className="overflow-y-auto scrollbar-thin-rose"
      ariaLabel="Completar pedido"
    >
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-7">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
              <FiShoppingBag size={15} className="text-rose-500" aria-hidden="true" />
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
              Tu pedido
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-stone-800 sm:text-3xl">
            Completá tu pedido
          </h2>
          <p className="mt-1 text-sm text-stone-400">Paso {currentStep} de {STEPS.length}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-rose-400 bg-rose-50 text-rose-500'
                      : isCompleted
                        ? 'border-rose-400 bg-rose-400 text-white'
                        : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span
                  className={`text-xs font-medium ${isActive ? 'text-rose-500' : isCompleted ? 'text-rose-400' : 'text-stone-400'}`}
                >
                  {step.label}
                </span>
                {step.id < STEPS.length && (
                  <div
                    className={`absolute left-[calc(50%+2rem)] top-5 h-0.5 w-[calc(100%-4rem)] transition-colors duration-300 ${isCompleted ? 'bg-rose-400' : 'bg-stone-200'}`}
                    style={{ position: 'relative', left: 'calc(50% + 1.5rem)' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex flex-col gap-6"
        >
          {/* Step 1: Datos del cliente */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="border-b border-stone-100 pb-2 font-display text-lg font-semibold text-stone-700">
                Tus datos
              </h3>

              <Input
                id="order-name-client"
                name="nameClient"
                label="Nombre completo"
                value={orderForm.nameClient}
                onChange={handleOnChange}
                placeholder="Ana García"
                error={errors?.nameClient}
                required
              />

              <Input
                id="order-email"
                name="email"
                type="email"
                label="Email"
                value={orderForm.email}
                onChange={handleOnChange}
                placeholder="ana@email.com"
                error={errors?.email}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="order-num-cel"
                  name="numCel"
                  label="Teléfono principal"
                  value={orderForm.numCel}
                  onChange={handleOnChange}
                  placeholder="3411234567"
                  error={errors?.numCel}
                  required
                />
                <Input
                  id="order-num2-cel"
                  name="num2Cel"
                  label="Teléfono secundario"
                  value={orderForm.num2Cel}
                  onChange={handleOnChange}
                  placeholder="3417654321"
                  error={errors?.num2Cel}
                />
              </div>
            </div>
          )}

          {/* Step 2: Evento */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="border-b border-stone-100 pb-2 font-display text-lg font-semibold text-stone-700">
                Detalles del evento
              </h3>

              <Input
                id="order-personalization-name"
                name="personalizationName"
                label="Nombre para el diseño"
                value={orderForm.personalizationName}
                onChange={handleOnChange}
                placeholder="ANA GARCIA"
                error={errors?.personalizationName}
                required
              />

              <Input
                id="order-theme"
                name="theme"
                type="textarea"
                rows={3}
                label="Tema del evento"
                value={orderForm.theme}
                onChange={handleOnChange}
                placeholder="Ej: Jardín provenzal, colores pastel..."
                error={errors?.theme}
                required
              />

              <div>
                <Input
                  id="order-end-order"
                  name="endOrder"
                  type="date"
                  label="Fecha del evento"
                  value={orderForm.endOrder}
                  onChange={handleOnChange}
                  error={errors?.endOrder}
                  required
                />
                <p className="mt-1.5 text-xs text-stone-400">
                  La fecha debe ser al menos 7 días después de hoy.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Entrega */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="border-b border-stone-100 pb-2 font-display text-lg font-semibold text-stone-700">
                Forma de entrega
              </h3>

              <div>
                <label htmlFor="order-transaction-type" className={LABEL_CLASS}>
                  Forma de entrega
                  <span className="ml-1 text-rose-400">*</span>
                </label>
                <select
                  id="order-transaction-type"
                  name="transactionType"
                  value={orderForm.transactionType}
                  onChange={handleOnChange}
                  className={SELECT_CLASS}
                  required
                >
                  <option value="">Seleccioná Envío o Retiro</option>
                  <option value="withdraw">Retiro en local</option>
                  <option value="send">Envío a domicilio</option>
                </select>
                {errors?.transactionType && <p className={ERROR_CLASS}>{errors.transactionType}</p>}
              </div>

              {!isWithdraw && (
                <Input
                  id="order-address"
                  name="address"
                  label="Dirección de envío"
                  value={orderForm.address}
                  onChange={handleOnChange}
                  placeholder="Av. Siempre Viva 742"
                  error={errors?.address}
                  disabled={!isSend}
                  required={isSend}
                />
              )}

              {isWithdraw && (
                <p className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm text-stone-500">
                  Retiro en local — no necesitás indicar dirección.
                </p>
              )}
            </div>
          )}

          {/* Step 4: Revisión */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <h3 className="border-b border-stone-100 pb-2 font-display text-lg font-semibold text-stone-700">
                Revisá tu pedido
              </h3>

              <div className="space-y-3 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-sm">
                <div>
                  <span className="font-semibold text-stone-600">Cliente:</span>{' '}
                  <span className="text-stone-700">{orderForm.nameClient}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Email:</span>{' '}
                  <span className="text-stone-700">{orderForm.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Teléfono:</span>{' '}
                  <span className="text-stone-700">{orderForm.numCel}</span>
                  {orderForm.num2Cel && ` / ${orderForm.num2Cel}`}
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Diseño:</span>{' '}
                  <span className="text-stone-700">{orderForm.personalizationName}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Tema:</span>{' '}
                  <span className="text-stone-700">{orderForm.theme}</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Fecha evento:</span>{' '}
                  <span className="text-stone-700">
                    {new Date(orderForm.endOrder + 'T00:00:00').toLocaleDateString('es-AR')}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-600">Entrega:</span>{' '}
                  <span className="text-stone-700">
                    {orderForm.transactionType === 'withdraw' ? 'Retiro en local' : `Envío a ${orderForm.address}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
                <span className="text-sm font-medium text-stone-600">Total del carrito</span>
                <span className="text-xl font-bold text-rose-500">${total}</span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button type="button" variant="ghost" size="md" onClick={handleBack} className="flex-1">
                <FiChevronLeft size={16} aria-hidden="true" />
                Anterior
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button type="button" variant="primary" size="md" onClick={handleNext} className="flex-1">
                Siguiente
                <FiChevronRight size={16} aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="flex-1 shadow-lg shadow-rose-300/40"
              >
                Confirmar pedido
                <FiCheckCircle size={16} aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

export default ModalCreateOrder;
