import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { SearchCards } from './utils/SearchCards';

export const Navbar = () => {

    const [toggleHamburger, setToggleHamburger] = useState(false)
    const [hide, setHide] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [searchSuggestionBox, setSearchSuggestionBox] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setHide(true);
            } else {
                setHide(false);
            }
            setLastScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll)

    }, [lastScrollY])


    const searchItems = [
        {
            id: 1,
            destination: "Puri Beach",
            text: "Relax by the golden sands and waves",
            image: "/assets/beachsearch.png",
        },
        {
            id: 2,
            destination: "Shimla Hills",
            text: "Snow-capped peaks and pine forests",
            image: "/assets/mountainsearch.png",
        },
        {
            id: 3,
            destination: "Goa",
            text: "Beach parties and water sports",
            image: "/assets/beachsearch.png",
        },
        {
            id: 4,
            destination: "Manali",
            text: "Adventure hub for trekking and skiing",
            image: "/assets/mountainsearch.png",
        },
        {
            id: 5,
            destination: "Kerala Backwaters",
            text: "Houseboats and serene waterways",
            image: "/assets/beachsearch.png",
        },
        {
            id: 6,
            destination: "Leh-Ladakh",
            text: "Mountains and Buddhist monasteries",
            image: "/assets/mountainsearch.png",
        },
        {
            id: 7,
            destination: "Andaman Islands",
            text: "Tropical beaches and coral reefs",
            image: "/assets/beachsearch.png",
        },
        {
            id: 8,
            destination: "Darjeeling",
            text: "Tea gardens and scenic mountains",
            image: "/assets/mountainsearch.png",
        },
        {
            id: 9,
            destination: "Vizag",
            text: "Beautiful coastline with rocky cliffs",
            image: "/assets/beachsearch.png",
        },
        {
            id: 10,
            destination: "Ooty",
            text: "Green hills and botanical gardens",
            image: "/assets/mountainsearch.png",
        },
    ];

    return (

        <div className='flex flex-col items-center gap-2 sticky top-0 z-50 '
        >
            {/* Top navbar */}
            <div className=" flex justify-between items-center relative w-full bg-white">
                {/* Logo */}
                <Link to="/">
                    <img src='/logo/Airbnb_Logo_1.png' alt='logo' className='w-25 cursor-pointer' />
                </Link>


                <div className='flex justify-center items-center gap-4 pl-25' >
                    <div className='flex justify-center items-center cursor-pointer'>
                        <img src='/assets/host.png' className='w-20' />
                        <p className='font-semibold' >Homes</p>
                    </div>
                    <div className='flex justify-center items-center cursor-pointer'>
                        <img src='/assets/balloon.png' className='w-20' />
                        <p className=''>Experiences</p>
                    </div>
                    <div className='flex justify-center items-center cursor-pointer'>
                        <img src='/assets/bell.png' className='w-20' />
                        <p className='' >Services</p>
                    </div>
                </div>


                <div className='flex justify-between items-center gap-6 '>
                    <div>
                        <p className='font-medium text-[14px] cursor-pointer' >Become a host</p>
                    </div>

                    <div className='bg-gray-1 hover:bg-gray-2 size-10 rounded-full flex justify-around items-center cursor-pointer' >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                                role="presentation"
                                focusable="false"
                                className="h-4 w-4 text-gray-600">
                                <path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z" />
                            </svg>
                        </div>
                    </div>

                    <div className='bg-gray-1 hover:bg-gray-2 size-10 rounded-full flex justify-around items-center cursor-pointer'
                        onClick={() => setToggleHamburger(!toggleHamburger)}
                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                aria-hidden="true"
                                role="presentation"
                                focusable="false"
                                className="h-4 w-4 stroke-gray-600 stroke-[3] overflow-visible ">
                                <g fill="none">
                                    <path d="M2 16h28M2 24h28M2 8h28" />
                                </g>
                            </svg>

                        </div>
                    </div>

                    <div className={`absolute z-10 bg-white top-15 right-5 p-5 rounded-2xl max-w-[270px] shadow-xl ${toggleHamburger ? "block" : "hidden"}`}
                    >
                        <div className='flex justify-start gap-2 cursor-pointer' >
                            <div >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
                            </div>
                            <div>
                                <p>Help center</p>
                            </div>
                        </div>
                        <hr className="border-gray-300 mt-3 mb-2"></hr>
                        <div className='flex items-center justify-evenly cursor-pointer'>

                            <div className='cursor-pointer'>
                                <p className='font-medium text-[14px]'>Become a Host</p>
                                <p className='text-xs text-gray-3' >It's easy to start hosting and earn extra income.</p>
                            </div>
                            <div>
                                <img src="/assets/host.png" alt="logo" className='w-40' />
                            </div>
                        </div>
                        <hr className="border-gray-300 mt-2 mb-3"></hr>
                        <div className='cursor-pointer'>
                            <p>Refer a host</p>
                        </div>
                        <div className=" my-4"></div>
                        <div className='cursor-pointer'>
                            <p>Find a Co-host</p>
                        </div>
                        <hr className="border-gray-300 my-3"></hr>
                        <div className='cursor-pointer'>
                            <p>Log in or sign up</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* Bottom navbar */}
            <motion.div className='flex border border-gray-2 shadow-xl z-20  rounded-full w-fit bg-white'
                animate={{ y: hide ? "-300%" : "0%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}>
                <div className='flex flex-col rounded-full py-3 pl-10 p-2 hover:bg-gray-1' onClick={() => setSearchSuggestionBox(true)}>
                    <label htmlFor="destinations">Where</label>
                    <input id='destinations' type="text" placeholder='Search Destinations' className='outline-0' />
                </div>
                <div className='flex flex-col rounded-full py-3 pl-5 p-2 hover:bg-gray-1'>
                    <label htmlFor='checkin'>Check in</label>
                    <DatePicker id='checkin' placeholderText='Add dates' className='outline-0  w-25' />
                </div>
                <div className='flex flex-col rounded-full py-3 pl-5 p-2 hover:bg-gray-1'>
                    <label htmlFor='checkout'>Check Out</label>
                    <DatePicker id='checkout' placeholderText='Add dates' className='outline-0  w-25' />
                </div>
                <div className='flex py-3 pl-5 p-2 hover:bg-gray-1 rounded-full'>
                    <div className='flex flex-col  '>
                        <label htmlFor="who">Who</label>
                        <input id='who' placeholder='Add guests' type='text' className='outline-0' />
                    </div>
                    <div className='bg-airbnb rounded-full w-11 h-11 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search text-white"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    </div>
                </div>
                <div className={`absolute bg-white h-[30rem] w-[25rem] top-40 left-85 rounded-4xl p-6 pt-10 shadow-card overflow-scroll scrollbar-none scrollbar-thin-y ${searchSuggestionBox ? "block" : "hidden"} `}>
                    {
                        searchItems.map((Item,) => (
                            <SearchCards key={Item.id} destination={Item.destination} text={Item.text} img={Item.image} />
                        ))
                    }
                </div>
            </motion.div>

        </div>

    )
}
