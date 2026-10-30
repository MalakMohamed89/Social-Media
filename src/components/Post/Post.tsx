
import { FaRegHeart,FaSpinner,FaHeart ,FaRegComment, FaShare, FaBookmark, FaRegBookmark, FaPen, FaTrash } from "react-icons/fa"
import { BsThreeDots } from "react-icons/bs";
import {type CommentType, type PostType } from '../../Types/PostType.type' 
import Comment from '../comment/Comment'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useInfiniteQuery, useMutation,useQueryClient } from "@tanstack/react-query"
import CommentCreation from "../CommentCreation/CommentCreation"
import { timeAgo } from "../../utils/TimeAgo"
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import EditModalPost from './../EditModalPost/EditModalPost';
import LikesModal from "../LikesModal/LikesModal";
import ShareModal from "../ShareModal/ShareModal";
import SharedPost from "../SharedPost/SharedPost";
import { useInView } from "react-intersection-observer"
import LoaderComment from "../LoaderComment/LoaderComment";
import ErrorPost from "../../components/Error/ErrorPost"

export default function Post({ post ,isPostDetails=false }: { post: PostType,isPostDetails?:boolean }) {

const [isEditModalPostOpen,setisEditModalPostOpen]=useState(false)
const [isLikesModalOpen,setisLikesModalOpen]=useState(false)
const [isOpen,setisOpen]=useState(false)
const {userId}=useContext(authContext)
const query=useQueryClient()
const navigate=useNavigate()
const [isLiked,setIsLiked]=useState(post.likes?.includes(userId))
const [isSaved,setIsSaved]=useState(post.bookmarked )
const [isShareModalOpen,setisShareModalOpen]=useState(false)
const { ref, inView } = useInView({
  threshold: 0,
})
function getPostComments(page:Number){
  return axios.get(`https://route-posts.routemisr.com/posts/${post._id}/comments`,{
    params:{
page,
limit:10
    },
    headers:{
      Authorization:`Bearer ${localStorage.getItem("userToken")}`
    }
  })
}
  const {data,isError,isLoading,error,fetchNextPage,hasNextPage,isFetchingNextPage,isFetchNextPageError}=useInfiniteQuery({
    queryKey:["getPostComments"],
    queryFn:({pageParam})=>getPostComments(pageParam),
    initialPageParam:1,
getNextPageParam: (lastPage) => {
  const { currentPage, numberOfPages } = lastPage.data.meta.pagination;

  if (currentPage < numberOfPages) {
    return currentPage + 1;
  }

  return undefined;
}
    ,
    enabled:isPostDetails,
  })
// console.log(data?.pages)

const PostComments=data?.pages.flatMap((page)=>page.data.data.comments)

useEffect(()=>{
if(inView&&hasNextPage&&!isFetchNextPageError&&!isFetchingNextPage){
  fetchNextPage()
}

},[inView,hasNextPage,isFetchNextPageError,isFetchingNextPage])

// console.log(post.topComment)

function handleDeletePost(){
return axios.delete(`https://route-posts.routemisr.com/posts/${post.id}`,{
  headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
})
}

const {isPending,mutate}=useMutation({
mutationFn:handleDeletePost,
onSuccess:(res)=>{
  toast.success(res.data.message),
  query.invalidateQueries({queryKey:["getAllposts"]})
  navigate("/home")
},
onError:(err)=>{
  toast.error(err.message)
}

})


function LikePost(){
return axios.put(`https://route-posts.routemisr.com/posts/${post._id}/like`,{},{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("userToken")}`
  }
}) }
  
const {mutate:likeMutate,isPending:LikesIsPending}=useMutation({
  mutationFn:LikePost,
    onSuccess: (res) => {
    setIsLiked(res.data.data.liked)
    query.invalidateQueries({ queryKey: ["getAllPosts"] })
    query.invalidateQueries({ queryKey: ["getMyPosts"] })
    query.invalidateQueries({ queryKey: ["getAllLikes", post._id] })
    query.invalidateQueries({ queryKey: ["getPostDetails", post._id] })
  },
    onError: (err) => {
    setIsLiked(post.likes?.includes(userId) ?? false)
  query.invalidateQueries({ queryKey: ["getAllPosts"] })
    toast.error(err.message)
  },
})


function handleLikeAction(){
setIsLiked(!isLiked)
likeMutate()

}

function SavePost(){
return axios.put(`https://route-posts.routemisr.com/posts/${post._id}/bookmark`,{},{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("userToken")}`
  }
}) }


const {mutate:SaveMutate,isPending:SaveIsPending}=useMutation({
  mutationFn:SavePost,
    onSuccess: (res) => {
 console.log(res)
 setIsSaved(res.data.data.bookmarked)
    query.invalidateQueries({ queryKey: ["getAllPosts"] })
    query.invalidateQueries({ queryKey: ["getMyPosts"] })
    query.invalidateQueries({ queryKey: ["getPostDetails", post._id] })
    query.invalidateQueries({ queryKey: ["getAllBookmarks"] })
  },
    onError: (err) => {
   
  query.invalidateQueries({ queryKey: ["getAllPosts"] })
    toast.error(err.message)
  },
})


function handleBookmarkAction(){
setIsSaved(!isSaved)
SaveMutate()
}

const wasLikedInitially = post.likes?.includes(userId) ?? false
const likesCount =
  (post.likesCount ?? 0) + (isLiked ? 1 : 0) - (wasLikedInitially ? 1 : 0)

if(isLoading){
  return <LoaderComment />
}
if(isError){
  return <ErrorPost message={error.message} />
}
if(isFetchNextPageError){
  toast.error("Can't load Comments, Something went wrong!")
}

  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-md">

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
<div className="flex items-center gap-3">
          <img
          src={post.user.photo}
          alt={post.user.name}
          className="h-12 w-12 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
<Link to={`/profile/${post.user._id}`} >
          <div className="font-semibold text-[#17152B] hover:text-indigo-600 duration-200 transition-all cursor-pointer">
            {post.user.name}
            </div>
</Link>
          <div  className="flex items-center justify-between">

  <div>
              <time
                dateTime={post.createdAt}
                title={new Date(post.createdAt).toLocaleString()}
                className="text-xs text-gray-400 font-semibold"
              >
                {timeAgo(post.createdAt)}
              </time> 
  </div>
          </div>
        </div>
</div>
{/* Edit,Delete tools */}
<div className="relative">

{userId === post.user._id && (

  <BsThreeDots
    onClick={() => setisOpen(!isOpen)}
    size={20}
    className="cursor-pointer text-gray-500 hover:text-indigo-600 duration-300 transition-all"
  />

)}

{isOpen&&<div className="absolute right-0 top-7 z-30 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
    <button
  onClick={() => {
    setisOpen(false);
    setisEditModalPostOpen(true);
  }}
      type="button"
      className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
    >
      <FaPen size={13} className="text-gray-500" />
      Edit
    </button>

    <div className="my-1 border-t border-gray-100"></div>

    <button 
    onClick={()=>mutate()}
    disabled={isPending}
      type="button"
      className="flex w-full cursor-pointer items-center disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-black gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
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
</div>
      </div>
{/* Edit modal */}
{isEditModalPostOpen && (
  <EditModalPost
    onClose={() => setisEditModalPostOpen(false)} postBody={post.body} postImg={post.image} userPostName={post.user.name} userPostPhoto={post.user.photo} postId={post._id}
  />
)}
      {/* Body */}
      {post.body && (
        <p className="text-base leading-relaxed text-[#17152B] wrap-break-word">{post.body}</p>
      )}

      {/* Shared post */}
      <SharedPost sharedPost={post.sharedPost} isShare={post.isShare} />

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post image"
          className="max-h-120 w-full rounded-xl object-cover"
        />
      )}

      {/* Counts */}
      <div className="flex gap-4 text-sm text-gray-500">
        <span className="cursor-pointer hover:text-gray-800 duration-200 transition-all" onClick={() => setisLikesModalOpen(true)}>
          {likesCount} likes
        </span>
        <span>{post.commentsCount} comments</span>
        <span>{post.sharesCount} shares</span>
      </div>
{isLikesModalOpen && (<LikesModal postId={post._id} onClose={()=>setisLikesModalOpen(false) }/>)}
      {/* Actions */}
      <div className="flex items-center gap-1 border-t border-[#DDD9F7] pt-2">

        {/* Like */}
        <button
        onClick={()=>handleLikeAction()}
        disabled={LikesIsPending}
          type="button"
          aria-label="Like"
          className={`${isLiked?"text-red-500 bg-red-200 disabled:opacity-60 hover:bg-red-300 ":"text-gray-500 hover:bg-indigo-50"}  flex h-11 cursor-pointer  items-center gap-2 rounded-xl px-3.5 text-sm font-medium  transition `}
        >
         {isLiked?<>
         <FaHeart size={18} aria-hidden="true" />
         Liked
         </>:<>
         <FaRegHeart size={18} aria-hidden="true" />
                   Like
         </>} 
        </button>

        {/* Comment */}
        <Link to={`/postDetails/${post._id}`}
          type="button"
          aria-label="Comment"
          className="flex h-11 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-gray-500 transition hover:bg-indigo-50"
        >
          <FaRegComment size={18} aria-hidden="true" />
          Comment
        </Link>

        {/* Share */}
        <button
          type="button"
          onClick={()=>setisShareModalOpen(true)}
          aria-label="Share"
          className="flex h-11 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-gray-500 transition hover:bg-indigo-50"
        >
          <FaShare size={18} aria-hidden="true" />
          Share
        </button>

{isShareModalOpen&&<ShareModal onClose={()=>setisShareModalOpen(false)} postDetails={post}  />}

        {/* Bookmark */}
        <button
          type="button"
          disabled={SaveIsPending}
          onClick={handleBookmarkAction}
          aria-label={post.bookmarked ? "Remove bookmark" : "Bookmark"}
          className={`ml-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl disabled:opacity-60  transition hover:bg-indigo-50 ${
            isSaved ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          {isSaved ? (
            <FaBookmark size={18} aria-hidden="true" />
          ) : (
            <FaRegBookmark size={18} aria-hidden="true" />
          )}
        </button>
      </div>


      {/* Top comment */}
      {post.topComment && (
<Comment isTopComment comment={post.topComment} postId={post._id} />
      )}

{/* All comments */}
{isPostDetails&&PostComments&&PostComments.map((comment:CommentType)=>{
 return <Comment postId={post._id} comment={comment} key={comment._id} />
})}

<div ref={ref} className="py-4">
  {isFetchingNextPage && <LoaderComment />}
</div>

{/* Create Comment */}

      {isPostDetails && (
        <div className="sticky bottom-0 z-10 bg-white pt-3">
          <CommentCreation postId={post._id}  queryKey={isPostDetails? ["getPostComments"] :["getAllPosts"]} />
        </div>
      )}

    </article>
  )
}
