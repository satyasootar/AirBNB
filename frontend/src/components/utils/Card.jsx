import data from '../../Dummy/Dummy.json'
import { HeartButton } from './HeartButton';


export const Card = ({
    image = data.hotels[0].image[0],
    hotelName = data.hotels[0].name,
    price = data.payments[0].amount,
    ratings = data.reviews[0].rating
}) => {

    return (
        <div className='flex-shrink-0'>
            <div className='relative'>
                <img src={image} className='size-46 object-cover rounded-2xl' />
                <div className='absolute top-3 left-3 flex gap-5' >
                    <div className=' bg-white font-semibold text-xs rounded-full px-2 py-1' >
                        Guest favourite
                    </div>
                    <div>
                        <HeartButton />
                    </div>
                </div>
            </div>
            <div>
                <p className='font-medium pt-1' >{hotelName}</p>
                <p className='text-xs'>{`₹${price} for one night ★ ${ratings}`}</p>
            </div>
        </div>
    )
}
