import { FaExclamationCircle } from "react-icons/fa"

export default function Error({ message }: { message: string }) {
return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <FaExclamationCircle size={28} aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-[#17152B]">
        Something went wrong
      </h3>

      <p className="max-w-sm text-sm leading-relaxed text-gray-500">
        {message}
      </p>
    </div>
    )
}
