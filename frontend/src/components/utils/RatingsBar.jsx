export const RatingsBar = ({ num, percent }) => {
    return (
        <div className='flex justify-center items-center gap-1 ' >
            <span>{num}</span>
            <div className='flex-1 bg-gray-300 rounded-full h-1' >
                <div
                    className={`bg-black h-1 rounded-full`}
                    style={{ "width": `${percent}%` }}
                ></div>
            </div>
        </div>
    )
}
