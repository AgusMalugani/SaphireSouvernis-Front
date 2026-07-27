import { Button } from './';

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}) {
  const iconColor = variant === 'cart' ? 'text-rose-300' : 'text-stone-300';
  const titleColor = variant === 'cart' ? 'text-stone-700' : 'text-stone-400';
  const descriptionColor = 'text-stone-500';

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      {Icon && (
        <div className={`${iconColor}`}>
          <Icon size={64} aria-hidden="true" />
        </div>
      )}

      <div className="max-w-sm space-y-2">
        <h3 className={`font-display text-2xl font-semibold ${titleColor}`}>
          {title}
        </h3>
        {description && (
          <p className={`text-sm leading-relaxed ${descriptionColor}`}>
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
