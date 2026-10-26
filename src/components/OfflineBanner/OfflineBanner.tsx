
import { FaWifi} from "react-icons/fa6"

export default function OfflineBanner() {
  return (
<div
  role="alert"
  className="fixed inset-x-0 top-0 z-100 flex h-12 items-center justify-center gap-3 bg-gray-900 px-4 text-sm font-medium text-white"
>
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400">
        <FaWifi size={14} />
   
        <span className="absolute h-0.5 w-6 rotate-45 rounded bg-red-400"></span>
      </span>

      <div className="leading-tight">
        <p className="font-semibold">You're offline</p>
        <p className="text-xs text-gray-300">Check your internet connection and try again.</p>
      </div>


    </div>
  )
}