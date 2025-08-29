import React from 'react'

export const GuestFavCard = ({ ratings , reviews}) => {
    return (
        <div className='flex border-1 border-gray-300 justify-evenly items-center gap-1 rounded-xl py-3 px-1 mt-5'>
            <img src='/assets/guest_fav.png' />
            <div className='font-semibold text-balance max-w-[250px] text-zinc-900'>One of the Most Loved homes on Airbnb, according to the guests</div>
            <div className=' flex flex-col items-center justify-center border-r-1 pr-5 border-gray-300'>
                <div className='font-bold text-2xl ' >{ratings}</div>
                <div>★★★★★</div>
            </div>
            <div className='flex flex-col justify-center items-center' >
                <div className='font-bold text-2xl' >{ reviews }</div>
                <div>Reviews</div>
            </div>
        </div>
    )
}
