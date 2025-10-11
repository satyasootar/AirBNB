import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { SearchCard } from "../components/utils/SearchCard";
import { seededValueInRange } from "../components/utils/seededValueInRange";

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

const SearchResultsSkeleton = () => {
    return (
        <div className="flex justify-between py-15 relative animate-pulse">

            {/* Left side - Hotels Skeleton */}
            <div className="flex flex-wrap gap-6 h-full">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex-shrink-0">
                        <div className="w-80 h-96 bg-gray-200 rounded-xl"></div>
                    </div>
                ))}
            </div>

            {/* Right side - Map Skeleton */}
            <div className="sticky top-10 self-start hidden lg:block">
                <div className="w-[588px] h-[588px] rounded-2xl overflow-hidden shadow-lg bg-gray-200"></div>
            </div>
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const SearchResults = () => {
    // ============================================================================
    // HOOKS & CONTEXT
    // ============================================================================

    const { city } = useParams();
    const { hotels, userData } = useContext(StoreContext);

    // ============================================================================
    // STATE - MOVED TO TOP (FIXES THE HOOKS ERROR)
    // ============================================================================

    const [selectedHotel, setSelectedHotel] = useState(null);

    // ============================================================================
    // DATA PROCESSING
    // ============================================================================

    const searchHotel = hotels.filter(
        (h) => h.location.city.toLowerCase() === city.toLowerCase()
    );

    // ============================================================================
    // LOADING STATE
    // ============================================================================

    if (hotels.length === 0) {
        return <SearchResultsSkeleton />;
    }

    // ============================================================================
    // EARLY RETURNS
    // ============================================================================

    if (!searchHotel.length) {
        return (
            <p className="text-center text-lg">
                No hotels found in {city}.
            </p>
        );
    }

    // ============================================================================
    // CALCULATIONS
    // ============================================================================

    // Set default selected hotel if not already set
    const currentSelectedHotel = selectedHotel || searchHotel[2] || searchHotel[0];

    const mapSrc = `https://maps.google.com/maps?q=${currentSelectedHotel.location.lat},${currentSelectedHotel.location.lon}&z=15&hl=en&output=embed`;



    return (
        <div className="flex justify-between py-15 relative">

            {/* LEFT SIDE - HOTELS LIST */}
            <div className="flex flex-wrap gap-6 h-full">
                {searchHotel.map((item) => (
                    <div
                        key={item.id}
                        onMouseEnter={() => setSelectedHotel(item)}
                        className="flex-shrink-0"
                    >
                        <SearchCard
                            image={item?.images[1]?.url}
                            hotelName={item.title}
                            price={item.price_per_night}
                            ratings={seededValueInRange(item.price_per_night)}
                            id={item.id}
                            checkIn={userData.current.checkIn}
                            checkOut={userData.current.checkOut}
                            rooms={item.rooms[0]}
                        />
                    </div>
                ))}
            </div>

            {/* RIGHT SIDE - MAP */}
            <div className="sticky top-10 self-start hidden lg:block">
                <div className="w-[588px] h-[588px] rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        title="Google Map"
                        src={mapSrc}
                        className="w-full h-full border-0"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};