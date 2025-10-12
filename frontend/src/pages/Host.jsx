import { useState, useEffect } from 'react';
import axiosInstance from '../components/utils/axiosInstance';
import { toast } from 'react-toastify';

export const Host = () => {
    const [user, setUser] = useState(null);
    const [currentFlow, setCurrentFlow] = useState('dashboard');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [converting, setConverting] = useState(false);
    const [listingId, setListingId] = useState()
    const [formStep, setFormStep] = useState(1);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        multiple_rooms: 0,
        rooms: [{ bedroom: 1, bathroom: 1, beds: 1, guest: 1 }],
        location: { city: '', state: '', country: 'India', lat: '', lon: '' },
        address: '',
        price_per_night: 0,
        offersOrExtras: []
    });

    const [images, setImages] = useState([]);

    const amenities = [
        'Wi-fi', 'Parking', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning',
        'Heating', 'TV', 'Breakfast', 'Lunch', 'Dinner', 'Cab Services',
        'Swimming Pool', 'Gym', 'Hot tub', 'Workspace'
    ];

    useEffect(() => {
        fetchUserData();
        fetchListings();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/listings/?role=host');
            console.log("response: ", response.data.results);
            setListings(response.data.results || []);
        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertToHost = async () => {
        try {
            setConverting(true);
            const response = await axiosInstance.patch('/api/auth/me/', { role: 'HO' });
            setUser(response.data);
            toast.success('Successfully became a host!');
            setCurrentFlow('dashboard');
        } catch (error) {
            toast.error('Failed to convert to host. Please try again.');
            console.error('Error converting to host:', error);
        } finally {
            setConverting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value
            }
        }));
    };

    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...formData.rooms];
        updatedRooms[index] = {
            ...updatedRooms[index],
            [field]: Math.max(1, parseInt(value) || 1)
        };
        setFormData(prev => ({
            ...prev,
            rooms: updatedRooms
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            offersOrExtras: prev.offersOrExtras.includes(amenity)
                ? prev.offersOrExtras.filter(a => a !== amenity)
                : [...prev.offersOrExtras, amenity]
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return formData.title.trim().length > 0 &&
                    formData.description.trim().length > 0 &&
                    formData.title.length <= 50 &&
                    formData.description.length <= 500;
            case 2:
                return formData.rooms.every(room =>
                    room.bedroom >= 1 && room.bathroom >= 1 &&
                    room.beds >= 1 && room.guest >= 1
                );
            case 3:
                return formData.address.trim().length > 0 &&
                    formData.location.city.trim().length > 0 &&
                    formData.location.state.trim().length > 0 &&
                    formData.location.country.trim().length > 0;
            case 4:
                return formData.price_per_night > 0;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(formStep)) {
            setFormStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setFormStep(prev => prev - 1);
    };

    const submitListing = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/listings/', formData);
            setListingId(response.data.id)
            console.log("Listing Uploaded ", response);
            toast.success('Listing created successfully!');
            setCurrentFlow('image-upload');
            console.log("Listing ID: ", response.data.id);
            return response.data.id;
        } catch (error) {
            toast.error('Failed to create listing. Please try again.');
            console.error('Error creating listing:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (files) => {
        const validFiles = Array.from(files).filter(file =>
            ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type) &&
            file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length + images.length > 15) {
            toast.error('Maximum 15 images allowed');
            return;
        }

        setImages(prev => [...prev, ...validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substr(2, 9)
        }))]);
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const uploadImages = async (listingId) => {
        if (images.length < 5) {
            toast.error('Minimum 5 images required');
            return false;
        }

        try {
            setUploadingImages(true);
            const uploadPromises = images.map(async (image) => {
                const formData = new FormData();
                formData.append('image', image.file);

                const response = await axiosInstance.post(`/api/listings/${listingId}/images/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        setUploadProgress(prev => ({
                            ...prev,
                            [image.id]: Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        }));
                    }
                });

                console.log("Image uploaded: ", response);
                return response.data;
            });

            await Promise.all(uploadPromises);
            toast.success('Images uploaded successfully!');
            setCurrentFlow('dashboard');
            fetchListings();
            return true;
        } catch (error) {
            toast.error('Failed to upload some images. Please try again.');
            console.error('Error uploading images:', error);
            return false;
        } finally {
            setUploadingImages(false);
            setUploadProgress({});
        }
    };

    const handleImageSubmit = async () => {
        if (listingId) {
            await uploadImages(listingId);
        }
    };

    if (user?.role === 'GU' && currentFlow !== 'conversion') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Become a Host</h2>
                    <p className="text-gray-600 mb-6">Share your space and start earning extra income</p>
                    <button
                        onClick={() => setCurrentFlow('conversion')}
                        className="bg-gradient-to-r from-[#FF385C] to-[#FF385C] text-white px-8 py-3 rounded-lg hover:from-[#E31C5F] hover:to-[#E31C5F] transition-all duration-200 font-medium"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        );
    }

    if (currentFlow === 'conversion') {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Share your space with travelers</h1>
                        <p className="text-xl text-gray-600">Join thousands of hosts earning extra income</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#00A699] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Earn Extra Income</h3>
                            <p className="text-gray-600">Turn your empty space into extra cash</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FF385C] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Meet Travelers</h3>
                            <p className="text-gray-600">Connect with people from around the world</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FFB400] rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Full Protection</h3>
                            <p className="text-gray-600">We've got your back with host guarantees</p>
                        </div>
                    </div>

                    <div className="text-center space-x-4">
                        <button
                            onClick={convertToHost}
                            disabled={converting}
                            className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50"
                        >
                            {converting ? 'Converting...' : 'Continue as Host'}
                        </button>
                        <button
                            onClick={() => setCurrentFlow('dashboard')}
                            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-gray-400 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentFlow === 'image-upload') {
        return (
            <div className="min-h-screen bg-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Add Photos</h1>
                        <p className="text-gray-600">Upload at least 5 photos of your property</p>
                    </div>

                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-8 cursor-pointer hover:border-[#FF385C] transition-colors"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-[#FF385C]', 'bg-red-50');
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-[#FF385C]', 'bg-red-50');
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-[#FF385C]', 'bg-red-50');
                            handleImageUpload(e.dataTransfer.files);
                        }}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            id="image-upload"
                            onChange={(e) => handleImageUpload(e.target.files)}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-900 mb-2">Drag your photos here</p>
                            <p className="text-gray-600 mb-4">Choose at least 5 photos</p>
                            <button className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E31C5F] transition-colors">
                                Choose Files
                            </button>
                        </label>
                    </div>

                    {images.length > 0 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {images.length} {images.length === 1 ? 'photo' : 'photos'} selected
                                    {images.length < 5 && ` (${5 - images.length} more needed)`}
                                </h3>
                                {images.length >= 5 && (
                                    <button
                                        onClick={handleImageSubmit}
                                        disabled={uploadingImages}
                                        className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E31C5F] transition-colors disabled:opacity-50"
                                    >
                                        {uploadingImages ? 'Uploading...' : 'Submit Photos'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div key={image.id} className="relative group">
                                        <img
                                            src={image.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                        {index === 0 && (
                                            <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                                Cover
                                            </span>
                                        )}
                                        <button
                                            onClick={() => removeImage(image.id)}
                                            className="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        {uploadProgress[image.id] !== undefined && (
                                            <div className="absolute bottom-2 left-2 right-2 bg-white bg-opacity-90 rounded-full h-2">
                                                <div
                                                    className="bg-[#FF385C] h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress[image.id]}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (currentFlow === 'create-listing') {
        return (
            <div className="min-h-screen bg-white py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-semibold text-gray-900">Create New Listing</h1>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((stepNum) => (
                                    <div key={stepNum} className="flex items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${formStep >= stepNum
                                                    ? 'bg-[#FF385C] text-white'
                                                    : 'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {stepNum}
                                        </div>
                                        {stepNum < 5 && (
                                            <div
                                                className={`w-8 h-1 ${formStep > stepNum ? 'bg-[#FF385C]' : 'bg-gray-200'
                                                    }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600">Step {formStep} of 5</p>
                    </div>

                    {formStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                    placeholder="e.g., Beautiful Beachfront Villa"
                                    maxLength={50}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.title.length}/50
                                </div>
                                {formData.title.length === 0 && (
                                    <p className="text-red-500 text-sm mt-1">Title is required</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                    placeholder="Describe your property..."
                                    maxLength={500}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {formData.description.length}/500
                                </div>
                                {formData.description.length === 0 && (
                                    <p className="text-red-500 text-sm mt-1">Description is required</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Does this property have multiple room configurations?
                                </label>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => {
                                            handleInputChange('multiple_rooms', 1);
                                            handleInputChange('rooms', [{ bedroom: 1, bathroom: 1, beds: 1, guest: 1 }]);
                                        }}
                                        className={`px-6 py-3 border rounded-lg font-medium ${formData.multiple_rooms === 1
                                                ? 'border-[#FF385C] bg-red-50 text-[#FF385C]'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleInputChange('multiple_rooms', 0);
                                            handleInputChange('rooms', [{ bedroom: 1, bathroom: 1, beds: 1, guest: 1 }]);
                                        }}
                                        className={`px-6 py-3 border rounded-lg font-medium ${formData.multiple_rooms === 0
                                                ? 'border-[#FF385C] bg-red-50 text-[#FF385C]'
                                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {formData.multiple_rooms === 1 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        How many different room configurations?
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={formData.rooms.length}
                                        onChange={(e) => {
                                            const count = Math.max(1, parseInt(e.target.value) || 1);
                                            const newRooms = Array(count).fill().map((_, i) =>
                                                formData.rooms[i] || { bedroom: 1, bathroom: 1, beds: 1, guest: 1 }
                                            );
                                            handleInputChange('rooms', newRooms);
                                        }}
                                        className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {formStep === 2 && (
                        <div className="space-y-6">
                            {formData.rooms.map((room, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Room Configuration {formData.rooms.length > 1 ? index + 1 : ''}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => handleRoomChange(index, 'bedroom', room.bedroom - 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium w-8 text-center">{room.bedroom}</span>
                                                <button
                                                    onClick={() => handleRoomChange(index, 'bedroom', room.bedroom + 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => handleRoomChange(index, 'bathroom', room.bathroom - 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium w-8 text-center">{room.bathroom}</span>
                                                <button
                                                    onClick={() => handleRoomChange(index, 'bathroom', room.bathroom + 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => handleRoomChange(index, 'beds', room.beds - 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium w-8 text-center">{room.beds}</span>
                                                <button
                                                    onClick={() => handleRoomChange(index, 'beds', room.beds + 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                                            <div className="flex items-center space-x-4">
                                                <button
                                                    onClick={() => handleRoomChange(index, 'guest', room.guest - 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    -
                                                </button>
                                                <span className="text-lg font-medium w-8 text-center">{room.guest}</span>
                                                <button
                                                    onClick={() => handleRoomChange(index, 'guest', room.guest + 1)}
                                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {formStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                    placeholder="Full street address"
                                />
                                {formData.address.length === 0 && (
                                    <p className="text-red-500 text-sm mt-1">Address is required</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        value={formData.location.city}
                                        onChange={(e) => handleLocationChange('city', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                    />
                                    {formData.location.city.length === 0 && (
                                        <p className="text-red-500 text-sm mt-1">City is required</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                                    <input
                                        type="text"
                                        value={formData.location.state}
                                        onChange={(e) => handleLocationChange('state', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                    />
                                    {formData.location.state.length === 0 && (
                                        <p className="text-red-500 text-sm mt-1">State is required</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input
                                    type="text"
                                    value={formData.location.country}
                                    onChange={(e) => handleLocationChange('country', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                />
                                {formData.location.country.length === 0 && (
                                    <p className="text-red-500 text-sm mt-1">Country is required</p>
                                )}
                            </div>

                            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <h4 className="font-medium text-gray-900 mb-4">Map Location</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    For now, please use an external mapping service to get coordinates, then enter them below.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                                        <input
                                            type="text"
                                            value={formData.location.lat}
                                            onChange={(e) => handleLocationChange('lat', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                            placeholder="e.g., 20.296059"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                                        <input
                                            type="text"
                                            value={formData.location.lon}
                                            onChange={(e) => handleLocationChange('lon', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                            placeholder="e.g., 85.824539"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {formStep === 4 && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night (₹)</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.price_per_night}
                                    onChange={(e) => handleInputChange('price_per_night', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                                />
                                {formData.price_per_night <= 0 && (
                                    <p className="text-red-500 text-sm mt-1">Price must be greater than 0</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Amenities & Services</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {amenities.map((amenity) => (
                                        <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.offersOrExtras.includes(amenity)}
                                                onChange={() => handleAmenityToggle(amenity)}
                                                className="w-4 h-4 text-[#FF385C] focus:ring-[#FF385C] border-gray-300 rounded"
                                            />
                                            <span className="text-sm text-gray-700">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {formStep === 5 && (
                        <div className="space-y-6">
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Summary</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Title</h4>
                                            <p className="text-gray-600">{formData.title}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormStep(1)}
                                            className="text-[#FF385C] hover:text-[#E31C5F] text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Description</h4>
                                            <p className="text-gray-600">{formData.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormStep(1)}
                                            className="text-[#FF385C] hover:text-[#E31C5F] text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Room Configuration</h4>
                                            {formData.rooms.map((room, index) => (
                                                <p key={index} className="text-gray-600">
                                                    {room.bedroom} bedroom, {room.bathroom} bathroom, {room.beds} beds, sleeps {room.guest}
                                                </p>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setFormStep(2)}
                                            className="text-[#FF385C] hover:text-[#E31C5F] text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Location</h4>
                                            <p className="text-gray-600">{formData.address}</p>
                                            <p className="text-gray-600">{formData.location.city}, {formData.location.state}, {formData.location.country}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormStep(3)}
                                            className="text-[#FF385C] hover:text-[#E31C5F] text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pricing & Amenities</h4>
                                            <p className="text-gray-600">₹{formData.price_per_night} per night</p>
                                            <p className="text-gray-600">{formData.offersOrExtras.join(', ')}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormStep(4)}
                                            className="text-[#FF385C] hover:text-[#E31C5F] text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={prevStep}
                            disabled={formStep === 1}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        {formStep < 5 ? (
                            <button
                                onClick={nextStep}
                                disabled={!validateStep(formStep)}
                                className="bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E31C5F] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={submitListing}
                                disabled={loading}
                                className="bg-[#FF385C] text-white px-6 py-3 rounded-lg hover:bg-[#E31C5F] disabled:opacity-50"
                            >
                                {loading ? 'Creating Listing...' : 'Create Listing'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900">Host Dashboard</h1>
                    <p className="text-gray-600 mt-2">Manage your listings and hosting activities</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-2xl p-8 text-white mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Ready to host?</h2>
                            <p className="mb-6 opacity-90">Create a new listing and start earning from your space</p>
                            <button
                                onClick={() => setCurrentFlow('create-listing')}
                                className="bg-white text-[#FF385C] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Create New Listing
                            </button>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Listings</h3>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : listings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {listings.map((listing) => (
                                        <div key={listing.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="h-48 bg-gray-200">
                                                {listing.images?.[0] && (
                                                    <img
                                                        src={listing.images[0].url}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-semibold text-gray-900 mb-2">{listing.title}</h4>
                                                <p className="text-gray-600 text-sm mb-2">{listing.location?.city}, {listing.location?.state}</p>
                                                <p className="text-gray-900 font-semibold">₹{listing.price_per_night} night</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h4>
                                    <p className="text-gray-600 mb-4">Create your first listing to start hosting</p>
                                    <button
                                        onClick={() => setCurrentFlow('create-listing')}
                                        className="bg-[#FF385C] text-white px-6 py-2 rounded-lg hover:bg-[#E31C5F] transition-colors"
                                    >
                                        Create Listing
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Host Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Listings</span>
                                    <span className="font-semibold">{listings.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                        Active Host
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setCurrentFlow('create-listing')}
                                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-[#FF385C] hover:bg-red-50 transition-colors"
                                >
                                    <div className="font-medium text-gray-900">Create New Listing</div>
                                    <div className="text-sm text-gray-600">Add a new property</div>
                                </button>

                                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                                    <div className="font-medium text-gray-900">View Calendar</div>
                                    <div className="text-sm text-gray-600">Manage availability</div>
                                </button>

                                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                                    <div className="font-medium text-gray-900">Message Center</div>
                                    <div className="text-sm text-gray-600">Guest communications</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

