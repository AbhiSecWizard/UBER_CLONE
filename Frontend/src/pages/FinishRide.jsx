import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaRupeeSign, FaCar } from "react-icons/fa";
import axios from "axios";

const FinishRide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ride = location.state?.ride;

  const handleFinish = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`, {
        rideId: ride._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ride khatam hone par wapas home par reset status ke saath
      navigate("/captain-home");
    } catch (err) {
      console.error("End ride error:", err.message);
      navigate("/captain-home"); // Failure par bhi safety ke liye redirect
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-yellow-400 px-4">
      <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <FaCar className="text-yellow-500 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Ride Completed</h2>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <p className="text-gray-500">Passenger</p>
            <h4 className="font-semibold">{ride?.user?.fullname?.firstname}</h4>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-500">Total Fare</p>
            <h4 className="font-bold text-green-600 text-lg">₹{ride?.fare}</h4>
          </div>
        </div>

        <button onClick={handleFinish} className="w-full bg-black text-white p-4 rounded-xl font-bold uppercase tracking-wide">
          Collect Cash & Finish
        </button>
      </div>
    </div>
  );
};

export default FinishRide;