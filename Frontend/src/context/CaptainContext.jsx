import { useState } from "react"
import { createContext } from "react"



export const CaptainDataContext = createContext()

const CaptainContext = ({children}) => {
const [captain,setCaptain] = useState({
   fullname: {
    firstname: "",
    lastname: ""
  },
  email: "",
  password: "",
  vehicle: {
    color: "",
    plate: "",
    capacity: "",
    vehicleType: ""
  }
})
return (
   <CaptainDataContext.Provider value={{captain,setCaptain}}>
    {children}
   </CaptainDataContext.Provider>
  )
}

export default CaptainContext
