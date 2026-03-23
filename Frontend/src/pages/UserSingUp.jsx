import { useContext, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import { UserDataContext } from "../context/UserContext"
const UserSingUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const navigate = useNavigate()
    const {user,setUser} = useContext(UserDataContext)
 async function loginFormHandler(e){
  e.preventDefault()
  const newUser = {
  fullname: {   
    firstname: firstName,
    lastname: lastName
  },
  email: email,
  password: password
}
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`,newUser) 
  if(response.status == 200){
       const data = response.data
       setUser(data.user)
       localStorage.setItem('token',data.token)
       navigate("/home")
   }  
  setFirstName('')
  setLastName('')
  setEmail('')
  setPassword('')
}
  return (
 <div className='flex flex-col min-h-screen px-6'>
      <img
      className='w-16 pt-5' 
      src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
    <form onSubmit={loginFormHandler} className='mt-12 flex flex-col '>
     <h3 className="text-xl font-bold">What's Your Name</h3>
     <div className="flex gap-4">
          <input required onChange={(e)=>{
                   setFirstName(e.target.value)
          }} className="rounded pl-3 py-2 bg-gray-200 w-1/2 my-2" type="text" name="" value={firstName} id="" placeholder="First Name" />
          <input  onChange={(e)=>{
                   setLastName(e.target.value)
          }} 
           className="rounded pl-3 py-2 bg-gray-200 w-1/2 my-2" type="text" name="" id="" value={lastName} placeholder="Last Name"/>
     </div>

     <div>
        <label htmlFor="email" className='text-xl font-bold'>What's your Email</label>
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
     <button type="submit" className="rounded mt-3 text-xl font-bold bg-black py-3 w-full text-white">Create Account</button>
     <h2 className="text-center mt-3">Already have a account <Link to="/login" className="text-blue-500">Login here</Link></h2>
      </form>
     <p className="text-xs leading-tight mt-auto mb-6">
    By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Uber and its affiliates to the number provided
  </p>
    </div>
  )
}

export default UserSingUp

