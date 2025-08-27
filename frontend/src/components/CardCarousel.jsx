import { Card } from './utils/Card'
import { Header } from './utils/Header'
import Data from '../Dummy/Dummy.json'
import { useRef } from 'react'
import { ScrollButton } from './utils/ScrollButton'



export const CardCarousel = () => {

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
            <div className='flex gap-3 overflow-x-auto scrollbar-none' ref={scrollRef} >
                {
                    Data.hotels.map((item, idx) => (
                        <Card key={idx} hotelName={item.name} price={item.price} image={item.image[0]} id={item.id} />
                    ))
                }
            </div>
        </div>
    )
}
