import { useContext, useEffect, useRef, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { StoreContext } from '../../context/StoreContext';
import TopNavbar from './TopNavbar';
import { MobileSearchTrigger } from './MobileSearchTrigger';
import { MobileExpandedSearch } from './MobileExpandedSearch';
import { DesktopSearchBar } from './DesktopSearchBar';

export const Navbar = () => {

    const location = useLocation()
    const [hide, setHide] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [searchSuggestionBox, setSearchSuggestionBox] = useState(false)
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [query, setQuery] = useState("");
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const [isDropdownOn, setIsDropdownOn] = useState(false)
    const [adult, setAdult] = useState(0)
    const [children, setChildren] = useState(0)
    const [infant, setInfant] = useState(0)
    const [guestData, setGuestData] = useState()

    const searchWrapperRef = useRef(null);
    const deskGuestWrapperRef = useRef(null);
    const mobileGuestWrapperRef = useRef(null);
    const navigate = useNavigate();
    const { updateUserData } = useContext(StoreContext);


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
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setSearchSuggestionBox(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            // If the dropdown is open, check if click is inside either ref
            if (isDropdownOn) {
                if (deskGuestWrapperRef.current && deskGuestWrapperRef.current.contains(event.target)) {
                    // Click is inside the desk dropdown, so do nothing
                    return;
                }
                if (mobileGuestWrapperRef.current && mobileGuestWrapperRef.current.contains(event.target)) {
                    // Click is inside the mobile dropdown, so do nothing
                    return;
                }
                // If we get here, the click is outside both dropdowns, so close the dropdown
                setIsDropdownOn(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOn]); // Remember to include isDropdownOn in the dependency array


    useEffect(() => {
        if (adult + children + infant == 0) {
            setGuestData("Add guests")
        } else {
            setGuestData(`Guest ${adult + children + infant}`)
        }
    }, [adult, children, infant])

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
            const citySlug = query.toLowerCase().replace(/\s+/g, "-");

            updateUserData({
                destination: query,
                checkIn: format(checkIn, "yyyy-MM-dd"),
                checkOut: format(checkOut, "yyyy-MM-dd"),
                adult: adult,
                children: children,
                infant: infant
            });

            navigate(citySlug);
        }
    };



    return (

        <div className='flex flex-col items-center gap-2 sticky top-0 z-50 '
        >
            {/* Top navbar */}
            <TopNavbar />

            {/* Bottom navbar */}
            {
                location.pathname === "/" && (
                    <>
                        {/* Mobile Search Trigger (shown only on small screens) */}
                        <MobileSearchTrigger
                            hide={hide}
                            isMobileExpanded={isMobileExpanded}
                            setIsMobileExpanded={setIsMobileExpanded}
                        />


                        {/* Mobile Expanded Search (shown when clicked on mobile) */}
                        <MobileExpandedSearch
                            isMobileExpanded={isMobileExpanded}
                            setIsMobileExpanded={setIsMobileExpanded}
                            query={query}
                            setQuery={setQuery}
                            checkIn={checkIn}
                            setCheckIn={setCheckIn}
                            checkOut={checkOut}
                            setCheckOut={setCheckOut}
                            guestData={guestData}
                            adult={adult}
                            setAdult={setAdult}
                            children={children}
                            setChildren={setChildren}
                            infant={infant}
                            setInfant={setInfant}
                            searchSuggestionBox={searchSuggestionBox}
                            setSearchSuggestionBox={setSearchSuggestionBox}
                            isDropdownOn={isDropdownOn}
                            setIsDropdownOn={setIsDropdownOn}
                            filteredItems={filteredItems}
                            handleSearch={handleSearch}
                            searchWrapperRef={searchWrapperRef}
                            mobileGuestWrapperRef={mobileGuestWrapperRef}
                        />


                        {/* Desktop */}
                        <DesktopSearchBar
                            hide={hide}
                            query={query}
                            setQuery={setQuery}
                            checkIn={checkIn}
                            setCheckIn={setCheckIn}
                            checkOut={checkOut}
                            setCheckOut={setCheckOut}
                            guestData={guestData}
                            adult={adult}
                            setAdult={setAdult}
                            children={children}
                            setChildren={setChildren}
                            infant={infant}
                            setInfant={setInfant}
                            searchSuggestionBox={searchSuggestionBox}
                            setSearchSuggestionBox={setSearchSuggestionBox}
                            isDropdownOn={isDropdownOn}
                            setIsDropdownOn={setIsDropdownOn}
                            filteredItems={filteredItems}
                            handleSearch={handleSearch}
                            searchWrapperRef={searchWrapperRef}
                            deskGuestWrapperRef={deskGuestWrapperRef}
                        />
                    </>
                )
            }

        </div>

    )
}
