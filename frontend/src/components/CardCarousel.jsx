import { Card } from './utils/Card'
import { Header } from './utils/Header'
import { useContext, useRef } from 'react'
import { ScrollButton } from './utils/ScrollButton'
import { StoreContext } from '../context/StoreContext'

export const CardCarousel = () => {

    const { hotels } = useContext(StoreContext)
    console.log("hotels: ", hotels);

    const scrollRef = useRef(null)
    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -400, behavior: "smooth" })
    }

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 400, behavior: "smooth" })
    }

    return (
        <div>
            <div className='flex items-center justify-between' >
                <Header text="Polular homes in Puri" />
                <div className='flex gap-3' >
                    <button onClick={scrollLeft} className='rotate-180'>
                        <ScrollButton />
                    </button>
                    <button onClick={scrollRight}  >
                        <ScrollButton />
                    </button>
                </div>
            </div>
            <div className='flex gap-3 overflow-x-auto scrollbar-none h-60' ref={scrollRef} >
                {
                    hotels.hotels.map((item, idx) => (
                        <Card cardHeight={170} cardWidth={170} key={idx} hotelName={item.title} price={item.price_per_night} image={item.images[0].url} id={item.id} />
                    ))
                }
            </div>
        </div>
    )
}
