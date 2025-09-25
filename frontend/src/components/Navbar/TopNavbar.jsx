import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TopNavbar() {
    const [toggleHamburger, setToggleHamburger] = useState(false);

    return (
        <div className="flex justify-between items-center relative w-full bg-white">
            {/* Logo */}
            <Link to="/">
                <img src='/logo/Airbnb_Logo_1.png' alt='logo' className='w-25 cursor-pointer hidden md:block' />
                <img src='/logo/symbol.svg' alt='logo' className='w-7 cursor-pointer sm:w-10 md:hidden' />
            </Link>

            <div className="hidden sm:flex justify-center items-center gap-4 lg:pl-25">
                <div className='flex justify-center items-center cursor-pointer'>
                    <img src='/assets/host.png' className='w-10  md:w-17 lg:w-20' />
                    <p className='font-semibold'>Homes</p>
                </div>
                <div className='flex justify-center items-center cursor-pointer'>
                    <img src='/assets/balloon.png' className='w-10  md:w-17 lg:w-20' />
                    <p className=''>Experiences</p>
                </div>
                <div className='flex justify-center items-center cursor-pointer'>
                    <img src='/assets/bell.png' className='w-10  md:w-1 lg:w-20' />
                    <p className=''>Services</p>
                </div>
            </div>

            <div className='flex justify-between items-center lg:gap-6 gap-5'>
                <div className='hidden md:block'>
                    <p className='font-medium text-[14px] cursor-pointer'>Become a host</p>
                </div>

                <div className='bg-gray-1 hover:bg-gray-2 size-10 rounded-full flex justify-around items-center cursor-pointer'>
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
                            className="h-4 w-4 stroke-gray-600 stroke-[3] overflow-visible">
                            <g fill="none">
                                <path d="M2 16h28M2 24h28M2 8h28" />
                            </g>
                        </svg>
                    </div>
                </div>

                <div className={`absolute z-60 bg-white top-15 right-5 p-5 rounded-2xl max-w-[270px] shadow-xl ${toggleHamburger ? "block" : "hidden"}`}>
                    <div className='flex justify-start gap-2 cursor-pointer'>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </div>
                        <div>
                            <p>Help center</p>
                        </div>
                    </div>
                    <hr className="border-gray-300 mt-3 mb-2" />
                    <div className='flex items-center justify-evenly cursor-pointer'>
                        <div className='cursor-pointer'>
                            <p className='font-medium text-[14px]'>Become a Host</p>
                            <p className='text-xs text-gray-3'>It's easy to start hosting and earn extra income.</p>
                        </div>
                        <div>
                            <img src="/assets/host.png" alt="logo" className='w-40' />
                        </div>
                    </div>
                    <hr className="border-gray-300 mt-2 mb-3" />
                    <div className='cursor-pointer'>
                        <p>Refer a host</p>
                    </div>
                    <div className="my-4"></div>
                    <div className='cursor-pointer'>
                        <p>Find a Co-host</p>
                    </div>
                    <hr className="border-gray-300 my-3" />
                    <div className='cursor-pointer'>
                        <p>Log in or sign up</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
