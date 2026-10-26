import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-indigo-50 px-6 py-12">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center shadow-xl">

        {/* 404 */}
        <div className="flex items-center justify-center gap-2" aria-hidden="true">
          <span className="text-8xl font-bold leading-none text-indigo-600">4</span>

          <div className="relative h-24 w-28">
            <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-indigo-600"></div>
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#FF6B4A] mix-blend-multiply"></div>
          </div>

          <span className="text-8xl font-bold leading-none text-indigo-600">4</span>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#17152B]">Page not found</h1>
          <p className="text-gray-500">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-8 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Back to home
          </Link>

          <Link
            to="/login"
            className="flex h-12 items-center justify-center rounded-xl border border-indigo-200 px-8 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
          >
            Log in
          </Link>
        </div>

      </div>
    </main>
  )
}