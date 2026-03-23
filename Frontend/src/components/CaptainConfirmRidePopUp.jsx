import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaChevronDown } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom"
import { ImLocation2 } from "react-icons/im";

import { FaUser, FaRoad, FaRupeeSign } from "react-icons/fa";
const CaptainConfirmRidePopUp = ({ confirmRide, setConfirmRide }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate()
  // Initial hidden state
  useGSAP(() => {
    gsap.set(popupRef.current, {
      y: "100%",
      opacity: 0.9,
      scale: 0.98,
    });
  }, []);

  // Smooth animation (open + close)
  useGSAP(() => {
    gsap.to(popupRef.current, {
      y: confirmRide ? 0 : "100%",
      opacity: confirmRide ? 1 : 0.9,
      scale: confirmRide ? 1 : 0.98,
      duration: 0.6,
      ease: "power4.inOut", // 🔥 ultra smooth
    });
  }, [confirmRide]);

  return (
    <div
      ref={popupRef}
      className="fixed bottom-0 left-0 w-full h-full bg-white z-50 rounded-t-3xl shadow-2xl"
    >
      
      {/* 🔽 CLOSE HANDLE */}
      <div className="flex justify-center py-3">
        <button
          onClick={() => setConfirmRide(false)}
          className="text-gray-500 text-xl"
        >
          <FaChevronDown />
        </button>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-4 items-center">
        <h2 className="text-lg font-semibold mb-4">Confirm Ride</h2>
        <div className="flex flex-row justify-center gap-4 items-center bg-yellow-500 px-3 py-3 rounded-xl">
                <img  className="w-12 h-12 rounded-full object-cover" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" /> <h3 className="text-xl font-bold">Aditya sharma</h3> <h3 className="ml-6 text-xl font-bold">2.2KM</h3>
        </div>
     
<div className="mt-4 flex flex-col gap-5">

  {/* 📍 LOCATION */}
  <div className="flex items-start gap-4 border-b pb-3">
    <ImLocation2 size={20} className="text-green-500 mt-1" />

    <div>
      <h3 className="text-base font-semibold">562/11-A</h3>
      <p className="text-sm text-gray-500">
        Kantaria Table, Bhopa
      </p>
    </div>
  </div>
  <div className="flex items-start gap-4 border-b pb-3">
    <ImLocation2 size={20} className="text-green-500 mt-1" />

    <div>
      <h3 className="text-base font-semibold">562/11-A</h3>
      <p className="text-sm text-gray-500">
        Kantaria Table, Bhopa
      </p>
    </div>
  </div>
   
  
  <div className="flex items-center justify-between">

    <div className="flex items-center gap-3">
      <div className="bg-green-100 p-2 rounded-full">
        <FaRupeeSign className="text-green-600" />
      </div>

      <h3 className="text-base font-semibold">Cash Payment</h3>
    </div>

    <span className="text-lg font-bold text-gray-800">₹220</span>

  </div>

</div>

<div className="w-full px-3 mt-4">
  <input type="number" maxLength={"4"} className="rounded-xl w-full py-3 border-none  bg-gray-300/40 px-3 text-xl font-bold" placeholder="OTP"/>
</div>



        <p className="text-sm px-3 text-gray-500 mb-4">
          Are you sure you want to accept this ride?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setConfirmRide(false)}
            className="w-1/2 border py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>

          <button onClick={function(){
            console.log("hello I am clicked")
            navigate("/captain-riding")
          }} className="w-1/2 bg-black text-white py-3 rounded-xl font-semibold">
            Confirm
          </button>
        </div>
      </div>

    </div>
  );
};

export default CaptainConfirmRidePopUp;