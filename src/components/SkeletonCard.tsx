import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonTiendas = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-4 h-[30px] w-[280px] m-auto" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
    </div>
  );
};

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
