import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const UserProtectedWrapper = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
    }
  }, [])

  return <>{children}</>
}

export default UserProtectedWrapper