import axios from "axios"
import { useEffect, useState } from "react"
import Post from "../../components/Post/Post"
import { type PostType } from "../../Types/PostType.type"
import { useInfiniteQuery} from "@tanstack/react-query"
import Loader from "../../components/Loader/Loader"
import ErrorPost from "../../components/Error/ErrorPost"
import PostCreation from "../../components/PostCreation/PostCreation"
import FollowSuggestions from "../../components/FollowSuggestion/FollowSuggestions"
import { useInView } from "react-intersection-observer"
import toast from "react-hot-toast"
import EmptyHome from "../../components/EmptyHome/EmptyHome"


export default function Home() {
const { ref, inView } = useInView({
  threshold: 0,
})
  const [tab,setTab]=useState<"forYou"|"following">("forYou")

  function getAllPosts(  tab: "forYou" | "following",
  page: number){
    const url = tab==="following"
      ? "https://route-posts.routemisr.com/posts/feed?only=following&limit=10"
      : "https://route-posts.routemisr.com/posts"

    return axios.get(url,{
      params:{
page,
limit:10,

// spread obj to return value in param
...(tab==="following"&&{only:"following"}) ,

      }
      ,
      headers:{
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    }).then((res)=>(res.data))
  }
 
  const {data,isError,isLoading,error,fetchNextPage,hasNextPage,isFetchingNextPage,isFetchNextPageError}=useInfiniteQuery({
    queryKey:["getAllposts",tab],
    queryFn:({pageParam})=>getAllPosts(tab,pageParam),
    initialPageParam:1,
getNextPageParam:(lastPage)=>{
  return lastPage.meta.pagination.nextPage ?? undefined;
}
  })

const allPosts=data?.pages.flatMap((page)=>page.data.posts) ?? []

useEffect(() => {
  if (
    inView &&
    hasNextPage &&
    !isFetchingNextPage &&
    !isFetchNextPageError
  ) {
    fetchNextPage()
  }
}, [
  inView,
  hasNextPage,
  isFetchingNextPage,
  isFetchNextPageError,
  fetchNextPage,
])

if(isLoading){
  return <Loader />
}

if(isError){
  return <ErrorPost message={error.message} />
}

if(isFetchNextPageError){
  toast.error("Can't load posts, Something went wrong!")
}

return (
  <div className="mx-auto flex w-full max-w-5xl items-start gap-6 px-4 py-6">
    {/* Feed */}
    <div className="flex w-full min-w-0 max-w-2xl flex-1 flex-col gap-4">
      <PostCreation />

      {/* Mobile / tablet */}
      <div className="lg:hidden">
        <FollowSuggestions />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 self-start rounded-full bg-gray-100 p-1">
        <button
          type="button"
          onClick={()=>setTab("forYou")}
          className={`cursor-pointer rounded-full px-5 py-1.5 text-sm font-semibold transition ${
            tab==="forYou" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          For you
        </button>
        <button
          type="button"
          onClick={()=>setTab("following")}
          className={`cursor-pointer rounded-full px-5 py-1.5 text-sm font-semibold transition ${
            tab==="following" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Following
        </button>
      </div>

{allPosts.length === 0 ? (
  <EmptyHome
    tab={tab}
    onChangeTab={() =>
      setTab(tab === "forYou" ? "following" : "forYou")
    }
  />
) : (
  allPosts.map((post: PostType) => (
    <Post key={post._id} post={post} isPostDetails={false} />
  ))
)}

<div ref={ref} className="py-4">
  {isFetchingNextPage && <Loader />}
</div>


    </div>

    {/* Desktop sidebar */}
    <div className="sticky top-20 hidden w-80 shrink-0 lg:block">
      <FollowSuggestions />
    </div>
  </div>
)
}