import { Route, Routes } from "react-router-dom"
import UserLogin from "./pages/UserLogin"
import UserSingUp from "./pages/UserSingUp"
import CaptainLogin from "./pages/CaptainLogin"
import CaptainSignUp from "./pages/CaptainSignUp"
import Start from "./pages/Start"
import Home from "./pages/Home"
import UserProtectedWrapper from "./pages/UserProtectedWrapper"
import UserLogout from "./pages/UserLogout"
import CaptainLogout from "./pages/CaptainLogout"
import CaptainProtectRoute from "./pages/CaptainProtectWrapper"
import Riding from "./pages/Riding"
import CaptainHome from "./pages/CaptainHome"
import CaptainRiding from "./pages/CaptainRiding"
import FinishRide from "./pages/FinishRide"

const App = () => {
  return (    
  <div>
      <Routes>
      <Route path="/" element={<Start/>}/>
      <Route path="/login" element={<UserLogin/>}/>
      <Route path="/signup" element={<UserSingUp/>}/>
      <Route path="/captain-login" element={<CaptainLogin/>}/>
      <Route path="/captain-signup" element={<CaptainSignUp/>}/>
      <Route path="/riding" element={<Riding/>}/>
      <Route path="/finish-ride" element={<FinishRide/>}/>
      <Route path="/captain-riding" element={<CaptainRiding/>}/>
      <Route path="/captain-home" element={
      <CaptainProtectRoute>
        <CaptainHome/>
      </CaptainProtectRoute>
        }/>
      <Route path="/captain-logout" element={
        <CaptainProtectRoute>
        <CaptainLogout/>
        </CaptainProtectRoute>
        }/>
      <Route path="/home" element={
        <CaptainProtectRoute>
        <UserProtectedWrapper>
          <Home/>
        </UserProtectedWrapper>
        </CaptainProtectRoute>
      }/>
      <Route path="/user/logout" element={
     
       <UserProtectedWrapper>
          <UserLogout/>
        </UserProtectedWrapper>
      }/>
     </Routes>
  </div>
  )
}
export default App
