import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const CaptainLogout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const logoutCaptain = async () => {
      try {
        const token = localStorage.getItem("token")

        // ✅ agar token nahi hai → direct login
        if (!token) {
          navigate("/captain-login")
          return
        }

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/logout`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (res.status === 200) {
          localStorage.removeItem("token")
          navigate("/captain-login")
        }

      } catch (error) {
        console.error("Captain Logout error:", error)

        // ✅ API fail ho bhi jaye → local logout
        localStorage.removeItem("token")
        navigate("/captain-login")
      }
    }

    logoutCaptain()
  }, [navigate])

  return (
    <div className="flex justify-center items-center h-screen text-xl font-bold">
      Captain Logging out...
    </div>
  )
}

export default CaptainLogout