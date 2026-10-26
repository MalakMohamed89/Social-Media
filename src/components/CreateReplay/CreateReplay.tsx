
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useRef, useState, type ChangeEvent } from "react"
import toast from "react-hot-toast"
import { FaSpinner, FaTimes } from "react-icons/fa"
import { FaPaperPlane, FaImage, FaXmark } from "react-icons/fa6"
import { UserProfileContext } from "../../context/UserProfileContext"
import type { CommentType } from "../../Types/PostType.type"

type CreateReplyProps = {
  comment: CommentType
  postId: string
  onClose: () => void
  commentId:string
}

export default function CreateReply({ comment, postId,onClose,commentId}: CreateReplyProps) {
const Formdata=new FormData()
const textInput=useRef<HTMLTextAreaElement >(null)
const imgInput=useRef<HTMLInputElement >(null)
const [isUploaded,setisUploaded]=useState("")
const {myProfileData}=useContext(UserProfileContext)
const query=useQueryClient()

function createReplay(){
  return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,Formdata,{
  headers:{
    Authorization:`Bearer ${localStorage.getItem("userToken")}`
  }
})
}

const {isPending,mutate}=useMutation({
mutationFn:createReplay,
onSuccess:(res)=>{
console.log(res)
toast.success(res.data.message)
 query.invalidateQueries({ queryKey: ["getAllReplaies", postId, comment._id] })
   onClose()
},
onError:(err)=>{
toast.error(err.message)
}
})
function handleCreateReplay(){
  const file = imgInput.current?.files?.[0]
    if(textInput.current?.value===""&&!file) return

    if(textInput.current?.value){
Formdata.append("content",textInput.current.value)
    }
    if(file){
Formdata.append("image",file)
    }

mutate()
}

function handleImgPereview(e:ChangeEvent<HTMLInputElement>){
    // console.log(e.target.files[0])
      const file = e.target.files?.[0]
  if (!file) return
 const path=URL.createObjectURL( file)   
 setisUploaded(path)
}

  return (
    <div className="flex items-start gap-2.5">
      {/* Avatar */}
      <img
        src={myProfileData?.photo}
        alt="user"
        className="h-8 w-8 shrink-0 rounded-full bg-gray-200 object-cover ring-2 ring-indigo-100"
      />

      <div className="min-w-0 flex-1">
        {/* Replying to */}
        <div className="mb-1.5 flex items-center justify-between gap-2 pl-1">
          <p className="text-xs text-gray-500">
            Replying to  <span className="font-semibold text-indigo-600">{comment.commentCreator.name}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel reply"
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FaXmark size={12} />
          </button>
        </div>

        {/* Input box */}
        <div className="rounded-2xl border border-indigo-100 bg-gray-50 px-3 py-2 transition focus-within:border-indigo-500 focus-within:bg-white">
          <textarea
            rows={1}
            ref={textInput}
            placeholder="Write a reply..."
            className="w-full resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
          ></textarea>

          {/* Image preview */}
{isUploaded&&<div className="relative w-fit">
  <img
    src={isUploaded}
    alt="Selected image preview"
    className="max-h-48 max-w-full rounded-xl border border-gray-200 object-cover"
  />

  <button
    type="button"
    onClick={() => {
  setisUploaded("")
  if (imgInput.current) imgInput.current.value = ""
}}
    aria-label="Remove image"
    className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
  >
    <FaTimes  size={14} aria-hidden="true" />
  </button>
</div>}


          {/* Tools */}
<div className="mt-2 flex items-center justify-between">
  <label
    htmlFor="reply-image"
    aria-label="Add image"
    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
  >
    <FaImage size={15} />
    <input
    ref={imgInput}
      id="reply-image"
      type="file"
      accept="image/*"
      className="hidden"
       onChange={handleImgPereview}
    />
  </label>

            <button
        type="submit"
        disabled={isPending}
        onClick={()=>handleCreateReplay()}
        className="flex h-8 cursor-pointer disabled:bg-slate-600  items-center gap-1.5 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

                {isPending?<>
                <FaSpinner size={14} aria-hidden="true" className="animate-spin"/>
                Creating...
                </> :<> <FaPaperPlane size={11} />
              Reply</>}

            </button>
          </div>
        </div>
      </div>
    </div>
  )
}