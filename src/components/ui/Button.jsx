const BUTTON_VARIANTS = {
  primary:
    'bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-sm hover:brightness-105 hover:shadow-md',
  ghost:
    'border border-stone-200 bg-white text-stone-500 shadow-sm hover:bg-stone-50 hover:border-stone-300',
  outline:
    'border border-rose-400 text-rose-500 hover:bg-rose-400 hover:text-white',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:brightness-105',
  link: 'text-rose-500 hover:text-rose-600 hover:underline',
};

const BUTTON_SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const BASE_STYLES =
  'group tap-highlight inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const variantStyles = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeStyles = BUTTON_SIZES[size] || BUTTON_SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE_STYLES} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
