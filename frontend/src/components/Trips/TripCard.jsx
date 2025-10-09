import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

export const TripCard = ({ booking }) => {
    const { listing_info, check_in, check_out, nights, payment, adult, children, infant } = booking;
    const { hotels } = useContext(StoreContext);

    let image = hotels.find(h => h.id == listing_info.id);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getTripStatus = (checkOut) => {
        const today = new Date();
        const checkoutDate = new Date(checkOut);
        return checkoutDate > today ? 'Upcoming' : 'Completed';
    };

    const status = getTripStatus(check_out);

    return (
        <div className="border border-gray-2 rounded-2xl overflow-hidden mb-6 hover:shadow-card transition-all duration-300 bg-white">

            <div className="bg-gray-1 px-4 py-3 border-b border-gray-2 sm:px-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-3 text-xs sm:text-sm">
                        {formatDate(check_in)} - {formatDate(check_out)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Upcoming'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-2 text-gray-3'
                        }`}>
                        {status}
                    </span>
                </div>
            </div>

            <div className="p-4 sm:p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">

                    <div className="w-full h-48 sm:w-40 sm:h-32 md:w-48 md:h-36 lg:w-56 lg:h-40">
                        <img
                            src={image?.images[0]?.url}
                            className='rounded-xl object-cover w-full h-full'
                            alt={listing_info.title}
                            onError={(e) => {
                                e.target.src = '/images/placeholder-hotel.jpg';
                                e.target.className = 'rounded-xl object-cover w-full h-full bg-gray-1';
                            }}
                        />
                    </div>


                    <div className="flex-1">

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-black mb-1 sm:text-xl line-clamp-2">
                                    {listing_info.title}
                                </h3>
                                <p className="text-gray-3 text-sm mb-2 line-clamp-1">
                                    {listing_info.address}
                                </p>
                            </div>


                            <div className="text-left sm:text-right">
                                <div className="text-xl font-semibold text-black sm:text-2xl">
                                    ₹{parseInt(payment.amount).toLocaleString("en-IN")}
                                </div>
                                <div className="text-sm text-gray-3">
                                    for {nights} night{nights > 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-3 mb-4">
                            <span>{adult} adult{adult > 1 ? 's' : ''}</span>
                            {children > 0 && <span>{children} child{children > 1 ? 'ren' : ''}</span>}
                            {infant > 0 && <span>{infant} infant{infant > 1 ? 's' : ''}</span>}
                        </div>


                        <div className="text-sm text-gray-3 mb-4">
                            Hosted by <span className="text-black font-medium">{listing_info.host.username}</span>
                        </div>


                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-2 sm:flex-row sm:justify-between sm:items-center">

                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${payment.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                <span className="text-sm text-gray-3 capitalize">
                                    Payment {payment.status}
                                </span>
                            </div>


                            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                                <button className="w-full px-4 py-2 border border-black rounded-lg text-sm font-medium text-black hover:bg-gray-1 transition-colors sm:w-auto">
                                    View details
                                </button>
                                <button className="w-full px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors sm:w-auto">
                                    Message host
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};