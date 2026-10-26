import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import toast from "react-hot-toast"
import { FaXmark, FaLock, FaEye } from "react-icons/fa6"
import { FaRegEyeSlash, FaSpinner } from "react-icons/fa"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema,type changePasswordSchemaType } from "../../schema/passwordSchema.schema" 
import { useState } from "react"

export default function EditPasswordModal({onClose}:{onClose:()=>void}) {
const [isPassShow,setIsPassShow]=useState(false)
const [isRePassShow,setIsRePassShow]=useState(false)
const [isNewPassShow,setIsNewPassShow]=useState(false)





const { register, handleSubmit, formState:{errors} } = useForm<changePasswordSchemaType>({
  resolver: zodResolver(changePasswordSchema),
  mode: "onChange",
})

function changePassword(data:{password:string,newPassword:string}){
  return axios.patch(`https://route-posts.routemisr.com/users/change-password`, data, {
    headers:{Authorization:`Bearer ${localStorage.getItem("userToken")}`}
  })
}

const {mutate:passwordMutate,isPending:passwordPending}=useMutation({
mutationFn:changePassword,
onSuccess:(res)=>{
const newToken = res.data.data?.token  
    if (newToken) localStorage.setItem("userToken", newToken)
    toast.success(res.data.message)
onClose()
},
onError:(err)=>{
    toast.error(err.message)
}
})

function handleChangePassword(values:changePasswordSchemaType){
  const { password, newPassword } = values   
  passwordMutate({ password, newPassword })
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-base font-bold text-gray-900">Change password</h2>

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
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <FaLock size={12} />
              </span>
              <p className="text-sm font-semibold text-gray-700">Change password</p>
            </div>

            {/* Current password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Current password</label>
              <div className="relative">
                <input
               type={isPassShow ? "text" : "password"}
        {...register("password")}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />


                <button
                  type="button"
                  aria-label="Show password"
                    onClick={()=>setIsPassShow(!isPassShow)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:text-indigo-600"
                >
              {isPassShow ? <FaRegEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}  
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">New password</label>
              <div className="relative">
                <input
               type={isNewPassShow ? "text" : "password"}
            {...register("newPassword")}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  aria-label="Show password"
                    onClick={()=>setIsNewPassShow(!isNewPassShow)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:text-indigo-600"
                >
              {isNewPassShow ? <FaRegEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
           
{errors.newPassword && <p className="text-xs font-medium text-red-500">{errors.newPassword.message}</p>}
   
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Confirm new password</label>
              <div className="relative">
                <input
               type={isRePassShow ? "text" : "password"}
                        {...register("confirmPassword")}
                  placeholder="Repeat new password"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-10 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
                <button
                  type="button"
                  aria-label="Show password"
                    onClick={()=>setIsRePassShow(!isRePassShow)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:text-indigo-600"
                >
              {isRePassShow ? <FaRegEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
                
              </div>
                      {errors.confirmPassword && <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}        
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
            disabled={passwordPending}
            onClick={handleSubmit(handleChangePassword)}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
  {passwordPending?
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