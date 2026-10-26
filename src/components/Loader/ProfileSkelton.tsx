
export default function ProfileSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-5xl animate-pulse flex-col gap-6 px-4 py-6"
      aria-busy="true"
      aria-label="Loading profile"
    >
      {/* Header card */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-md">
        {/* Cover */}
        <div className="h-40 bg-gray-200 sm:h-44"></div>

        <div className="flex flex-wrap items-end justify-between gap-5 px-6 pb-6 sm:px-8">
          <div className="flex max-w-xl flex-1 flex-col gap-3">
            {/* Avatar */}
            <div className="-mt-14 h-28 w-28 rounded-full border-4 border-white bg-gray-300"></div>

            <div className="flex flex-col gap-2">
              <div className="h-7 w-48 rounded-md bg-gray-200"></div>
              <div className="h-4 w-28 rounded-md bg-gray-200"></div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full max-w-md rounded-md bg-gray-200"></div>
              <div className="h-4 w-2/3 rounded-md bg-gray-200"></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* Stats */}
            <div className="flex gap-7">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-6 w-10 rounded-md bg-gray-200"></div>
                  <div className="h-3.5 w-14 rounded-md bg-gray-200"></div>
                </div>
              ))}
            </div>

            {/* Edit button */}
            <div className="h-11 w-28 rounded-xl bg-gray-200"></div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="flex flex-col items-start gap-6 md:flex-row">
        {/* About */}
        <aside className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-md md:max-w-xs">
          <div className="h-6 w-20 rounded-md bg-gray-200"></div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-gray-200"></div>
              <div className="flex flex-col gap-2">
                <div className="h-3 w-14 rounded-md bg-gray-200"></div>
                <div className="h-4 w-32 rounded-md bg-gray-200"></div>
              </div>
            </div>
          ))}
        </aside>

        {/* Posts */}
        <section className="flex w-full min-w-0 flex-1 flex-col gap-4">
          <div className="h-6 w-32 rounded-md bg-gray-200"></div>

          {[1, 2].map((i) => (
            <article key={i} className="flex flex-col gap-3.5 rounded-2xl bg-white p-5 shadow-md">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200"></div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-4 w-36 rounded-md bg-gray-200"></div>
                  <div className="h-3 w-24 rounded-md bg-gray-200"></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="h-4 w-full rounded-md bg-gray-200"></div>
                <div className="h-4 w-4/5 rounded-md bg-gray-200"></div>
              </div>

              <div className="flex gap-2 border-t border-gray-200 pt-2">
                <div className="h-10 w-16 rounded-xl bg-gray-200"></div>
                <div className="h-10 w-16 rounded-xl bg-gray-200"></div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}