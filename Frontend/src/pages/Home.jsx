import { useContext } from "react"
import { Link } from "react-router-dom"
import {UserDataContext} from "../context/UserContext"


const Home = () => {

  const {user,setUser} = useContext(UserDataContext)
  console.log(user.email)
  return (
    <div className='bg-cover bg-center h-screen flex flex-col justify-between bg-[url("https://images.unsplash.com/photo-1557404763-69708cd8b9ce?q=80&w=464")]'>
      <img 
        className='w-16 ml-8 pt-5' 
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" 
      />
      {/* Bottom Section */}
      <div className='bg-white py-6 px-4'>
        <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
        <Link 
          to='/login' 
          className='flex items-center justify-center w-full bg-black text-white py-3 mt-5 rounded'
        >
          Continue
        </Link>
      </div>

    </div>
  )
}

export default Home