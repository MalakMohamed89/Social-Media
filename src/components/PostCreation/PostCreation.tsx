import { useContext, useRef, useState } from "react"
import { FaRegImage, FaPaperPlane, FaTimes, FaSpinner  } from "react-icons/fa"
import type { ChangeEvent } from "react"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { UserProfileContext } from "../../context/UserProfileContext"
export default function PostCreation() {
const {myProfileData}=useContext(UserProfileContext)
const [isUploaded,setisUploaded]=useState("")
const Formdata=new FormData()
const query=useQueryClient()

const textInput=useRef<HTMLTextAreaElement >(null)
const imgInput=useRef<HTMLInputElement >(null)

function handleImgPereview(e:ChangeEvent<HTMLInputElement>){
    // console.log(e.target.files[0])
      const file = e.target.files?.[0]
  if (!file) return
 const path=URL.createObjectURL( file)   
 setisUploaded(path)
}
function clear(){
  if (textInput.current) textInput.current.value = ""
  if (imgInput.current) imgInput.current.value = ""
  setisUploaded("")
}

function createPost(){
    return axios.post(`https://route-posts.routemisr.com/posts`,Formdata,{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}

const {isPending,mutate}=useMutation({
    mutationFn:createPost,
    onSuccess:(res)=>{
toast.success(res.data.message)
query.invalidateQueries({queryKey:["getAllposts"]})
clear()
    },
    onError:(err)=>{toast.error(err.message)}
})

function handleCreatePost(){
  const file = imgInput.current?.files?.[0]
    if(textInput.current?.value===""&&!file) return

    if(textInput.current?.value){
Formdata.append("body",textInput.current.value)
    }
    if(file){
Formdata.append("image",file)
    }


mutate()

}
function cancleImg(){
  setisUploaded("")
if(imgInput.current?.value){
imgInput.current.value="";
}
}


return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">

      {/* Header: avatar + privacy */}
      <div className="flex items-center gap-3">
        <img className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full  font-bold text-white"
        src={myProfileData?.photo}
        alt="userPhoto"
        />
          
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-[#17152B]">{myProfileData?.name}</div>
        </div>
      </div>

      {/* Text input */}
      <label htmlFor="post-body" className="sr-only">
        What is on your mind?
      </label>
      <textarea
      ref={textInput}
        id="post-body"
        rows={4}
        placeholder="What is on your mind?"
        className="block w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-base text-[#17152B] shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />

{/* imgPreview */}
{isUploaded&&<div className="relative w-fit">
  <img
    src={isUploaded}
    alt="Selected image preview"
    className="max-h-48 max-w-full rounded-xl border border-gray-200 object-cover"
  />

  <button
    type="button"
    aria-label="Remove image"
    className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
  >
    <FaTimes onClick={()=>cancleImg()} size={14} aria-hidden="true" />
  </button>
</div>}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#DDD9F7] pt-3">

        {/* Image input */}
        <div>
          <input
          ref={imgInput}
            id="post-image"
            type="file"
            accept="image/*"
            className="peer sr-only"
            onChange={handleImgPereview}
          />
          <label
            htmlFor="post-image"
            className="flex h-11 cursor-pointer items-center gap-2 rounded-xl px-3.5 text-sm font-medium text-gray-500 transition hover:bg-indigo-50 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500"
          >
            <FaRegImage size={18} aria-hidden="true" />
            Add photo
          </label>
        </div>

        {/* Submit */}
        <button
        disabled={isPending}
        onClick={()=>handleCreatePost()}
          type="button"
          className="flex disabled:bg-slate-600 disabled:cursor-not-allowed h-11 cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
{isPending?<>
<FaSpinner size={14} aria-hidden="true" className="animate-spin"/>
Creating...
</> :<>          <FaPaperPlane size={14} aria-hidden="true" />
          Post</>}
        </button>

      </div>
    </div>
  )
}