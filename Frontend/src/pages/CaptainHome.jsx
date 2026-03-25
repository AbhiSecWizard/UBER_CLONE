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
    const { sendMessage, receiveMessage, socket } = useContext(SocketContext);
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

    // 2. Socket Connection and Ride Listeners
    useEffect(() => {
        if (!captain?._id) return;

        sendMessage('join', { userId: captain._id, userType: 'captain' });

        const updateLocation = () => {
            if (navigator.geolocation && online) {
                navigator.geolocation.getCurrentPosition((position) => {
                    sendMessage('update-location-captain', {
                        userId: captain._id,
                        location: { lat: position.coords.latitude, lng: position.coords.longitude }
                    });
                });
            }
        };

        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        // Nayi ride aane par popup dikhao
        receiveMessage('new-ride', (data) => {
            setRideData(data);
            setConfirmRide(true);
        });

        return () => {
            clearInterval(locationInterval);
        };
    }, [captain, online, sendMessage, receiveMessage]);

    useGSAP(() => {
        gsap.to(panelRef.current, { y: online ? 0 : "100%", duration: 0.6, ease: "power3.out" });
    }, [online]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="h-screen w-full flex flex-col bg-gray-100 relative overflow-hidden">
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-10">
                <img className="w-16" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
                <button 
                    onClick={() => setOnline(!online)} 
                    className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors ${online ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                    {online ? "GO OFFLINE" : "GO ONLINE"}
                </button>
            </div>

            <div className="flex-1 relative">
                <img className="w-full h-full object-cover grayscale" src="https://tb-static.uber.com/prod/udam-assets/73bbe084-7111-436b-9e15-0df934a136b7.png" alt="Map" />
            </div>

            <div ref={panelRef} className="fixed bottom-0 w-full bg-white rounded-t-[30px] shadow-2xl z-20 pb-6">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg">Hello, {captain?.fullname?.firstname}</h3>
                        <h4 className="text-lg font-bold">₹1250.20</h4>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                        {online ? "Waiting for ride requests..." : "Go online to start receiving rides"}
                    </div>
                </div>
            </div>

            {confirmRide && (
                <CaptainConfirmRidePopUp 
                    ride={rideData} 
                    setConfirmRide={setConfirmRide} 
                    confirmRide={confirmRide} 
                />
            )}
        </div>
    );
};

export default CaptainHome;