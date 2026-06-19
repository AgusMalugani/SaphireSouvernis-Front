function SkeletonBar({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-stone-200/80 ${className}`}
      aria-hidden="true"
    />
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Cargando producto">
      <SkeletonBar className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-5">
        <SkeletonBar className="h-6 w-3/4" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-5/6" />
        <SkeletonBar className="mt-1 h-7 w-1/3" />
      </div>
    </div>
  );
}

export default ProductDetailSkeleton;
