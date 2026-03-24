import { useState } from "react";
import {
  FaPowerOff,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaRoad,
} from "react-icons/fa";
import { useRef } from 'react';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import CaptainConfirmRidePopUp from "../components/CaptainConfirmRidePopUp";
import { useContext } from "react";
import {CaptainDataContext} from "../context/CaptainContext"



const CaptainHome = () => {
const [online,setOnline] = useState(false) 
// const [offline,setOffline] = useState(false) 
const panelRef = useRef(null)
const [confirmRide,setConfirmRide] = useState(false)
const {captain} = useContext(CaptainDataContext)
console.log("captain name ", captain.fullname)
useGSAP(()=>{
  if(online){
    gsap.to(panelRef.current,{
      y:0,
      duration:0.5,
      ease:"ease"
    })
  }else{
     gsap.to(panelRef.current, {
      y: "100%",
      duration: 1,
      ease: "ease"
    });
  }
},[online])




  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">

      {/* 🔥 HEADER */}
      <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        />

        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              online ? "text-green-500" : "text-gray-400"
            }`}
          >
            {online ? "ONLINE" : "OFFLINE"}
          </span>

          <button
            onClick={() => setOnline(!online)}
            className={`p-2 rounded-full ${
              online ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
          >
            <FaPowerOff />
          </button>
        </div>
      </div>

      {/* 🔥 MAP */}
      <div className="flex-1 relative">

        <img
          className="w-full h-full object-cover"
          src="https://tb-static.uber.com/prod/udam-assets/73bbe084-7111-436b-9e15-0df934a136b7.png"
        />

        {/* 🔥 STATS CARD */}
        <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-lg grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">Earnings</p>
            <h2 className="font-bold flex justify-center items-center">
              <FaRupeeSign /> 1250
            </h2>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">Trips</p>
            <h2 className="font-bold">8</h2>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">Online</p>
            <h2 className="font-bold">5h</h2>
          </div>

        </div>

   
      </div>

      {/* 🔥 BOTTOM PANEL */}
     {/* 🔥 BOTTOM PANEL */}
<div ref={panelRef} className="  bg-white p-4 rounded-t-3xl shadow-2xl ">

  {online ? (
    <div className="bg-gray-50 p-4 rounded-2xl shadow">

      {/* 🔥 DRIVER INFO (NEW) */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold text-sm">{captain.fullname.firstname}</h3>
          <p className="text-xs text-gray-500">⭐ 4.8 • Swift Dzire</p>
        </div>
      </div>

      <h3 className="font-semibold mb-3 text-lg">
        🚗 New Ride Request
      </h3>

      {/* LOCATIONS */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm mb-1">
          <FaMapMarkerAlt className="text-green-500" />
          <span>Connaught Place, Delhi</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <FaMapMarkerAlt className="text-red-500" />
          <span>Noida Sector 18</span>
        </div>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">

        <div className="bg-white p-2 rounded-xl shadow-sm">
          <FaRoad className="mx-auto mb-1" />
          <p>8 km</p>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-sm">
          <FaClock className="mx-auto mb-1" />
          <p>15 min</p>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-sm">
          <FaRupeeSign className="mx-auto mb-1" />
          <p>₹220</p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">

        <button 
        onClick={()=>setConfirmRide(true)}
        className="w-1/2 bg-black text-white py-3 rounded-xl font-semibold active:scale-95">
          Accept
        </button>

        <button className="w-1/2 border py-3 rounded-xl font-semibold active:scale-95">
          Decline
        </button>

      </div>

    </div>
  ) : (
    <div className="text-center text-gray-500 py-6">
      Go Online to Start Receiving Ride Requests 🚀
    </div>
  )}

</div>
{confirmRide && 
console.log("conponent is render")
}
 { confirmRide && 
   <CaptainConfirmRidePopUp confirmRide={confirmRide} setConfirmRide={setConfirmRide}/>
 }
    </div>
  );
};

export default CaptainHome;