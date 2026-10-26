
export default function Loader() {
  return(
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
    <article
      className="flex animate-pulse flex-col gap-4 rounded-2xl bg-white p-5 shadow-md"
      aria-busy="true"
      aria-label="Loading post"
    >

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="h-3 w-48 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-11/12 rounded bg-gray-200"></div>
        <div className="h-4 w-2/3 rounded bg-gray-200"></div>
      </div>

      {/* Image */}
      <div className="h-64 w-full rounded-xl bg-gray-200"></div>

      {/* Counts */}
      <div className="flex gap-4">
        <div className="h-3 w-16 rounded bg-gray-200"></div>
        <div className="h-3 w-20 rounded bg-gray-200"></div>
        <div className="h-3 w-16 rounded bg-gray-200"></div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-[#DDD9F7] pt-2">
        <div className="h-11 w-24 rounded-xl bg-gray-200"></div>
        <div className="h-11 w-28 rounded-xl bg-gray-200"></div>
        <div className="h-11 w-24 rounded-xl bg-gray-200"></div>
        <div className="ml-auto h-11 w-11 rounded-xl bg-gray-200"></div>
      </div>

      {/* Top comment */}
      <div className="flex gap-3 rounded-xl bg-indigo-50 p-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-gray-200"></div>
          <div className="h-3 w-full rounded bg-gray-200"></div>
        </div>
      </div>

    </article>
    </div>

  )
}

