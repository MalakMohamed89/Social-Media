
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaXmark, FaHeart } from "react-icons/fa6"

import LikesSkeleton from "../Loader/LikesSkelton";
import type { LikeType } from "../../Types/LikesType.type";
import LikesError from "../Error/LikesError";

type LikesModalProps={
    onClose:()=>void;
    postId:string
}

export default function LikesModal({onClose,postId}: LikesModalProps) {

function getAllLikes(){
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}/likes?page=1&limit=20`,{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}

const {isLoading,data,isError,error}=useQuery({
    queryFn:getAllLikes,
    queryKey:["getAllLikes", postId],
})

const LikesData=data?.data.data.likes




    
if(isLoading){
    return <LikesSkeleton  />
}

if(isError){
      return <LikesError message={error.message} />
}


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
            <span className="text-sm text-gray-500">{LikesData.length}</span>
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

        {/* List */}
        <ul className="flex flex-col overflow-y-auto py-1">
          {LikesData?.map((currentLike:LikeType) => (
            <li
              key={currentLike._id}
              className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-gray-50"
            >
              <div className="relative shrink-0">
                <img
                  src={currentLike.photo}
                  alt="user"
                  className="h-11 w-11 rounded-full bg-gray-200 object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white">
                  <FaHeart size={8} />
                </span>
              </div>

              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-semibold text-gray-900">{currentLike.name}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Empty state*/}
        {LikesData.length==0&&
        <div className="flex flex-col items-center gap-2 px-4 py-10 text-gray-400">
          <FaHeart size={28} />
          <p className="text-sm">No likes yet</p>
        </div>
       }
      </div>
    </div>
  )
}