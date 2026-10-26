import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import type { FollowSuggestionType } from "../../Types/FollowSuggestions.type"
import { FaSpinner, FaUserCheck, FaUserPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function FollowItem({ user }: { user: FollowSuggestionType }) {
  const query = useQueryClient()
  const [isFollow, setIsFollow] = useState(false)

  function followOrunFollow() {
    return axios.put(`https://route-posts.routemisr.com/users/${user._id}/follow`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    })
  }

  const { mutate, isPending: isPendingFollow } = useMutation({

    mutationFn: followOrunFollow,
    onSuccess: (res) => {
      setIsFollow(res.data.data.following)
      query.invalidateQueries({ queryKey: ["getUserProfile", user._id] })
      query.invalidateQueries({queryKey:["getMyProfile"]})
    },
    onError: (err) => {
      setIsFollow(false)
      toast.error(err.message)
    },
  })

  function handleFollow() {
    setIsFollow(!isFollow)
    mutate()
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-indigo-50/60">
      <Link to={`/profile/${user._id}`} className="flex min-w-0 items-center gap-3">
        <img
          src={user.photo}
          alt={user.name}
          className="h-11 w-11 shrink-0 rounded-full bg-gray-200 object-cover ring-2 ring-indigo-100"
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-[#17152B]">{user.name}</p>
          <p className="truncate text-xs text-gray-500">@{user.username}</p>
          <p className="mt-0.5 text-[11px] font-medium text-gray-400">{user.followersCount} followers</p>
        </div>
      </Link>

      <button
        type="button"
        disabled={isPendingFollow}
        onClick={handleFollow}
        className={`flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          isFollow ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {isPendingFollow ? (
          <>
            <FaSpinner size={12} className="animate-spin" />
            {isFollow ? "Following..." : "Unfollowing..."}
          </>
        ) : isFollow ? (
          <>
            <FaUserCheck size={12} />
            Following
          </>
        ) : (
          <>
            <FaUserPlus size={12} />

            Follow
          </>
        )}
      </button>
    </li>
  )
}