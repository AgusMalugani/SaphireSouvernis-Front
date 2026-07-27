function Skeleton({ variant = 'default', className = '', count = 1 }) {
  const baseClasses = 'bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 bg-[length:200%_100%]';
  const animationClass = 'animate-[shimmer_1.5s_ease-in-out_infinite]';
  
  const variantClasses = {
    default: 'h-4 w-full rounded',
    title: 'h-8 w-3/4 rounded-lg',
    card: 'aspect-square w-full rounded-3xl',
    button: 'h-11 w-full rounded-full',
    circle: 'h-12 w-12 rounded-full',
    text: 'h-3 w-full rounded',
  };

  const variantClass = variantClasses[variant] || variantClasses.default;

  if (count === 1) {
    return <div className={`${baseClasses} ${animationClass} ${variantClass} ${className}`} />;
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${baseClasses} ${animationClass} ${variantClass} ${className}`} />
      ))}
    </>
  );
}

export default Skeleton;
