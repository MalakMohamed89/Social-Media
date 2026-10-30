import { useContext, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { FaXmark, FaImage } from 'react-icons/fa6';
import type { CommentType } from '../../Types/PostType.type';
import { UserProfileContext } from '../../context/UserProfileContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditModalComment({comment,onClose,postId}:{comment:CommentType,onClose: () => void,postId:string}) {
const [preview, setPreview] = useState(comment.image ?? "");
const textareaInput=useRef<HTMLTextAreaElement | null>(null)
const imgInput=useRef<HTMLInputElement | null>(null)
const {myProfileData}=useContext(UserProfileContext)

const Formdata=new FormData()
const query=useQueryClient()

function handleEditComment(){
  if (textareaInput.current) {
    textareaInput.current.value =comment.content;
  }
}

useEffect(()=>{
handleEditComment()
},[])

function handleImgPreview(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (file) {
    const path=URL.createObjectURL(file)
    setPreview(path);
  }
}

function handleUpdateComment(){
       const file = imgInput.current?.files?.[0]
  const content = textareaInput.current?.value.trim() ?? ""

if(!file&&!content) return

  if(content.length <= 1){
    toast.error("Comment must be more than one character")
    return
  }


if(content){
    Formdata.append("content",content)
}
if(file){
       Formdata.append("image",file) 
}
mutate()
}

function editComment(){
    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`,Formdata,{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}

const {isPending,mutate}=useMutation({
  mutationFn:editComment,
  onSuccess:(res)=>{
    toast.success(res.data.message)
query.invalidateQueries({queryKey:["getAllComments"]})

onClose()
  },
  onError:(err)=>{
    toast.error(err.message)
  }
})


return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-base font-bold text-gray-900">Edit comment</h2>
        <button
          type="button"
          onClick={onClose}
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
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-xs font-bold">
            <img
              src={myProfileData?.photo}
              alt="userPhoto"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">{myProfileData?.name}</p>
          </div>
        </div>

        {/* Text */}
        <textarea
        ref={textareaInput}
          rows={3}
          placeholder="Write a comment..."
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white"
        ></textarea>

{/* Image preview */}
{preview && (<div className="relative w-fit">


      <img
      src={preview}
      alt="comment"
      className="h-40 w-full rounded-xl object-cover"
    />


</div>



)}

{/* Add image */}
<label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
  <FaImage size={16} />
  {preview ? "Change image" : "Add image"}
  <input
     ref={imgInput}
    type="file"
    onChange={handleImgPreview}
    accept="image/*"
    className="hidden"
  />
</label>

      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          Cancel
        </button>
          <button
          onClick={()=>handleUpdateComment()}
          disabled={isPending}
            type="button"
            className="cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:bg-slate-600 bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
        {isPending?"Saving...":"Save changes"}
          </button>
      </div>
    </div>
  </div>
);
}
