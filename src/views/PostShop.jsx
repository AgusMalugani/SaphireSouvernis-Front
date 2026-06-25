import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FiCheckCircle,
  FiCopy,
  FiHome,
  FiLink,
  FiRefreshCw,
  FiShoppingBag,
} from 'react-icons/fi';
import PostShopOrderSummary from '../components/Orders/PostShopOrderSummary';
import RedirectToWhatsapp from '../components/RedirectToWhatsapp';
import {
  ConsumerPageLayout,
  GHOST_CTA_CLASS,
  GlassArticle,
  PageHeader,
} from '../components/layout/ConsumerPageLayout.jsx';
import { OneOrder } from '../services/Orders/OneOrder';
import {
  buildPostShopPublicUrl,
  buildWhatsAppOrderMessage,
} from '../utils/orders/buildWhatsAppOrderMessage';
import { getApiErrorStatus } from '../utils/orders/getApiErrorStatus';
import { usePageTitle } from '../hooks/usePageTitle';
import { envs } from '../config/env.js';

const NEXT_STEPS = [
  'Revisá el resumen de tu pedido',
  'Contactanos por WhatsApp para coordinar',
  'Coordinamos pago y personalización juntos',
];

function PostShopSuccessIcon() {
  return (
    <div
      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 motion-safe:animate-[pulse_2s_ease-in-out_1]"
      aria-hidden="true"
    >
      <FiCheckCircle size={38} className="text-emerald-500" />
    </div>
  );
}

function PostShopStepsList() {
  return (
    <ol className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-stone-600">
      {NEXT_STEPS.map((stepLabel, stepIndex) => (
        <li key={stepLabel} className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-500">
            {stepIndex + 1}
          </span>
          <span className="pt-0.5 leading-relaxed">{stepLabel}</span>
        </li>
      ))}
    </ol>
  );
}

function CopyButton({ value, successMessage, ariaLabel, children }) {
  const handleCopy = async () => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success(successMessage);
    } catch (copyError) {
      console.error('No se pudo copiar al portapapeles', copyError);
      toast.error('No se pudo copiar. Intentá de nuevo.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:border-rose-200 hover:text-rose-500"
    >
      {children}
    </button>
  );
}

function PostShopNotFound({ orderId }) {
  return (
    <ConsumerPageLayout>
      <GlassArticle ariaLabelledBy="postshop-error-heading">
        <PageHeader
          eyebrow="Pedido no encontrado"
          title="No encontramos este pedido"
          titleId="postshop-error-heading"
          subtitle="El enlace puede estar incorrecto o el pedido ya no está disponible."
        />
        {orderId && (
          <p className="text-sm text-stone-500">
            Referencia: <span className="font-mono text-stone-700">{orderId}</span>
          </p>
        )}
        <Link to="/" className={GHOST_CTA_CLASS}>
          <FiHome size={15} aria-hidden="true" />
          Volver al inicio
        </Link>
      </GlassArticle>
    </ConsumerPageLayout>
  );
}

function PostShopNetworkError({ onRetry }) {
  return (
    <ConsumerPageLayout>
      <GlassArticle ariaLabelledBy="postshop-network-heading">
        <PageHeader
          eyebrow="Error de conexión"
          title="No pudimos cargar tu pedido"
          titleId="postshop-network-heading"
          subtitle="Verificá tu conexión a internet e intentá de nuevo."
        />
        <button type="button" onClick={onRetry} className={GHOST_CTA_CLASS}>
          <FiRefreshCw size={15} aria-hidden="true" />
          Reintentar
        </button>
      </GlassArticle>
    </ConsumerPageLayout>
  );
}

function PostShop() {
  const { id: orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageState, setPageState] = useState('loading');
  const [retryCounter, setRetryCounter] = useState(0);
  const [orderLoadedAnnouncement, setOrderLoadedAnnouncement] = useState('');

  usePageTitle('Pedido confirmado · Saphire Souvenirs');

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      setIsLoading(true);
      setPageState('loading');
      setOrder(null);

      try {
        const fetchedOrder = await OneOrder(orderId);
        if (!isMounted) {
          return;
        }

        setOrder(fetchedOrder);
        setPageState('success');
        setOrderLoadedAnnouncement('Detalle del pedido cargado correctamente.');
      } catch (error) {
        console.error('Error al cargar pedido en PostShop', error);
        if (!isMounted) {
          return;
        }

        setOrder(null);

        if (getApiErrorStatus(error) === 404) {
          setPageState('notFound');
        } else {
          setPageState('networkError');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (orderId) {
      fetchOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [orderId, retryCounter]);

  const whatsAppMessage = useMemo(() => {
    if (!order) {
      return '';
    }

    return buildWhatsAppOrderMessage({
      order,
      shopUrl: envs.shopUrl,
    });
  }, [order]);

  const postShopPublicUrl = useMemo(
    () => buildPostShopPublicUrl(orderId, envs.shopUrl),
    [orderId],
  );

  const whatsAppLabel = isLoading && !whatsAppMessage
    ? 'Preparando mensaje...'
    : 'Contactar por WhatsApp';

  if (pageState === 'notFound') {
    return <PostShopNotFound orderId={orderId} />;
  }

  if (pageState === 'networkError') {
    return (
      <PostShopNetworkError onRetry={() => setRetryCounter((value) => value + 1)} />
    );
  }

  return (
    <ConsumerPageLayout>
      <div className="pb-24 sm:pb-0">
        <div className="mb-8 text-center">
          <PostShopSuccessIcon />
          <PageHeader
            eyebrow="Pedido confirmado"
            title="¡Gracias por tu compra!"
            titleId="postshop-heading"
            subtitle="Ya recibimos tu pedido. El siguiente paso es coordinar por WhatsApp."
          />
          <PostShopStepsList />
        </div>

        {orderId && (
          <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm text-stone-600 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-stone-400">Nº pedido</span>
              <span className="font-mono font-semibold text-stone-800">{orderId}</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <CopyButton
                value={orderId}
                successMessage="Número de pedido copiado"
                ariaLabel="Copiar número de pedido"
              >
                <FiCopy size={13} aria-hidden="true" />
                Copiar ID
              </CopyButton>
              <CopyButton
                value={postShopPublicUrl}
                successMessage="Enlace del pedido copiado"
                ariaLabel="Copiar enlace del pedido"
              >
                <FiLink size={13} aria-hidden="true" />
                Copiar enlace
              </CopyButton>
            </div>
          </div>
        )}

        <p className="mb-6 text-center text-xs text-stone-500">
          Guardá este enlace para consultar tu pedido más tarde.
        </p>

        <div className="mb-6 hidden sm:block">
          <RedirectToWhatsapp
            variant="block"
            num={envs.whatsappNum}
            msj={whatsAppMessage}
            label={whatsAppLabel}
            disabled={isLoading && !whatsAppMessage}
          />
        </div>

        <GlassArticle ariaLabelledBy="postshop-summary-heading" className="mb-6 !p-6 sm:!p-8">
          <h2 id="postshop-summary-heading" className="sr-only">
            Resumen del pedido
          </h2>
          <PostShopOrderSummary order={order} isLoading={isLoading} />
        </GlassArticle>

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {orderLoadedAnnouncement}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/shopProducts" className={GHOST_CTA_CLASS}>
            <FiShoppingBag size={15} aria-hidden="true" />
            Seguir comprando
          </Link>
          <Link to="/" className={GHOST_CTA_CLASS}>
            <FiHome size={15} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-md sm:hidden">
        <RedirectToWhatsapp
          variant="block"
          num={envs.whatsappNum}
          msj={whatsAppMessage}
          label={whatsAppLabel}
          disabled={isLoading && !whatsAppMessage}
        />
      </div>
    </ConsumerPageLayout>
  );
}

export function LegacyPostShopRedirect() {
  const { id } = useParams();
  return <Navigate to={`/post-shop/${id}`} replace />;
}

export default PostShop;
