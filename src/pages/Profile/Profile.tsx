
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { FaCalendar, FaCakeCandles, FaCamera, FaLock } from "react-icons/fa6"
import EditPhotoModal from "../../components/EditPhotoModal/EditPhotoModal"
import EditPasswordModal from "../../components/EditPasswordModal/EditPasswordModal"
import ProfileSkeleton from "../../components/Loader/ProfileSkelton"
import ErrorPost from "../../components/Error/ErrorPost"

import { FaEnvelope, FaSpinner, FaUserCheck, FaUserPlus, FaVenusMars } from "react-icons/fa"
import Post from "../../components/Post/Post"
import type { PostType } from "../../Types/PostType.type"
import Loader from "../../components/Loader/Loader"
import { useContext, useEffect, useState } from "react"
import { UserProfileContext } from "../../context/UserProfileContext"
import { Link, useParams } from "react-router-dom"
import type { UserType } from "../../Types/ProfileUser.type"
import toast from "react-hot-toast"
import { useInView } from "react-intersection-observer"


export default function Profile({isUserProfile=false}:{isUserProfile?:boolean}) {
const { myProfileData, userId, isPending, isError, error }=useContext(UserProfileContext)
const { id } = useParams()

const isMyProfile = !isUserProfile || id === userId
const profileId = isMyProfile ? userId : id

const [isPhotosModalOpen,setIsPhotosModalOpen]=useState(false)
const [isPasswordModalOpen,setIsPasswordModalOpen]=useState(false)


const [isFollow, setIsFollow] = useState(false)
const { ref, inView } = useInView({
  threshold: 0,
})


const query=useQueryClient()

function getUserProfile() {
  return axios.get(`https://route-posts.routemisr.com/users/${id}/profile`, {

    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  })
}

const {
  data: userData,
  isLoading: isUserLoading,
  isError: isUserError,
  error: userError,
} = useQuery({
  queryFn: getUserProfile,
  queryKey: ["getUserProfile", id],
  enabled: !isMyProfile && !!id,
})


function getMyPosts(page:Number) {
  return axios.get(`https://route-posts.routemisr.com/users/${profileId}/posts`, {
    params:{
page,
limit:10
    },
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  })
}

// console.log(userData)



const {
  data: myPostsData,
  isLoading: isPostsLoading,
  isError: isPostsErr,
  error: errorPosts,
fetchNextPage,hasNextPage,isFetchingNextPage,isFetchNextPageError
} = useInfiniteQuery({
  queryFn:({pageParam})=> getMyPosts(pageParam),
  queryKey: ["getMyPosts", profileId],
  enabled: !!profileId,
  initialPageParam:1,
getNextPageParam: (lastPage) => {
  const { currentPage, numberOfPages } = lastPage.data.meta.pagination;

  if (currentPage < numberOfPages) {
    return currentPage + 1;
  }

  return undefined;
}
})
// console.log(myPostsData)

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



useEffect(() => {
  setIsFollow(userData?.data?.data?.isFollowing ?? false)
}, [userData])

function followOrunFollow(){
  return axios.put(`https://route-posts.routemisr.com/users/${id}/follow`, {},{
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  })
}



const {mutate,isPending:isPendingFollow}=useMutation({
  mutationFn:followOrunFollow,
  onSuccess:(res)=>{
    setIsFollow(res.data.data.following)
    query.invalidateQueries({queryKey: ["getUserProfile", id]})
 query.invalidateQueries({queryKey: ["getFollowSuggestions"]})
  },
  onError:(err)=>{
     setIsFollow(userData?.data?.data?.isFollowing ?? false) 
        toast.error(err.message)
  }
})


function handleFollow(){
 setIsFollow(!isFollow)
mutate()
}



const profileData: UserType | undefined = isMyProfile
  ? myProfileData
  : userData?.data?.data?.user
const hasError = isMyProfile ? isError : isUserError
const profileError = isMyProfile ? error : userError
const isProfileLoading = isMyProfile ? isPending : isUserLoading

if (hasError) {
  return <ErrorPost message={profileError?.message ?? "Something went wrong"} />
}

if (isProfileLoading || !profileData) {
  return <ProfileSkeleton />
}

const myProfilePosts: PostType[] = myPostsData?.pages.flatMap((page)=>page.data.data.posts) ?? []




const joinedDate = new Date(profileData.createdAt).toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
})

const birthDate = new Date(profileData.dateOfBirth).toLocaleDateString("en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
})



  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      {/* Header card */}

<section className="overflow-hidden rounded-2xl bg-white shadow-md">
{/* Cover */}
<div
  className="relative h-40 overflow-hidden bg-indigo-600 bg-cover bg-center sm:h-44"
  style={profileData.cover ? { backgroundImage: `url(${profileData.cover})` } : undefined}
>
  {!profileData.cover && (
    <>
      <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-white/15"></div>
      <div className="absolute bottom-6 right-28 h-16 w-16 rounded-full bg-orange-500"></div>
    </>
  )}
</div>

  <div className="flex flex-wrap items-end justify-between gap-5 px-6 pb-6 sm:px-8">
    <div className="flex max-w-xl flex-1 flex-col gap-3">
{/* Avatar */}
<img
  src={profileData.photo}
  alt={profileData.name}
  className="relative z-10 -mt-14 h-28 w-28 rounded-full border-4 border-white bg-gray-200 object-cover"
/>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{profileData.name}</h1>
        <p className="text-gray-500">@{profileData.username}</p>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-6">
      {/* Stats */}
      <div className="flex gap-7">
        <div>
          <p className="text-xl font-bold text-gray-900">{profileData.followersCount}</p>
          <p className="text-sm text-gray-500 pt-0.5">Followers</p>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{profileData.followingCount}</p>
          <p className="text-sm text-gray-500 pt-0.5">Following</p>
        </div>
{isMyProfile && (
  <div>
    <p className="text-xl font-bold text-gray-900">{profileData.bookmarksCount}</p>
    <Link to="/bookmarks" className="text-sm m-0 text-gray-500 hover:text-indigo-700 cursor-pointer duration-200 transition-all">
      Bookmarks
    </Link>
  </div>
)}
      </div>

{isMyProfile ? (
<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
<button
  type="button"
  onClick={()=>setIsPhotosModalOpen(true)}
  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
>
    <FaCamera size={14} />
    Edit photos
  </button>
<button
  type="button"
  onClick={()=>setIsPasswordModalOpen(true)}
  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
>
    <FaLock size={13} />
    Change password
  </button>
</div>
) : (
  <button
    type="button"
    disabled={isPendingFollow}
    onClick={handleFollow}
    className="flex h-11 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-500 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700"
  >
{isPendingFollow ? (
  <>
    <FaSpinner size={14} className="animate-spin" />
    {isFollow ? "Unfollowing..." : "Following..."}
  </>
) : isFollow ? (
  <>
    <FaUserCheck size={14} />
    Following
  </>
) : (
  <>
    <FaUserPlus size={14} />
    Follow
  </>
)}
  </button>
)}
    </div>
  </div>
</section>

{isPhotosModalOpen&&<EditPhotoModal onClose={()=>setIsPhotosModalOpen(false)} />}
{isPasswordModalOpen&&<EditPasswordModal onClose={()=>setIsPasswordModalOpen(false)} />}

      {/* Content */}
      <div className="flex flex-col items-start gap-6 md:flex-row">
        {/* About */}
        <aside className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-md md:max-w-xs">
          <h2 className="text-xl font-bold text-gray-900">About</h2>

<div className="flex items-center gap-3">
  <FaCalendar size={16} className="text-gray-400" />
  <div>
    <p className="text-xs font-semibold text-gray-500">Joined</p>
    <p className="text-gray-900">{joinedDate}</p>
  </div>
</div>

<div className="flex items-center gap-3">
  <FaCakeCandles size={16} className="text-gray-400" />
  <div>
    <p className="text-xs font-semibold text-gray-500">Birthday</p>
    <p className="text-gray-900">{birthDate}</p>
  </div>
</div>

<div className="flex items-center gap-3">
  <FaEnvelope size={16} className="text-gray-400" />
  <div>
    <p className="text-xs font-semibold text-gray-500">Email</p>
    <p className="break-all text-gray-900">{profileData.email}</p>
  </div>
</div>

<div className="flex items-center gap-3">
  <FaVenusMars size={16} className="text-gray-400" />
  <div>
    <p className="text-xs font-semibold text-gray-500">Gender</p>
    <p className="capitalize text-gray-900">{profileData.gender}</p>
  </div>
</div>
        </aside>

        {/* Posts */}
        <section className="flex w-full min-w-0 flex-1 flex-col gap-4">
     <h2 className="text-xl font-bold text-gray-900">
  {isMyProfile ? "Your posts" : `${profileData.name}'s posts`}
</h2>
  {isPostsLoading && <Loader />}

  {isPostsErr && <ErrorPost message={errorPosts.message} />}

    {!isPostsLoading && !isPostsErr && myProfilePosts.length === 0 && (
    <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-md">
      No posts yet.
    </div>
  )}


{myProfilePosts.map((currentPost:PostType)=><Post key={currentPost._id}  post={currentPost} />)}
<div ref={ref} className="py-4">
  {isFetchingNextPage && <Loader />}
</div>
        </section>
      </div>
    </div>
  )
}