import React from 'react'

export const Header = ({
    text
}) => {
    return (
        <div className='text-xl font-semibold flex items-center gap-1 py-3' >
            {text}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
        </div>
    )
}
