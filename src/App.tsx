
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import './App.css'
import Layout from './pages/Layout/Layout'
import Home from './pages/Home/Home'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Profile from './pages/Profile/Profile'
import ProtectedRoutes from './protectedRoutes/protectedRoutes';
import AuthContextProvider from './context/AuthContext';
import AuthProtection from './protectedRoutes/AuthProtection';
import {QueryClientProvider,QueryClient} from "@tanstack/react-query"
import PostDetails from './pages/PostDetails/PostDetails';
import NotFound from './pages/NotFound/NotFound';
import useNetworkState from './../node_modules/react-use/esm/useNetworkState';
import OfflineBanner from './components/OfflineBanner/OfflineBanner';
import UserProfileProvider from './context/UserProfileContext';
import Bookmarks from './pages/Bookmarks/Bookmarks';


function App() {
const routes=createBrowserRouter([
{path :"/" , element: <Layout />,
children :[
  {index :true, element:<ProtectedRoutes><Home /></ProtectedRoutes>},
  {path :"/home", element:<ProtectedRoutes><Home /></ProtectedRoutes>},
  {path :"/Profile", element : <ProtectedRoutes> <Profile /></ProtectedRoutes>},
    {path :"/Profile/:id", element : <ProtectedRoutes> <Profile isUserProfile  /></ProtectedRoutes>},
    {path :"/bookmarks", element : <ProtectedRoutes> <Bookmarks /></ProtectedRoutes>},
  {path :"/PostDetails/:id", element : <ProtectedRoutes> <PostDetails /></ProtectedRoutes>},
  {path :"/register", element :<AuthProtection><Register /></AuthProtection>},
  {path :"/login", element :<AuthProtection><Login /></AuthProtection>},
  {path:"*",element:<NotFound/>}
  
]}

])

const query=new QueryClient()

const {online}=useNetworkState()

  return (
<>
{!online&&<OfflineBanner />}

<div
className={!online? "pointer-events-none select-none pt-12 opacity-60" : ""}
>
    <Toaster position="top-right" />
    <QueryClientProvider client={query}>
<UserProfileProvider>
    <AuthContextProvider>
<RouterProvider router={routes} ></RouterProvider>
    </AuthContextProvider>
</UserProfileProvider>
    </QueryClientProvider>
</div>



</>
  )
}

export default App
