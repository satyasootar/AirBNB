import { useContext } from "react"
import { StoreContext } from "../../context/StoreContext"


function TripCard_Profile({ trip }) {

    const { hotels } = useContext(StoreContext)
    let image = hotels.find(h => h.id == trip.listing_info.id);
    return (
        <div className="border border-gray-2 rounded-md overflow-hidden hover:shadow-card transition-shadow">
            <div className="w-full h-48 bg-gray-1 flex items-center justify-center ">
                <img
                    src={image?.images[0]?.url}
                    className="w-full h-full object-cover"
                    alt="Description"
                />
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-black mb-1">{trip.listing_info?.title || 'Unknown Listing'}</h4>
                <p className="text-gray-3 text-sm mb-2">{trip.listing_info?.address || 'Unknown Address'}</p>
                <p className="text-black font-medium">Check-in: {trip.check_in}</p>
            </div>
        </div>
    )
}

export default TripCard_Profile