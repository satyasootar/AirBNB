import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Share, Heart, Grip, DoorClosed, MessageCircleHeart, CircleParking, Shell, Wifi, Car, WashingMachine, BellOff, ChevronUp, ChevronDown, AirVent, Tv, Briefcase, CookingPot, BellRing } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { GuestFavCard } from '../components/utils/GuestFavCard';
import { Amenities } from '../components/utils/amenities';
import { Features } from '../components/utils/Features';
import { RatingsBar } from '../components/utils/RatingsBar';
import { RatingIcon } from '../components/utils/RatingIcon';
import ReviewCard from '../components/utils/ReviewCard';
import MapEmbed from '../components/MapEmbed';
import { StoreContext } from '../context/StoreContext.js';
import { calculateDays } from '../components/utils/CalculateDays.js';
import HotelGallery from '../components/Room/HotelGallery.jsx';
import AboutPlace from '../components/Room/AboutPlace.jsx';
import RareFind from '../components/utils/RareFind.jsx';
import GuestFavourite from '../components/Room/GuestFavourite.jsx';
import { seededValueInRange } from '../components/utils/seededValueInRange.jsx';

const Room = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData, updateUserData, hotels } = useContext(StoreContext)
    const hotel = hotels.find(hotel => hotel.id === parseInt(id))
    const bookingData = JSON.parse(localStorage.getItem("userData"))
    const [isChevronUp, setIsChevornUp] = useState(false)
    const [isDropdownOn, setIsDropdownOn] = useState(false)

    const [adult, setAdult] = useState(1)
    const [children, setChildren] = useState(0)
    const [infant, setInfant] = useState(0)

    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")

    const nights = calculateDays(checkIn, checkOut);

    const aminites = [
        {
            Icon: DoorClosed,
            title: "Self check-in",
            description: "Check yourself in with the smartlock.",
        },
        {
            Icon: CircleParking,
            title: "Park for free",
            description: "This is one of the few places in the area with free parking."
        },
        {
            Icon: MessageCircleHeart,
            title: "Exceptional Host communication",
            description: "Recent guests gave Host a 5-star rating for communication."
        },
    ]

    const features = [
        {
            icon: Shell,
            title: "Shared beach access"
        },
        {
            icon: Wifi,
            title: "Free Wifi"
        },
        {
            icon: Car,
            title: "Free parking on premises"
        },
        {
            icon: WashingMachine,
            title: "Washing machine"
        },
        {
            icon: BellOff,
            title: "Carbon monoxide alarm",
            strikethrough: true
        },
        {
            icon: CookingPot,
            title: "Kitchen"
        },
        {
            icon: Briefcase,
            title: "Dedicated Workspace"
        },
        {
            icon: Tv,
            title: "TV"
        },
        {
            icon: AirVent,
            title: "Air Conditioning"
        },
        {
            icon: BellRing,
            title: "Smoke alarm",
            strikethrough: true
        },
    ]
    const rating = [
        {
            num: 5,
            percent: 90
        },
        {
            num: 4,
            percent: 50
        },
        {
            num: 3,
            percent: 30
        },
        {
            num: 2,
            percent: 20
        },
        {
            num: 1,
            percent: 10
        },
    ]
    const rate = [
        {
            category: "Cleanliness",
            icon: <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="w-6 h-6 fill-current text-gray-800"
            >
                <path d="M24 0v6h-4.3c.13 1.4.67 2.72 1.52 3.78l.2.22-1.5 1.33a9.05 9.05 0 0 1-2.2-5.08c-.83.38-1.32 1.14-1.38 2.2v4.46l4.14 4.02a5 5 0 0 1 1.5 3.09l.01.25.01.25v8.63a3 3 0 0 1-2.64 2.98l-.18.01-.21.01-12-.13A3 3 0 0 1 4 29.2L4 29.02v-8.3a5 5 0 0 1 1.38-3.45l.19-.18L10 12.9V8.85l-4.01-3.4.02-.7A5 5 0 0 1 10.78 0H11zm-5.03 25.69a8.98 8.98 0 0 1-6.13-2.41l-.23-.23A6.97 6.97 0 0 0 6 21.2v7.82c0 .51.38.93.87 1H7l11.96.13h.13a1 1 0 0 0 .91-.88l.01-.12v-3.52c-.34.04-.69.06-1.03.06zM17.67 2H11a3 3 0 0 0-2.92 2.3l-.04.18-.01.08 3.67 3.1h2.72l.02-.1a4.29 4.29 0 0 1 3.23-3.4zM30 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-3-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-5 0h-2.33v2H22zm8-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM20 20.52a3 3 0 0 0-.77-2l-.14-.15-4.76-4.61v-4.1H12v4.1l-5.06 4.78a3 3 0 0 0-.45.53 9.03 9.03 0 0 1 7.3 2.34l.23.23A6.98 6.98 0 0 0 20 23.6z"></path>
            </svg>
        },
        {
            category: "Accuracy",
            icon: <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="h-6 w-6 text-green-500"
            >
                <path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 2a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm7 7.59L24.41 12 13.5 22.91 7.59 17 9 15.59l4.5 4.5z"></path>
            </svg>
        },
        {
            category: "Check-in",
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
                className="w-6 h-6 text-yellow-500">
                <path d="M16.84 27.16v-3.4l-.26.09c-.98.32-2.03.51-3.11.55h-.7A11.34 11.34 0 0 1 1.72 13.36v-.59A11.34 11.34 0 0 1 12.77 1.72h.59c6.03.16 10.89 5.02 11.04 11.05V13.45a11.3 11.3 0 0 1-.9 4.04l-.13.3 7.91 7.9v5.6H25.7l-4.13-4.13zM10.31 7.22a3.1 3.1 0 1 1 0 6.19 3.1 3.1 0 0 1 0-6.2zm0 2.06a1.03 1.03 0 1 0 0 2.06 1.03 1.03 0 0 0 0-2.06zM22.43 25.1l4.12 4.13h2.67v-2.67l-8.37-8.37.37-.68.16-.3c.56-1.15.9-2.42.96-3.77v-.64a9.28 9.28 0 0 0-9-9h-.55a9.28 9.28 0 0 0-9 9v.54a9.28 9.28 0 0 0 13.3 8.1l.3-.16 1.52-.8v4.62z"></path>
            </svg>
        },
        {
            category: "Communication",
            icon: <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="block w-6 h-6 stroke-current stroke-[2.67] overflow-visible fill-none"
            >
                <path
                    fill="none"
                    d="M26 3a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-6.32L16 29.5 12.32 25H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z"
                />
            </svg>

        },
        {
            category: "Location",
            icon: <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="block w-6 h-6 fill-current"
            >
                <path d="M30.95 3.81a2 2 0 0 0-2.38-1.52l-7.58 1.69-10-2-8.42 1.87A1.99 1.99 0 0 0 1 5.8v21.95a1.96 1.96 0 0 0 .05.44 2 2 0 0 0 2.38 1.52l7.58-1.69 10 2 8.42-1.87A1.99 1.99 0 0 0 31 26.2V4.25a1.99 1.99 0 0 0-.05-.44zM12 4.22l8 1.6v21.96l-8-1.6zM3 27.75V5.8l-.22-.97.22.97 7-1.55V26.2zm26-1.55-7 1.55V5.8l7-1.55z" />
            </svg>

        },
        {
            category: "Value",
            icon: <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                className="block w-6 h-6 fill-current"
            >
                <path d="M16.17 2a3 3 0 0 1 1.98.74l.14.14 11 11a3 3 0 0 1 .14 4.1l-.14.14L18.12 29.3a3 3 0 0 1-4.1.14l-.14-.14-11-11A3 3 0 0 1 2 16.37l-.01-.2V5a3 3 0 0 1 2.82-3h11.35zm0 2H5a1 1 0 0 0-1 .88v11.29a1 1 0 0 0 .2.61l.1.1 11 11a1 1 0 0 0 1.31.08l.1-.08L27.88 16.7a1 1 0 0 0 .08-1.32l-.08-.1-11-11a1 1 0 0 0-.58-.28L16.17 4zM9 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>

        },
    ]
    const reviews = [
        {
            id: 1,
            firstName: "Priyanka",
            year: 5,
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            comment:
                "The flat is just at the right place with proper amenities. Highly recommend this place! The host is very responsive, generous and provided everything needed. Had a wonderful stay!!",
        },
        {
            id: 2,
            firstName: "Rahul",
            year: 3,
            image: "https://randomuser.me/api/portraits/men/75.jpg",
            comment:
                "Great location and very clean! The host was helpful and made sure our check-in process was smooth. Would definitely book again.",
        },
        {
            id: 3,
            firstName: "Ananya",
            year: 2,
            image: "https://randomuser.me/api/portraits/women/12.jpg",
            comment:
                "Cozy and comfortable flat with all basic facilities. Perfect for a weekend getaway. Highly satisfied!",
        },
        {
            id: 4,
            firstName: "Vikram",
            year: 7,
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            comment:
                "Amazing experience! The flat had a homely vibe and was very well maintained. The host went above and beyond.",
        },
        {
            id: 5,
            firstName: "Neha",
            year: 4,
            image: "https://randomuser.me/api/portraits/women/45.jpg",
            comment:
                "The place exceeded my expectations. Everything was neat and organized, and the host was very kind and accommodating.",
        },
        {
            id: 6,
            firstName: "Arjun",
            year: 6,
            image: "https://randomuser.me/api/portraits/men/20.jpg",
            comment:
                "Loved the ambiance and the comfort of the flat. Close to local attractions and very convenient. Would definitely stay again!",
        },
    ];


    const dropDownMenu = () => {
        setIsChevornUp(!isChevronUp)
        setIsDropdownOn(!isDropdownOn)
    }

    useEffect(() => {
        if (userData?.current) {
            setAdult(userData.current.adult || bookingData.adult);
            setChildren(userData.current.children || bookingData.children);
            setInfant(userData.current.infant || bookingData.infant);

            setCheckIn(userData.current.checkIn ? new Date(userData.current.checkIn) : bookingData.checkIn);
            setCheckOut(userData.current.checkOut ? new Date(userData.current.checkOut) : bookingData.checkOut);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleReservation = () => {
        const booking = {
            destination: bookingData.destination,
            checkIn: new Date(checkIn).toISOString().split("T")[0],
            checkOut: new Date(checkOut).toISOString().split("T")[0],
            adult: adult,
            children: children,
            infant: infant,
            hotelId: id
        };
        // Convert object → string (encode for URL)
        const queryString = new URLSearchParams(booking).toString();
        console.log("queryString: ", queryString);
        updateUserData(booking)
        navigate(`/reservation?${queryString}`)
    }

    const RoomSkeleton = () => {
        return (
            <div className='flex flex-col items-center mx-auto py-10 animate-pulse'>
                <div className='w-full max-w-6xl'>
                    {/* Header Skeleton */}
                    <div className='flex justify-between mb-6'>
                        <div className='h-8 bg-gray-200 rounded w-1/3'></div>
                        <div className='flex gap-5'>
                            <div className='h-6 bg-gray-200 rounded w-20'></div>
                            <div className='h-6 bg-gray-200 rounded w-20'></div>
                        </div>
                    </div>

                    {/* Image Gallery Skeleton */}
                    <div className='grid grid-cols-4 grid-rows-2 gap-2 h-96 mb-6'>
                        <div className='col-span-2 row-span-2 bg-gray-200 rounded-xl'></div>
                        <div className='bg-gray-200 rounded-xl'></div>
                        <div className='bg-gray-200 rounded-xl'></div>
                        <div className='bg-gray-200 rounded-xl'></div>
                        <div className='bg-gray-200 rounded-xl'></div>
                    </div>

                    {/* Title and Description Skeleton */}
                    <div className='mb-6 space-y-2'>
                        <div className='h-6 bg-gray-200 rounded w-2/3'></div>
                        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    </div>

                    <div className='flex flex-col-reverse md:flex-row justify-between gap-8'>
                        {/* Left Content Skeleton */}
                        <div className='md:w-3/5 space-y-6'>
                            {/* Guest Favorite Card Skeleton */}
                            <div className='bg-gray-100 p-4 rounded-xl h-24'></div>

                            {/* Host Card Skeleton */}
                            <div className='flex gap-4 py-6 border-b border-gray-200'>
                                <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                                <div className='space-y-2 flex-1'>
                                    <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                    <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                                </div>
                            </div>

                            {/* Amenities Skeleton */}
                            <div className='space-y-4 py-6 border-b border-gray-200'>
                                {[1, 2, 3].map(item => (
                                    <div key={item} className='flex gap-4'>
                                        <div className='w-6 h-6 bg-gray-200 rounded'></div>
                                        <div className='flex-1 space-y-2'>
                                            <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                                            <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* About Place Skeleton */}
                            <div className='space-y-3 py-6'>
                                <div className='h-6 bg-gray-200 rounded w-1/4'></div>
                                <div className='h-4 bg-gray-200 rounded w-full'></div>
                                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                            </div>

                            {/* Features Skeleton */}
                            <div className='py-6'>
                                <div className='h-7 bg-gray-200 rounded w-1/3 mb-6'></div>
                                <div className='grid lg:grid-cols-2 gap-4'>
                                    {[1, 2, 3, 4, 5, 6].map(item => (
                                        <div key={item} className='flex gap-3 items-center'>
                                            <div className='w-6 h-6 bg-gray-200 rounded'></div>
                                            <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Booking Card Skeleton */}
                        <div className='md:w-2/5'>
                            <div className='border border-gray-200 p-6 rounded-xl sticky top-24'>
                                {/* Price Skeleton */}
                                <div className='space-y-2 mb-4'>
                                    <div className='h-6 bg-gray-200 rounded w-1/3'></div>
                                    <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                                </div>

                                {/* Date Picker Skeleton */}
                                <div className='space-y-3'>
                                    <div className='flex border border-gray-300 rounded-t-xl'>
                                        <div className='flex-1 p-4 border-r'>
                                            <div className='h-3 bg-gray-200 rounded w-1/4 mb-2'></div>
                                            <div className='h-5 bg-gray-200 rounded w-2/3'></div>
                                        </div>
                                        <div className='flex-1 p-4'>
                                            <div className='h-3 bg-gray-200 rounded w-1/4 mb-2'></div>
                                            <div className='h-5 bg-gray-200 rounded w-2/3'></div>
                                        </div>
                                    </div>
                                    <div className='border border-gray-300 rounded-b-xl p-4'>
                                        <div className='h-3 bg-gray-200 rounded w-1/4 mb-2'></div>
                                        <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                    </div>
                                    <div className='h-12 bg-gray-200 rounded-xl'></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings Section Skeleton */}
                    <div className='py-8 border-b border-gray-200'>
                        <div className='h-7 bg-gray-200 rounded w-1/4 mb-6'></div>
                        <div className='grid md:grid-cols-3 gap-6'>
                            {[1, 2, 3].map(item => (
                                <div key={item} className='space-y-3'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                                        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                                    </div>
                                    <div className='h-3 bg-gray-200 rounded w-3/4'></div>
                                    <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews Skeleton */}
                    <div className='py-8'>
                        <div className='h-7 bg-gray-200 rounded w-1/4 mb-6'></div>
                        <div className='grid md:grid-cols-2 gap-6'>
                            {[1, 2, 3, 4].map(item => (
                                <div key={item} className='space-y-4 p-4 border border-gray-200 rounded-xl'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                                        <div className='space-y-2 flex-1'>
                                            <div className='h-4 bg-gray-200 rounded w-1/3'></div>
                                            <div className='h-3 bg-gray-200 rounded w-1/4'></div>
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <div className='h-4 bg-gray-200 rounded w-full'></div>
                                        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                        <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Section Skeleton */}
                    <div className='py-8 border-t border-gray-200'>
                        <div className='h-7 bg-gray-200 rounded w-1/4 mb-6'></div>
                        <div className='h-64 bg-gray-200 rounded-xl mb-4'></div>
                        <div className='h-5 bg-gray-200 rounded w-1/2'></div>
                    </div>
                </div>
            </div>
        );
    };

    if (!hotel) {
        return <RoomSkeleton />;
    }

    return (
        <div className='flex flex-col items-center mx-auto py-10'>
            <div>
                {/* Headers */}
                <div className='flex justify-between' >
                    <div className='font-semibold text-2xl'>{hotel.title}</div>
                    <div className='flex gap-5' >
                        <div className='flex gap-3 items-center justify-center' >
                            <Share className='size-4' />
                            <div className='underline font-semibold'>
                                Share
                            </div>
                        </div>
                        <div className='flex gap-3 items-center justify-center' >
                            <Heart className='size-4' />
                            <div className='underline font-semibold'>
                                Save
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Grid */}
                <HotelGallery hotel={hotel} />

                <div>
                    <div className='sm:text-md md:text-xl lg:text-2xl font-medium'>Entire rental unit in {hotel.location.city}, India</div>
                    <div>5 guests | {hotel.rooms[0].bedroom} bedroom | {hotel.rooms[0].beds} beds | {hotel.rooms[0].bathroom} bathroom</div>
                </div>


                <div className='flex flex-col-reverse md:flex-row justify-between' >
                    <div className='md:w-3/5 '>
                        {/* Guest Favourite card */}
                        <GuestFavCard ratings={seededValueInRange(hotel.price_per_night)} reviews={"6"} />

                        {/* Host Small card */}
                        <div className='mt-5 py-10 flex gap-5 border-b-1  border-gray-300' >
                            <div className="rounded-full bg-black inline-flex items-center justify-center size-10 text-amber-50">
                                {hotel.host.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className='font-semibold' >Hosted by {hotel.host.username}</div>
                                <div className='text-gray-600' >2 Months Hosting</div>
                            </div>
                        </div>

                        {/* aminitites  */}
                        <div className='border-b-1  border-gray-300 py-6' >
                            {
                                aminites.map((item, idx) => (
                                    <Amenities key={idx} icon={item.Icon} title={item.title} description={item.description} />
                                ))
                            }
                        </div>


                        {/* About this place */}

                        <AboutPlace />


                        {/* What this place offers */}
                        <div className='py-10' >
                            <div className='text-3xl font-semibold py-7' >What this place offers</div>
                            <div className='grid lg:grid-cols-2' >
                                {
                                    features.map((item, idx) => (
                                        <Features key={idx} icon={item.icon} title={item.title} strikethrough={item.strikethrough} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className='md:w-2/5 flex justify-end'>
                        <div>
                            <RareFind />

                            {/* Check out form */}
                            <div className='border border-gray-300 p-5 inline-block rounded-xl sticky top-50 w-full md:w-auto md:max-w-lg lg:max-w-md ' >
                                <div className='py-4'>
                                    <span className='text-xl py-5 font-bold underline' >{nights == 0 ? "Add dates to get the price" : `₹${(nights * hotel.price_per_night).toLocaleString("en-IN")}`}</span>
                                    <span> For {calculateDays(checkIn, checkOut)} nights </span>
                                </div>

                                <div className='inline-flex flex-col w-full' >
                                    <div className='flex border-b-0 border border-gray-700 rounded-t-xl' >
                                        <div className='inline-flex flex-col p-3 px-4 md:px-8 border-r-1 flex-1'>
                                            <label className='font-medium text-xs' htmlFor='checkin'>CHECK-IN</label>
                                            <DatePicker onChange={(date) => setCheckIn(date)}
                                                selected={checkIn}
                                                dateFormat="dd/MM/yyyy"
                                                id='checkin'
                                                placeholderText='Add dates'
                                                className='outline-0 w-full'
                                            />
                                        </div>
                                        <div className='inline-flex flex-col p-3 px-4 md:px-8 flex-1'>
                                            <label className='font-medium text-xs ' htmlFor='checkin'>CHECK-OUT</label>
                                            <DatePicker onChange={(date) => setCheckOut(date)}
                                                dateFormat="dd/MM/yyyy"
                                                id='checkin'
                                                placeholderText='Add dates'
                                                selected={checkOut}
                                                className='outline-0 w-full'
                                            />
                                        </div>
                                    </div>
                                    <div className='border flex justify-between items-center border-gray-700 rounded-b-xl px-4 md:px-8 p-3 '
                                        onClick={dropDownMenu} >
                                        <div>
                                            <div className='font-medium '>Guests</div>
                                            <div>{adult + children + infant} Guests</div>
                                        </div>
                                        <div>{isChevronUp ? <ChevronUp /> : <ChevronDown />}</div>
                                    </div>

                                    <button onClick={handleReservation} className='bg-airbnb py-3 rounded-full text-white font-semibold mt-5' >Reserve</button>

                                    {/* dropdown menu */}
                                    <div className={`absolute bg-white h-80 w-full md:w-[25rem] top-55 z-10 p-5 rounded-xl ${isDropdownOn ? "block" : "hidden"} shadow-[0_7px_29px_0_rgba(100,100,111,0.2)] `}>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Adults</div>
                                                <div>Age 13+</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' disabled={adult <= 1} onClick={() => setAdult((prev => prev - 1))} >-</button>
                                                <div>{adult}</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' onClick={() => setAdult((prev => prev + 1))} >+</div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Children</div>
                                                <div>Age 2-12</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' disabled={children <= 0} onClick={() => setChildren((prev => prev - 1))} >-</button>
                                                <div>{children}</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' onClick={() => setChildren((prev => prev + 1))} >+</div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Infants</div>
                                                <div>Under 2</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <button className={`p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full`} disabled={infant <= 0} onClick={() => setInfant((prev => prev - 1))}>-</button>
                                                <div>{infant}</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' onClick={() => setInfant((prev => prev + 1))}>+</div>
                                            </div>
                                        </div>
                                        <p className='py-3 text-gray-600'>Pets are not allowed in this stay</p>
                                        <div className='flex justify-end pt-3' >
                                            <div className='underline font-bold cursor-pointer'
                                                onClick={() => setIsDropdownOn(false)} >
                                                Close
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings */}
                <GuestFavourite
                    rating={seededValueInRange(hotel.price_per_night)}
                    title="Guests favourite"
                    description="This home is a guest favourite based on ratings, reviews and reliability"
                />


                {/* Rating in details */}

                <div className='border-b border-gray-300 hidden lg:block'>
                    <div className='flex justify-between py-10'>
                        <div className='max-w-[10rem] min-w-[10rem] p-3' >
                            <div className='font-medium' >Overall rating</div>
                            {
                                rating.map((item, idx) => (
                                    <RatingsBar key={idx} num={item.num} percent={item.percent} />
                                ))
                            }
                        </div>
                        {
                            rate.map((item, idx) => (
                                <RatingIcon key={idx} category={item.category} icon={item.icon} />
                            ))
                        }
                    </div>
                </div>

                {/* ----------------------Reviews------------------------- */}
                <div className='py-5 grid md:grid-cols-2 ' >
                    {
                        reviews.map((item) => (
                            <ReviewCard
                                key={item.id}
                                firstName={item.firstName}
                                year={item.year}
                                comment={item.comment}
                                img={item.image}
                            />

                        ))
                    }
                </div>


                {/* Map embeddings */}
                <div className='py-5 border-y border-gray-300'>

                    <div className='font-semibold text-2xl py-5' >Where you’ll be</div>
                    <MapEmbed latitude={hotel.location.lat} longitude={hotel.location.lon} />
                    <div className='font-medium py-5 text-xl' >{hotel.address}</div>
                    <div className='text-lg'></div>
                </div>

            </div>
        </div>
    )
}

export default Room 