import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const CaptainRiding = () => {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(panelRef.current, {
      y: 200,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="h-screen relative overflow-hidden">

      {/* Top Bar */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        />

        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map */}
      <div className="h-4/5">
        <img
          className="h-full w-full object-cover"
          src="https://thumbs.dreamstime.com/b/driving-small-car-map-paris-showing-roads-landmarks-travel-planning-green-toy-placed-detailed-features-439522277.jpg"
        />
      </div>

      {/* Bottom Panel */}
      <div
        ref={panelRef}
        className="h-[40%] p-6 bg-yellow-400 absolute bottom-10 w-full rounded-t-3xl"
      >
        <h5 className="text-center mb-2">
          <i className="text-3xl ri-arrow-up-wide-line"></i>
        </h5>

        {/* Rider Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold">Rahul Sharma</h4>
            <p className="text-sm text-gray-700">Maruti Swift • DL 01 AB 1234</p>
          </div>

          <div className="text-right">
            <h4 className="text-xl font-bold">₹120</h4>
            <p className="text-sm">Cash</p>
          </div>
        </div>

        {/* OTP */}

        {/* Distance */}
        <h4 className="text-lg font-semibold mb-4">4 KM away</h4>

        {/* Button */}
        <button
          onClick={() => navigate("/finish-ride")}
          className="w-full bg-green-600 text-white font-semibold p-3 rounded-lg"
        >
          Complete Ride
        </button>
      </div>
    </div>
  );
};

export default CaptainRiding;