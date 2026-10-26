export default function LoaderFollowItem() {
  return (
    <ul
      className="flex flex-col gap-2"
      role="status"
      aria-label="Loading follow suggestions"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <li
          key={index}
          className="flex animate-pulse items-center justify-between gap-3 rounded-xl p-2"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 w-28 max-w-full rounded bg-gray-200" />
              <div className="h-3 w-20 max-w-full rounded bg-gray-200" />
              <div className="mt-0.5 h-2.5 w-24 max-w-full rounded bg-gray-200" />
            </div>
          </div>

          <div className="h-8 w-20 shrink-0 rounded-full bg-gray-200" />
        </li>
      ))}

      <span className="sr-only">Loading suggestions...</span>
    </ul>
  );
}