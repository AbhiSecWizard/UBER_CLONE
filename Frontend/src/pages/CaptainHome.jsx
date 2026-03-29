import { useState, useRef, useContext, useEffect } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CaptainConfirmRidePopUp from "../components/CaptainConfirmRidePopUp";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from '../context/SocketContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CaptainHome = () => {
    const [online, setOnline] = useState(false);
    const [confirmRide, setConfirmRide] = useState(false);
    const [rideData, setRideData] = useState(null);
    
    const panelRef = useRef(null);
    const { captain, isLoading } = useContext(CaptainDataContext);
    const { sendMessage, receiveMessage } = useContext(SocketContext);
    const navigate = useNavigate();

    // 1. Status Sync with Backend
    useEffect(() => {
        const updateStatus = async () => {
            if (!captain?._id) return;
            try {
                await axios.patch(`${import.meta.env.VITE_BASE_URL}/captain/update-status`, {
                    status: online ? 'active' : 'inactive'
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } catch (err) {
                console.log("Status update error:", err.message);
            }
        };
        updateStatus();
    }, [online, captain]);
    // CaptainHome.jsx ke andar updateLocation function
const updateLocation = () => {
    if (navigator.geolocation && online) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // A. Socket ke liye (Live Tracking)
            sendMessage('update-location-captain', {
                userId: captain._id,
                location: { lat, lng }
            });

            // B. Database ke liye (Permanent Storage)
            try {
                await axios.patch(`${import.meta.env.VITE_BASE_URL}/captain/update-location`, {
                    location: { lat, lng }
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } catch (err) {
                console.log("DB Location Update Error:", err.message);
            }
        });
    }
};

// 2. Socket Logic + Periodic Location Update
useEffect(() => {
if (!captain?._id) return;

// Server join karein
sendMessage('join', { userId: captain._id, userType: 'captain' });

// 🔥 Pehli baar call karne ke liye jab page load ho ya online ho
if (online) {
updateLocation();
}

// 🔥 Har 10 second mein call karne ke liye
 const locationInterval = setInterval(() => {
 if (online) {
 updateLocation();
 }
 }, 10000);

 // Nayi ride ka listener
 receiveMessage('new-ride', (data) => {
 setRideData(data);
 setConfirmRide(true);
 });

 // Cleanup function
return () => {
 clearInterval(locationInterval);
 };
    }, [captain, online,sendMessage,receiveMessage]); // 👈 'online' yahan hona zaroori hai





    // 🔥 Fix: Accept Ride Function (Ye missing tha isliye error aa raha tha)
    const acceptRide = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: rideData._id,
                captainId: captain._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            return response.data; // Success response return karega component ke liye
        } catch (err) {
            console.log("Error accepting ride:", err.message);
            throw err;
        }
    };

    useGSAP(() => {
        gsap.to(panelRef.current, { 
            transform: online ? 'translateY(0)' : 'translateY(100%)', 
            duration: 0.6, 
            ease: "power3.out" 
        });
    }, [online]);

    if (isLoading) return <div className="h-screen flex items-center justify-center font-bold text-xl">Loading...</div>;

    return (
        <div className="h-screen w-full flex flex-col bg-gray-100 relative overflow-hidden">
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10">
                <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <button 
                    onClick={() => setOnline(!online)} 
                    className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${online ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                    {online ? "GO OFFLINE" : "GO ONLINE"}
                </button>
            </div>

            <div className="flex-1 relative">
                <img className="w-full h-full object-cover grayscale opacity-50" src="https://tb-static.uber.com/prod/udam-assets/73bbe084-7111-436b-9e15-0df934a136b7.png" alt="Map" />
            </div>

            {/* Bottom Status Panel */}
            <div ref={panelRef} className="fixed bottom-0 w-full bg-white rounded-t-[30px] shadow-2xl z-20 pb-10 translate-y-full">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg capitalize italic">Captain: {captain?.fullname?.firstname}</h3>
                        <h4 className="text-xl font-black">₹1250.20</h4>
                    </div>
                    <div className="text-center py-4 bg-gray-50 rounded-2xl text-sm font-semibold text-gray-500">
                        {online ? "Looking for nearby rides..." : "You are currently offline"}
                    </div>
                </div>
            </div>

            {/* 🔥 Updated Component Call */}
            <CaptainConfirmRidePopUp 
                ride={rideData} 
                confirmRide={confirmRide} 
                setConfirmRide={setConfirmRide} 
                acceptRide={acceptRide} 
            />
        </div>
    );
};

export default CaptainHome;