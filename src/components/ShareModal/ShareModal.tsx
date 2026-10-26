
import { FaXmark, FaShare } from "react-icons/fa6"
import type { PostType } from "../../Types/PostType.type";
import { timeAgo } from "../../utils/TimeAgo";
import { useContext, useRef } from "react";
import { UserProfileContext } from "../../context/UserProfileContext";
import axios from "axios";
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

type ShareModalProps={
    onClose:()=>void;
postDetails:PostType;
}

export default function ShareModal({onClose,postDetails}:ShareModalProps) {
const { myProfileData}=useContext(UserProfileContext)
const textInput=useRef<HTMLTextAreaElement>(null)
const query=useQueryClient()
const navigate=useNavigate()



function handleSharePost(){
return axios.post(`https://route-posts.routemisr.com/posts/${postDetails._id}/share`,{
  "body": textInput.current?.value ?? ""
},{
  headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
})

}

const {mutate,isPending}=useMutation({
mutationFn:handleSharePost,
onSuccess:(res)=>{
  console.log(res)
  toast.success(res.data.message)
  navigate("/home")
  query.invalidateQueries({queryKey:["getAllPosts"]})
  onClose()
},
onError:(err)=>{
  toast.error(err.message)
}
})


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <FaShare size={12} />
            </span>
            <h2 className="text-base font-bold text-gray-900">Share post</h2>
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

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-4 py-3">
          {/* Current user */}
          <div className="flex items-center gap-2.5">
            <img
              src={myProfileData?.photo}
              alt="user"
              className="h-9 w-9 rounded-full bg-gray-200 object-cover"
            />
            <p className="text-sm font-semibold text-gray-900">{myProfileData?.name}</p>
          </div>

          {/* Caption */}
          <textarea
          ref={textInput}
            rows={3}
            placeholder="Say something about this post... (optional)"
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white"
          ></textarea>

          {/* Original post preview */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
{postDetails.image&& <img
              src={postDetails.image}
              alt="post"
              className="h-32 w-full bg-gray-200 object-cover"
            />}

            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center gap-2">
                <img
                  src={postDetails.user.photo}
                  alt="author"
                  className="h-7 w-7 rounded-full bg-gray-200 object-cover"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-gray-900">{postDetails.user.name}</p>
                               <time
                                 dateTime={postDetails.createdAt}
                                 title={new Date(postDetails.createdAt).toLocaleString()}
                                 className="text-xs text-gray-400 font-semibold"
                               >
                                 {timeAgo(postDetails.createdAt)}
                               </time> 
                </div>
              </div>

     {postDetails.body&& <p className="line-clamp-2 text-sm text-gray-700">
            {postDetails.body}
              </p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
          <button
            type="button"
                onClick={onClose}
            className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
          disabled={isPending}
          onClick={()=>mutate()}
            type="button"
            className="flex cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-500 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
{isPending?<>
<FaSpinner size={14} aria-hidden="true" className="animate-spin"/>
Sharing...
</>:<>
   <FaShare size={12} />
            Share now
        
</>}
          </button>
        </div>
      </div>
    </div>
  )
}