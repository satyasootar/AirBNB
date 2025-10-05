import { Card } from './utils/Card'
import { Header } from './utils/Header'
import { useContext, useRef } from 'react'
import { ScrollButton } from './utils/ScrollButton'
import { StoreContext } from '../context/StoreContext'

export const CardCarousel = ({ destination }) => {
    const { hotels } = useContext(StoreContext)
    console.log("hotels: ", hotels);

    const scrollRef = useRef(null)
    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: "smooth" })
        }
    }

    // Skeleton component for loading state
    const CardSkeleton = () => (
        <div className="flex-shrink-0 w-64 animate-pulse">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-3"></div>

            {/* Text skeleton */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
        </div>
    )

    return (
        <div>
            <div className='flex items-center justify-between'>
                <Header text={`Popular homes in ${destination}`} />
                {/* ✅ Safe check for hotels existence */}
                {hotels && hotels.length > 0 && (
                    <div className='flex gap-3'>
                        <button onClick={scrollLeft} className='rotate-180'>
                            <ScrollButton />
                        </button>
                        <button onClick={scrollRight}>
                            <ScrollButton />
                        </button>
                    </div>
                )}
            </div>

            <div className='flex gap-3 overflow-x-auto scrollbar-none h-70' ref={scrollRef}>
                {/* ✅ Safe check for hotels existence */}
                {!hotels || hotels.length === 0 ? (
                    Array.from({ length: 8 }).map((_, idx) => (
                        <CardSkeleton key={idx} />
                    ))
                ) : (
                    hotels.filter(h => h.location.city == destination).map((item, idx) => (
                        <Card
                            key={idx}
                            hotelName={item.title}
                            price={item.price_per_night}
                            image={item.images[0].url}
                            id={item.id}
                            ratings={item.price_per_night}
                        />
                    ))
                )}
            </div>  
        </div>
    )
}