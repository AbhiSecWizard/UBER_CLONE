import { useRef, useState, useEffect, useContext } from "react"; // useContext add kiya
import gsap from "gsap";
import { FaUser, FaStar } from "react-icons/fa";
import whiteBike from "../assets/VehicleImages/whiteBIke.png";
import whiteCar from "../assets/VehicleImages/whitecar.png";
import auto from "../assets/VehicleImages/auto.png";
import axios from "axios"; // axios import
import { SocketContext } from "../context/SocketContext"; // socket import

const RideOptions = ({ pickup, destination, setRideVisible, fareData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(false);
  
  // Naya state ride data ke liye
  const [rideData, setRideData] = useState(null);

  const panelRef = useRef(null);
  const detailRef = useRef(null);
  const searchingRef = useRef(null);

  const { socket } = useContext(SocketContext); // socket instance

  const rides = [
    { id: 1, name: "UberGo", type: "car", persons: 4, time: "2 mins away", image: whiteCar },
    { id: 2, name: "Moto", type: "motorbike", persons: 1, time: "1 min away", image: whiteBike },
    { id: 3, name: "UberAuto", type: "auto", persons: 3, time: "3 mins away", image: auto },
  ];

  // 🔥 RIDE CONFIRMATION LOGIC (API CALL)
  const createRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType: selectedRide.type
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setRideData(response.data.data);
        setShowDetail(false);
        setSearchingDriver(true);
      }
    } catch (error) {
      console.error("Ride Creation Failed:", error.response?.data || error.message);
      alert("Something went wrong while booking!");
    }
  };

  const resetAll = () => {
    setShowDetail(false);
    setSearchingDriver(false);
    setSelectedRide(null);
    setRideVisible(false);
    setIsOpen(false);
    setRideData(null);
  };

  useEffect(() => {
    if (pickup && destination) {
      setIsOpen(true);
      if (panelRef.current) gsap.to(panelRef.current, { y: 0, duration: 0.6, ease: "power3.out" });
    } else {
      if (panelRef.current) gsap.to(panelRef.current, { y: "100%", duration: 0.5, onComplete: () => resetAll() });
    }
  }, [pickup, destination]);

  useEffect(() => {
    if (showDetail && detailRef.current) gsap.fromTo(detailRef.current, { y: "100%" }, { y: 0, duration: 0.5 });
    if (searchingDriver && searchingRef.current) gsap.fromTo(searchingRef.current, { y: "100%" }, { y: 0, duration: 0.5 });
  }, [showDetail, searchingDriver]);

  if (!pickup || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={resetAll}></div>

      {/* RIDE SELECTION */}
      <div ref={panelRef} className={`absolute bottom-0 left-0 w-full h-[75vh] bg-white rounded-t-3xl p-6 shadow-2xl transition-all duration-300 ${showDetail || searchingDriver ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        <div onClick={resetAll} className="w-12 h-1.5 bg-gray-300 mx-auto mb-6 rounded-full cursor-pointer"></div>
        <h2 className="text-xl font-bold mb-4">Choose a ride</h2>
        <div className="space-y-3 overflow-y-auto h-[85%] pb-10">
          {rides.map((ride) => (
            <div key={ride.id} onClick={() => { setSelectedRide(ride); setShowDetail(true); }} className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 active:scale-95 transition cursor-pointer">
              <div className="flex items-center gap-4">
                <img src={ride.image} className="w-16" alt="" />
                <div>
                  <h4 className="font-bold flex items-center gap-2">{ride.name} <span className="text-xs text-gray-400 font-normal"><FaUser className="inline mb-1" size={10} /> {ride.persons}</span></h4>
                  <p className="text-sm text-gray-500">{ride.time}</p>
                </div>
              </div>
              <p className="font-bold text-lg">₹{fareData?.fare?.[ride.type] || "--"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DETAIL PANEL */}
      {showDetail && selectedRide && (
        <div ref={detailRef} className="absolute bottom-0 left-0 w-full h-[70vh] bg-white rounded-t-3xl p-6 z-[60] shadow-2xl flex flex-col">
          <div onClick={() => setShowDetail(false)} className="w-12 h-1.5 bg-gray-200 mx-auto mb-6 rounded-full cursor-pointer shrink-0"></div>
          <div className="flex-1 overflow-y-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold">{selectedRide.name}</h2>
              <img src={selectedRide.image} className="h-28 mx-auto my-2 object-contain" alt={selectedRide.name} />
              <h3 className="text-3xl font-black mb-6">₹{fareData?.fare?.[selectedRide.type] || 0}</h3>
            </div>
            <div className="space-y-4 border-t border-gray-100 pt-6 px-2">
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center mt-1"><div className="w-2.5 h-2.5 rounded-full bg-black shrink-0"></div><div className="w-[1.5px] h-10 bg-gray-200"></div><div className="w-2.5 h-2.5 border-2 border-black bg-white shrink-0"></div></div>
                <div className="flex flex-col gap-6">
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</p><p className="text-sm font-medium text-gray-800 line-clamp-1">{pickup}</p></div>
                  <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destination</p><p className="text-sm font-medium text-gray-800 line-clamp-1">{destination}</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4 bg-white">
            <button onClick={() => setShowDetail(false)} className="flex-1 py-4 bg-gray-100 font-bold rounded-2xl active:scale-95 transition">Back</button>
            <button onClick={createRide} className="flex-[2] py-4 bg-black text-white font-bold rounded-2xl active:scale-95 transition shadow-lg shadow-black/20">Confirm {selectedRide.name}</button>
          </div>
        </div>
      )}

      {/* SEARCHING/DRIVER PANEL */}
      {searchingDriver && (
        <div ref={searchingRef} className="absolute bottom-0 left-0 w-full h-[85vh] bg-white rounded-t-3xl p-6 z-[70] shadow-2xl flex flex-col">
          <div className="w-12 h-1.5 bg-gray-200 mx-auto mb-6 rounded-full shrink-0"></div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Looking for nearby drivers</h2>
                <p className="text-sm text-blue-600 font-bold animate-pulse">Requesting ride...</p>
              </div>
            </div>
            {/* Yahan aapka status UI rahega jab tak driver accept na kare */}
            <div className="flex flex-col items-center justify-center h-40">
                <div className="w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 font-medium text-gray-500">Wait kar rahe hain...</p>
            </div>
          </div>
          <button onClick={resetAll} className="w-full py-4 bg-red-50 text-red-500 font-bold rounded-2xl mt-4">Cancel Request</button>
        </div>
      )}
    </div>
  );
};

export default RideOptions;