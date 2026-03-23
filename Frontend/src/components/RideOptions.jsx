import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { FaUser, FaStar } from "react-icons/fa";
import whiteBike from "../assets/VehicleImages/whiteBIke.png";
import whiteCar from "../assets/VehicleImages/whitecar.png";
import auto from "../assets/VehicleImages/auto.png";

const RideOptions = ({ pickup, destination, setRideVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(false);

  const rides = [
    { id: 1, name: "UberGo", persons: 4, time: "2 mins away", price: 193.2, image: whiteCar },
    { id: 2, name: "Moto", persons: 1, time: "1 min away", price: 120, image: whiteBike },
    { id: 3, name: "UberAuto", persons: 3, time: "3 mins away", price: 190, image: auto },
  ];

  const driver = {
    name: "Ravi Kumar",
    rating: 4.8,
    car: "Swift Dzire • White",
    number: "DL 01 AB 1234",
    eta: "4 mins away",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const panelRef = useRef(null);
  const detailRef = useRef(null);
  const searchingRef = useRef(null);

  const resetAll = () => {
    setShowDetail(false);
    setSearchingDriver(false);
    setSelectedRide(null);
    setRideVisible(false);
  };

  // Trigger main panel slide up/down
  useEffect(() => {
    if (pickup && destination) {
      setIsOpen(true);
      gsap.to(panelRef.current, { y: 0, duration: 0.6, ease: "power3.out" });
    } else if (isOpen) {
      gsap.to(panelRef.current, { 
        y: "100%", duration: 0.5, 
        onComplete: () => { setIsOpen(false); resetAll(); } 
      });
    }
  }, [pickup, destination]);

  // Sub-panels animation
  useEffect(() => {
    if (showDetail) gsap.fromTo(detailRef.current, { y: "100%" }, { y: 0, duration: 0.5, ease: "power3.out" });
    if (searchingDriver) gsap.fromTo(searchingRef.current, { y: "100%" }, { y: 0, duration: 0.5, ease: "power3.out" });
  }, [showDetail, searchingDriver]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={resetAll}></div>

      {/* 1. SELECTION PANEL */}
      <div
        ref={panelRef}
        className={`absolute bottom-0 left-0 w-full h-[75vh] bg-white rounded-t-3xl p-6 shadow-2xl transition-all duration-300 ${showDetail || searchingDriver ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <div onClick={resetAll} className="w-12 h-1.5 bg-gray-300 mx-auto mb-6 rounded-full cursor-pointer hover:bg-gray-400"></div>
        <h2 className="text-xl font-bold mb-4">Choose a ride</h2>
        <div className="space-y-3 overflow-y-auto h-[85%] pb-10">
          {rides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => { setSelectedRide(ride); setShowDetail(true); }}
              className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img src={ride.image} className="w-16" alt="" />
                <div>
                  <h4 className="font-bold flex items-center gap-2">{ride.name} <span className="text-xs text-gray-400 font-normal"><FaUser className="inline mb-1" size={10}/> {ride.persons}</span></h4>
                  <p className="text-sm text-gray-500">{ride.time}</p>
                </div>
              </div>
              <p className="font-bold text-lg">₹{ride.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CONFIRMATION DETAIL PANEL */}
      {showDetail && selectedRide && (
        <div ref={detailRef} className="absolute bottom-0 left-0 w-full h-[65vh] bg-white rounded-t-3xl p-6 z-[60] shadow-2xl">
          <div onClick={() => setShowDetail(false)} className="w-12 h-1.5 bg-gray-200 mx-auto mb-6 rounded-full cursor-pointer"></div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{selectedRide.name}</h2>
            <img src={selectedRide.image} className="h-32 mx-auto my-4 object-contain" alt="" />
            <h3 className="text-3xl font-black mb-8">₹{selectedRide.price.toFixed(2)}</h3>
          </div>
          <div className="flex gap-4 absolute bottom-8 left-6 right-6">
            <button onClick={() => setShowDetail(false)} className="flex-1 py-4 bg-gray-100 font-bold rounded-2xl">Back</button>
            <button onClick={() => { setShowDetail(false); setSearchingDriver(true); }} className="flex-[2] py-4 bg-black text-white font-bold rounded-2xl">Confirm Ride</button>
          </div>
        </div>
      )}

      {/* 3. DRIVER FOUND / SEARCHING PANEL */}
      {searchingDriver && (
        <div ref={searchingRef} className="absolute bottom-0 left-0 w-full h-[75vh] bg-white rounded-t-3xl p-6 z-[70] shadow-2xl">
          <div className="w-12 h-1.5 bg-gray-200 mx-auto mb-6 rounded-full"></div>
          
          <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-2xl">
            <div className="flex gap-4 items-center">
              <img src={driver.image} className="w-14 h-14 rounded-full border-2 border-white" alt="" />
              <div>
                <h3 className="font-bold text-lg">{driver.name}</h3>
                <p className="text-sm text-gray-600 font-medium">
                  <FaStar className="inline text-yellow-500 mb-1" /> {driver.rating} • {driver.car}
                </p>
                <p className="text-[12px] font-bold text-gray-400 uppercase">{driver.number}</p>
              </div>
            </div>
            <div className="text-center px-4 py-2 bg-black text-white rounded-xl">
              <p className="text-[10px] opacity-70">OTP</p>
              <p className="font-bold text-lg leading-none">1234</p>
            </div>
          </div>

          <div className="space-y-6 mb-8 border-l-2 border-dashed border-gray-200 ml-4 pl-8 relative">
            <div className="relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
              <p className="text-xs font-bold text-blue-600 uppercase">Pickup</p>
              <p className="text-sm font-semibold">{pickup}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-red-500 border-4 border-white"></div>
              <p className="text-xs font-bold text-red-500 uppercase">Dropoff</p>
              <p className="text-sm font-semibold">{destination}</p>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 right-6">
            <button onClick={resetAll} className="w-full py-4 text-red-500 font-bold border-2 border-red-50 rounded-2xl hover:bg-red-50 transition-colors">
              Cancel Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideOptions;