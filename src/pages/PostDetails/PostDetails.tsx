
import axios from "axios"
import { useParams } from "react-router-dom"
import Loader from "../../components/Loader/Loader"
import ErrorPost from "../../components/Error/ErrorPost"
import { useQuery } from "@tanstack/react-query"
import Post from "../../components/Post/Post"

export default function PostDetails() {
const {id}=useParams()

function getPostDetails(){
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
    })
}

  const {data,isError,isLoading,error}=useQuery({
    queryKey:["getPostDetails",id],
    queryFn:getPostDetails
  })
//   console.log(data?.data.data.post)

const singlePostData=data?.data.data.post

if(isLoading){
  return <Loader />
}

if(isError){
  return <ErrorPost message={error.message} />
}


  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-6">
    {singlePostData&&
    <Post key={singlePostData._id} post={singlePostData} isPostDetails={true} />
    }

    </div>
  )
}
