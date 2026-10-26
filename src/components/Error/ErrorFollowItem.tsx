
import { FaExclamationCircle, FaRedo } from "react-icons/fa";

interface ErrorFollowItemProps {
  onRetry: () => void;
}

export default function ErrorFollowItem({
  onRetry,
}: ErrorFollowItemProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/70 px-4 py-6 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
        <FaExclamationCircle size={22} />
      </div>

      <h3 className="text-sm font-bold text-[#17152B]">
        Couldn't load suggestions
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-gray-500">
        Something went wrong while loading people you may know.
        Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700"
      >
        <FaRedo size={11} />
        Try Again
      </button>
    </div>
  );
}
