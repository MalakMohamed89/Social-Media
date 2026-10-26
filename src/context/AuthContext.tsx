import  { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { jwtDecode } from "jwt-decode";
type AuthContextType={
loginUser :string | null,
setloginUser :Dispatch<SetStateAction<string|null>>,
  userId: string;
}

export const  authContext=createContext<AuthContextType>({
    loginUser:null,
    setloginUser:()=>{},
    userId:""
})
export default function AuthContextProvider({children}:{children:ReactNode}){
const [loginUser,setloginUser]=useState<string | null>(()=>localStorage.getItem("userToken"))
const [userId,setuserId]=useState("")

useEffect(()=>{
if(loginUser){
const {user}:{user:string}=jwtDecode(loginUser)
setuserId(user)
}

},[loginUser])

  return (
   <authContext.Provider value={{loginUser,setloginUser,userId}} >
    {children}
    </ authContext.Provider >  

  )

}