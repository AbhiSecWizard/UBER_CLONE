import { useState, createContext, useEffect } from "react";
import axios from "axios";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCaptainProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setCaptain(response.data.captain);
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            localStorage.removeItem('token'); // Invalid token ko saaf karo
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCaptainProfile();
    }, []);

    const value = {
        captain,
        setCaptain,
        isLoading,
        setIsLoading,
        error
    };

    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;