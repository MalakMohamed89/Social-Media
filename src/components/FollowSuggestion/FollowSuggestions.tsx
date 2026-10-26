import { useInfiniteQuery} from "@tanstack/react-query"
import axios from "axios"
import type { FollowSuggestionType } from "../../Types/FollowSuggestions.type"
import FollowItem from "../FollowItem/FollowItem"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import LoaderFollowItem from "../LoaderFollowItem/LoaderFollowItem"
import ErrorFollowItem from "../Error/ErrorFollowItem"

export default function FollowSuggestions() {
const { ref, inView } = useInView({
  threshold: 0,
})


  function getFollowSuggestions(page:Number) {
    return axios.get("https://route-posts.routemisr.com/users/suggestions", {
      params:{
        page,
        limit:10
      }
      ,
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    })
  }

  const { data,isError,isLoading,error,fetchNextPage,hasNextPage,isFetchingNextPage,isFetchNextPageError,refetch} = useInfiniteQuery({
    queryKey: ["getFollowSuggestions"],
    queryFn:({pageParam})=> getFollowSuggestions(pageParam),
    initialPageParam:1,
    getNextPageParam:(lastPage)=>{
      // console.log(lastPage)
      return lastPage.data.meta.pagination.nextPage?? undefined
    }
  })

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

console.log(data)
  const folloSuggestionsData: FollowSuggestionType[] = data?.pages.flatMap((page)=>page.data.data.suggestions )?? []



  return (
    <aside className="flex w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-gray-900">Suggested for you</h2>

      </div>

      {isLoading && <LoaderFollowItem />}

      {isError && <p className="text-sm text-red-600">{error?.message}</p>}
{isError && (
  <ErrorFollowItem onRetry={() => refetch()} />
)}
      {!isLoading && !isError && folloSuggestionsData.length === 0 && (
        <p className="text-sm text-gray-400">No suggestions right now.</p>
      )}

      {/* List */}
      <ul className="flex max-h-96 flex-col gap-1 overflow-y-auto pr-1 scrollbar-thin [scrollbar-color:#DDD9F7_transparent]">
        {folloSuggestionsData.map((user: FollowSuggestionType) => (
<FollowItem user={user} key={user._id} />

        ))}
<div ref={ref} className="py-4">
  {isFetchingNextPage}
</div>


      </ul>
    </aside>
  )
}