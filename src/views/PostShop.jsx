import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import RedirectToWhatsapp from '../components/RedirectToWhatsapp';
import ViewBuyOrder from '../components/Orders/ViewBuyOrder';
import { FiCheckCircle, FiHome } from 'react-icons/fi';

const TRANSACTION_LABELS = {
  send:     'Envío a domicilio',
  withdraw: 'Retiro en local',
};

/**
 * Construye el mensaje formateado para WhatsApp.
 * Solo se usa cuando location.state está disponible (flujo normal post-checkout).
 */
function buildWhatsAppMessage(orderForm, cartItems, total, orderUrl) {
  const formatDate = (isoDate) => {
    if (!isoDate) return '—';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const productsLines = cartItems
    .map((item) => `  • ${item.name} x${item.cuantity} — $${item.price * item.cuantity}`)
    .join('\n');

  return [
    '💎 *NUEVO PEDIDO - Saphire Souvenirs*',
    '─────────────────────────',
    `👤 *Cliente:* ${orderForm.nameClient}`,
    `📧 *Email:* ${orderForm.email}`,
    `📱 *Tel:* ${orderForm.numCel}`,
    `📅 *Evento:* ${formatDate(orderForm.endOrder)}`,
    `🚚 *Entrega:* ${TRANSACTION_LABELS[orderForm.transactionType] ?? orderForm.transactionType} — ${orderForm.address}`,
    `🎨 *Tema:* ${orderForm.theme}`,
    '─────────────────────────',
    '📦 *PRODUCTOS:*',
    productsLines,
    '─────────────────────────',
    `💰 *TOTAL: $${total}*`,
    '─────────────────────────',
    `🔗 *Ver detalle:* ${orderUrl}`,
  ].join('\n');
}

function PostShop() {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state;

  const orderUrl = `${import.meta.env.VITE_SHOP_URL}${location.pathname}`;

  const whatsappMessage = state
    ? buildWhatsAppMessage(state.orderForm, state.cartItems ?? [], state.total ?? 0, orderUrl)
    : `Hola, acabo de realizar una compra. Podés ver el detalle acá: ${orderUrl}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/60 via-stone-50 to-pink-50/40 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl">

        {/* Hero de confirmación */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-emerald-100 mb-5">
            <FiCheckCircle size={38} className="text-emerald-500" />
          </div>
          <span className="uppercase tracking-[0.3em] text-rose-400 text-xs font-medium">
            Pedido confirmado
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-stone-800 font-bold mt-2 leading-tight">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-stone-400 mt-3 text-sm font-light max-w-sm mx-auto">
            Ya recibimos tu pedido. El siguiente paso es contactarnos por WhatsApp para coordinar los detalles.
          </p>
        </div>

        {/* Detalle del pedido */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl shadow-sm overflow-hidden mb-6">
          <ViewBuyOrder id={id} />
        </div>

        {/* CTA: WhatsApp */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl shadow-sm p-6 mb-4 text-center">
          <p className="text-stone-500 text-sm mb-4 font-light">
            Tocá el botón para enviarnos el detalle de tu pedido por WhatsApp y coordinar el pago.
          </p>
          <RedirectToWhatsapp
            num={import.meta.env.VITE_WHATSAPP_NUM}
            msj={whatsappMessage}
          />
        </div>

        {/* Volver al inicio */}
        <Link to="/" className="block">
          <button className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full border border-stone-200 text-stone-500 font-semibold text-sm bg-white hover:bg-stone-50 hover:border-stone-300 transition-all duration-200">
            <FiHome size={15} />
            Volver al inicio
          </button>
        </Link>

      </div>
    </div>
  );
}

export default PostShop;
