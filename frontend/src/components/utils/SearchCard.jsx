import data from '../../Dummy/Dummy.json'
import { HeartButton } from './HeartButton';
import { useNavigate } from 'react-router-dom'

export const SearchCard = ({
    image = data.hotels[0].image[0],
    hotelName = data.hotels[0].name,
    price = data.payments[0].amount,
    ratings = data.reviews[0].rating,
    id,
}) => {

    const navigate = useNavigate()

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
                <p className="font-medium">{hotelName}</p>
                <p className="text-xs">{`₹${price} for one night ★ ${ratings}`}</p>
            </div>
        </div>

    )
}
