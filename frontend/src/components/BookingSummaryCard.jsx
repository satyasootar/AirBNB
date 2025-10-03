import { Star, Heart } from 'lucide-react';
import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext.js';
import { calculateDays } from './utils/CalculateDays.js';


// SKELETON COMPONENT

const BookingSummarySkeleton = () => {
    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 animate-pulse">

            {/* Property Header Skeleton */}
            <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Free Cancellation Skeleton */}
            <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Dates Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Guests Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Price Details Skeleton */}
            <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-24"></div>

                <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>

                <div className="border-gray-200 border-t pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-5 bg-gray-200 rounded w-12"></div>
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>

                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );
};



const getDates = (checkIn, checkOut) => {
    const In = new Date(checkIn);
    const Out = new Date(checkOut);

    const startDay = In.getDate();
    const endDay = Out.getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[Out.getMonth()];
    return `${startDay}-${endDay} ${month}`;
};

const getGuestText = (adult, children, infant) => {
    let guestText = `${adult} adult${adult > 1 ? "s" : ""}`;

    if (children > 0) {
        guestText += `, ${children} ${children === 1 ? "child" : "children"}`;
    }

    if (infant > 0) {
        guestText += `, ${infant} ${infant === 1 ? "infant" : "infants"}`;
    }

    return guestText;
};



export default function BookingSummaryCard({
    hotelId,
    checkIn,
    checkOut,
    adult,
    children,
    infant
}) {


    const { hotels } = useContext(StoreContext);
    const hotel = hotels.find((h) => h.id == hotelId);



    if (!hotel) {
        return <BookingSummarySkeleton />;
    }


    const nights = calculateDays(checkIn, checkOut);
    const totalCost = nights * hotel.price_per_night;
    const tax = totalCost * 0.18;
    const finalTotal = tax + totalCost;

    const checkInDate = new Date(checkIn);
    const cancelByDate = new Date(checkInDate);
    cancelByDate.setDate(checkInDate.getDate() - 1);
    const cancelByText = `${cancelByDate.getDate()} ${cancelByDate.toLocaleString('default', { month: 'long' })}`;

    const averageRating = 5;
    const guestText = getGuestText(adult, children, infant);



    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">

            {/* PROPERTY HEADER */}
            <div className="flex space-x-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                        src={hotel.images[0].url}
                        alt="Bedroom"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {hotel.title}
                    </h2>

                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-black text-black" />
                            <span className="font-medium">{averageRating.toFixed(1)}</span>
                            <span className="text-gray-600">(42)</span>
                        </div>

                        <div className="flex items-center space-x-1 text-gray-600">
                            <Heart className="w-4 h-4" />
                            <span>Guest favourite</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FREE CANCELLATION */}
            <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">Free cancellation</h3>
                <p className="text-sm text-gray-600">
                    Cancel before {cancelByText} for a full refund.{" "}
                    <span className="underline cursor-pointer">Full policy</span>
                </p>
            </div>

            {/* DATES */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dates</h3>
                    <p className="text-gray-600">{getDates(checkIn, checkOut)}</p>
                </div>
                <button className="text-sm font-medium underline text-gray-900 hover:no-underline">
                    Change
                </button>
            </div>

            {/* GUESTS */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Guests</h3>
                    <p className="text-gray-600">{guestText}</p>
                </div>
                <button className="text-sm font-medium underline text-gray-900 hover:no-underline">
                    Change
                </button>
            </div>

            {/* PRICE DETAILS */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Price details</h3>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                        {nights} nights x {hotel.price_per_night}
                    </span>
                    <span className="text-gray-900">
                        ₹{totalCost.toLocaleString('en-IN')}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="text-gray-900">
                        ₹{tax.toLocaleString('en-IN')}
                    </span>
                </div>

                <hr className="border-gray-200" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-sm text-gray-600 font-medium">INR</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                        ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                </div>

                <button className="text-sm font-medium underline text-gray-900 hover:no-underline">
                    Price breakdown
                </button>
            </div>
        </div>
    );
}