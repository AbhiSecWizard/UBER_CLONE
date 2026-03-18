import { createContext, useState } from "react"

export const UserDataContext = createContext()
const UserContext = ({children}) => {
const [user,setUser] = useState({
    email:'',
    password:'',
    fullName:{
        firstName:"",
        lastName:""
    }
})
return (
<UserDataContext.Provider value={{setUser,user}}>
        {children}
</UserDataContext.Provider>
  )
}
export default UserContext
