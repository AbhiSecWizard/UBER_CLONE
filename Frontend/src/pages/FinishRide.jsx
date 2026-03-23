import { useNavigate } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaRupeeSign, FaCar } from "react-icons/fa";
import { MdPayments } from "react-icons/md";

const FinishRide = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-yellow-200 to-yellow-400 px-4">

      <div className="bg-white p-6 rounded-3xl w-full max-w-md shadow-[0_10px_40px_rgba(0,0,0,0.25)] border border-gray-200">

        {/* Header */}
        <div className="text-center mb-6">
          <FaCar className="text-yellow-500 text-3xl mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Ride Completed
          </h2>
          <p className="text-gray-500 text-sm">
            Great job! Keep driving safe 
          </p>
        </div>

        {/* Divider */}
        <div className="border-t mb-5"></div>

        {/* Passenger */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-yellow-500 text-lg" />
            <p className="text-gray-500">Passenger</p>
          </div>
          <h4 className="font-semibold text-gray-800">Rahul Sharma</h4>
        </div>

        {/* Distance */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-yellow-500 text-lg" />
            <p className="text-gray-500">Distance</p>
          </div>
          <h4 className="font-semibold text-gray-800">4 KM</h4>
        </div>

        {/* Fare */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaRupeeSign className="text-yellow-500 text-lg" />
            <p className="text-gray-500">Total Fare</p>
          </div>
          <h4 className="font-bold text-green-600 text-lg">₹120</h4>
        </div>

        {/* Vehicle (NEW 🔥) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FaCar className="text-yellow-500 text-lg" />
            <p className="text-gray-500">Vehicle</p>
          </div>
          <h4 className="font-semibold text-gray-800">Swift Dzire</h4>
        </div>

        {/* Payment */}
        <div className="flex items-center justify-between bg-yellow-100 border border-yellow-300 rounded-xl p-3 mb-6">
          <div className="flex items-center gap-3">
            <MdPayments className="text-yellow-600 text-lg" />
            <p className="text-gray-600">Payment</p>
          </div>
          <h4 className="font-semibold text-gray-800">Cash</h4>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/captain-home")}
          className="w-full bg-black hover:bg-gray-900 transition text-white p-3 rounded-xl font-semibold"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};

export default FinishRide;