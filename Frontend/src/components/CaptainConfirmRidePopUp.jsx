import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaChevronDown, FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImLocation2 } from "react-icons/im";
import axios from "axios";

const CaptainConfirmRidePopUp = ({ confirmRide, setConfirmRide, ride }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  useGSAP(() => {
    gsap.to(popupRef.current, { y: confirmRide ? 0 : "100%", opacity: confirmRide ? 1 : 0, duration: 0.6 });
  }, [confirmRide]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // OTP Verify API call
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/verify-otp`, {
        rideId: ride._id,
        otp: otp
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        navigate("/captain-riding", { state: { ride } });
      }
    } catch (err) {
      alert("Invalid OTP or Ride Error");
    }
  };

  return (
    <div ref={popupRef} className="fixed bottom-0 left-0 w-full h-full bg-white z-[100] rounded-t-3xl flex flex-col">
      <div className="flex justify-center py-3">
        <button onClick={() => setConfirmRide(false)}><FaChevronDown size={24} /></button>
      </div>
      <div className="p-5 flex-1 overflow-y-auto">
        <h2 className="text-2xl font-black mb-6 text-center">Start Ride</h2>
        <div className="bg-yellow-400 p-4 rounded-2xl mb-6">
            <h3 className="font-bold uppercase">{ride?.user?.fullname?.firstname}</h3>
            <p className="font-black">₹{ride?.fare}</p>
        </div>
        
        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <input 
            value={otp} onChange={(e) => setOtp(e.target.value)}
            type="number" required placeholder="Enter OTP"
            className="rounded-2xl w-full py-4 bg-gray-100 text-center text-2xl font-black outline-none" 
          />
          <button type="submit" className="w-full bg-black text-white py-4 rounded-2xl font-bold">Verify & Start</button>
        </form>
      </div>
    </div>
  );
};

export default CaptainConfirmRidePopUp;