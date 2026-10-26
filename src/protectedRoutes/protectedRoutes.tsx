
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function protectedRoutes({children}:{children:ReactNode}) {
    // he is not login
if(!localStorage.getItem("userToken")){
return <Navigate to={"/login"} />
}
else{
    return <>{children}</>
}
}
