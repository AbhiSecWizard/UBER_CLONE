import { useState, useRef, useContext } from "react";
import { FaPowerOff, FaMapMarkerAlt, FaRupeeSign, FaClock, FaRoad, FaStar } from "react-icons/fa";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CaptainConfirmRidePopUp from "../components/CaptainConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
    const [online, setOnline] = useState(false);
    const [confirmRide, setConfirmRide] = useState(false);
    const panelRef = useRef(null);
    
    const { captain, isLoading } = useContext(CaptainDataContext);

    // 1. Better Image URLs & Fallback logic
    const vehicleImages = {
        car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.png",
        motorcycle: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/ad3011-41e9-40da-9694-54d743a60965/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
        auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8a79-558a-47d5-aaa9-ad54e66033f8/original/Uber_Auto_312x208_pixels_Mobile.png"
    };

    useGSAP(() => {
        if (panelRef.current) {
            gsap.to(panelRef.current, {
                y: online ? 0 : "100%",
                duration: 0.6,
                ease: "power3.out"
            });
        }
    }, [online]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
            </div>
        );
    }

    // Getting the right image based on vehicle type (Handling case sensitivity)
    const currentVehicleType = captain?.vehicle?.vehicleType?.toLowerCase();
    const vehicleImg = vehicleImages[currentVehicleType] || vehicleImages.car;

    return (
        <div className="h-screen w-full flex flex-col bg-gray-100 overflow-hidden relative">
            
            {/* --- HEADER --- */}
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10 border-b">
                <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <div className="flex items-center gap-4">
                    <button onClick={() => setOnline(!online)} className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all flex items-center gap-2 ${online ? "bg-green-100 text-green-600 border border-green-200" : "bg-red-100 text-red-600 border border-red-200"}`}>
                        <div className={`w-2 h-2 rounded-full ${online ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                        {online ? "GO OFFLINE" : "GO ONLINE"}
                    </button>
                </div>
            </div>

            {/* --- MAP SECTION --- */}
            <div className="flex-1 relative">
                <img className="w-full h-full object-cover" src="https://tb-static.uber.com/prod/udam-assets/73bbe084-7111-436b-9e15-0df934a136b7.png" alt="Map" />
                
                {/* FLOATING STATS */}
                <div className="absolute top-4 left-4 right-4 bg-black text-white p-5 rounded-2xl shadow-2xl grid grid-cols-3 gap-2">
                    <div className="text-center border-r border-gray-700">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Earnings</p>
                        <h2 className="font-bold text-lg flex justify-center items-center">₹1250</h2>
                    </div>
                    <div className="text-center border-r border-gray-700">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Trips</p>
                        <h2 className="font-bold text-lg">8</h2>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Hours</p>
                        <h2 className="font-bold text-lg">5.2</h2>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM PANEL --- */}
            <div ref={panelRef} className="fixed bottom-0 w-full bg-white rounded-t-[30px] shadow-[0_-15px_40px_rgba(0,0,0,0.2)] translate-y-full z-20 transition-transform duration-500 ease-in-out pb-6">
                {online ? (
                    <div className="p-6">
                        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        
                        {/* DRIVER PROFILE & VEHICLE DETAIL */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover" alt="Captain" />
                                <div>
                                    <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">{captain?.fullname?.firstname}</h3>
                                    <p className="text-xs text-gray-500 font-medium">Basic Level Captain</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h4 className="text-lg font-bold">₹1250.20</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Earned Today</p>
                            </div>
                        </div>

                        {/* VEHICLE CARD - UBER STYLE */}
                        <div className="bg-gray-100 flex items-center justify-between p-4 rounded-2xl mb-6 relative overflow-hidden">
                            <div className="z-10">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Your Vehicle</p>
                                <h5 className="font-black text-gray-900 uppercase">{captain?.vehicle?.vehicleType}</h5>
                                <div className="mt-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-[11px] font-black inline-block border border-black/10">
                                    {captain?.vehicle?.plate}
                                </div>
                            </div>
                            {/* THE IMAGE FIX */}
                            <img 
                                src={vehicleImg} 
                                className="w-28 h-auto object-contain z-10 drop-shadow-md" 
                                alt="Vehicle" 
                                onError={(e) => {e.target.src = "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_637/v1555367310/assets/30/51e602-10bb-4e65-b122-e394d80a9c47/original/Final_UberX.png"}}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                             <div className="text-center">
                                <FaClock className="mx-auto text-gray-400 mb-1" />
                                <p className="text-xs font-bold">10.2</p>
                                <p className="text-[10px] text-gray-400">Hours</p>
                             </div>
                             <div className="text-center">
                                <FaRoad className="mx-auto text-gray-400 mb-1" />
                                <p className="text-xs font-bold">32.5</p>
                                <p className="text-[10px] text-gray-400">KM</p>
                             </div>
                             <div className="text-center">
                                <FaStar className="mx-auto text-gray-400 mb-1" />
                                <p className="text-xs font-bold">4.9</p>
                                <p className="text-[10px] text-gray-400">Rating</p>
                             </div>
                        </div>

                        <button onClick={() => setConfirmRide(true)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all shadow-lg shadow-blue-200">
                             Wait for New Ride
                        </button>
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-300">
                             <FaPowerOff className="text-gray-300" size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">You're Offline</h2>
                        <p className="text-gray-400 text-sm mt-1">Status set to offline. You won't receive any ride requests.</p>
                    </div>
                )}
            </div>

            {confirmRide && <CaptainConfirmRidePopUp confirmRide={confirmRide} setConfirmRide={setConfirmRide} />}
        </div>
    );
};

export default CaptainHome;