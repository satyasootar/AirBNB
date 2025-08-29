import React from 'react'

// eslint-disable-next-line no-unused-vars
export const Amenities = ({ icon: Icon, title, description }) => {
    return (
        <div>
            <div className='flex gap-6 items-center my-6'>
                <Icon strokeWidth='1.5px' />
                <div>
                    <div className='font-medium' >{title}</div>
                    <div className='text-gray-600' >{description}</div>
                </div>
            </div>
        </div>
    )
}
