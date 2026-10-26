import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type registerSchemaType } from "../../schema/registerSchema.schema";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";


export default function Register() {
const [isPassShow,setIsPassShow]=useState(false)
const [isRePassShow,setIsRePassShow]=useState(false)
const [isLoading,setIsLoading]=useState(false)
const navigate=useNavigate()
const form=useForm<registerSchemaType>({
 resolver: zodResolver(registerSchema),
defaultValues:{
  name:"",
  email:"",
  dateOfBirth:"",
  gender:"male",
  password:"",
  rePassword:"",
},
mode:"onChange",
})

const {register,handleSubmit , formState}=form;

function handleRegister(registerData:registerSchemaType){
// console.log(registerData);
setIsLoading(true)
axios.post("https://route-posts.routemisr.com/users/signup",registerData)
.then((res)=>{
// console.log(res);
  if(res.data.success){
  toast.success(res.data.message)
   navigate("/login")
  }


}
)
.catch((err)=>{
    const message = axios.isAxiosError(err)
    ? err.response?.data?.message ?? err.message
    : "Something went wrong"
  setTimeout(() => toast.error(message), 2000)
}).finally(() => {
  setTimeout(() =>   setIsLoading(false), 2000)
    });

}

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:min-h-150 md:flex-row">

      {/* Left */}
      <div className="relative flex min-h-95 flex-col justify-between overflow-hidden bg-indigo-600 p-6 font-bold sm:p-10 md:min-h-150 md:w-1/2 lg:p-12">

        <div className="absolute -right-22.5 top-30 h-80 w-80 rounded-full bg-white/15"></div>

        <div className="absolute bottom-22.5 right-17.5 h-30 w-30 rounded-full bg-[#FF6B4A]"></div>

        <div className="relative z-10 pt-4 sm:pt-8 md:pt-14">
          <h1 className="text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Pull up a chair.
            There is room for
            you.
          </h1>

          <p className="py-5 text-sm leading-6 text-gray-300 sm:text-base">
            Make a profile in under a minute, then find your friends and
            start posting.
          </p>
        </div>

        <div className="relative z-10 self-start text-sm text-gray-300 sm:text-base">
          <p>Lamma (لمّة) means a get-together.</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex w-full items-center justify-center bg-indigo-50 p-6 sm:p-10 md:w-1/2 lg:p-12">
<div className="bg-white rounded-xl w-xl p-10 shadow-xl">
<div className="py-3">
    <h2 className="text-3xl font-bold ">
    Create your account
  </h2>
  <p className="text-gray-500">It is free and takes a minute.</p>
</div>
          <form onSubmit={handleSubmit(handleRegister)} className="w-full max-w-md">

          <div className="mb-5">
            {/* Name */}
            <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-heading">
              Full name
            </label>

            <input
              type="text"
              id="first_name"
            {...register("name")}
              className={`${formState.errors.name?"focus:border-red-500 focus:ring-red-500/20":"focus:border-indigo-500 focus:ring-indigo-500/20"} block w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-heading shadow-sm outline-none transition  focus:ring-2 `}
              placeholder="John "
           
            />
{formState.errors.name?.message  && (
  <p className="text-red-600 font-bold text-xs py-2" >{formState.errors.name.message}</p>
)}

          </div>
{/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-heading">
              Email address
            </label>

            <input
              type="email"
              id="email"
         {...register("email")}
              className={`${formState.errors.email?"focus:border-red-500 focus:ring-red-500/20":"focus:border-indigo-500 focus:ring-indigo-500/20"} block w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-heading shadow-sm outline-none transition  focus:ring-2 `}
              placeholder="john.doe@company.com"
        
            />

            {formState.errors.email?.message  && (
  <p className="text-red-600 font-bold text-xs py-2">{formState.errors.email.message}</p>
)}
          </div>
          {/*Date of Birth  */}
          <div className="mb-5">
            <label htmlFor="birthDate" className="mb-2 block text-sm font-medium text-heading">
            Date of Birth
            </label>

            <input
              type="date"
              id="birthDate"
              {...register("dateOfBirth")}
              className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-heading shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="john.doe@company.com"
          
            />
                        {formState.errors.dateOfBirth?.message && (
  <p className="text-red-600 font-bold text-xs py-2">{formState.errors.dateOfBirth.message}</p>
)}
          </div>
{/* password */}
<div className="mb-5">
  <label htmlFor="password" className="mb-2 block text-sm font-medium text-heading">
    Password
  </label>

  <div className="relative">
    <input
      type={isPassShow ? "text" : "password"}
      id="password"
      {...register("password")}
      className={`${formState.errors.password ? "focus:border-red-500 focus:ring-red-500/20" : "focus:border-indigo-500 focus:ring-indigo-500/20"} block w-full rounded-xl border border-gray-200 bg-white py-3 pl-3 pr-10 text-sm text-heading shadow-sm outline-none transition focus:ring-2`}
      placeholder="•••••••••"
    />

    <button
      type="button"
      aria-label={isPassShow ? "Hide password" : "Show password"}
      onClick={() => setIsPassShow(!isPassShow)}
      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:text-indigo-600"
    >
      {isPassShow ? <FaRegEyeSlash size={14} /> : <FaEye size={14} />}
    </button>
  </div>

  {formState.errors.password?.message && (
    <p className="text-red-600 font-bold text-xs py-2">{formState.errors.password.message}</p>
  )}
</div>
{/* confirm password */}
<div className="mb-5">
  <label htmlFor="confirm_password" className="mb-2 block text-sm font-medium text-heading">
    Confirm password
  </label>

  <div className="relative">
    <input
      type={isRePassShow ? "text" : "password"}
      id="confirm_password"
      {...register("rePassword")}
      className={`${formState.errors.rePassword ? "focus:border-red-500 focus:ring-red-500/20" : "focus:border-indigo-500 focus:ring-indigo-500/20"} block w-full rounded-xl border border-gray-200 bg-white py-3 pl-3 pr-10 text-sm text-heading shadow-sm outline-none transition focus:ring-2`}
      placeholder="•••••••••"
    />

    <button
      type="button"
      aria-label={isRePassShow ? "Hide password" : "Show password"}
      onClick={() => setIsRePassShow(!isRePassShow)}
      className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-gray-400 transition hover:text-indigo-600"
    >
      {isRePassShow ? <FaRegEyeSlash size={14} /> : <FaEye size={14} />}
    </button>
  </div>

  {formState.errors.rePassword?.message && (
    <p className="text-red-600 font-bold text-xs py-2">{formState.errors.rePassword.message}</p>
  )}
</div>

{/* Gender */}
<div className="mb-6 flex items-center gap-6">

  <label className="flex items-center gap-2 text-sm text-heading">
    <input
      type="radio"
      value="male"
      {...register("gender")}
      className="h-4 w-4 accent-indigo-600"
    />
    Male
  </label>

  <label className="flex items-center gap-2 text-sm text-heading">
    <input
      type="radio"
      value="female"
      {...register("gender")}
      className="h-4 w-4 accent-indigo-600"
    />
    Female
  </label>

</div>

<button
  type="submit"
  disabled={isLoading}
  className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
>
  {isLoading && (
    <span
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden="true"
    />
  )}

  {isLoading ? "Creating Account..." : "Create Account"}
</button>

        </form>
        <p className="text-gray-700 py-3">Already have an account? <Link to={"/login"} className="font-semibold text-indigo-500 hover:text-indigo-700 duration-200 transition-all">Log in</Link></p>
</div>
      </div>


    </div>
  )
}