import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { FaXmark, FaBell, FaCheckDouble } from "react-icons/fa6"
import { FaSpinner } from "react-icons/fa"
import type { NotificationItemType } from "../../Types/Notification.type"
import NotificationItem from "../NotificationItem/NotificationItem"
import ErrorPost from "../../components/Error/ErrorPost"
import toast from "react-hot-toast"
import { useState } from "react"

export default function NotificationsModal({onClose}:{onClose:()=>void}) {

const queryClient=useQueryClient()

const [tab,setTab]=useState<"all"|"unread">("all")

function getNotifications(){
  return axios.get(`https://route-posts.routemisr.com/notifications?page=1&limit=10`,{
    headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
  })
}

const {data,isError,isLoading,error}=useQuery({
  queryFn: getNotifications,
  queryKey:["getNotifications"]
})

const allNotifications: NotificationItemType[] = data?.data?.data?.notifications ?? []

// console.log(allNotifications)

const availableNotifications = allNotifications.filter(
  (n) => !(n.entity as { unavailable?: boolean }).unavailable
)

const notifications = tab==="unread"
  ? availableNotifications.filter((n)=>!n.isRead)
  : availableNotifications

function getUnreadCount() {
  return axios.get(`https://route-posts.routemisr.com/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  })
}

const { data: unreadData } = useQuery({
  queryFn: getUnreadCount,
  queryKey: ["unreadCount"],
})
const unreadCount = unreadData?.data?.data?.unreadCount ?? 0


function markAllNotificationAsRead(){
    return axios.patch(`https://route-posts.routemisr.com/notifications/read-all`,{},{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}


const {mutate:AllMutate,isPending:markPending}=useMutation({
    mutationFn:markAllNotificationAsRead,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["getNotifications"]})
      queryClient.invalidateQueries({queryKey:["unreadCount"]})
    },
    onError:(err)=>{
      toast.error(err.message)
    }
})


if(isError){
  return <ErrorPost message={error.message} />
}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <FaBell size={12} />
            </span>
            <h2 className="text-base font-bold text-gray-900">Notifications</h2>
            {unreadCount>0&&(
              <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount}</span>
            )}
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Tabs + mark all */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
          <div className="flex gap-1 rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={()=>setTab("all")}
              className={`cursor-pointer rounded-full px-4 py-1 text-xs font-semibold transition ${
                tab==="all" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={()=>setTab("unread")}
              className={`cursor-pointer rounded-full px-4 py-1 text-xs font-semibold transition ${
                tab==="unread" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unread
            </button>
          </div>

          <button
            type="button"
            disabled={unreadCount===0 || markPending}
            onClick={()=>AllMutate()}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            {markPending ? <FaSpinner size={11} className="animate-spin" /> : <FaCheckDouble size={11} />}
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-1 p-2">
              {Array.from({length:5}).map((_,i)=>(
                <div key={i} className="flex animate-pulse items-start gap-3 rounded-xl p-3">
                  <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200"></div>
                  <div className="flex flex-1 flex-col gap-2 pt-1">
                    <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-3 w-1/4 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length===0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-400">
                <FaBell size={22} />
              </span>
              <p className="text-sm font-semibold text-gray-700">
                {tab==="unread" ? "You're all caught up" : "No notifications yet"}
              </p>
              <p className="text-xs text-gray-500">
                {tab==="unread" ? "You have no unread notifications." : "When something happens, you'll see it here."}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1 p-2">
              {notifications.map((notification)=><NotificationItem key={notification._id} notification={notification} />)}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}