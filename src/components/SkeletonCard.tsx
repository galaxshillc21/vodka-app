import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonTiendas = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 rounded-xl p-4 space-y-3">
          {/* Store name */}
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>

          {/* Address and distance */}
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Hours */}
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonEventos = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-4 h-[30px] w-[280px] m-auto" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[300px] w-full rounded-xl" />
    </div>
  );
};

export const SkeletonFavorites = () => (
  <div className="space-y-4">
    <div className="h-6 bg-gray-200 rounded mb-4"></div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse bg-gray-200 rounded-xl p-4">
        <div className="h-16 bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);
