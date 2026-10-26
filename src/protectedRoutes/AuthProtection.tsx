
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

export default function AuthProtection({children}:{children:ReactNode}) {
    // if he logged in
if(localStorage.getItem("userToken")){
    return <Navigate to={"/home"} />
}
else{
return <>{children}</>
}
}
