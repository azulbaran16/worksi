// Placeholder card shown while jobs load.
export default function JobCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3 p-5">
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-5/6 rounded" />
      <div className="mt-2 flex justify-between">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
    </div>
  );
}
