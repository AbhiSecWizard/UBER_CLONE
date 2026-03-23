import { useEffect, useRef, useState, useCallback } from "react";
import { FaChevronDown } from "react-icons/fa";
import LocationSearchPanel from "../components/LocationSearchPanel";
import RideOptions from "../components/RideOptions";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(""); 
  const [isRideVisible, setIsRideVisible] = useState(false);

  const cache = useRef({}); 
  const ignoreNextCall = useRef(false);

  // 🔥 Optimized Suggestion Fetcher
  const fetchSuggestions = useCallback(async (input) => {
    if (!input || input.length < 3 || ignoreNextCall.current) {
      ignoreNextCall.current = false; 
      return;
    }

    // Cache logic is good, keep it
    if (cache.current[input]) {
      setSuggestions(cache.current[input]);
      return;
    }

    console.log("🚀 Fetching from API:", input); // Console check karein

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${encodeURIComponent(input)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Agar 429 aa raha hai, toh res.ok false hoga
      if (res.status === 429) {
          console.error("⛔ Rate limited! Backend is blocking us.");
          return;
      }

      const data = await res.json();

console.log("API RESPONSE:", data);

// ✅ correct extraction
const suggestionData = data.data || [];

if (Array.isArray(suggestionData)) {
  setSuggestions([...suggestionData]); // 🔥 force re-render
  cache.current[input] = suggestionData;
}
    } catch (error) {
      console.error("Error in getAutoSuggestions:", error);
    }
}, []);

  // 🔥 Strict Debouncing logic
  useEffect(() => {
    const targetValue = activeInput === "pickup" ? pickup : destination;

    if (targetValue.length >= 3) {
      const delayDebounceFn = setTimeout(() => {
        fetchSuggestions(targetValue);
      }, 700); 

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
    }
  }, [pickup, destination, activeInput, fetchSuggestions]);

  const handleFindTrip = (e) => {
    e.preventDefault();
    if (pickup && destination) {
      setOpen(false);
      setIsRideVisible(true);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50 font-sans">
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
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black"></div>
            <input
              value={pickup}
              onChange={(e) => { setPickup(e.target.value); setActiveInput("pickup"); ignoreNextCall.current = false; }}
              onFocus={() => { setOpen(true); setIsRideVisible(false); }}
              type="text"
              placeholder="Add a pick-up location"
              className="rounded-xl pl-12 py-4 bg-gray-100 w-full outline-none focus:ring-2 ring-black/10 transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-black"></div>
            <input
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setActiveInput("destination"); ignoreNextCall.current = false; }}
              onFocus={() => { setOpen(true); setIsRideVisible(false); }}
              type="text"
              placeholder="Enter your destination"
              className="rounded-xl pl-12 py-4 bg-gray-100 w-full outline-none focus:ring-2 ring-black/10 transition-all"
            />
          </div>

          {open && pickup && destination && (
            <button className="w-full bg-black text-white py-4 rounded-2xl font-bold mt-4 active:scale-95 transition">
              Find Trip
            </button>
          )}
        </form>

        {open && (
          <div className="h-[60vh] overflow-y-auto mt-6">
            <LocationSearchPanel
              suggestions={suggestions}
  setPickup={setPickup}
  setDestination={setDestination}
  activeInput={activeInput}
  ignoreNextCall={ignoreNextCall}
  setSuggestions={setSuggestions}  
            />
          </div>
        )}
      </div>

      <RideOptions
        pickup={isRideVisible ? pickup : ""}
        destination={isRideVisible ? destination : ""}
        setRideVisible={setIsRideVisible}
      />
    </div>
  );
};

export default Home;