
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { FaBookmark } from "react-icons/fa6"
import Loader from "../../components/Loader/Loader"
import ErrorPost from "../../components/Error/ErrorPost"
import Post from "../../components/Post/Post"
import type { PostType } from "../../Types/PostType.type"

export default function Bookmarks() {

function getAllBookmarks(){
    return axios.get(`https://route-posts.routemisr.com/users/bookmarks`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("userToken")}`
        }
    })
}

  const {data,isError,isLoading,error}=useQuery({
    queryKey:["getAllBookmarks"],
    queryFn:getAllBookmarks
  })
// console.log(data?.data.data.bookmarks)

const bookmarksData: PostType[] = data?.data?.data?.bookmarks ?? []

if(isLoading){
  return <Loader />
}

if(isError){
  return <ErrorPost message={error.message} />
}


  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6">
      {/* Header */}
      <section className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-md">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <FaBookmark size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Saved posts</h1>
            <p className="text-sm text-gray-500">Posts you bookmarked to read later</p>
          </div>
        </div>


  <span className="shrink-0 whitespace-nowrap rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-600">
    {bookmarksData.length} saved
  </span>
      </section>

{bookmarksData.length === 0 && (
  <section className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-md">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
      <FaBookmark size={26} />
    </span>
    <h2 className="text-lg font-bold text-gray-900">No saved posts yet</h2>
    <p className="max-w-xs text-sm text-gray-500">
      Tap the bookmark icon on any post to save it here and find it later.
    </p>
  </section>
)}


      {/* Saved posts */}
{bookmarksData.map((postSaved:PostType)=><Post  key={postSaved._id} post={postSaved} />)}
    </div>
  )
}