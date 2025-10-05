// import data from '../../Dummy/Dummy.json'
import { HeartButton } from './HeartButton';
import { useNavigate } from 'react-router-dom'
import { seededValueInRange } from './seededValueInRange';

export const Card = ({
    image,
    hotelName,
    price,
    ratings,
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
                <div className="absolute top-3 left-3 flex gap-11">
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
                <p className="text-xs">{`₹${(price).toLocaleString("en-IN")} for one night ★ ${seededValueInRange(ratings)}`}</p>
            </div>
        </div>
    )
}
