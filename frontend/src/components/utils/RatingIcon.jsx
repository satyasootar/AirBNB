export const RatingIcon = ({ category, icon }) => {
    return (
        <div className='p-3 pr-15 pl-5 border-l border-l-gray-300' >
            <div className='font-medium' >
                {category}
            </div>
            <div className='text-xl font-medium' >5.0</div>
            <div className='pt-6' >
                {icon}
            </div>
        </div>
    )
}
