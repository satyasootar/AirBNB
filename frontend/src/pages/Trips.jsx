import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { TripCard } from '../components/Trips/TripCard';
import { TripsSkeleton } from '../components/Trips/TripSkeleton';



const Trips = () => {
    const { trips, tripLoading } = useContext(StoreContext);
    // const [bookings, setBookings] = useState([]);
    // const [error, setError] = useState(null);


    if (tripLoading) return <TripsSkeleton />;

    // if (error) return <div>Error: {error}</div>;

    if (trips.length === 0) return <div>There are no trips</div>;

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-black mb-2">Your Trips</h1>
                    <p className="text-gray-3">Manage your upcoming and past bookings</p>
                </div>

                {/* Filters */}
                <div className="flex gap-3 mb-8">
                    <button className="px-4 py-2 bg-airbnb text-white rounded-lg text-sm font-medium">
                        All Trips
                    </button>
                    <button className="px-4 py-2 border border-gray-2 rounded-lg text-sm font-medium text-gray-3 hover:border-black hover:text-black transition-colors">
                        Upcoming
                    </button>
                    <button className="px-4 py-2 border border-gray-2 rounded-lg text-sm font-medium text-gray-3 hover:border-black hover:text-black transition-colors">
                        Completed
                    </button>
                </div>

                {/* Trips List */}
                <div className="mb-8">
                    {trips.map(booking => (
                        <TripCard key={booking.id} booking={booking} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Trips;