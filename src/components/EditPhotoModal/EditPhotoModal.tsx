import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useContext, useRef, useState } from "react"
import toast from "react-hot-toast"
import { FaXmark, FaCamera } from "react-icons/fa6"
import { UserProfileContext } from "../../context/UserProfileContext"
import { FaSpinner } from "react-icons/fa"

export default function EditPhotoModal({onClose}:{onClose:()=>void}) {

const { myProfileData}=useContext(UserProfileContext)
const imgeInput=useRef<HTMLInputElement >(null)
const  coverInput=useRef<HTMLInputElement >(null)
const [isUpload,setIsUpload]=useState(myProfileData?.photo)
const [isUploadCover,setIsUploadCover]=useState(myProfileData?.cover)

function uploadPhoto(file:File){
    const fd=new FormData()
    fd.append("photo",file)
    return axios.put(`https://route-posts.routemisr.com/users/upload-photo`,fd,{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}

function uploadCover(file:File){
    const fd=new FormData()
    fd.append("cover",file)
    return axios.put(`https://route-posts.routemisr.com/users/upload-cover`,fd,{
        headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
    })
}

const {mutate,isPending}=useMutation({
mutationFn:uploadPhoto,
onSuccess:(res)=>{
  setIsUpload(res.data.data.photo)
toast.success(res.data.message)
onClose()
},
onError:(err)=>{
    toast.error(err.message)
}
})

const {mutate:mutateCover,isPending:coverPending}=useMutation({
mutationFn:uploadCover,
onSuccess:(res)=>{
  setIsUploadCover(res.data.data.cover)
toast.success(res.data.message)
onClose()
},
onError:(err)=>{
    toast.error(err.message)
}
})

function handleUpdatePhoto(){ 
  const imgFile=imgeInput.current?.files?.[0]
  const coverFile=coverInput.current?.files?.[0]

  if(imgFile) mutate(imgFile)
  if(coverFile) mutateCover(coverFile)
}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-bold text-gray-900">Edit photos</h2>

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
        <div className="flex flex-col gap-5 overflow-y-auto px-4 py-4">
          <section className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700">Photos</p>

            <div className="relative mb-10">
{/* Cover */}
<div
  className="relative h-32 overflow-hidden rounded-xl bg-indigo-600 bg-cover bg-center sm:h-44"
  style={isUploadCover ? { backgroundImage: `url(${isUploadCover})` } : undefined}
>
  {!isUploadCover && (
    <>
      <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full bg-white/15"></div>
      <div className="absolute bottom-6 right-28 h-16 w-16 rounded-full bg-orange-500"></div>
    </>
  )}

                <label
                  aria-label="Change cover"
                  className="absolute right-2 top-2 flex h-8 cursor-pointer items-center gap-1.5 rounded-full bg-gray-900/70 px-3 text-xs font-semibold text-white transition hover:bg-gray-900"
                >
            {coverPending?<>
            <FaSpinner size={12} className="animate-spin"  />
            Changing...
            </>:<>
                  <FaCamera size={12} />
                  Change cover
            </>}
  <input type="file" disabled={coverPending} ref={coverInput}   
   onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) setIsUploadCover(URL.createObjectURL(file))
  }} 
accept="image/*" className="hidden" />
                </label> 
</div>

              {/* Avatar */}
              <div className="absolute -bottom-9 left-4">
                <img
                  src={isUpload}
                  alt="profile"
                  className="h-20 w-20 rounded-full border-4 border-white bg-gray-200 object-cover"
                />
                <label
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white transition hover:bg-indigo-700"
                >
                  <FaCamera size={11} />
                  <input type="file" ref={imgeInput} 
                     onChange={(e) => {
    const file = e.target.files?.[0]
    if (file) setIsUpload(URL.createObjectURL(file))
  }} 
                  accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </section>
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
            type="button"
            disabled={isPending}
            onClick={handleUpdatePhoto}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
  {(isPending || coverPending)?
    <>
    Saving...
    <FaSpinner className="animate-spin"  size={14} />
    </>
    :
    <>
    Save changes
    </>
  }
          </button>
        </div>
      </div>
    </div>
  )
}