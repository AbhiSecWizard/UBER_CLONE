import { FaLocationDot } from "react-icons/fa6";

const LocationSearchPanel = ({
 suggestions,
  setPickup,
  setDestination,
  activeInput,
  ignoreNextCall,setSuggestions,
}) => {
  const getLocationName = (item) => {
    // 🔥 Check your API response: Is it 'description' or 'display_name'?
    // Agar aap Google Maps API use kar rahe hain toh 'description' hota hai.
    return item.description || item.display_name || item.name || "Unknown location";
  };

  return (
    <div className="space-y-3 pb-10">
      {suggestions.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">Start typing...</p>
      ) : (
        suggestions.map((item, index) => {
          const locationName = getLocationName(item);

          return (
            <div
              key={index}
             onClick={() => {
  ignoreNextCall.current = true;

  if (activeInput === "pickup") {
    setPickup(locationName);
  } else {
    setDestination(locationName);
  }

  setSuggestions([]); // 🔥 hide list
}}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-50 shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              <div className="bg-gray-100 text-black p-3 rounded-full">
                <FaLocationDot size={18} />
              </div>
              <h4 className="font-medium text-sm text-gray-800">{locationName}</h4>
            </div>
          );
        })
      )}
    </div>
  );
};
export default LocationSearchPanel