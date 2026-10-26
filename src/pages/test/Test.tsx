import axios from "axios"
import { useState } from "react"
import Post from "../../components/Post/Post"
import { type PostType } from "../../Types/PostType.type"
import { useInfiniteQuery} from "@tanstack/react-query"
import Loader from "../../components/Loader/Loader"
import ErrorPost from "../../components/Error/ErrorPost"
import PostCreation from "../../components/PostCreation/PostCreation"
import FollowSuggestions from "../../components/FollowSuggestion/FollowSuggestions"


export default function Test() {

  const [tab,setTab]=useState<"forYou"|"following">("forYou")

  function getAllPosts(
  tab: "forYou" | "following",
  page: number
){
    const url = tab==="following"
      ? "https://route-posts.routemisr.com/posts/feed?only=following&limit=10"
      : `https://route-posts.routemisr.com/posts`

    return axios.get(url,{

params:{
page,
limit: 10,
 ...(tab === "following" && { only: "following" })
}
,
      headers:{
        Authorization: `Bearer ${localStorage.getItem("userToken")}`
      }
    })
  }
 
  const {  data,
  isError,
  isLoading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,}=useInfiniteQuery({
  queryKey: ["getAllposts", tab],

  queryFn: ({ pageParam }) => getAllPosts(tab, pageParam),
    initialPageParam: 1,
getNextPageParam: (lastPage) => {
    console.log("lastPage",lastPage)
  return lastPage.data.meta.pagination.nextPage ?? undefined;
},
  })
console.log("dataaaa",data)

const allPosts: PostType[] =
  data?.pages.flatMap((page) => page.data.data.posts) ?? [];

if(isLoading){
  return <Loader />
}

if(isError){
  return <ErrorPost message={error.message} />
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

      {allPosts?.map((post: PostType) => (
        <Post key={post._id} post={post} isPostDetails={false} />
      ))}
      {hasNextPage && (
  <button
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="rounded-xl bg-indigo-600 p-3 text-white disabled:opacity-50"
  >
    {isFetchingNextPage ? "Loading..." : "Load More"}
  </button>
)}
    </div>

    {/* Desktop sidebar */}
    <div className="sticky top-20 hidden w-80 shrink-0 lg:block">
      <FollowSuggestions />
    </div>
  </div>
)
}