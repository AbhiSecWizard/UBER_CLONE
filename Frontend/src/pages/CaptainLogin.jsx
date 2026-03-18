import { useState } from "react"
import { Link } from "react-router-dom"
import { FaArrowRightLong } from "react-icons/fa6";

const CaptainLogin = () => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [userData,setUserData] = useState({})

function loginFormHandler(e){
e.preventDefault()
setUserData({
  email:email,
  password:password
})
setEmail('')
setPassword('')
}
  return (
    <div className='flex flex-col px-6'>
      <img
      className='w-16 pt-5' 
      src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
      <FaArrowRightLong size={36}/>
    <form onSubmit={loginFormHandler} className='mt-12 flex flex-col '>
     <div>
        <label htmlFor="email" className='lowercase text-xl font-bold'>What's your Email</label>
        <input required onChange={(e)=>{
           setEmail(e.target.value)
        }}  className='rounded pl-3 py-2 bg-gray-200 w-full my-2' type="email" name="" value={email} id="email" placeholder='email@example.com'/>
     </div>
     <div className='mt-4'>
        <label htmlFor="password" className='text-xl font-bold'>Password</label>
        <input required value={password} onChange={(e)=>{
           setPassword(e.target.value)
        }}  className='rounded pl-3 py-2 bg-gray-200 w-full my-2' type="password" name="" id="password" placeholder='password'/>
     </div>
     <button type="sumit" className="rounded mt-3 text-xl font-bold bg-black py-3 w-full text-white">Login</button>
     <h2 className="text-center font-bold mt-3">Join a fleet <Link to="/captain-signup" className="ml-2 text-blue-500">Register as a Captain</Link></h2>
      </form>
      <button  className="bg-yellow-600 font-bold rounded text-white py-3 mt-32">
           <Link to="/login"> Sign in as User</Link>
      </button>
    </div>
  )
}

export default CaptainLogin

