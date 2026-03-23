import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const UserLogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const token = localStorage.getItem("token")   

        // agar token nahi hai → direct redirect
        if (!token) {
          navigate("/login")
          return
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/logout`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (res.status === 200) {
          localStorage.removeItem("token")
          navigate("/login")
        }
      } catch (error) {
        console.error("Logout error:", error)

        // even if API fails → logout locally
        localStorage.removeItem("token")
        navigate("/login")
      }
    }

    logoutUser()
  }, [navigate])

  return (
    <div className="flex justify-center items-center h-screen text-xl font-bold">
      Logging out...
    </div>
  )
}

export default UserLogout