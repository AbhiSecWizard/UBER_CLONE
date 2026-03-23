import { useEffect, useRef } from "react";
import gsap from "gsap";

const RideDetail = ({ ride, close }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (ride) {
      gsap.fromTo(
        panelRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.4 }
      );
    }
  }, [ride]);

  if (!ride) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={close}
        className="fixed inset-0 bg-black/50 z-[60]"
      />

      {/* PANEL */}
      <div
        ref={panelRef}
        className="fixed bottom-0 w-full h-[75vh] bg-white z-[70] rounded-t-3xl p-5"
      >
        <button onClick={close} className="absolute right-4 top-4">
          ✕
        </button>

        <div className="text-center mt-10">
          <img src={ride.image} className="h-24 mx-auto mb-4" />

          <h2 className="text-2xl font-bold">{ride.name}</h2>
          <p className="text-gray-500">Best ride for you</p>

          <p className="text-xl mt-3">₹{ride.price}</p>

          <button className="mt-6 w-full bg-black text-white py-3 rounded-xl">
            Confirm Ride
          </button>
        </div>
      </div>
    </>
  );
};

export default RideDetail;