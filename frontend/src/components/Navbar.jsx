import { useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { SearchCards } from './utils/SearchCards';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {

    const [toggleHamburger, setToggleHamburger] = useState(false)
    const [hide, setHide] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [searchSuggestionBox, setSearchSuggestionBox] = useState(false)
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);
    const navigate = useNavigate()

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

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSearchSuggestionBox(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    const searchItems = [
        {
            id: 11,
            destination: "Bhubaneshwar",
            text: "Capital city with ancient temples and modern luxury",
            image: "/assets/citysearch.png"
        },
        {
            id: 12,
            destination: "Mumbai",
            text: "City of dreams with beaches and Bollywood glamour",
            image: "/assets/citysearch.png"
        },
        {
            id: 13,
            destination: "Bengaluru",
            text: "Garden city and India's Silicon Valley",
            image: "/assets/citysearch.png"
        },
        {
            id: 14,
            destination: "Goa",
            text: "Coastal paradise of sun-kissed beaches, bohemian nightlife, and Portuguese charm",
            image: "/assets/beachsearch.png"
        },
        {
            id: 15,
            destination: "Kolkata",
            text: "India’s Cultural Capital – poetry, history, food, and the ‘City of Joy’ spirit",
            image: "/assets/citysearch.png"
        },
        {
            id: 16,
            destination: "Manali",
            text: "Himalayan haven of snow-clad valleys, adventure, and serene mountain vibes",
            image: "/assets/mountainsearch.png"
        }

    ];

    const filteredItems = searchItems.filter((item) =>
        item.destination.toLowerCase().includes(query.toLowerCase())
    );

    const handleSearch = () => {
        if (query.trim() !== "") {
            // convert spaces to hyphens/lowercase for URL
            const citySlug = query.toLowerCase().replace(/\s+/g, "-");
            navigate(`/${citySlug}`);
        }
    };


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
                <div className='flex flex-col rounded-full py-3 pl-10 p-2 hover:bg-gray-1'
                    ref={wrapperRef}>
                    <label htmlFor="destinations">Where</label>
                    <input id='destinations' type="text" placeholder='Search Destinations' className='outline-0'
                        onFocus={() => setSearchSuggestionBox(true)}
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                </div>
                <div className='flex flex-col rounded-full py-3 pl-5 p-2 hover:bg-gray-1'>
                    <label htmlFor='checkin'>Check in</label>
                    <DatePicker id='checkin'
                        placeholderText='Add dates'
                        className='outline-0  w-25'
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        dateFormat="dd/MM/yyyy"

                    />
                </div>
                <div className='flex flex-col rounded-full py-3 pl-5 p-2 hover:bg-gray-1'>
                    <label htmlFor='checkout'>Check Out</label>
                    <DatePicker id='checkout'
                        placeholderText='Add dates'
                        className='outline-0  w-25'
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        dateFormat="dd/MM/yyyy"
                    />
                </div>
                <div className='flex py-3 pl-5 p-2 hover:bg-gray-1 rounded-full'>
                    <div className='flex flex-col  '>
                        <label htmlFor="who">Who</label>
                        <input id='who' placeholder='Add guests' type='text' className='outline-0' />
                    </div>
                    <button className='bg-airbnb rounded-full w-11 h-11 flex justify-center items-center cursor-pointer'
                        onClick={handleSearch}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search text-white"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
                    </button>
                </div>
                <div className={`absolute bg-white max-h-[30rem] w-[25rem] top-40 left-85 rounded-4xl p-6 pt-10 shadow-card overflow-scroll scrollbar-none scrollbar-thin-y ${searchSuggestionBox ? "block" : "hidden"} `}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div className='cursor-pointer' key={item.id} onMouseDown={() => {
                                setQuery(item.destination)
                                setSearchSuggestionBox(false)
                            }} >
                                <SearchCards
                                    destination={item.destination}
                                    text={item.text}
                                    img={item.image}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No matches found</p>
                    )}
                </div>
            </motion.div>

        </div>

    )
}
