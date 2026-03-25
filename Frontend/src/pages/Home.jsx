import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { FaChevronDown, FaPhoneAlt, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import LocationSearchPanel from "../components/LocationSearchPanel";
import RideOptions from "../components/RideOptions";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState("");
  const [isRideVisible, setIsRideVisible] = useState(false);
  const [fareData, setFareData] = useState(null);
  const [ride, setRide] = useState(null); 

  const cache = useRef({});
  const ignoreNextCall = useRef(false);
  const navigate = useNavigate();

  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  // 1. Join Socket Room
  useEffect(() => {
    if (user?._id) {
      sendMessage("join", { userId: user._id, userType: 'user' });
    }
  }, [user, sendMessage]);

  // 2. Listen for Ride Updates
  useEffect(() => {
    receiveMessage('ride-confirmed', (data) => {
      setRide(data);
      setIsRideVisible(false); 
      setOpen(false); // Ride confirm hote hi search panel band
    });

    receiveMessage('ride-started', (data) => {
      navigate('/riding', { state: { ride: data } });
    });
  }, [receiveMessage, navigate]);

  // 3. Location Search Logic (Unchanged)
  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.length < 3 || ignoreNextCall.current) {
      ignoreNextCall.current = false;
      return;
    }
    if (cache.current[input]) {
      setSuggestions(cache.current[input]);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${encodeURIComponent(input)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const suggestionData = data.data || [];
      if (Array.isArray(suggestionData)) {
        setSuggestions([...suggestionData]);
        cache.current[input] = suggestionData;
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  useEffect(() => {
    const targetValue = activeInput === "pickup" ? pickup : destination;
    if (targetValue.length >= 3) {
      const delayDebounceFn = setTimeout(() => fetchSuggestions(targetValue), 700);
      return () => clearTimeout(delayDebounceFn);
    }
    setSuggestions([]);
  }, [pickup, destination, activeInput, fetchSuggestions]);

  const handleFindTrip = async (e) => {
    e.preventDefault();
    if (pickup && destination) {
      await getFare();
      setOpen(false);
      setIsRideVisible(true);
    }
  };

  const getFare = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setFareData(res.data.data);
    } catch (error) {
      console.error("Fare Error:", error.message);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50">
      {/* Uber Logo */}
      <img className="w-16 absolute left-5 top-5 z-20" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
      
      {/* Map Placeholder */}
      <img src="https://tb-static.uber.com/prod/udam-assets/73bbe084-7111-436b-9e15-0df934a136b7.png" className="h-full w-full object-cover opacity-60 grayscale" alt="Map" />

      {/* --- Search Panel --- */}
      <div className={`absolute w-full bg-white p-6 rounded-t-3xl transition-all duration-500 z-30 shadow-2xl ${open ? "bottom-0 h-full" : "bottom-0 h-[28%]"}`}>
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-2xl font-bold">Find a trip</h4>
          {open && (
            <button onClick={() => setOpen(false)} className="bg-gray-100 p-2 rounded-full active:scale-90 transition">
              <FaChevronDown size={18} className="text-gray-600" />
            </button>
          )}
        </div>

        <form onSubmit={handleFindTrip} className="space-y-3 relative">
          <input
            value={pickup}
            onChange={(e) => { setPickup(e.target.value); setActiveInput("pickup"); }}
            onFocus={() => { setOpen(true); setIsRideVisible(false); }}
            type="text" placeholder="Add a pick-up location"
            className="rounded-xl pl-12 py-4 bg-gray-100 w-full outline-none font-medium"
          />
          <input
            value={destination}
            onChange={(e) => { setDestination(e.target.value); setActiveInput("destination"); }}
            onFocus={() => { setOpen(true); setIsRideVisible(false); }}
            type="text" placeholder="Enter your destination"
            className="rounded-xl pl-12 py-4 bg-gray-100 w-full outline-none font-medium"
          />
          {open && pickup && destination && (
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-4 shadow-lg active:scale-95 transition">Find Trip</button>
          )}
        </form>

        {open && (
          <div className="h-[60vh] overflow-y-auto mt-6">
            <LocationSearchPanel suggestions={suggestions} setPickup={setPickup} setDestination={setDestination} activeInput={activeInput} ignoreNextCall={ignoreNextCall} setSuggestions={setSuggestions} />
          </div>
        )}
      </div>

      {/* Ride Options (Vehicle Type Selection) */}
      <RideOptions pickup={isRideVisible ? pickup : ""} destination={isRideVisible ? destination : ""} setRideVisible={setIsRideVisible} fareData={fareData} />
      
      {/* --- Driver Found Panel (OTP & Captain Details) --- */}
      {ride && (
        <div className="fixed bottom-0 w-full bg-white p-6 z-[100] rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-center mb-4"><div className="w-12 h-1.5 bg-gray-200 rounded-full"></div></div>
            
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-800 tracking-tight">Meet your Captain</h3>
                <div className="bg-blue-600 px-5 py-2 rounded-2xl text-center shadow-lg shadow-blue-100">
                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest leading-none mb-1">OTP</p>
                    <p className="text-2xl font-black text-white leading-none">{ride?.otp}</p>
                </div>
            </div>

            {/* Captain Info Card */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100 mb-6">
                <img className="h-14 w-14 rounded-2xl object-cover" src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-sedan-carry.jpg" alt="Car" />
                <div className="flex-1">
                    <h2 className="text-lg font-black capitalize">{ride?.captain?.fullname?.firstname}</h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                      {ride?.captain?.vehicle?.plate || "UP 32 AB 1234"} • White Swift
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs font-bold text-gray-400">
                        <FaStar className="text-yellow-400" /> 4.9 Rating
                    </div>
                </div>
                <a href={`tel:${ride?.captain?.contact}`} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm active:scale-90 transition inline-block">
                  <FaPhoneAlt className="text-green-600" />
                </a>
            </div>

            {/* Address Details */}
            <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="flex gap-4">
                    <div className="text-blue-500 text-lg mt-1"><FaMapMarkerAlt /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p>
                      <p className="text-sm font-bold text-gray-700 line-clamp-1">{ride?.pickup}</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-red-500 text-lg mt-1"><FaMapMarkerAlt /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Destination</p>
                      <p className="text-sm font-bold text-gray-700 line-clamp-1">{ride?.destination}</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Home;