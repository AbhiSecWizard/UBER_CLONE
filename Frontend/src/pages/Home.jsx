import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
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
  const [ride, setRide] = useState(null); // Live ride data

  const cache = useRef({});
  const ignoreNextCall = useRef(false);
  const navigate = useNavigate();

  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (user?._id) {
      sendMessage("join", { userId: user._id, userType: 'user' });
    }
  }, [user, sendMessage]);

  useEffect(() => {
    // 1. Jab Captain ride confirm kare
    receiveMessage('ride-confirmed', (data) => {
      setRide(data);
      setIsRideVisible(false); // Ride options band karo
      // Yahan aap 'WaitingForDriver' popup ko 'DriverFound' mein switch kar sakte ho
    });

    // 2. Jab Ride start ho jaye (OTP verify hone ke baad)
    receiveMessage('ride-started', (data) => {
      navigate('/riding', { state: { ride: data } });
    });
  }, [receiveMessage, navigate]);

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
      <img className="w-16 absolute left-5 top-5 z-20" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
      <img src="https://thumbs.dreamstime.com/b/driving-small-car-map-paris-showing-roads-landmarks-travel-planning-green-toy-placed-detailed-features-439522277.jpg" className="h-full w-full object-cover opacity-80" alt="Map" />

      <div className={`absolute w-full bg-white p-6 rounded-t-3xl transition-all duration-500 z-30 shadow-2xl ${open ? "bottom-0 h-full" : "bottom-0 h-[30%]"}`}>
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
            className="rounded-xl pl-12 py-4 bg-gray-100 w-full outline-none"
          />
          <input
            value={destination}
            onChange={(e) => { setDestination(e.target.value); setActiveInput("destination"); }}
            onFocus={() => { setOpen(true); setIsRideVisible(false); }}
            type="text" placeholder="Enter your destination"
            className="rounded-xl pl-12 py-4 bg-gray-100 w-full outline-none"
          />
          {open && pickup && destination && (
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-4">Find Trip</button>
          )}
        </form>

        {open && (
          <div className="h-[60vh] overflow-y-auto mt-6">
            <LocationSearchPanel suggestions={suggestions} setPickup={setPickup} setDestination={setDestination} activeInput={activeInput} ignoreNextCall={ignoreNextCall} setSuggestions={setSuggestions} />
          </div>
        )}
      </div>

      <RideOptions pickup={isRideVisible ? pickup : ""} destination={isRideVisible ? destination : ""} setRideVisible={setIsRideVisible} fareData={fareData} />
      
      {/* Agar ride confirm ho jaye toh yahan OTP aur Driver info dikhayein */}
      {ride && (
        <div className="fixed bottom-0 w-full bg-white p-6 z-40 rounded-t-3xl shadow-2xl border-t">
           <h3 className="font-bold text-lg">Driver is coming! OTP: <span className="text-blue-600">{ride.otp}</span></h3>
           <p className="text-sm text-gray-500">Captain: {ride.captain.fullname.firstname}</p>
        </div>
      )}
    </div>
  );
};

export default Home;