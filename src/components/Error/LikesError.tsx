
import {  FaHeart, FaTriangleExclamation } from "react-icons/fa6"

export default function LikesError({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white">
              <FaHeart size={12} />
            </span>
            <h2 className="text-base font-bold text-gray-900">Likes</h2>
          </div>

        </div>

        {/* Error body */}
        <div
          role="alert"
          className="flex flex-col items-center gap-3 px-6 py-10 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <FaTriangleExclamation size={24} />
          </span>

          <div className="leading-tight">
            <p className="font-semibold text-gray-900">Couldn't load likes</p>
            <p className="mt-1 text-sm text-gray-500">{message} Please try again.</p>
          </div>


        </div>
      </div>
    </div>
  )
}