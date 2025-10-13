import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import axiosInstance from '../components/utils/axiosInstance';
import { toast } from 'react-toastify';
import Loader from '../components/utils/Loader';

export const TripDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hotels, myBookings } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Get the booking data passed from TripCard
    const { booking } = location.state || {};

    const deleteBooking = async (hotelId) => {
        try {
            setLoading(true);
            await axiosInstance.delete(`/api/bookings/${hotelId}/`);
            toast.success("Booking cancelled successfully");
            setLoading(false);
            setShowCancelModal(false);
            myBookings();
            navigate('/trips');
        } catch (error) {
            console.log("error: ", error);
            toast.error("Something went wrong");
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    if (!booking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">No trip details found</h2>
                    <p className="text-gray-600 mb-6">We couldn't find the trip details you're looking for.</p>
                    <button
                        onClick={() => navigate('/trips')}
                        className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium hover:scale-105 transform"
                    >
                        Back to Trips
                    </button>
                </div>
            </div>
        );
    }

    const { listing_info, check_in, check_out, nights, payment, adult, children, infant, id } = booking;

    // Find the hotel image
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
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group self-start"
                        >
                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back to Trips</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status === 'Upcoming'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                {status}
                            </span>
                            {status === 'Upcoming' && (
                                <button
                                    onClick={handleCancelClick}
                                    className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium hover:shadow-lg border border-red-500"
                                >
                                    Cancel Trip
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        {/* Hero Section */}
                        <div className="relative h-64 sm:h-80 lg:h-96">
                            <img
                                src={image?.images[0]?.url || '/images/placeholder-hotel.jpg'}
                                className="w-full h-full object-cover"
                                alt={listing_info.title}
                                onError={(e) => {
                                    e.target.src = '/images/placeholder-hotel.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {listing_info.title}
                                </h1>
                                <p className="text-gray-200 text-lg">{listing_info.address}</p>
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Booking Details */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Quick Info Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <div className="text-blue-600 text-sm font-medium mb-1">Check-in</div>
                                            <div className="text-lg font-semibold text-gray-900">{formatDate(check_in)}</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <div className="text-blue-600 text-sm font-medium mb-1">Check-out</div>
                                            <div className="text-lg font-semibold text-gray-900">{formatDate(check_out)}</div>
                                        </div>
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                            <div className="text-blue-600 text-sm font-medium mb-1">Duration</div>
                                            <div className="text-lg font-semibold text-gray-900">{nights} night{nights > 1 ? 's' : ''}</div>
                                        </div>
                                    </div>

                                    {/* Guest Information */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Guest Details
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-gray-900">{adult}</div>
                                                <div className="text-gray-600 text-sm">Adult{adult > 1 ? 's' : ''}</div>
                                            </div>
                                            {children > 0 && (
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-900">{children}</div>
                                                    <div className="text-gray-600 text-sm">Child{children > 1 ? 'ren' : ''}</div>
                                                </div>
                                            )}
                                            {infant > 0 && (
                                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                    <div className="text-2xl font-bold text-gray-900">{infant}</div>
                                                    <div className="text-gray-600 text-sm">Infant{infant > 1 ? 's' : ''}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Host Information */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Your Host
                                        </h3>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                {listing_info.host.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-lg">{listing_info.host.username}</p>
                                                <p className="text-gray-600">Your trusted host</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Payment Summary */}
                                <div className="space-y-6">
                                    {/* Payment Card */}
                                    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h3>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Amount</span>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ₹{parseInt(payment.amount).toLocaleString("en-IN")}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                                <span className="text-gray-600">Status</span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${payment.status === 'paid'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                    }`}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-6 space-y-3">
                                            <button className="w-full bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105 transform">
                                                Contact Host
                                            </button>
                                            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium">
                                                Get Directions
                                            </button>
                                        </div>
                                    </div>

                                    {/* Need Help Section */}
                                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Need Help?
                                        </h4>
                                        <p className="text-blue-700 text-sm mb-4">
                                            Our support team is here to help with any questions about your trip.
                                        </p>
                                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                            Contact Support
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Confirmation Modal */}
            {showCancelModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={() => setShowCancelModal(false)}
                    />

                    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-96 rounded-2xl shadow-2xl z-50 p-6'>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Cancel this trip?
                            </h3>
                            <p className="text-gray-600 text-sm mb-6">
                                This action cannot be undone. You may be subject to cancellation fees.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Keep Trip
                                </button>
                                <button
                                    onClick={() => deleteBooking(id)}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader size={16} /> : "Yes, Cancel"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};