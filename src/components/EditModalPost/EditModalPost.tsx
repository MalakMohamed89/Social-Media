
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import toast from "react-hot-toast";
import { FaXmark, FaImage } from "react-icons/fa6"
import { useNavigate } from "react-router-dom";


type EditModalPostProps = {
  onClose: () => void;
  postBody:string;
  postImg:string;
  userPostName:string;
  userPostPhoto:string;
  postId:string;
};

export default function EditPostModal({
  onClose,
  postBody,
  postImg,
  userPostName,
  userPostPhoto,
  postId
}: EditModalPostProps) {
const [isUploaded,setIsUploaded]=useState(postImg)  
const textareaInput=useRef<HTMLTextAreaElement | null>(null)
const imgInput=useRef<HTMLInputElement | null>(null)
const Formdata=new FormData()
const query=useQueryClient()
const navigate=useNavigate()

// console.log(localStorage.getItem("userToken"))
// console.log(postId)

function handleEditPost(){
  if (textareaInput.current) {
    textareaInput.current.value = postBody;
  }
}
useEffect(()=>{
handleEditPost()
},[])

function handleImgPreviewEdit(e:ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];
if(file){
    const path=URL.createObjectURL(file)
setIsUploaded(path)
}}


function handleUpdatePost(){
   const file = imgInput.current?.files?.[0]

if(!textareaInput.current?.value&&!file) return
if(textareaInput.current?.value){
  Formdata.append("body",textareaInput.current.value)
}
if(file){
    Formdata.append("image",file)
}
mutate()
}

function EditePost(){
  return axios.put(`https://route-posts.routemisr.com/posts/${postId}`,Formdata,{
    headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
  })
}

const {isPending,mutate}=useMutation({
  mutationFn:EditePost,
  onSuccess:(res)=>{
    toast.success(res.data.message)
query.invalidateQueries({queryKey:["getAllPosts"]})
navigate("/home")
onClose()
  },
  onError:(err)=>{
    toast.error(err.message)
  }
})

function removeImage() {
  setIsUploaded("");
  if (imgInput.current) {
    imgInput.current.value = "";
  }
}


  return (
<>
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-bold text-gray-900">Edit post</h2>
          <button
          onClick={onClose}
            type="button"
            aria-label="Close"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
          >
            <FaXmark size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 overflow-y-auto px-4 py-3">
          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full  text-xs font-bold ">
            <img src={userPostPhoto}
            alt="userPhoto"
            />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-gray-900">{userPostName}</p>
            </div>
          </div>

          {/* Text */}
          <textarea
            rows={3}
            ref={textareaInput}
            placeholder="What's on your mind?"
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white"
          ></textarea>

          {/* Image preview */}
{isUploaded&& <div className="relative w-fit">
            <img
              src={isUploaded}
              alt="post"
              className="h-40 w-full rounded-xl object-cover"
            />

              <button
    type="button"
     onClick={removeImage}
    aria-label="Remove image"
    className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900/70 text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
  ></button>

          </div>}

          {/* Change image */}
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
            <FaImage size={16} />
            Change image
            <input type="file" ref={imgInput} onChange={handleImgPreviewEdit}  accept="image/*" className="hidden" />
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
          <button
           onClick={onClose}
            type="button"
            className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
          onClick={()=>handleUpdatePost()}
          disabled={isPending}
            type="button"
            className="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-slate-600 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
        {isPending?"Saving...":"Save changes"}
          </button>
        </div>
      </div>
    </div>
</>
  )
}