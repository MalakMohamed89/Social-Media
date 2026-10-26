
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen  pt-24 pb-10'>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
