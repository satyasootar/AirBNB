import data from '../../Dummy/Dummy.json'
import { HeartButton } from './HeartButton';
import { useNavigate } from 'react-router-dom'

export const Card = ({
    image = data.hotels[0].image[0],
    hotelName = data.hotels[0].name,
    price = data.payments[0].amount,
    ratings = data.reviews[0].rating,
    id,
    cardWidth = 200,
    cardHeight = 200
}) => {

    const navigate = useNavigate()

    return (
        <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => navigate(`/room/${id}`)}
            style={{ width: cardWidth, height: cardHeight }}
        >
            <div className="relative w-full h-full">
                <img
                    src={image}
                    className="object-cover rounded-2xl w-full h-full"
                />
                <div className="absolute top-3 left-3 flex gap-5">
                    <div className="bg-white font-semibold text-xs rounded-full px-2 py-1">
                        Guest favourite
                    </div>
                    <div>
                        <HeartButton />
                    </div>
                </div>
            </div>
            <div>
                <p className="font-medium pt-1">{hotelName}</p>
                <p className="text-xs">{`₹${price} for one night ★ ${ratings}`}</p>
            </div>
        </div>
    )
}
