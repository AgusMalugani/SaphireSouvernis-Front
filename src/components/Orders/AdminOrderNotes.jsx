import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';
import { AddOrderNote } from '../../services/Orders/AddOrderNote';

function AdminOrderNotes({
  orderId,
  notes = [],
  onNoteAdded,
  onOptimisticNote,
}) {
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    const trimmedNote = noteText.trim();

    if (!trimmedNote) {
      toast.error('Escribí una nota antes de guardar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await AddOrderNote(orderId, trimmedNote);
      await onNoteAdded?.(response?.note ?? { text: trimmedNote });
      setNoteText('');
      toast.success('Nota agregada');
    } catch (error) {
      onOptimisticNote?.(trimmedNote);
      setNoteText('');
      toast.warn(
        'Nota guardada localmente. El historial completo estará disponible cuando el backend esté actualizado.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">
          Notas internas
        </p>
        {notes.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-2">
            {notes.map((noteItem) => (
              <li
                key={noteItem.id}
                className="rounded-2xl border border-stone-100 bg-stone-50/80 px-4 py-3 text-sm text-stone-700"
              >
                <p>{noteItem.text}</p>
                {noteItem.createdAt && (
                  <p className="mt-1 text-xs text-stone-400">
                    {new Date(noteItem.createdAt).toLocaleString('es-AR')}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-stone-500">
            Todavía no hay notas para este pedido.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={noteText}
          onChange={(inputEvent) => setNoteText(inputEvent.target.value)}
          rows={3}
          placeholder="Agregar nota interna (solo visible para admins)..."
          className="w-full resize-none rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 text-sm text-stone-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-300/40 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiPlus size={15} aria-hidden="true" />
          Agregar nota
        </button>
      </form>
    </div>
  );
}

export default AdminOrderNotes;
