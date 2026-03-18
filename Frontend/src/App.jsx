import { Route, Routes } from "react-router-dom"
import UserLogin from "./pages/UserLogin"
import UserSingUp from "./pages/UserSingUp"
import CaptainLogin from "./pages/CaptainLogin"
import CaptainSignUp from "./pages/CaptainSignUp"
import Home from "./pages/Home"


const App = () => {
  return (    
  <div>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<UserLogin/>}/>
      <Route path="/signup" element={<UserSingUp/>}/>
      <Route path="/captain-login" element={<CaptainLogin/>}/>
      <Route path="/captain-signup" element={<CaptainSignUp/>}/>
     </Routes>
  </div>
  )
}
export default App
