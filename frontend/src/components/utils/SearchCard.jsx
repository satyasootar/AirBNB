
import { HeartButton } from './HeartButton';
import { useNavigate } from 'react-router-dom'
import { calculateDays } from './CalculateDays';

export const SearchCard = ({
    image,
    hotelName,
    price,
    checkIn,
    checkOut,
    ratings,
    id,
    rooms
}) => {

    const navigate = useNavigate()
    const night = calculateDays(checkIn, checkOut)

    return (
        <div
            className="flex-shrink-0 cursor-pointer rounded-2xl p-2"
            onClick={() => navigate(`/room/${id}`)}
        >
            {/* IMAGE PART */}
            <div className="relative w-[240px] h-[240px] ">
                <img
                    src={image}
                    className="object-cover rounded-2xl w-full h-full"
                />
                <div className="absolute top-3 w-full flex justify-between px-3">
                    <div className="bg-white font-semibold text-xs rounded-full px-2 py-1">
                        Guest favourite
                    </div>
                    <div>
                        <HeartButton />
                    </div>
                </div>

            </div>

            {/* TEXT PART */}
            <div className="mt-2">
                <div className='flex justify-between'>
                    <p className="font-medium text-balance w-50">{hotelName}</p>
                    <span>★{ratings}</span>
                </div>
                <p className="text-xs">{`₹${(night * price).toLocaleString("en-IN")} for ${night} night `}</p>
                <p className='text-md'>{`${rooms.bedroom} Bedroom ∙ ${rooms.beds} Bed ∙ ${rooms.bathroom} Bathroom`}</p>
            </div>
        </div>

    )
}
