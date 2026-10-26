import type { PostType } from "../../Types/PostType.type"
import { timeAgo } from "../../utils/TimeAgo"

type SharedPostProps = {
  sharedPost?: PostType | null
  isShare?: boolean
}

export default function SharedPost({ sharedPost, isShare }: SharedPostProps) {
  if (!sharedPost) {
    if (!isShare) return null

    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-3 text-sm text-gray-500">
        The original post is no longer available.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      {sharedPost.image && (
        <img
          src={sharedPost.image}
          alt="Shared post"
          className="max-h-80 w-full object-cover"
        />
      )}

      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-2">
          <img
            src={sharedPost.user.photo}
            alt={sharedPost.user.name}
            className="h-8 w-8 rounded-full bg-gray-200 object-cover"
          />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {sharedPost.user.name}
            </p>
            <time
              dateTime={sharedPost.createdAt}
              title={new Date(sharedPost.createdAt).toLocaleString()}
              className="text-xs font-semibold text-gray-400"
            >
              {timeAgo(sharedPost.createdAt)}
            </time>
          </div>
        </div>

        {sharedPost.body && (
          <p className="text-sm text-gray-700">{sharedPost.body}</p>
        )}
      </div>
    </div>
  )
}