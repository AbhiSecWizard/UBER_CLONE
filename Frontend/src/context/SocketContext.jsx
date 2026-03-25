import { createContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    
    // useMemo use karne se socket instance tabhi dobara banega jab URL change ho
    const socket = useMemo(() => io(import.meta.env.VITE_BASE_URL, {
        transports: ['polling', 'websocket'], 
        withCredentials: true,
        autoConnect: true
    }), []);

    useEffect(() => {
        // Connection Handlers
        socket.on('connect', () => {
            console.log('✅ Connected to server via Socket.io:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.log('❌ Connection Error:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Disconnected from server:', reason);
        });

        // Cleanup: Jab component unmount ho toh socket band ho jaye
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            // socket.disconnect(); // Optional: depend karta hai aap global connection chahte hain ya nahi
        };
    }, [socket]);

    // 1. Message/Event Bhejne ke liye
    const sendMessage = (eventName, data) => {
        if (socket.connected) {
            socket.emit(eventName, data);
        } else {
            console.warn(`Cannot emit ${eventName}, socket not connected.`);
        }
    };

    // 2. Message/Event Receive karne ke liye
    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);
        
        // Return cleanup function to stop listening
        return () => socket.off(eventName, callback);
    };

    return (
        <SocketContext.Provider value={{ sendMessage, receiveMessage, socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;