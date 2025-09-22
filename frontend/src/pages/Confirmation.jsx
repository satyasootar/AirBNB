import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext"; // adjust path

export default function BookingConfirmation() {
    const { bookingDetails } = useContext(StoreContext);;
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (bookingDetails.current) {
            setDetails(bookingDetails.current);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingDetails.current]); 

    if (!details) {
        return <p className="text-gray-600 text-lg">Loading booking details...</p>;
    }
    const {
        destination,
        hotelId,
        checkIn,
        checkOut,
        adult,
        children,
        infant,
        cancleBy,
        cost,
        tax,
        totalcost,
    } = details;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
            {/* Confirmation Card */}
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
                {/* Header */}
                <div className="text-center border-b pb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        🎉 Booking Confirmed!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Your stay in <span className="font-medium">{destination}</span> is
                        all set.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Cancel before <span className="font-semibold">{cancleBy}</span> for
                        a full refund.
                    </p>
                </div>

                {/* Booking Summary */}
                <div className="mt-6 space-y-4">
                    <h2 className="text-lg font-medium text-gray-800">Booking Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                            <p className="text-sm text-gray-500">Hotel ID</p>
                            <p className="font-medium">{hotelId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Destination</p>
                            <p className="font-medium">{destination}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Check-In</p>
                            <p className="font-medium">{new Date(checkIn).toDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Check-Out</p>
                            <p className="font-medium">{new Date(checkOut).toDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-medium">
                                {adult} adults, {children} children, {infant} infants
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-800">Payment Summary</h2>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-gray-700">
                            <span>Room Cost</span>
                            <span>₹{cost.toLocaleString("en-In")}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                            <span>Taxes & Fees</span>
                            <span>₹{tax.toLocaleString("en-In")}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 border-t pt-3">
                            <span>Total</span>
                            <span>₹{totalcost.toLocaleString("en-In")}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center">
                    <p className="text-gray-600 text-sm">
                        A confirmation email has been sent to your registered email.
                    </p>
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-6 px-6 py-3 bg-rose-500 text-white font-medium rounded-xl shadow hover:bg-rose-600 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
