import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import axiosInstance from '../components/utils/axiosInstance';
import { toast } from 'react-toastify';
import TripCard_Profile from '../components/Profile/TripCard_Profile';

export const Profile = () => {
    const { user,refreshUser, trips } = useContext(StoreContext);
    const [activeTab, setActiveTab] = useState('trips');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    }); 
    const [isUploading, setIsUploading] = useState(false);

   const mockFavorites = [
    { id: 1, title: 'Lake Palace Udaipur', location: 'Udaipur, Rajasthan', price: '₹2891', image: 'https://picsum.photos/seed/udaipur/300/200' },
    { id: 2, title: 'Serene Kerala Backwaters', location: 'Alleppey, Kerala', price: '₹1452', image: 'https://picsum.photos/seed/alleppey/300/200' },
    { id: 3, title: 'Royal Rajputana Heritage', location: 'Jaipur, Rajasthan', price: '₹165', image: 'https://picsum.photos/seed/jaipur/300/200' },
    { id: 4, title: 'Himalayan Mountain Retreat', location: 'Darjeeling, West Bengal', price: '₹1203', image: 'https://picsum.photos/seed/darjeeling/300/200' },
    { id: 5, title: 'Golden Temple View Stay', location: 'Amritsar, Punjab', price: '₹9942', image: 'https://picsum.photos/seed/amritsar/300/200' },
    { id: 6, title: 'Goan Beachfront Villa', location: 'North Goa, Goa', price: '₹2102', image: 'https://picsum.photos/seed/goa/300/200' }
];

    const formatJoinDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert('Image size should be less than 5MB');
            event.target.value = '';
            return;
        }
        const formData = new FormData();
        formData.append('profile_pic', file);

        setIsUploading(true);
        try {
            const response = await axiosInstance.patch(
                '/api/auth/me/',      
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            console.log('Upload progress:', percent, '%');
                        }
                    }
                }
            );

            if (response.status >= 200 && response.status < 300) {
                refreshUser()
                console.log('Profile image updated successfully');

                toast.success('Profile updated');

            } else {
                console.error('Upload failed', response);
                alert('Failed to upload image. Try again.');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            const msg = error?.response?.data?.detail || error?.message || 'Error uploading image';
            alert(msg);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };


    const getInitials = (username) => {
        return username ? username.charAt(0).toUpperCase() : 'U';
    };

    const getProfileBackgroundColor = (username) => {
        const colors = ['#FF385C', '#E31C5F', '#222222', '#717171', '#DDDDDD'];
        const index = username ? username.charCodeAt(0) % colors.length : 0;
        return colors[index];
    };

    useEffect(() => {
        ; (async () => {
            let res = await myBookings();
            setTrips(res || []);
        })()
    }, []);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-white pb-12">
            {/* Header */}
            <div className="border-b border-gray-2 pb-8 pt-6">
                <div className="max-w-6xl mx-auto px-8">
                    <h1 className="text-3xl font-semibold text-black">Account</h1>
                    <div className="flex items-center mt-6 space-x-6">
                        {/* Profile Image */}
                        <div className="relative">
                            {user?.profile_pic ? (
                                <img
                                    src={user.profile_pic}
                                    alt={user.username}
                                    className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-card"
                                />
                            ) : (
                                <div
                                    className="circular-profile w-24 h-24 text-white text-2xl"
                                    style={{ backgroundColor: getProfileBackgroundColor(user?.username) }}
                                >
                                    {getInitials(user?.username)}
                                </div>
                            )}

                            <label
                                htmlFor="profile-upload"
                                className={`absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-card border border-gray-2 cursor-pointer hover:shadow-md transition-shadow ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isUploading ? (
                                    <svg className="animate-spin h-4 w-4 text-gray-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-3 mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                                            className="w-full max-w-md px-3 py-2 border border-gray-2 rounded-md focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-3 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            disabled
                                            className="w-full max-w-md px-3 py-2 border border-gray-2 rounded-md bg-gray-1 text-gray-3 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-3 mt-1">Email cannot be changed</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            // onClick={handleSaveProfile}
                                            className="bg-airbnb text-white px-6 py-2 rounded-md hover:bg-airbnb-dark transition-colors disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset to original values
                                                setProfileData({
                                                    username: user?.username || '',
                                                    email: user?.email || ''
                                                });
                                            }}
                                            className="border border-gray-3 text-gray-3 px-6 py-2 rounded-md hover:border-black hover:text-black transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-semibold text-black">{user?.username}</h2>
                                    <p className="text-gray-3 mt-1">{user?.email}</p>
                                    <p className="text-gray-3 text-sm mt-2">
                                        Joined {user?.date_joined ? formatJoinDate(user.date_joined) : 'Unknown'}
                                    </p>
                                    <div className="flex items-center mt-4 space-x-3">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="border border-black text-black px-6 py-2 rounded-md hover:bg-gray-1 transition-colors"
                                        >
                                            Edit profile
                                        </button>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user?.role === 'GU'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-airbnb text-white'
                                            }`}>
                                            {user?.role === 'GU' ? 'Guest' : 'Host'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-2">
                <div className="max-w-6xl mx-auto px-8">
                    <nav className="flex space-x-8 -mb-px">
                        {[
                            { id: 'trips', label: 'Trips', count: trips?.length },
                            { id: 'favorites', label: 'Favorites', count: mockFavorites.length },
                            { id: 'account', label: 'Account' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${activeTab === tab.id
                                        ? 'border-airbnb text-airbnb'
                                        : 'border-transparent text-gray-3 hover:text-gray-700'
                                    }`}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span className="bg-gray-2 text-gray-3 rounded-full px-2 py-0.5 text-xs">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto px-8 py-8">
                {/* Trips Tab */}
                {activeTab === 'trips' && (
                    <div>
                        <h3 className="text-2xl font-semibold text-black mb-6">Your Trips</h3>
                        {trips?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trips.map((trip) => (
                                    <TripCard_Profile key={trip.id} trip={trip} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-black mb-2">No trips booked...yet!</h4>
                                <p className="text-gray-3 mb-4">Start planning your next adventure</p>
                                <button className="bg-airbnb text-white px-6 py-3 rounded-md hover:bg-airbnb-dark transition-colors">
                                    Start searching
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Favorites Tab */}
                {activeTab === 'favorites' && (
                    <div>
                        <h3 className="text-2xl font-semibold text-black mb-6">Your Favorites</h3>
                        {mockFavorites.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {mockFavorites.map((item) => (
                                    <div key={item.id} className="group">
                                        <div className="relative overflow-hidden rounded-md mb-2">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <button className="absolute top-3 right-3 text-white hover:text-airbnb transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h4 className="font-semibold text-black mb-1">{item.title}</h4>
                                        <p className="text-gray-3 text-sm mb-1">{item.location}</p>
                                        <p className="text-black font-medium">{item.price} night</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-black mb-2">No favorites yet</h4>
                                <p className="text-gray-3 mb-4">Save properties you'd like to visit</p>
                                <button className="bg-airbnb text-white px-6 py-3 rounded-md hover:bg-airbnb-dark transition-colors">
                                    Explore homes
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};