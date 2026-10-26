import {  useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useRef, useState, type ChangeEvent } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaRegImage,FaTimes, FaPaperPlane,FaSpinner } from "react-icons/fa"
import { UserProfileContext } from "../../context/UserProfileContext"
export default function CommentCreation({postId ,queryKey}:{postId:string,queryKey:string[]}) {
  const {myProfileData}=useContext(UserProfileContext)
const Formdata=new FormData()
const query=useQueryClient()
const [isUploaded,setisUploaded]=useState("")
const imageInputRef = useRef<HTMLInputElement>(null);

function handleImgPereview(e:ChangeEvent<HTMLInputElement>){
    // console.log(e.target.files[0])
      const file = e.target.files?.[0]
  if (!file) return
 const path=URL.createObjectURL( file)   
 setisUploaded(path)
}

const form=useForm({
    defaultValues:{content:"",
    image:"",
    }
})  

const {register,handleSubmit,reset, setValue}=form

function createComment(){
  return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`,Formdata,{
    headers : {
      Authorization :`Bearer ${localStorage.getItem("userToken")}`
    }
  })
}

const {mutate,isPending}=useMutation({
  mutationFn:createComment,
onSuccess:(res)=>{

  query.invalidateQueries({queryKey:queryKey})
  toast.success(res.data.message)
  setisUploaded("")
  reset()
},
onError:(err)=>{toast.error(err.message)}
})

// console.log(data)


function handleCreateComment(values :{content:string,image:string,}){

if(!values.content && !values.image) return

if(values.content){
Formdata.append("content",values.content)
}

if(values.image){
  Formdata.append("image",values.image[0])
}

mutate()

}

function removeImage() {
  setisUploaded("");
  setValue("image", "");

  if (imageInputRef.current) {
    imageInputRef.current.value = "";
  }
}


return (
    <form onSubmit={handleSubmit(handleCreateComment)} className="flex items-start gap-3 rounded-2xl bg-white p-4  shadow-md    ">

      {/* Current user avatar */}
      <img 
      src={myProfileData?.photo}
      alt="userPhoto"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" />
        


      <div className="flex min-w-0 flex-1 flex-col gap-3">

        {/* Text input */}
        <label htmlFor="comment-text" className="sr-only">
          Write a comment
        </label>
        <textarea
          id="comment-text"
          {...register("content")}
          rows={2}
          placeholder="Write a comment..."
          className="block w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-[#17152B] shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        {/* Image preview */}

{isUploaded&&<div className="relative w-fit">
  <img
    src={isUploaded}
    alt="Selected image preview"
    className="max-h-48 max-w-full rounded-xl border border-gray-200 object-cover"
  />

  <button
    type="button"
     onClick={removeImage}
    aria-label="Remove image"
    className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
  >
    <FaTimes size={14} aria-hidden="true" />
  </button>
</div>}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Image input */}
          <div>
            <input
            {...register("image")}
              id="comment-image"
              type="file"
              accept="image/*"
              className="peer sr-only"
                 onChange={handleImgPereview}
  ref={(e) => {
    register("image").ref(e);
    imageInputRef.current = e;
  }}

            />
            <label
              htmlFor="comment-image"
              className="flex h-11 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-gray-500 transition hover:bg-indigo-50 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500"
            >
              <FaRegImage size={18} aria-hidden="true" />
              Add photo
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
        disabled={isPending}
            className="flex h-11 cursor-pointer items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-xl bg-indigo-600 px-6 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
{isPending?<>
<FaSpinner size={14} aria-hidden="true" className="animate-spin"/>
Creating...
</> :<><FaPaperPlane size={14} aria-hidden="true" />
            Comment</>}
          </button>

        </div>
      </div>
    </form>
  )
}
