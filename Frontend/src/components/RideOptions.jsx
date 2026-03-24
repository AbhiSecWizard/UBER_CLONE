import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { FaUser, FaStar } from "react-icons/fa";
import whiteBike from "../assets/VehicleImages/whiteBIke.png";
import whiteCar from "../assets/VehicleImages/whitecar.png";
import auto from "../assets/VehicleImages/auto.png";

const RideOptions = ({ pickup, destination, setRideVisible, fareData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchingDriver, setSearchingDriver] = useState(false);

  const panelRef = useRef(null);
  const detailRef = useRef(null);
  const searchingRef = useRef(null);

  // 🔥 Dynamic rides (NO static price)
  const rides = [
    {
      id: 1,
      name: "UberGo",
      type: "car",
      persons: 4,
      time: "2 mins away",
      image: whiteCar,
    },
    {
      id: 2,
      name: "Moto",
      type: "motorbike",
      persons: 1,
      time: "1 min away",
      image: whiteBike,
    },
    {
      id: 3,
      name: "UberAuto",
      type: "auto",
      persons: 3,
      time: "3 mins away",
      image: auto,
    },
  ];

  const driver = {
    name: "Ravi Kumar",
    rating: 4.8,
    car: "Swift Dzire • White",
    number: "DL 01 AB 1234",
    eta: "4 mins away",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const resetAll = () => {
    setShowDetail(false);
    setSearchingDriver(false);
    setSelectedRide(null);
    setRideVisible(false);
    setIsOpen(false);
  };

  // 🔥 Open / Close animation (SAFE)
  useEffect(() => {
    if (pickup && destination) {
      setIsOpen(true);

      if (panelRef.current) {
        gsap.to(panelRef.current, {
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      }
    } else {
      if (panelRef.current) {
        gsap.to(panelRef.current, {
          y: "100%",
          duration: 0.5,
          onComplete: () => resetAll(),
        });
      }
    }
  }, [pickup, destination]);

  // 🔥 Sub panels animation (SAFE)
  useEffect(() => {
    if (showDetail && detailRef.current) {
      gsap.fromTo(
        detailRef.current,
        { y: "100%" },
        { y: 0, duration: 0.5 }
      );
    }

    if (searchingDriver && searchingRef.current) {
      gsap.fromTo(
        searchingRef.current,
        { y: "100%" },
        { y: 0, duration: 0.5 }
      );
    }
  }, [showDetail, searchingDriver]);

  // ❌ avoid crash
  if (!pickup || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={resetAll}
      ></div>

      {/* 🚗 RIDE SELECTION */}
      <div
        ref={panelRef}
        className={`absolute bottom-0 left-0 w-full h-[75vh] bg-white rounded-t-3xl p-6 shadow-2xl transition-all duration-300 ${
          showDetail || searchingDriver
            ? "translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div
          onClick={resetAll}
          className="w-12 h-1.5 bg-gray-300 mx-auto mb-6 rounded-full cursor-pointer"
        ></div>

        <h2 className="text-xl font-bold mb-4">Choose a ride</h2>

        <div className="space-y-3 overflow-y-auto h-[85%] pb-10">
          {rides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => {
                setSelectedRide(ride);
                setShowDetail(true);
              }}
              className="flex items-center justify-between p-4 border rounded-2xl hover:bg-gray-50 active:scale-95 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img src={ride.image} className="w-16" alt="" />
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    {ride.name}
                    <span className="text-xs text-gray-400 font-normal">
                      <FaUser className="inline mb-1" size={10} />{" "}
                      {ride.persons}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-500">{ride.time}</p>
                </div>
              </div>

              {/* 🔥 Dynamic Fare */}
              <p className="font-bold text-lg">
                ₹{fareData?.fare?.[ride.type] || "--"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 📄 DETAIL PANEL */}
{/* 📄 DETAIL PANEL */}
{showDetail && selectedRide && (
  <div
    ref={detailRef}
    className="absolute bottom-0 left-0 w-full h-[70vh] bg-white rounded-t-3xl p-6 z-[60] shadow-2xl flex flex-col"
  >
    <div
      onClick={() => setShowDetail(false)}
      className="w-12 h-1.5 bg-gray-200 mx-auto mb-6 rounded-full cursor-pointer shrink-0"
    ></div>

    <div className="flex-1 overflow-y-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{selectedRide.name}</h2>
        <img
          src={selectedRide.image}
          className="h-28 mx-auto my-2 object-contain"
          alt={selectedRide.name}
        />
        <h3 className="text-3xl font-black mb-6">
          ₹{fareData?.fare?.[selectedRide.type] || 0}
        </h3>
      </div>

      {/* 📍 Location Details Section */}
      <div className="space-y-4 border-t border-gray-100 pt-6 px-2">
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-center mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-black shrink-0"></div>
            <div className="w-[1.5px] h-10 bg-gray-200"></div>
            <div className="w-2.5 h-2.5 border-2 border-black bg-white shrink-0"></div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup</p>
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{pickup}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Destination</p>
              <p className="text-sm font-medium text-gray-800 line-clamp-1">{destination}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="flex gap-4 pt-4 bg-white">
      <button
        onClick={() => setShowDetail(false)}
        className="flex-1 py-4 bg-gray-100 font-bold rounded-2xl active:scale-95 transition"
      >
        Back
      </button>

      <button
        onClick={() => {
          setShowDetail(false);
          setSearchingDriver(true);
        }}
        className="flex-[2] py-4 bg-black text-white font-bold rounded-2xl active:scale-95 transition shadow-lg shadow-black/20"
      >
        Confirm {selectedRide.name}
      </button>
    </div>
  </div>
)}
      {/* 🚕 DRIVER PANEL */}
      {/* 🚕 RIDE SUMMARY & DRIVER PANEL */}
{searchingDriver && (
  <div
    ref={searchingRef}
    className="absolute bottom-0 left-0 w-full h-[85vh] bg-white rounded-t-3xl p-6 z-[70] shadow-2xl flex flex-col"
  >
    {/* Handlebar */}
    <div className="w-12 h-1.5 bg-gray-200 mx-auto mb-6 rounded-full shrink-0"></div>

    <div className="flex-1 overflow-y-auto">
      {/* 🟢 Status Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Meet your driver</h2>
          <p className="text-sm text-blue-600 font-bold">{driver.eta} • Arriving soon</p>
        </div>
        <div className="text-center px-4 py-2 bg-yellow-400 rounded-2xl shadow-sm border border-yellow-500">
          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-900">OTP</p>
          <p className="font-bold text-xl text-black">1234</p>
        </div>
      </div>

      {/* 🟢 Layered Vehicle & Driver Image Card */}
      <div className="relative bg-gray-50 rounded-3xl p-6 mb-6 border border-gray-100 flex items-center justify-between overflow-hidden">
        <div className="z-10">
          <h3 className="text-xl font-bold text-gray-900">{driver.name}</h3>
          <p className="text-gray-500 font-medium">{driver.car}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white px-3 py-1 rounded-lg text-xs font-black shadow-sm border border-gray-200">
              {driver.number}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold">
              <FaStar className="text-yellow-500" /> {driver.rating}
            </span>
          </div>
        </div>

        {/* Overlapping Images Design */}
        <div className="relative w-32 h-24">
          {/* Main Vehicle Image */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-gray-50">
            <img 
              src={selectedRide?.image} 
              className="w-16 object-contain z-10" 
              alt="Vehicle" 
            />
          </div>
          {/* Driver Mini Image Overlap */}
          <div className="absolute left-2 top-0 w-14 h-14 rounded-full border-4 border-gray-50 shadow-xl overflow-hidden bg-black z-20">
            <img 
              src={driver.image} 
              className="w-full h-full object-cover" 
              alt="Driver" 
            />
          </div>
        </div>
      </div>

      {/* 🟢 Location Summary Card */}
      <div className="px-2 py-4 border-t border-gray-100">
        <div className="flex gap-4 items-start relative">
          {/* Visual Indicator Line */}
          <div className="flex flex-col items-center mt-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
            <div className="w-[1.5px] h-12 bg-gray-200"></div>
            <div className="w-2.5 h-2.5 bg-red-500"></div>
          </div>
          
          <div className="flex flex-col gap-6 w-full">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pickup</p>
              <p className="text-sm font-bold text-gray-800 line-clamp-1">{pickup}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Dropoff</p>
              <p className="text-sm font-bold text-gray-800 line-clamp-1">{destination}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 Payment Summary */}
      <div className="mt-4 p-4 bg-gray-900 rounded-2xl flex justify-between items-center text-white">
        <div>
          <p className="text-[10px] font-bold opacity-60 uppercase">Total Fare</p>
          <p className="text-lg font-bold">₹{fareData?.fare?.[selectedRide?.type] || 0}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold opacity-60 uppercase">Payment</p>
          <p className="text-sm font-bold italic">Cash / UPI</p>
        </div>
      </div>
    </div>

    {/* 🟢 Bottom Action Buttons */}
    <div className="pt-4 bg-white flex flex-col gap-3">
      <div className="flex gap-3">
        <button className="flex-1 py-4 bg-gray-100 font-bold rounded-2xl active:scale-95 transition">
          Message
        </button>
        <button className="flex-1 py-4 bg-gray-100 font-bold rounded-2xl active:scale-95 transition">
          Call Driver
        </button>
      </div>
      <button
        onClick={resetAll}
        className="w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition"
      >
        Cancel Ride
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default RideOptions;