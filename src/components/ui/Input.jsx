const INPUT_BASE =
  'w-full rounded-2xl border border-stone-200 bg-white/70 px-4 py-2.5 text-sm text-stone-700 placeholder-stone-400 transition-all duration-200 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200';

const LABEL_BASE = 'mb-1.5 block text-sm font-semibold text-stone-700';

const ERROR_BASE =
  'mt-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600';

function Input({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  rows,
  ...props
}) {
  const isTextarea = type === 'textarea';
  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className={LABEL_BASE}>
          {label}
          {required && <span className="ml-1 text-rose-400">*</span>}
        </label>
      )}

      <InputComponent
        id={id}
        name={name}
        type={isTextarea ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        rows={isTextarea ? rows : undefined}
        className={`${INPUT_BASE} ${isTextarea ? 'resize-none' : ''} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${error ? 'border-rose-300 focus:ring-rose-100' : ''} ${className}`}
        {...props}
      />

      {error && <p className={ERROR_BASE}>{error}</p>}
    </div>
  );
}

export default Input;
