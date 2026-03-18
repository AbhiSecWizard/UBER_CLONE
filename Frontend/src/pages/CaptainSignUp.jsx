import { useState } from "react"
import { FaArrowRightLong } from "react-icons/fa6"
import { Link } from "react-router-dom"

const CaptainSignUp = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [userData,setUserData] = useState({})
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
  function loginFormHandler(e){
  e.preventDefault()
  setUserData({
    fullName:{
      firstName:firstName,
      lastName:lastName
    },
    email:email,
    password:password

  })
  setFirstName('')
  setLastName('')
  setEmail('')
  setPassword('')
}
console.log(userData)
return (
 <div className='flex flex-col min-h-screen px-6'>
      <img
      className='w-16 pt-5' 
      src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
       <FaArrowRightLong size={36} />
    <form onSubmit={loginFormHandler} className='mt-12 flex flex-col '>
     <h3 className="text-xl font-bold">What's our Captain's Name</h3>
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
        <label htmlFor="email" className='text-xl font-bold'>What's our Captain's Email</label>
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
     <button type="sumit" className="rounded mt-3 text-xl font-bold bg-black py-3 w-full text-white">Signup</button>
     <h2 className="text-center mt-3">Already have a account <Link to="/login" className="text-blue-500">Login here</Link></h2>
      </form>
     <p className="text-xs leading-tight mt-auto mb-6">
      This site is protected by <span className="underline">reCAPTCHA</span> and the Google <span  className="underline">Privacy Policy</span> and <span>Terms of Service apply</span>.
     </p>
    </div>


)}

export default CaptainSignUp

