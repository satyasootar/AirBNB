
export const SearchCards = ({ destination, text, img }) => {
    return (
        <div className='flex items-center gap-5 py-4' >
            <img src={img} className='size-12' />
            <span>
                <div className='font-semibold' >{destination}</div>
                <div className='text-gray-500'>{text}</div>
            </span>
        </div>
    )
}
