import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/lamma-circles.svg"
import {  useContext, useState } from "react";
import { authContext } from "../../context/AuthContext";
import NotificationsModal from "../NotificationModal/NotificationModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaBell, FaBookmark } from "react-icons/fa6";
export default function Navbar() {
  const [isModalOpen,setIsModalOpen]=useState(false)
const {loginUser,setloginUser}=useContext(authContext)
const [isNotificationOpen,setIsNotificationOpen]=useState(false)


const navigate=useNavigate()


function getUnreadCount() {
  return axios.get(`https://route-posts.routemisr.com/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
  })
}

const { data } = useQuery({
  queryFn: getUnreadCount,
  queryKey: ["unreadCount"],
  refetchInterval: 30000, 
})

const unreadCount = data?.data?.data?.unreadCount ?? 0

function handleLogout(){
localStorage.removeItem("userToken")
setloginUser(null)
navigate("/login")

}

  return (

<nav className="bg-white fixed w-full z-20 top-0 inset-s-0 border-b border-[#DDD9F7] border-default">
  <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">

    {/* Logo */}
    <Link to="/home" className="flex items-center space-x-3">
      <img src={logo} className="h-7" alt="Logo" />
      <span className="text-xl font-bold">Lamma</span>
    </Link>

    {/* Menu button */}
    <button
      onClick={() => setIsModalOpen(!isModalOpen)}
      type="button"
      className="inline-flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl text-[#5B45D6] hover:bg-[#F0EDFF] transition md:hidden"
      aria-label={isModalOpen ? "Close menu" : "Open menu"}
      aria-controls="navbar-sticky"
      aria-expanded={isModalOpen}
    >
      {isModalOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </button>

    {/* Navigation links */}
    <div
      id="navbar-sticky"
      className={`
        ${isModalOpen ? "flex" : "hidden"}
        absolute left-4 right-4 top-18
        flex-col rounded-2xl border border-[#DDD9F7]
        bg-white p-4 shadow-xl
        md:static md:flex md:w-auto md:flex-row
        md:border-0 md:bg-transparent md:p-0 md:shadow-none
      `}
    >
      <ul className={ `flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center md:gap-8`}>
{loginUser?<>
        <li className={`px-4 py-2 duration-300 transition-all rounded-xl hover:bg-indigo-200 hover:text-indigo-600`} >
          <Link to="/home" onClick={() => setIsModalOpen(false)}>
            Home
          </Link>
        </li>

  <li className={`px-4 py-2 duration-300 transition-all rounded-xl hover:bg-indigo-200 hover:text-indigo-600`} >
          <Link to="/Profile" onClick={() => setIsModalOpen(false)}>
            Profile
          </Link>
        </li>
  <li className={`px-4 py-2 flex items-center gap-2 cursor-pointer duration-300 transition-all rounded-xl hover:bg-indigo-200 hover:text-indigo-600`} >
          <Link to="/bookmarks" onClick={() => setIsModalOpen(false)}>
            <FaBookmark />
          </Link>
            <span className="md:hidden">Saved Posts</span>
        </li>


          <li className={`px-4 py-2 duration-300 transition-all  rounded-xl hover:bg-indigo-200 hover:text-indigo-600`} >
<button
  className="relative flex cursor-pointer items-center gap-2"
  onClick={() => {
    setIsModalOpen(false)
    setIsNotificationOpen(!isNotificationOpen)
  }}
>
  <span className="relative">
    <FaBell  size={18} />
    {unreadCount > 0 && (
      <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
        {unreadCount > 99 ? "99+" : unreadCount}
      </span>
    )}
  </span>
  <span className="md:hidden">Notifications</span>
</button>
        </li>
                <li onClick={() => setIsModalOpen(false)} >
          <button  className="cursor-pointer w-full t block rounded-xl bg-indigo-600 px-4 py-2 text-center text-white hover:-translate-y-1.5 transition-all duration-300"  onClick={() => handleLogout()}>
         Logout
          </button>
        </li>
        </>:<>
        
        <li  className={`px-4 py-2 duration-300 transition-all rounded-xl hover:bg-indigo-200 hover:text-indigo-600`} >
          <Link to={"/login"} onClick={() => setIsModalOpen(false)}>
            Login
          </Link>
        </li>

        <li >
          <Link
            to="/register"
            onClick={() => setIsModalOpen(false)}
            className="block rounded-xl bg-indigo-600 px-4 py-2 text-center text-white hover:-translate-y-1.5 transition-all duration-300"
          >
            Register
          </Link>
        </li>
        </>}

      </ul>

  {isNotificationOpen&&<NotificationsModal onClose={()=>setIsNotificationOpen(false)}  />}
    
    </div>

  </div>
</nav>

  )
}
