import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FaChevronDown, FaMapMarkerAlt, FaLocationArrow, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainConfirmRidePopUp = ({ confirmRide, setConfirmRide, ride, acceptRide }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate();
  
  // 🔥 View State: 'details' dikhayega Accept/Ignore, 'otp' dikhayega OTP input
  const [view, setView] = useState("details"); 
  const [otp, setOtp] = useState("");

  // GSAP Animation for smooth popup entry
  useGSAP(() => {
    gsap.to(popupRef.current, { 
      y: confirmRide ? 0 : "100%", 
      duration: 0.6, 
      ease: "power3.out" 
    });
  }, [confirmRide]);

  // Jab popup band ho, view ko wapas 'details' par reset kar do
  useEffect(() => {
    if (!confirmRide) {
      setTimeout(() => setView("details"), 600);
      setOtp("");
    }
  }, [confirmRide]);

  const handleAccept = async () => {
    // Pehle backend par ride confirm karo (jo props se aa raha hai)
    await acceptRide(); 
    // Phir view change karke OTP wala panel dikhao
    setView("otp");
  };

  const submitOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
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
    <div ref={popupRef} className="fixed bottom-0 left-0 w-full bg-white z-[100] rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col transition-all">
      
      {/* Handle Bar */}
      <div className="flex justify-center py-4">
        <button onClick={() => setConfirmRide(false)} className="w-12 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition"></button>
      </div>

      <div className="px-6 pb-10">
        {view === "details" ? (
          /* --- PANEL 1: NEW RIDE DETAILS (ACCEPT/IGNORE) --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-center text-gray-800">New Ride Available!</h2>
            
            {/* User Info Card */}
            <div className="flex items-center justify-between bg-yellow-400 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl"><FaUser size={20} /></div>
                <div>
                  <h3 className="font-black text-lg capitalize">{ride?.user?.fullname?.firstname}</h3>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-tighter">Customer</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">₹{ride?.fare}</p>
                <p className="text-[10px] font-bold uppercase text-gray-700">Estimated Fare</p>
              </div>
            </div>

            {/* Route Info */}
            <div className="space-y-4 py-2">
              <div className="flex gap-4 items-start">
                <FaLocationArrow className="text-blue-500 mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup</p>
                  <p className="text-sm font-bold text-gray-700 line-clamp-2">{ride?.pickup}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <FaMapMarkerAlt className="text-red-500 mt-1" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Destination</p>
                  <p className="text-sm font-bold text-gray-700 line-clamp-2">{ride?.destination}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setConfirmRide(false)} 
                className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl active:scale-95 transition"
              >
                Ignore
              </button>
              <button 
                onClick={handleAccept} 
                className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 active:scale-95 transition"
              >
                Accept Ride
              </button>
            </div>
          </div>
        ) : (
          /* --- PANEL 2: OTP VERIFICATION --- */
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="text-center">
                <h2 className="text-3xl font-black text-gray-900">Enter OTP</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Ask customer for the 4-digit code</p>
            </div>

            <form onSubmit={submitOtpHandler} className="space-y-6">
              <input 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                type="text" 
                maxLength="4"
                required 
                placeholder="0 0 0 0"
                className="rounded-3xl w-full py-6 bg-gray-50 text-center text-4xl font-black tracking-[20px] outline-none border-2 border-transparent focus:border-black transition-all placeholder:text-gray-200" 
              />
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setView("details")}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-[3] bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-black/20 active:scale-95 transition"
                >
                  Verify & Start Trip
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptainConfirmRidePopUp;