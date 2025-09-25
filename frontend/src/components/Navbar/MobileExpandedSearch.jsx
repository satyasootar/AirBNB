
import DatePicker from "react-datepicker"

export const MobileExpandedSearch = ({
    isMobileExpanded,
    setIsMobileExpanded,
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
    searchWrapperRef,
    guestWrapperRef,
    handleSearch
}) => {
    return (
        <div className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ${isMobileExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <button
                    onClick={() => setIsMobileExpanded(false)}
                    className="p-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
                <span className="font-semibold">Search</span>
                <button
                    onClick={handleSearch}
                    className="text-airbnb font-semibold"
                >
                    Search
                </button>
            </div>

            {/* Search Form */}
            <div className="p-4 space-y-4">
                {/* Where */}
                <div
                    className="border-b pb-4 cursor-pointer"
                    onClick={() => setSearchSuggestionBox(true)}
                >
                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Where</div>
                    <div className="text-lg">{query || "Search destinations"}</div>
                </div>

                {/* Check In */}
                <div className="border-b pb-4">
                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Check in</div>
                    <DatePicker
                        selected={checkIn}
                        onChange={(date) => setCheckIn(date)}
                        placeholderText="Add dates"
                        className="text-lg outline-none w-full"
                        dateFormat="MMM dd, yyyy"
                    />
                </div>

                {/* Check Out */}
                <div className="border-b pb-4">
                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Check out</div>
                    <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        placeholderText="Add dates"
                        className="text-lg outline-none w-full"
                        dateFormat="MMM dd, yyyy"
                    />
                </div>

                {/* Who */}
                <div
                    className="border-b pb-4 cursor-pointer"
                    onClick={() => setIsDropdownOn(true)}
                >
                    <div className="text-xs font-semibold uppercase text-gray-500 mb-1">Who</div>
                    <div className="text-lg">{guestData}</div>
                </div>
            </div>

            {/* Search Suggestions Dropdown (Mobile) */}
            {searchSuggestionBox && (
                <div className="absolute inset-0 bg-white z-50" ref={searchWrapperRef}>
                    <div className="p-4 border-b flex items-center">
                        <button
                            onClick={() => setSearchSuggestionBox(false)}
                            className="mr-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            placeholder="Search destinations"
                            className="flex-1 outline-none text-lg"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 border-b cursor-pointer"
                                    onClick={() => {
                                        setQuery(item.destination);
                                        setSearchSuggestionBox(false);
                                    }}
                                >
                                    <div className="font-medium">{item.destination}</div>
                                    <div className="text-sm text-gray-500">{item.text}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-gray-500">No matches found</div>
                        )}
                    </div>
                </div>
            )}

            {/* Guests Dropdown (Mobile) */}
            {isDropdownOn && (
                <div className="absolute inset-0 bg-white z-50" ref={guestWrapperRef}>
                    <div className="p-4 border-b flex justify-between items-center">
                        <button
                            onClick={() => setIsDropdownOn(false)}
                            className="p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                        <span className="font-semibold">Guests</span>
                        <button
                            onClick={() => setIsDropdownOn(false)}
                            className="text-airbnb font-semibold"
                        >
                            Done
                        </button>
                    </div>
                    <div className="p-4 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold text-lg">Adults</div>
                                <div className="text-gray-500">Age 13+</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    className="w-10 h-10 flex justify-center items-center border border-gray-400 rounded-full disabled:opacity-50"
                                    disabled={children > 0 || infant > 0 ? adult <= 1 : adult <= 0}
                                    onClick={() => setAdult(prev => prev - 1)}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{adult}</span>
                                <button
                                    className="w-10 h-10 flex justify-center items-center border border-gray-400 rounded-full"
                                    onClick={() => setAdult(prev => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold text-lg">Children</div>
                                <div className="text-gray-500">Age 2-12</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    className="w-10 h-10 flex justify-center items-center border border-gray-400 rounded-full disabled:opacity-50"
                                    disabled={children <= 0}
                                    onClick={() => setChildren(prev => prev - 1)}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{children}</span>
                                <button
                                    className="w-10 h-10 flex justify-center items-center border border-gray-400 rounded-full disabled:opacity-50"
                                    disabled={adult === 0}
                                    onClick={() => setChildren(prev => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <div className="font-semibold text-lg">Infants</div>
                                <div className="text-gray-500">Under 2</div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <button
                                    className="w-10 h-10 flex justify-center items-center border border-gray-400 rounded-full disabled:opacity-50"
                                    disabled={infant <= 0}
                                    onClick={() => setInfant(prev => prev - 1)}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{infant}</span>
                                <button
                                    className="w-10 h-10 flex justify-center items-center border border-gray-400 rounded-full disabled:opacity-50"
                                    disabled={adult === 0}
                                    onClick={() => setInfant(prev => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm">Pets are not allowed in this stay</p>
                    </div>
                </div>
            )}
        </div>
    )
}
