import { formatProductPrice } from '../products/formatProductPrice.js';
import {
  getOrderStateLabel,
  getOrderTransactionLabel,
} from './orderStatusConfig.js';
import { ORDER_INTEGRAL_EDIT_FIELD_LABELS } from './orderIntegralEdit.js';

function formatTimelineFieldValue(fieldName, fieldValue) {
  if (fieldValue == null || fieldValue === '') {
    return '—';
  }

  if (fieldName === 'transactionType') {
    return getOrderTransactionLabel(String(fieldValue));
  }

  if (fieldName === 'totalPrice' || fieldName === 'depositAmount') {
    return formatProductPrice(fieldValue);
  }

  return String(fieldValue);
}

function describeOrderEditedEvent(eventPayload) {
  const summaryParts = [];

  if (eventPayload.productsChanged) {
    summaryParts.push('Productos actualizados');
  }

  const fieldChanges = eventPayload.changes ?? {};
  const changeSummaries = Object.entries(fieldChanges)
    .filter(([fieldName]) => fieldName !== 'totalPrice')
    .map(([fieldName, changeRecord]) => {
      const fieldLabel = ORDER_INTEGRAL_EDIT_FIELD_LABELS[fieldName] ?? fieldName;
      const fromValue = formatTimelineFieldValue(fieldName, changeRecord?.from);
      const toValue = formatTimelineFieldValue(fieldName, changeRecord?.to);
      return `${fieldLabel}: ${fromValue} → ${toValue}`;
    });

  if (changeSummaries.length > 0) {
    summaryParts.push(...changeSummaries);
  }

  if (fieldChanges.totalPrice) {
    const fromTotal = formatTimelineFieldValue(
      'totalPrice',
      fieldChanges.totalPrice.from,
    );
    const toTotal = formatTimelineFieldValue(
      'totalPrice',
      fieldChanges.totalPrice.to,
    );
    summaryParts.push(`Total: ${fromTotal} → ${toTotal}`);
  }

  if (summaryParts.length === 0) {
    return 'Pedido editado';
  }

  return summaryParts.join('. ');
}

/**
 * @param {object} timelineEvent
 * @returns {string}
 */
export function getOrderTimelineDescription(timelineEvent) {
  const eventPayload = timelineEvent?.payload ?? {};

  if (timelineEvent.type === 'payment_updated') {
    const fromDeposit = formatProductPrice(eventPayload.fromDeposit ?? 0);
    const toDeposit = formatProductPrice(eventPayload.toDeposit ?? 0);
    const remainingBalance = formatProductPrice(eventPayload.remainingBalance ?? 0);
    return `Seña actualizada: ${fromDeposit} → ${toDeposit}. Saldo pendiente: ${remainingBalance}.`;
  }

  if (timelineEvent.type === 'order_cancelled') {
    const previousStateLabel = getOrderStateLabel(eventPayload.previousState);
    const reason = eventPayload.reason?.trim();
    return reason
      ? `Pedido cancelado (desde ${previousStateLabel}). Motivo: ${reason}`
      : `Pedido cancelado (desde ${previousStateLabel}).`;
  }

  if (timelineEvent.type === 'order_edited') {
    return describeOrderEditedEvent(eventPayload);
  }

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
