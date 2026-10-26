export default function LoaderComment() {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-label="Loading comments"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-3 animate-pulse">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200" />

          <div className="min-w-0 flex-1">
            <div className="rounded-2xl rounded-tl-sm border border-indigo-100 bg-indigo-50/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-28 rounded bg-gray-200" />
                <div className="h-3 w-12 rounded bg-gray-200" />
              </div>

              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-4/5 rounded bg-gray-200" />
              </div>

              {index % 2 === 0 && (
                <div className="mt-3 h-32 max-w-sm rounded-xl bg-gray-200" />
              )}
            </div>

            <div className="mt-2 flex gap-3 pl-2">
              <div className="h-7 w-16 rounded-full bg-gray-200" />
              <div className="h-7 w-16 rounded-full bg-gray-200" />
              <div className="h-7 w-20 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      ))}

      <span className="sr-only">Loading comments...</span>
    </div>
  );
}