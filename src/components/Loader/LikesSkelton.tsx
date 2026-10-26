
import { FaHeart } from "react-icons/fa6"

export default function LikesSkeleton() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-600 text-white">
              <FaHeart size={12} />
            </span>
            <h2 className="text-base font-bold text-gray-900">Likes</h2>
            <div className="h-4 w-6 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>

        {/* List */}
        <ul
          className="flex animate-pulse flex-col overflow-y-auto py-1"
          aria-busy="true"
          aria-label="Loading likes"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2.5">
              {/* Avatar */}
              <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200"></div>

              {/* Name */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-3.5 w-32 rounded-md bg-gray-200"></div>
                <div className="h-3 w-20 rounded-md bg-gray-200"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}