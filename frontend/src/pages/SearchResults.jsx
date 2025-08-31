import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { SearchCard } from "../components/utils/SearchCard";

export const SearchResults = () => {
    const { city } = useParams();
    const { hotels } = useContext(StoreContext);

    const searchHotel = hotels.hotels.filter(
        (h) => h.location.city.toLowerCase() === city.toLowerCase()
    );

    const [selectedHotel, setSelectedHotel] = useState(searchHotel[0] || null);

    if (!searchHotel.length) {
        return <p className="text-center text-lg">No hotels found in {city}.</p>;
    }

    const mapSrc = `https://maps.google.com/maps?q=${selectedHotel.location.lat},${selectedHotel.location.lon}&z=15&hl=en&output=embed`;

    return (
        <div className="flex justify-between py-15 relative">
            {/* Left side - Hotels */}
            <div className="flex flex-wrap gap-6 h-full">
                {searchHotel.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedHotel(item)}
                        className="flex-shrink-0"
                    >
                        <SearchCard
                            image={item.images[1].url}
                            hotelName={item.title}
                            price={item.price_per_night}
                            ratings={item.reviews[0].ratings}
                            id={item.id}
                        />
                    </div>
                ))}
            </div>

            {/* Right side - Map */}
            <div className="sticky top-10 self-start">
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
