import { useState, useContext } from "react"
import { FaArrowRightLong } from "react-icons/fa6"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { CaptainDataContext } from "../context/CaptainContext"

const CaptainSignUp = () => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [color,setColor] = useState('')
  const [plate,setPlate] = useState('')
  const [capacity,setCapacity] = useState('')
  const [vehicleType,setVehicleType] = useState('')

  const navigate = useNavigate()
  const { captain, setCaptain } = useContext(CaptainDataContext) // ✅ fixed

  // 🔥 handleChange
  function handleChange(e){
    const { name, value } = e.target

    if(name === "firstname") setFirstName(value)
    else if(name === "lastname") setLastName(value)
    else if(name === "email") setEmail(value)
    else if(name === "password") setPassword(value)
    else if(name === "color") setColor(value)
    else if(name === "plate") setPlate(value)
    else if(name === "capacity") setCapacity(value)
    else if(name === "vehicleType") setVehicleType(value)
  }

  // 🔥 Submit
  async function loginFormHandler(e){
    e.preventDefault()

    // ✅ validation (important)
    if(!vehicleType){
      alert("Please select vehicle type")
      return
    }

    const newCaptain = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: color,
        plate: plate,
        capacity: Number(capacity),
        vehicleType: vehicleType // ✅ exact match
      }
    }

    try {
      console.log("Sending:", newCaptain) // 🔥 debug

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captain/register`,
        newCaptain
      )

      if(response.status === 201){
        const data = response.data

        setCaptain(data.captain) // ✅ fixed
        localStorage.setItem("token", data.token)
        navigate("/captain-home")
      }

    } catch (err) {
      console.log(err.response?.data || err.message)
      alert(err.response?.data?.message || "Something went wrong")
    }

    // reset
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setColor('')
    setPlate('')
    setCapacity('')
    setVehicleType('')
  }

  return (
    <div className='flex flex-col min-h-screen px-6'>

      <img
        className='w-16 pt-5' 
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <FaArrowRightLong size={36} />

      <form onSubmit={loginFormHandler} className='mt-12 flex flex-col'>

        <h3 className="text-xl font-bold">Captain Name</h3>

        <div className="flex gap-4">
          <input 
            required
            name="firstname"
            value={firstName}
            onChange={handleChange}
            className="rounded pl-3 py-2 bg-gray-200 w-1/2 my-2"
            type="text"
            placeholder="First Name"
          />

          <input 
            required
            name="lastname"
            value={lastName}
            onChange={handleChange}
            className="rounded pl-3 py-2 bg-gray-200 w-1/2 my-2"
            type="text"
            placeholder="Last Name"
          />
        </div>

        <label className='text-xl font-bold'>Email</label>
        <input 
          required
          name="email"
          value={email}
          onChange={handleChange}
          className='rounded pl-3 py-2 bg-gray-200 w-full my-2'
          type="email"
          placeholder='email@example.com'
        />

        <label className='text-xl font-bold mt-3'>Password</label>
        <input 
          required
          name="password"
          value={password}
          onChange={handleChange}
          className='rounded pl-3 py-2 bg-gray-200 w-full my-2'
          type="password"
          placeholder='password'
        />

        <h3 className="font-bold mt-4">Vehicle Information</h3>

        <div className="grid grid-cols-2 gap-4">

          <input 
            required
            name="color"
            value={color}
            onChange={handleChange}
            type="text"
            placeholder="Color"
            className="rounded pl-3 py-2 bg-gray-200"
          />

          <input 
            required
            name="plate"
            value={plate}
            onChange={handleChange}
            type="text"
            placeholder="Plate"
            className="rounded pl-3 py-2 bg-gray-200"
          />

          <input 
            required
            name="capacity"
            value={capacity}
            onChange={handleChange}
            type="number"
            placeholder="Capacity"
            className="rounded pl-3 py-2 bg-gray-200"
          />

          <select 
            required
            name="vehicleType"
            value={vehicleType}
            onChange={handleChange}
            className="rounded pl-3 py-2 bg-gray-200"
          >
            <option value="" disabled>Select Vehicle</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="auto">Auto</option>
          </select>

        </div>

        <button 
          type="submit"
          className="rounded mt-4 text-xl font-bold bg-black py-3 w-full text-white"
        >
          Signup
        </button>

        <h2 className="text-center mt-3">
          Already have an account 
          <Link to="/login" className="text-blue-500 ml-1">
            Login
          </Link>
        </h2>

      </form>
    </div>
  )
}

export default CaptainSignUp