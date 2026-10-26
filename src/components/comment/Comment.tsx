import { useContext, useState } from "react"
import {type CommentType } from "../../Types/PostType.type"
import { timeAgo } from "../../utils/TimeAgo"
import { BsThreeDots } from "react-icons/bs"
import { FaRegHeart, FaPen, FaReply, FaTrash, FaSpinner , FaStar, FaHeart} from "react-icons/fa"
import { authContext } from "../../context/AuthContext"
import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import EditModalComment from "../EditModalComment/EditModalComment"
import CreateReply from "../CreateReplay/CreateReplay"


export default function Comment({ comment,postId, isTopComment = false ,isReply = false ,parentId   }: { comment: CommentType,postId:string,  isTopComment?: boolean, isReply?: boolean,parentId?:string  }) {
  const [isOpen,setisOpen]=useState(false)
  const {userId}=useContext(authContext)
const query=useQueryClient()
const [isEditModalOpen,setIsEditModalOpen]=useState(false)
const [isLiked,setIsLiked]=useState(comment.likes?.includes(userId))
const [showReplies, setShowReplies] = useState(false)
const [createReplay,setCreateReplay]=useState(false)
// console.log(comment)
// console.log(localStorage.getItem("userToken"))
function handleDeletComment(){
  return axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,{
    headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
  })
}

const {isPending ,mutate}=useMutation({
  mutationFn:handleDeletComment,
onSuccess:(res)=>{
  toast.success(res.data.message),
    query.invalidateQueries({ queryKey: ["getPostComments"] })
    query.invalidateQueries({ queryKey: ["getAllPosts"] })
     query.invalidateQueries({ queryKey: ["getAllReplaies", postId] })
    setisOpen(false)
},
onError:(err)=>{

  toast.error(err.message)
}
})


function LikeComment(){
return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`,{},{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("userToken")}`
  }
}) }


const {mutate:likeMutate,isPending:LikesIsPending}=useMutation({
  mutationFn:LikeComment,
    onSuccess: (res) => {
    setIsLiked(res.data.data.liked)
    query.invalidateQueries({ queryKey: ["getPostComments"] })
     query.invalidateQueries({ queryKey: ["getAllPosts"] })
  },
    onError: (err) => {
    setIsLiked(false)
    toast.error(err.message)
  },
})


function handleLikeAction(){
setIsLiked(!isLiked)
likeMutate()

}

const wasLikedInitially = comment.likes?.includes(userId) ?? false
const likesCount =
  (comment.likes?.length ?? 0) + (isLiked ? 1 : 0) - (wasLikedInitially ? 1 : 0)


function getAllReplaies(){
  return axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies?page=1&limit=10`,{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("userToken")}`
  }
})
}

const {data,isError,error,isLoading, refetch }=useQuery({
queryFn:getAllReplaies,
queryKey: ["getAllReplaies", postId, comment._id],
  enabled: showReplies && !isReply,
})

const replies: CommentType[] = data?.data?.data?.replies ?? []



  return (
<div className="group flex gap-3">
  {/* Avatar */}
  <img
    src={comment.commentCreator.photo}
    alt={comment.commentCreator.name}
    className="h-10 w-10 shrink-0 rounded-full bg-gray-200 object-cover ring-2 ring-indigo-100"
  />

  <div className="min-w-0 flex-1">

    {/* Bubble */}
<div className={`rounded-2xl rounded-tl-sm border bg-linear-to-br to-white px-4 py-3 shadow-sm ${
  isTopComment ? "border-amber-200 from-amber-50" : "border-indigo-100 from-indigo-50"
}`}>
      {/* Name + date + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold wrap-break-word text-[#17152B]">
            {comment.commentCreator.name}
          </p>

              {isTopComment && (
      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
        <FaStar size={9} />
        Top comment
      </span>
    )}

          {comment.createdAt && (
            <time
              dateTime={comment.createdAt}
              title={new Date(comment.createdAt).toLocaleString()}
              className="text-[11px] font-medium text-gray-400"
            >
              {timeAgo(comment.createdAt)}
            </time>
          )}
        </div>

        {/* Three dots */}
        <div className="relative shrink-0">
{userId===comment.commentCreator._id&&    <button
          onClick={()=>setisOpen(!isOpen)}
            type="button"
            aria-label="Comment options"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-indigo-100 hover:text-indigo-600"
          >
            <BsThreeDots size={16} />
          </button>}

         {isOpen&&<div className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5">
            <button
              onClick={() => {
    setisOpen(false);
    setIsEditModalOpen(true);
  }}
     
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              <FaPen size={12} />
              Edit
            </button>

            <div className="my-1 border-t border-gray-100"></div>

            <button
            onClick={()=>mutate()}
            disabled={isPending}
              type="button"
              className="flex w-full  disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-black cursor-pointer items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
{isPending?<>
Deleting...
<FaSpinner size={13} className="animate-spin" />
</>:<>
      <FaTrash size={13} />
      Delete
</>}
            </button>
          </div>}

        {isEditModalOpen&&<EditModalComment  onClose={() => setIsEditModalOpen(false)} comment={comment} postId={postId} />}

        </div>
      </div>

      {/* Text */}
      {comment.content && (
        <p className="mt-2 text-sm leading-relaxed wrap-break-word text-gray-700">
          {comment.content}
        </p>
      )}

      {/* Image */}
      {comment.image && (
        <img
          src={comment.image}
          alt="Comment image"
          className="mt-3 max-h-64 w-full max-w-sm rounded-xl border border-indigo-100 object-cover"
        />
      )}
    </div>

    {/* Actions */}
    <div className="mt-1.5 flex items-center gap-1 pl-1">
      <button
        type="button"
        onClick={handleLikeAction}
         disabled={LikesIsPending}
        aria-label="Like comment"
          className={`${isLiked?"text-red-500 bg-red-200 disabled:opacity-60 hover:bg-red-300 ":"text-gray-500 hover:bg-indigo-50"}   flex h-11 cursor-pointer  items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold   transition `}>
         {isLiked?<>
         <FaHeart size={18} aria-hidden="true" />
         Liked
         </>:<>
         <FaRegHeart size={18} aria-hidden="true" />
                   Like
         </>} 

{ likesCount>0&& (
<span className="ml-2 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold shadow-sm">
  {likesCount}
</span>
)}

      </button>

{!isReply && (
  <button
    type="button"
    aria-label="Reply to comment"
    onClick={() => setCreateReplay(true)}
    className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
  >
    <FaReply size={12} />
    Reply
  </button>
)}



{!isReply && ((comment.repliesCount ?? 0) > 0 || isTopComment) && (
  <button
    type="button"
    onClick={() => setShowReplies(!showReplies)}
    className="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
  >
    {showReplies
      ? "Hide replies"
      : comment.repliesCount
        ? `View ${comment.repliesCount} replies`
        : "View replies"}
  </button>
)}
    </div>

{createReplay&&<CreateReply comment={comment} postId={postId} commentId={parentId ?? comment._id}  onClose={() => {
      setCreateReplay(false)
   if (!isReply) setShowReplies(true)
    }}  />}

    {/* Replies */}
    {showReplies && (
      <div className="mt-2 flex flex-col gap-3 border-l-2 border-indigo-100 pl-4">
{isLoading && (
  <div className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50/70 py-4 text-sm font-medium text-indigo-600">
    <FaSpinner size={16} className="animate-spin" />
    <span>Loading comments...</span>
  </div>
)}


    {isError && (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
        <p className="text-xs font-medium text-red-600 wrap-break-word">
          {error.message || "Couldn't load replies"}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="shrink-0 cursor-pointer rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )}


    {!isLoading && !isError && replies.length === 0 && (
  <p className="text-xs text-gray-400">No replies yet.</p>
)}

        {replies.map((reply:CommentType) => (
          <Comment key={reply._id} comment={reply} postId={postId} isReply />
        ))}
      </div>
    )}

    </div>
    

  </div>

  )
}