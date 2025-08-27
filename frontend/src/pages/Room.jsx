import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Data from '../Dummy/Dummy.json'
import { Share, Heart, Grip, DoorClosed, MessageCircleHeart, CircleParking, Shell, Wifi, Car, WashingMachine, BellOff, ChevronUp, ChevronDown } from 'lucide-react';
import DatePicker from 'react-datepicker';


const Room = () => {
    const { id } = useParams();
    const hotel = Data.hotels.find(hotel => hotel.id === parseInt(id))
    console.log("hotel: ", hotel);

    const [isChevronUp, setIsChevornUp] = useState(false)
    const [isDropdownOn, setIsDropdownOn] = useState(false)

    const dropDownMenu = () => {
        setIsChevornUp(!isChevronUp)
        setIsDropdownOn(!isDropdownOn)
    }
    return (
        <div className='flex flex-col items-center max-w-[75rem] mx-auto py-10'>
            <div>
                {/* Headers */}
                <div className='flex justify-between' >
                    <div className='font-semibold text-2xl ' >1-BHK Fully furnished Flat near Sea Beach</div>
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
                <div className="flex gap-2 relative py-5">
                    {/* Left big image */}
                    <div className="w-1/2 object-cover">
                        <img
                            src={hotel.image[0]}
                            alt="Hotel"
                            className="max-w-[37.5rem] object-cover rounded-l-md"
                        />
                    </div>

                    {/* Right 2x2 grid */}
                    <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2 l max-h-[25rem] ">
                        <img
                            src={hotel.image[1]}
                            alt="Hotel"
                            className="w-full h-full object-cover "
                        />
                        <img
                            src={hotel.image[2]}
                            alt="Hotel"
                            className="w-full h-full object-cover rounded-tr-md"
                        />
                        <img
                            src={hotel.image[1]}
                            alt="Hotel"
                            className="w-full h-full  object-cover "
                        />
                        <img
                            src={hotel.image[2]}
                            alt="Hotel"
                            className="w-full h-full object-cover rounded-br-md"
                        />
                    </div>

                    {/* Show all photo button */}
                    <div className='bg-white w-[10rem] h-[2rem] rounded-lg flex justify-center items-center gap-2 absolute bottom-10 right-3' >
                        <Grip size="20" />
                        <div className='font-semibold'>Show all photos</div>
                    </div>
                </div>



                <div>
                    <div className='text-2xl font-medium'>Entire rental unit in Puri, India</div>
                    <div>5 guests | 1 bedroom | 2 beds | 1 bathroom</div>
                </div>


                <div className='flex justify-between' >
                    <div className='w-3/5 '>
                        {/* Guest Favourite card */}
                        <div className='flex border-1 border-gray-300 justify-evenly items-center gap-1 rounded-xl py-3 px-1 mt-5'>
                            <img src='/assets/guest_fav.png' />
                            <div className='font-semibold text-balance max-w-[250px] text-zinc-900'>One of the Most Loved homes on Airbnb, according to the guests</div>
                            <div className=' flex flex-col items-center justify-center border-r-1 pr-5 border-gray-300'>
                                <div className='font-bold text-2xl ' >5.0</div>
                                <div> ★★★★★</div>
                            </div>
                            <div className='flex flex-col justify-center items-center' >
                                <div className='font-bold text-2xl' >7</div>
                                <div>Reviews</div>
                            </div>
                        </div>


                        {/* Host Small card */}
                        <div className='mt-5 py-10 flex gap-5 border-b-1  border-gray-300' >
                            <div className="rounded-full bg-black inline-flex items-center justify-center size-10 text-amber-50">
                                A
                            </div>
                            <div>
                                <div className='font-semibold' >Hosted by Asutosh</div>
                                <div className='text-gray-600' >2 Months Hosting</div>
                            </div>
                        </div>

                        <div className='border-b-1  border-gray-300 py-6' >
                            <div className='flex gap-6 items-center mt-6'>
                                <DoorClosed strokeWidth='1.5px' />
                                <div>
                                    <div className='font-medium' >Self Checkin</div>
                                    <div className='text-gray-600' >Check yourself in with the smart lock.</div>
                                </div>
                            </div>

                            <div className='flex gap-6 items-center mt-6'>
                                <CircleParking strokeWidth='1.5px' />
                                <div>
                                    <div className='font-medium' >Park for free</div>
                                    <div className='text-gray-600' >This is one of the few places in the area with free parking.</div>
                                </div>
                            </div>

                            <div className='flex gap-6 items-center mt-6'>
                                <MessageCircleHeart strokeWidth='1.5px' />
                                <div>
                                    <div className='font-medium' >Exceptional Host communication</div>
                                    <div className='text-gray-600' >Recent guests gave Host a 5-star rating for communication.</div>
                                </div>
                            </div>
                        </div>


                        {/* About this place */}

                        <div className='py-10 border-b-1  border-gray-300' >
                            <p className='text-3xl font-semibold py-7'>About this place</p>
                            <p className='py-2'>Welcome to our beautiful Luxury stay at Puri. This modern home(1 BHK) is designed with the best interiors and all the modern premium furnishings to enhance your stay.</p>
                            <p>Essentials: Free Wi-Fi, towels, soap, toilet</p>
                            <p>Guest Capacity:5(1 double bed+1 sofabed)</p>
                            <p>Comfort: AC, ceiling fans, smart TV, washing machine</p>
                            <p>Kitchen: Fully equipped with stove, fridge, basic cookware, utensils.</p>
                            <p>This property is located close to railway station,in front of Zilla School. Beach is 800 m far and Temple is 1.5 km.</p>

                            <p className='text-xl font-semibold pt-3' >Other things to note</p>
                            <p className='py-2'>Non-Veg including eggs cooking is not allowed.</p>
                        </div>

                        {/* What this place offers */}
                        <div className='py-10' >
                            <div className='text-3xl font-semibold py-7' >What this place offers</div>
                            <div className='flex gap-20' >
                                <div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <Shell strokeWidth='1.5px' />
                                        <div className='text-gray-800' >Shared beach access</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <Wifi strokeWidth='1.5px' />
                                        <div className='text-gray-800' >WIFI</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <Car strokeWidth='1.5px' />
                                        <div className='text-gray-800' >Free parking on premises</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <WashingMachine strokeWidth='1.5px' />
                                        <div className='text-gray-800' >Washing machine</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <BellOff strokeWidth='1.5px' />
                                        <div className='text-gray-800 line-through' >Carbon monoxide alarm</div>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <Shell strokeWidth='1.5px' />
                                        <div className='text-gray-800'>Kitchen</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <Wifi strokeWidth='1.5px' />
                                        <div className='text-gray-800'>Dedicated Workspace</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <Car strokeWidth='1.5px' />
                                        <div className='text-gray-800'>TV</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <WashingMachine strokeWidth='1.5px' />
                                        <div className='text-gray-800'>Air Conditioning</div>
                                    </div>
                                    <div className='flex gap-6 items-center mt-6 justify-start'>
                                        <BellOff strokeWidth='1.5px' />
                                        <div className='text-gray-800 line-through'>Smoke alarm</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='w-2/5 flex justify-end'>
                        <div>
                            <div className='font-medium py-4 px-10 my-5 rounded-xl shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]'>
                                Rare find! This place is usually booked
                            </div>


                            {/* Check out form */}
                            <div className='border border-gray-300 p-5 inline-block rounded-xl sticky top-50' >
                                <div className='text-xl py-5' >Add dates for prices</div>
                                <div className=' inline-flex flex-col' >
                                    <div className='flex border-b-0 border border-gray-700 rounded-t-xl' >
                                        <div className='inline-flex flex-col p-3 px-8  border-r-1'>
                                            <label className='font-medium text-xs' htmlFor='checkin'>CHECK-IN</label>
                                            <DatePicker id='checkin' placeholderText='Add dates' className='outline-0  w-25' />
                                        </div>
                                        <div className='inline-flex flex-col p-3 px-8 '>
                                            <label className='font-medium text-xs ' htmlFor='checkin'>CHECK-OUT</label>
                                            <DatePicker id='checkin' placeholderText='Add dates' className='outline-0  w-25' />
                                        </div>
                                    </div>
                                    <div className='border flex justify-between items-center border-gray-700 rounded-b-xl px-8 p-3 '
                                        onClick={dropDownMenu} >
                                        <div>
                                            <div className='font-medium '>Guests</div>
                                            <div>1 Guests</div>
                                        </div>
                                        <div>{isChevronUp ? <ChevronUp /> : <ChevronDown />}</div>
                                    </div>

                                    <button className='bg-airbnb py-3 rounded-full text-white font-semibold mt-5' >Check availability</button>
                                    <div className={`  absolute bg-white h-80 w-[21rem] top-55 z-10 p-5 rounded-xl ${isDropdownOn? "block": "hidden"} `}>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Adults</div>
                                                <div>Age 13+</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >-</div>
                                                <div>1</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >+</div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Children</div>
                                                <div>Age 2-12</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >-</div>
                                                <div>1</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >+</div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Infants</div>
                                                <div>Under 2</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >-</div>
                                                <div>1</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >+</div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between pt-3' >
                                            <div>
                                                <div className='font-semibold text-lg' >Adults</div>
                                                <div>Age 13+</div>
                                            </div>
                                            <div className='flex gap-2.5 items-center' >
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >-</div>
                                                <div>1</div>
                                                <div className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' >+</div>
                                            </div>
                                        </div>
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

            </div>
        </div>
    )
}

export default Room