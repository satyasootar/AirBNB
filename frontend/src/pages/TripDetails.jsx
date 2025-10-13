import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { TripDetailsHeader } from '../components/Trips/TripDetailsHeader';
import { TripHeroSection } from '../components/Trips/TripHeroSection';
import { TripInfoCards } from '../components/Trips/TripInfoCards';
import { GuestInfoSection } from '../components/Trips/GuestInfoSection';
import { HostInfoSection } from '../components/Trips/HostInfoSection';
import { PaymentSummary } from '../components/Trips/PaymentSummary';
import { HelpSection } from '../components/Trips/HelpSection';
import { CancelModal } from '../components/Trips/CancelModal';
import axiosInstance from '../components/utils/axiosInstance';
import { toast } from 'react-toastify';

export const TripDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { hotels, myBookings } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

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

    if (!booking) {
        return <TripNotFound />;
    }

    const { listing_info, check_in, check_out, nights, payment, adult, children, infant, id } = booking;
    const image = hotels.find(h => h.id == listing_info.id);

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
                    <TripDetailsHeader
                        status={status}
                        onBack={() => navigate(-1)}
                        onCancel={() => setShowCancelModal(true)}
                    />

                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                        <TripHeroSection
                            image={image}
                            title={listing_info.title}
                            address={listing_info.address}
                        />

                        <div className="p-6 lg:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <TripInfoCards
                                        check_in={check_in}
                                        check_out={check_out}
                                        nights={nights}
                                        formatDate={formatDate}
                                    />

                                    <GuestInfoSection
                                        adult={adult}
                                        children={children}
                                        infant={infant}
                                    />

                                    <HostInfoSection host={listing_info.host} />
                                </div>

                                <div className="space-y-6">
                                    <PaymentSummary
                                        payment={payment}
                                        onContactHost={() => { }}
                                        onGetDirections={() => { }}
                                    />
                                    <HelpSection />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CancelModal
                show={showCancelModal}
                loading={loading}
                onClose={() => setShowCancelModal(false)}
                onConfirm={() => deleteBooking(id)}
            />
        </>
    );
};