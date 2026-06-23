import { FiClock, FiCreditCard, FiMessageSquare, FiTruck } from 'react-icons/fi';
import {
  getOrderStateLabel,
  getOrderTransactionLabel,
} from '../../utils/orders/orderStatusConfig';

const TIMELINE_ICON_BY_TYPE = {
  created: FiClock,
  state_changed: FiCreditCard,
  transaction_changed: FiTruck,
  admin_note_added: FiMessageSquare,
};

function getTimelineDescription(timelineEvent) {
  const eventPayload = timelineEvent?.payload ?? {};

  if (timelineEvent.type === 'state_changed') {
    const fromLabel =
      eventPayload.fromLabel ?? getOrderStateLabel(eventPayload.from);
    const toLabel =
      eventPayload.toLabel ?? getOrderStateLabel(eventPayload.to);
    return `Estado: ${fromLabel ?? '—'} → ${toLabel ?? '—'}`;
  }

  if (timelineEvent.type === 'transaction_changed') {
    const hasAddressChange =
      eventPayload.fromAddress != null || eventPayload.toAddress != null;
    const hasTransactionChange =
      eventPayload.fromTransactionType != null ||
      eventPayload.toTransactionType != null ||
      eventPayload.from != null ||
      eventPayload.to != null;

    if (hasTransactionChange) {
      const fromLabel =
        eventPayload.fromLabel ??
        getOrderTransactionLabel(
          eventPayload.fromTransactionType ?? eventPayload.from,
        );
      const toLabel =
        eventPayload.toLabel ??
        getOrderTransactionLabel(
          eventPayload.toTransactionType ?? eventPayload.to,
        );
      return `Entrega: ${fromLabel ?? '—'} → ${toLabel ?? '—'}`;
    }

    if (hasAddressChange) {
      return `Dirección: ${eventPayload.fromAddress ?? '—'} → ${eventPayload.toAddress ?? '—'}`;
    }

    return 'Entrega actualizada';
  }

  if (timelineEvent.type === 'admin_note_added') {
    return eventPayload.note ?? 'Nota agregada';
  }

  if (timelineEvent.type === 'created') {
    return 'Pedido creado';
  }

  return 'Evento registrado';
}

function OrderTimeline({ events = [], emptyMessage }) {
  if (events.length === 0) {
    return (
      <p className="rounded-2xl border border-stone-100 bg-stone-50/80 px-4 py-3 text-sm text-stone-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {events.map((timelineEvent) => {
        const TimelineIcon =
          TIMELINE_ICON_BY_TYPE[timelineEvent.type] ?? FiClock;
        const formattedDate = timelineEvent.createdAt
          ? new Date(timelineEvent.createdAt).toLocaleString('es-AR')
          : '';

        return (
          <li
            key={timelineEvent.id}
            className="flex gap-3 rounded-2xl border border-stone-100 bg-white/70 px-4 py-3"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-400">
              <TimelineIcon size={15} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-stone-700">
                {getTimelineDescription(timelineEvent)}
              </p>
              {formattedDate && (
                <p className="mt-1 text-xs text-stone-400">{formattedDate}</p>
              )}
              {timelineEvent.isOptimistic && (
                <p className="mt-1 text-[10px] uppercase tracking-wider text-amber-500">
                  Pendiente de sincronizar
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default OrderTimeline;
