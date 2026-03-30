import { createContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    const socket = useMemo(() => io(import.meta.env.VITE_BASE_URL, {
        transports: ['websocket'], // Fast connection ke liye websocket priority
        withCredentials: true,
        autoConnect: true
    }), []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ Connected:', socket.id);
            setIsConnected(true);

            // 🔥 FIX: Jaise hi connect ho, check karo agar user logged in hai toh join karwao
            const user = JSON.parse(localStorage.getItem('user'));
            const captain = JSON.parse(localStorage.getItem('captain'));
            
            if (user) {
                socket.emit('join', { userId: user._id, userType: 'user' });
            } else if (captain) {
                socket.emit('join', { userId: captain._id, userType: 'captain' });
            }
        });

        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket]);

    const sendMessage = (eventName, data) => {
        socket.emit(eventName, data);
    };

    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);
        return () => socket.off(eventName, callback);
    };

    return (
        <SocketContext.Provider value={{ sendMessage, receiveMessage, socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;