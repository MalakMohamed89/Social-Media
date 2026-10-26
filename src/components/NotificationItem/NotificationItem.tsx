import { FaHeart, FaComment, FaUserPlus } from "react-icons/fa6"
import type { NotificationItemType as NotificationItemType, NotificationType } from "../../Types/Notification.type"
import { timeAgo } from "../../utils/TimeAgo";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const typeConfig: Record<NotificationType, { icon: React.ReactNode; bg: string; text: string }> = {
  like_post: { icon: <FaHeart size={10} />, bg: "bg-red-500", text: "liked your post" },
  comment_post: { icon: <FaComment size={10} />, bg: "bg-indigo-600", text: "commented on your post" },
  follow_user: { icon: <FaUserPlus size={10} />, bg: "bg-green-500", text: "started following you" },
}



export default function NotificationItem({ notification }: { notification: NotificationItemType }) {
  const { actor, type, createdAt, isRead } = notification
  const config = typeConfig[type]
const [markAsRead,setMarkAsRead]=useState(isRead)

function markNotificationAsRead(){
    return axios.patch(`https://route-posts.routemisr.com/notifications/${notification._id}/read`,{},{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}


const {mutate}=useMutation({
    mutationFn:markNotificationAsRead,
    onSuccess:()=>{
//   console.log(res.data)
  setMarkAsRead(true)

    },
    onError:(err)=>{
toast.error(err.message)
    }
})








  return (
    <li
      className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-gray-50 ${
        markAsRead ? "" : "bg-indigo-50/60"
      }`}
onClick={() => { if (!markAsRead) mutate() }}
    >
      {/* Avatar + type badge */}
      <div className="relative shrink-0">
        <img
          src={actor.photo}
          alt={actor.name}
          className="h-11 w-11 rounded-full bg-gray-200 object-cover"
        />
        <span
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-white ${config.bg}`}
        >
          {config.icon}
        </span>
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-800">
          <span className="font-bold text-gray-900">{actor.name}</span> {config.text}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{timeAgo(createdAt)}</p>
      </div>

      {/* Unread dot */}
      {!markAsRead && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600"></span>}
    </li>
  )
}