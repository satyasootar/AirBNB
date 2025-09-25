// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { SearchCards } from "../utils/SearchCards"
import DatePicker from "react-datepicker"

export const DesktopSearchBar = ({
    hide,
    query,
    setQuery,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guestData,
    adult,
    setAdult,
    children,
    setChildren,
    infant,
    setInfant,
    searchSuggestionBox,
    setSearchSuggestionBox,
    isDropdownOn,
    setIsDropdownOn,
    filteredItems,
    handleSearch,
    searchWrapperRef,
    guestWrapperRef,

}) => {
    console.log(searchWrapperRef.current);
    return (
        <motion.div
            className="hidden md:flex border border-gray-2  shadow-xl z-20 rounded-full w-fit bg-white"
            animate={{ y: hide ? "-300%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <div>
                <div className='flex flex-col rounded-full py-3 pl-10 p-2 hover:bg-gray-1' ref={searchWrapperRef}>
                    <label htmlFor="destinations">Where</label>
                    <input
                        id='destinations'
                        type="text"
                        placeholder='Search Destinations'
                        className='outline-0'
                        onFocus={() => setSearchSuggestionBox(true)}
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                    />
                </div>
                <div className={`absolute bg-white max-h-[30rem] min-w-[25rem] md:w-[15rem] lg:w-[25rem] top-40 left-1/3.5 rounded-4xl p-6 pt-10 shadow-card overflow-scroll scrollbar-none scrollbar-thin-y ${searchSuggestionBox ? "block" : "hidden pointer-events-none border "}`}>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div
                                className='cursor-pointer'
                                key={item.id}
                                onMouseDown={() => {
                                    setQuery(item.destination)
                                    setSearchSuggestionBox(false)
                                }}
                            >
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
            </div>

            <div className='flex flex-col rounded-full py-3 pl-5 p-2 hover:bg-gray-1'>
                <label htmlFor='checkin'>Check in</label>
                <DatePicker
                    id='checkin'
                    placeholderText='Add dates'
                    className='outline-0 w-25'
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            <div className='flex flex-col rounded-full py-3 pl-5 p-2 hover:bg-gray-1'>
                <label htmlFor='checkout'>Check Out</label>
                <DatePicker
                    id='checkout'
                    placeholderText='Add dates'
                    className='outline-0 w-25'
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    dateFormat="dd/MM/yyyy" 
                />
            </div>

            <div className='flex py-3 pl-5 p-2 hover:bg-gray-1 rounded-full' ref={guestWrapperRef}>
                <div className='flex flex-col' >
                    <label htmlFor="who">Who</label>
                    <div onClick={() => setIsDropdownOn(true)} className='w-30 text-[#787878]'>{guestData}</div>
                    <div className={`absolute bg-white h-80 w-[21rem] top-40 left-1/2 z-100 p-5 rounded-xl ${isDropdownOn ? "block" : "hidden pointer-events-none"} shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]`} >
                        <div >
                            <div className='flex justify-between pt-3'>
                                <div>
                                    <div className='font-semibold text-lg '>Adults</div>
                                    <div>Age 13+</div>
                                </div>
                                <div className='flex gap-2.5 items-center'>
                                    <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full cursor-pointer' disabled={children > 0 || infant > 0 ? adult <= 1 : adult <= 0} onClick={() => {
                                        setAdult((prev) => prev - 1);
                                    }}>-</button>
                                    <div>{adult}</div>
                                    <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full cursor-pointer' onClick={() => {
                                        setAdult((prev) => prev + 1);
                                    }}>+</button>
                                </div>
                            </div>
                            <div className='flex justify-between pt-3'>
                                <div>
                                    <div className='font-semibold text-lg'>Children</div>
                                    <div>Age 2-12</div>
                                </div>
                                <div className='flex gap-2.5 items-center'>
                                    <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' disabled={children <= 0} onClick={() => setChildren((prev => prev - 1))}>-</button>
                                    <div>{children}</div>
                                    <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' disabled={adult == 0} onClick={() => setChildren((prev => prev + 1))}>+</button>
                                </div>
                            </div>
                            <div className='flex justify-between pt-3'>
                                <div>
                                    <div className='font-semibold text-lg'>Infants</div>
                                    <div>Under 2</div>
                                </div>
                                <div className='flex gap-2.5 items-center'>
                                    <button className={`p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full`} disabled={infant <= 0} onClick={() => setInfant((prev => prev - 1))}>-</button>
                                    <div>{infant}</div>
                                    <button className='p-2 flex justify-center items-center size-8 border border-gray-600 rounded-full' disabled={adult == 0} onClick={() => { console.log("Hello"); setInfant((prev => prev + 1)) }}>+</button>
                                </div>
                            </div>
                            <p className='py-3 text-gray-600'>Pets are not allowed in this stay</p>
                            <div className='flex justify-end pt-3'>
                                <div className='underline font-bold cursor-pointer' onClick={() => setIsDropdownOn(false)}>
                                    Close
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className='bg-airbnb rounded-full w-11 h-11 flex justify-center items-center cursor-pointer'
                    onClick={handleSearch}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search text-white">
                        <path d="m21 21-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                    </svg>
                </button>

            </div>

        </motion.div>
    )
}
